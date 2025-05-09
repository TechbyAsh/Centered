const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push(
  // Images
  'png', 'jpg', 'jpeg', 'gif', 'webp',
  // Fonts
  'ttf', 'otf', 'woff', 'woff2', 'eot',
  // Audio
  'mp3', 'wav', 'm4a', 'aac'
);

module.exports = defaultConfig;