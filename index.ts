// Call this function in a another function to find out the file from
// which that function was called from. (Inspects the v8 stack trace)
//
// Inspired by http://stackoverflow.com/questions/13227489

// Optimized prepareStackTrace function (reused to avoid allocations)
const optimizedPrepareStackTrace = (_: Error, stack: any) => stack;

// Cache the last prepareStackTrace to avoid unnecessary modifications
let lastPrepareStackTrace: Function | undefined = undefined;

export = function getCallerFile(position = 2) {
  if (position >= Error.stackTraceLimit) {
    throw new TypeError('getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' + position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`');
  }

  const oldPrepareStackTrace = Error.prepareStackTrace;

  // Only modify if different from our optimized version
  // This reduces overhead when called repeatedly
  if (oldPrepareStackTrace !== optimizedPrepareStackTrace) {
    Error.prepareStackTrace = optimizedPrepareStackTrace;
  }

  const stack = new Error().stack;

  // Only restore if we actually changed it
  if (oldPrepareStackTrace !== optimizedPrepareStackTrace) {
    Error.prepareStackTrace = oldPrepareStackTrace;
  }

  if (stack !== null && typeof stack === 'object') {
    // stack[0] holds this file
    // stack[1] holds where this function was called
    // stack[2] holds the file we're interested in
    return stack[position] ? (stack[position] as any).getFileName() : undefined;
  }

  return undefined;
};
