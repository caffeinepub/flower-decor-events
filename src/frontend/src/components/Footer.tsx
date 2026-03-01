import { Link } from "@tanstack/react-router";
import { Flower, Heart, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const href = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="relative mt-auto border-t border-border/60 overflow-hidden">
      {/* Decorative top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(var(--marigold)), oklch(var(--gold)), oklch(var(--festival-pink)), oklch(var(--marigold)), transparent)",
        }}
      />

      <div
        className="py-10"
        style={{
          background:
            "linear-gradient(180deg, oklch(var(--background)) 0%, oklch(0.96 0.018 60) 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                  }}
                >
                  <Flower className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-gradient-gold text-lg">
                  Kalapriya Flower Decoration
                </span>
              </Link>
              <p className="text-sm font-body text-muted-foreground">
                Beautiful floral decorations for every celebration — weddings,
                receptions, naming ceremonies, and more.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-2">
              <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-1">
                Quick Links
              </h3>
              <Link
                to="/"
                className="text-sm font-body text-foreground/70 hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/favourites"
                className="text-sm font-body text-foreground/70 hover:text-primary transition-colors"
              >
                Favourites
              </Link>
              <Link
                to="/contact"
                className="text-sm font-body text-foreground/70 hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-3">
              <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-1">
                Contact
              </h3>
              <a
                href="tel:+918660610864"
                className="flex items-center gap-2 text-sm font-body text-foreground/70 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0 text-marigold" />
                +91 86606 10864
              </a>
              <a
                href="mailto:kalapriyadecorations@gmail.com"
                className="flex items-center gap-2 text-sm font-body text-foreground/70 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0 text-marigold" />
                kalapriyadecorations@gmail.com
              </a>
              <div className="flex items-start gap-2 text-sm font-body text-foreground/70">
                <MapPin className="w-4 h-4 flex-shrink-0 text-marigold mt-0.5" />
                Chikkaballapur, Karnataka, India
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs font-body text-muted-foreground">
              © {year} Kalapriya Flower Decoration. All rights reserved.
            </p>
            <p className="text-xs font-body text-muted-foreground flex items-center gap-1">
              Built with <Heart className="w-3 h-3 inline text-festival-pink" />{" "}
              using{" "}
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
