## Context

See `proposal.md` for the motivation and user-facing scope. The current site mounts `DotsBackground` from the root layout. That component owns a fixed canvas, paints an opaque theme-colored rectangle, animates the dot field, and already reacts to theme and reduced-motion changes. The root layout also has a synchronous inline script that resolves the color theme before hydration, while the resume route relies on existing layout and CSS rules that treat its background separately.

## Goals / Non-Goals

**Goals:**

- Establish one document-level background mode for the ordinary site during a full load.
- Make the mode available before hydration so the first painted background is stable.
- Add a CSS-rendered grid without coupling grid geometry to the animated dot renderer.
- Preserve the dot renderer's theme, visibility, resize, and reduced-motion behavior.
- Keep `/resume` and its subpaths on their current background path.

**Non-Goals:**

- Adding a user-facing background picker or persistence across full page loads.
- Randomizing on client-side route changes within the ordinary site.
- Adding more background patterns, animation to the grid, or new runtime dependencies.
- Changing the resume document's visual design or background rules.

## Decisions

### Store the mode on the document root

The existing pre-hydration script will establish a background mode marker on the root document for ordinary pages. The marker is intentionally document-scoped rather than React state or route state: it survives client navigation automatically, is available to CSS before hydration, and does not require a server/client render mismatch workaround.

If an ordinary page is reached from `/resume` through client navigation and no marker exists, the client background controller will initialize the marker once. A full load of `/resume` will not initialize the ordinary-site mode.

**Alternative considered:** storing the mode in `localStorage`. This would make a refresh repeat the previous choice, which conflicts with the requirement that each complete ordinary-site refresh randomizes again.

### Render the grid as CSS, keep the dots in canvas

The grid will use two perpendicular repeating linear gradients so its size, line weight, and color remain declarative and theme-aware. A viewport mask will fade only the grid lines from top to bottom, leaving the page background color solid. The existing canvas will stop obscuring the page background only for ordinary-site rendering; its dot pixels will be drawn over the selected CSS surface. The grid layer and canvas will share a fixed, pointer-events-disabled background stack below site content.

**Alternative considered:** drawing both patterns inside canvas. That would duplicate CSS theme logic, make the static grid dependent on a repaint loop, and make the grid harder to tune responsively.

### Use explicit mode visibility instead of mounting one mode per route

The background component will expose both rendering layers and use the document mode marker to show the selected ordinary-site layer. This avoids remounting the background during ordinary client navigation and keeps the mode stable. The resume route will be detected as a separate scope and will retain the existing opaque dot canvas behavior without the new grid layer.

**Alternative considered:** selecting a random mode in a client effect. That would allow the first render to use the wrong layer and produce a visible flash after hydration.

### Preserve the existing animation policy

The dot layer will continue to use the current reduced-motion and document-visibility checks. The grid layer will remain static and rely on a viewport mask to fade the grid from top to bottom. Theme changes will update colors in the same way the current dot renderer updates its color, without replacing the selected mode.

**Alternative considered:** adding a slow drift animation to the grid. That was removed in favor of Pi's static fade treatment, which keeps the background calmer and more legible.

## Risks / Trade-offs

- [Risk] A pre-hydration script and client route handling could disagree about whether the current route is a resume route. -> [Mitigation] Use the same `/resume` path-prefix rule in both paths and keep the root marker scoped to ordinary pages.
- [Risk] Making the canvas transparent could reveal the wrong surface if mode visibility or layer ordering is incomplete. -> [Mitigation] Define one explicit background stack, test both modes in light and dark themes, and keep the resume-specific opaque behavior.
- [Risk] Very low-contrast grid lines may disappear in one theme or become distracting in another. -> [Mitigation] Derive line colors from theme foreground values with low alpha, keep the mask gradual, and verify at desktop and mobile viewport sizes.
- [Risk] A client navigation from `/resume` has no existing ordinary-site mode to preserve. -> [Mitigation] Treat the first ordinary page entered from resume as an initialization boundary, then preserve that selection for the rest of the client session.

## Migration Plan

1. Add the ordinary-site mode marker and background layer styles.
2. Update the background renderer while preserving the existing resume-specific path.
3. Verify full reload randomization, client navigation persistence, theme changes, reduced motion, and resume behavior in development and production builds.
4. Roll back by removing the mode marker and grid layer changes; the existing dot canvas remains the fallback renderer.
