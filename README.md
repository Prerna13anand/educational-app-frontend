# AI-Powered Educational Companion App

This is a full-stack mobile application built with React Native (Expo) and a Node.js backend. The app serves as an AI-powered educational companion that enhances the learning experience from YouTube videos by linking video content directly with relevant NCERT textbook concepts.

The backend for this project can be found in its own repository: [Link to your backend GitHub repo]

## Features

- **Dynamic Home Screen**: Displays a random selection of "Top Videos" and horizontally scrollable, channel-wise sections populated dynamically from a live database.
- **YouTube Video Player**: A dedicated screen to play selected videos.
- **AI Concept Mapping**: Fetches the transcript of a YouTube video and uses the Google Gemini API to generate relevant educational concepts.
- **Live Backend**: The application is connected to a live Node.js backend hosted on Render.
- **Pull-to-Refresh**: The Home Screen supports pull-to-refresh functionality to reload video data.

## Tech Stack

- **Frontend**: React Native (Expo)
- **Navigation**: Expo Router
- **API Client**: Fetch API

## Setup and Installation

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone <your-frontend-repo-link>
    cd EduAppExpo
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the application:**
    ```bash
    npx expo start
    ```
    Then, scan the QR code with the Expo Go app on your Android device. The backend is live and does not need to be run locally.

## Known Issues

-   **NCERT Concept Generation**: The AI concept generation feature is fully implemented in the backend. However, it currently displays "No concepts found for this video." This is because the `youtube-transcript` library used to fetch video transcripts is unable to find available transcripts for the current list of sample videos. The backend logic correctly handles this by returning an empty list, but to see the AI in action, the database would need to be seeded with videos that are confirmed to have transcripts enabled on YouTube.



## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
