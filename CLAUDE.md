# Vivid Life Theme — Claude Code

Claude Code port of the Vivid Life Theme design system (4 flavors × 6 variants = 24 themes, WCAG AA verified), shipped as a Claude Code plugin. Companion to the other [vivid-life-theme ports](https://github.com/orgs/vivid-life-theme/repositories) (VS Code, Windows Terminal, xfce4-terminal, fish, PowerShell, Starship).

## Key Config Files

| File                                       | Purpose                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `build.mjs`                                | Generates `themes/*.json` and `.claude-plugin/plugin.json`; `--check` fails on drift   |
| `src/roles.mjs`                            | Claude Code token → foundation colour target, grouped by contrast gate                 |
| `src/theme-template.mjs`                   | Pure `buildTheme(flavor, variant, tokens)`; resolves targets over `bg_terminal`        |
| `src/theme-template.test.mjs`              | Token-name guard plus contrast and distinctness gates for all 24 themes                |
| `.claude-plugin/marketplace.json`          | Single-plugin marketplace (`vivid-life`) so users can `/plugin install` from this repo |
| `.claude-plugin/plugin.json`               | Generated — plugin manifest; version follows `package.json`                            |
| `.claude/learnings.md`                     | Corrections and observations logged during sessions                                    |
| `.claude/settings.json`                    | Permissions, hooks, environment variables                                              |
| `.claude/skills/vivid-life-theme/SKILL.md` | Verbatim copy of the foundation's `handoff/SKILL.md`                                   |
| `.claudeignore`                            | Excludes `node_modules/` from Claude Code's project indexing                           |
| `.githooks/pre-commit`                     | gitleaks secret scan on staged changes (`git config core.hooksPath .githooks`)         |
| `.github/workflows/ci.yml`                 | `npm test`, `npm run check` and `format:check` on every PR and push to `main`          |
| `.gitignore`                               | Git ignore patterns                                                                    |
| `.prettierignore`                          | Keeps prettier off generated outputs                                                   |
| `package.json`                             | npm scripts (`build`, `check`, `test`, `format`) and the design-system devDependency   |

## Commands

- `npm run build` — regenerate `themes/*.json` and `.claude-plugin/plugin.json` from `@vivid-life-theme/design-system`
- `npm run check` — exit non-zero if the generated files are out of date
- `npm test` — run `src/theme-template.test.mjs` (node:test)
- `npm run format` / `npm run format:check` — prettier
- `claude plugin validate .` — validate the marketplace and plugin manifests

## Structure

- `themes/*.json` — generated, one [custom theme](https://code.claude.com/docs/en/terminal-config#create-a-custom-theme) per flavor×variant (`vivid-life-<flavor>-<variant>.json`): `name` (`Vivid Life <Flavor> · <Variant>`), `base` (the flavor type, `dark` / `light`), `overrides`. Committed to git; the plugin loads them through the default `themes/` scan. **Never hand-edit.**
- `src/roles.mjs` — the only place colour decisions live. Four gated groups: `TEXT` (4.5:1 on `bg_terminal`), `UI` (3:1), `BACKGROUNDS` (`fg`, `fg_subtle` and every syntax slot at 4.5:1 on them), `INVERSE` (4.5:1 on the accent and status colours).
- `src/theme-template.mjs` — resolves targets with the foundation's `resolveColor()` over `{ surface: 'bg_terminal' }`, and adds `border.*`, `accent_on`, `shimmer:<target>` and `{ dark, light }` targets.

## References

Use the `vivid-life-theme` skill to fetch the design-system tokens and README before changing a mapping — don't hardcode colours from memory. The Claude Code token list is in the [terminal-config docs](https://code.claude.com/docs/en/terminal-config#create-a-custom-theme); `skill`, `background`, `composerSidebarBackground` and `claudeBlue(Shimmer)_FOR_SYSTEM_SPINNER` are accepted but undocumented (found in the `/theme` editor). Claude Code silently drops unknown tokens, so `CLAUDE_CODE_TOKENS` in the test file is the guard against typos.

## Conventions

- Gate everything against `surface.bg_terminal`, not `bg`. Claude Code draws on the terminal's background and can't set it.
- Overlays come from the foundation's `overlay` recipes via `resolveColor(…, 'overlay.<name>', { surface: 'bg_terminal' })`. Don't keep a port-side alpha table.
- `inverseText` follows the foundation's `--vl-accent-on` rule (gray-900 on dark flavors, gray-100 on light), not `readableOn(accent)`, which picks light text on Midnight's yellow.500 accent.
- `userMessageBackgroundHover` uses `overlay.inactive_selection`, not `overlay.selected`: the selected-item wash only gates `fg`, and a message can carry `fg_subtle`.
- Shimmer = same hue one rung further from the background (stays AA); at the end of the ramp, one rung back if that still clears 4.5:1.
- Gate exemptions are explicit and listed in the test file (`SUBAGENT_EXEMPT`), mirroring the foundation's `distinct.ansi.exempt`. Add to them only for palette limits, with the reason.
- The plugin name is `vivid-life-theme`; don't put `claude` in it (`claude plugin validate` flags names that read as Anthropic's own).

## Don't

- Don't hand-edit `themes/*.json` or `.claude-plugin/plugin.json`
- Don't hardcode hex values in `src/` — map to a foundation target instead; if none fits, that's a foundation gap
- Don't commit secrets or credentials to git

## Learnings

When the user corrects a mistake or points out a recurring issue, append a one-line summary to .claude/learnings.md. Don't modify CLAUDE.md directly.

## Compact Instructions

When compacting, preserve: list of modified files, current test status, open TODOs, and key decisions made.
