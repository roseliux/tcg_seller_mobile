import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface Comment {
  id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  comment: string;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
  replies_count?: number;
}

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onPostComment: (comment: string) => void;
  onLikeComment: (commentId: number) => void;
  isLoading?: boolean;
}

export default function CommentsModal({
  visible,
  onClose,
  comments,
  onPostComment,
  onLikeComment,
  isLoading = false,
}: CommentsModalProps) {
  const [commentText, setCommentText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    // Scroll to end when comments change and keyboard is visible
    if (comments.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [comments.length]);

  const handleSubmit = () => {
    if (commentText.trim()) {
      onPostComment(commentText.trim());
      setCommentText('');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        {item.user_avatar ? (
          <Image source={{ uri: item.user_avatar }} style={styles.avatarImage} />
        ) : (
          <FontAwesome name="user-circle" size={32} color="#666" />
        )}
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.commentUserName}>{item.user_name}</Text>
          <Text style={styles.commentTime}>{formatTimeAgo(item.created_at)}</Text>
          <Text style={styles.commentText}>{item.comment}</Text>
        </View>
        <View style={styles.commentActions}>
          <TouchableOpacity>
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
          {item.likes_count > 0 && (
            <Text style={styles.commentLikesCount}>{item.likes_count}</Text>
          )}
          {item.replies_count && item.replies_count > 0 && (
            <TouchableOpacity>
              <Text style={styles.viewRepliesText}>
                View {item.replies_count} {item.replies_count === 1 ? 'reply' : 'replies'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.commentLikeButton}
        onPress={() => onLikeComment(item.id)}
      >
        <FontAwesome
          name={item.is_liked ? "heart" : "heart-o"}
          size={14}
          color={item.is_liked ? "#FF3B30" : "#666"}
        />
      </TouchableOpacity>
    </View>
  );

  const renderEmoji = (emoji: string) => (
    <TouchableOpacity
      key={emoji}
      style={styles.emojiButton}
      onPress={() => setCommentText(prev => prev + emoji)}
    >
      <Text style={styles.emojiText}>{emoji}</Text>
    </TouchableOpacity>
  );

  const quickEmojis = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    //   presentationStyle="pageSheet"
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={[styles.container, isKeyboardVisible && styles.containerExpanded]} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerHandle} />
          <View style={styles.headerContent}>
            <View style={styles.headerLeft} />
            <Text style={styles.headerTitle}>Comments</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome name="times" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments List */}
        <FlatList
          ref={flatListRef}
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.commentsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="comment-o" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No comments yet</Text>
              <Text style={styles.emptySubtext}>Be the first to comment!</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Quick Emoji Reactions */}
        <View style={styles.emojiBar}>
          {quickEmojis.map(renderEmoji)}
        </View>

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={styles.inputContainer}>
            <View style={styles.inputAvatar}>
              <FontAwesome name="user-circle" size={32} color="#666" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="What do you think of this?"
              placeholderTextColor="#999"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !commentText.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!commentText.trim()}
            >
              <FontAwesome
                name="arrow-up"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '65%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerExpanded: {
    height: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  header: {
    // paddingTop: Platform.OS === 'ios' ? 70 : 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-end',
  },
  commentsList: {
    padding: 16,
    flexGrow: 1,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  commentContent: {
    flex: 1,
    marginRight: 8,
  },
  commentBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 12,
  },
  commentUserName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
  },
  commentText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 12,
    gap: 16,
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  commentLikesCount: {
    fontSize: 12,
    color: '#666',
  },
  viewRepliesText: {
    fontSize: 12,
    color: '#666',
  },
  commentLikeButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  emojiBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  emojiButton: {
    padding: 4,
  },
  emojiText: {
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    color: '#000',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
});
