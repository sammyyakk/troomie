/**
 * Profile Screen - View user profile
 */
import React from 'react';
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
import { Edit, LogOut, Settings } from 'lucide-react-native';
import { Colors, FontSize, Spacing } from '../../../constants/theme';
import { useAuthStore } from '../../../stores/authStore';
import { firebaseSignOut } from '../../../lib/firebase/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await firebaseSignOut();
              clearUser();
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No user data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/profile/edit')}>
          <Edit size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.name}>
            {user.name}, {user.age}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>{user.about || 'No bio yet'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{user.city}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Occupation</Text>
              <Text style={styles.infoValue}>{user.occupation || 'Not specified'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Education</Text>
              <Text style={styles.infoValue}>{user.education || 'Not specified'}</Text>
            </View>
          </View>
        </View>

        {user.housing.hasProperty && user.housing.propertyDetails && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Property</Text>
            <View style={styles.card}>
              <Text style={styles.propertyAddress}>
                {user.housing.propertyDetails.address}
              </Text>
              <View style={styles.propertyStats}>
                <Text style={styles.propertyStat}>
                  🛏️ {user.housing.propertyDetails.bedrooms} bed
                </Text>
                <Text style={styles.propertyStat}>
                  🚿 {user.housing.propertyDetails.bathrooms} bath
                </Text>
                <Text style={styles.propertyStat}>
                  📐 {user.housing.propertyDetails.sqft} sqft
                </Text>
              </View>
              <Text style={styles.propertyRent}>
                ${user.housing.propertyDetails.rent}/month
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle</Text>
          <View style={styles.card}>
            <View style={styles.lifestyleGrid}>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  🧹 Cleanliness {user.lifestyle.cleanliness}/5
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  😴 {user.lifestyle.sleepSchedule}
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  🚬 {user.lifestyle.smoking ? 'Smoker' : 'Non-smoker'}
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  🐾 {user.lifestyle.pets ? 'Has pets' : 'No pets'}
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  👥 Guests: {user.lifestyle.guests}
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  🔊 {user.lifestyle.noise}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age Range</Text>
              <Text style={styles.infoValue}>
                {user.preferences.ageRange.min} - {user.preferences.ageRange.max}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Max Distance</Text>
              <Text style={styles.infoValue}>{user.preferences.maxDistance} miles</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
  },
  aboutText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  propertyAddress: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  propertyStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  propertyStat: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  propertyRent: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  lifestyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  lifestyleBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  lifestyleText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.error,
  },
});
