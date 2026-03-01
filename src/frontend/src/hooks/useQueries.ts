import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EventCategory, EventImage } from "../backend.d";
import { useActor } from "./useActor";

// ── Categories ──────────────────────────────────────────────────────────────

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<EventCategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      const cats = await actor.getCategories();
      return [...cats].sort((a, b) => Number(a.order) - Number(b.order));
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Images ───────────────────────────────────────────────────────────────────

export function useGetImagesByCategory(categoryId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<EventImage[]>({
    queryKey: ["images", categoryId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getImagesByCategory(categoryId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllImages() {
  const { actor, isFetching } = useActor();
  return useQuery<EventImage[]>({
    queryKey: ["allImages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllImages();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function useAddImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryId,
      blobId,
      caption,
    }: {
      categoryId: bigint;
      blobId: string;
      caption: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addImage(categoryId, blobId, caption);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["images", variables.categoryId.toString()],
      });
      void queryClient.invalidateQueries({ queryKey: ["allImages"] });
    },
  });
}

export function useRemoveImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeImage(imageId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["images"] });
      void queryClient.invalidateQueries({ queryKey: ["allImages"] });
    },
  });
}

export function useUpdateCategoryDescription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryId,
      description,
    }: {
      categoryId: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCategoryDescription(categoryId, description);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
