import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

// Mock notification data - similar to Instagram but for trading cards
const mockNotifications = [
  {
    id: 1,
    type: 'follow_request',
    user: { name: 'tcg_collector92', avatar: 'TC' },
    message: 'Follow requests',
    subMessage: 'cardmaster21 + 7 others',
    timestamp: new Date(),
    hasBlueIndicator: true,
  },
  {
    id: 2,
    type: 'card_liked',
    user: { name: 'pokemon_trader', avatar: 'PT' },
    message: 'pokemon_trader liked your Charizard VMAX listing.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
    cardImage: '🔥',
  },
  {
    id: 3,
    type: 'offer_received',
    user: { name: 'yugioh_master', avatar: 'YM' },
    message: 'yugioh_master made an offer on your Blue-Eyes White Dragon.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
    cardImage: '🐉',
  },
  {
    id: 4,
    type: 'card_sold',
    user: { name: 'system', avatar: '💰' },
    message: 'Your Pikachu Illustrator card was sold for $5,275!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1d ago
    cardImage: '⚡',
  },
  {
    id: 5,
    type: 'multiple_likes',
    user: { name: 'card_collector', avatar: 'CC' },
    message: 'cardking88, traderguy and others liked your listing.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1d ago
    cardImage: '🎴',
  },
  {
    id: 6,
    type: 'watchlist_available',
    user: { name: 'system', avatar: '👀' },
    message: 'A card from your watchlist is now available: Black Lotus Alpha.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2d ago
    cardImage: '🌸',
  },
  {
    id: 7,
    type: 'price_drop',
    user: { name: 'system', avatar: '📉' },
    message: 'Price dropped on your watched item: Mox Ruby.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2d ago
    cardImage: '💎',
  },
  {
    id: 8,
    type: 'comment',
    user: { name: 'vintage_cards', avatar: 'VC' },
    message: 'vintage_cards commented on your post: "Is this card still available?"',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3d ago
    cardImage: '💬',
  },
];

export default function NotificationsScreen() {
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  };

  const getTimeSection = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) return 'Today';
    if (diffInHours < 48) return 'Yesterday';
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays <= 7) return 'Last 7 days';
    return 'Earlier';
  };

  const groupedNotifications = mockNotifications.reduce((groups: any, notification) => {
    const section = getTimeSection(notification.timestamp);
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(notification);
    return groups;
  }, {});

  const renderNotificationItem = (notification: any) => (
    <TouchableOpacity key={notification.id} style={styles.notificationItem}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{notification.user.avatar}</Text>
        </View>
        {notification.type === 'card_liked' && (
          <View style={styles.likeIndicator}>
            <Text style={styles.likeIcon}>❤️</Text>
          </View>
        )}
        {notification.type === 'offer_received' && (
          <View style={styles.offerIndicator}>
            <Text style={styles.offerIcon}>💰</Text>
          </View>
        )}
        {notification.type === 'card_sold' && (
          <View style={styles.soldIndicator}>
            <Text style={styles.soldIcon}>✅</Text>
          </View>
        )}
      </View>

      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{notification.message}</Text>
        {notification.subMessage && (
          <Text style={styles.subMessage}>{notification.subMessage}</Text>
        )}
        <Text style={styles.timestamp}>{formatTimeAgo(notification.timestamp)}</Text>
      </View>

      {notification.hasBlueIndicator && (
        <View style={styles.blueIndicator} />
      )}

      {notification.cardImage && (
        <View style={styles.cardImageContainer}>
          <Text style={styles.cardImage}>{notification.cardImage}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="chevron-left" size={18} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedNotifications).map(([section, notifications]: [string, any]) => (
          <View key={section}>
            <Text style={styles.sectionTitle}>{section}</Text>
            {notifications.map(renderNotificationItem)}
          </View>
        ))}
      </ScrollView>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  headerSpacer: {
    width: 34, // Same width as back button to center title
  },
  scrollContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  likeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  likeIcon: {
    fontSize: 10,
  },
  offerIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  offerIcon: {
    fontSize: 10,
  },
  soldIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  soldIcon: {
    fontSize: 10,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 18,
  },
  subMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  blueIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  cardImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  cardImage: {
    fontSize: 20,
  },
});