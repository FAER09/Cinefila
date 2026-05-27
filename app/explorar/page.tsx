import { LocalExploreScreen } from "@/components/cinefila/LocalExploreScreen";
import { SiteHeader } from "@/components/cinefila/SiteHeader";

export const dynamic = "force-dynamic";

export default async function ExplorarPage() {
  return (
    <main className="min-h-screen pb-16">
      <SiteHeader />
      <LocalExploreScreen />
    </main>
  );
}
