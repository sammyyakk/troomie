/**
 * Login Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Flame } from 'lucide-react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Brand */}
        <View style={styles.brandContainer}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
            style={styles.logoCircle}
          >
            <Flame size={40} color="#FFF" strokeWidth={2.5} />
          </LinearGradient>
          <Text style={styles.brandName}>Troomie</Text>
          <Text style={styles.tagline}>Find your perfect roommate</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color={Colors.textTertiary} />}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              clearError();
            }}
            secureTextEntry
            icon={<Lock size={18} color={Colors.textTertiary} />}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Log In"
            onPress={handleLogin}
            isLoading={isLoading}
            size="lg"
            style={styles.loginButton}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpPrompt}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
    paddingVertical: Spacing['5xl'],
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing['5xl'],
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  brandName: {
    fontSize: FontSize['3xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  formContainer: {
    marginBottom: Spacing['3xl'],
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.sm,
    marginBottom: Spacing.lg,
  },
  forgotText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpPrompt: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
  },
  signUpLink: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontWeight: '600',
  },
});
