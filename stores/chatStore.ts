/**
 * Chat Store — Zustand
 * Manages conversations and real-time chat
 */
import { create } from 'zustand';
import type { ChatMessage, Conversation, Match } from '../types';
import { subscribeToChatMessages, sendMessage, markMessagesAsRead, getUserProfile } from '../lib/firebase/firestore';
import { uploadChatAttachment } from '../lib/firebase/storage';

interface ChatState {
  conversations: Conversation[];
  activeMessages: ChatMessage[];
  messages: ChatMessage[];
  isLoading: boolean;
  loading: boolean;

  // Actions
  buildConversations: (matches: Match[], currentUid: string) => void;
  fetchConversations: () => Promise<void>;
  subscribeToChat: (chatId: string) => () => void;
  fetchMessages: (chatId: string) => Promise<void>;
  sendTextMessage: (chatId: string, senderId: string, text: string) => Promise<void>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  sendMediaMessage: (chatId: string, senderId: string, uri: string, type: 'image' | 'video') => Promise<void>;
  markAsRead: (chatId: string, userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeMessages: [],
  messages: [],
  isLoading: false,
  loading: false,

  buildConversations: (matches, currentUid) => {
    const convos: Conversation[] = matches.map((match) => ({
      id: match.chatId,
      matchId: match.id,
      otherUser: match.otherUser!,
      lastMessage: match.lastMessage,
      lastMessageAt: match.lastMessageAt,
      unreadCount: 0, // TODO: track unread counts
    }));
    set({ conversations: convos });
  },

  fetchConversations: async () => {
    // Stub implementation - would need current user context
    set({ loading: false });
  },

  subscribeToChat: (chatId) => {
    set({ isLoading: true, loading: true });
    const unsubscribe = subscribeToChatMessages(chatId, (messages) => {
      set({ activeMessages: messages, messages, isLoading: false, loading: false });
    });
    return unsubscribe;
  },

  fetchMessages: async (chatId) => {
    // Stub implementation
    set({ loading: false });
  },

  sendTextMessage: async (chatId, senderId, text) => {
    await sendMessage(chatId, {
      senderId,
      text,
      read: false,
    });
  },

  sendMessage: async (chatId, text) => {
    // Stub implementation - would need current user context
  },

  sendMediaMessage: async (chatId, senderId, uri, type) => {
    const mediaUrl = await uploadChatAttachment(chatId, senderId, uri, type);
    await sendMessage(chatId, {
      senderId,
      mediaUrl,
      mediaType: type,
      read: false,
    });
  },

  markAsRead: async (chatId, userId) => {
    await markMessagesAsRead(chatId, userId);
  },
}));
