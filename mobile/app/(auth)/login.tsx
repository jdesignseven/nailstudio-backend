'use client';

import { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../src/auth';
import { useTheme } from '../../src/theme';
import { styles } from './styles';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.replace('/(app)/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
            <Text style={styles.logoEmoji}>💅</Text>
          </View>
          <Text style={[styles.title, { color: theme.primary }]}>Nail Studio Pro</Text>
          <Text style={styles.subtitle}>Gestão inteligente para seu estúdio</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Entrar</Text>
          <Text style={styles.formSubtitle}>Acesse sua conta</Text>

          {error && (
            <View style={[styles.errorBox, { backgroundColor: theme.errorLight, borderColor: theme.error }]}>
              <Text style={[styles.errorText, { color: theme.error }}]>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border }]}
              value={email}
              onChangeText={setEmail}
              placeholder='seu@email.com'
              autoCapitalize='none'
              keyboardType='email-address'
              autoComplete='email'
              onFocus={() => setError('')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border }]}
              value={password}
              onChangeText={setPassword}
              placeholder='Sua senha'
              secureTextEntry
              autoComplete='password'
              onFocus={() => setError('')}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Criar conta</Text>
          </TouchableOpacity>

          <View style={styles.demoBox}>
            <Text style={styles.demoText}>
              <Text style={styles.demoBold}>Demo:</Text> admin@nailstudio.com / 123456
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
