export const OAUTH_CONFIG = {
  google: {
    expoClientId: '539064377550-42d3g6n93fc0uoatufilt5si2d4u6rjv.apps.googleusercontent.com', 
    iosClientId: null, // Will add this later when you have an Apple Developer account
    androidClientId: null, // Will add this later
    scopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events.readonly'
    ]
  },
  outlook: {
    clientId: '12345678-9abc-def0-1234-56789abcdef0', // Replace with your Outlook client ID
    scopes: [
      'openid',
      'profile',
      'offline_access',
      'Calendars.Read'
    ]
  }
};
