---
title: 'Claude Code: Java'
summary: 'Ready-to-use Claude Code configuration for Maven Java projects.'
tags: ['claude-code', 'java', 'maven', 'tooling']
updated: 2026-04-27
---

## Overview

Ready-to-use Claude Code configuration for Java work on Maven projects. Pair with [java-best-practices](./java-best-practices) for the conventions.

## Required dependencies

What the Setup skills install. Most are added by their corresponding `/setup-lib-*` skill below.

- **Test:** JUnit 5 (`org.junit.jupiter:junit-jupiter`), AssertJ (`org.assertj:assertj-core`). ArchUnit (`com.tngtech.archunit:archunit-junit5`) added by `/setup-lib-archunit`.
- **Lint plugins:** Spotless (`com.diffplug.spotless:spotless-maven-plugin`), Error Prone (via `maven-compiler-plugin`) with NullAway (`com.uber.nullaway:nullaway`), SpotBugs (`com.github.spotbugs:spotbugs-maven-plugin`), Checkstyle (`org.apache.maven.plugins:maven-checkstyle-plugin`). JSpecify (`org.jspecify:jspecify`) for `@NullMarked`.
- **Quality plugins:** JaCoCo (`org.jacoco:jacoco-maven-plugin`) added by `/setup-lib-coverage`. Maven Enforcer (`org.apache.maven.plugins:maven-enforcer-plugin`) added by `/setup-lib-enforcer`.
- **Build wrapper:** `mvnw` (Maven Wrapper) — added by `/setup-lib-mvn-wrapper` if missing.
- **Local toolchain:** JDK 17+, `google-java-format` on `PATH`.

## Skills

Built-in (ship with Claude Code):

- `/review` — review the current branch's diff.
- `/security-review` — security pass over pending changes.
- `/simplify` — review changed code for quality and reuse opportunities.

Init — one-time bootstrap. Install the local JDK toolchain or scaffold a new Maven project. Drop into `<repo>/.claude/skills/<name>/SKILL.md` (or `~/.claude/skills/` for the JDK installer, since it isn't project-scoped).

**`setup-init-jdk`**

```yaml
---
name: setup-init-jdk
description: Install a JDK on the local machine using whichever installer is available. Supports Linux, macOS, WSL, and Windows.
allowed-tools: Bash Read
paths: []
---

# Steps

1. Ask me for: JDK version (default `21`) and distribution (default Eclipse Temurin).
2. Detect the OS (macOS, Linux, WSL, Windows) and which installers are on `PATH`:
   - Linux / macOS / WSL: `sdk` (SDKMAN), `mise`, `asdf`.
   - macOS: `brew`.
   - Linux / WSL: `apt-get`, `dnf`, `pacman`.
   - Windows: `winget`, `scoop`, `choco`. `mise` also runs on Windows.
3. If one installer is available, propose using it. If multiple, ask me which.
4. If none are available, list bootstrap options for the detected OS — SDKMAN (Linux/macOS/WSL only) via `curl -s "https://get.sdkman.io" | bash`; `mise` via `curl https://mise.run | sh` (Linux/macOS/WSL) or `irm https://mise.run | iex` (Windows PowerShell); or download a JDK directly from adoptium.net (works everywhere). Confirm with me before installing any installer — each modifies shell rc files or system state.
5. Run the install command for the chosen tool. Confirm with me before any global state change.
6. Verify with `java -version`. If the chosen tool supports a default-version concept and I want this version as default, set it.
7. Report what was installed, where it lives, and how to make it default later if not done now.
```

**`setup-init-mvn`**

```yaml
---
name: setup-init-mvn
description: Scaffold a fresh Maven Java project with sane defaults — pom.xml, directory layout, .gitignore.
allowed-tools: Read Edit Write Bash
paths: []
---

# Steps

1. Confirm the working directory is empty or contains only common artifacts (`.git`, `README.md`). If `pom.xml` already exists, abort and report — this skill is for fresh projects only.
2. Ask me for: `groupId`, `artifactId`, JDK version (default 17), packaging (`jar` default; `war` if asked).
3. Generate `pom.xml` with:
   - The supplied `groupId` / `artifactId` / packaging.
   - Version `0.1.0-SNAPSHOT`.
   - `<properties>`: `maven.compiler.release` set to the chosen JDK, `project.build.sourceEncoding` set to UTF-8.
   - Empty `<dependencies>` and `<build><plugins>` blocks ready to fill.
4. Create the standard directory layout: `src/main/java`, `src/main/resources`, `src/test/java`, `src/test/resources`.
5. Create `.gitignore` with Maven defaults: `target/`, `.idea/`, `*.iml`, `.vscode/`, `.DS_Store`.
6. Report what was created.
7. Suggest next steps: run `/setup-lib-mvn-wrapper`, then `/setup-lib-enforcer`, `/setup-lib-test`, `/setup-lib-lint`, optionally `/setup-lib-archunit` and `/setup-lib-coverage`.
```

Setup — drop each into `<repo>/.claude/skills/<name>/SKILL.md`. These are instructions for the agent; the agent reads `pom.xml` and applies the edits.

**`setup-lib-mvn-wrapper`**

```yaml
---
name: setup-lib-mvn-wrapper
description: Install the Maven Wrapper (mvnw) if it isn't already present.
allowed-tools: Bash Read
paths: pom.xml
---

# Steps

1. Check whether `./mvnw` exists at the repo root. If yes, do nothing and report.
2. Run `mvn -N wrapper:wrapper` (Maven 3.7+). Pin to the project's chosen Maven baseline if the wrapper goal supports a `-Dmaven` argument.
3. Confirm `mvnw`, `mvnw.cmd`, and `.mvn/wrapper/maven-wrapper.properties` were created.
4. Report what was added.
```

**`setup-lib-enforcer`**

```yaml
---
name: setup-lib-enforcer
description: Add Maven Enforcer rules banning SNAPSHOTs, LATEST/RELEASE, and version ranges.
allowed-tools: Read Edit
paths: pom.xml
---

# Steps

1. Read `pom.xml`.
2. In `<build><plugins>`, ensure `org.apache.maven.plugins:maven-enforcer-plugin` is configured and version-pinned.
3. Bind an `enforce` execution to the `validate` phase with these rules:
   - `requireReleaseDeps` — no SNAPSHOT versions.
   - `bannedDependencies` — reject versions matching `LATEST`, `RELEASE`, or any range syntax (`[`, `(`, `,`, `]`, `)`).
   - `requireMavenVersion` — matching the project's chosen Maven baseline.
   - `requireJavaVersion` — matching the project's required JDK (default JDK 17+).
4. Pin to an exact stable version. No `LATEST` / `RELEASE`.
5. Report what was added vs. already present.
```

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
description: Configure Spotless, Error Prone (with NullAway), SpotBugs, and Checkstyle on the project's pom.xml.
allowed-tools: Read Edit Write
paths: pom.xml
---

# Steps

1. Read `pom.xml`.
2. In `<build><plugins>`, ensure each is configured and version-pinned:
   - `com.diffplug.spotless:spotless-maven-plugin` — using `googleJavaFormat("aosp")`.
   - `maven-compiler-plugin` — Error Prone added via `-Xplugin:ErrorProne` in `<compilerArgs>` with `-Werror`. Annotation processor path includes `com.google.errorprone:error_prone_core` and `com.uber.nullaway:nullaway`. Configure NullAway with the project's base package as `AnnotatedPackages`.
   - `com.github.spotbugs:spotbugs-maven-plugin` — `effort=Max`, `threshold=Medium`.
   - `org.apache.maven.plugins:maven-checkstyle-plugin` — using `google_checks.xml`.
3. Add `org.jspecify:jspecify` to `<dependencies>` (regular scope) if not already present, and add `@NullMarked` (from JSpecify) to the project's main `package-info.java` files. Create them if they don't exist.
4. Pin every plugin to an exact stable version. No `LATEST` / `RELEASE`.
5. Report what was added vs. already present.
```

**`setup-lib-archunit`**

```yaml
---
name: setup-lib-archunit
description: Add ArchUnit as a test dependency and scaffold a starter architecture test.
allowed-tools: Read Edit Write
paths: pom.xml
---

# Steps

1. Read `pom.xml`.
2. In `<dependencies>`, ensure `com.tngtech.archunit:archunit-junit5` is present with `<scope>test</scope>`. Pin to an exact stable version.
3. Detect the project's base package from existing source. If no architecture test exists, scaffold `src/test/java/<base-pkg>/ArchitectureTest.java` with starter rules:
   - Domain classes (`..domain..`) have no framework imports (no Spring, no Jakarta).
   - Controllers (`..adapter.in..` or `..controller..`) don't access repositories (`..adapter.out..` or `..repository..`) directly.
   - Layer dependency direction: `domain` ← `application` ← `adapter`.
4. The class name must match `*Architecture*Test` so the `/archunit-check` skill picks it up.
5. Report what was added.
```

**`setup-lib-coverage`**

```yaml
---
name: setup-lib-coverage
description: Configure JaCoCo for line coverage with a fail-on-regress threshold.
allowed-tools: Read Edit
paths: pom.xml
---

# Steps

1. Read `pom.xml`.
2. In `<build><plugins>`, ensure `org.jacoco:jacoco-maven-plugin` is configured and version-pinned.
3. Bind these executions:
   - `prepare-agent` (default phase, attaches the JaCoCo agent).
   - `report` in the `verify` phase.
   - `check` with a `BUNDLE`-scope `LINE` coverage rule. Default minimum: 80%. Fail the build on regression.
4. Pin to an exact stable version. No `LATEST` / `RELEASE`.
5. Report what was added vs. already present, plus the active threshold.
```

**TODO: `setup-lib-bom`** — detect the framework in use (Spring Boot, Quarkus, AWS SDK) and add the appropriate BOM to `<dependencyManagement>`. Skipped until framework detection is specified.

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
