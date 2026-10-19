import { Config } from '@remotion/cli/config';
import webpack from 'webpack';
import path from 'path';

// Video encoding settings
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
Config.setCrf(18);

// Project paths
Config.setEntryPoint('./remotion/index.ts');
Config.setPublicDir('./public');

// Performance settings
Config.setCachingEnabled(false);
Config.setConcurrency(1);

// Webpack configuration for Node.js polyfills
Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      fallback: {
        ...currentConfiguration.resolve?.fallback,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: path.resolve(__dirname, 'remotion/polyfills/os-mock.js'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        querystring: require.resolve('querystring-es3'),
        vm: require.resolve('vm-browserify'),
        tty: false,
        net: false,
        constants: false,
        fs: false,
        dns: false,
        child_process: false,
        worker_threads: false,
      },
      alias: {
        ...currentConfiguration.resolve?.alias,
        'process/browser': require.resolve('process/browser.js'),
      },
    },
    plugins: [
      ...(currentConfiguration.plugins || []),
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  };
});

export default Config;
