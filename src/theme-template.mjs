// Maps Vivid Life foundation tokens to a Claude Code custom theme.
// One pure function: (flavor, variant, tokens) -> theme JSON object.
// https://code.claude.com/docs/en/terminal-config#create-a-custom-theme

import { resolveColor } from "@vivid-life-theme/design-system/tools/build-tokens";

import { BACKGROUNDS, INVERSE, TEXT, UI } from "./roles.mjs";

export const FLAVORS = ["midnight", "twilight", "dawn", "noon"];

const SURFACE = "bg_terminal";

const label = (s) => s[0].toUpperCase() + s.slice(1);

/** Theme file slug, e.g. `vivid-life-midnight-purple`. */
export function slug(flavor, variant) {
  return `vivid-life-${flavor}-${variant}`;
}

/**
 * Expand the port's `app.` / `mode.` / `categorical.` targets (see
 * roles.mjs) into the foundation's `resolveColor()` vocabulary, inside
 * `emphasis.` as well.
 */
function expand(tokens, flavor, target) {
  if (target.startsWith("emphasis.")) {
    return `emphasis.${expand(tokens, flavor, target.slice(9))}`;
  }
  const dot = target.indexOf(".");
  const name = target.slice(dot + 1);
  const { roles, mode_hues, categorical } = tokens.app_roles;
  const expanded = {
    app: roles[name] && (roles[name].color ?? roles[name].background),
    mode: mode_hues[name] && `hue.${mode_hues[name]}`,
    categorical: categorical[flavor][name],
  }[target.slice(0, dot)];
  if (expanded) return expanded;
  if (/^(app|mode|categorical)\./.test(target)) {
    throw new Error(`resolveTarget: unknown app_roles entry "${target}"`);
  }
  return target;
}

/** Resolve one role target to a hex for (flavor, variant). */
export function resolveTarget(tokens, flavor, variant, target) {
  return resolveColor(tokens, flavor, variant, expand(tokens, flavor, target), {
    surface: SURFACE,
  });
}

export function buildTheme(flavor, variant, tokens) {
  const f = tokens.flavors[flavor];
  const overrides = {};
  for (const group of [TEXT, UI, BACKGROUNDS, INVERSE]) {
    for (const [token, target] of Object.entries(group)) {
      overrides[token] = resolveTarget(
        tokens,
        flavor,
        variant,
        target,
      ).toLowerCase();
    }
  }
  return {
    name: `Vivid Life ${label(flavor)} · ${label(variant)}`,
    base: f.type,
    overrides,
  };
}
