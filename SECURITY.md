# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do NOT open a public issue**
2. Use [GitHub Security Advisories](../../security/advisories/new) to report privately
3. Include steps to reproduce the vulnerability
4. Allow time for a fix before public disclosure

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Security Practices

This project enforces security through:
- ESLint rules against dangerous patterns (`no-throw-literal`, `no-floating-promises`)
- Dependency auditing in CI (`npm audit`)
- Claude Code hooks that block force pushes and destructive commands
- TypeScript strict mode with no `any` types
