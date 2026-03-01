import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface FavouriteItem {
  id: string;
  blobId: string;
  caption: string;
  categoryId: string;
  categoryName: string;
}

export function useFavourites() {
  const [favourites, setFavourites] = useLocalStorage<FavouriteItem[]>(
    "fde-favourites",
    [],
  );

  const isFavourite = useCallback(
    (id: string) => favourites.some((f) => f.id === id),
    [favourites],
  );

  const toggleFavourite = useCallback(
    (item: FavouriteItem) => {
      setFavourites((prev) => {
        const exists = prev.some((f) => f.id === item.id);
        if (exists) {
          return prev.filter((f) => f.id !== item.id);
        }
        return [...prev, item];
      });
    },
    [setFavourites],
  );

  return {
    favourites,
    toggleFavourite,
    isFavourite,
    count: favourites.length,
  };
}
