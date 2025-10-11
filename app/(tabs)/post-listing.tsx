import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface ListingForm {
  title: string;
  description: string;
  price: string;
  condition: string;
  category: string;
  images: string[];
  listingType: 'selling' | 'looking';
}

const CONDITIONS = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Light Played', 'Played', 'Poor'];
const CATEGORIES = ['Pokemon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Lorcana', 'One Piece'];

export default function PostListingScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();

  const [form, setForm] = useState<ListingForm>({
    title: '',
    description: '',
    price: '',
    condition: 'Near Mint',
    category: 'Pokemon',
    images: [],
    listingType: (tab as 'selling' | 'looking') || 'selling',
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
            onPress: () => router.push(`/(tabs)/marketplace?tab=${form.listingType}`)
          },
        ]
      );
    } else {
      router.push(`/(tabs)/marketplace?tab=${form.listingType}`);
    }
  };

  const hasUnsavedChanges = () => {
    return form.title.trim() || form.description.trim() || form.price.trim();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create listing
      console.log('Creating listing:', form);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const successMessage = form.listingType === 'selling'
        ? 'Your item has been listed for sale successfully!'
        : 'Your wanted item request has been posted successfully!';

      Alert.alert(
        'Success!',
        successMessage,
        [{
          text: 'OK',
          onPress: () => router.push(`/(tabs)/marketplace?tab=${form.listingType}`)
        }]
      );
    } catch (error) {
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
    if (form.listingType === 'selling') {
      if (!form.price.trim() || isNaN(Number(form.price))) {
        Alert.alert('Error', 'Please enter a valid price.');
        return false;
      }
    }
    if (!form.description.trim()) {
      Alert.alert('Error', 'Please enter a description.');
      return false;
    }
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
    setForm(prev => ({ ...prev, listingType: type }));
  };

  const getPlaceholderText = () => {
    if (form.listingType === 'selling') {
      return 'e.g., Charizard Base Set Shadowless PSA 9';
    } else {
      return 'e.g., Looking for Charizard Base Set Shadowless';
    }
  };

  const getDescriptionPlaceholder = () => {
    if (form.listingType === 'selling') {
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
          {form.listingType === 'selling' ? 'Post for Sale' : 'Post Looking For'}
        </Text>
        <TouchableOpacity
          style={[
            styles.postButton,
            (!form.title.trim() || (form.listingType === 'selling' && !form.price.trim())) && styles.postButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !form.title.trim() || (form.listingType === 'selling' && !form.price.trim())}
        >
          <Text style={[
            styles.postButtonText,
            (!form.title.trim() || (form.listingType === 'selling' && !form.price.trim())) && styles.postButtonTextDisabled
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
                form.listingType === 'selling' && styles.toggleButtonActive
              ]}
              onPress={() => toggleListingType('selling')}
            >
              <FontAwesome
                name="tag"
                size={16}
                color={form.listingType === 'selling' ? '#fff' : '#666'}
                style={styles.toggleIcon}
              />
              <Text style={[
                styles.toggleButtonText,
                form.listingType === 'selling' && styles.toggleButtonTextActive
              ]}>
                Selling
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                styles.toggleButtonRight,
                form.listingType === 'looking' && styles.toggleButtonActive
              ]}
              onPress={() => toggleListingType('looking')}
            >
              <FontAwesome
                name="search"
                size={16}
                color={form.listingType === 'looking' ? '#fff' : '#666'}
                style={styles.toggleIcon}
              />
              <Text style={[
                styles.toggleButtonText,
                form.listingType === 'looking' && styles.toggleButtonTextActive
              ]}>
                Looking For
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Photos Section - Only for selling */}
        {form.listingType === 'selling' && (
          <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
            <TouchableOpacity style={styles.addPhotoButton} onPress={addPhoto}>
              <FontAwesome name="camera" size={24} color="#666" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
            {form.images.map((image, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: image }} style={styles.photoImage} />
                <TouchableOpacity style={styles.removePhotoButton}>
                  <FontAwesome name="times" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        )}

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {form.listingType === 'selling' ? 'Item Title *' : 'What are you looking for? *'}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={getPlaceholderText()}
            placeholderTextColor="#999"
            value={form.title}
            onChangeText={(text) => setForm(prev => ({ ...prev, title: text }))}
            maxLength={100}
          />
          <Text style={styles.characterCount}>{form.title.length}/100</Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectCategory}>
            <Text style={styles.selectButtonText}>{form.category}</Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Condition - Only for selling or when specific condition is wanted */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {form.listingType === 'selling' ? 'Condition' : 'Preferred Condition'}
          </Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectCondition}>
            <Text style={styles.selectButtonText}>{form.condition}</Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Price - Only for selling */}
        {form.listingType === 'selling' && (
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
        {form.listingType === 'looking' && (
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
          <Text style={styles.sectionTitle}>Description *</Text>
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
            💡 Tips for better {form.listingType === 'selling' ? 'listings' : 'requests'}
          </Text>
          {form.listingType === 'selling' ? (
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