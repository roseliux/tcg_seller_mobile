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

export default function ShareHitForm() {
  const [form, setForm] = useState({
    item_title: '',
    description: '',
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
    return form.item_title.trim() || form.description.trim();
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
        price: '0', // Share hits don't have a price
        listing_type: 'selling' as const, // Technically shares are treated as selling type
        condition,
        category_id: form.category_id,
        card_set_id: form.card_set_id,
      };

      await authAPI.createListing(listingRequest);
      console.log('Creating share hit:', listingRequest);

      setForm({
        item_title: '',
        description: '',
        condition: 'Any',
        category_id: 'pokemon',
        card_set_id: 'base1',
        card_location: '',
      });

      Alert.alert(
        'Success!',
        'Your hit has been shared successfully!',
        [{
          text: 'OK',
          onPress: () => router.push('/(tabs)/marketplace?tab=share&refresh=1')
        }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to share hit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!form.item_title.trim()) {
      Alert.alert('Error', 'Please enter a title for your post.');
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome name="times" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Hit</Text>
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
        <Text style={styles.sectionTitle}>Title *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Pulled a Charizard GX from Burning Shadows!"
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
        <Text style={styles.sectionTitle}>Condition (Optional)</Text>
        <TouchableOpacity style={styles.selectButton} onPress={selectCondition}>
          <Text style={styles.selectButtonText}>{form.condition}</Text>
          <FontAwesome name="chevron-down" size={14} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Story</Text>
        <TextInput
          style={[styles.textInput, styles.descriptionInput]}
          placeholder="Share your story! What pack was it from? How excited were you? Tell us about this amazing pull..."
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
        <Text style={styles.sectionTitle}>Location (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Where did you pull this? (e.g. Hermosillo, Sonora)"
          placeholderTextColor="#999"
          value={form.card_location || ''}
          onChangeText={(text) => setForm(prev => ({ ...prev, card_location: text }))}
          maxLength={100}
        />
      </View>

      {/* Tips Section */}
      <View style={[styles.section, styles.tipsSection]}>
        <Text style={styles.tipsTitle}>💡 Tips for sharing hits</Text>
        <Text style={styles.tipText}>• Share your best pulls and rare finds</Text>
        <Text style={styles.tipText}>• Tell the story behind your hit</Text>
        <Text style={styles.tipText}>• Include pack opening details if relevant</Text>
        <Text style={styles.tipText}>• Celebrate your collection!</Text>
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
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
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
