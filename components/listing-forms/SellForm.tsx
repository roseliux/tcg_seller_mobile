import { Text, View } from '@/components/Themed';
import { logger } from '@/services/logger';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';

const CATEGORIES = {
  'Pokemon': 'pokemon',
  'Magic: The Gathering': 'magic',
  'Yu-Gi-Oh!': 'yugioh',
  'Lorcana': 'lorcana',
  'One Piece': 'one_piece'
} as const;

const PRODUCT_TYPES = {
  'Card': 'card',
  'Sealed Product': 'sealed',
  'Bulk': 'bulk',
  'Deck': 'deck',
  'Accessory': 'accessory',
  'Other': 'other'
} as const;

const LANGUAGES = {
  'English': 'english',
  'Spanish': 'spanish',
  'Japanese': 'japanese',
  'Other': 'other'
} as const;

// const CONDITIONS = {
//   'Any': 'any',
//   'Mint': 'mint',
//   'Near Mint': 'near_mint',
//   'Excellent': 'excellent',
//   'Good': 'good',
//   'Light Played': 'light_played',
//   'Played': 'played',
//   'Poor': 'poor'
// } as const;

export default function SellForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'any',
    purpose: 'sell',
    location_postal_code: '',
    product_type: 'card',
    category_id: 'pokemon',
    language: 'english'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back()
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const hasUnsavedChanges = () => {
    return form.title.trim() || form.description.trim() || form.price.trim();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const listingData = {
        listing: {
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          condition: form.condition,
          purpose: form.purpose,
          location_postal_code: form.location_postal_code,
          product_type: form.product_type,
          category_id: form.category_id,
        }
      };

      logger.log('Creating listing:', listingData);
      // await authAPI.createListing(listingData);

      setForm({
        title: '',
        description: '',
        price: '',
        condition: 'any',
        purpose: 'sell',
        location_postal_code: '',
        product_type: 'card',
        category_id: 'pokemon',
        language: 'english'
      });

      Alert.alert(
        'Success!',
        'Your item has been listed for sale successfully!',
        [{
          text: 'OK',
          onPress: () => router.push('/(tabs)')
        }]
      );
    } catch (error) {
      logger.error('Failed to create listing:', error);
      Alert.alert('Error', 'Failed to post listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your listing.');
      return false;
    }
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price greater than 0.');
      return false;
    }
    if (!form.location_postal_code.trim()) {
      Alert.alert('Error', 'Please enter a postal code.');
      return false;
    }

    return true;
  };

  const addPhoto = () => {
    Alert.alert(
      'Add Photo',
      'Choose photo source',
      [
        { text: 'Camera', onPress: () => logger.log('Camera selected') },
        { text: 'Photo Library', onPress: () => logger.log('Library selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

const createSelector = <T extends Record<string, string>>(
  options: T,
  title: string,
  formKey: keyof typeof form
) => {
  return () => {
    const displayLabels = Object.keys(options);

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...displayLabels, 'Cancel'],
          cancelButtonIndex: displayLabels.length,
          title,
        },
        (buttonIndex) => {
          if (buttonIndex < displayLabels.length) {
            const selectedLabel = displayLabels[buttonIndex];
            const selectedValue = options[selectedLabel];
            setForm(prev => ({ ...prev, [formKey]: selectedValue }));
          }
        }
      );
    } else {
      Alert.alert(title, 'Feature coming soon for Android');
    }
  };
};

const selectCategory = createSelector(CATEGORIES, 'Select Category', 'category_id');
const selectProductType = createSelector(PRODUCT_TYPES, 'Select Product Type', 'product_type');
const selectLanguage = createSelector(LANGUAGES, 'Select Language', 'language');
// const selectCondition = createSelector(CONDITIONS, 'Select Condition', 'condition');

const formatCategoryDisplay = (value: string) => {
  // Find the key (display label) that matches the value
  return Object.keys(CATEGORIES).find(
    key => CATEGORIES[key as keyof typeof CATEGORIES] === value
  ) || value;
};

const formatProductTypeDisplay = (value: string) => {
  return Object.keys(PRODUCT_TYPES).find(
    key => PRODUCT_TYPES[key as keyof typeof PRODUCT_TYPES] === value
  ) || value;
};

const formatLanguageDisplay = (value: string) => {
  return Object.keys(LANGUAGES).find(
    key => LANGUAGES[key as keyof typeof LANGUAGES] === value
  ) || value;
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome name="times" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sell</Text>
        <TouchableOpacity
          style={[
            styles.postButton,
            (!form.title.trim() || !form.price.trim() || !form.location_postal_code.trim()) && styles.postButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !form.title.trim() || !form.price.trim() || !form.location_postal_code.trim()}
        >
          <Text style={[
            styles.postButtonText,
            (!form.title.trim() || !form.price.trim() || !form.location_postal_code.trim()) && styles.postButtonTextDisabled
          ]}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            <TouchableOpacity style={styles.addPhotoButton} onPress={addPhoto}>
              <FontAwesome name="camera" size={24} color="#666" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listing Title *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Charizard Base Set Shadowless PSA 9"
            placeholderTextColor="#999"
            value={form.title}
            onChangeText={(text) => setForm(prev => ({ ...prev, title: text }))}
            maxLength={100}
          />
          <Text style={styles.characterCount}>{form.title.length}/100</Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectCategory}>
            <Text style={styles.selectButtonText}>{formatCategoryDisplay(form.category_id)}</Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Product Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Type *</Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectProductType}>
            <Text style={styles.selectButtonText}>{formatProductTypeDisplay(form.product_type)}</Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language *</Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectLanguage}>
            <Text style={styles.selectButtonText}>{formatLanguageDisplay(form.language)}</Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Condition */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition *</Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectCondition}>
            <Text style={styles.selectButtonText}>{formatConditionDisplay(form.condition)}</Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View> */}

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price *</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="0.00"
              placeholderTextColor="#999"
              value={form.price}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length > 2) return;
                setForm(prev => ({ ...prev, price: cleaned }));
              }}
              keyboardType="decimal-pad"
              // maxLength={10}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            placeholder="Describe the item's condition, any flaws, and why it's special..."
            placeholderTextColor="#999"
            value={form.description}
            onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{form.description.length}/500</Text>
        </View>

        {/* Location Postal Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Postal Code *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 83224"
            placeholderTextColor="#999"
            value={form.location_postal_code}
            onChangeText={(text) => setForm(prev => ({ ...prev, location_postal_code: text }))}
            maxLength={5}
            keyboardType="number-pad"
          />
          <Text style={styles.helperText}>
            Used to help buyers find items near them
          </Text>
        </View>

        {/* Tips Section */}
        <View style={[styles.section, styles.tipsSection]}>
          <Text style={styles.tipsTitle}>💡 Tips for better listings</Text>
          <Text style={styles.tipText}>• Take clear, well-lit photos from multiple angles</Text>
          <Text style={styles.tipText}>• Be honest about condition and any flaws</Text>
          <Text style={styles.tipText}>• Research similar listings for competitive pricing</Text>
          <Text style={styles.tipText}>• Include relevant keywords in your title</Text>
        </View>

        <View style={styles.bottomPadding} />
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
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  postButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#999',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  photosContainer: {
    flexDirection: 'row',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#f8f9fa',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tipsSection: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  bottomPadding: {
    height: 100,
  },
});