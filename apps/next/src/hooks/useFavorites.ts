"use client";

import { useCallback, useMemo } from "react";

import { DEFAULT_USER_ID } from "@/config/user";
import { trpc } from "@/utils/trpc";

export function useFavorites(userId: string = DEFAULT_USER_ID) {
  const utils = trpc.useUtils();

  const favoritesQuery = trpc.favorite.getFavorites.useQuery(
    { userId },
    {
      enabled: Boolean(userId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const addFavoriteMutation = trpc.favorite.addFavorite.useMutation({
    onSuccess: () =>
      utils.favorite.getFavorites.invalidate({
        userId,
      }),
  });

  const deleteFavoriteMutation = trpc.favorite.deleteFavorite.useMutation({
    onSuccess: () =>
      utils.favorite.getFavorites.invalidate({
        userId,
      }),
  });

  // 1. Get the raw data
  type FavoriteEntry = NonNullable<typeof favoritesQuery.data>[number];
  const favorites: FavoriteEntry[] = favoritesQuery.data ?? [];

  // 2. Create a Set internally for fast logic
  const favoriteIdSet = useMemo(
    () => new Set(favorites.map((favorite) => favorite.dishId)),
    [favorites],
  );

  // 3. Convert Set to Array for the Return value
  const favoriteIdsArray = useMemo(
    () => Array.from(favoriteIdSet),
    [favoriteIdSet]
  );

  const toggleFavorite = useCallback(
    (dishId: string, currentlyFavorite: boolean) => {
      if (currentlyFavorite) {
        deleteFavoriteMutation.mutate({
          userId,
          dishId,
        });
      } else {
        addFavoriteMutation.mutate({
          userId,
          dishId,
        });
      }
    },
    [addFavoriteMutation, deleteFavoriteMutation, userId],
  );

  const addMutationDishId = addFavoriteMutation.variables?.dishId;
  const deleteMutationDishId = deleteFavoriteMutation.variables?.dishId;

  const isFavoritePending = useCallback(
    (dishId: string) =>
      (addFavoriteMutation.isPending && addMutationDishId === dishId) ||
      (deleteFavoriteMutation.isPending && deleteMutationDishId === dishId),
    [
      addFavoriteMutation.isPending,
      addMutationDishId,
      deleteFavoriteMutation.isPending,
      deleteMutationDishId,
    ],
  );

  return {
    favorites,
    favoriteIds: favoriteIdsArray,
    isLoadingFavorites: favoritesQuery.isLoading,
    toggleFavorite,
    isFavoritePending,
    favoritesError: favoritesQuery.error,
  };
}


