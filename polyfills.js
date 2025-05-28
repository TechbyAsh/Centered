// polyfills.js
// Using minimal polyfills to avoid Node.js core module dependencies
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { btoa, atob } from 'base-64';

// Ensure Intl is available
if (!global.Intl) {
  global.Intl = require('intl');
}

// Fix for React Native Reanimated
global._frameTimestamp = 0;

// Simple polyfill for useLocale
if (typeof global.useLocale !== 'function') {
  global.useLocale = function() {
    return {
      locale: 'en-US',
      direction: 'ltr'
    };
  };
}

// Polyfill for crypto
import * as Crypto from 'expo-crypto';
global.crypto = {
  getRandomValues: (arr) => Crypto.getRandomValues(arr),
};

// Text encoding polyfill
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// Base64 polyfill
global.btoa = btoa;
global.atob = atob;
globalThis.btoa = btoa;
globalThis.atob = atob;

// Buffer polyfill
global.Buffer = Buffer;
globalThis.Buffer = Buffer;
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Node.js process polyfill
if (typeof process === 'undefined') {
  global.process = require('process/browser');
}