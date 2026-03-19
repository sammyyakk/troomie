/**
 * Property Detail Screen - Expanded view of a user's profile and property
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, X } from 'lucide-react-native';
import { Colors, FontSize, Spacing } from '../../../constants/theme';
import { getUserProfile } from '../../../lib/firebase/firestore';
import { useMatchStore } from '../../../stores/matchStore';
import type { UserProfile } from '../../../types';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { recordSwipe } = useMatchStore();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, [id]);

  const loadUserProfile = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const profile = await getUserProfile(id);
      setUser(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!user) return;
    await recordSwipe(user.uid, direction);
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.heroSection}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>
            {user.name}, {user.age}
          </Text>
          <Text style={styles.location}>{user.city}</Text>

          {user.housing.hasProperty && user.housing.propertyDetails && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Property Details</Text>
              <View style={styles.propertyCard}>
                <Text style={styles.propertyAddress}>
                  {user.housing.propertyDetails.address}
                </Text>
                <View style={styles.propertyStats}>
                  <Text style={styles.propertyStat}>
                    🛏️ {user.housing.propertyDetails.bedrooms} Bedrooms
                  </Text>
                  <Text style={styles.propertyStat}>
                    🚿 {user.housing.propertyDetails.bathrooms} Bathrooms
                  </Text>
                  <Text style={styles.propertyStat}>
                    📐 {user.housing.propertyDetails.sqft} sqft
                  </Text>
                </View>
                <Text style={styles.rent}>
                  ${user.housing.propertyDetails.rent}/month
                </Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{user.about}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Occupation:</Text>
              <Text style={styles.detailValue}>{user.occupation}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Education:</Text>
              <Text style={styles.detailValue}>{user.education}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>
            <View style={styles.lifestyleGrid}>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  🧹 Cleanliness: {user.lifestyle.cleanliness}/5
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  😴 Sleep: {user.lifestyle.sleepSchedule}
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  🚬 Smoking: {user.lifestyle.smoking ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  🐾 Pets: {user.lifestyle.pets ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  👥 Guests: {user.lifestyle.guests}
                </Text>
              </View>
              <View style={styles.lifestyleBadge}>
                <Text style={styles.lifestyleText}>
                  🔊 Noise: {user.lifestyle.noise}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleSwipe('left')}
        >
          <X size={32} color={Colors.error} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleSwipe('right')}
        >
          <Heart size={32} color={Colors.primary} />
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  backText: {
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    width: '100%',
    height: 400,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 100,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    padding: Spacing.lg,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  propertyCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
  },
  propertyAddress: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  propertyStats: {
    marginBottom: Spacing.md,
  },
  propertyStat: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  rent: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.primary,
  },
  aboutText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  lifestyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  lifestyleBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  lifestyleText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  passButton: {
    backgroundColor: Colors.surface,
  },
  likeButton: {
    backgroundColor: Colors.surface,
  },
});
