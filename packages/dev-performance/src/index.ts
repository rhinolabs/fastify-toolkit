import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

/**
 * Performance monitoring for development mode
 * Tracks request timing and logs slow requests
 */
async function devPerformancePlugin(fastify: FastifyInstance) {
  // Only run in development
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  let totalRequests = 0;

  // Track request start time
  fastify.addHook("onRequest", async (request: FastifyRequest) => {
    (request as FastifyRequest & { startTime: number }).startTime = Date.now();
    totalRequests++;
  });

  // Log performance metrics on response
  fastify.addHook("onResponse", async (request: FastifyRequest, reply: FastifyReply) => {
    const duration = Date.now() - (request as FastifyRequest & { startTime: number }).startTime;
    const method = request.method;
    const url = request.url;
    const status = reply.statusCode;

    // Log slow requests (>1000ms)
    if (duration > 1000) {
      console.log(`🐌 Slow request: ${method} ${url} → ${status} (${duration}ms)`);
    }

    // Log very slow requests (>3000ms)
    if (duration > 3000) {
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
    const routes = fastify.printRoutes({ commonPrefix: false });
    const routeCount = (routes.match(/├─/g) || []).length + (routes.match(/└─/g) || []).length;
    console.log("📊 Development performance monitoring enabled");
    console.log(`   Routes registered: ${routeCount}`);
    console.log("   Monitoring thresholds: >1000ms (slow), >3000ms (very slow)");
  });
}

/**
 * Export as Fastify plugin
 * Automatically enabled in development mode
 */
export default fp(devPerformancePlugin, {
  fastify: "5.x",
  name: "@rhinolabs/fastify-dev-performance",
});

/**
 * Manual function to add performance monitoring
 * Use this if you want to add it manually instead of automatic registration
 */
export function addDevPerformanceMonitoring(app: FastifyInstance): void {
  // Only run in development
  if (process.env.NODE_ENV !== "development") return;

  app.register(
    fp(devPerformancePlugin, {
      fastify: "5.x",
      name: "@rhinolabs/fastify-dev-performance",
    }),
  );
}
