import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InteractionType } from "./types";
import { interactionsApi } from "./api";

type InteractionReturn = {
  mutate: (userId: string) => void;
  isPending: boolean;
  variables?: string;
};

export const useInteraction = (type: InteractionType): InteractionReturn => {
  const queryClient = useQueryClient();

  // Pick the correct API function dynamically
  const apiFn = interactionsApi[type];

  return useMutation({
    mutationFn: async (userId: string) => {
      await apiFn(userId);
      return userId;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      queryClient.invalidateQueries({ queryKey: ["navigationSummary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });

      // Optionally, invalidate a more specific key if you want:
      // queryClient.invalidateQueries({ queryKey: ["users", "sent"] });

      console.log(`${type} success for userId:`, userId);
    },
    onError: (error) => {
      console.error(`${type} failed:`, error);
    },
  });
};
