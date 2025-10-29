import { Text, View } from '@/components/Themed';
import BuyForm from '@/components/listing-forms/BuyForm';
import SellForm from '@/components/listing-forms/SellForm';
import ShareHitForm from '@/components/listing-forms/ShareHitForm';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

export default function PostListingScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<'sell' | 'looking' | 'share'>(
    (tab as 'sell' | 'looking' | 'share') || 'sell'
  );

  const renderForm = () => {
    switch (activeTab) {
      case 'sell':
        return <SellForm />;
      case 'looking':
        return <BuyForm />;
      case 'share':
        return <ShareHitForm />;
      default:
        return <SellForm />;
    }
  };

  return (
    <View style={styles.container}>
      {renderForm()}

      {/* Bottom Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sell' && styles.tabActive]}
          onPress={() => setActiveTab('sell')}
        >
          <FontAwesome
            name="tag"
            size={20}
            color={activeTab === 'sell' ? '#007AFF' : '#666'}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'sell' && styles.tabTextActive]}>
            Sell
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'looking' && styles.tabActive]}
          onPress={() => setActiveTab('looking')}
        >
          <FontAwesome
            name="search"
            size={20}
            color={activeTab === 'looking' ? '#007AFF' : '#666'}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'looking' && styles.tabTextActive]}>
            Looking
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'share' && styles.tabActive]}
          onPress={() => setActiveTab('share')}
        >
          <FontAwesome
            name="trophy"
            size={20}
            color={activeTab === 'share' ? '#007AFF' : '#666'}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'share' && styles.tabTextActive]}>
            Share Hit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 3,
    borderTopColor: 'transparent',
  },
  tabActive: {
    borderTopColor: '#007AFF',
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
