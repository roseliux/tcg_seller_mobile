import { useAuth } from '@/components/auth/AuthContext';
import { Text, View } from '@/components/Themed';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

// Mock user stats data - replace with real API data later
const mockUserStats = {
  totalCards: 56,
  totalSealed: 3,
  totalGraded: 0,
  totalValue: 49263.72,
  portfolio: {
    name: 'Main',
    cards: 56,
    sealed: 3,
    graded: 0,
    value: 49263.72,
  },

};

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.first_name?.charAt(0) || 'U'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Text style={styles.editAvatarText}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.displayName}>
            {user?.first_name} {user?.last_name}
          </Text>
          {user?.user_name && (
            <Text style={styles.username}>@{user.user_name}</Text>
          )}
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      {/* <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Cards</Text>
            <Text style={styles.statValue}>{formatNumber(mockUserStats.totalCards)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Sealed</Text>
            <Text style={styles.statValue}>{formatNumber(mockUserStats.totalSealed)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Graded</Text>
            <Text style={styles.statValue}>{formatNumber(mockUserStats.totalGraded)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Value</Text>
            <Text style={styles.statValueCurrency}>{formatCurrency(mockUserStats.totalValue)}</Text>
          </View>
        </View>
      </View> */}

      {/* Action Buttons */}
      {/* <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Social Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Edit Background</Text>
        </TouchableOpacity>
      </View> */}

      {/* Navigation Tabs */}
      {/* <View style={styles.navTabs}>
        <TouchableOpacity style={[styles.navTab, styles.activeNavTab]}>
          <Text style={[styles.navTabText, styles.activeNavTabText]}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab}>
          <Text style={styles.navTabText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab}>
          <Text style={styles.navTabText}>Support</Text>
        </TouchableOpacity>
      </View> */}

      {/* Portfolio Section */}
      <View style={styles.portfolioSection}>
        <Text style={styles.portfolioTitle}>
          Portfolio: <Text style={styles.portfolioName}>{mockUserStats.portfolio.name}</Text>
        </Text>

        <View style={styles.portfolioStats}>
          <View style={styles.portfolioStatItem}>
            <Text style={styles.portfolioStatLabel}>Cards</Text>
            <Text style={styles.portfolioStatValue}>{formatNumber(mockUserStats.portfolio.cards)}</Text>
          </View>
          <View style={styles.portfolioStatItem}>
            <Text style={styles.portfolioStatLabel}>Sealed</Text>
            <Text style={styles.portfolioStatValue}>{formatNumber(mockUserStats.portfolio.sealed)}</Text>
          </View>
          <View style={styles.portfolioStatItem}>
            <Text style={styles.portfolioStatLabel}>Graded</Text>
            <Text style={styles.portfolioStatValue}>{formatNumber(mockUserStats.portfolio.graded)}</Text>
          </View>
          <View style={styles.portfolioStatItem}>
            <Text style={styles.portfolioStatLabel}>Value</Text>
            <Text style={styles.portfolioStatValueCurrency}>{formatCurrency(mockUserStats.portfolio.value)}</Text>
          </View>
        </View>
      </View>

      {/* Additional Profile Actions */}
      <View style={styles.additionalActions}>
        <TouchableOpacity style={styles.profileActionButton}>
          <Text style={styles.profileActionText}>📊 View Collection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileActionButton}>
          <Text style={styles.profileActionText}>💰 Sales History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileActionButton}>
          <Text style={styles.profileActionText}>⭐ Reviews & Ratings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileActionButton}>
          <Text style={styles.profileActionText}>🔔 Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <View style={styles.signOutContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background like other tabs
  },
  // Profile Header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ECDC4', // Teal color like in the image
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarText: {
    fontSize: 12,
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#666',
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  // Stats Section
  statsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statValueCurrency: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
  },
  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  // Navigation Tabs
  navTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  navTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeNavTab: {
    backgroundColor: '#007AFF',
  },
  navTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeNavTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Portfolio Section
  portfolioSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  portfolioTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  portfolioName: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  portfolioStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  portfolioStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  portfolioStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  portfolioStatValueCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
  },
  // Additional Actions
  additionalActions: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileActionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  // Sign Out
  signOutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
