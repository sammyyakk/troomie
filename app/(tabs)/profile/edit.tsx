/**
 * Edit Profile Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { Colors, FontSize, Spacing } from '../../../constants/theme';
import { useAuthStore } from '../../../stores/authStore';
import { updateUserProfile } from '../../../lib/firebase/firestore';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    about: user?.about || '',
    occupation: user?.occupation || '',
    education: user?.education || '',
    city: user?.city || '',
    ageMin: user?.preferences.ageRange.min || 18,
    ageMax: user?.preferences.ageRange.max || 65,
    maxDistance: user?.preferences.maxDistance || 50,
  });

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedData = {
        about: formData.about,
        occupation: formData.occupation,
        education: formData.education,
        city: formData.city,
        preferences: {
          ...user.preferences,
          ageRange: {
            min: formData.ageMin,
            max: formData.ageMax,
          },
          maxDistance: formData.maxDistance,
        },
      };

      await updateUserProfile(user.uid, updatedData);
      setUser({ ...user, ...updatedData });

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Input
            value={formData.about}
            onChangeText={(text) => setFormData({ ...formData, about: text })}
            placeholder="Tell others about yourself..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <Input
            label="City"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="Enter your city"
          />
          <Input
            label="Occupation"
            value={formData.occupation}
            onChangeText={(text) => setFormData({ ...formData, occupation: text })}
            placeholder="Enter your occupation"
          />
          <Input
            label="Education"
            value={formData.education}
            onChangeText={(text) => setFormData({ ...formData, education: text })}
            placeholder="Enter your education"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Preferences</Text>

          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Age Range</Text>
            <View style={styles.rangeInputs}>
              <Input
                value={String(formData.ageMin)}
                onChangeText={(text) => setFormData({ ...formData, ageMin: parseInt(text) || 18 })}
                placeholder="Min"
                keyboardType="numeric"
                style={styles.rangeInput}
              />
              <Text style={styles.rangeSeparator}>-</Text>
              <Input
                value={String(formData.ageMax)}
                onChangeText={(text) => setFormData({ ...formData, ageMax: parseInt(text) || 65 })}
                placeholder="Max"
                keyboardType="numeric"
                style={styles.rangeInput}
              />
            </View>
          </View>

          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Max Distance (miles)</Text>
            <Input
              value={String(formData.maxDistance)}
              onChangeText={(text) => setFormData({ ...formData, maxDistance: parseInt(text) || 50 })}
              placeholder="50"
              keyboardType="numeric"
              style={styles.distanceInput}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={handleSave} loading={loading}>
            <View style={styles.buttonContent}>
              <Save size={20} color={Colors.textPrimary} />
              <Text style={styles.buttonText}>Save Changes</Text>
            </View>
          </Button>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  preferenceRow: {
    marginBottom: Spacing.md,
  },
  preferenceLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rangeInput: {
    flex: 1,
  },
  rangeSeparator: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  distanceInput: {
    width: 120,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
