# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-10-11

### Added

- Claude Code port of the Vivid Life Theme design system: 24 custom themes (4 flavors × 6 variants), generated from `@vivid-life-theme/design-system` 0.11.0.
- Packaged as a Claude Code plugin with a single-plugin marketplace, installable with `/plugin marketplace add vivid-life-theme/vivid-life-claude-code`.
- Contrast and distinctness gates against each flavor's terminal background, a guard against unknown Claude Code token names, and a `--check` mode for generated-output drift, all run in CI.
