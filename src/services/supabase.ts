import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

const supabaseUrl = "https://lcigyiaryxeajdjaqbfv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaWd5aWFyeXhlYWpkamFxYmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzM0OTIsImV4cCI6MjA2Mzg0OTQ5Mn0.FF-6spGN1-h5Z54pKC4F33hEqueabgQXElrqQCt85cM"

// Create a custom Supabase client without realtime features
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
  db: {
    schema: 'public',
  },
  // Completely disable realtime
  realtime: {
    enabled: false,
  },
  global: {
    headers: {
      'X-Disable-Realtime': 'true'
    }
  }
})

// Completely remove the realtime client to prevent WebSocket initialization
// @ts-ignore - Removing the realtime client to prevent WebSocket errors
supabase.realtime = {
  connect: () => {},
  disconnect: () => {},
  channel: () => ({
    on: () => ({}),
    subscribe: () => Promise.resolve({}),
  }),
  // Add other necessary methods as empty functions
  getChannels: () => [],
  removeChannel: () => {},
  removeAllChannels: () => {},
};

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})