import SearchCategoryBar from '@/components/SearchCategoryBar';
import { View } from '@/components/Themed';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';

// Example mock product results per category
const categoryResults: Record<string, Array<{
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceChange: string;
  qty: number;
  img: any;
}>> = {
  pokemon: [
    {
      id: 'lucario',
      name: 'Mega Lucario ex',
      subtitle: 'Mega Evolution Special Illustration Rare • 179/132\nHolofoil',
      price: '$5,437.03',
      priceChange: '-$204.90 (-3.63%)',
      qty: 3,
      img: require('@/assets/images/mega_lucario_ex.png'),
    },
    {
      id: 'gardevoir',
      name: 'Mega Gardevoir ex',
      subtitle: 'Mega Evolution Special Illustration Rare • 178/132\nHolofoil',
      price: '$5,498.26',
      priceChange: '-$277.93 (-4.81%)',
      qty: 1,
      img: require('@/assets/images/mega_lucario_ex.png'),
    },
    {
      id: 'booster',
      name: 'Mega Evolution Enhanced Booster Box',
      subtitle: 'Mega Evolution\nSealed',
      price: '$4,868.26',
      priceChange: '-$788.60 (-13.94%)',
      qty: 1,
      img: require('@/assets/images/mega_lucario_ex.png'),
    },
    {
      id: 'moltres',
      name: 'Team Rocket’s Moltres ex Ultra-Premium Collection',
      subtitle: 'Miscellaneous Cards & Products\nSealed',
      price: '$4,023.97',
      priceChange: '$0.00 (0.00%)',
      qty: 0,
      img: require('@/assets/images/mega_lucario_ex.png'),
    },
  ],
  yugioh: [],
  magic: [],
  lorcana: [],
  onepiece: [],
};


export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('pokemon');
  const [location, setLocation] = useState<string>('83224');


  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Home',
      header: () => (<SearchCategoryBar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        location={location}
        setLocation={setLocation}
      />),
      // You can add other header options here
    });
  }, [navigation, selectedCategory, location]);

  const products = categoryResults[selectedCategory] || [];

  return (
    <View style={styles.resultsWrapper}>
      <ScrollView contentContainerStyle={styles.grid}>
          {products.length === 0 ? (
            <Text style={styles.noResultsText}>No products found for {selectedCategory} category.</Text>
          ) : (
            products.map((product) => (
              <View key={product.id} style={styles.card}>
                <Image
                  source={product.img}
                  style={styles.productImage}
                  resizeMode="contain"
                />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSubtitle}>{product.subtitle}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>
            ))
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  resultsWrapper: {
    padding: 16,
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingBottom: 32,
  },
  card: {
    flexBasis: '45%',
    flexGrow: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eee',
    minWidth: 150,
    maxWidth: '100%',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f4f4f4',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  productSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  productPriceChange: {
    fontSize: 13,
    color: '#C00',
    marginBottom: 2,
  },
  productQty: {
    fontSize: 13,
    color: '#333',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    marginTop: 32,
    textAlign: 'center',
    width: '100%',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#e0e0e0',
},
locationText: {
  fontSize: 16,
  color: '#333',
  fontWeight: '600',
  letterSpacing: 0.5,
  marginLeft: 8,
},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  modalCheckboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C77DFF',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#C77DFF',
    borderColor: '#C77DFF',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalButtonPrimary: {
    backgroundColor: '#C77DFF',
  },
  modalButtonPrimaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});