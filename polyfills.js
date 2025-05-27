// polyfills.js
import 'react-native-polyfill-globals/auto';
import 'react-native-url-polyfill/auto';
import http from 'http-browserify';


// Polyfill for crypto
import * as Crypto from 'expo-crypto';
global.crypto = {
  getRandomValues: (arr) => Crypto.getRandomValues(arr),
};

// Stream polyfill
import { Stream } from 'stream-browserify';
global.Stream = Stream;

// Buffer polyfill
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Events polyfill
import EventEmitter from 'events';
global.EventEmitter = EventEmitter;

// Node.js process polyfill
if (typeof process === 'undefined') {
  global.process = require('process/browser');
}

// Mock https module
global.https = https;

// Mock http module
global.http = http;