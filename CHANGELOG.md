# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - Unreleased

### Added

- Initial extraction of `LeadGenForm` from the fleet's hand-rolled
  implementations, ported onto `@silverassist/next-script-loader`. The
  bundled `StyleIsolator` dependency was dropped in favor of an optional
  `containerId` prop, so style isolation stays a site-owned concern.
