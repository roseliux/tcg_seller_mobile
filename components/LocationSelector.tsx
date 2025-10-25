import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  location: string;
  onLocationChange: (value: string) => void;
  label?: string;
}

export default function LocationSelector({ location, onLocationChange, label = 'Set your location' }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempLocation, setTempLocation] = useState(location);
  const [allState, setAllState] = useState(false);
  const [allCountry, setAllCountry] = useState(false);

  const handleLocationSave = () => {
    if (allCountry) {
      onLocationChange('País');
    } else if (allState) {
      onLocationChange('Estado');
    } else {
      onLocationChange(tempLocation);
    }
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <FontAwesome name="map-marker" size={20} color="#C77DFF" style={{ marginRight: 6 }} />
        <Text style={styles.locationText}>{location}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <TextInput
              style={styles.modalInput}
              value={tempLocation}
              onChangeText={setTempLocation}
              placeholder="Enter postal code"
              autoFocus
              editable={!allState && !allCountry}
            />
            <View style={styles.modalCheckboxRow}>
              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => {
                  setAllState(!allState);
                  if (!allState) setAllCountry(false);
                }}
              >
                <View style={[styles.checkbox, allState && styles.checkboxChecked]}>
                  {allState && <FontAwesome name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.checkboxLabel}>Sonora</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkboxOption}
                onPress={() => {
                  setAllCountry(!allCountry);
                  if (!allCountry) setAllState(false);
                }}
              >
                <View style={[styles.checkbox, allCountry && styles.checkboxChecked]}>
                  {allCountry && <FontAwesome name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.checkboxLabel}>En todo el País</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleLocationSave}>
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#9500ffff',
  },
  modalButtonPrimaryText: {
    color: '#fff',
    fontWeight: '700',
  },
});