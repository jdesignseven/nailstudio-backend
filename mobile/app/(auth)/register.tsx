'use client';

import { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../../src/auth';
import { useTheme } from '../../src/theme';
import { styles } from './styles';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studioName, setStudioName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !studioName) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password, studioName, phone: phone || undefined });
      router.replace('/(app)/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
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
          <Text style={styles.subtitle}>Comece a gerenciar seu estúdio</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Criar Conta</Text>
          <Text style={styles.formSubtitle}>Cadastre seu estúdio</Text>

          {error && (
            <View style={[styles.errorBox, { backgroundColor: theme.errorLight, borderColor: theme.error }]}>
              <Text style={[styles.errorText, { color: theme.error }}]>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo *</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border }]}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              autoCapitalize="words"
              autoComplete="name"
              onFocus={() => setError('')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border }]}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              onFocus={() => setError('')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha *</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              autoComplete="new-password"
              onFocus={() => setError('')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do estúdio *</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border }]}
              value={studioName}
              onChangeText={setStudioName}
              placeholder="Ex: Nail Designer Studio"
              autoCapitalize="words"
              onFocus={() => setError('')}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
              autoComplete="tel"
              onFocus={() => setError('')}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>{loading ? 'Cadastrando...' : 'Criar Conta'}</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Já tem conta? Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}