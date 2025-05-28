# @rhinolabs/fastify-dev-performance

Development performance monitoring plugin for Fastify applications. Automatically tracks request timing, identifies slow endpoints, and provides actionable insights during development.

<p align="center">
  <img src="https://img.shields.io/npm/v/@rhinolabs/fastify-dev-performance" alt="npm version">
  <img src="https://img.shields.io/github/license/rhinolabs/fastify-toolkit" alt="license">
  <img src="https://img.shields.io/github/stars/rhinolabs/fastify-toolkit" alt="github stars">
</p>

## Features

- **🐌 Spot Slow Endpoints** - Automatically alerts you when requests take longer than 1000ms
- **🚨 Critical Issue Detection** - Detailed analysis for requests over 3000ms that need immediate attention
- **🚀 Zero Setup** - Just install and register - no configuration needed

## Installation

```bash
npm install @rhinolabs/fastify-dev-performance

# Or using other package managers
pnpm add @rhinolabs/fastify-dev-performance
yarn add @rhinolabs/fastify-dev-performance
```

## Quick Start

### Automatic Registration (Recommended)

```typescript
import Fastify from 'fastify';
import devPerformance from '@rhinolabs/fastify-dev-performance';

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

### Manual Registration

```typescript
import Fastify from 'fastify';
import { addDevPerformanceMonitoring } from '@rhinolabs/fastify-dev-performance';

const fastify = Fastify();

// Add performance monitoring manually
addDevPerformanceMonitoring(fastify);

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
   Routes registered: 12
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

The plugin works without configuration, but you can customize behavior:

```typescript
// Custom thresholds (not yet implemented - coming soon)
await fastify.register(devPerformance, {
  slowThreshold: 2000,    // Custom slow request threshold
  verySlowThreshold: 5000 // Custom very slow threshold
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

// After (Fastify with dev-performance)
import Fastify from 'fastify';
import devPerformance from '@rhinolabs/fastify-dev-performance';

const fastify = Fastify();
await fastify.register(devPerformance);
```

### Existing Fastify Apps
```typescript
// Add to existing Fastify applications
import devPerformance from '@rhinolabs/fastify-dev-performance';

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
import devPerformance, { addDevPerformanceMonitoring } from '@rhinolabs/fastify-dev-performance';

// Both approaches are fully typed
const fastify: FastifyInstance = Fastify();
await fastify.register(devPerformance);

// Or manual registration
addDevPerformanceMonitoring(fastify);
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
