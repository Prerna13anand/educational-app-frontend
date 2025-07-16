import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

// --- Type Definitions ---
type Video = {
  _id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
};

// --- Reusable Components ---
const VideoThumbnail = ({ item }: { item: Video }) => (
  <Link
    href={{
      pathname: '/videoPlayer',
      params: { videoId: item.videoId },
    }}
    asChild
  >
    <TouchableOpacity style={styles.videoCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text numberOfLines={2} style={styles.videoTitle}>
        {item.title}
      </Text>
    </TouchableOpacity>
  </Link>
);
const ChannelSection = ({
  videos,
  channelName,
}: {
  videos: Video[];
  channelName: string;
}) => {
  const channelVideos = videos.filter((video) => video.channel === channelName);
  if (channelVideos.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{channelName}</Text>
      <FlatList
        horizontal
        data={channelVideos}
        renderItem={({ item }) => <VideoThumbnail item={item} />}
        // keyExtractor={(item, index) => item._id || item.videoId || index.toString()} 
        keyExtractor={(item, index) => item._id || item.videoId || index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 10 }}
      />
    </View>
  );
};


// --- Main Home Screen Component ---
export default function HomeScreen() {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [randomVideos, setRandomVideos] = useState<Video[]>([]);
  const [uniqueChannels, setUniqueChannels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          'https://educational-app-backend-13s7.onrender.com/api/videos'
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Video[] = await response.json();
        setAllVideos(data);

        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setRandomVideos(shuffled.slice(0, 5));

        const channels = [...new Set(data.map((video) => video.channel))];
        setUniqueChannels(channels);

      } catch (err) {
        setError('Failed to fetch videos. Please check your connection.');
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // --- Render Logic ---
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Videos</Text>
          <FlatList
            horizontal
            data={randomVideos}
            renderItem={({ item }) => <VideoThumbnail item={item} />}
            // keyExtractor={(item) => item._id}
            keyExtractor={(item, index) => item._id || item.videoId || index.toString()}

            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 10 }}
          />
        </View>

        {/* This part fixes the UI and the "key" error */}
        {uniqueChannels.filter((c) => !!c)
        .map((channelName) => (
          <ChannelSection
            key={channelName} // The missing "key" prop is now here
            videos={allVideos}
            channelName={channelName}
          />
        ))}
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
  sectionContainer: {
    marginTop: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  videoCard: {
    width: 200,
    marginRight: 15,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#333333',
    borderRadius: 8,
  },
  videoTitle: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});  

