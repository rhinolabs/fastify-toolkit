# @rhinolabs/fastify-toolkit

High-quality tools and plugins for Fastify applications, built with modern TypeScript.

## Packages

### [@rhinolabs/fastify-dev-performance](./packages/dev-performance)

Development performance monitoring plugin that tracks request timing and identifies slow endpoints.

```bash
npm install @rhinolabs/fastify-dev-performance
```

**Features:**
- Alerts on slow endpoints (>1000ms)
- Critical issue detection (>3000ms)  
- Zero configuration required

## Philosophy

- **Zero Config First** - Works out of the box
- **Development Focused** - Improves developer experience
- **TypeScript Native** - Full type safety
- **Performance Conscious** - No production overhead

## Development

```bash
pnpm install    # Install dependencies
pnpm build      # Build all packages
pnpm lint       # Lint all packages
```

## Contributing

Read our [Contributing Guide](./CONTRIBUTING.md) for pull request and issue guidelines.

## Related

- [@rhinolabs/boilr](https://github.com/rhinolabs/boilr) - Convention-based Fastify framework

## License

MIT License - see [LICENSE](./LICENSE) for details.
