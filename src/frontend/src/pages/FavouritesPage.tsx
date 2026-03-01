import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Flower2, Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useFavourites } from "../hooks/useFavourites";

function FavouriteCard({
  item,
  onRemove,
  index,
}: {
  item: ReturnType<typeof useFavourites>["favourites"][number];
  onRemove: () => void;
  index: number;
}) {
  const { getBlobUrl } = useBlobStorage();
  const imgUrl = getBlobUrl(item.blobId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative aspect-square rounded-xl overflow-hidden shadow-festival border border-border/40 bg-muted"
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={item.caption || item.categoryName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--marigold) / 0.2), oklch(var(--festival-pink) / 0.2))",
          }}
        >
          <Flower2 className="w-10 h-10 text-muted-foreground/40" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300" />

      {/* Caption */}
      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-xs font-body line-clamp-2">
            {item.caption}
          </p>
        </div>
      )}

      {/* Category tag */}
      <div className="absolute top-2 left-2">
        <span
          className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--marigold) / 0.85), oklch(var(--festival-pink) / 0.85))",
          }}
        >
          {item.categoryName}
        </span>
      </div>

      {/* Remove favourite button */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove from favourites"
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
      </button>
    </motion.div>
  );
}

export default function FavouritesPage() {
  const { favourites, toggleFavourite, count } = useFavourites();

  return (
    <div className="pb-16">
      {/* Header */}
      <div
        className="relative py-14 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.06 55 / 0.06) 0%, oklch(0.22 0.04 30 / 0.04) 100%)",
          borderBottom: "1px solid oklch(var(--border))",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "oklch(var(--festival-pink))" }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "oklch(var(--marigold))" }}
        />

        <div className="container mx-auto px-4 relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Events
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--festival-pink)), oklch(var(--marigold)))",
                }}
              >
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span
                className="text-sm font-body font-semibold tracking-[0.15em] uppercase"
                style={{ color: "oklch(var(--festival-pink))" }}
              >
                My Collection
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              My Favourites
            </h1>
            <p className="mt-3 font-body text-lg text-muted-foreground">
              {count > 0
                ? `${count} saved decoration${count !== 1 ? "s" : ""} you love`
                : "Your saved decoration inspirations will appear here"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 mt-10">
        {count === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--festival-pink) / 0.12), oklch(var(--marigold) / 0.12))",
              }}
            >
              <Heart
                className="w-11 h-11"
                style={{ color: "oklch(var(--festival-pink) / 0.5)" }}
              />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground/60 mb-3">
              No favourites yet
            </h3>
            <p className="font-body text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Browse our event galleries and tap the heart icon on any photo to
              save it here for inspiration.
            </p>
            <Link to="/" className="inline-block mt-8">
              <Button
                className="font-body gap-2 rounded-full text-white shadow-festival"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                }}
              >
                <Flower2 className="w-4 h-4" />
                Browse Event Galleries
              </Button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favourites.map((item, i) => (
                <FavouriteCard
                  key={item.id}
                  item={item}
                  index={i}
                  onRemove={() => toggleFavourite(item)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
