import {
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const Footer = () => {
  const { siteData } = useSiteContent();
  const socialIcons = {
    Facebook,
    Instagram,
    Telegram: Send,
    Twitter,
  } as const;

  return (
    <footer className="bg-[linear-gradient(180deg,#18362d_0%,#11261f_100%)] px-4 py-12 text-primary-foreground md:px-8 lg:px-16">
      <div className="container-narrow">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-2xl font-semibold text-primary-foreground">{siteData.clinicName}</p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-primary-foreground/68">
              {siteData.footerBlurb}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/50">
              Contact
            </p>
            <div className="mt-4 space-y-3 text-sm text-primary-foreground/72">
              <a href={`tel:${siteData.phone.replace(/\s+/g, "")}`} className="flex items-start gap-3 hover:text-primary-foreground">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{siteData.phone}</span>
              </a>
              <a
                href={`https://wa.me/${siteData.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-primary-foreground"
              >
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{siteData.whatsapp}</span>
              </a>
              <a
                href={siteData.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-primary-foreground"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{siteData.address}</span>
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/50">
              Quick Links
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/72">
              <a href="#about" className="hover:text-primary-foreground">About</a>
              <a href="#services" className="hover:text-primary-foreground">Services</a>
              <a href="#gallery" className="hover:text-primary-foreground">Gallery</a>
              <a href="#contact" className="hover:text-primary-foreground">Contact</a>
              <a href="/admin" className="hover:text-primary-foreground">Admin Panel</a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/50">
              Follow Us
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {siteData.socials.map((item) => {
                const Icon = socialIcons[item.label as keyof typeof socialIcons];
                if (!Icon) {
                  return null;
                }

                return item.url.trim() ? (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-primary-foreground/78 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ) : (
                  <span
                    key={item.id}
                    aria-label={item.label}
                    title={item.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary-foreground/35"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 text-center text-sm text-primary-foreground/55">
          <p>
            Copyright {new Date().getFullYear()} {siteData.clinicName}  Created by Rushi Karwande
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
