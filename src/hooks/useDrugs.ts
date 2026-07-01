import { useQuery } from '@tanstack/react-query';
import { fetchAllDrugs, fetchDrugById } from '../services/drugService';

/**
 * Query key constants.
 *
 * Keeping these in one place means you never typo a string key in two places.
 * TanStack Query uses these keys to cache and invalidate data.
 */
export const QUERY_KEYS = {
  drugs: ['drugs'] as const,
  drug: (id: number) => ['drugs', id] as const,
};

/**
 * Fetches all veterinary drugs from the API.
 *
 * Returns TanStack Query's standard shape:
 *   { data, isLoading, isError, error, refetch, ... }
 *
 * The data is cached for 5 minutes (staleTime) — the drug list rarely changes,
 * so we avoid refetching it every time the component mounts.
 */
export function useDrugs() {
  return useQuery({
    queryKey: QUERY_KEYS.drugs,
    queryFn: fetchAllDrugs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetches a single drug by its ID.
 * The query is skipped (disabled) if no ID is provided.
 */
export function useDrug(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.drug(id!),
    queryFn: () => fetchDrugById(id!),
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });
}
