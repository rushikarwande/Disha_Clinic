import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const Services = () => {
  const { siteData } = useSiteContent();

  return (
    <section id="services" className="section-padding bg-card">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Services
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
            {siteData.servicesTitle}
          </h2>
          <p className="mx-auto max-w-3xl whitespace-pre-line text-muted-foreground md:text-lg">
            {siteData.servicesIntro}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {siteData.services.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group overflow-hidden rounded-[30px] border border-border bg-background transition-all duration-300 hover:-translate-y-2 hover:border-primary/25 hover:shadow-[0_28px_70px_-34px_rgba(26,61,44,0.45)]"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,17,14,0.02)_0%,rgba(9,17,14,0.54)_100%)] opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-foreground shadow-[0_14px_24px_-18px_rgba(12,20,18,0.35)]">
                  Treat {index + 1}
                </div>
              </div>
              <div className="space-y-4 p-6 transition-colors duration-300 group-hover:bg-primary/[0.03]">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold leading-tight text-foreground">
                    {service.title}
                  </h3>
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

