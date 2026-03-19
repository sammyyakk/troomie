/**
 * Firebase Storage Helper Functions
 */
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a file to Firebase Storage and return the download URL
 */
export const uploadImage = async (
  uri: string,
  path: string
): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);

  return getDownloadURL(storageRef);
};

/**
 * Upload avatar image
 */
export const uploadAvatar = async (uid: string, uri: string): Promise<string> => {
  return uploadImage(uri, `avatars/${uid}/avatar_${Date.now()}.jpg`);
};

/**
 * Upload property photo
 */
export const uploadPropertyPhoto = async (uid: string, uri: string): Promise<string> => {
  return uploadImage(uri, `properties/${uid}/photo_${Date.now()}.jpg`);
};

/**
 * Upload chat attachment
 */
export const uploadChatAttachment = async (
  chatId: string,
  uid: string,
  uri: string,
  type: 'image' | 'video' = 'image'
): Promise<string> => {
  const ext = type === 'video' ? 'mp4' : 'jpg';
  return uploadImage(uri, `chats/${chatId}/${uid}_${Date.now()}.${ext}`);
};
