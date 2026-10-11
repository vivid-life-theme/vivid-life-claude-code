# Vivid Life Theme — Claude Code

Color themes for the [Claude Code](https://code.claude.com) interface: the spinner, prompt box, permission dialogs, diffs, mode indicators and the rest. **4 flavors × 6 variants = 24 themes**, all WCAG AA verified. Generated from the [Vivid Life design-system foundation](https://github.com/vivid-life-theme/vivid-life-design-system), so colors and contrast ratios come from a single source of truth.

## Flavors

In time-of-day order. Claude Code draws on your terminal's background, so each flavor is built and checked against its **terminal** background:

| Flavor       | Type  | Terminal background |
| ------------ | ----- | ------------------- |
| **Midnight** | dark  | `#0a0a0a`           |
| **Twilight** | dark  | `#333333`           |
| **Dawn**     | light | `#d4d4d4`           |
| **Noon**     | light | `#ffffff`           |

## Variants

Each flavor comes in six accent variants: **Red · Orange · Yellow · Green · Blue · Purple**. The variant sets the accent: the spinner, the assistant label, permission dialogs, picker highlights and the usage bar. Status colors, mode indicators and diff tints stay the same across variants.

## Install

### As a plugin (recommended)

In Claude Code:

```text
/plugin marketplace add vivid-life-theme/vivid-life-claude-code
/plugin install vivid-life-theme@vivid-life
```

Then run `/theme` and pick one. All 24 appear as `Vivid Life <Flavor> · <Variant>`, marked _from vivid-life-theme_. `/plugin marketplace update vivid-life` picks up new releases.

### Manual

Copy the theme files into your user themes folder:

```bash
mkdir -p ~/.claude/themes
cp themes/*.json ~/.claude/themes/
```

Claude Code watches that folder. If it didn't exist when Claude Code started, restart once.

### Pair it with your terminal

Claude Code doesn't set the terminal's background, and every contrast check here assumes the flavor's terminal background from the table above. Use the matching terminal port, such as [Windows Terminal](https://github.com/vivid-life-theme/vivid-life-windows-terminal), [xfce4-terminal](https://github.com/vivid-life-theme/vivid-life-xfce4-terminal) or [VS Code](https://github.com/vivid-life-theme/vivid-life-vs-code), or set your terminal's background to that value. On any other background the ratios below don't hold.

Default: **Midnight · Purple**, matching the design system's overall default.

## What maps where

The full map, with a reason for each choice, is in [`src/roles.mjs`](src/roles.mjs). In short:

| Claude Code                                                 | Foundation                                                             |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| `claude`, `permission`, `suggestion`, `rate_limit_fill`     | the variant accent                                                     |
| `text` · `inactive` · `subtle`                              | `fg` · `fg_subtle` · `border.control`                                  |
| `success` · `error` · `warning`                             | `semantic.success` · `semantic.danger` · `semantic.warning`            |
| `planMode`, `ide`, `remember`, `background`                 | `semantic.info`                                                        |
| `autoAccept`, `merged`, `skill` · `fastMode` · `bashBorder` | `hue.purple` · `hue.orange` · `hue.green`                              |
| `promptBorder`                                              | `border.control`                                                       |
| `diffAdded` / `diffRemoved`, `…Word`                        | `overlay.diff_{inserted,removed}_{line,text}`                          |
| `selectionBg`                                               | `overlay.selection` (the terminal selection)                           |
| `userMessageBackground` and the other message backgrounds   | `overlay.line_highlight`                                               |
| subagent colors, `ultrathink` rainbow                       | the variant hues at their accent rung; pink and cyan from the ANSI row |
| `…Shimmer`                                                  | the same hue one rung further from the background                      |

Every overlay is flattened over the terminal background. The base preset is `dark` for Midnight and Twilight, `light` for Dawn and Noon.

## Contrast

`npm test` gates all 24 themes against the terminal background:

- every text color, including the shimmer highlights, at **4.5:1**
- borders, the usage bar and `subtle` at **3:1**
- `fg`, `fg_subtle` and all twelve syntax slots at **4.5:1** on every background token (diffs, selection, message backgrounds)
- `inverseText` at **4.5:1** on the accent and the three status colors
- the eight subagent colors at least ΔE 7 apart (OKLab × 100), the floor the foundation uses for syntax and ANSI rows

Known limits:

- **`subtle` is held to 3:1, not 4.5:1.** Claude Code uses it for its faintest hints and rules; the built-in presets put it near 2:1. It takes the foundation's `border.control`, the faintest grey the foundation gates.
- **Red and Orange subagents on Dawn and Noon sit ΔE 6.3 / 6.1 apart.** A light canvas leaves each hue only two AA rungs. They're held to the foundation's "related" floor of 5 instead.
- **There is no selection foreground.** Selected text keeps its own color. `fg`, `fg_subtle` and the syntax slots are gated on the selection; the accent and status colors aren't.
- **Code inside diffs** is colored by Claude Code's syntax theme (`/theme` shows it, `ctrl+t` toggles it), which custom themes can't change. The diff backgrounds are gated against the foundation's syntax colors, not against that theme.
- **Picker order.** `/theme` sorts themes by name, so Dawn lists before Midnight.

## Recommended companion

**Font:** [Atkinson Hyperlegible Mono](https://www.brailleinstitute.org/freefont) for the terminal, or its [Nerd Font variant](https://www.nerdfonts.com/font-downloads) if your prompt uses icon glyphs.

## Contributing

```bash
npm install
npm run build   # regenerate themes/*.json and .claude-plugin/plugin.json
npm test        # contrast and distinctness gates
npm run check   # fail if the generated files are out of date
npm run format  # prettier
```

Edit `src/roles.mjs` to change which foundation color feeds which Claude Code token. Never hand-edit `themes/` or `.claude-plugin/plugin.json`; they're generated.

If you need a color or token that isn't in the foundation, that's a foundation gap. Open an issue against [vivid-life-design-system](https://github.com/vivid-life-theme/vivid-life-design-system) rather than papering over it here.
