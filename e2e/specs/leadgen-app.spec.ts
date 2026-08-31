/**
 * Integration spec for @silverassist/leadgen-app consumed by a real Next
 * app. The fixture installs the *packed tarball*, so this runs against
 * exactly what npm would publish -- the point is proving the "use client"
 * directive survives the build, which no unit test can see.
 */
import { expect, test } from "@playwright/test";

test("renders inside a Server Component page without a client-boundary error", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("leadgen-app fixture");
});

test("renders the loading placeholder before script load", async ({ page }) => {
  await page.goto("/");
  // The fixture has no Tailwind pipeline, so the placeholder's min-h-* class
  // has no computed size here -- assert it exists in the DOM, not that it's
  // visually visible (that's a CSS concern the site's own build handles).
  await expect(page.locator("main > div").first()).toBeAttached();
});
