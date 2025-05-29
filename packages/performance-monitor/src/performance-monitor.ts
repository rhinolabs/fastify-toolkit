import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

/**
 * Options for performance monitoring
 */
export interface PerformanceMonitorOptions {
  /**
   * Enable or disable performance monitoring
   */
  enable?: boolean;
  /**
   * Paths to exclude from performance monitoring
   * Supports exact strings, wildcards, and RegExp patterns
   * @default []
   */
  exclude?: (string | RegExp)[];

  /**
   * Threshold in milliseconds for slow request logging
   * @default 1000
   */
  slowThreshold?: number;

  /**
   * Threshold in milliseconds for very slow request logging
   * @default 3000
   */
  verySlowThreshold?: number;
}

/**
 * Convert a wildcard pattern to RegExp
 * Examples:
 * - "/docs/star" becomes ^\/docs\/.*$
 * - "/api/star/internal" becomes ^\/api\/[^\/]*\/internal$
 * Note: star represents * wildcard
 */
function wildcardToRegExp(pattern: string): RegExp {
  // Escape special regex characters except * and **
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "___DOUBLE_STAR___")
    .replace(/\*/g, "[^/]*")
    .replace(/___DOUBLE_STAR___/g, ".*");

  return new RegExp(`^${escaped}$`);
}

/**
 * Check if a path should be excluded from monitoring
 */
function shouldExcludePath(url: string, excludePaths: (string | RegExp)[]): boolean {
  return excludePaths.some((pattern) => {
    if (typeof pattern === "string") {
      // Check for wildcards
      if (pattern.includes("*")) {
        const regex = wildcardToRegExp(pattern);
        return regex.test(url);
      }
      // Exact match
      return url === pattern;
    }
    // RegExp pattern
    return pattern.test(url);
  });
}

/**
 * Performance monitoring plugin for Fastify
 * Tracks request timing and logs slow requests
 */
async function performanceMonitorPlugin(fastify: FastifyInstance, options: PerformanceMonitorOptions = {}) {
  // Merge user options with defaults
  const config: Required<PerformanceMonitorOptions> = {
    exclude: options.exclude || [],
    slowThreshold: options.slowThreshold ?? 1000,
    verySlowThreshold: options.verySlowThreshold ?? 3000,
    enable: options.enable !== false,
  };

  let totalRequests = 0;
  let monitoredRequests = 0;

  // Track request start time
  fastify.addHook("onRequest", async (request: FastifyRequest) => {
    totalRequests++;

    // Check if this path should be excluded
    const shouldExclude = shouldExcludePath(request.url, config.exclude);
    (request as FastifyRequest & { startTime: number; shouldExclude: boolean }).startTime = Date.now();
    (request as FastifyRequest & { startTime: number; shouldExclude: boolean }).shouldExclude = shouldExclude;

    if (!shouldExclude) {
      monitoredRequests++;
    }
  });

  // Log performance metrics on response
  fastify.addHook("onResponse", async (request: FastifyRequest, reply: FastifyReply) => {
    const requestWithTiming = request as FastifyRequest & { startTime: number; shouldExclude: boolean };

    // Skip logging for excluded paths
    if (requestWithTiming.shouldExclude) {
      return;
    }

    const duration = Date.now() - requestWithTiming.startTime;
    const method = request.method;
    const url = request.url;
    const status = reply.statusCode;

    // Log slow requests
    if (duration > config.slowThreshold) {
      console.log(`🐌 Slow request: ${method} ${url} → ${status} (${duration}ms)`);
    }

    // Log very slow requests
    if (duration > config.verySlowThreshold) {
      console.log("🚨 Very slow request detected!");
      console.log(`   Route: ${method} ${url}`);
      console.log(`   Status: ${status}`);
      console.log(`   Duration: ${duration}ms`);
    }

    // Log errors with timing context
    if (status >= 400) {
      console.log(`❌ Error: ${method} ${url} → ${status} (${duration}ms)`);
    }

    // Log extremely fast responses (might indicate caching or empty responses)
    if (duration < 1 && status === 200) {
      console.log(`⚡ Fast response: ${method} ${url} → ${status} (${duration}ms)`);
    }
  });

  // Log performance summary when the server is ready
  fastify.ready(() => {
    console.log("📊 Performance monitoring enabled");
    console.log(
      `   Monitoring thresholds: >${config.slowThreshold}ms (slow), >${config.verySlowThreshold}ms (very slow)`,
    );
  });
}

/**
 * Export as Fastify plugin
 * Can be enabled/disabled via options
 */
export default fp<PerformanceMonitorOptions>(performanceMonitorPlugin, {
  fastify: "5.x",
  name: "@rhinolabs/fastify-monitor",
});
