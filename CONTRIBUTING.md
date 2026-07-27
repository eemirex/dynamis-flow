# Contributing

Thanks for helping improve Dynamis Flow.

## Development workflow

1. Fork the repository and create a focused branch.
2. Install with `pnpm install`.
3. Copy `.env.example` to `.env.local`.
4. Keep demo mode enabled unless your change requires Supabase.
5. Add or update documentation with the implementation.
6. Run `pnpm typecheck`, `pnpm lint`, and `pnpm build`.
7. Open a pull request that explains the problem, approach, and verification.

## Product principles

- Preserve clarity before adding density.
- Keep tenant authorization in PostgreSQL RLS.
- Never expose a Supabase service-role key to the browser.
- Make portfolio demo flows work without private credentials.
- Use accessible HTML and keyboard-friendly controls.
- Prefer a small, explicit dependency over a broad framework.

## Commit style

Use concise, imperative commit subjects:

```text
feat: add project workload view
fix: scope attachment access to organization
docs: explain Realtime subscription model
```
