import { Link } from "@tanstack/react-router";
import { Flower, Heart } from "lucide-react";

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
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
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
                Flower Decor Events
              </span>
            </Link>

            {/* Tagline */}
            <div className="text-sm font-body text-muted-foreground text-center">
              Beautiful floral decorations for every celebration
            </div>

            {/* Attribution */}
            <p className="text-xs font-body text-muted-foreground flex items-center gap-1">
              © {year}. Built with{" "}
              <Heart className="w-3 h-3 inline text-festival-pink" /> using{" "}
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
