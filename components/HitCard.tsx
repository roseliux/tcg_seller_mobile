import { Text, View } from '@/components/Themed';
import CommentsModal, { Comment } from '@/components/CommentsModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export interface Hit {
  id: number;
  item_title: string;
  description: string;
  price: string;
  listing_type: 'selling' | 'looking';
  condition: string;
  status: string;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  category_id: string;
  card_set_id: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  photos?: string[];
}

interface HitCardProps {
  hit: Hit;
  onLike: (hitId: number) => void;
  onComment: (hitId: number, comment: string) => void;
  onViewComments: (hitId: number) => void;
  onOpenComments: (hitId: number) => void;
}

export default function HitCard({ hit, onLike, onComment, onViewComments, onOpenComments }: HitCardProps) {
  const [isLiked, setIsLiked] = useState(hit.is_liked);
  const [likesCount, setLikesCount] = useState(hit.likes_count);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLike(hit.id);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {hit.user_avatar ? (
              <Image source={{ uri: hit.user_avatar }} style={styles.avatarImage} />
            ) : (
              <FontAwesome name="user-circle" size={40} color="#666" />
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{hit.user_name}</Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(hit.created_at)}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <FontAwesome name="ellipsis-h" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Photo Section */}
      {hit.photos && hit.photos.length > 0 && (
        <View style={styles.photoSection}>
          <Image
            source={{ uri: hit.photos[0] }}
            style={styles.photo}
            resizeMode="cover"
          />
          {hit.photos.length > 1 && (
            <View style={styles.photoCountBadge}>
              <FontAwesome name="camera" size={12} color="#fff" />
              <Text style={styles.photoCountText}>{hit.photos.length}</Text>
            </View>
          )}
        </View>
      )}

      {/* Trophy Badge for Share Hit */}
      <View style={styles.trophyBadge}>
        <FontAwesome name="trophy" size={16} color="#FF9500" />
        <Text style={styles.trophyText}>Pokemon</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{hit.item_title}</Text>
        {/* {hit.condition && hit.condition !== 'Any' && (
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>Condition: {hit.condition}</Text>
          </View>
        )} */}
        <Text style={styles.description} numberOfLines={3}>
          {hit.description}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
          >
            <FontAwesome
              name={isLiked ? "heart" : "heart-o"}
              size={24}
              color={isLiked ? "#FF3B30" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onOpenComments(hit.id)}
          >
            <FontAwesome name="comment-o" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="share" size={22} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="bookmark-o" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Likes and Comments Count */}
      <View style={styles.stats}>
        {likesCount > 0 && (
          <Text style={styles.likesText}>
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </Text>
        )}
        {hit.comments_count > 0 && (
          <TouchableOpacity onPress={() => onOpenComments(hit.id)}>
            <Text style={styles.commentsText}>
              View all {hit.comments_count} comments
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  photoSection: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoCountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  photoCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  trophyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  trophyText: {
    color: '#FF9500',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  conditionBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  stats: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 6,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  commentsText: {
    fontSize: 14,
    color: '#666',
  },
});
