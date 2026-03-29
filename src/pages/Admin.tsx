import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AdminImageField from "@/components/admin/AdminImageField";
import { useAuth } from "@/context/AuthContext";
import { useSiteContent } from "@/context/SiteContentContext";
import { createClinicArt } from "@/lib/siteArt";
import { defaultSiteData } from "@/lib/defaultSiteData";
import type {
  GalleryItem,
  PatientResultItem,
  ServiceItem,
  SocialLink,
  TestimonialItem,
} from "@/types/site";
import type { SiteData } from "@/types/site";

const inputClassName =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

const sectionClassName =
  "rounded-[28px] border border-border bg-card/95 p-5 shadow-[0_24px_70px_-48px_rgba(26,61,44,0.45)] backdrop-blur-sm md:p-6";

const addButtonClassName =
  "inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_18px_34px_-20px_rgba(36,93,74,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-primary/90 hover:shadow-[0_24px_42px_-20px_rgba(36,93,74,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 sm:w-auto";

const removeButtonClassName =
  "rounded-full border border-destructive/20 px-4 py-2 text-sm font-semibold text-destructive transition-all duration-300 hover:-translate-y-0.5 hover:border-destructive hover:bg-destructive hover:text-destructive-foreground";

const itemCardClassName =
  "grid gap-4 rounded-[24px] border border-border/90 bg-background/75 p-4 shadow-[0_20px_50px_-40px_rgba(20,36,30,0.45)] md:p-5 md:grid-cols-2";

const highlightedCardClassName =
  "border-primary/45 shadow-[0_28px_64px_-38px_rgba(36,93,74,0.55)] ring-2 ring-primary/12";

const LOCAL_SITE_DATA_KEY = "disha-clinic-site-data-v1";

const createUniqueId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const Admin = () => {
  const {
    siteData,
    saveSiteData,
    uploadImage,
    isSavingContent,
    syncError,
    isRemoteContentEnabled,
    isRemoteStorageEnabled,
  } = useSiteContent();
  const { logout } = useAuth();
  const [draftData, setDraftData] = useState<SiteData>(siteData);
  const [saveMessage, setSaveMessage] = useState("");
  const [recentlyAddedItemId, setRecentlyAddedItemId] = useState<string | null>(null);
  const pendingScrollTargetId = useRef<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setDraftData(siteData);
  }, [siteData]);

  useEffect(() => {
    if (!pendingScrollTargetId.current) {
      return;
    }

    const nextFrame = window.requestAnimationFrame(() => {
      const element = itemRefs.current[pendingScrollTargetId.current ?? ""];
      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      element.focus({ preventScroll: true });
      pendingScrollTargetId.current = null;
    });

    return () => window.cancelAnimationFrame(nextFrame);
  }, [draftData]);

  useEffect(() => {
    if (!recentlyAddedItemId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRecentlyAddedItemId(null);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [recentlyAddedItemId]);

  const updateField = <K extends keyof SiteData>(key: K, value: SiteData[K]) => {
    setDraftData((prev) => ({ ...prev, [key]: value }));
  };

  const updateArrayItem = <
    T extends ServiceItem | GalleryItem | PatientResultItem | TestimonialItem | SocialLink,
  >(
    key: "services" | "gallery" | "patientResults" | "testimonials" | "socials",
    id: string,
    field: keyof T,
    value: string | number,
  ) => {
    setDraftData((prev) => ({
      ...prev,
      [key]: prev[key].map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addService = () => {
    const nextService: ServiceItem = {
      id: createUniqueId("svc"),
      title: "New service",
      description: "Add a short description for this service.",
      image: createClinicArt("New Service", "#7a9f91", "#27463d", "clinic service"),
    };

    pendingScrollTargetId.current = nextService.id;
    setRecentlyAddedItemId(nextService.id);
    setDraftData((prev) => ({
      ...prev,
      services: [...prev.services, nextService],
    }));
  };

  const addGalleryItem = () => {
    const nextGalleryItem: GalleryItem = {
      id: createUniqueId("gal"),
      title: "New gallery item",
      description: "Add a short description for this gallery item.",
      image: createClinicArt("Gallery Item", "#b08f68", "#4d3827", "clinic gallery"),
      category: "event",
    };

    pendingScrollTargetId.current = nextGalleryItem.id;
    setRecentlyAddedItemId(nextGalleryItem.id);
    setDraftData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, nextGalleryItem],
    }));
  };

  const addPatientResult = () => {
    const nextPatientResult: PatientResultItem = {
      id: createUniqueId("pr"),
      patientName: "New patient",
      treatmentTitle: "Treatment title",
      summary: "Add the patient case summary here.",
      duration: "Treatment duration",
      beforeImage: createClinicArt("Before Result", "#b76a63", "#5b2f36", "before treatment"),
      afterImage: createClinicArt("After Result", "#79b29a", "#28594c", "after treatment"),
    };

    pendingScrollTargetId.current = nextPatientResult.id;
    setRecentlyAddedItemId(nextPatientResult.id);
    setDraftData((prev) => ({
      ...prev,
      patientResults: [...prev.patientResults, nextPatientResult],
    }));
  };

  const removeArrayItem = (
    key: "services" | "gallery" | "patientResults",
    id: string,
  ) => {
    setDraftData((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item.id !== id),
    }));
  };

  const uploadSingleImage = async (
    field: "heroImage" | "aboutImage",
    file: File,
  ) => {
    const dataUrl = await uploadImage(file);
    setDraftData((prev) => ({
      ...prev,
      [field]: dataUrl,
    }));
    return dataUrl;
  };

  const persistImageChange = async (nextData: SiteData) => {
    setDraftData(nextData);

    try {
      await saveSiteData(nextData);
      setSaveMessage("Image saved.");
      toast.success("Image saved.");
      window.setTimeout(() => {
        setSaveMessage("");
      }, 2500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save image.";
      setSaveMessage("");
      toast.error(message);
      throw error;
    }
  };

  const uploadCollectionImage = async (
    key: "services" | "gallery",
    id: string,
    file: File,
  ) => {
    const dataUrl = await uploadImage(file);
    const nextData = {
      ...draftData,
      [key]: draftData[key].map((item) =>
        item.id === id ? { ...item, image: dataUrl } : item,
      ),
    } as SiteData;
    await persistImageChange(nextData);
    return dataUrl;
  };

  const uploadPatientResultImage = async (
    id: string,
    field: "beforeImage" | "afterImage",
    file: File,
  ) => {
    const dataUrl = await uploadImage(file);
    const nextData = {
      ...draftData,
      patientResults: draftData.patientResults.map((item) =>
        item.id === id ? { ...item, [field]: dataUrl } : item,
      ),
    };
    await persistImageChange(nextData);
    return dataUrl;
  };

  const handleSaveChanges = async () => {
    try {
      await saveSiteData(draftData);
      setSaveMessage("Changes saved.");
      toast.success("Changes saved.");
      window.setTimeout(() => {
        setSaveMessage("");
      }, 2500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save changes.";
      setSaveMessage("");
      toast.error(message);
    }
  };

  const handleResetDraft = () => {
    setDraftData(defaultSiteData);
    setSaveMessage("");
  };

  const handleLoadBrowserBackup = () => {
    try {
      const raw = window.localStorage.getItem(LOCAL_SITE_DATA_KEY);
      if (!raw) {
        toast.error("No local browser backup was found on this device.");
        return;
      }

      const parsed = JSON.parse(raw) as SiteData;
      setDraftData({
        ...defaultSiteData,
        ...parsed,
      });
      toast.success("Loaded localhost browser content into the admin draft.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load browser backup.";
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out.");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f7f2e5_0%,#f0eee8_36%,#e8ece7_100%)] px-3 py-6 sm:px-4 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
        <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#20392f_0%,#12241d_100%)] px-5 py-6 text-primary-foreground shadow-[0_30px_90px_-40px_rgba(15,33,27,0.85)] sm:px-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground/60">
              Admin Panel
            </p>
            <h1 className="text-3xl font-bold md:text-5xl">Edit all website content here.</h1>
            <p className="mt-4 text-primary-foreground/72">
              Text, links, services, gallery, patient results, testimonials, footer details, and image settings are editable from this page.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-primary-foreground/20 px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground hover:text-foreground"
            >
              Back to Website
            </Link>
            <button
              type="button"
              onClick={handleResetDraft}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center justify-center rounded-full border border-primary-foreground/20 px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground hover:text-foreground sm:col-span-2 lg:col-span-1"
            >
              Logout
            </button>
          </div>
        </div>
        </div>

        <section className={sectionClassName}>
          <div className="mb-5 rounded-[24px] border border-primary/15 bg-primary/5 p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-xl font-bold text-foreground">Sync Localhost To Live</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  If your localhost site shows older browser-only images or content, load that browser backup here and then click Save Changes to push the same data to the live website.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadBrowserBackup}
                className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-background px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
              >
                Load Local Browser Backup
              </button>
            </div>
          </div>
          <h2 className="mb-5 text-2xl font-bold">Clinic Basics</h2>
          <p className="mb-5 text-sm leading-7 text-muted-foreground">
            {isRemoteContentEnabled
              ? "Content is connected to Appwrite Database, so saved changes will go live for all users."
              : "Appwrite Database is not configured yet, so content still falls back to local browser storage."}
            {" "}
            {isRemoteStorageEnabled
              ? "Image uploads are stored in Appwrite Storage."
              : "Image uploads currently fall back to local browser data URLs."}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">Clinic name</span>
              <input className={inputClassName} value={draftData.clinicName} onChange={(event) => updateField("clinicName", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Short name</span>
              <input className={inputClassName} value={draftData.shortName} onChange={(event) => updateField("shortName", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Doctor name</span>
              <input className={inputClassName} value={draftData.doctorName} onChange={(event) => updateField("doctorName", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Doctor degree</span>
              <input className={inputClassName} value={draftData.doctorDegree} onChange={(event) => updateField("doctorDegree", event.target.value)} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Address</span>
              <textarea className={inputClassName} rows={3} value={draftData.address} onChange={(event) => updateField("address", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Phone</span>
              <input className={inputClassName} value={draftData.phone} onChange={(event) => updateField("phone", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">WhatsApp</span>
              <input className={inputClassName} value={draftData.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Email</span>
              <input className={inputClassName} value={draftData.email} onChange={(event) => updateField("email", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Google Maps link</span>
              <input className={inputClassName} value={draftData.mapsUrl} onChange={(event) => updateField("mapsUrl", event.target.value)} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Google Maps embed URL</span>
              <textarea className={inputClassName} rows={3} value={draftData.mapsEmbedUrl} onChange={(event) => updateField("mapsEmbedUrl", event.target.value)} />
            </label>
          </div>
        </section>

        <section className={sectionClassName}>
          <h2 className="mb-5 text-2xl font-bold">Hero and About</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Hero eyebrow</span>
              <input className={inputClassName} value={draftData.heroEyebrow} onChange={(event) => updateField("heroEyebrow", event.target.value)} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Hero title</span>
              <textarea className={inputClassName} rows={3} value={draftData.heroTitle} onChange={(event) => updateField("heroTitle", event.target.value)} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Hero description</span>
              <textarea className={inputClassName} rows={4} value={draftData.heroDescription} onChange={(event) => updateField("heroDescription", event.target.value)} />
            </label>
            <div className="md:col-span-2">
              <AdminImageField
                label="Hero image"
                image={draftData.heroImage}
                aspectRatio={1.18}
                previewHeightClassName="h-48"
                onUpload={(file) => uploadSingleImage("heroImage", file)}
                onChange={(value) => updateField("heroImage", value)}
              />
            </div>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">About title</span>
              <input className={inputClassName} value={draftData.aboutTitle} onChange={(event) => updateField("aboutTitle", event.target.value)} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">About paragraph 1</span>
              <textarea className={inputClassName} rows={4} value={draftData.aboutDescription} onChange={(event) => updateField("aboutDescription", event.target.value)} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">About paragraph 2</span>
              <textarea className={inputClassName} rows={4} value={draftData.aboutDescriptionTwo} onChange={(event) => updateField("aboutDescriptionTwo", event.target.value)} />
            </label>
            <div className="md:col-span-2">
              <AdminImageField
                label="About image"
                image={draftData.aboutImage}
                aspectRatio={0.95}
                previewHeightClassName="h-56"
                onUpload={(file) => uploadSingleImage("aboutImage", file)}
                onChange={(value) => updateField("aboutImage", value)}
              />
            </div>
          </div>
        </section>

        <section className={sectionClassName}>
          <h2 className="mb-5 text-2xl font-bold">Hours and Footer</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium">Morning hours</span>
              <input className={inputClassName} value={draftData.morningHours} onChange={(event) => updateField("morningHours", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Evening hours</span>
              <input className={inputClassName} value={draftData.eveningHours} onChange={(event) => updateField("eveningHours", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Rating</span>
              <input className={inputClassName} value={draftData.rating} onChange={(event) => updateField("rating", event.target.value)} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Rating label</span>
              <input className={inputClassName} value={draftData.ratingLabel} onChange={(event) => updateField("ratingLabel", event.target.value)} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium">Footer blurb</span>
              <textarea className={inputClassName} rows={4} value={draftData.footerBlurb} onChange={(event) => updateField("footerBlurb", event.target.value)} />
            </label>
          </div>
        </section>

        <section className={sectionClassName}>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold">Services</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Add new services, then the page will jump directly to the new card so the client can edit it immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={addService}
              className={addButtonClassName}
            >
              Add Service
            </button>
          </div>
          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Services section title</span>
              <input className={inputClassName} value={draftData.servicesTitle} onChange={(event) => updateField("servicesTitle", event.target.value)} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Services section intro</span>
              <textarea className={inputClassName} rows={3} value={draftData.servicesIntro} onChange={(event) => updateField("servicesIntro", event.target.value)} />
            </label>
            {draftData.services.map((service) => (
              <div
                key={service.id}
                ref={(element) => {
                  itemRefs.current[service.id] = element;
                }}
                tabIndex={-1}
                className={`${itemCardClassName} ${recentlyAddedItemId === service.id ? highlightedCardClassName : ""}`}
              >
                <div className="flex justify-end md:col-span-2">
                  <button
                    type="button"
                    onClick={() => removeArrayItem("services", service.id)}
                    className={removeButtonClassName}
                  >
                    Remove Service
                  </button>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Service title</span>
                  <input className={inputClassName} value={service.title} onChange={(event) => updateArrayItem<ServiceItem>("services", service.id, "title", event.target.value)} />
                </label>
                <div className="md:row-span-2">
                  <AdminImageField
                    label="Service image"
                    image={service.image}
                    aspectRatio={1.32}
                    previewHeightClassName="h-44"
                    onUpload={(file) => uploadCollectionImage("services", service.id, file)}
                    onChange={(value) => updateArrayItem<ServiceItem>("services", service.id, "image", value)}
                  />
                </div>
                <label className="space-y-2 md:col-span-1">
                  <span className="text-sm font-medium">Description</span>
                  <textarea className={inputClassName} rows={4} value={service.description} onChange={(event) => updateArrayItem<ServiceItem>("services", service.id, "description", event.target.value)} />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClassName}>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold">Gallery</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Create new gallery cards with a smoother edit flow for phone and desktop users.
              </p>
            </div>
            <button
              type="button"
              onClick={addGalleryItem}
              className={addButtonClassName}
            >
              Add Gallery Item
            </button>
          </div>
          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Gallery section title</span>
              <input className={inputClassName} value={draftData.galleryTitle} onChange={(event) => updateField("galleryTitle", event.target.value)} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Gallery intro</span>
              <textarea className={inputClassName} rows={3} value={draftData.galleryIntro} onChange={(event) => updateField("galleryIntro", event.target.value)} />
            </label>
            {draftData.gallery.map((item) => (
              <div
                key={item.id}
                ref={(element) => {
                  itemRefs.current[item.id] = element;
                }}
                tabIndex={-1}
                className={`${itemCardClassName} ${recentlyAddedItemId === item.id ? highlightedCardClassName : ""}`}
              >
                <div className="flex justify-end md:col-span-2">
                  <button
                    type="button"
                    onClick={() => removeArrayItem("gallery", item.id)}
                    className={removeButtonClassName}
                  >
                    Remove Gallery Item
                  </button>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Gallery title</span>
                  <input className={inputClassName} value={item.title} onChange={(event) => updateArrayItem<GalleryItem>("gallery", item.id, "title", event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    className={inputClassName}
                    value={item.category}
                    onChange={(event) => updateArrayItem<GalleryItem>("gallery", item.id, "category", event.target.value)}
                  >
                    <option value="event">Event</option>
                    <option value="patient_result">Patient Result</option>
                  </select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium">Description</span>
                  <textarea className={inputClassName} rows={3} value={item.description} onChange={(event) => updateArrayItem<GalleryItem>("gallery", item.id, "description", event.target.value)} />
                </label>
                <div className="md:col-span-2">
                  <AdminImageField
                    label="Gallery image"
                    image={item.image}
                    preserveOriginalRatio
                    onUpload={(file) => uploadCollectionImage("gallery", item.id, file)}
                    onChange={(value) => updateArrayItem<GalleryItem>("gallery", item.id, "image", value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClassName}>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold">Patient Results</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Add new before-and-after cases and jump straight to the fresh editor card below.
              </p>
            </div>
            <button
              type="button"
              onClick={addPatientResult}
              className={addButtonClassName}
            >
              Add Patient Result
            </button>
          </div>
          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Patient results section title</span>
              <input className={inputClassName} value={draftData.patientResultsTitle} onChange={(event) => updateField("patientResultsTitle", event.target.value)} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Patient results intro</span>
              <textarea className={inputClassName} rows={3} value={draftData.patientResultsIntro} onChange={(event) => updateField("patientResultsIntro", event.target.value)} />
            </label>
            {draftData.patientResults.map((item) => (
              <div
                key={item.id}
                ref={(element) => {
                  itemRefs.current[item.id] = element;
                }}
                tabIndex={-1}
                className={`space-y-4 rounded-[24px] border border-border/90 bg-background/75 p-4 shadow-[0_20px_50px_-40px_rgba(20,36,30,0.45)] md:p-5 ${recentlyAddedItemId === item.id ? highlightedCardClassName : ""}`}
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeArrayItem("patientResults", item.id)}
                    className={removeButtonClassName}
                  >
                    Remove Patient Result
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium">Patient name</span>
                    <input className={inputClassName} value={item.patientName} onChange={(event) => updateArrayItem<PatientResultItem>("patientResults", item.id, "patientName", event.target.value)} />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium">Treatment duration</span>
                    <input className={inputClassName} value={item.duration} onChange={(event) => updateArrayItem<PatientResultItem>("patientResults", item.id, "duration", event.target.value)} />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium">Treatment title</span>
                    <input className={inputClassName} value={item.treatmentTitle} onChange={(event) => updateArrayItem<PatientResultItem>("patientResults", item.id, "treatmentTitle", event.target.value)} />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium">Case description</span>
                    <textarea className={inputClassName} rows={4} value={item.summary} onChange={(event) => updateArrayItem<PatientResultItem>("patientResults", item.id, "summary", event.target.value)} />
                  </label>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <AdminImageField
                    label="Before image"
                    image={item.beforeImage}
                    aspectRatio={1.6}
                    previewHeightClassName="h-44"
                    onUpload={(file) => uploadPatientResultImage(item.id, "beforeImage", file)}
                    onChange={(value) => updateArrayItem<PatientResultItem>("patientResults", item.id, "beforeImage", value)}
                  />
                  <AdminImageField
                    label="After image"
                    image={item.afterImage}
                    aspectRatio={1.6}
                    previewHeightClassName="h-44"
                    onUpload={(file) => uploadPatientResultImage(item.id, "afterImage", file)}
                    onChange={(value) => updateArrayItem<PatientResultItem>("patientResults", item.id, "afterImage", value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClassName}>
          <h2 className="mb-5 text-2xl font-bold">Testimonials and Social Links</h2>
          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Testimonials section title</span>
              <input className={inputClassName} value={draftData.testimonialsTitle} onChange={(event) => updateField("testimonialsTitle", event.target.value)} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Testimonials intro</span>
              <textarea className={inputClassName} rows={3} value={draftData.testimonialsIntro} onChange={(event) => updateField("testimonialsIntro", event.target.value)} />
            </label>
            {draftData.testimonials.map((item) => (
              <div key={item.id} className="grid gap-4 rounded-[24px] border border-border p-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Reviewer name</span>
                  <input className={inputClassName} value={item.name} onChange={(event) => updateArrayItem<TestimonialItem>("testimonials", item.id, "name", event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Reviewer label</span>
                  <input className={inputClassName} value={item.role} onChange={(event) => updateArrayItem<TestimonialItem>("testimonials", item.id, "role", event.target.value)} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Rating</span>
                  <input className={inputClassName} type="number" min="1" max="5" value={item.rating} onChange={(event) => updateArrayItem<TestimonialItem>("testimonials", item.id, "rating", Number(event.target.value))} />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium">Quote</span>
                  <textarea className={inputClassName} rows={4} value={item.quote} onChange={(event) => updateArrayItem<TestimonialItem>("testimonials", item.id, "quote", event.target.value)} />
                </label>
              </div>
            ))}
            <div className="grid gap-4 md:grid-cols-2">
              {draftData.socials.map((item) => (
                <div key={item.id} className="grid gap-4 rounded-[24px] border border-border p-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium">Social label</span>
                    <input className={inputClassName} value={item.label} onChange={(event) => updateArrayItem<SocialLink>("socials", item.id, "label", event.target.value)} />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium">Social URL</span>
                    <input className={inputClassName} value={item.url} onChange={(event) => updateArrayItem<SocialLink>("socials", item.id, "url", event.target.value)} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="sticky bottom-4 z-20 rounded-[28px] border border-primary/15 bg-card/95 p-4 shadow-[0_24px_60px_-32px_rgba(26,61,44,0.45)] backdrop-blur md:p-5">
          {saveMessage ? (
            <div className="mb-4 rounded-[20px] border border-primary/20 bg-primary/8 px-4 py-3 text-sm font-medium text-primary">
              {saveMessage}
            </div>
          ) : null}

          {syncError ? (
            <div className="mb-4 rounded-[20px] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {syncError}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Review all changes, then save to update the live website.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
              >
                Back to Site
              </Link>
              <button
                type="button"
                onClick={() => void handleSaveChanges()}
                disabled={isSavingContent}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingContent ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
