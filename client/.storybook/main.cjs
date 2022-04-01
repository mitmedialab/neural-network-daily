const path = require("path");
const preprocess = require('svelte-preprocess');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"
  ],
  staticDirs: ['../static'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-svelte-csf"
  ],
  framework: "@storybook/svelte",
  svelteOptions: {
    preprocess: preprocess(),
  },
  webpackFinal: async (config) => {
    const svelteLoader = config.module.rules.find(
      (r) => r.loader && r.loader.includes("svelte-loader"),
    );

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        svelte: path.resolve(__dirname, '..', 'node_modules', 'svelte'),
      },
      mainFields: ['svelte', 'browser', 'module', 'main'],
    };

    config.module.rules.push({
      resolve: {
        fullySpecified: false,
        extensions: ['.js', '.ts'],
      },
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      "$lib": path.resolve(__dirname, "../src/lib"),
    };
    config.resolve.extensions.push(".ts");
    svelteLoader.options.preprocess = require("svelte-preprocess")({});
    return config
  }
}