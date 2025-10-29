import CommentsModal, { Comment } from '@/components/CommentsModal';
import HitCard, { Hit } from '@/components/HitCard';
import { Text, View } from '@/components/Themed';
import { authAPI } from '@/services/api';
import { mockHits } from '@/services/mockHits';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const USE_MOCK_DATA = true; // Set to false when backend is ready

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 1,
    user_id: 2,
    user_name: 'mariaballesteros86',
    comment: 'Me encanta',
    created_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    likes_count: 113,
    is_liked: false,
    replies_count: 8,
  },
  {
    id: 2,
    user_id: 3,
    user_name: 'javierayala_31',
    comment: 'Que suertudo, no he podido conseguir esa carta',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes_count: 3,
    is_liked: false,
    replies_count: 1,
  },
  {
    id: 3,
    user_id: 4,
    user_name: '-_jaer_-_',
    comment: 'gastaste mas de lo que vale 😂',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes_count: 28,
    is_liked: false,
  },
];

export default function HomeScreen() {
  const [hits, setHits] = useState<Hit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedHitId, setSelectedHitId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchHits = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setHits(mockHits);
      } else {
        const response = await authAPI.getSharedHits();

        // Transform API response to Hit interface
        const transformedHits: Hit[] = response.map((item: any) => ({
          id: item.id,
          item_title: item.item_title,
          description: item.description || 'No description',
          price: item.price,
          listing_type: item.listing_type,
          condition: item.condition || 'Any',
          status: item.status,
          user_id: item.user_id,
          user_name: item.user_name || `User ${item.user_id}`,
          user_avatar: item.user_avatar,
          category_id: item.category_id,
          card_set_id: item.card_set_id,
          created_at: item.created_at,
          likes_count: item.likes_count || 0,
          comments_count: item.comments_count || 0,
          is_liked: item.is_liked || false,
          photos: item.photos || [],
        }));

        setHits(transformedHits);
      }
    } catch (error: any) {
      console.error('Error fetching hits:', error);
      Alert.alert('Error', error.message || 'Failed to load shared hits');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHits();
  }, []);

  const handleLike = async (hitId: number) => {
    try {
      const hit = hits.find(h => h.id === hitId);
      if (!hit) return;

      if (hit.is_liked) {
        await authAPI.unlikeHit(hitId);
      } else {
        await authAPI.likeHit(hitId);
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      // Revert the optimistic update by refetching
      fetchHits();
    }
  };

  const handleComment = async (hitId: number, comment: string) => {
    try {
      if (USE_MOCK_DATA) {
        // Add comment to local mock data
        const newComment: Comment = {
          id: Date.now(),
          user_id: 99,
          user_name: 'You',
          comment,
          created_at: new Date().toISOString(),
          likes_count: 0,
          is_liked: false,
        };
        setComments(prev => [...prev, newComment]);
      } else {
        await authAPI.commentOnHit(hitId, comment);
      }

      // Update comments count locally
      setHits(prev => prev.map(hit =>
        hit.id === hitId
          ? { ...hit, comments_count: hit.comments_count + 1 }
          : hit
      ));
    } catch (error: any) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const handleOpenComments = async (hitId: number) => {
    setSelectedHitId(hitId);

    if (USE_MOCK_DATA) {
      // Use mock comments
      setComments(mockComments);
    } else {
      try {
        const fetchedComments = await authAPI.getHitComments(hitId);
        setComments(fetchedComments);
      } catch (error: any) {
        console.error('Error fetching comments:', error);
        Alert.alert('Error', 'Failed to load comments');
        return;
      }
    }

    setShowCommentsModal(true);
  };

  const handleLikeComment = (commentId: number) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            is_liked: !comment.is_liked,
            likes_count: comment.is_liked ? comment.likes_count - 1 : comment.likes_count + 1,
          }
        : comment
    ));
  };

  const handleViewComments = (hitId: number) => {
    handleOpenComments(hitId);
  };

  const handleRefresh = () => {
    fetchHits(true);
  };

  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="trophy" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Shared Hits Yet</Text>
        <Text style={styles.emptyText}>
          Be the first to share your amazing pulls!
        </Text>
        <TouchableOpacity style={styles.emptyButton}>
          <Text style={styles.emptyButtonText}>Share Your Hit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <FontAwesome name="trophy" size={24} color="#FF9500" />
      <Text style={styles.headerTitle}>Share Hits</Text>
      <Text style={styles.headerSubtitle}>Amazing pulls from the community</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading shared hits...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={hits}
            renderItem={({ item }) => (
              <HitCard
                hit={item}
                onLike={handleLike}
                onComment={handleComment}
                onViewComments={handleViewComments}
                onOpenComments={handleOpenComments}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            // ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#007AFF"
              />
            }
            showsVerticalScrollIndicator={false}
          />

          <CommentsModal
            visible={showCommentsModal}
            onClose={() => setShowCommentsModal(false)}
            comments={comments}
            onPostComment={(comment) => {
              if (selectedHitId) {
                handleComment(selectedHitId, comment);
              }
            }}
            onLikeComment={handleLikeComment}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 12,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});