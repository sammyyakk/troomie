/**
 * Forgot Password Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { Colors, FontSize, Spacing } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{sent ? 'Check Your Email' : 'Reset Password'}</Text>
        <Text style={styles.subtitle}>
          {sent
            ? `We've sent a password reset link to ${email}. Check your inbox and follow the instructions.`
            : 'Enter your email and we\'ll send you a link to reset your password.'}
        </Text>

        {!sent ? (
          <>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={18} color={Colors.textTertiary} />}
            />
            <Button
              title="Send Reset Link"
              onPress={handleReset}
              isLoading={isLoading}
              size="lg"
              style={styles.button}
            />
          </>
        ) : (
          <Button
            title="Back to Login"
            onPress={() => router.replace('/(auth)/login')}
            variant="outline"
            size="lg"
            style={styles.button}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing['3xl'],
  },
  backButton: {
    marginTop: Spacing['5xl'],
    padding: Spacing.sm,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -Spacing['6xl'],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing['3xl'],
  },
  button: {
    marginTop: Spacing.md,
  },
});
