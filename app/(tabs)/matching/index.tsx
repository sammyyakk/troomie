/**
 * Matching Screen - Swipeable card stack for discovering roommates
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Heart } from 'lucide-react-native';
import { Colors, FontSize, Spacing } from '../../../constants/theme';
import { useMatchStore } from '../../../stores/matchStore';
import { useAuthStore } from '../../../stores/authStore';

const { width, height } = Dimensions.get('window');

export default function MatchingScreen() {
  const { potentialMatches, loading, fetchPotentialMatches, recordSwipe } = useMatchStore();
  const { user } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (user) {
      fetchPotentialMatches();
    }
  }, [user]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= potentialMatches.length) return;

    const swipedUser = potentialMatches[currentIndex];
    await recordSwipe(swipedUser.uid, direction);
    setCurrentIndex(currentIndex + 1);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding matches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentIndex >= potentialMatches.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No More Profiles</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for more potential matches in your area
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              setCurrentIndex(0);
              fetchPotentialMatches();
            }}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentUser = potentialMatches[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardImagePlaceholder}>
            <Text style={styles.cardImageText}>
              {currentUser.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>
              {currentUser.name}, {currentUser.age}
            </Text>
            <Text style={styles.cardLocation}>{currentUser.city}</Text>

            {currentUser.housing.hasProperty && currentUser.housing.propertyDetails && (
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyText}>
                  🏠 {currentUser.housing.propertyDetails.bedrooms} bed, {currentUser.housing.propertyDetails.bathrooms} bath
                </Text>
                <Text style={styles.propertyRent}>
                  ${currentUser.housing.propertyDetails.rent}/mo
                </Text>
              </View>
            )}

            <Text style={styles.cardAbout} numberOfLines={3}>
              {currentUser.about}
            </Text>
          </View>
        </View>
      </View>

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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width - 40,
    height: height * 0.65,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '60%',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageText: {
    fontSize: 80,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardInfo: {
    padding: Spacing.lg,
  },
  cardName: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardLocation: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  propertyInfo: {
    marginBottom: Spacing.md,
  },
  propertyText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  propertyRent: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  cardAbout: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
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
