import { Text, View } from '@/components/Themed';
import { authAPI } from '@/services/api';
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

const CONDITIONS = ['Any', 'Mint', 'Near Mint', 'Excellent', 'Good', 'Light Played', 'Played', 'Poor'];
const CATEGORIES = ['Pokemon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Lorcana', 'One Piece'];

export default function LookingForm() {
  const [form, setForm] = useState({
    item_title: '',
    description: '',
    price: '',
    condition: 'Any',
    category_id: 'pokemon',
    card_set_id: 'base1',
    card_location: '',
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
    return form.item_title.trim() || form.description.trim() || form.price.trim();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
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
        listing_type: 'looking' as const,
        condition,
        category_id: form.category_id,
        card_set_id: form.card_set_id,
      };

      await authAPI.createListing(listingRequest);
      console.log('Creating listing:', listingRequest);

      setForm({
        item_title: '',
        description: '',
        price: '',
        condition: 'Any',
        category_id: 'pokemon',
        card_set_id: 'base1',
        card_location: '',
      });

      Alert.alert(
        'Success!',
        'Your wanted item request has been posted successfully!',
        [{
          text: 'OK',
          onPress: () => router.push('/(tabs)/marketplace?tab=looking&refresh=1')
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
      Alert.alert('Error', 'Please enter what you are looking for.');
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
          title: 'Select Preferred Condition',
        },
        (buttonIndex) => {
          if (buttonIndex < CONDITIONS.length) {
            setForm(prev => ({ ...prev, condition: CONDITIONS[buttonIndex] }));
          }
        }
      );
    } else {
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
            setForm(prev => ({ ...prev, category_id: CATEGORIES[buttonIndex] }));
          }
        }
      );
    } else {
      Alert.alert('Select Category', 'Feature coming soon for Android');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome name="times" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Looking</Text>
        <TouchableOpacity
          style={[
            styles.postButton,
            !form.item_title.trim() && styles.postButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !form.item_title.trim()}
        >
          <Text style={[
            styles.postButtonText,
            !form.item_title.trim() && styles.postButtonTextDisabled
          ]}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What are you looking for? *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Looking for Charizard Base Set Shadowless"
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

      {/* Condition */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferred Condition</Text>
        <TouchableOpacity style={styles.selectButton} onPress={selectCondition}>
          <Text style={styles.selectButtonText}>{form.condition}</Text>
          <FontAwesome name="chevron-down" size={14} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Budget Range */}
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

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={[styles.textInput, styles.descriptionInput]}
          placeholder="Describe what you're looking for, preferred condition, and any specific details..."
          placeholderTextColor="#999"
          value={form.description}
          onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        <Text style={styles.characterCount}>{form.description.length}/500</Text>
      </View>

      {/* Card Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Location *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter card location (e.g. Hermosillo, Sonora)"
          placeholderTextColor="#999"
          value={form.card_location || ''}
          onChangeText={(text) => setForm(prev => ({ ...prev, card_location: text }))}
          maxLength={100}
        />
      </View>

      {/* Tips Section */}
      <View style={[styles.section, styles.tipsSection]}>
        <Text style={styles.tipsTitle}>💡 Tips for better requests</Text>
        <Text style={styles.tipText}>• Be specific about what you're looking for</Text>
        <Text style={styles.tipText}>• Include your budget range to get relevant offers</Text>
        <Text style={styles.tipText}>• Mention if you're flexible on condition or price</Text>
        <Text style={styles.tipText}>• Use keywords that sellers would include</Text>
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
