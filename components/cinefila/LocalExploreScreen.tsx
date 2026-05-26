"use client";

import { ExploreScreen } from "@/components/cinefila/ExploreScreen";
import { useLocalCatalog } from "@/lib/local-catalog";

export function LocalExploreScreen() {
  const { movies, createReview } = useLocalCatalog();

  return <ExploreScreen movies={movies} onCreateReview={createReview} />;
}
