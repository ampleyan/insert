module.exports = {
  // Configure webpack to copy video files to public directory
    publicPath: process.env.NODE_ENV === 'production'  ? '/insert/' : '/',

  chainWebpack: config => {
    // Remove default processing for video files
    config.module.rules.delete('video');

    // Add copy plugin configuration for video files
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    config.plugin('copy-video')
      .use(CopyWebpackPlugin, [
        {
          patterns: [
            {
              from: 'src/assets/video',
              to: 'assets/video',
              globOptions: {
                ignore: ['**/.DS_Store']
              }
            },
            {
              from: 'src/assets/win98/images',
              to: 'win98/assets',
              globOptions: {
                ignore: ['**/.DS_Store']
              }
            },
            {
              from: 'src/assets/win98/videos',
              to: 'win98/videos',
              globOptions: {
                ignore: ['**/.DS_Store']
              }
            },
            {
              from: 'src/assets/win98/sounds',
              to: 'win98/sounds',
              globOptions: {
                ignore: ['**/.DS_Store']
              }
            },
            {
              from: 'src/assets/win98/gnome',
              to: 'win98/gnome',
              globOptions: {
                ignore: ['**/.DS_Store']
              }
            },
            {
              from: 'src/assets/win98/sounds/gnome',
              to: 'win98/sounds/gnome',
              globOptions: {
                ignore: ['**/.DS_Store']
              }
            }
          ]
        }
      ]);
  },

  // Configure dev server
  devServer: {
    port: 8080,
    open: true
  }
};
