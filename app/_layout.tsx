import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Set default styles for all screen headers
        headerStyle: {
          backgroundColor: '#1c1c1c', // Dark background
        },
        headerTintColor: '#ffffff', // White text
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* The 'index' screen is your home screen.
        We can give it a title for the header.
      */}
      <Stack.Screen name="index" options={{ title: 'Educational Companion' }} />

      {/* This defines the video player screen.
        The file for this screen will be app/videoPlayer.tsx
      */}
      <Stack.Screen name="videoPlayer" options={{ title: 'Video Player' }} />
    </Stack>
  );
}

