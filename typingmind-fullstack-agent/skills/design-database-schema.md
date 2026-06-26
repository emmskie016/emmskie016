# Skill: design-database-schema

## Steps
1. List entities, fields, types, and relationships from the spec.
2. Normalize sensibly; denormalize only with a stated reason (read perf).
3. Choose keys: prefer surrogate IDs (uuid/serial); add natural unique constraints.
4. Add **indexes** for every column you filter/join/sort on in hot queries.
5. Decide soft-delete vs hard-delete per table; document it.
6. Write the migration (Drizzle/Prisma/Alembic) — never edit shared DB by hand.
7. Add constraints: `NOT NULL`, `UNIQUE`, FKs with sensible `ON DELETE`, `CHECK` where useful.
8. For AI/RAG: add a `pgvector` column + index if semantic search is needed.

## Checklist
- [ ] Migration is reversible (or has a documented down path).
- [ ] No unbounded text where a length/constraint is appropriate.
- [ ] Timestamps (`created_at`, `updated_at`) on mutable tables.
- [ ] Indexes match the query patterns in the spec.
- [ ] snake_case, plural table names (or your convention).

## Output
The migration file + the updated schema + a one-line note on each index and why.
