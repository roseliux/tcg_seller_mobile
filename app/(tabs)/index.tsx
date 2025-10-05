import { StyleSheet } from 'react-native';

import { useAuth } from '@/components/auth/AuthContext';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TCG Marketplace!</Text>

      <View style={styles.userInfoContainer}>
        <Text style={styles.welcomeText}>
          Hello, {user?.first_name} {user?.last_name}! 👋
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  verifiedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '80%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
