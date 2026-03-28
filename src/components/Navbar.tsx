import { MapPin, Menu, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSiteContent } from "@/context/SiteContentContext";

const Navbar = () => {
  const { siteData } = useSiteContent();
  const links = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
    { label: "Reviews", href: "#reviews" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/78 backdrop-blur-xl">
      <div className="container-narrow flex items-center justify-between gap-4 px-4 py-3 md:px-8">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="Disha Clinic" width={40} height={40} />
          <div>
            <span className="block font-heading text-lg font-semibold text-foreground">
              {siteData.shortName}
            </span>
            <span className="hidden text-xs uppercase tracking-[0.25em] text-muted-foreground md:block">
              Homeopathy and Wellness
            </span>
          </div>
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 xl:flex">
          <a
            href={siteData.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <MapPin className="h-4 w-4" />
            Location
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </a>
          <a
            href={`https://wa.me/${siteData.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
