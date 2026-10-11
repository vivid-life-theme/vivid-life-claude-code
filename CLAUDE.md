# Vivid Life Theme — Claude Code

Claude Code port of the Vivid Life Theme design system (4 flavors × 6 variants = 24 themes, WCAG AA verified), shipped as a Claude Code plugin. Companion to the other [vivid-life-theme ports](https://github.com/orgs/vivid-life-theme/repositories) (VS Code, Windows Terminal, xfce4-terminal, fish, PowerShell, Starship).

## Key Config Files

| File                                       | Purpose                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `build.mjs`                                | Generates `themes/*.json` and `.claude-plugin/plugin.json`; `--check` fails on drift   |
| `src/roles.mjs`                            | Claude Code token → foundation `app_roles` entry, grouped by contrast gate             |
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
| `.github/workflows/release.yml`            | On push to `main`: bump version from Conventional Commits, tag, GitHub release         |
| `.github/scripts/bump-version.sh`          | Bump logic: `package.json` + rebuilt `plugin.json`, so Claude Code sees an update      |
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
- `src/roles.mjs` — maps Claude Code token names onto the foundation's `app_roles` (the colour decisions live there). Four gated groups: `TEXT` (4.5:1 on `bg_terminal`), `UI` (3:1), `BACKGROUNDS` (`fg`, `fg_subtle` and every syntax slot at 4.5:1 on them), `INVERSE` (4.5:1 on the accent and status colours).
- `src/theme-template.mjs` — resolves targets with the foundation's `resolveColor()` over `{ surface: 'bg_terminal' }`, and expands the `app.<role>`, `mode.<name>` and `categorical.<name>` targets (with `emphasis.` in front for spinner highlights) into `resolveColor()` targets.

## References

Use the `vivid-life-theme` skill to fetch the design-system tokens and README before changing a mapping — don't hardcode colours from memory. The Claude Code token list is in the [terminal-config docs](https://code.claude.com/docs/en/terminal-config#create-a-custom-theme); `skill`, `background`, `composerSidebarBackground` and `claudeBlue(Shimmer)_FOR_SYSTEM_SPINNER` are accepted but undocumented (found in the `/theme` editor). Claude Code silently drops unknown tokens, so `CLAUDE_CODE_TOKENS` in the test file is the guard against typos.

## Conventions

- Gate everything against `surface.bg_terminal`, not `bg`. Claude Code draws on the terminal's background and can't set it.
- Overlays come from the foundation's `overlay` recipes via `resolveColor(…, 'overlay.<name>', { surface: 'bg_terminal' })`. Don't keep a port-side alpha table.
- Colour decisions belong to the foundation's `app_roles`; this port only chooses which role a Claude Code token takes. If a token has no fitting role, that's a foundation gap.
- Shimmers are `emphasis.<role>` (same hue one rung further from the background, one rung back at the end of the ramp).
- Subagent colours and the `ultrathink` rainbow use `app_roles.categorical`, which the foundation already holds to ΔE ≥ 7 with no exemptions.
- The plugin name is `vivid-life-theme`; don't put `claude` in it (`claude plugin validate` flags names that read as Anthropic's own).

## Don't

- Don't hand-edit `themes/*.json` or `.claude-plugin/plugin.json`
- Don't hardcode hex values in `src/` — map to a foundation target instead; if none fits, that's a foundation gap
- Don't commit secrets or credentials to git

## Learnings

When the user corrects a mistake or points out a recurring issue, append a one-line summary to .claude/learnings.md. Don't modify CLAUDE.md directly.

## Compact Instructions

When compacting, preserve: list of modified files, current test status, open TODOs, and key decisions made.
