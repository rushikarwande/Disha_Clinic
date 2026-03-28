import { motion } from "framer-motion";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const Contact = () => {
  const { siteData } = useSiteContent();

  return (
    <section id="contact" className="section-padding bg-[linear-gradient(180deg,#fcfbf8_0%,#eff3ed_100%)]">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Contact
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            Visit the clinic or connect online.
          </h2>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div
              id="hours"
              className="group rounded-[28px] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary/25 hover:bg-primary/[0.03]"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Clinic Hours</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Morning</span>
                  <span className="font-medium text-foreground">{siteData.morningHours}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Evening</span>
                  <span className="font-medium text-foreground">{siteData.eveningHours}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <div className="group rounded-[28px] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary/25 hover:bg-primary/[0.03]" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Location</h3>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{siteData.address}</p>
              </div>

              <div className="group rounded-[28px] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary/25 hover:bg-primary/[0.03]" style={{ boxShadow: "var(--card-shadow)" }}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Phone className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Connect</h3>
                </div>
                <div className="space-y-3">
                  <a
                    href={`tel:${siteData.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-4 w-4" /> {siteData.phone}
                  </a>
                  <a
                    href={`https://wa.me/${siteData.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" /> {siteData.whatsapp}
                  </a>
                  <a
                    href={`mailto:${siteData.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4" /> {siteData.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group overflow-hidden rounded-[32px] border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/25"
            style={{ boxShadow: "var(--card-shadow-hover)" }}
          >
            <iframe
              src={siteData.mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 520 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${siteData.clinicName} location`}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
