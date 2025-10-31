import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { KeyedMutator } from "swr";

import fetchApi from "~/shared/lib/api/fetch";
import type { ApiResponse } from "~/shared/lib/next/nx-response";

interface UseVisibilityToggleProps<T> {
  id: string;
  initialIsPublic: boolean;
  endpoint: "catalogs" | "archives";
  revalidate: KeyedMutator<ApiResponse<T>>;
}

/**
 * Custom hook to manage visibility toggle state and API calls for catalogs/archives.
 * Handles loading states, error handling, and state synchronization.
 */
export function useVisibilityToggle<T>({
  id,
  initialIsPublic,
  endpoint,
  revalidate,
}: UseVisibilityToggleProps<T>) {
  const [isPublicState, setIsPublicState] = useState(initialIsPublic);
  const [isLoading, setIsLoading] = useState(false);

  // Sync local state with prop changes (e.g., after refetch)
  useEffect(() => {
    setIsPublicState(initialIsPublic);
  }, [initialIsPublic]);

  async function handleToggle(checked: boolean) {
    // Guard: Prevent redundant API calls if state hasn't changed
    if (checked === isPublicState) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchApi(`/${endpoint}/${id}/visibility`, {
        body: JSON.stringify({ isPublic: checked }),
        method: "PATCH",
      });

      // If we reach here, fetchApi didn't throw (success case)
      setIsPublicState(checked);
      toast.success(result.message);
      revalidate();
    } catch (err: any) {
      // fetchApi throws on !success, extract the actual response from err.cause
      if (err.cause) {
        try {
          const errorResponse = await err.cause;
          const errorMessage =
            errorResponse.error?.details || errorResponse.message;
          toast.error(errorMessage);
        } catch {
          toast.error("Failed to update visibility status.");
        }
      } else {
        // Unexpected runtime error (network failure, etc.)
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    handleToggle,
    isLoading,
    isPublicState,
  };
}
