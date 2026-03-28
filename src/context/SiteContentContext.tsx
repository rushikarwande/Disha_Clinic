import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { defaultSiteData } from "@/lib/defaultSiteData";
import {
  loadSiteDataFromAppwrite,
  saveSiteDataToAppwrite,
  uploadSiteImageToAppwrite,
} from "@/lib/siteContentStore";
import { isAppwriteContentConfigured, isAppwriteStorageConfigured } from "@/lib/appwrite";
import type { SiteData } from "@/types/site";

const STORAGE_KEY = "disha-clinic-site-data-v1";

type SiteContentContextValue = {
  siteData: SiteData;
  setSiteData: Dispatch<SetStateAction<SiteData>>;
  saveSiteData: (siteData: SiteData) => Promise<void>;
  resetSiteData: () => void;
  uploadImage: (file: File) => Promise<string>;
  isLoadingContent: boolean;
  isSavingContent: boolean;
  syncError: string;
  isRemoteContentEnabled: boolean;
  isRemoteStorageEnabled: boolean;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      setIsLoadingContent(true);
      setSyncError("");

      try {
        if (isAppwriteContentConfigured) {
          const remoteSiteData = await loadSiteDataFromAppwrite();
          startTransition(() => {
            setSiteData(remoteSiteData);
          });
        } else {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as SiteData;
            startTransition(() => {
              setSiteData({
                ...defaultSiteData,
                ...parsed,
              });
            });
          }
        }
      } catch (error) {
        console.error("Failed to load site data", error);
        setSyncError(error instanceof Error ? error.message : "Failed to load site content.");
      } finally {
        setIsLoadingContent(false);
      }
    };

    void loadContent();
  }, []);

  useEffect(() => {
    if (isAppwriteContentConfigured || isLoadingContent) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
  }, [isLoadingContent, siteData]);

  const saveSiteData = async (nextSiteData: SiteData) => {
    setIsSavingContent(true);
    setSyncError("");

    try {
      if (isAppwriteContentConfigured) {
        const savedSiteData = await saveSiteDataToAppwrite(nextSiteData);
        setSiteData(savedSiteData);
      } else {
        setSiteData(nextSiteData);
      }
    } catch (error) {
      console.error("Failed to save site data", error);
      const message = error instanceof Error ? error.message : "Failed to save site content.";
      setSyncError(message);
      throw error;
    } finally {
      setIsSavingContent(false);
    }
  };

  const resetSiteData = () => {
    startTransition(() => {
      setSiteData(defaultSiteData);
    });
  };

  const uploadImage = async (file: File) => {
    try {
      if (isAppwriteStorageConfigured) {
        return await uploadSiteImageToAppwrite(file);
      }
      return await readFileAsDataUrl(file);
    } catch (error) {
      console.error("Failed to upload image", error);
      const message = error instanceof Error ? error.message : "Failed to upload image.";
      setSyncError(message);
      throw error;
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        siteData,
        setSiteData,
        saveSiteData,
        resetSiteData,
        uploadImage,
        isLoadingContent,
        isSavingContent,
        syncError,
        isRemoteContentEnabled: isAppwriteContentConfigured,
        isRemoteStorageEnabled: isAppwriteStorageConfigured,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return context;
};
