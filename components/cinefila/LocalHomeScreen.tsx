"use client";

import { HomeScreen } from "@/components/cinefila/HomeScreen";
import { useLocalCatalog } from "@/lib/local-catalog";

export function LocalHomeScreen() {
  const { movies, createReview } = useLocalCatalog();

  return <HomeScreen movies={movies} onCreateReview={createReview} />;
}
