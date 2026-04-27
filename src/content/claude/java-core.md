---
title: 'Java'
summary: 'Style, static analysis, security, architecture, dependencies, testing, and CI conventions for Java projects.'
tags: ['java', 'jvm', 'spring-boot', 'quarkus', 'security', 'testing', 'static-analysis', 'ci']
updated: 2026-04-27
---

## When to pull this in

Working in a Java codebase — Spring Boot, Quarkus, or plain JVM services. Use as the baseline for new projects and as a reference when joining one without enforced standards. Skip sections that don't apply (for example, ignore the architecture rules if the repo isn't hexagonal).

## Code style and formatting

_Requires: google-java-format (standalone JAR or IDE plugin)._

- Format all Java files with `google-java-format --aosp`. AOSP style uses a 4-space indent which reads better in diffs.
- Never manually align code; let the formatter handle all whitespace. Manual alignment creates noisy diffs on rename.
- Use `var` for local variables only when the RHS type is obvious. Ambiguous `var` usage harms readability at review.
- Prefer `static import` for test assertions only, never for production code. Static imports in prod obscure the origin class.
- Order imports as `java.*`, blank line, `javax.*`, blank line, all others. Consistent ordering prevents merge conflicts.
- Never use wildcard imports (`import foo.*`). They cause hidden conflicts and make dependencies unclear.
- Keep methods under 30 lines; extract private helpers otherwise. Long methods are the #1 review friction point.
- Name booleans as predicates: `isValid`, `hasPermission`, `canRetry`. Bare adjective names read ambiguously in conditionals.
- Use `final` on local variables and parameters by default. Signals intent-not-to-reassign and catches accidental mutation.

## Static analysis and linting

_Requires: Error Prone (compiler plugin), SpotBugs (Gradle/Maven plugin), Checkstyle._

- Enable Error Prone as a compiler plugin with `-Werror`. Catches real bugs (null deref, format strings) at compile time.
- Enable SpotBugs with `effort=max` and `threshold=medium`. Finds concurrency bugs and resource leaks the compiler misses.
- Enable Checkstyle with `google_checks.xml` or `sun_checks.xml`. Enforces structural rules the formatter does not cover.
- Promote these Error Prone checks to ERROR: `MissingOverride`, `FutureReturnValueIgnored`, `UnusedVariable`. They are warnings by default but catch frequent bugs.
- Enable NullAway (Error Prone plugin) with `@NullMarked` package annotations. Prevents NPE at compile time, far cheaper than runtime checks.
- Use `spotbugs-exclude-filter.xml` to suppress only documented false positives. Blanket suppressions hide real bugs.
- Never add `@SuppressWarnings("all")` or tool-wide suppression annotations. Suppress only the specific check, with a comment explaining why.
- Run `./mvnw spotless:check` or `./gradlew spotlessCheck` in pre-commit. Catches format drift before it reaches CI.

## Security

- Never concatenate user input into SQL; always use parameterized `PreparedStatement` or JPA named parameters. Prevents SQL injection.
- Never pass user input to `Runtime.exec()` or `ProcessBuilder` unvalidated. Command injection is trivially exploitable.
- Never deserialize untrusted data with Java native serialization (`ObjectInputStream`). It enables remote code execution.
- Use `java.security.SecureRandom`, never `java.util.Random`, for tokens, secrets, and nonces. `Random` is predictable and exploitable.
- Never log secrets, tokens, passwords, or PII at any log level. Leaked credentials in logs are a top breach vector.
- Never disable TLS certificate verification (`TrustAllCerts`, `ALLOW_ALL_HOSTNAME_VERIFIER`). It enables trivial MITM attacks.
- Validate all path inputs against path traversal (`../`); use `Path.normalize().startsWith()`. Directory traversal leaks arbitrary files.
- Never hardcode secrets; load from environment variables, Secrets Manager, or a vault. Hardcoded secrets leak via version control.
- Prefer `MessageDigest` with SHA-256 or stronger for hashing; never use MD5 or SHA-1 for security purposes. Both have known collision attacks.
- Use OWASP Java Encoder for HTML/JS/URL output encoding, not hand-rolled escaping. Manual escaping always misses edge cases.
- Never use `XMLInputFactory` without disabling DTD and external entities. XXE injection exfiltrates files and causes SSRF.
- Close all `InputStream`, `Connection`, `ResultSet` in try-with-resources. Leaked resources cause exhaustion and denial of service.

## Architecture and structure

_Requires: ArchUnit (test dependency)._

- Enforce layer boundaries with ArchUnit tests (for example, `controller` must not access `repository` directly). Catches architectural violations automatically in CI.
- Follow a hexagonal structure: `domain/`, `application/`, `adapter/in/`, `adapter/out/`, `config/`. Keeps business logic free of framework coupling.
- Domain classes must have zero framework imports (no Spring, no Jakarta annotations). Framework-free domains are portable and testable.
- Place one public class per file; package-private helpers are fine as inner classes. One-class-per-file is enforceable and navigable.
- Name packages in lowercase singular nouns: `order`, `payment`, `user`. Plural or mixed-case packages cause inconsistent conventions.
- Put DTOs and request/response records in the adapter layer, never in domain. Leaking transport shapes into domain creates unwanted coupling.
- Use Java records for immutable data carriers; avoid Lombok `@Data` for new code. Records are standard, transparent, and need no annotation processor.
- Never throw generic `Exception` or `RuntimeException`; define domain-specific exceptions. Specific exceptions enable targeted handling by callers.
- Keep `@Configuration` classes in a top-level `config` package, one per concern. Scattered config classes are hard to audit and override.

## Dependency management

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

## Testing

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

## CI and pre-commit hooks

### On every file save (IDE or pre-commit, under 3 seconds)

- Run `google-java-format` on changed `.java` files only. Instant formatting prevents style drift without slowing the developer.

### On pre-commit hook (under 15 seconds)

_Requires: pre-commit framework or a Husky equivalent._

- Run `./mvnw compile -DskipTests` or `./gradlew compileJava` on changed modules. Catches syntax and type errors before they reach CI.
- Run `./mvnw spotless:check` or `./gradlew spotlessCheck`. Blocks commits that violate formatting rules.

### On CI pipeline, every push

- Run full `./mvnw verify` or `./gradlew check` including Error Prone and SpotBugs. Full static analysis catches issues pre-commit hooks cannot.
- Run unit tests (`-Dgroups='!integration'`) with JaCoCo; fail if line coverage drops below threshold. Prevents coverage regression on each PR.
- Run OWASP Dependency-Check; fail on CVSS ≥ 7.0. Blocks merging code with known high-severity vulnerabilities.
- Run `mvn dependency:analyze` and fail on declared-but-unused dependencies. Keeps the dependency graph clean automatically.
- Run ArchUnit tests as part of the unit-test phase. Architectural violations are caught with the same speed as logic bugs.

### On CI pipeline, nightly or scheduled

- Run integration tests tagged `@Tag("integration")` against Testcontainers. Full integration coverage without slowing every PR build.
- Run mutation testing with PIT (`pitest-maven`); track the trend, don't gate. Mutation scores reveal weak tests that line coverage misses.

## See also

No related pages in the wiki yet. Future candidates that would naturally pair with this one: a `secrets-hygiene` page (cross-stack secret loading and rotation), a `code-review` page (review process beyond Java), and a `testing-patterns` page (test design beyond JUnit specifics).
