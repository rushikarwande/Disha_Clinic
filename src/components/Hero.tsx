import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const Hero = () => {
  const { siteData } = useSiteContent();

  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-28 md:px-8 md:pt-36 lg:px-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(177,197,131,0.28),transparent_30%),radial-gradient(circle_at_top_right,rgba(104,142,118,0.18),transparent_32%),linear-gradient(180deg,#f7f4eb_0%,#eef3eb_100%)]" />
      <div className="container-narrow grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary shadow-sm">
            {siteData.heroEyebrow}
          </div>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] text-foreground md:text-6xl lg:text-7xl">
            {siteData.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            {siteData.heroDescription}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={`tel:${siteData.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4" />
              Call Clinic
            </a>
            <a
              href={`https://wa.me/${siteData.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-white/80 px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={siteData.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-2 py-3 text-sm font-semibold text-primary"
            >
              Get Directions
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[26px] border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">Google Rating</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{siteData.rating}</p>
            </div>
            <div className="rounded-[26px] border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">Morning Hours</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{siteData.morningHours}</p>
            </div>
            <div className="rounded-[26px] border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">Evening Hours</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{siteData.eveningHours}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -left-8 top-10 hidden h-32 w-32 rounded-full bg-accent/25 blur-3xl md:block" />
          <div className="absolute -bottom-8 right-4 hidden h-40 w-40 rounded-full bg-primary/15 blur-3xl md:block" />
          <div className="relative overflow-hidden rounded-[36px] border border-white/60 bg-card p-4 shadow-[0_30px_80px_-40px_rgba(26,61,44,0.45)]">
            <img
              src={siteData.heroImage}
              alt={siteData.clinicName}
              className="h-[540px] w-full rounded-[28px] object-cover"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,27,22,0.5)_0%,rgba(13,27,22,0.58)_100%)] p-5 text-primary-foreground shadow-[0_24px_60px_-36px_rgba(7,16,13,0.55)] backdrop-blur-md md:inset-x-10 md:bottom-10 md:p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary-foreground/84">
                <MapPin className="h-3.5 w-3.5" />
                Shevgaon
              </div>
              <p className="text-2xl font-semibold">{siteData.clinicName}</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-primary-foreground/92">
                {siteData.address}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
