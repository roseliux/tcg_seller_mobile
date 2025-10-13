import { useAuth } from '@/components/auth/AuthContext';
import { Text, View } from '@/components/Themed';
import { authAPI, Category } from '@/services/api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

// Mock data for marketplace items (replace with real API data later)
const mockMarketplaceItems = [
  {
    id: '1',
    name: 'Charizard VMAX',
    set: 'Champion\'s Path',
    rarity: 'Ultra Rare',
    price: '$45.99',
    condition: 'Near Mint',
    seller: 'CardCollector123',
  },
  {
    id: '2',
    name: 'Pikachu V',
    set: 'Vivid Voltage',
    rarity: 'Rare Holo V',
    price: '$12.50',
    condition: 'Lightly Played',
    seller: 'TCGTrader',
  },
  {
    id: '3',
    name: 'Mewtwo GX',
    set: 'Shining Legends',
    rarity: 'GX Rare',
    price: '$28.75',
    condition: 'Near Mint',
    seller: 'PokemonMaster',
  },
  {
    id: '4',
    name: 'Rayquaza VMAX',
    set: 'Evolving Skies',
    rarity: 'Ultra Rare',
    price: '$62.00',
    condition: 'Mint',
    seller: 'DragonCards',
  },
];

// Mock data for user's selling items
const mockSellingItems: SellingItem[] = [
  {
    id: '5',
    name: 'Lugia V',
    set: 'Silver Tempest',
    rarity: 'Rare Holo V',
    price: '$18.99',
    condition: 'Near Mint',
    status: 'Active',
    views: 45,
  },
  {
    id: '6',
    name: 'Garchomp VSTAR',
    set: 'Brilliant Stars',
    rarity: 'VSTAR Rare',
    price: '$25.00',
    condition: 'Mint',
    status: 'Sold',
    views: 73,
  },
];

// Mock data for wishlist/looking items
const mockLookingItems: LookingItem[] = [
  {
    id: '7',
    name: 'Shining Charizard',
    set: 'Neo Revelation',
    maxPrice: '$150.00',
    condition: 'Near Mint or better',
    priority: 'High',
  },
  {
    id: '8',
    name: 'Base Set Blastoise',
    set: 'Base Set',
    maxPrice: '$80.00',
    condition: 'Lightly Played acceptable',
    priority: 'Medium',
  },
];

interface MarketplaceItem {
  id: string;
  name: string;
  set: string;
  rarity: string;
  price: string;
  condition: string;
  seller: string;
}

interface SellingItem {
  id: string;
  name: string;
  set: string;
  rarity: string;
  price: string;
  condition: string;
  status: 'Active' | 'Sold' | 'Pending';
  views: number;
}

interface LookingItem {
  id: string;
  name: string;
  set: string;
  maxPrice: string;
  condition: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface ListingItem {
  id: number;
  item_title: string;
  description: string;
  price: string;
  listing_type: 'selling' | 'looking';
  condition: 'any' | 'mint' | 'near_mint' | 'excellent' | 'good' | 'light_played' | 'played' | 'poor';
  status: 'active' | 'deactivated' | 'sold' | 'found';
  user_id: number;
  category_id: string;
  card_set_id: string;
  created_at: string;
  updated_at: string;
}

type TabType = 'explore' | 'looking' | 'selling';

export default function MarketplaceScreen() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [lookingItems, setLookingItems] = useState<ListingItem[]>([]);
  const [sellingItems, setSellingItems] = useState<ListingItem[]>([]);
  const { tab, refresh } = useLocalSearchParams<{ tab?: string; refresh?: string }>();


  // Fetch categories when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchLookingItems();
      fetchSellingItems();
    }
  }, [isAuthenticated, tab, refresh]);

    useEffect(() => {
      if (tab && ['explore', 'selling', 'looking'].includes(tab)) {
        setActiveTab(tab as TabType);
      }
    }, [tab]);

  const fetchCategories = async () => {
    // try {
    //   setIsLoadingCategories(true);
    //   setCategoriesError(null);

    //   const categoriesData = await authAPI.getCategories();
    //   setCategories(categoriesData);
    // } catch (error) {
    //   console.error('Error fetching categories:', error);
    //   setCategoriesError('Failed to load categories');
    //   // Fallback to default categories if API fails
      setCategories([
        { id: 'pokemon', name: 'Pokemon', created_at: '', updated_at: '' },
        { id: 'yugioh', name: 'Yu-Gi-Oh!', created_at: '', updated_at: '' },
        { id: 'magic', name: 'Magic: The Gathering', created_at: '', updated_at: '' },
      ]);
    // } finally {
      setIsLoadingCategories(false);
    // }
  };

  const fetchSellingItems = async () => {
    try {
      const sellingItemsData = await authAPI.getSellingItems();
      setSellingItems(sellingItemsData);
    } catch (error) {
      console.error('Error fetching selling items:', error);
    }
  };

    const fetchLookingItems = async () => {
    try {
      const lookingItemsData = await authAPI.getLookingItems();
      setLookingItems(lookingItemsData);
    } catch (error) {
      console.error('Error fetching looking items:', error);
    }
  };

  const handleCategoryPress = (category: Category) => {
    // TODO: Navigate to category-specific listings or filter current listings
    console.log('Selected category:', category.name);
    // You can implement navigation or filtering logic here
    // router.push(`/category/${category.id}`);
  };

  const renderMarketplaceItem = ({ item }: { item: MarketplaceItem }) => (
    <TouchableOpacity style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemSet}>Set: {item.set}</Text>
        <Text style={styles.itemRarity}>Rarity: {item.rarity}</Text>
        <Text style={styles.itemCondition}>Condition: {item.condition}</Text>
        <Text style={styles.itemSeller}>Seller: {item.seller}</Text>
      </View>

      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Claim</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSellingItem = ({ item }: { item: ListingItem }) => (
    <TouchableOpacity style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.item_title}</Text>
        <View style={styles.priceStatusContainer}>
          <Text style={styles.itemPrice}>$ {item.price}</Text>
          <Text style={[styles.statusBadge,
            item.status === 'active' ? styles.statusActive :
            item.status === 'sold' ? styles.statusSold : styles.statusPending
          ]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemSet}>Set: {item.card_set_id}</Text>
        {/* <Text style={styles.itemRarity}>Rarity: {item.rarity}</Text> */}
        <Text style={styles.itemCondition}>Condition: {item.condition}</Text>
        {/* <Text style={styles.itemViews}>👁 {item.views} views</Text> */}
      </View>

      <View style={styles.sellingActions}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.promoteButton}>
          <Text style={styles.promoteButtonText}>Promote</Text>
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );

  const renderLookingItem = ({ item }: { item: ListingItem }) => (
    <TouchableOpacity style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.item_title}</Text>
        <Text style={[styles.priorityBadge,
          item.status === 'active' ? styles.statusActive :
          item.status === 'found' ? styles.statusSold : styles.statusPending
        ]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemSet}>Set: {item.card_set_id}</Text>
        <Text style={styles.maxPrice}>Max Price: {item.price}</Text>
        {/* <Text style={styles.itemCondition}>Condition: {item.condition}</Text> */}
      </View>

      <View style={styles.lookingActions}>
        {/* <TouchableOpacity style={styles.alertButton}>
          <Text style={styles.alertButtonText}>🔔 Set Alert</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍 Search Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <>
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Popular Categories</Text>
              {isLoadingCategories ? (
                <View style={styles.categoriesLoading}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
              ) : categoriesError ? (
                <TouchableOpacity style={styles.retryContainer} onPress={fetchCategories}>
                  <Text style={styles.errorText}>Failed to load categories</Text>
                  <Text style={styles.retryText}>Tap to retry</Text>
                </TouchableOpacity>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryChip}
                      onPress={() => handleCategoryPress(category)}
                    >
                      <Text style={styles.categoryText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.marketplaceSection}>
              <Text style={styles.sectionTitle}>Featured Cards</Text>
              <FlatList
                data={mockMarketplaceItems}
                renderItem={renderMarketplaceItem}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.marketplaceList}
              />
            </View>
          </>
        );

      case 'selling':
        return (
          <View style={styles.marketplaceSection}>
            <View style={styles.sellingHeader}>
              <Text style={styles.sectionTitle}>Your Listings</Text>
              {/* <TouchableOpacity style={styles.addListingButton}> */}
                {/* <Text style={styles.addListingButtonText}>+ Add New</Text> */}
              {/* </TouchableOpacity> */}
            </View>
            <FlatList
              data={sellingItems}
              renderItem={renderSellingItem}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.marketplaceList}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No active listings</Text>
                  <Text style={styles.emptyStateSubtext}>Start selling your cards today!</Text>
                </View>
              }
            />
          </View>
        );

      case 'looking':
        return (
          <View style={styles.marketplaceSection}>
            <View style={styles.lookingHeader}>
              <Text style={styles.sectionTitle}>Your Wishlist</Text>
              {/* <TouchableOpacity style={styles.addWishlistButton}> */}
                {/* <Text style={styles.addWishlistButtonText}>+ Add Card</Text> */}
              {/* </TouchableOpacity> */}
            </View>
            <FlatList
              data={lookingItems}
              renderItem={renderLookingItem}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.marketplaceList}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No cards in wishlist</Text>
                  <Text style={styles.emptyStateSubtext}>Add cards you're looking for!</Text>
                </View>
              }
            />
          </View>
        );

      default:
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'explore' && styles.activeTab]}
          onPress={() => setActiveTab('explore')}
        >
          <Text style={[styles.tabText, activeTab === 'explore' && styles.activeTabText]}>
            🔍 Explore
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'looking' && styles.activeTab]}
          onPress={() => setActiveTab('looking')}
        >
          <Text style={[styles.tabText, activeTab === 'looking' && styles.activeTabText]}>
            👀 Looking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'selling' && styles.activeTab]}
          onPress={() => setActiveTab('selling')}
        >
          <Text style={[styles.tabText, activeTab === 'selling' && styles.activeTabText]}>
            💰 Selling
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/post-listing')}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
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
  searchButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  categoriesSection: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  marketplaceSection: {
    flex: 1,
    margin: 10,
  },
  marketplaceList: {
    paddingBottom: 20,
  },
  itemCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  itemDetails: {
    marginBottom: 15,
  },
  itemSet: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemRarity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemCondition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemSeller: {
    fontSize: 14,
    color: '#666',
  },
  buyButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Tab Styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
  },
  // Selling Item Styles
  priceStatusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  statusActive: {
    backgroundColor: '#34C759',
    color: '#fff',
  },
  statusSold: {
    backgroundColor: '#FF3B30',
    color: '#fff',
  },
  statusPending: {
    backgroundColor: '#FF9500',
    color: '#fff',
  },
  itemViews: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  sellingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  promoteButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  promoteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Looking Item Styles
  priorityBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityHigh: {
    backgroundColor: '#FF3B30',
    color: '#fff',
  },
  priorityMedium: {
    backgroundColor: '#FF9500',
    color: '#fff',
  },
  priorityLow: {
    backgroundColor: '#34C759',
    color: '#fff',
  },
  maxPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    fontWeight: '600',
  },
  lookingActions: {
    flexDirection: 'row',
    gap: 10,
  },
  alertButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  alertButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Header Styles
  sellingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  lookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  addListingButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addListingButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  addWishlistButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addWishlistButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  // Empty State Styles
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
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Categories Loading States
  categoriesLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  retryContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 4,
  },
  retryText: {
    fontSize: 12,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});