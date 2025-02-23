import { api } from "../utils/api";

export const useZotmealQuery = (date: Date) =>
  api.zotmeal.useQuery(
    { date },
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

export const useDishRateMutation = () => api.dish.rate.useMutation();
export const useUserUpsertMutation = () => api.user.upsert.useMutation();
