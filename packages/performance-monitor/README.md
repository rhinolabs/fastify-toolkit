# @rhinolabs/fastify-monitor

Development performance monitoring plugin for Fastify applications. Automatically tracks request timing, identifies slow endpoints, and provides actionable insights during development.

<p align="center">
  <img src="https://img.shields.io/npm/v/@rhinolabs/fastify-monitor" alt="npm version">
  <img src="https://img.shields.io/github/license/rhinolabs/fastify-toolkit" alt="license">
  <img src="https://img.shields.io/github/stars/rhinolabs/fastify-toolkit" alt="github stars">
</p>

## Features

- **🐌 Spot Slow Endpoints** - Automatically alerts you when requests take longer than 1000ms
- **🚨 Critical Issue Detection** - Detailed analysis for requests over 3000ms that need immediate attention
- **🚀 Zero Setup** - Just install and register - no configuration needed
- **🎯 Flexible Filtering** - Exclude paths with exact matches, wildcards, or RegExp patterns
- **⚙️ Configurable** - Customize thresholds and exclusion patterns

## Installation

```bash
npm install @rhinolabs/fastify-monitor

# Or using other package managers
pnpm add @rhinolabs/fastify-monitor
yarn add @rhinolabs/fastify-monitor
```

## Quick Start

### Automatic Registration (Recommended)

```typescript
import Fastify from 'fastify';
import devPerformance from '@rhinolabs/fastify-monitor';

const fastify = Fastify({
  logger: true
});

// Register the plugin - automatically enabled only in development
await fastify.register(devPerformance);

// Add your routes
fastify.get('/api/users', async (request, reply) => {
  // Your route logic here
  return { users: [] };
});

await fastify.listen({ port: 3000 });
```

## Usage with Boilr Framework

If you're using [@rhinolabs/boilr](https://github.com/rhinolabs/boilr), performance monitoring is automatically included:

```typescript
import { createApp } from '@rhinolabs/boilr';

// Performance monitoring is automatically enabled in development
const app = createApp({
  server: { port: 3000 },
  routes: { dir: './routes' }
});

await app.start();
```

## Console Output Examples

### Startup Summary
```bash
📊 Development performance monitoring enabled
   Monitoring thresholds: >1000ms (slow), >3000ms (very slow)
```

### Performance Logging
```bash
# Fast responses (< 1ms)
⚡ Fast response: GET /api/cache → 200 (0ms)

# Normal responses (no logging)
# GET /api/users → 200 (45ms)

# Slow requests (> 1000ms)
🐌 Slow request: GET /api/heavy-query → 200 (1502ms)

# Very slow requests (> 3000ms)
🚨 Very slow request detected!
   Route: GET /api/database-export
   Status: 200
   Duration: 4005ms

# Error responses
❌ Error: GET /api/nonexistent → 404 (1ms)
❌ Error: POST /api/users → 400 (25ms)
```

## How It Works

The plugin uses Fastify's hook system to:

1. **Track Request Start Time** - Records timestamp when request begins
2. **Measure Response Time** - Calculates duration when response is sent
3. **Categorize Performance** - Applies thresholds to identify slow requests
4. **Log Actionable Insights** - Provides context-aware performance information

### Performance Thresholds

| Category | Threshold | Description |
|----------|-----------|-------------|
| ⚡ Fast | < 1ms | Potentially cached or empty responses |
| 🟢 Normal | 1ms - 1000ms | Acceptable performance (no logging) |
| 🐌 Slow | 1000ms - 3000ms | May need optimization |
| 🚨 Very Slow | > 3000ms | Critical performance issues |

## Environment Detection

The plugin automatically detects the environment and only activates when:

```bash
NODE_ENV=development
```

In production, staging, or test environments, the plugin does nothing, ensuring zero performance overhead.

## Configuration

The plugin works out of the box with smart defaults, but you can customize its behavior:

### Basic Configuration

```typescript
import Fastify from 'fastify';
import devPerformance from '@rhinolabs/fastify-monitor';

const fastify = Fastify();

await fastify.register(devPerformance, {
  // Custom performance thresholds
  slowThreshold: 2000,        // Log slow requests after 2000ms (default: 1000ms)
  verySlowThreshold: 5000,    // Log very slow requests after 5000ms (default: 3000ms)
});
```

### Path Exclusion

The plugin monitors all requests by default. You can exclude specific paths using various patterns:

```typescript
await fastify.register(devPerformance, {
  excludePaths: [
    // Exact path matches
    '/health',
    '/favicon.ico',
    
    // Wildcard patterns
    '/docs/*',              // Excludes /docs/api, /docs/guide, etc.
    '/static/*',            // Excludes all files in /static/
    '/api/*/internal',      // Excludes /api/v1/internal, /api/v2/internal, etc.
    
    // RegExp patterns for complex matching
    /\.(js|css|png|jpg)$/,  // Excludes files with these extensions
    /^\/admin\//,           // Excludes all paths starting with /admin/
  ],
});
```

### Wildcard Pattern Examples

| Pattern | Matches | Doesn't Match |
|---------|---------|---------------|
| `/docs/*` | `/docs/api`, `/docs/guide` | `/docs/api/users`, `/docs` |
| `/static/**` | `/static/js/app.js`, `/static/css/style.css` | `/api/static` |
| `/api/*/internal` | `/api/v1/internal`, `/api/v2/internal` | `/api/v1/internal/users` |
| `*.json` | `config.json`, `data.json` | `/api/config.json` |

**Note**: Use `*` to match anything except slashes, `**` to match anything including slashes.

### Complete Configuration Example

```typescript
await fastify.register(devPerformance, {
  // Performance thresholds
  slowThreshold: 1500,
  verySlowThreshold: 4000,
  
  // Path exclusions - mix of exact matches, wildcards, and RegExp
  excludePaths: [
    // Health and monitoring endpoints
    '/health',
    '/ready',
    '/metrics',
    
    // Documentation and admin panels
    '/docs/*',
    '/admin/*',
    '/swagger/*',
    
    // Static assets using wildcards
    '/static/*',
    '/assets/*',
    '/uploads/*',
    
    // API patterns
    '/api/*/internal',      // Internal APIs for any version
    '/api/v*/health',       // Health checks for versioned APIs
    
    // File extensions using RegExp
    /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|pdf|zip)$/,
    
    // Complex patterns
    /^\/webhooks\//,        // All webhook endpoints
  ],
});
```

## Integration Examples

### Express Migration
```typescript
// Before (Express with morgan)
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('combined'));

// After (Fastify with performance monitor)
import Fastify from 'fastify';
import devPerformance from '@rhinolabs/fastify-monitor';

const fastify = Fastify();
await fastify.register(devPerformance);
```

### Existing Fastify Apps
```typescript
// Add to existing Fastify applications
import devPerformance from '@rhinolabs/fastify-monitor';

// Register alongside other plugins
await fastify.register(require('@fastify/cors'));
await fastify.register(require('@fastify/helmet'));
await fastify.register(devPerformance); // Add performance monitoring

// Your existing routes continue to work
fastify.get('/api/health', healthHandler);
```

## TypeScript Support

Full TypeScript support with complete type definitions:

```typescript
import type { FastifyInstance } from 'fastify';
import devPerformance, { 
  type DevPerformanceOptions 
} from '@rhinolabs/fastify-monitor';

// Fully typed configuration
const options: DevPerformanceOptions = {
  slowThreshold: 2000,
  verySlowThreshold: 5000,
  excludePaths: [
    '/health',
    /^\/api\/internal\//,
  ],
};

const fastify: FastifyInstance = Fastify();
await fastify.register(devPerformance, options);
```

## Best Practices

### Development Workflow
1. **Start Development Server** with `NODE_ENV=development`
2. **Make Requests** to your API endpoints
3. **Review Console Output** for performance insights
4. **Optimize Slow Endpoints** highlighted by the plugin
5. **Repeat** until all endpoints perform well

### Performance Optimization Tips
- **Fast Responses (< 1ms)**: Verify these are intentional (caching, simple responses)
- **Slow Requests (> 1000ms)**: Consider database query optimization, caching, or pagination
- **Very Slow Requests (> 3000ms)**: High priority for optimization - investigate database queries, external API calls, or heavy computations

## Compatibility

- **Fastify**: 5.x and above
- **Node.js**: 18.x and above
- **TypeScript**: 5.x and above

## Contributing

Contributions are welcome! Please read our [contributing guide](../../CONTRIBUTING.md) for details.
