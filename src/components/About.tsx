import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const About = () => {
  const { siteData } = useSiteContent();

  return (
    <section id="about" className="section-padding bg-[linear-gradient(180deg,#eef3eb_0%,#fbfaf6_100%)]">
      <div className="container-narrow">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative"
          >
            <div className="absolute -left-6 -top-6 hidden h-28 w-28 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-primary/20 md:block" />
            <div
              className="overflow-hidden rounded-[32px] border border-border/80 bg-card transition-all duration-300 group-hover:border-primary/35 group-hover:shadow-[0_24px_60px_-38px_rgba(36,93,74,0.35)]"
              style={{ boxShadow: "var(--card-shadow-hover)" }}
            >
              <img
                src={siteData.aboutImage}
                alt={siteData.clinicName}
                loading="lazy"
                className="aspect-[0.95] w-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">About</p>
            <div className="mb-4 inline-flex flex-wrap items-center gap-3 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm text-foreground">
              <span className="font-semibold">{siteData.doctorName}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              <span className="text-muted-foreground">{siteData.doctorDegree}</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-5xl">
              {siteData.aboutTitle}
            </h2>
            <p className="mb-4 leading-8 text-muted-foreground">
              {siteData.aboutDescription}
            </p>
            <p className="mb-8 leading-8 text-muted-foreground">
              {siteData.aboutDescriptionTwo}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group rounded-[24px] border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/25 hover:bg-primary/[0.03]" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold text-foreground">Better presentation</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The page now feels more premium, less template-like, and more clinic-specific.
                </p>
              </div>
              <div className="group rounded-[24px] border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/25 hover:bg-primary/[0.03]" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold text-foreground">Editable content</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Core text, images, gallery items, and links can be changed from the admin panel.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
