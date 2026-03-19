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
  isLoading: boolean;

  // Actions
  buildConversations: (matches: Match[], currentUid: string) => void;
  subscribeToChat: (chatId: string) => () => void;
  sendTextMessage: (chatId: string, senderId: string, text: string) => Promise<void>;
  sendMediaMessage: (chatId: string, senderId: string, uri: string, type: 'image' | 'video') => Promise<void>;
  markAsRead: (chatId: string, userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeMessages: [],
  isLoading: false,

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

  subscribeToChat: (chatId) => {
    set({ isLoading: true });
    const unsubscribe = subscribeToChatMessages(chatId, (messages) => {
      set({ activeMessages: messages, isLoading: false });
    });
    return unsubscribe;
  },

  sendTextMessage: async (chatId, senderId, text) => {
    await sendMessage(chatId, {
      senderId,
      text,
      read: false,
    });
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
