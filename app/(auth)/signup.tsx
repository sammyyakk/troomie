/**
 * Multi-Step Sign Up Screen
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
  Image,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  User,
  Mail,
  Lock,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Home,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import { useAuthStore } from '../../stores/authStore';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import type { SignUpFormData } from '../../types';

const TOTAL_STEPS = 6;

type GenderType = 'male' | 'female' | 'non-binary' | 'other';
type SleepType = 'early' | 'normal' | 'late';
type GuestsType = 'rarely' | 'sometimes' | 'often';
type NoiseType = 'quiet' | 'moderate' | 'loud';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<GenderType>('male');

  // Step 3
  const [city, setCity] = useState('');
  const [avatarUri, setAvatarUri] = useState('');

  // Step 4
  const [about, setAbout] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');

  // Step 5
  const [hasProperty, setHasProperty] = useState(false);
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sqft, setSqft] = useState('');
  const [rent, setRent] = useState('');

  // Step 6
  const [cleanliness, setCleanliness] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [sleepSchedule, setSleepSchedule] = useState<SleepType>('normal');
  const [smoking, setSmoking] = useState(false);
  const [pets, setPets] = useState(false);
  const [guests, setGuests] = useState<GuestsType>('sometimes');
  const [noise, setNoise] = useState<NoiseType>('moderate');

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!name || !email || !password || !confirmPassword) {
          Alert.alert('Missing Fields', 'Please fill in all fields.');
          return false;
        }
        if (password !== confirmPassword) {
          Alert.alert('Password Mismatch', 'Passwords do not match.');
          return false;
        }
        if (password.length < 6) {
          Alert.alert('Weak Password', 'Password must be at least 6 characters.');
          return false;
        }
        return true;
      case 2:
        if (!dateOfBirth) {
          Alert.alert('Missing Field', 'Please enter your date of birth.');
          return false;
        }
        return true;
      case 3:
        if (!city) {
          Alert.alert('Missing Field', 'Please enter your city.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(Math.min(step + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        Alert.alert('Invalid Date', 'Please enter a valid date (YYYY-MM-DD).');
        return;
      }

      const formData: SignUpFormData = {
        name,
        email,
        password,
        confirmPassword,
        dateOfBirth: dob,
        gender,
        city,
        avatarUri: avatarUri || undefined,
        about,
        occupation,
        education,
        hasProperty,
        propertyDetails: hasProperty
          ? {
              address,
              bedrooms: parseInt(bedrooms) || 0,
              bathrooms: parseInt(bathrooms) || 0,
              sqft: parseInt(sqft) || 0,
              rent: parseInt(rent) || 0,
            }
          : undefined,
        cleanliness,
        sleepSchedule,
        smoking,
        pets,
        guests,
        noise,
      };

      await signUp(formData);
      router.replace('/(auth)/verify-email');
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message);
    }
  };

  const genderOptions: GenderType[] = ['male', 'female', 'non-binary', 'other'];
  const sleepOptions: SleepType[] = ['early', 'normal', 'late'];
  const guestOptions: GuestsType[] = ['rarely', 'sometimes', 'often'];
  const noiseOptions: NoiseType[] = ['quiet', 'moderate', 'loud'];

  const renderOptionButtons = <T extends string>(
    options: T[],
    selected: T,
    onSelect: (val: T) => void
  ) => (
    <View style={styles.optionRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => onSelect(opt)}
          style={[
            styles.optionButton,
            selected === opt && styles.optionButtonActive,
          ]}
        >
          <Text
            style={[
              styles.optionText,
              selected === opt && styles.optionTextActive,
            ]}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1).replace('-', ' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Create Account</Text>
            <Text style={styles.stepSubtitle}>Let&apos;s start with the basics</Text>
            <Input label="Full Name" placeholder="John Doe" value={name} onChangeText={setName} icon={<User size={18} color={Colors.textTertiary} />} />
            <Input label="Email" placeholder="john@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" icon={<Mail size={18} color={Colors.textTertiary} />} />
            <Input label="Password" placeholder="Min 6 characters" value={password} onChangeText={setPassword} secureTextEntry icon={<Lock size={18} color={Colors.textTertiary} />} />
            <Input label="Confirm Password" placeholder="Re-enter password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry icon={<Lock size={18} color={Colors.textTertiary} />} />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>About You</Text>
            <Text style={styles.stepSubtitle}>Tell us a bit more</Text>
            <Input label="Date of Birth" placeholder="YYYY-MM-DD" value={dateOfBirth} onChangeText={setDateOfBirth} icon={<Calendar size={18} color={Colors.textTertiary} />} />
            <Text style={styles.fieldLabel}>Gender</Text>
            {renderOptionButtons(genderOptions, gender, setGender)}
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Location & Photo</Text>
            <Text style={styles.stepSubtitle}>Where are you located?</Text>
            <Input label="City" placeholder="San Francisco" value={city} onChangeText={setCity} icon={<MapPin size={18} color={Colors.textTertiary} />} />
            <Text style={styles.fieldLabel}>Profile Photo</Text>
            <TouchableOpacity onPress={pickAvatar} style={styles.avatarPicker}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={32} color={Colors.textTertiary} />
                  <Text style={styles.avatarPlaceholderText}>Tap to add photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Your Bio</Text>
            <Text style={styles.stepSubtitle}>Help others get to know you</Text>
            <Input label="About Me" placeholder="Tell potential roommates about yourself..." value={about} onChangeText={setAbout} multiline numberOfLines={4} />
            <Input label="Occupation" placeholder="Software Engineer" value={occupation} onChangeText={setOccupation} icon={<Briefcase size={18} color={Colors.textTertiary} />} />
            <Input label="Education" placeholder="UCLA" value={education} onChangeText={setEducation} icon={<GraduationCap size={18} color={Colors.textTertiary} />} />
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.stepTitle}>Housing</Text>
            <Text style={styles.stepSubtitle}>Do you have a place?</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>I have a place and need a roommate</Text>
              <Switch
                value={hasProperty}
                onValueChange={setHasProperty}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor="#FFF"
              />
            </View>
            {hasProperty && (
              <GlassCard style={styles.propertyCard}>
                <Input label="Address" placeholder="123 Main St" value={address} onChangeText={setAddress} icon={<Home size={18} color={Colors.textTertiary} />} />
                <View style={styles.row}>
                  <Input label="Beds" placeholder="3" value={bedrooms} onChangeText={setBedrooms} keyboardType="numeric" style={styles.halfInput} />
                  <Input label="Baths" placeholder="2" value={bathrooms} onChangeText={setBathrooms} keyboardType="numeric" style={styles.halfInput} />
                </View>
                <View style={styles.row}>
                  <Input label="Sqft" placeholder="1200" value={sqft} onChangeText={setSqft} keyboardType="numeric" style={styles.halfInput} />
                  <Input label="Rent/mo" placeholder="1500" value={rent} onChangeText={setRent} keyboardType="numeric" style={styles.halfInput} />
                </View>
              </GlassCard>
            )}
          </View>
        );
      case 6:
        return (
          <View>
            <Text style={styles.stepTitle}>Lifestyle</Text>
            <Text style={styles.stepSubtitle}>What&apos;s your vibe?</Text>
            <Text style={styles.fieldLabel}>Cleanliness (1-5)</Text>
            <View style={styles.optionRow}>
              {([1, 2, 3, 4, 5] as const).map((val) => (
                <TouchableOpacity
                  key={val}
                  onPress={() => setCleanliness(val)}
                  style={[styles.optionButton, cleanliness === val && styles.optionButtonActive]}
                >
                  <Text style={[styles.optionText, cleanliness === val && styles.optionTextActive]}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Sleep Schedule</Text>
            {renderOptionButtons(sleepOptions, sleepSchedule, setSleepSchedule)}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Smoking</Text>
              <Switch value={smoking} onValueChange={setSmoking} trackColor={{ false: Colors.border, true: Colors.primary }} thumbColor="#FFF" />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Pets</Text>
              <Switch value={pets} onValueChange={setPets} trackColor={{ false: Colors.border, true: Colors.primary }} thumbColor="#FFF" />
            </View>
            <Text style={styles.fieldLabel}>Guests</Text>
            {renderOptionButtons(guestOptions, guests, setGuests)}
            <Text style={styles.fieldLabel}>Noise Level</Text>
            {renderOptionButtons(noiseOptions, noise, setNoise)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{step}/{TOTAL_STEPS}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handleBack} style={styles.navButton}>
          <ChevronLeft size={24} color={Colors.textPrimary} />
          <Text style={styles.navButtonText}>{step === 1 ? 'Cancel' : 'Back'}</Text>
        </TouchableOpacity>

        {step < TOTAL_STEPS ? (
          <Button title="Next" onPress={handleNext} size="md" icon={<ChevronRight size={18} color="#FFF" />} />
        ) : (
          <Button title="Create Account" onPress={handleSubmit} isLoading={isLoading} size="md" />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Spacing['5xl'],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing['3xl'],
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing['3xl'],
    paddingVertical: Spacing.xl,
  },
  stepTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing['3xl'],
  },
  fieldLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  optionButton: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  optionButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
  optionText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  optionTextActive: {
    color: Colors.primary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  switchLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    flex: 1,
    marginRight: Spacing.md,
  },
  avatarPicker: {
    alignSelf: 'center',
    marginVertical: Spacing.xl,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  avatarPlaceholderText: {
    color: Colors.textTertiary,
    fontSize: FontSize.xs,
  },
  propertyCard: {
    marginTop: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing['3xl'],
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  navButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontWeight: '500',
  },
});
