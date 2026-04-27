# ADR-002: Express Over Fastify

## Status

Accepted

## Context

Need a web framework for the REST API. Express and Fastify are the main candidates.

## Decision

Use Express 5.x.

## Rationale

- Universally familiar — lowers the barrier to understanding the demo
- Express 5 is stable and modern enough for our needs
- Fastify's performance advantages are irrelevant for a demo with in-memory storage
- supertest works seamlessly with Express

## Consequences

- Slightly less type-safe routing than Fastify
- No built-in schema validation (we validate manually, which is fine for 2 endpoints)
