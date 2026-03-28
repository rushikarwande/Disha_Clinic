import heroImg from "@/assets/clinic-hero.jpg";
import doctorImg from "@/assets/doctor.jpg";
import { createClinicArt } from "@/lib/siteArt";
import type { SiteData } from "@/types/site";

export const defaultSiteData: SiteData = {
  clinicName: "Disha Homeopathy Clinic",
  shortName: "Disha Clinic",
  doctorName: "Dr. Ashwini Kailas Sonawane",
  doctorDegree: "BHMS",
  heroEyebrow: "Classical Homeopathy in Shevgaon",
  heroTitle: "Calm, trusted care for chronic and everyday health concerns.",
  heroDescription:
    "Personalized homeopathic consultations for families in Shevgaon, with focused support for skin concerns, immunity, child health, digestion, and long-term wellness.",
  heroImage: heroImg,
  aboutTitle: "A warmer, clearer first impression for the clinic.",
  aboutDescription:
    "This website now highlights the clinic with a more polished visual style, stronger calls to action, and content blocks that can be edited without touching the code.",
  aboutDescriptionTwo:
    "The page content, services, testimonials, gallery items, patient results, footer details, contact links, and image references can all be updated from the admin panel route.",
  aboutImage: doctorImg,
  rating: "5.0",
  ratingLabel: "Google Maps rating",
  address: "Near Khandobamandir, Khandobanagar, Shevgaon, Maharashtra 414502, India",
  phone: "+91 98222 71708",
  whatsapp: "+91 98224 22167",
  email: "dr.ashwinisonawane@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/eoztX4xCeukwyFvR9",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13626.548689103627!2d75.2237588!3d19.3493716!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb69dd6f40de9d%3A0x79a0bd69069281b0!2sDisha%20Homeopathy%20Clinic%20Shevgaon!5e1!3m2!1sen!2sin!4v1774510721238!5m2!1sen!2sin",
  morningHours: "11:00 AM - 3:00 PM",
  eveningHours: "6:00 PM - 8:00 PM",
  servicesTitle: "What We Treat?",
  servicesIntro:
    "Every symptom has a story behind it. These eight treatment areas are presented with clearer service descriptions and original matching visuals, with thoughtful care for patients and families in Shevgaon.",
  services: [
    {
      id: "svc-1",
      title: "Hair Loss",
      description:
        "Focused homeopathic support for hair thinning, alopecia patterns, dandruff, and scalp concerns with a treatment plan centered on visible progress and long-term balance.",
      image: createClinicArt("Hair Loss", "#8a5b45", "#34211d", "hair and scalp care"),
    },
    {
      id: "svc-2",
      title: "Skin Disorders",
      description:
        "Personalized care for acne, eczema, psoriasis, vitiligo, skin sensitivity, and recurring irritation with consistent follow-up and gentle symptom management.",
      image: createClinicArt("Skin Disorders", "#d38c67", "#6f3f31", "skin wellness"),
    },
    {
      id: "svc-3",
      title: "Respiratory",
      description:
        "Supportive homeopathic care for asthma, bronchitis, allergic rhinitis, and breathing-related discomfort with a calm, holistic, and steroid-free treatment approach.",
      image: createClinicArt("Respiratory", "#7ea8b0", "#29485a", "clear breathing"),
    },
    {
      id: "svc-4",
      title: "Child Health",
      description:
        "Gentle consultations for immunity, tonsillitis, growth-related concerns, recurrent infections, and day-to-day pediatric wellness with family-friendly follow-up.",
      image: createClinicArt("Child Health", "#91b97b", "#355135", "children care"),
    },
    {
      id: "svc-5",
      title: "Women’s Health",
      description:
        "Structured care for PCOS or PCOD, thyroid-related patterns, menopause concerns, infertility support, and women’s health issues where privacy and continuity matter.",
      image: createClinicArt("Women Health", "#ba6f91", "#5c3050", "women care"),
    },
    {
      id: "svc-6",
      title: "Diabetes Management",
      description:
        "A supportive wellness-led approach for people managing diabetes, focused on better routine control, consistent monitoring, and long-term health stability.",
      image: createClinicArt("Diabetes Care", "#d2a04a", "#6e5524", "balanced sugar care"),
    },
    {
      id: "svc-7",
      title: "Weight Management",
      description:
        "Guided care for healthy weight goals with attention to routine, appetite patterns, metabolism-related concerns, and sustainable lifestyle improvement.",
      image: createClinicArt("Weight Management", "#74a493", "#28463d", "weight balance"),
    },
    {
      id: "svc-8",
      title: "Mental Health",
      description:
        "Supportive homeopathic treatment for stress, anxiety, mood-related concerns, and sleep issues with a personalized and non-addictive care approach.",
      image: createClinicArt("Mental Health", "#7d86b8", "#31385f", "calm mind support"),
    },
  ],
  galleryTitle: "Clinic gallery with a staged reveal.",
  galleryIntro:
    "Six images appear first, and the rest can be opened with the View More button. Every gallery item stays editable from the admin panel.",
  gallery: [
    { id: "gal-1", title: "Clinic Awareness Camp", description: "A community event visual with a welcoming public setup.", image: createClinicArt("Awareness Camp", "#c88b5a", "#3d2b34", "community outreach"), category: "event" },
    { id: "gal-2", title: "Consultation Workshop", description: "An event-focused image showing guided patient interaction and education.", image: createClinicArt("Workshop", "#7da884", "#264f4a", "patient education event"), category: "event" },
    { id: "gal-3", title: "Clinic Milestone Day", description: "A branded celebration-style frame for clinic gatherings and announcements.", image: createClinicArt("Milestone Day", "#d1b267", "#65502e", "clinic celebration"), category: "event" },
    { id: "gal-4", title: "Health Check Event", description: "A public-facing clinic event visual with a calm, organized look.", image: createClinicArt("Health Event", "#98a9cb", "#364770", "health outreach"), category: "event" },
    { id: "gal-5", title: "Skin Care Progress", description: "Patient result showcase styled around visible improvement and steady care.", image: createClinicArt("Skin Progress", "#8eb9b0", "#24413e", "result journey"), category: "patient_result" },
    { id: "gal-6", title: "Wellness Recovery Result", description: "A patient result card focused on confidence, consistency, and care outcomes.", image: createClinicArt("Recovery Result", "#c48aa6", "#513049", "healing progress"), category: "patient_result" },
    { id: "gal-7", title: "Child Health Improvement", description: "A gentle patient-result visual showing positive pediatric progress.", image: createClinicArt("Child Progress", "#b0bc80", "#495227", "pediatric result"), category: "patient_result" },
    { id: "gal-8", title: "Lifestyle Balance Result", description: "A progress-themed image for improved routine, digestion, and wellness.", image: createClinicArt("Lifestyle Result", "#b77b64", "#5c3429", "balanced improvement"), category: "patient_result" },
    { id: "gal-9", title: "Follow-Up Success Story", description: "A patient result visual designed around trust, continuity, and follow-up care.", image: createClinicArt("Success Story", "#7e9dc2", "#213552", "follow-up result"), category: "patient_result" },
  ],
  patientResultsTitle: "Patient Results",
  patientResultsIntro:
    "Explore before-and-after progress with a draggable comparison slider, then move through real case details one patient at a time.",
  patientResults: [
    {
      id: "pr-1",
      patientName: "Priya S.",
      treatmentTitle: "Skin recovery and confidence improvement",
      summary:
        "Gradual improvement in irritation, texture, and comfort after consistent follow-up and individualized homeopathic care.",
      duration: "4 months of guided treatment",
      beforeImage: createClinicArt("Before Care", "#b76a63", "#5b2f36", "visible discomfort"),
      afterImage: createClinicArt("After Care", "#79b29a", "#28594c", "clearer recovery"),
    },
    {
      id: "pr-2",
      patientName: "Rohan K.",
      treatmentTitle: "Hair-fall control and scalp stabilization",
      summary:
        "A structured care journey focused on reducing shedding patterns, improving scalp comfort, and tracking visible progress over time.",
      duration: "5 months of ongoing support",
      beforeImage: createClinicArt("Before Progress", "#8c6b91", "#3d2a4f", "early stage"),
      afterImage: createClinicArt("After Progress", "#7fae86", "#28483f", "steady result"),
    },
    {
      id: "pr-3",
      patientName: "Anaya M.",
      treatmentTitle: "Child wellness and immunity support",
      summary:
        "An improvement-focused case highlighting calmer routines, better resilience, and supportive treatment continuity for the family.",
      duration: "3 months of follow-up visits",
      beforeImage: createClinicArt("Before Wellness", "#c98f5b", "#5e3926", "frequent concerns"),
      afterImage: createClinicArt("After Wellness", "#8bb49b", "#28473f", "stronger routine"),
    },
  ],
  testimonialsTitle: "Patient Testimonials",
  testimonialsIntro:
    "Trusted feedback and strong ratings from patients who value calm consultations, attentive care, and a supportive treatment experience.",
  testimonials: [
    {
      id: "test-1",
      name: "Google Review 1",
      role: "Google Maps review",
      quote: "Replace this starter text with a verified Google review from the clinic's Google Maps listing.",
      rating: 5,
    },
    {
      id: "test-2",
      name: "Google Review 2",
      role: "Google Maps review",
      quote: "Use the admin panel to paste a real patient testimonial and keep the source aligned with Google Maps.",
      rating: 5,
    },
    {
      id: "test-3",
      name: "Google Review 3",
      role: "Google Maps review",
      quote: "This section now supports an auto-sliding testimonial layout with editable names, labels, ratings, and text.",
      rating: 5,
    },
    {
      id: "test-4",
      name: "Google Review 4",
      role: "Google Maps review",
      quote: "Add more reviews in the admin panel and they will automatically appear in the moving slider above the footer.",
      rating: 5,
    },
  ],
  footerBlurb:
    "Disha Homeopathy Clinic serves Shevgaon with a cleaner digital presence, stronger visual hierarchy, and editable website content for day-to-day updates.",
  socials: [
    { id: "soc-1", label: "Facebook", url: "" },
    { id: "soc-2", label: "Instagram", url: "" },
    { id: "soc-3", label: "Telegram", url: "" },
    { id: "soc-4", label: "Twitter", url: "" },
  ],
};







