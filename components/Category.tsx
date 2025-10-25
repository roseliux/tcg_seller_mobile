import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface Category {
  id: string;
  name: string;
}

const STATIC_CATEGORIES: Category[] = [
  { id: 'pokemon', name: 'Pokemon' },
  { id: 'onepiece', name: 'One Piece' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!' },
  { id: 'magic', name: 'Magic: The Gathering' },
  { id: 'lorcana', name: 'Lorcana' },
];

interface CategoryProps {
  categories?: Category[];
  onPress: (category: Category) => void;
  style?: ViewStyle;
  selectedCategory?: string;
}

export default function Category({ categories = STATIC_CATEGORIES, onPress, style, selectedCategory }: CategoryProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.categoriesScroll, style]} >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipSelected,
            ]}
          onPress={() => onPress(category)}>
          <Text style={[styles.categoryText,  selectedCategory === category.id && styles.categoryTextSelected]}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  categoriesScroll: {
    // paddingTop: 10,
    flexGrow: 0,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    // marginRight: 10,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryChipSelected: {
    backgroundColor: '#9500ffff',
    borderColor: '#9500ffff',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
});
