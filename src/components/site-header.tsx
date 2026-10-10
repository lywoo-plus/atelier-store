import { getNavigation } from "@/db/queries";

import { SiteHeaderBar } from "./site-header-bar";

/**
 * Site header. With `overlay` it floats transparent over the hero and turns
 * solid once the page has scrolled.
 */
export async function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const nav = await getNavigation();
  return <SiteHeaderBar overlay={overlay} nav={nav} />;
}
