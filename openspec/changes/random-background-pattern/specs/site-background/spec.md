## Purpose

为博客普通页面提供稳定、低干扰且具有随机变化的背景体验，同时保留现有点阵背景行为并隔离简历页面的视觉表现。

## ADDED Requirements

### Requirement: Select a background on full page loads

普通博客页面在每次完整页面加载时 SHALL 在点阵背景和格子背景之间以相等概率选择一种背景，并在页面首次可见时使用该选择。

#### Scenario: Full load selects the dot background

- **WHEN** a user loads a non-resume page and the random selection chooses the dot background
- **THEN** the page displays the existing animated dot background

#### Scenario: Full load selects the grid background

- **WHEN** a user loads a non-resume page and the random selection chooses the grid background
- **THEN** the page displays a low-contrast square grid background

#### Scenario: The selected background is immediately available

- **WHEN** the browser begins rendering a non-resume page
- **THEN** the selected background mode is available before the page becomes interactive and the background does not visibly switch after hydration

### Requirement: Preserve the background across client navigation

普通博客页面之间通过客户端路由进行导航时 SHALL 保持当前背景选择，不因路径改变而重新随机选择。

#### Scenario: Navigate between ordinary pages

- **WHEN** a user navigates from one non-resume page to another without a full document reload
- **THEN** the background mode remains the same throughout the navigation

#### Scenario: Enter the ordinary site from the resume page

- **WHEN** a user navigates from `/resume` to a non-resume page without a full document reload and no ordinary-site background has been selected yet
- **THEN** the ordinary site selects one background mode once and preserves it for subsequent client navigation

### Requirement: Adapt both backgrounds to the active color theme

两种背景 SHALL 与当前亮色或暗色主题保持足够的对比度和低视觉干扰，并 SHALL 响应主题切换而不改变当前背景模式。

#### Scenario: Switch the color theme

- **WHEN** a user switches between light and dark theme while viewing either background
- **THEN** the current background mode remains selected and its colors update to match the active theme

#### Scenario: Respect reduced motion

- **WHEN** the user agent indicates `prefers-reduced-motion: reduce`
- **THEN** the dot background does not animate and the grid background remains visible without motion

### Requirement: Keep the grid background static

普通站点中的格子背景 SHALL 保持静态，只使用 Pi 风格的纵向淡出遮罩，不应引入滚动、漂移或其他位置动画。

#### Scenario: View the grid on an ordinary page

- **WHEN** a user views the grid background on a non-resume page
- **THEN** the grid remains in a fixed position while the top-to-bottom fade makes lower rows progressively less visible

#### Scenario: Reduced motion does not change the grid

- **WHEN** the user agent indicates `prefers-reduced-motion: reduce`
- **THEN** the grid continues to render statically with the same fade mask

### Requirement: Keep the resume page unchanged

`/resume` 及其子路径 SHALL 保持现有背景行为，不使用新的随机背景选择，也不显示新增的格子背景。

#### Scenario: Load a resume page directly

- **WHEN** a user performs a full page load on `/resume` or one of its subpaths
- **THEN** the resume page uses its existing background behavior and does not participate in ordinary-site background randomization

#### Scenario: Navigate within resume routes

- **WHEN** a user navigates between resume routes without a full document reload
- **THEN** the resume background behavior remains unchanged and no grid background is introduced
