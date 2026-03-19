/**
 * Messages List Screen - Shows new matches and active conversations
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '../../../constants/theme';
import { useChatStore } from '../../../stores/chatStore';
import { useMatchStore } from '../../../stores/matchStore';
import { useAuthStore } from '../../../stores/authStore';

export default function MessagesListScreen() {
  const router = useRouter();
  const { conversations, loading, fetchConversations } = useChatStore();
  const { confirmedMatches, fetchConfirmedMatches } = useMatchStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchConfirmedMatches();
    }
  }, [user]);

  // Get new matches (matches without conversations)
  const newMatches = confirmedMatches.filter(
    (match) => !conversations.some((conv) => conv.matchId === match.id)
  );

  const renderNewMatch = (match: any) => {
    const otherUser = match.otherUser;
    if (!otherUser) return null;

    return (
      <TouchableOpacity
        key={match.id}
        style={styles.newMatchItem}
        onPress={() => router.push(`/messages/${match.chatId}`)}
      >
        <View style={styles.newMatchAvatar}>
          <Text style={styles.newMatchAvatarText}>
            {otherUser.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.newMatchName} numberOfLines={1}>
          {otherUser.name.split(' ')[0]}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderConversation = ({ item }: any) => {
    const otherUser = item.otherUser;
    if (!otherUser) return null;

    const formattedTime = item.lastMessageAt
      ? new Date(item.lastMessageAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : '';

    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => router.push(`/messages/${item.id}`)}
      >
        <View style={styles.conversationAvatar}>
          <Text style={styles.conversationAvatarText}>
            {otherUser.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName}>{otherUser.name}</Text>
            <Text style={styles.conversationTime}>{formattedTime}</Text>
          </View>
          <Text style={styles.conversationMessage} numberOfLines={1}>
            {item.lastMessage || 'Say hi! 👋'}
          </Text>
        </View>

        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {newMatches.length > 0 && (
        <View style={styles.newMatchesSection}>
          <Text style={styles.sectionTitle}>New Matches</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newMatchesContainer}
          >
            {newMatches.map(renderNewMatch)}
          </ScrollView>
        </View>
      )}

      {conversations.length === 0 && newMatches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start matching to begin conversations!
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conversationsList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  },
  newMatchesSection: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  newMatchesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingRight: Spacing.xl,
  },
  newMatchItem: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 70,
  },
  newMatchAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  newMatchAvatarText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  newMatchName: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  conversationsList: {
    padding: Spacing.lg,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  conversationAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  conversationAvatarText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  conversationName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  conversationTime: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  conversationMessage: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  unreadBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
