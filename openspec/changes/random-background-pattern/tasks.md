## 1. Background Mode Initialization

- [x] 1.1 Add ordinary-site background mode initialization to the existing pre-hydration layout script, selecting dot or grid with equal probability and skipping `/resume` paths.
- [x] 1.2 Add client-navigation initialization for the first ordinary page entered from `/resume`, while preserving the document-level mode for all later ordinary-site route changes.

## 2. Background Rendering

- [x] 2.1 Update the background renderer to use the selected mode for ordinary pages, keeping the existing dot animation, resize handling, visibility handling, theme updates, and reduced-motion behavior.
- [x] 2.2 Add a separate static grid layer and ensure the ordinary-site dot canvas no longer paints over the selected CSS background surface.
- [x] 2.3 Preserve the current opaque background behavior for `/resume` and its subpaths, including existing mobile hiding rules and resume-specific layout behavior.

## 3. Visual Styling

- [x] 3.1 Add theme-aware low-contrast square-grid styles with stable geometry and fixed background-layer stacking below site content.
- [x] 3.2 Verify the grid and dot layers do not intercept pointer input or change header, content, footer, post image, or resume interactions.
- [x] 3.3 Keep the grid layer static while preserving the Pi-style top-to-bottom fade mask.

## 4. Verification

- [x] 4.1 Verify ordinary pages show either dots or grid after full reload, with repeated reloads able to produce both modes and no visible post-hydration background switch.
- [x] 4.2 Verify client-side navigation preserves the selected background, including navigation from `/resume` into the ordinary site.
- [x] 4.3 Verify light and dark theme changes, reduced-motion preference, desktop and mobile viewports, and direct `/resume` loads preserve the specified behavior.
- [x] 4.4 Run `pnpm lint` and `pnpm build` and resolve any regressions introduced by the background changes.
- [x] 4.5 Verify the grid remains static and the fade mask still reads like the Pi-style vertical fade.
