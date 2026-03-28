export type SocialLink = {
  id: string;
  label: string;
  url: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "event" | "patient_result";
};

export type PatientResultItem = {
  id: string;
  patientName: string;
  treatmentTitle: string;
  summary: string;
  duration: string;
  beforeImage: string;
  afterImage: string;
};

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export type SiteData = {
  clinicName: string;
  shortName: string;
  doctorName: string;
  doctorDegree: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutDescriptionTwo: string;
  aboutImage: string;
  rating: string;
  ratingLabel: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  morningHours: string;
  eveningHours: string;
  servicesTitle: string;
  servicesIntro: string;
  services: ServiceItem[];
  galleryTitle: string;
  galleryIntro: string;
  gallery: GalleryItem[];
  patientResultsTitle: string;
  patientResultsIntro: string;
  patientResults: PatientResultItem[];
  testimonialsTitle: string;
  testimonialsIntro: string;
  testimonials: TestimonialItem[];
  footerBlurb: string;
  socials: SocialLink[];
};
