// polyfills.js
import 'react-native-polyfill-globals/auto';
import 'react-native-url-polyfill/auto';
import { Stream } from 'stream-browserify';
import http from 'http-browserify';
import { Buffer } from 'buffer';
import { EventEmitter } from 'events';
import https from 'https-browserify';
import net from 'net-browserify';
import tls from 'tls-browserify';

// Polyfill for crypto
import * as Crypto from 'expo-crypto';
global.crypto = {
  getRandomValues: (arr) => Crypto.getRandomValues(arr),
};

// Stream polyfill
global.Stream = Stream;
global.stream = Stream;
globalThis.Stream = Stream;
globalThis.stream = Stream;
if (typeof window !== 'undefined') {
  window.Stream = Stream;
  window.stream = Stream;
}

// Buffer polyfill
global.Buffer = Buffer;
globalThis.Buffer = Buffer;
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Events polyfill
global.EventEmitter = EventEmitter;
globalThis.EventEmitter = EventEmitter;
if (typeof window !== 'undefined') {
  window.EventEmitter = EventEmitter;
}

// Node.js process polyfill
if (typeof process === 'undefined') {
  global.process = require('process/browser');
}

// https polyfill
global.https = https;
globalThis.https = https;
if (typeof window !== 'undefined') {
  window.https = https;
}

// http polyfill
global.http = http;
globalThis.http = http;
if (typeof window !== 'undefined') {
  window.http = http;
}

// net polyfill
global.net = net;
globalThis.net = net;
if (typeof window !== 'undefined') {
  window.net = net;
}

// tls polyfill
global.tls = tls;
globalThis.tls = tls;
if (typeof window !== 'undefined') {
  window.tls = tls;
}