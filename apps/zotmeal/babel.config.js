// @ts-check

/**
 * @type {import('@babel/core').ConfigFunction}
 */
function config(api) {
  api.cache.forever();

  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
}

module.exports = config;
