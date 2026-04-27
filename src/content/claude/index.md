---
title: 'Claude Config'
summary: 'My personal Claude Code config wiki — fetched mid-session to apply context-specific setup.'
tags: []
updated: 2026-04-27
---

This is my personal Claude Code config wiki. Each page is a markdown module — settings, permissions, MCP servers, skills, hooks, CLAUDE.md memory, or just prompting preferences. Pages compose by being fetched together.

## How Claude Code should use this wiki

When I say "use my config", "apply my Claude config", or "fetch from my wiki":

1. Read this index page if you haven't already.
2. Pick relevant pages based on what I'm working on — language, task, mood.
3. WebFetch each one and follow its instructions.
4. For anything that touches files outside the current repo, or any global install: confirm with me first.
5. After applying, tell me briefly which pages you pulled in and what changed.

If I say "fetch /claude/<slug>", just fetch that page.

## Pages

- [rust-core](./rust-core) — Rust defaults
- [typescript-core](./typescript-core) — TypeScript defaults
- [java-core](./java-core) — Java defaults
- [python-core](./python-core) — Python defaults

Hand-curated list. If a slug isn't here, it doesn't exist — don't invent.

## Caching note

WebFetch caches per session. If I edit a page mid-session, append `?v=N` to the URL to bust the cache, or start a new session.
