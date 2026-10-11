// Which foundation colour feeds which Claude Code theme token.
//
// Claude Code draws on the terminal's own background, which it doesn't
// control. Every target here is therefore resolved against — and gated
// on — the flavor's `surface.bg_terminal`, the background the sibling
// terminal ports (Windows Terminal, xfce4-terminal, VS Code's terminal)
// paint. `overlay.*` targets are flattened over it.
//
// Target vocabulary is the foundation's `resolveColor()` vocabulary
// (accent, hue.<hue>, semantic.<role>, fg…, ansi.<slot>, overlay.<name>),
// plus four port-side forms resolved in theme-template.mjs:
//
//   border.<name>     flavors[flavor].border[name]
//   accent_on         --vl-accent-on: gray-900 on dark flavors, gray-100 on light
//   shimmer:<target>  the next rung of <target>'s hue away from the
//                     background — see theme-template.mjs
//   { dark, light }   a different target per flavor type
//
// Each group carries its own gate (theme-template.test.mjs):
//   TEXT        ≥ 4.5:1 on bg_terminal
//   UI          ≥ 3:1 on bg_terminal (borders, bars, faint hints)
//   BACKGROUNDS fg, fg_subtle and every syntax slot ≥ 4.5:1 on them
//   INVERSE     ≥ 4.5:1 on the accent and the status colours
//
// Token names: https://code.claude.com/docs/en/terminal-config#create-a-custom-theme

/** Foreground roles: text, labels, mode accents. */
export const TEXT = {
  // Text ramp
  text: "fg",
  inactive: "fg_subtle",
  inactiveShimmer: "fg_muted",

  // The variant accent: brand, spinner, dialogs, picker highlight
  claude: "accent",
  claudeShimmer: "shimmer:accent",
  permission: "accent",
  permissionShimmer: "shimmer:accent",
  suggestion: "accent",
  effortUltra: "accent",
  briefLabelClaude: "accent",
  briefLabelYou: "fg",

  // Status — the foundation's semantic roles
  success: "semantic.success",
  error: "semantic.danger",
  warning: "semantic.warning",
  warningShimmer: "shimmer:semantic.warning",

  // Informational indicators
  remember: "semantic.info",
  ide: "semantic.info",
  background: "semantic.info",
  planMode: "semantic.info",
  claudeBlue_FOR_SYSTEM_SPINNER: "semantic.info",
  claudeBlueShimmer_FOR_SYSTEM_SPINNER: "shimmer:semantic.info",

  // Mode indicators that keep a fixed hue across variants
  autoAccept: "hue.purple",
  autoAcceptShimmer: "shimmer:hue.purple",
  skill: "hue.purple",
  merged: "hue.purple",
  fastMode: "hue.orange",
  fastModeShimmer: "shimmer:hue.orange",

  // Subagent colours: the six variant hues at their accent rung. Cyan
  // isn't a variant hue; it takes the ANSI slot that carries it. The
  // palette has no pink: on dark flavors the light red rung reads pink, but
  // on light ones the deep reds turn brown and sit on top of orange
  // (ΔE 3.4 on Dawn), so pink takes the deep magenta there instead.
  red_FOR_SUBAGENTS_ONLY: "hue.red",
  orange_FOR_SUBAGENTS_ONLY: "hue.orange",
  yellow_FOR_SUBAGENTS_ONLY: "hue.yellow",
  green_FOR_SUBAGENTS_ONLY: "hue.green",
  blue_FOR_SUBAGENTS_ONLY: "hue.blue",
  purple_FOR_SUBAGENTS_ONLY: "hue.purple",
  pink_FOR_SUBAGENTS_ONLY: {
    dark: "ansi.bright_red",
    light: "ansi.bright_magenta",
  },
  cyan_FOR_SUBAGENTS_ONLY: "ansi.cyan",

  // `ultrathink` rainbow. Seven bands, six hues: indigo folds into blue.
  rainbow_red: "hue.red",
  rainbow_orange: "hue.orange",
  rainbow_yellow: "hue.yellow",
  rainbow_green: "hue.green",
  rainbow_blue: "hue.blue",
  rainbow_indigo: "hue.blue",
  rainbow_violet: "hue.purple",
  rainbow_red_shimmer: "shimmer:hue.red",
  rainbow_orange_shimmer: "shimmer:hue.orange",
  rainbow_yellow_shimmer: "shimmer:hue.yellow",
  rainbow_green_shimmer: "shimmer:hue.green",
  rainbow_blue_shimmer: "shimmer:hue.blue",
  rainbow_indigo_shimmer: "shimmer:hue.blue",
  rainbow_violet_shimmer: "shimmer:hue.purple",
};

/** Non-text roles: borders, the usage bar, and the faintest hint grey. */
export const UI = {
  promptBorder: "border.control",
  promptBorderShimmer: "fg_subtle",
  bashBorder: "hue.green",
  // Claude Code's faintest grey (built-in presets put it near 2:1). The
  // foundation's control boundary is the faintest grey it gates at 3:1.
  subtle: "border.control",
  rate_limit_fill: "accent",
  rate_limit_empty: "border.control",
};

/** Surfaces behind text. All overlays are flattened over bg_terminal. */
export const BACKGROUNDS = {
  diffAdded: "overlay.diff_inserted_line",
  diffRemoved: "overlay.diff_removed_line",
  diffAddedWord: "overlay.diff_inserted_text",
  diffRemovedWord: "overlay.diff_removed_text",
  // The foundation has no dimmed diff recipe; Claude Code dims the text.
  diffAddedDimmed: "overlay.diff_inserted_line",
  diffRemovedDimmed: "overlay.diff_removed_line",

  selectionBg: "overlay.selection",

  userMessageBackground: "overlay.line_highlight",
  // Not `overlay.selected`: that wash only gates `fg`, and a message can
  // carry fg_subtle text. inactive_selection is a code overlay, gated for
  // every text colour.
  userMessageBackgroundHover: "overlay.inactive_selection",
  bashMessageBackgroundColor: "overlay.line_highlight",
  memoryBackgroundColor: "overlay.line_highlight",
  composerSidebarBackground: "overlay.line_highlight",
};

/** Text drawn on a coloured fill (status badges). */
export const INVERSE = {
  inverseText: "accent_on",
};
