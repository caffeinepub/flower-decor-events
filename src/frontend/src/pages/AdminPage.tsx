import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Flower2,
  ImagePlus,
  Loader2,
  LogIn,
  Pencil,
  Shield,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { EventCategory, EventImage } from "../backend.d";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddImage,
  useGetCategories,
  useGetImagesByCategory,
  useInitializeAdmin,
  useIsCallerAdmin,
  useRemoveImage,
  useUpdateCategoryDescription,
} from "../hooks/useQueries";

// ── Single category section ──────────────────────────────────────────────────

function CategorySection({ category }: { category: EventCategory }) {
  const [expanded, setExpanded] = useState(false);
  const [caption, setCaption] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(category.description);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: images, isLoading: imgsLoading } = useGetImagesByCategory(
    category.id,
  );
  const { uploadBlob, getBlobUrl } = useBlobStorage();
  const addImage = useAddImage();
  const removeImage = useRemoveImage();
  const updateDesc = useUpdateCategoryDescription();

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const blobId = await uploadBlob(file, (pct) => setUploadProgress(pct));
      await addImage.mutateAsync({
        categoryId: category.id,
        blobId,
        caption,
      });
      setCaption("");
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFileUpload(file);
  };

  const handleDelete = async (imageId: bigint) => {
    try {
      await removeImage.mutateAsync(imageId);
      toast.success("Image removed.");
    } catch {
      toast.error("Failed to remove image.");
    }
  };

  const handleSaveDesc = async () => {
    try {
      await updateDesc.mutateAsync({
        categoryId: category.id,
        description: descValue,
      });
      setEditingDesc(false);
      toast.success("Description updated!");
    } catch {
      toast.error("Failed to update description.");
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-festival overflow-hidden">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--marigold) / 0.3), oklch(var(--festival-pink) / 0.3))",
            }}
          >
            <Flower2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              {category.name}
            </h3>
            <p className="text-xs font-body text-muted-foreground mt-0.5">
              {images?.length ?? 0} images
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-body hidden sm:flex">
            Order #{Number(category.order)}
          </Badge>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-border/60 space-y-6">
              {/* Description editor */}
              <div>
                <Label className="font-body font-medium text-sm mb-2 block">
                  Category Description
                </Label>
                {editingDesc ? (
                  <div className="space-y-2">
                    <Textarea
                      value={descValue}
                      onChange={(e) => setDescValue(e.target.value)}
                      placeholder="Describe this decoration type…"
                      rows={3}
                      className="font-body text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveDesc}
                        disabled={updateDesc.isPending}
                        className="font-body gap-1.5"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                          color: "white",
                        }}
                      >
                        {updateDesc.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingDesc(false);
                          setDescValue(category.description);
                        }}
                        className="font-body gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <p className="font-body text-sm text-muted-foreground flex-1 min-h-[2.5rem] py-1">
                      {category.description || (
                        <span className="italic opacity-60">
                          No description yet
                        </span>
                      )}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingDesc(true)}
                      className="font-body gap-1.5 shrink-0"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              {/* Upload area */}
              <div>
                <Label className="font-body font-medium text-sm mb-2 block">
                  Upload New Image
                </Label>
                <label
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer block ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  aria-label="Upload image"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />

                  {uploading ? (
                    <div className="space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      <p className="font-body text-sm text-muted-foreground">
                        Uploading… {uploadProgress > 0 && `${uploadProgress}%`}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(var(--marigold) / 0.2), oklch(var(--festival-pink) / 0.2))",
                        }}
                      >
                        <ImagePlus className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-body text-sm font-medium text-foreground">
                        Drop image here or{" "}
                        <span className="text-primary">browse</span>
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        JPG, PNG, WebP — up to 10 MB
                      </p>
                    </>
                  )}
                </label>

                {/* Caption field */}
                <div className="mt-3 space-y-1.5">
                  <Label className="font-body text-sm text-muted-foreground">
                    Caption (optional)
                  </Label>
                  <Input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe this photo…"
                    className="font-body text-sm"
                    disabled={uploading}
                  />
                </div>

                <Button
                  className="mt-3 w-full font-body gap-2"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                    color: "white",
                  }}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? "Uploading…" : "Upload Image"}
                </Button>
              </div>

              {/* Existing images */}
              <div>
                <Label className="font-body font-medium text-sm mb-3 block">
                  Uploaded Images
                </Label>
                {imgsLoading ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {["a", "b", "c", "d"].map((k) => (
                      <Skeleton key={k} className="aspect-square rounded-xl" />
                    ))}
                  </div>
                ) : !images?.length ? (
                  <div className="text-center py-8 text-muted-foreground font-body text-sm bg-muted/30 rounded-xl">
                    No images yet. Upload the first one above!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {images.map((image: EventImage) => (
                      <div
                        key={image.id.toString()}
                        className="relative group aspect-square rounded-xl overflow-hidden border border-border/60"
                      >
                        <img
                          src={getBlobUrl(image.blobId)}
                          alt={image.caption || category.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-body truncate">
                              {image.caption}
                            </p>
                          </div>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 active:scale-95"
                              aria-label="Delete image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-display">
                                Delete this image?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="font-body">
                                This will permanently remove the image from{" "}
                                <strong>{category.name}</strong>. This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="font-body">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(image.id)}
                                className="font-body bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Admin Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const {
    data: isAdmin,
    isLoading: adminLoading,
    refetch: refetchAdmin,
  } = useIsCallerAdmin();
  const { data: categories, isLoading: catsLoading } = useGetCategories();
  const queryClient = useQueryClient();
  const initializeAdmin = useInitializeAdmin();

  const [adminToken, setAdminToken] = useState("");
  const [tokenSuccess, setTokenSuccess] = useState(false);
  const [recheckingAdmin, setRecheckingAdmin] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  // Re-check admin status whenever identity changes (e.g. after login)
  useEffect(() => {
    if (isAuthenticated) {
      // Show a brief "verifying" state and then re-check admin status
      setRecheckingAdmin(true);
      const timer = setTimeout(async () => {
        await queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
        await refetchAdmin();
        setRecheckingAdmin(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, queryClient, refetchAdmin]);

  const handleClaimAdmin = async () => {
    try {
      await initializeAdmin.mutateAsync(adminToken);
      setTokenSuccess(true);
      setAdminToken("");
      // Invalidate all queries and reload after a short delay
      setTimeout(() => {
        queryClient.clear();
        window.location.reload();
      }, 1500);
    } catch (err) {
      // __NEEDS_RELOAD__ is handled by onError in the mutation -- don't show as error
      if (err instanceof Error && err.message === "__NEEDS_RELOAD__") {
        setTokenSuccess(true);
      }
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-festival"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
            }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Admin Panel
          </h1>
          <p className="font-body text-muted-foreground mb-8">
            Please log in to manage your event decoration gallery and upload
            photos.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="font-body font-semibold gap-2 px-8 rounded-full text-white shadow-festival"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
            }}
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            {isLoggingIn ? "Logging in…" : "Login to Continue"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Logged in but checking admin status (initial load or re-check after login)
  if (adminLoading || recheckingAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
          <p className="font-body text-muted-foreground">
            Verifying admin access…
          </p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Admin Setup
          </h1>
          <p className="font-body text-muted-foreground mb-6">
            Your account is not registered as admin. If you are the site owner,
            enter the setup token below to claim admin access.
          </p>

          {/* Token entry form */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 text-left mb-4 shadow-sm">
            {/* Step-by-step instructions */}
            <div className="bg-muted/50 border border-border/40 rounded-xl p-4 mb-4">
              <p className="font-body font-semibold text-sm text-foreground mb-2">
                How to get your Admin Token:
              </p>
              <ol className="font-body text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                <li>
                  Go to <strong className="text-foreground">caffeine.ai</strong>{" "}
                  and log in
                </li>
                <li>
                  Open your{" "}
                  <strong className="text-foreground">
                    Kalapriya Flower Decoration
                  </strong>{" "}
                  project
                </li>
                <li>
                  Click the <strong className="text-foreground">Preview</strong>{" "}
                  button to open the site
                </li>
                <li>
                  Look at the URL in your browser — copy everything after{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    caffeineAdminToken=
                  </code>
                </li>
                <li>Paste that value in the field below</li>
              </ol>
            </div>

            <Label
              htmlFor="admin-token"
              className="font-body font-medium text-sm mb-2 block"
            >
              Admin Setup Token
            </Label>
            <Input
              id="admin-token"
              type="text"
              value={adminToken}
              onChange={(e) => {
                // Auto-strip accidental leading '=' when pasting
                setAdminToken(e.target.value.replace(/^=+/, ""));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && adminToken.trim()) handleClaimAdmin();
              }}
              placeholder="Paste your token here…"
              className="font-body text-sm mb-3"
              disabled={initializeAdmin.isPending || tokenSuccess}
            />

            {initializeAdmin.isError &&
              initializeAdmin.error instanceof Error &&
              initializeAdmin.error.message !== "__NEEDS_RELOAD__" && (
                <p className="font-body text-xs text-destructive mb-3">
                  {initializeAdmin.error.message ||
                    "Failed to claim admin access. Please check the token and try again."}{" "}
                  Make sure you copied the token correctly (without the leading
                  = sign).
                </p>
              )}

            {tokenSuccess && (
              <p className="font-body text-xs text-green-600 mb-3 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Admin access granted! Refreshing…
              </p>
            )}

            <Button
              onClick={handleClaimAdmin}
              disabled={
                !adminToken.trim() || initializeAdmin.isPending || tokenSuccess
              }
              className="w-full font-body font-semibold gap-2 text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
              }}
            >
              {initializeAdmin.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {initializeAdmin.isPending
                ? "Claiming access…"
                : "Claim Admin Access"}
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="font-body text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            variant="outline"
            onClick={() => {
              clear();
              queryClient.clear();
            }}
            className="font-body w-full"
          >
            Log Out
          </Button>
        </motion.div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="pb-16">
      {/* Header */}
      <div
        className="py-12 border-b border-border/60 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.06 55 / 0.05) 0%, oklch(0.22 0.04 30 / 0.04) 100%)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "oklch(var(--marigold))" }}
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--marigold)), oklch(var(--festival-pink)))",
                }}
              >
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-sm font-body font-semibold tracking-[0.15em] uppercase"
                style={{ color: "oklch(var(--marigold))" }}
              >
                Admin
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Manage Gallery
            </h1>
            <p className="mt-2 font-body text-muted-foreground max-w-xl">
              Upload and manage photos for each event decoration category.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 mt-8">
        {catsLoading ? (
          <div className="space-y-4">
            {["a", "b", "c", "d", "e"].map((k) => (
              <Skeleton key={k} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : !categories?.length ? (
          <div className="text-center py-16 text-muted-foreground font-body">
            No categories found. Please check the backend setup.
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id.toString()}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <CategorySection category={cat} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
