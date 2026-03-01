import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Flower2,
  Heart,
  ShoppingCart,
  X,
  ZoomIn,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { EventImage } from "../backend.d";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useCart } from "../hooks/useCart";
import { useFavourites } from "../hooks/useFavourites";
import { useGetCategories, useGetImagesByCategory } from "../hooks/useQueries";

function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: EventImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { getBlobUrl } = useBlobStorage();
  const img = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <motion.img
          key={img.id.toString()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={getBlobUrl(img.blobId)}
          alt={img.caption || "Event decoration"}
          className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
        />
        {img.caption && (
          <p className="mt-4 text-white/80 font-body text-sm text-center max-w-md">
            {img.caption}
          </p>
        )}

        {images.length > 1 && (
          <div className="flex gap-3 mt-5">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              className="border-white/20 text-white bg-white/10 hover:bg-white/20 font-body"
            >
              ← Previous
            </Button>
            <span className="flex items-center text-white/60 text-sm font-body">
              {currentIndex + 1} / {images.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              className="border-white/20 text-white bg-white/10 hover:bg-white/20 font-body"
            >
              Next →
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CategoryPage() {
  const { id } = useParams({ from: "/category/$id" });
  const categoryId = BigInt(id ?? "0");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: categories } = useGetCategories();
  const { data: images, isLoading } = useGetImagesByCategory(categoryId);
  const { getBlobUrl } = useBlobStorage();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { isInCart, addToCart } = useCart();

  const category = categories?.find((c) => c.id === categoryId);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i !== null
        ? (i - 1 + (images?.length ?? 1)) % (images?.length ?? 1)
        : null,
    );
  const nextImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % (images?.length ?? 1) : null,
    );

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
          style={{ background: "oklch(var(--marigold))" }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "oklch(var(--festival-pink))" }}
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
                    "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                }}
              >
                <Flower2 className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-sm font-body font-semibold tracking-[0.15em] uppercase"
                style={{ color: "oklch(var(--marigold))" }}
              >
                Event Gallery
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              {category?.name ?? "Loading…"}
            </h1>
            {category?.description && (
              <p className="mt-3 font-body text-lg text-muted-foreground max-w-2xl">
                {category.description}
              </p>
            )}
            {images && (
              <p className="mt-2 text-sm font-body text-muted-foreground">
                {images.length} {images.length === 1 ? "photo" : "photos"}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 mt-10">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
              <Skeleton key={k} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : !images?.length ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--marigold) / 0.15), oklch(var(--festival-pink) / 0.15))",
              }}
            >
              <Flower2 className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground/60 mb-2">
              Gallery Coming Soon
            </h3>
            <p className="font-body text-muted-foreground max-w-sm mx-auto">
              Beautiful photos for <strong>{category?.name}</strong> will be
              added here shortly. Check back soon!
            </p>
            <Link to="/" className="inline-block mt-6">
              <Button
                variant="outline"
                className="font-body gap-2 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
                Explore Other Events
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, i) => {
              const imgId = image.id.toString();
              const faved = isFavourite(imgId);
              const inCart = isInCart(imgId);
              const itemPayload = {
                id: imgId,
                blobId: image.blobId,
                caption: image.caption,
                categoryId: categoryId.toString(),
                categoryName: category?.name ?? "",
              };

              return (
                <motion.div
                  key={imgId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-festival border border-border/40"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={getBlobUrl(image.blobId)}
                    alt={image.caption || category?.name || "Event decoration"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>

                  {/* Action buttons — top-left overlay */}
                  <div
                    className="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {/* Favourite toggle */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.12 }}
                      onClick={() => {
                        toggleFavourite(itemPayload);
                        toast.success(
                          faved
                            ? "Removed from favourites"
                            : "Added to favourites",
                          { duration: 1500 },
                        );
                      }}
                      aria-label={
                        faved ? "Remove from favourites" : "Add to favourites"
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-md transition-colors hover:bg-white"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${faved ? "fill-red-500 text-red-500" : "text-foreground/60"}`}
                      />
                    </motion.button>

                    {/* Cart toggle */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.12 }}
                      onClick={() => {
                        if (!inCart) {
                          addToCart(itemPayload);
                          toast.success("Added to cart", { duration: 1500 });
                        }
                      }}
                      aria-label={inCart ? "Already in cart" : "Add to cart"}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-md transition-colors hover:bg-white"
                    >
                      {inCart ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 text-foreground/60" />
                      )}
                    </motion.button>
                  </div>

                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs font-body line-clamp-2">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && images && images.length > 0 && (
          <ImageLightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
