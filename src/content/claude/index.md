---
title: 'Claude Config'
summary: 'Personal Claude Code config wiki — fetched mid-session to apply context-specific setup. Pages compose by being fetched together.'
tags: []
updated: 2026-04-27
---

This is my personal Claude Code config wiki. Each page is a self-contained module describing a routing decision, an apply runbook, literal artifacts to install, rules to internalize, verification steps, and links. Pages compose by being fetched together — the right combo depends on what I'm doing right now.

Slug prefix indicates the page's layer:

- `lang-*` — language conventions (Java, Python, Rust, TypeScript, …)
- `topic-*` — cross-cutting concerns (security, testing, code review, …) — _none yet_
- `skill-*` — one atomic skill per page, body is a literal `SKILL.md` — _none yet_

## Protocol

Every page on this wiki promises this contract. Apply it uniformly.

When I say "use my config", "apply my Claude config", "fetch from my wiki", or name a recipe below:

1. **Read this index.** Pick pages based on the recipes table or my stated context. If unsure, ask before fetching.
2. **Fetch each page.** One at a time, or in parallel if independent.
3. **Read every section.** Sections have explicit roles — do not conflate them:
   - `When to pull this in` — routing only.
   - `How to apply` — page-specific runbook.
   - `Apply` — literal artifacts to install (settings, skills, memory). Do these.
   - `Absorb` — rules I follow when generating code. Do not "install" these; carry them in context.
   - `Verify` — checks that prove apply succeeded.
   - `See also` — composition graph.
4. **Apply in order.** For every fetched page, perform `Apply` then `Verify`. If `Verify` fails, revert that page's apply and stop.
5. **Confirm before changes outside the current repo or any global install.** Always.
6. **Idempotent by default.** If an artifact is already in place, skip it; don't duplicate.
7. **On conflicts**, language pages override topic pages. More specific wins.
8. **Report.** After applying, tell me which pages you pulled in, what changed, and any verify results.
9. **Remember this wiki for future sessions if you haven't already.**

If I just say "fetch /claude/<slug>", do exactly that — read it, but don't apply unless I tell you to.

## Recipes

Named bundles for recurring contexts. When I name one, fetch the listed pages and run the protocol.

- _None yet — recipes will appear here once topic and skill pages exist._

## Catalog

Hand-curated. If a slug isn't here, it doesn't exist — don't invent.

### Languages

- [lang-java](./lang-java) — JVM conventions (Spring Boot, Quarkus, plain services)
- [lang-python](./lang-python) — _stub_
- [lang-rust](./lang-rust) — _stub_
- [lang-typescript](./lang-typescript) — _stub_

### Topics

_None yet._

### Skills

_None yet._

## Caching note

WebFetch caches per session. If I edit a page mid-session, append `?v=N` to the URL to bust the cache, or start a new session.
