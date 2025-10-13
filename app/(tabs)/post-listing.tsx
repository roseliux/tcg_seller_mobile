import { Text, View } from '@/components/Themed';
import { authAPI } from '@/services/api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
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

interface ListingForm {
  item_title: string;
  description: string;
  price: string;
  condition: string;
  category_id: string;
  card_set_id: string;
  // images: string[];
  listing_type: 'selling' | 'looking';
}

const CONDITIONS = ['Any', 'Mint', 'Near Mint', 'Excellent', 'Good', 'Light Played', 'Played', 'Poor'];
const CATEGORIES = ['Pokemon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Lorcana', 'One Piece'];

export default function PostListingScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  const [form, setForm] = useState<ListingForm>({
    item_title: '',
    description: '',
    price: '',
    condition: 'Any',
    category_id: 'pokemon',
    card_set_id: 'base1',
    // images: [],
    listing_type: (tab as 'selling' | 'looking') || 'selling',
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
            onPress: () => router.push(`/(tabs)/marketplace?tab=${form.listing_type}`)
          },
        ]
      );
    } else {
      router.push(`/(tabs)/marketplace?tab=${form.listing_type}`);
    }
  };

  const hasUnsavedChanges = () => {
    return form.item_title.trim() || form.description.trim() || form.price.trim();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Convert form fields to ListingRequest format
      // Map condition to allowed ListingRequest type
      const allowedConditions = [
        'any',
        'mint',
        'near_mint',
        'excellent',
        'good',
        'light_played',
        'played',
        'poor'
      ] as const;

      const normalizedCondition = form.condition.toLowerCase().replace(/\s/g, '_');
      const condition =
        allowedConditions.includes(normalizedCondition as typeof allowedConditions[number])
          ? (normalizedCondition as typeof allowedConditions[number])
          : 'near_mint';

      const listingRequest = {
        item_title: form.item_title,
        description: form.description,
        price: form.price,
        listing_type: form.listing_type,
        condition,
        category_id: form.category_id,
        card_set_id: form.card_set_id,
      };
      const submittedType = form.listing_type; // Save before resetting form
      await authAPI.createListing(listingRequest);
      console.log('Creating listing:', listingRequest);
      //  reset form
      setForm({
        item_title: '',
        description: '',
        price: '',
        condition: 'Any',
        category_id: 'pokemon',
        card_set_id: 'base1',
        listing_type: (tab as 'selling' | 'looking') || 'selling',
      });
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const successMessage = form.listing_type === 'selling'
        ? 'Your item has been listed for sale successfully!'
        : 'Your wanted item request has been posted successfully!';

      Alert.alert(
        'Success!',
        successMessage,
        [{
          text: 'OK',
          onPress: () => router.push(`/(tabs)/marketplace?tab=${submittedType}&refresh=1`)
        }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!form.item_title.trim()) {
      Alert.alert('Error', 'Please enter a item_title for your listing.');
      return false;
    }
    if (form.listing_type === 'selling') {
      if (!form.price.trim() || isNaN(Number(form.price))) {
        Alert.alert('Error', 'Please enter a valid price.');
        return false;
      }
    }
    // if (!form.description.trim()) {
    //   Alert.alert('Error', 'Please enter a description.');
    //   return false;
    // }
    return true;
  };

  const selectCondition = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...CONDITIONS, 'Cancel'],
          cancelButtonIndex: CONDITIONS.length,
          title: 'Select Card Condition',
        },
        (buttonIndex) => {
          if (buttonIndex < CONDITIONS.length) {
            setForm(prev => ({ ...prev, condition: CONDITIONS[buttonIndex] }));
          }
        }
      );
    } else {
      // For Android, you could use a modal or picker
      Alert.alert('Select Condition', 'Feature coming soon for Android');
    }
  };

  const selectCategory = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...CATEGORIES, 'Cancel'],
          cancelButtonIndex: CATEGORIES.length,
          title: 'Select Category',
        },
        (buttonIndex) => {
          if (buttonIndex < CATEGORIES.length) {
            setForm(prev => ({ ...prev, category: CATEGORIES[buttonIndex] }));
          }
        }
      );
    } else {
      Alert.alert('Select Category', 'Feature coming soon for Android');
    }
  };

  const addPhoto = () => {
    Alert.alert(
      'Add Photo',
      'Choose photo source',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Photo Library', onPress: () => console.log('Library selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const toggleListingType = (type: 'selling' | 'looking') => {
    setForm(prev => ({ ...prev, listing_type: type }));
  };

  const getPlaceholderText = () => {
    if (form.listing_type === 'selling') {
      return 'e.g., Charizard Base Set Shadowless PSA 9';
    } else {
      return 'e.g., Looking for Charizard Base Set Shadowless';
    }
  };

  const getDescriptionPlaceholder = () => {
    if (form.listing_type === 'selling') {
      return "Describe the card's condition, any flaws, and why it's special...";
    } else {
      return "Describe what you're looking for, preferred condition, and any specific details...";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome name="times" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {form.listing_type === 'selling' ? 'Post for Sale' : 'Post Looking For'}
        </Text>
        <TouchableOpacity
          style={[
            styles.postButton,
            (!form.item_title.trim() || (form.listing_type === 'selling' && !form.price.trim())) && styles.postButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !form.item_title.trim() || (form.listing_type === 'selling' && !form.price.trim())}
        >
          <Text style={[
            styles.postButtonText,
            (!form.item_title.trim() || (form.listing_type === 'selling' && !form.price.trim())) && styles.postButtonTextDisabled
          ]}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Listing Type Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listing Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                styles.toggleButtonLeft,
                form.listing_type === 'selling' && styles.toggleButtonActive
              ]}
              onPress={() => toggleListingType('selling')}
            >
              <FontAwesome
                name="tag"
                size={16}
                color={form.listing_type === 'selling' ? '#fff' : '#666'}
                style={styles.toggleIcon}
              />
              <Text style={[
                styles.toggleButtonText,
                form.listing_type === 'selling' && styles.toggleButtonTextActive
              ]}>
                Selling
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                styles.toggleButtonRight,
                form.listing_type === 'looking' && styles.toggleButtonActive
              ]}
              onPress={() => toggleListingType('looking')}
            >
              <FontAwesome
                name="search"
                size={16}
                color={form.listing_type === 'looking' ? '#fff' : '#666'}
                style={styles.toggleIcon}
              />
              <Text style={[
                styles.toggleButtonText,
                form.listing_type === 'looking' && styles.toggleButtonTextActive
              ]}>
                Looking For
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Photos Section - Only for selling */}
        {form.listing_type === 'selling' && (
          <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            <TouchableOpacity style={styles.addPhotoButton} onPress={addPhoto}>
              <FontAwesome name="camera" size={24} color="#666" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
            {/* {form.images.map((image, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: image }} style={styles.photoImage} />
                <TouchableOpacity style={styles.removePhotoButton}>
                  <FontAwesome name="times" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))} */}
          </ScrollView>
        </View>
        )}

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {form.listing_type === 'selling' ? 'Item Title *' : 'What are you looking for? *'}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={getPlaceholderText()}
            placeholderTextColor="#999"
            value={form.item_title}
            onChangeText={(text) => setForm(prev => ({ ...prev, item_title: text }))}
            maxLength={100}
          />
          <Text style={styles.characterCount}>{form.item_title.length}/100</Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectCategory}>
            <Text style={styles.selectButtonText}>{form.category_id}</Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Condition - Only for selling or when specific condition is wanted */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {form.listing_type === 'selling' ? 'Condition' : 'Preferred Condition'}
          </Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectCondition}>
            <Text style={styles.selectButtonText}>{form.condition}</Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Price - Only for selling */}
        {form.listing_type === 'selling' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price *</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0.00"
                placeholderTextColor="#999"
                value={form.price}
                onChangeText={(text) => setForm(prev => ({ ...prev, price: text }))}
                keyboardType="decimal-pad"
                maxLength={10}
              />
            </View>
          </View>
        )}

        {/* Budget Range - Only for looking */}
        {form.listing_type === 'looking' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget Range (Optional)</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="e.g., 50-100 or max 200"
                placeholderTextColor="#999"
                value={form.price}
                onChangeText={(text) => setForm(prev => ({ ...prev, price: text }))}
                maxLength={20}
              />
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            placeholder={getDescriptionPlaceholder()}
            placeholderTextColor="#999"
            value={form.description}
            onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{form.description.length}/500</Text>
        </View>

        {/* Tips Section */}
        <View style={[styles.section, styles.tipsSection]}>
          <Text style={styles.tipsTitle}>
            💡 Tips for better {form.listing_type === 'selling' ? 'listings' : 'requests'}
          </Text>
          {form.listing_type === 'selling' ? (
            <>
              <Text style={styles.tipText}>• Take clear, well-lit photos from multiple angles</Text>
              <Text style={styles.tipText}>• Be honest about condition and any flaws</Text>
              <Text style={styles.tipText}>• Research similar listings for competitive pricing</Text>
              <Text style={styles.tipText}>• Include relevant keywords in your title</Text>
            </>
          ) : (
            <>
              <Text style={styles.tipText}>• Be specific about what you're looking for</Text>
              <Text style={styles.tipText}>• Include your budget range to get relevant offers</Text>
              <Text style={styles.tipText}>• Mention if you're flexible on condition or price</Text>
              <Text style={styles.tipText}>• Use keywords that sellers would include</Text>
            </>
          )}
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
  photoItem: {
    position: 'relative',
    marginRight: 12,
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  toggleButtonLeft: {
    borderRightWidth: 0.5,
    borderRightColor: '#e0e0e0',
  },
  toggleButtonRight: {
    borderLeftWidth: 0.5,
    borderLeftColor: '#e0e0e0',
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleIcon: {
    marginRight: 8,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#fff',
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
    height: 32,
  },
});