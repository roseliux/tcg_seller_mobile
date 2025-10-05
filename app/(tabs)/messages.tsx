import { useAuth } from '@/components/auth/AuthContext';
import { Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    otherUser: {
      name: 'CardCollector123',
      avatar: '👤',
    },
    lastMessage: {
      text: 'Is the Charizard still available?',
      timestamp: '2m ago',
      unread: true,
    },
    cardContext: {
      name: 'Charizard VMAX',
      price: '$45.99',
    },
  },
  {
    id: '2',
    otherUser: {
      name: 'TCGTrader',
      avatar: '🃏',
    },
    lastMessage: {
      text: 'Thanks for the quick transaction!',
      timestamp: '1h ago',
      unread: false,
    },
    cardContext: {
      name: 'Pikachu V',
      price: '$12.50',
    },
  },
  {
    id: '3',
    otherUser: {
      name: 'PokemonMaster',
      avatar: '⚡',
    },
    lastMessage: {
      text: 'Would you accept $25 for the Mewtwo?',
      timestamp: '3h ago',
      unread: true,
    },
    cardContext: {
      name: 'Mewtwo GX',
      price: '$28.75',
    },
  },
  {
    id: '4',
    otherUser: {
      name: 'DragonCards',
      avatar: '🐉',
    },
    lastMessage: {
      text: 'Can you send more photos?',
      timestamp: '1d ago',
      unread: false,
    },
    cardContext: {
      name: 'Rayquaza VMAX',
      price: '$62.00',
    },
  },
];

// Mock data for individual chat messages
const mockMessages = [
  {
    id: '1',
    senderId: 'user',
    text: 'Hi! Is this card still available?',
    timestamp: '10:30 AM',
    isOwn: true,
  },
  {
    id: '2',
    senderId: 'other',
    text: 'Yes, it is! Are you interested?',
    timestamp: '10:32 AM',
    isOwn: false,
  },
  {
    id: '3',
    senderId: 'user',
    text: 'Great! Can you tell me about the condition?',
    timestamp: '10:35 AM',
    isOwn: true,
  },
  {
    id: '4',
    senderId: 'other',
    text: "It's Near Mint condition, no visible scratches or damage. I can send more photos if you'd like.",
    timestamp: '10:37 AM',
    isOwn: false,
  },
];

interface Conversation {
  id: string;
  otherUser: {
    name: string;
    avatar: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    unread: boolean;
  };
  cardContext: {
    name: string;
    price: string;
  };
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

type ViewMode = 'conversations' | 'chat';

export default function MessagesScreen() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const handleConversationPress = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setViewMode('chat');
  };

  const handleBackPress = () => {
    setViewMode('conversations');
    setSelectedConversation(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => handleConversationPress(item)}
    >
      <View style={styles.conversationHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.avatar}>{item.otherUser.avatar}</Text>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.otherUser.name}</Text>
            <Text style={styles.cardContext}>
              Re: {item.cardContext.name} ({item.cardContext.price})
            </Text>
          </View>
        </View>
        <View style={styles.messageInfo}>
          <Text style={styles.timestamp}>{item.lastMessage.timestamp}</Text>
          {item.lastMessage.unread && <View style={styles.unreadBadge} />}
        </View>
      </View>

      <Text
        style={[
          styles.lastMessage,
          item.lastMessage.unread && styles.unreadMessage
        ]}
        numberOfLines={2}
      >
        {item.lastMessage.text}
      </Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isOwn ? styles.ownMessageText : styles.otherMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={[
        styles.messageTimestamp,
        item.isOwn ? styles.ownTimestamp : styles.otherTimestamp
      ]}>
        {item.timestamp}
      </Text>
    </View>
  );

  const renderConversationsView = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>
          Chat with buyers and sellers
        </Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.newMessageButton}>
          <Text style={styles.newMessageButtonText}>✉️ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conversationsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No messages yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start buying or selling to connect with other users!
            </Text>
          </View>
        }
      />
    </View>
  );

  const renderChatView = () => (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.chatUserInfo}>
          <Text style={styles.chatAvatar}>{selectedConversation?.otherUser.avatar}</Text>
          <View>
            <Text style={styles.chatUserName}>{selectedConversation?.otherUser.name}</Text>
            <Text style={styles.chatCardContext}>
              {selectedConversation?.cardContext.name}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={mockMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return viewMode === 'conversations' ? renderConversationsView() : renderChatView();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchSection: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 16,
  },
  newMessageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newMessageButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  conversationsList: {
    padding: 10,
  },
  conversationCard: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    fontSize: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardContext: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  messageInfo: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  unreadMessage: {
    color: '#333',
    fontWeight: '500',
  },
  // Chat View Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  chatUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatAvatar: {
    fontSize: 20,
    marginRight: 10,
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  chatCardContext: {
    fontSize: 12,
    color: '#007AFF',
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTimestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherTimestamp: {
    color: '#999',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});