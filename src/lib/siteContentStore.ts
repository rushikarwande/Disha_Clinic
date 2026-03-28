import { type AppwriteException, type Models } from "appwrite";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import {
  APPWRITE_BUCKET_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_SITE_DOCUMENT_ID,
  APPWRITE_TABLE_ID,
  ID,
  appwriteAccount,
  appwriteTablesDB,
  appwriteStorage,
  createPublicEditorPermissions,
  createPublicFilePermissions,
  isAppwriteContentConfigured,
  isAppwriteStorageConfigured,
} from "@/lib/appwrite";
import { defaultSiteData } from "@/lib/defaultSiteData";
import type { SiteData } from "@/types/site";

type SiteContentRow = Models.DefaultRow & {
  content: string;
};

const LEGACY_TESTIMONIAL_TITLE = "Patient testimonials above the footer.";
const LEGACY_TESTIMONIAL_INTRO =
  "The slider is linked to the clinic's Google Maps page. Replace the starter review text in the admin panel with verified Google review copy whenever needed.";
const LEGACY_SERVICES_TITLE = "Homeopathy services presented with richer visual cards.";
const LEGACY_SERVICES_INTROS = [
  "Each service block below is editable from the admin panel, including title, description, and image.",
  "Every symptom has a story behind it. These eight treatment areas are presented with clearer service descriptions and original matching visuals for patients and families seeking supportive care.",
];
const COMPRESSED_PREFIX = "__lz__:";

export const applySiteDataMigrations = (siteData: SiteData): SiteData => {
  const merged = {
    ...defaultSiteData,
    ...siteData,
  };

  merged.services = (siteData.services?.length ? siteData.services : defaultSiteData.services)
    .map((savedService, index) => {
      const defaultService = defaultSiteData.services[index];

      if (!defaultService) {
        return {
          ...savedService,
          id: savedService.id || `${ID.unique()}`,
        };
      }

      return {
        ...defaultService,
        ...savedService,
        id: savedService.id || defaultService.id,
      };
    });

  if (merged.servicesTitle === LEGACY_SERVICES_TITLE) {
    merged.servicesTitle = defaultSiteData.servicesTitle;
  }

  if (LEGACY_SERVICES_INTROS.includes(merged.servicesIntro)) {
    merged.servicesIntro = defaultSiteData.servicesIntro;
  }

  merged.gallery = merged.gallery.map((item, index) => ({
    ...item,
    category:
      item.category === "event" || item.category === "patient_result"
        ? item.category
        : index < 4
          ? "event"
          : "patient_result",
  }));

  if (merged.testimonialsTitle === LEGACY_TESTIMONIAL_TITLE) {
    merged.testimonialsTitle = defaultSiteData.testimonialsTitle;
  }

  if (merged.testimonialsIntro === LEGACY_TESTIMONIAL_INTRO) {
    merged.testimonialsIntro = defaultSiteData.testimonialsIntro;
  }

  return merged;
};

const serializeSiteData = (siteData: SiteData) => {
  const json = JSON.stringify(siteData);
  return `${COMPRESSED_PREFIX}${compressToUTF16(json)}`;
};

const deserializeSiteData = (content: string) => {
  const normalizedContent = content.startsWith(COMPRESSED_PREFIX)
    ? decompressFromUTF16(content.slice(COMPRESSED_PREFIX.length)) ?? "{}"
    : content;

  return applySiteDataMigrations(JSON.parse(normalizedContent) as SiteData);
};

export const loadSiteDataFromAppwrite = async () => {
  if (!isAppwriteContentConfigured) {
    return defaultSiteData;
  }

  try {
    const row = await appwriteTablesDB.getRow<SiteContentRow>({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID,
      rowId: APPWRITE_SITE_DOCUMENT_ID,
    });

    return deserializeSiteData(row.content);
  } catch (error) {
    const appwriteError = error as AppwriteException;
    if (appwriteError?.code === 404) {
      return defaultSiteData;
    }
    throw error;
  }
};

export const saveSiteDataToAppwrite = async (siteData: SiteData) => {
  if (!isAppwriteContentConfigured) {
    return siteData;
  }

  const payload = serializeSiteData(siteData);

  await appwriteTablesDB.upsertRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID,
    rowId: APPWRITE_SITE_DOCUMENT_ID,
    permissions: createPublicEditorPermissions(),
    data: {
      content: payload,
    },
  });

  return siteData;
};

export const uploadSiteImageToAppwrite = async (file: File) => {
  if (!isAppwriteStorageConfigured) {
    throw new Error("Appwrite storage is not configured.");
  }

  const currentUser = await appwriteAccount.get();

  const uploadedFile = await appwriteStorage.createFile({
    bucketId: APPWRITE_BUCKET_ID,
    fileId: ID.unique(),
    file,
    permissions: createPublicFilePermissions(currentUser.$id),
  });

  return appwriteStorage.getFileView({
    bucketId: APPWRITE_BUCKET_ID,
    fileId: uploadedFile.$id,
  });
};

