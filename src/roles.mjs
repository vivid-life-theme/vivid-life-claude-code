// Which foundation colour feeds which Claude Code theme token.
//
// Claude Code draws on the terminal's own background, which it doesn't
// control. Every target here is therefore resolved against — and gated
// on — the flavor's `surface.bg_terminal`, the background the sibling
// terminal ports (Windows Terminal, xfce4-terminal, VS Code's terminal)
// paint. `overlay.*` targets are flattened over it.
//
// The colour decisions live in the foundation's `app_roles`; this file only
// maps Claude Code's token names onto them. Targets are the foundation's
// `resolveColor()` vocabulary (fg…, hue.<hue>, ansi.<slot>, …) plus three
// forms resolved in theme-template.mjs:
//
//   app.<role>          app_roles.roles[<role>]
//   mode.<name>         app_roles.mode_hues[<name>], as hue.<hue>
//   categorical.<name>  app_roles.categorical[flavor][<name>]
//
// and `emphasis.<target>` in front of any of them: the spinner / shimmer
// highlight (foundation § 3h).
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
  text: "app.text",
  inactive: "app.inactive",
  inactiveShimmer: "emphasis.app.inactive",

  // The variant accent: brand, spinner, dialogs, picker highlight
  claude: "app.brand",
  claudeShimmer: "emphasis.app.brand",
  permission: "app.permission",
  permissionShimmer: "emphasis.app.permission",
  suggestion: "app.suggestion",
  effortUltra: "app.brand",
  briefLabelClaude: "app.brand",
  briefLabelYou: "app.text",

  // Status — the foundation's semantic roles
  success: "app.success",
  error: "app.error",
  warning: "app.warning",
  warningShimmer: "emphasis.app.warning",

  // Informational indicators
  remember: "app.info",
  ide: "app.info",
  background: "app.info",
  claudeBlue_FOR_SYSTEM_SPINNER: "app.info",
  claudeBlueShimmer_FOR_SYSTEM_SPINNER: "emphasis.app.info",

  // Mode indicators: one fixed hue per state across variants
  planMode: "mode.plan",
  autoAccept: "mode.auto_accept",
  autoAcceptShimmer: "emphasis.mode.auto_accept",
  fastMode: "mode.fast",
  fastModeShimmer: "emphasis.mode.fast",
  skill: "hue.purple",
  merged: "app.merged",

  // Subagent colours: the foundation's named colours
  red_FOR_SUBAGENTS_ONLY: "categorical.red",
  orange_FOR_SUBAGENTS_ONLY: "categorical.orange",
  yellow_FOR_SUBAGENTS_ONLY: "categorical.yellow",
  green_FOR_SUBAGENTS_ONLY: "categorical.green",
  blue_FOR_SUBAGENTS_ONLY: "categorical.blue",
  purple_FOR_SUBAGENTS_ONLY: "categorical.purple",
  pink_FOR_SUBAGENTS_ONLY: "categorical.pink",
  cyan_FOR_SUBAGENTS_ONLY: "categorical.cyan",

  // `ultrathink` rainbow: red → purple in the named colours' order. Seven
  // bands, six colours: indigo folds into blue.
  rainbow_red: "categorical.red",
  rainbow_orange: "categorical.orange",
  rainbow_yellow: "categorical.yellow",
  rainbow_green: "categorical.green",
  rainbow_blue: "categorical.blue",
  rainbow_indigo: "categorical.blue",
  rainbow_violet: "categorical.purple",
  rainbow_red_shimmer: "emphasis.categorical.red",
  rainbow_orange_shimmer: "emphasis.categorical.orange",
  rainbow_yellow_shimmer: "emphasis.categorical.yellow",
  rainbow_green_shimmer: "emphasis.categorical.green",
  rainbow_blue_shimmer: "emphasis.categorical.blue",
  rainbow_indigo_shimmer: "emphasis.categorical.blue",
  rainbow_violet_shimmer: "emphasis.categorical.purple",
};

/** Non-text roles: borders, the usage bar, and the faintest hint grey. */
export const UI = {
  promptBorder: "app.input_border",
  promptBorderShimmer: "fg_subtle",
  bashBorder: "mode.shell",
  subtle: "app.hint",
  rate_limit_fill: "app.meter_fill",
  rate_limit_empty: "app.meter_track",
};

/** Surfaces behind text. All overlays are flattened over bg_terminal. */
export const BACKGROUNDS = {
  diffAdded: "app.diff_inserted",
  diffRemoved: "app.diff_removed",
  diffAddedWord: "app.diff_inserted_word",
  diffRemovedWord: "app.diff_removed_word",
  diffAddedDimmed: "app.diff_inserted_dimmed",
  diffRemovedDimmed: "app.diff_removed_dimmed",

  selectionBg: "app.selection",

  userMessageBackground: "app.message",
  userMessageBackgroundHover: "app.message_hover",
  bashMessageBackgroundColor: "app.message",
  memoryBackgroundColor: "app.message",
  composerSidebarBackground: "app.message",
};

/** Text drawn on a coloured fill (status badges). */
export const INVERSE = {
  inverseText: "app.on_accent",
};
