---
title: 'Claude Code: Java'
summary: 'How I configure Claude Code when working in Java projects — skills, memory, settings, MCPs, hooks.'
tags: ['claude-code', 'java', 'tooling']
updated: 2026-04-27
---

## Overview

Claude Code configuration for Java work — Spring Boot, Quarkus, or plain JVM services. Pair with [java-best-practices](./java-best-practices) for the conventions Claude should follow when generating Java code.

The split is intentional. This page covers **automation** — skills, hooks, settings, MCPs that run on Claude's behalf or grant it pre-authorized capabilities. `java-best-practices` covers **guidance** — rules I want followed during code generation regardless of tooling. Some rules over there land here as enforceable hooks; the rest stay there as conventions Claude carries in context.

This is a hub page. If a section grows past ~15 substantive lines and is plausibly useful standalone, I promote it to its own page (e.g. `claude-code-java-test`) and replace the section with a one-line summary plus link.

## Skills

Skills are reusable, model-invocable capabilities. They live in `.claude/skills/<name>/SKILL.md` (project, shared via git) or `~/.claude/skills/<name>/SKILL.md` (user-wide). Each skill is a folder so it can carry supporting scripts.

### Built-in skills I lean on for Java

These ship with Claude Code and apply across languages, but earn their keep on Java work:

- `review` — review the current branch's diff against the conventions in `java-best-practices`. I run this before opening a PR.
- `security-review` — focused security pass over pending changes. I run it before merging anything that handles user input, persistence, or auth.
- `simplify` — review changed code for quality and reuse opportunities. Catch-all after a feature lands.

Invoke via `/<skill-name>` or let Claude pick automatically based on description match.

### Custom skills worth authoring for Java

Stub these as project-scoped (`.claude/skills/<name>/SKILL.md`) so the team gets them via git.

- **`java-test`** — run unit tests with `-Dgroups='!integration'`; summarize failures.
- **`archunit-check`** — run only ArchUnit tests; useful during refactors that move classes between layers.
- **`java-dep-audit`** — `mvn dependency:tree` + `dependency:analyze` + OWASP Dependency-Check, condensed report.
- **`format-java`** — `google-java-format --aosp -i` on changed `.java` files. Manual fallback when the on-edit hook isn't enough.

Minimal `SKILL.md` template (use `paths` to scope auto-invocation to Java work):

```yaml
---
name: java-test
description: Run JUnit unit tests excluding integration tests; summarize failures with class, line, expected vs actual.
allowed-tools: Bash Read
paths: src/**/*.java
---

# Steps

1. Detect Maven (`pom.xml`) or Gradle (`build.gradle`/`build.gradle.kts`) at the repo root.
2. Maven: run `./mvnw test -Dgroups='!integration'`. Gradle: run `./gradlew test --fail-fast=false`.
3. If failures: summarize the first three with `class:line`, expected vs actual, and the failing assertion.
4. Report total pass/fail counts.
```

Frontmatter keys worth knowing: `description` (used for auto-invocation matching), `allowed-tools` (whitelist scope), `paths` (glob to scope when the skill applies), `effort` (`low`/`medium`/`high`/`xhigh`/`max`), `context: fork` (run inside a subagent so the main session's context isn't consumed).

## Rules

Markdown files in `<repo>/.claude/rules/` load into context at session start, like `CLAUDE.md`, but with one extra capability: an optional `paths` frontmatter glob scopes the file's content so it only enters context when Claude is touching matching files. Useful in polyglot repos where Java rules shouldn't dilute context for non-Java work.

Example `<repo>/.claude/rules/java.md`:

```markdown
---
paths: ['src/**/*.java', 'src/**/*.kt']
---

When editing Java files in this project, follow the conventions at
https://alsasian.github.io/claude/java-best-practices.

[Project-specific rules, if any, that don't fit on the wiki — module layout,
local damage-class rules, deployment quirks. None of this is universal Java
knowledge.]
```

Compared to other carriers:

- **vs. `CLAUDE.md`** — `.claude/rules/` is finer-grained (path-scoped), better when the project has multiple languages or contexts. `CLAUDE.md` is the right primitive when something should be in scope across the whole repo.
- **vs. skills** — rules load passively into context; skills are *invoked* on demand. Use a rule for "things I want Claude to know whenever it's in Java files"; use a skill for "named workflow I'll trigger explicitly."
- **vs. project docs (`docs/*.md`, etc.)** — rules auto-load into context. Anything the agent should know without being told to read it belongs here. Anything that's reference material the agent reads on demand belongs in regular project docs.

What goes inside is project-specific by design; the wiki only describes the primitive, not the contents.

## Memory

Beyond `CLAUDE.md`, Claude Code has **auto-memory**: a per-repo store at `~/.claude/projects/<project-slug>/memory/MEMORY.md`. The first 200 lines (or 25 KB, whichever comes first) load at session start; Claude reads and writes to it during the session as it learns about the project.

What the agent decides to remember is up to it. Typical candidates for Java work:

- Build command flavors specific to this repo (test groupings, profile names, env requirements).
- Module layout and package boundaries inferred from existing code.
- Recurring failure patterns or flaky tests.
- Conventions the agent observed but couldn't otherwise verify.

Auto-memory is preferable to inlining transient or project-shape info into `.claude/rules/` or anywhere git-tracked: it lives under `~/.claude` (machine-local, not shared), and the agent updates it organically.

Browse or edit via `/memory`. Relevant settings:

- `autoMemoryEnabled` — default `true`. Keep on.
- `autoMemoryDirectory` — override location. Set in user (`~/.claude/settings.json`) or local (`.claude/settings.local.json`) settings only — not in shared project settings, to avoid sensitive redirects via git.

## Settings

Project-scoped at `.claude/settings.json`. Permission arrays merge across scopes — additions here add to whatever's in `~/.claude/settings.json`. Evaluation order is deny → ask → allow, first match wins.

```json
{
  "permissions": {
    "allow": [
      "Bash(./mvnw:*)",
      "Bash(./gradlew:*)",
      "Bash(mvn:*)",
      "Bash(gradle:*)",
      "Bash(java:*)",
      "Bash(javac:*)",
      "Bash(jshell:*)",
      "Bash(google-java-format:*)",
      "Read(src/**/*.java)",
      "Read(pom.xml)",
      "Read(build.gradle)",
      "Read(build.gradle.kts)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(**/secrets/**)"
    ]
  },
  "env": {
    "MAVEN_OPTS": "-Xmx2g"
  }
}
```

For machine-specific overrides (different `JAVA_HOME` per machine, custom plugin paths), use `.claude/settings.local.json` and add it to `.gitignore`. It takes precedence over the shared file.

## MCPs

_None yet._

## Hooks

The hooks below take rules from `java-best-practices` and turn conventions into automatic enforcement. Each runs a shell command; exit code 2 from a hook blocks the tool call, which is what gates the pre-commit spotless check.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "if": "Edit|Write(*.java)",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/format-java-on-edit.sh"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "if": "Bash(git commit*)",
        "hooks": [
          {
            "type": "command",
            "command": "if [ -f ./mvnw ]; then ./mvnw spotless:check; elif [ -f ./gradlew ]; then ./gradlew spotlessCheck; fi"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "if [ -f pom.xml ] || [ -f build.gradle ] || [ -f build.gradle.kts ]; then command -v google-java-format >/dev/null 2>&1 || echo 'WARNING: google-java-format not on PATH' >&2; fi"
          }
        ]
      }
    ]
  }
}
```

What each does:

- **PostToolUse on `Edit|Write` of `*.java`** — runs `~/.claude/hooks/format-java-on-edit.sh` which reads the tool input JSON from stdin, extracts the file path, and runs `google-java-format --aosp -i` on it. Means every Java file Claude touches lands formatted before I see the diff. Script form rather than inline because the file-path extraction is non-trivial.
- **PreToolUse on `Bash(git commit*)`** — runs `spotless:check` before any commit Claude makes. Non-zero exit blocks the commit, matching the same pre-commit gate I'd run locally.
- **SessionStart** — if the session opens in a Java repo (Maven or Gradle markers present), warns to stderr if `google-java-format` isn't on `PATH`. Doesn't block; just flags toolchain gaps.

For the format-on-edit script, the minimal shape:

```bash
#!/usr/bin/env bash
# ~/.claude/hooks/format-java-on-edit.sh
# Reads PostToolUse hook payload from stdin, formats the edited Java file.

set -euo pipefail
file_path="$(jq -r '.tool_input.file_path // empty')"
[ -n "$file_path" ] || exit 0
[[ "$file_path" == *.java ]] || exit 0
command -v google-java-format >/dev/null 2>&1 || exit 0
google-java-format --aosp -i -- "$file_path"
```

The exact JSON path to the file may vary by hook payload version; if `jq -r '.tool_input.file_path'` returns empty, inspect the actual stdin payload once and adjust.

## See also

- [java-best-practices](./java-best-practices) — the conventions this configuration is designed to support.
