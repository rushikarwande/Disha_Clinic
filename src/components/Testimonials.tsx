import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const Testimonials = () => {
  const { siteData } = useSiteContent();
  const slides = [...siteData.testimonials, ...siteData.testimonials];

  return (
    <section id="reviews" className="px-4 pb-8 md:px-8 lg:px-16">
      <div className="container-narrow overflow-hidden rounded-[36px] border border-primary/15 bg-[linear-gradient(135deg,#2f5b48_0%,#426f59_52%,#d9b46a_160%)] px-6 py-12 text-primary-foreground md:px-10">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">
              Reviews
            </p>
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">
              {siteData.testimonialsTitle}
            </h2>
            <p className="leading-relaxed text-primary-foreground/72">
              {siteData.testimonialsIntro}
            </p>
          </div>
          <a
            href={siteData.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-primary-foreground/20 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-foreground"
          >
            Open Google Maps
          </a>
        </div>

        <motion.div
          className="flex w-max gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {slides.map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              className="w-[320px] shrink-0 rounded-[28px] border border-white/16 bg-white/14 p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex gap-1 text-accent">
                {Array.from({ length: item.rating }).map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mb-6 min-h-28 text-sm leading-7 text-primary-foreground/82">
                "{item.quote}"
              </p>
              <div>
                <p className="font-semibold text-primary-foreground">{item.name}</p>
                <p className="text-sm text-primary-foreground/60">{item.role}</p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
