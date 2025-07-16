import { useLocalSearchParams, Link } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import axios from 'axios';

// --- Type Definitions ---
type Video = {
  _id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
};

type Concept = {
  _id: string;
  concept: string;
  reference: string;
};

// --- Main Video Player Screen Component ---
export default function VideoPlayerScreen() {
  // useLocalSearchParams is the new way to get navigation params in Expo Router
  const { videoId } = useLocalSearchParams();

  const [playing, setPlaying] = useState(false);
  const [videoDetails, setVideoDetails] = useState<Video | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure we have a videoId before fetching
    if (!videoId || typeof videoId !== 'string') {
      setError('Video ID not found.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch both video details and concepts at the same time
        const [detailsRes, conceptsRes] = await Promise.all([
          axios.get(`https://educational-app-backend-13s7.onrender.com/api/videos/${videoId}`),
          axios.get(`https://educational-app-backend-13s7.onrender.com/api/concepts/${videoId}`),
        ]);

        setVideoDetails(detailsRes.data);
        setConcepts(conceptsRes.data);

      } catch (err) {
        setError('Failed to load video data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoId]); // Re-run effect if videoId changes

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  // --- Render Logic ---
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error || !videoDetails) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error || 'Video details could not be loaded.'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.playerContainer}>
          <YoutubePlayer
            height={220}
            play={playing}
            videoId={videoDetails.videoId}
            onChangeState={onStateChange}
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.titleText}>{videoDetails.title}</Text>
          <Text style={styles.channelText}>{videoDetails.channel}</Text>

          {/* NCERT Concepts Section */}
          <Text style={styles.sectionTitle}>Related NCERT Concepts</Text>
          {concepts.length > 0 ? (
            concepts.map((item) => (
              <View key={item._id} style={styles.conceptCard}>
                <Text style={styles.conceptText}>{item.concept}</Text>
                <Text style={styles.conceptReference}>{item.reference}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noConceptsText}>
              No concepts found for this video.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerContainer: {
    // The player has its own background, so we don't need to style it
  },
  detailsContainer: {
    padding: 15,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  channelText: {
    color: '#a9a9a9',
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    borderTopColor: '#333',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  conceptCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  conceptText: {
    color: '#f0f0f0',
    fontSize: 15,
    lineHeight: 22,
  },
  conceptReference: {
    color: '#00aaff',
    fontSize: 14,
    marginTop: 10,
    fontStyle: 'italic',
  },
  noConceptsText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
    textAlign: 'center',
  },
});