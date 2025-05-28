// supabase.ts - API endpoints and keys only
import 'react-native-url-polyfill/auto'

// Export Supabase API URLs and keys for direct REST API calls
export const supabaseUrl = "https://lcigyiaryxeajdjaqbfv.supabase.co"
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaWd5aWFyeXhlYWpkamFxYmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzM0OTIsImV4cCI6MjA2Mzg0OTQ5Mn0.FF-6spGN1-h5Z54pKC4F33hEqueabgQXElrqQCt85cM"

// Auth endpoints
export const authEndpoints = {
  signUp: '/auth/v1/signup',
  signIn: '/auth/v1/token?grant_type=password',
  signOut: '/auth/v1/logout',
  refreshToken: '/auth/v1/token?grant_type=refresh_token'
}

// Database endpoints
export const dbEndpoints = {
  tables: '/rest/v1/'
}

// Storage endpoints
export const storageEndpoints = {
  buckets: '/storage/v1/bucket'
}