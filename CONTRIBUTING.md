# Contributing to @rhinolabs/fastify-toolkit

We welcome contributions! Here's how you can help make this toolkit even better.

## Development Setup

```bash
git clone https://github.com/rhinolabs/fastify-toolkit.git
cd fastify-toolkit
pnpm install
pnpm build
```

## Making Changes

1. **Fork and clone** the repository
2. **Create a branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our code standards
4. **Test thoroughly** and ensure nothing breaks
5. **Submit a pull request** with clear description

## Code Standards

- **TypeScript First** - All code in TypeScript
- **Biome Formatting** - Run `pnpm lint:fix` before committing
- **Zero Config Philosophy** - Features work without configuration
- **English Only** - All code, comments, and docs in English
- **JSDoc** - Document public APIs

## Package Structure

```
packages/package-name/
├── src/index.ts      # Main entry point
├── package.json      # Package config
├── tsconfig.json     # TypeScript config
├── README.md        # Documentation
└── dist/            # Built files
```

## Pull Request Guidelines
- **Update documentation** if adding features
- **Follow existing patterns** - check other packages for reference
- **Write clear commit messages** - describe what and why
- **Test your changes** before submitting

## Reporting Issues

When reporting bugs or requesting features:

- **Clear titles** - be specific about the issue
- **Provide examples** - include code snippets when relevant
- **Include environment** - Node.js version, package versions
- **Check existing issues** - avoid duplicates

## Questions?

Open an issue for questions about contributing or join our discussions.

Thank you for contributing! 🎉
