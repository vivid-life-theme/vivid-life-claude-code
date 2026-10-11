import { test } from "node:test";
import assert from "node:assert/strict";
import tokens from "@vivid-life-theme/design-system";
import {
  contrast,
  deltaE,
} from "@vivid-life-theme/design-system/tools/build-tokens";

import { BACKGROUNDS, INVERSE, TEXT, UI } from "./roles.mjs";
import { buildTheme, FLAVORS, slug } from "./theme-template.mjs";

// Every token Claude Code accepts in `overrides`. Claude Code silently
// drops an unknown key, so a typo would ship as "looks like the base
// preset" — this list is the guard.
// https://code.claude.com/docs/en/terminal-config#create-a-custom-theme
// (plus `skill`, `background`, `composerSidebarBackground` and the system
// spinner pair, which the interactive /theme editor lists but the docs omit).
const CLAUDE_CODE_TOKENS = new Set([
  "claude",
  "claudeShimmer",
  "claudeBlue_FOR_SYSTEM_SPINNER",
  "claudeBlueShimmer_FOR_SYSTEM_SPINNER",
  "text",
  "inverseText",
  "inactive",
  "inactiveShimmer",
  "subtle",
  "suggestion",
  "permission",
  "permissionShimmer",
  "remember",
  "background",
  "skill",
  "success",
  "error",
  "warning",
  "warningShimmer",
  "merged",
  "promptBorder",
  "promptBorderShimmer",
  "planMode",
  "autoAccept",
  "autoAcceptShimmer",
  "bashBorder",
  "ide",
  "fastMode",
  "fastModeShimmer",
  "effortUltra",
  "diffAdded",
  "diffRemoved",
  "diffAddedDimmed",
  "diffRemovedDimmed",
  "diffAddedWord",
  "diffRemovedWord",
  "userMessageBackground",
  "userMessageBackgroundHover",
  "bashMessageBackgroundColor",
  "memoryBackgroundColor",
  "composerSidebarBackground",
  "selectionBg",
  "rate_limit_fill",
  "rate_limit_empty",
  "briefLabelYou",
  "briefLabelClaude",
  ...["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"].map(
    (c) => `${c}_FOR_SUBAGENTS_ONLY`,
  ),
  ...["red", "orange", "yellow", "green", "blue", "indigo", "violet"].flatMap(
    (c) => [`rainbow_${c}`, `rainbow_${c}_shimmer`],
  ),
]);

const BASES = [
  "dark",
  "light",
  "dark-daltonized",
  "light-daltonized",
  "dark-ansi",
  "light-ansi",
];
const SUBAGENT_COLORS = Object.keys(TEXT).filter((k) =>
  k.endsWith("_FOR_SUBAGENTS_ONLY"),
);

function* themes() {
  for (const flavor of FLAVORS) {
    for (const variant of tokens.variant_hues) {
      yield {
        flavor,
        variant,
        f: tokens.flavors[flavor],
        theme: buildTheme(flavor, variant, tokens),
      };
    }
  }
}

test("builds all 24 flavor × variant combinations", () => {
  assert.equal([...themes()].length, 24);
});

test("theme has Claude Code's file shape", () => {
  for (const { flavor, variant, theme } of themes()) {
    assert.deepEqual(Object.keys(theme).sort(), ["base", "name", "overrides"]);
    assert.ok(BASES.includes(theme.base), `${flavor}/${variant} base`);
    assert.match(
      theme.name,
      /^Vivid Life (Midnight|Twilight|Dawn|Noon) · (Red|Orange|Yellow|Green|Blue|Purple)$/,
    );
    assert.equal(slug(flavor, variant), `vivid-life-${flavor}-${variant}`);
  }
});

test("every override is a known Claude Code token with a 6-digit hex value", () => {
  for (const { flavor, variant, theme } of themes()) {
    for (const [token, value] of Object.entries(theme.overrides)) {
      assert.ok(
        CLAUDE_CODE_TOKENS.has(token),
        `unknown Claude Code token "${token}"`,
      );
      assert.match(value, /^#[0-9a-f]{6}$/, `${flavor}/${variant} ${token}`);
    }
  }
});

test("each token is mapped in exactly one role group", () => {
  const seen = new Set();
  for (const group of [TEXT, UI, BACKGROUNDS, INVERSE]) {
    for (const token of Object.keys(group)) {
      assert.ok(!seen.has(token), `${token} is mapped twice`);
      seen.add(token);
    }
  }
});

test("base preset follows the flavor type", () => {
  for (const { flavor, f, theme } of themes()) {
    assert.equal(theme.base, f.type, flavor);
  }
});

test("claude accent matches the accent-shade table", () => {
  for (const { flavor, variant, theme } of themes()) {
    const expected =
      tokens.palette[variant][tokens.accent_shade[flavor][variant]];
    assert.equal(theme.overrides.claude, expected, `${flavor}/${variant}`);
  }
});

test("TEXT roles clear 4.5:1 on bg_terminal", () => {
  for (const { flavor, variant, f, theme } of themes()) {
    for (const token of Object.keys(TEXT)) {
      const ratio = contrast(theme.overrides[token], f.surface.bg_terminal);
      assert.ok(
        ratio >= 4.5,
        `${flavor}/${variant} ${token} ${ratio.toFixed(2)}:1`,
      );
    }
  }
});

test("UI roles clear 3:1 on bg_terminal", () => {
  for (const { flavor, variant, f, theme } of themes()) {
    for (const token of Object.keys(UI)) {
      const ratio = contrast(theme.overrides[token], f.surface.bg_terminal);
      assert.ok(
        ratio >= 3,
        `${flavor}/${variant} ${token} ${ratio.toFixed(2)}:1`,
      );
    }
  }
});

test("text and every syntax slot clear 4.5:1 on each background role", () => {
  for (const { flavor, variant, f, theme } of themes()) {
    const fgs = { fg: f.text.fg, fg_subtle: f.text.fg_subtle, ...f.syntax };
    for (const token of Object.keys(BACKGROUNDS)) {
      for (const [name, fg] of Object.entries(fgs)) {
        const ratio = contrast(fg, theme.overrides[token]);
        assert.ok(
          ratio >= 4.5,
          `${flavor}/${variant} ${name} on ${token} ${ratio.toFixed(2)}:1`,
        );
      }
    }
  }
});

test("inverseText clears 4.5:1 on the accent and the status colours", () => {
  for (const { flavor, variant, theme } of themes()) {
    const o = theme.overrides;
    for (const fill of ["claude", "success", "error", "warning"]) {
      const ratio = contrast(o.inverseText, o[fill]);
      assert.ok(
        ratio >= 4.5,
        `${flavor}/${variant} inverseText on ${fill} ${ratio.toFixed(2)}:1`,
      );
    }
  }
});

test("shimmers differ visibly from the colour they animate", () => {
  for (const { flavor, variant, theme } of themes()) {
    const o = theme.overrides;
    for (const token of Object.keys(TEXT).filter((k) =>
      /Shimmer|_shimmer/.test(k),
    )) {
      const base = token.replace(/_shimmer$/, "").replace(/Shimmer/, "");
      const d = deltaE(o[base], o[token]);
      assert.ok(d >= 5, `${flavor}/${variant} ${token} ΔE ${d.toFixed(1)}`);
    }
  }
});

test("subagent colours are told apart", () => {
  // Their only job is to distinguish parallel agents — the foundation's
  // ≥ 7 OKLab floor for named colours, with no exemptions.
  const name = (k) => k.replace("_FOR_SUBAGENTS_ONLY", "");
  for (const { flavor, variant, theme } of themes()) {
    const o = theme.overrides;
    for (const [i, a] of SUBAGENT_COLORS.entries()) {
      for (const b of SUBAGENT_COLORS.slice(i + 1)) {
        const d = deltaE(o[a], o[b]);
        assert.ok(
          d >= 7,
          `${flavor}/${variant} ${name(a)} vs ${name(b)} ΔE ${d.toFixed(1)}`,
        );
      }
    }
  }
});

test("terminal selection is the foundation's resolved terminal selection", () => {
  for (const { flavor, variant, f, theme } of themes()) {
    assert.equal(
      theme.overrides.selectionBg,
      f.overlay[variant].selection.terminal.flat,
    );
  }
});
