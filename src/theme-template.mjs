// Maps Vivid Life foundation tokens to a Claude Code custom theme.
// One pure function: (flavor, variant, tokens) -> theme JSON object.
// https://code.claude.com/docs/en/terminal-config#create-a-custom-theme

import {
  contrast,
  resolveColor,
} from "@vivid-life-theme/design-system/tools/build-tokens";

import { BACKGROUNDS, INVERSE, TEXT, UI } from "./roles.mjs";

export const FLAVORS = ["midnight", "twilight", "dawn", "noon"];

const SURFACE = "bg_terminal";
const RUNGS = ["100", "300", "500", "700", "800", "900"];

const label = (s) => s[0].toUpperCase() + s.slice(1);

/** Theme file slug, e.g. `vivid-life-midnight-purple`. */
export function slug(flavor, variant) {
  return `vivid-life-${flavor}-${variant}`;
}

/**
 * A spinner shimmer: the same hue one rung further from the background,
 * so the sweep never drops the label below AA. At the end of the ramp
 * (dark flavor on 100, light flavor on 900) it steps one rung back toward
 * the background instead, if that rung still clears 4.5:1.
 */
function shimmer(tokens, flavor, hex) {
  const f = tokens.flavors[flavor];
  const bg = f.surface[SURFACE];
  for (const [hue, ramp] of Object.entries(tokens.palette)) {
    const i = RUNGS.findIndex(
      (r) => ramp[r]?.toLowerCase() === hex.toLowerCase(),
    );
    if (i < 0) continue;
    const out = f.type === "dark" ? -1 : 1;
    for (const j of [i + out, i - out]) {
      const candidate = tokens.palette[hue][RUNGS[j]];
      if (candidate && contrast(candidate, bg) >= 4.5) return candidate;
    }
  }
  throw new Error(`shimmer: no AA rung beside ${hex} on ${flavor}`);
}

/** Resolve one role target to a hex for (flavor, variant). */
export function resolveTarget(tokens, flavor, variant, target) {
  const f = tokens.flavors[flavor];
  if (typeof target === "object") {
    return resolveTarget(tokens, flavor, variant, target[f.type]);
  }
  if (target.startsWith("shimmer:")) {
    return shimmer(
      tokens,
      flavor,
      resolveTarget(tokens, flavor, variant, target.slice(8)),
    );
  }
  if (target === "accent_on") {
    // The foundation's --vl-accent-on rule (README § `--vl-accent-on`): dark
    // flavors carry bright accents, light flavors deep ones. Not
    // readableOn(accent), which picks light text on Midnight's yellow.500.
    return tokens.palette.gray[f.type === "dark" ? "900" : "100"];
  }
  if (target.startsWith("border.")) {
    const hex = f.border[target.slice(7)];
    if (!hex) throw new Error(`resolveTarget: unknown border "${target}"`);
    return hex;
  }
  return resolveColor(tokens, flavor, variant, target, { surface: SURFACE });
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
