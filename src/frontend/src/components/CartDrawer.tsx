import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Flower2, ShoppingCart, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useCart } from "../hooks/useCart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function CartItemCard({
  item,
  onRemove,
}: {
  item: ReturnType<typeof useCart>["cartItems"][number];
  onRemove: () => void;
}) {
  const { getBlobUrl } = useBlobStorage();
  const imgUrl = getBlobUrl(item.blobId);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card group"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={item.caption || item.categoryName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--marigold) / 0.3), oklch(var(--festival-pink) / 0.3))",
            }}
          >
            <Flower2 className="w-6 h-6 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-semibold text-foreground truncate">
          {item.caption || "Untitled photo"}
        </p>
        <p
          className="text-xs font-body font-medium mt-0.5"
          style={{ color: "oklch(var(--marigold))" }}
        >
          {item.categoryName}
        </p>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove from cart"
        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, clearCart, count } = useCart();

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
        style={{ background: "oklch(var(--background))" }}
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                }}
              >
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              My Cart
              {count > 0 && (
                <span
                  className="text-sm font-body font-semibold px-2 py-0.5 rounded-full text-white ml-1"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                  }}
                >
                  {count}
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {count === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full py-16 text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--marigold) / 0.12), oklch(var(--festival-pink) / 0.12))",
                }}
              >
                <ShoppingCart
                  className="w-9 h-9"
                  style={{ color: "oklch(var(--marigold))" }}
                />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground/80 mb-2">
                Your cart is empty
              </h3>
              <p className="font-body text-sm text-muted-foreground max-w-[220px] leading-relaxed">
                Browse our event galleries and save your favourite decoration
                inspirations here.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div className="px-6 py-4 border-t border-border/60 space-y-3">
            <div className="flex items-center justify-between text-sm font-body text-muted-foreground">
              <span>
                {count} item{count !== 1 ? "s" : ""} saved
              </span>
            </div>
            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full gap-2 font-body font-medium border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/60"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
