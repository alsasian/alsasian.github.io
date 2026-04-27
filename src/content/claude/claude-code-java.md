---
title: 'Claude Code: Java'
summary: 'Ready-to-use Claude Code configuration for Maven Java projects.'
tags: ['claude-code', 'java', 'maven', 'tooling']
updated: 2026-04-27
---

## Overview

Ready-to-use Claude Code configuration for Java work on Maven projects. Pair with [java-best-practices](./java-best-practices) for the conventions.

## Required dependencies

Mandatory in any project this configuration applies to:

- **Test:** JUnit 5 (`org.junit.jupiter:junit-jupiter`), AssertJ (`org.assertj:assertj-core`).
- **Lint plugins:** Spotless (`com.diffplug.spotless:spotless-maven-plugin`), Error Prone (via `maven-compiler-plugin` `<compilerArgs>`), SpotBugs (`com.github.spotbugs:spotbugs-maven-plugin`), Checkstyle (`org.apache.maven.plugins:maven-checkstyle-plugin`).
- **Build wrapper:** `mvnw` (Maven Wrapper).
- **Local toolchain:** JDK 17+, `google-java-format` on `PATH`.

The `/setup-lib-test` and `/setup-lib-lint` skills below install the test and lint deps into a project's `pom.xml`.

## Skills

Built-in (ship with Claude Code):

- `/review` — review the current branch's diff.
- `/security-review` — security pass over pending changes.
- `/simplify` — review changed code for quality and reuse opportunities.

Setup — drop each into `<repo>/.claude/skills/<name>/SKILL.md`. These are instructions for the agent; the agent reads `pom.xml` and applies the edits.

**`setup-lib-test`**

```yaml
---
name: setup-lib-test
description: Add JUnit 5 and AssertJ as test dependencies to the project's pom.xml.
allowed-tools: Read Edit
paths: pom.xml
---

# Steps

1. Read `pom.xml`.
2. In `<dependencies>`, ensure these are present with `<scope>test</scope>`:
   - `org.junit.jupiter:junit-jupiter`
   - `org.assertj:assertj-core`
   Pin each to an exact stable version — never `LATEST` or `RELEASE`.
3. In `<build><plugins>`, ensure `maven-surefire-plugin` is present, version pinned, configured to run JUnit Platform.
4. Report what was added vs. already present.
```

**`setup-lib-lint`**

```yaml
---
name: setup-lib-lint
description: Configure Spotless, Error Prone, SpotBugs, and Checkstyle on the project's pom.xml.
allowed-tools: Read Edit
paths: pom.xml
---

# Steps

1. Read `pom.xml`.
2. In `<build><plugins>`, ensure each of the following is configured and version-pinned:
   - `com.diffplug.spotless:spotless-maven-plugin` — using `googleJavaFormat("aosp")`.
   - `maven-compiler-plugin` — Error Prone added via `-Xplugin:ErrorProne` in `<compilerArgs>` with `-Werror`, plus `error_prone_core` on the annotation processor path.
   - `com.github.spotbugs:spotbugs-maven-plugin` — `effort=Max`, `threshold=Medium`.
   - `org.apache.maven.plugins:maven-checkstyle-plugin` — using `google_checks.xml`.
3. Pin every plugin to an exact stable version. No `LATEST` or `RELEASE`.
4. Report what was added vs. already present.
```

Operational — drop each into `<repo>/.claude/skills/<name>/SKILL.md`:

**`java-test`**

```yaml
---
name: java-test
description: Run JUnit 5 unit tests; summarize failures.
allowed-tools: Bash Read
paths: src/**/*.java
---

# Steps

1. Run `./mvnw test`.
2. Summarize the first three failures with `class:line`, expected vs actual, failing assertion.
3. Report total pass/fail counts.
```

**`archunit-check`**

```yaml
---
name: archunit-check
description: Run only ArchUnit architecture tests; report violations.
allowed-tools: Bash Read
paths: src/**/*.java
---

# Steps

1. Run `./mvnw test -Dtest='*Architecture*'`.
2. For failures, list each rule violated and the offending class.
3. Report pass/fail counts.
```

**`java-dep-audit`**

```yaml
---
name: java-dep-audit
description: Audit Java dependencies — tree and unused declarations.
allowed-tools: Bash Read
paths: pom.xml
---

# Steps

1. Run `mvn dependency:tree` and `mvn dependency:analyze`.
2. Report direct dependencies with effective versions, and any unused declared dependencies.
3. Flag SNAPSHOTs, `LATEST` / `RELEASE` versions, and `com.sun.*` / `sun.misc.*` imports — they violate the conventions at https://alsasian.github.io/claude/java-best-practices.
```

**`format-java`**

```yaml
---
name: format-java
description: Format Java files with google-java-format using AOSP style.
allowed-tools: Bash
paths: src/**/*.java
---

# Steps

1. Identify modified `.java` files: `git diff --name-only HEAD --diff-filter=AMR | grep -E '\.java$'`.
2. Run `google-java-format --aosp -i` on each.
3. Report the file count formatted.
```

## Rules

Drop into `<repo>/.claude/rules/java.md`:

```markdown
---
paths: ['src/**/*.java']
---

When editing Java files in this project, follow the conventions at
https://alsasian.github.io/claude/java-best-practices.
```

## Memory

_Auto-memory runs without configuration. Nothing to install. Use `/memory` to browse or edit._

## Settings

Merge into `<repo>/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(./mvnw:*)",
      "Bash(mvn:*)",
      "Bash(java:*)",
      "Bash(javac:*)",
      "Bash(jshell:*)",
      "Bash(google-java-format:*)",
      "Read(src/**/*.java)",
      "Read(pom.xml)"
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

Machine-specific overrides go in `<repo>/.claude/settings.local.json` (gitignored).

## MCPs

_None yet._

## Hooks

Merge `hooks` into `<repo>/.claude/settings.json`:

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
            "command": "if [ -f ./mvnw ]; then ./mvnw spotless:check; fi"
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
            "command": "if [ -f pom.xml ]; then command -v google-java-format >/dev/null 2>&1 || echo 'WARNING: google-java-format not on PATH' >&2; fi"
          }
        ]
      }
    ]
  }
}
```

Companion script — save as `~/.claude/hooks/format-java-on-edit.sh` and `chmod +x`:

```bash
#!/usr/bin/env bash
set -euo pipefail
file_path="$(jq -r '.tool_input.file_path // empty')"
[ -n "$file_path" ] || exit 0
[[ "$file_path" == *.java ]] || exit 0
command -v google-java-format >/dev/null 2>&1 || exit 0
google-java-format --aosp -i -- "$file_path"
```

## See also

- [java-best-practices](./java-best-practices) — the conventions this configuration supports.
