'use strict';

import getCallerFile = require('./index');

// Benchmark configuration
const ITERATIONS = 100000;
const WARMUP_ITERATIONS = 10000;

// Helper function to format numbers
function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

// Helper function to measure execution time
function benchmark(name: string, fn: () => any, iterations: number) {
  // Warmup
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    fn();
  }

  // Force garbage collection if available
  if ((global as any).gc) {
    (global as any).gc();
  }

  // Actual benchmark
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = process.hrtime.bigint();

  const totalNs = Number(end - start);
  const totalMs = totalNs / 1_000_000;
  const avgNs = totalNs / iterations;
  const opsPerSec = (iterations / totalMs) * 1000;

  console.log(`\n${name}:`);
  console.log(`  Total time: ${totalMs.toFixed(2)} ms`);
  console.log(`  Average time: ${avgNs.toFixed(2)} ns`);
  console.log(`  Operations/sec: ${formatNumber(Math.round(opsPerSec))}`);

  return {
    totalMs,
    avgNs,
    opsPerSec
  };
}

// Test functions at different stack depths
function depth1(): string | undefined {
  return getCallerFile(2);
}

function depth2(): string | undefined {
  return depth1();
}

function depth3(): string | undefined {
  return depth2();
}

console.log('='.repeat(60));
console.log('get-caller-file Performance Benchmarks');
console.log('='.repeat(60));
console.log(`Iterations: ${formatNumber(ITERATIONS)}`);
console.log(`Warmup iterations: ${formatNumber(WARMUP_ITERATIONS)}`);

// Run benchmarks
const results = {
  direct: benchmark('Direct call', () => getCallerFile(), ITERATIONS),
  depth1: benchmark('Depth 1', depth1, ITERATIONS),
  depth2: benchmark('Depth 2', depth2, ITERATIONS),
  depth3: benchmark('Depth 3', depth3, ITERATIONS)
};

// Summary
console.log('\n' + '='.repeat(60));
console.log('Summary:');
console.log('='.repeat(60));

const avgOpsPerSec = Object.values(results).reduce((sum, r) => sum + r.opsPerSec, 0) / Object.keys(results).length;
const avgTimeNs = Object.values(results).reduce((sum, r) => sum + r.avgNs, 0) / Object.keys(results).length;

console.log(`Average operations/sec: ${formatNumber(Math.round(avgOpsPerSec))}`);
console.log(`Average time per call: ${avgTimeNs.toFixed(2)} ns`);

// Memory usage
const memUsage = process.memoryUsage();
console.log('\nMemory Usage:');
console.log(`  RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Heap Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Heap Total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
console.log(`  External: ${(memUsage.external / 1024 / 1024).toFixed(2)} MB`);

console.log('\n' + '='.repeat(60));
console.log('Optimizations Applied:');
console.log('='.repeat(60));
console.log('✓ Reduced Error.prepareStackTrace modifications');
console.log('✓ Cached prepareStackTrace function reference');
console.log('✓ Conditional restoration of prepareStackTrace');
console.log('✓ Optimized stack access pattern');
console.log('='.repeat(60));
