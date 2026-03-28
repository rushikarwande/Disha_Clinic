import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSiteContent } from "@/context/SiteContentContext";

const INITIAL_VISIBLE_COUNT = 6;
const galleryFilters = [
  { label: "All", value: "all" },
  { label: "Event", value: "event" },
  { label: "Patient Result", value: "patient_result" },
] as const;

const Gallery = () => {
  const { siteData } = useSiteContent();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [activeFilter, setActiveFilter] = useState<"all" | "event" | "patient_result">("all");

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") {
      return siteData.gallery;
    }

    return siteData.gallery.filter((item) => item.category === activeFilter);
  }, [activeFilter, siteData.gallery]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeFilter]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container-narrow">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Gallery
            </p>
            <h2 className="text-3xl font-bold text-foreground md:text-5xl">
              {siteData.galleryTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {siteData.galleryIntro}
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-primary/20 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Book a Visit
          </a>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {galleryFilters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_16px_30px_-18px_rgba(36,93,74,0.7)]"
                    : "border border-primary/15 bg-card text-foreground hover:border-primary/30 hover:bg-primary/6"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="columns-1 gap-6 sm:columns-2 xl:columns-3">
          {visibleItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="group mb-6 break-inside-avoid overflow-hidden rounded-[28px] border border-border bg-card"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className="flex justify-center bg-secondary/30 p-3 pb-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-auto max-h-[900px] w-full rounded-[20px] object-contain"
                  loading="lazy"
                />
              </div>
              <div className="space-y-3 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                    {item.category === "event" ? "Event" : "Patient Result"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {hasMore ? (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount(filteredItems.length)}
              className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              View More
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Gallery;
