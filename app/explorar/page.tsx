import { ExploreScreen } from "@/components/cinefila/ExploreScreen";
import { LocalExploreScreen } from "@/components/cinefila/LocalExploreScreen";
import { SiteHeader } from "@/components/cinefila/SiteHeader";
import { isLocalMode } from "@/lib/data-mode";

export const dynamic = "force-dynamic";

export default async function ExplorarPage() {
  if (isLocalMode()) {
    return (
      <main className="min-h-screen pb-16">
        <SiteHeader />
        <LocalExploreScreen />
      </main>
    );
  }

  const { getCatalog } = await import("@/lib/movies");
  const movies = await getCatalog();

  return (
    <main className="min-h-screen pb-16">
      <SiteHeader />
      <ExploreScreen movies={movies} />
    </main>
  );
}
