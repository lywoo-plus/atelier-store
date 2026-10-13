import { getNavigation } from "@/db/queries";

import { SiteHeaderBar } from "./site-header-bar";

/**
 * Site header, rendered by the root layout. A page that opens with a
 * full-bleed hero renders `<HeaderOverlay />`; the header then floats
 * transparent over it and turns solid once the page has scrolled.
 */
export async function SiteHeader() {
  const nav = await getNavigation();
  return <SiteHeaderBar nav={nav} />;
}
