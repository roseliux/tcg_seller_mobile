import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Category from './Category';
import LocationSelector from './LocationSelector';

interface SearchResult {
  id: string;
  name: string;
  type: 'card' | 'set' | 'category';
}

export default function SearchCategoryBar({ selectedCategory, onCategorySelect, location, setLocation }: {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  location: string;
  setLocation: (location: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState<string>('pokemon');

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // TODO: Replace with actual API calls to your Rails backend
    //   const mockResults: SearchResult[] = [
    //     { id: '1', name: 'Charizard Base Set', type: 'card' },
    //     { id: '2', name: 'Pokemon Base Set', type: 'set' },
    //     { id: '3', name: 'Magic: The Gathering', type: 'category' },
    //   ].filter(item =>
    //     item.name.toLowerCase().includes(query.toLowerCase())
    //   );

    //   await new Promise(resolve => setTimeout(resolve, 500));
    //   setSearchResults(mockResults);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    handleSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={styles.resultItem}>
      <View style={styles.resultIcon}>
        <FontAwesome
          name={item.type === 'card' ? 'credit-card' : item.type === 'set' ? 'folder' : 'tag'}
          size={16}
          color="#666"
        />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
      </View>
      <FontAwesome name="chevron-right" size={14} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#fff'}} edges={['top', 'left', 'right', ]}>
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cards, sets, or categories..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <FontAwesome name="times-circle" size={16} color="#999" />
            </TouchableOpacity>
          )}
          <LocationSelector location={location} onLocationChange={setLocation} />
        </View>

      </View>
      <Category
        onPress={(category) => onCategorySelect(category.id)}
        selectedCategory={selectedCategory}
      />

      {/* <View style={styles.resultsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : hasSearched ? (
          searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <FontAwesome name="search" size={48} color="#ccc" />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search terms or browse categories instead.
              </Text>
            </View>
          )
        ) : (
          <View style={styles.placeholderContainer}>
            <FontAwesome name="search" size={64} color="#e0e0e0" />
            <Text style={styles.placeholderTitle}>Search TCG Marketplace</Text>
            <Text style={styles.placeholderSubtitle}>
              Find cards, sets, and categories from your favorite trading card games.
            </Text>
          </View>
        )}
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    // borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    // paddingTop: 45,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    // marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  resultIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  resultType: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#e0e0e0',
    marginLeft: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});