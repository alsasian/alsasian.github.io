---
title: 'Claude Code: Java'
summary: 'Ready-to-use Claude Code configuration for Java projects.'
tags: ['claude-code', 'java', 'tooling']
updated: 2026-04-27
---

## Overview

Ready-to-use Claude Code configuration for Java work — Spring Boot, Quarkus, plain JVM. Pair with [java-best-practices](./java-best-practices) for the conventions.

## Skills

Built-in (ship with Claude Code):

- `/review` — review the current branch's diff.
- `/security-review` — security pass over pending changes.
- `/simplify` — review changed code for quality and reuse opportunities.

Custom — drop each into `<repo>/.claude/skills/<name>/SKILL.md`:

**`java-test`**

```yaml
---
name: java-test
description: Run JUnit unit tests excluding integration; summarize failures.
allowed-tools: Bash Read
paths: src/**/*.java
---

# Steps

1. Detect Maven (`pom.xml`) or Gradle (`build.gradle` / `build.gradle.kts`).
2. Maven: `./mvnw test -Dgroups='!integration'`. Gradle: `./gradlew test --fail-fast=false`.
3. Summarize the first three failures with `class:line`, expected vs actual, failing assertion.
4. Report total pass/fail counts.
```

**`archunit-check`**

```yaml
---
name: archunit-check
description: Run only ArchUnit architecture tests; report layer and import violations.
allowed-tools: Bash Read
paths: src/**/*.java
---

# Steps

1. Maven: `./mvnw test -Dtest='*Architecture*'`. Gradle: `./gradlew test --tests '*Architecture*'`.
2. For failures, list each rule violated and the offending class.
3. Report pass/fail counts.
```

**`java-dep-audit`**

```yaml
---
name: java-dep-audit
description: Audit Java dependencies — tree, unused declarations, CVEs.
allowed-tools: Bash Read
paths: ['pom.xml', 'build.gradle', 'build.gradle.kts']
---

# Steps

1. Maven: `mvn dependency:tree`, `mvn dependency:analyze`, `mvn org.owasp:dependency-check-maven:check`. Gradle equivalent if `build.gradle*` is present.
2. Report direct dependencies with effective versions, unused declared dependencies, and CVEs at HIGH severity or above.
3. Flag anything that breaks the rules at https://alsasian.github.io/claude/java-best-practices (no SNAPSHOTs, no LATEST/RELEASE, no `com.sun.*` / `sun.misc.*`).
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
paths: ['src/**/*.java', 'src/**/*.kt']
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
