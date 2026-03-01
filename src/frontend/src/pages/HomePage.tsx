import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Flower2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { EventCategory, EventImage } from "../backend.d";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useGetAllImages, useGetCategories } from "../hooks/useQueries";

// Fallback gradient backgrounds for categories without images
const categoryGradients = [
  "linear-gradient(135deg, oklch(0.72 0.19 55), oklch(0.62 0.22 10))",
  "linear-gradient(135deg, oklch(0.62 0.22 10), oklch(0.52 0.18 18))",
  "linear-gradient(135deg, oklch(0.78 0.14 82), oklch(0.72 0.19 55))",
  "linear-gradient(135deg, oklch(0.52 0.13 148), oklch(0.62 0.22 10))",
  "linear-gradient(135deg, oklch(0.52 0.18 18), oklch(0.78 0.14 82))",
  "linear-gradient(135deg, oklch(0.72 0.19 55), oklch(0.52 0.13 148))",
  "linear-gradient(135deg, oklch(0.62 0.22 10), oklch(0.72 0.19 55))",
  "linear-gradient(135deg, oklch(0.78 0.14 82), oklch(0.52 0.18 18))",
  "linear-gradient(135deg, oklch(0.52 0.13 148), oklch(0.72 0.19 55))",
  "linear-gradient(135deg, oklch(0.65 0.18 55), oklch(0.62 0.22 10))",
];

function CategoryCard({
  category,
  previewImage,
  index,
}: {
  category: EventCategory;
  previewImage?: EventImage;
  index: number;
}) {
  const { getBlobUrl } = useBlobStorage();
  const previewUrl = previewImage ? getBlobUrl(previewImage.blobId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link
        to="/category/$id"
        params={{ id: category.id.toString() }}
        className="block group"
      >
        <div className="card-hover rounded-2xl overflow-hidden shadow-festival border border-border/60 bg-card">
          {/* Image area */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background:
                    categoryGradients[index % categoryGradients.length],
                }}
              >
                <div className="text-center text-white/90">
                  <Flower2 className="w-12 h-12 mx-auto mb-2 opacity-70" />
                  <p className="text-xs font-body font-medium opacity-70">
                    Gallery coming soon
                  </p>
                </div>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Arrow button */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                }}
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="p-4">
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
              {category.name}
            </h3>
            {category.description && (
              <p className="mt-1 text-sm font-body text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-1 text-xs font-body font-medium text-primary/80">
              <span>View Gallery</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CategorySkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-festival border border-border/60 bg-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/3 mt-1" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: categories, isLoading: catsLoading } = useGetCategories();
  const { data: allImages } = useGetAllImages();

  // Build a map of first image per category
  const firstImageByCategory = (allImages ?? []).reduce<
    Record<string, EventImage>
  >((acc, img) => {
    const key = img.categoryId.toString();
    if (!acc[key]) acc[key] = img;
    return acc;
  }, {});

  return (
    <div className="pb-16">
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[520px] md:h-[580px]">
          <img
            src="/assets/generated/hero-banner.dim_1200x500.jpg"
            alt="Beautiful flower decorations"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.22 0.06 55 / 0.72) 0%, oklch(0.22 0.06 30 / 0.5) 50%, transparent 100%)",
            }}
          />

          {/* Hero content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-2xl"
              >
                {/* Tag */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-sm font-body font-medium border border-white/30 text-white/90 backdrop-blur-sm"
                  style={{ background: "oklch(1 0 0 / 0.1)" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-festival-gold" />
                  Premium Floral Decor
                </motion.div>

                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-4">
                  Beautiful Flower
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.95 0.12 80), oklch(0.85 0.16 55))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Decorations
                  </span>
                </h1>

                <p className="font-body text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                  for Every Occasion
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <a href="#categories">
                    <Button
                      size="lg"
                      className="font-body font-semibold gap-2 px-8 rounded-full text-white shadow-festival-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                      }}
                    >
                      Explore Decorations
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{
              background:
                "linear-gradient(to top, oklch(var(--background)), transparent)",
            }}
          />
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="container mx-auto px-4 -mt-6 relative z-10"
        >
          <div
            className="rounded-2xl border border-border/60 shadow-festival-lg backdrop-blur-sm py-5 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
            style={{ background: "oklch(var(--card) / 0.95)" }}
          >
            {[
              { value: "10+", label: "Event Types" },
              { value: "100%", label: "Fresh Flowers" },
              { value: "500+", label: "Events Done" },
              { value: "5★", label: "Client Rating" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="font-display text-2xl font-bold text-gradient-gold">
                  {stat.value}
                </span>
                <span className="text-xs font-body text-muted-foreground font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Categories Grid ───────────────────────────────────── */}
      <section id="categories" className="container mx-auto px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p
            className="text-sm font-body font-semibold tracking-[0.18em] uppercase mb-3"
            style={{ color: "oklch(var(--marigold))" }}
          >
            Our Specialties
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Event Decorations
          </h2>
          <p className="mt-4 text-lg font-body text-muted-foreground max-w-xl mx-auto">
            From intimate naming ceremonies to grand receptions — we craft
            unforgettable floral experiences.
          </p>
          <div
            className="mx-auto mt-5 h-1 w-24 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
            }}
          />
        </motion.div>

        {catsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
              <CategorySkeleton key={k} />
            ))}
          </div>
        ) : !categories?.length ? (
          <div className="text-center py-20">
            <Flower2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
            <p className="font-display text-2xl text-foreground/60">
              Decorations coming soon
            </p>
            <p className="mt-2 font-body text-muted-foreground">
              Check back shortly for our full gallery.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id.toString()}
                category={cat}
                previewImage={firstImageByCategory[cat.id.toString()]}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Decorative divider ────────────────────────────────── */}
      <div className="container mx-auto px-4 mt-16">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(var(--marigold) / 0.4), oklch(var(--festival-pink) / 0.4), transparent)",
          }}
        />
      </div>

      {/* ── Why Choose Us ────────────────────────────────────── */}
      <section className="container mx-auto px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Why Choose Us
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🌸",
              title: "Farm-Fresh Flowers",
              desc: "We source the freshest seasonal blooms directly from local farms, ensuring vibrant colors and lasting fragrance throughout your event.",
            },
            {
              icon: "✨",
              title: "Expert Craftsmanship",
              desc: "Our skilled decorators bring years of experience in traditional and contemporary Indian wedding aesthetics.",
            },
            {
              icon: "🎊",
              title: "End-to-End Service",
              desc: "From initial concept to final setup and teardown — we handle every floral detail so you can enjoy your special day.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-6 border border-border/60 shadow-festival bg-card text-center"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
