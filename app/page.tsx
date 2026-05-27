import { LocalHomeScreen } from "@/components/cinefila/LocalHomeScreen";
import { SiteHeader } from "@/components/cinefila/SiteHeader";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className="min-h-screen pb-16">
      <SiteHeader />
      <LocalHomeScreen />
    </main>
  );
}
