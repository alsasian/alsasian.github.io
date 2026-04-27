---
title: 'Java'
summary: 'Java conventions: style, static analysis, security, architecture, dependencies, testing, CI hooks. Apply on any Java work.'
tags: ['java', 'jvm', 'spring-boot', 'quarkus', 'security', 'testing', 'static-analysis', 'ci']
updated: 2026-04-27
---

## When to pull this in

Working in any Java codebase — Spring Boot, Quarkus, or plain JVM services. Use as the baseline for new projects and as a reference when joining one without enforced standards. If the project also handles untrusted input or persistence, also fetch `topic-security` (when it exists). If the project is hexagonal, the architecture rules below apply; if not, skip them.

## How to apply

Run the [standard protocol](./#protocol). Specifics for this page:

1. Confirm `google-java-format` is on `PATH`. If missing, ask me before installing — it's a global install.
2. Detect Maven (`pom.xml`) vs Gradle (`build.gradle` / `build.gradle.kts`) in the current repo. The Apply > Settings block matches either.
3. Merge the **Settings** block into the project's `.claude/settings.json` (project scope, not user scope). Create the file if absent.
4. Add the **Memory** block to the project's `.claude/CLAUDE.md`. Create the file if absent. The security rules are inlined deliberately — they're damage-class and must apply even without a fetch.
5. Skip **Skills** for now — none exist on the wiki yet.
6. Run the **Verify** checklist. If anything fails, revert the changes from steps 3–4 and stop.

## Apply

### Settings

Merge into `.claude/settings.json` at the repo root. Project scope.

```json
{
  "permissions": {
    "allow": [
      "Bash(./mvnw:*)",
      "Bash(./gradlew:*)",
      "Bash(mvn:*)",
      "Bash(gradle:*)",
      "Bash(google-java-format:*)",
      "Bash(java:*)",
      "Bash(javac:*)",
      "Bash(jshell:*)"
    ]
  }
}
```

### Skills

_None yet on the wiki._ Forward-looking candidates (don't try to fetch — they don't exist):

- `skill-format-java` — invoke `google-java-format --aosp` on changed `.java` files.
- `skill-archunit-check` — run only the architecture tests; useful during refactors.
- `skill-dep-audit` — `dependency:tree` + `dependency:analyze` + OWASP, condensed report.

### Memory

Append to project `.claude/CLAUDE.md`:

```
This project uses Java conventions from https://alsasian.github.io/claude/lang-java.
Apply formatting and architecture rules to all Java edits.

Security rules (always in force, do not require a fetch):
- Never concatenate user input into SQL — use PreparedStatement or JPA named params.
- Never pass user input to Runtime.exec() or ProcessBuilder unvalidated.
- Never deserialize untrusted data with ObjectInputStream.
- Use SecureRandom for tokens, secrets, nonces — never java.util.Random.
- Never log secrets, tokens, passwords, or PII at any log level.
- Never disable TLS certificate verification.
- Validate path inputs against traversal — use Path.normalize().startsWith().
- Never hardcode secrets; load from env, Secrets Manager, or vault.
- Hash with SHA-256 or stronger; never MD5 or SHA-1 for security purposes.
- Disable DTD/external entities on XMLInputFactory (XXE).
- Close InputStream/Connection/ResultSet in try-with-resources.
```

## Absorb

Rules I follow when generating Java code. Carry these in context for the rest of the session; do not "install" them.

### Code style and formatting

_Requires: google-java-format._

- Format all Java files with `google-java-format --aosp`. AOSP style uses a 4-space indent which reads better in diffs.
- Never manually align code; let the formatter handle all whitespace. Manual alignment creates noisy diffs on rename.
- Use `var` for local variables only when the RHS type is obvious. Ambiguous `var` usage harms readability at review.
- Prefer `static import` for test assertions only, never for production code. Static imports in prod obscure the origin class.
- Order imports as `java.*`, blank line, `javax.*`, blank line, all others. Consistent ordering prevents merge conflicts.
- Never use wildcard imports (`import foo.*`). They cause hidden conflicts and make dependencies unclear.
- Keep methods under 30 lines; extract private helpers otherwise. Long methods are the #1 review friction point.
- Name booleans as predicates: `isValid`, `hasPermission`, `canRetry`. Bare adjective names read ambiguously in conditionals.
- Use `final` on local variables and parameters by default. Signals intent-not-to-reassign and catches accidental mutation.

### Static analysis and linting

_Requires: Error Prone, SpotBugs, Checkstyle._

- Enable Error Prone as a compiler plugin with `-Werror`. Catches real bugs (null deref, format strings) at compile time.
- Enable SpotBugs with `effort=max` and `threshold=medium`. Finds concurrency bugs and resource leaks the compiler misses.
- Enable Checkstyle with `google_checks.xml` or `sun_checks.xml`. Enforces structural rules the formatter does not cover.
- Promote these Error Prone checks to ERROR: `MissingOverride`, `FutureReturnValueIgnored`, `UnusedVariable`. They are warnings by default but catch frequent bugs.
- Enable NullAway with `@NullMarked` package annotations. Prevents NPE at compile time, far cheaper than runtime checks.
- Use `spotbugs-exclude-filter.xml` to suppress only documented false positives. Blanket suppressions hide real bugs.
- Never add `@SuppressWarnings("all")` or tool-wide suppression annotations. Suppress only the specific check, with a comment explaining why.
- Run `./mvnw spotless:check` or `./gradlew spotlessCheck` in pre-commit. Catches format drift before it reaches CI.

### Security

The security rules are inlined in the **Memory** block above so they apply without a fetch. Honor them in every Java edit.

### Architecture and structure

_Requires: ArchUnit (test dependency)._

- Enforce layer boundaries with ArchUnit tests (e.g. `controller` must not access `repository` directly). Catches architectural violations automatically in CI.
- Follow a hexagonal structure: `domain/`, `application/`, `adapter/in/`, `adapter/out/`, `config/`. Keeps business logic free of framework coupling.
- Domain classes must have zero framework imports (no Spring, no Jakarta annotations). Framework-free domains are portable and testable.
- Place one public class per file; package-private helpers are fine as inner classes. One-class-per-file is enforceable and navigable.
- Name packages in lowercase singular nouns: `order`, `payment`, `user`. Plural or mixed-case packages cause inconsistent conventions.
- Put DTOs and request/response records in the adapter layer, never in domain. Leaking transport shapes into domain creates unwanted coupling.
- Use Java records for immutable data carriers; avoid Lombok `@Data` for new code. Records are standard, transparent, and need no annotation processor.
- Never throw generic `Exception` or `RuntimeException`; define domain-specific exceptions. Specific exceptions enable targeted handling by callers.
- Keep `@Configuration` classes in a top-level `config` package, one per concern. Scattered config classes are hard to audit and override.

### Dependency management

_Requires: Maven or Gradle with a dependency-lock plugin or BOM._

- Pin all direct dependencies to exact versions; never use `LATEST`, `RELEASE`, or `+` ranges. Unpinned versions cause unreproducible builds.
- Use a BOM (`dependencyManagement` / platform) for Spring Boot, Quarkus, and the AWS SDK. BOMs ensure transitive version alignment.
- Run `mvn dependency:tree` or `gradle dependencies` before adding new deps. Catches transitive conflicts before they cause runtime errors.
- Never shade or relocate classes unless resolving a confirmed conflict. Shading hides bugs and inflates artifact size.
- Avoid Apache Commons Lang/IO/Collections for new code; prefer JDK 17+ equivalents. The modern JDK covers most utility methods natively.
- Never depend on `com.sun.*` or `sun.misc.*` internal APIs. Internal APIs break across JDK versions without notice.
- Enable OWASP Dependency-Check or Snyk in CI to fail on CVEs of HIGH severity or above. Known-vulnerable dependencies are a primary attack surface.
- Remove unused dependencies aggressively; use `mvn dependency:analyze`. Dead dependencies increase attack surface and build time.
- Prefer the `jakarta.*` namespace over `javax.*` for new projects. `javax.*` is legacy; Jakarta EE is the active specification.

### Testing

_Requires: JUnit 5, Mockito, AssertJ._

- Write tests using JUnit 5 (`org.junit.jupiter`); never add JUnit 4 dependencies. JUnit 5 is the current standard with better extension support.
- Name test methods `should_[expectedBehavior]_when_[condition]()`. Descriptive names replace the need for comments and clarify failures.
- Structure every test as Arrange / Act / Assert with blank-line separators. AAA structure makes each test phase instantly identifiable.
- Use AssertJ fluent assertions (`assertThat`), not JUnit `assertEquals`. AssertJ gives readable failure messages and chained assertions.
- Never mock domain objects or value types; mock only external boundaries (ports/adapters). Over-mocking produces tests that verify wiring, not behavior.
- Never mock `LocalDate.now()` or `Instant.now()` directly; inject a `Clock` and pass `Clock.fixed()` in tests. Injected clocks keep tests deterministic without static mocking hacks.
- Annotate integration tests with `@Tag("integration")` and exclude from the unit-test phase. Keeps the fast feedback loop under 30 seconds.
- Use `@Nested` classes to group tests by scenario within a single test class. Nesting replaces duplication and makes test output scannable.
- Test one behavior per method; avoid multiple act/assert cycles in one test. Multi-assert tests hide which behavior actually broke.
- Use Testcontainers for DB and queue integration tests, never an in-memory substitute (H2). In-memory DBs mask SQL dialect and behavior differences.
- Never use `Thread.sleep()` in tests; use Awaitility `await().atMost()` for async. Sleep-based tests are slow and flaky.

### CI and pre-commit hooks

#### On every file save (IDE or pre-commit, under 3 seconds)

- Run `google-java-format` on changed `.java` files only. Instant formatting prevents style drift without slowing the developer.

#### On pre-commit hook (under 15 seconds)

_Requires: pre-commit framework or a Husky equivalent._

- Run `./mvnw compile -DskipTests` or `./gradlew compileJava` on changed modules. Catches syntax and type errors before they reach CI.
- Run `./mvnw spotless:check` or `./gradlew spotlessCheck`. Blocks commits that violate formatting rules.

#### On CI pipeline, every push

- Run full `./mvnw verify` or `./gradlew check` including Error Prone and SpotBugs. Full static analysis catches issues pre-commit hooks cannot.
- Run unit tests (`-Dgroups='!integration'`) with JaCoCo; fail if line coverage drops below threshold. Prevents coverage regression on each PR.
- Run OWASP Dependency-Check; fail on CVSS ≥ 7.0. Blocks merging code with known high-severity vulnerabilities.
- Run `mvn dependency:analyze` and fail on declared-but-unused dependencies. Keeps the dependency graph clean automatically.
- Run ArchUnit tests as part of the unit-test phase. Architectural violations are caught with the same speed as logic bugs.

#### On CI pipeline, nightly or scheduled

- Run integration tests tagged `@Tag("integration")` against Testcontainers. Full integration coverage without slowing every PR build.
- Run mutation testing with PIT (`pitest-maven`); track the trend, don't gate. Mutation scores reveal weak tests that line coverage misses.

## Verify

Run after Apply. All must pass.

- `which google-java-format` returns a path. If not, the formatter isn't installed — flag and stop.
- `jq '.permissions.allow' .claude/settings.json` includes `"Bash(./mvnw:*)"` and `"Bash(./gradlew:*)"`.
- `grep -q "alsasian.github.io/claude/lang-java" .claude/CLAUDE.md` succeeds.
- `grep -q "Never log secrets" .claude/CLAUDE.md` succeeds (security rules inlined).
- Confirm out loud which rules will now apply, and ask me to start.

## See also

- `topic-security` — pair with this whenever the project handles untrusted input or persistence. _Page does not exist yet._
- `topic-testing` — broader testing patterns beyond JUnit specifics. _Page does not exist yet._
- `topic-code-review` — review process beyond Java. _Page does not exist yet._
