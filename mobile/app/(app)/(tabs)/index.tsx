'use client';

import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, TrendingUp, DollarSign, TrendingDown, CheckCircle2, Clock, Users, AlertTriangle } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '../../../src/theme';
import { getDashboard } from '../../../src/services';
import { useAuth } from '../../../src/auth';

const dayMap: Record<string, string> = {
  Sunday: 'domingo', Monday: 'segunda', Tuesday: 'terça', Wednesday: 'quarta',
  Thursday: 'quinta', Friday: 'sexta', Saturday: 'sábado',
};

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await getDashboard();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const now = new Date();
  const dayName = dayMap[format(now, 'EEEE')] || format(now, 'EEEE');
  const dateStr = `${dayName}, ${format(now, "d 'de' MMM", { locale: ptBR })}`;

  const cards = data
    ? [
        { label: 'Clientes Ativas', value: String(data.totalClients), color: theme.primary, bg: theme.primaryLight, icon: Users },
        { label: 'Lucro (Mês)', value: `R$ ${data.monthProfit.toFixed(2)}`, color: '#7B1FA2', bg: '#F3E5F5', icon: TrendingUp },
        { label: 'Faturamento', value: `R$ ${data.monthRevenue.toFixed(2)}`, color: '#2E7D32', bg: '#E8F5E9', icon: DollarSign },
        { label: 'Saídas', value: `R$ ${data.monthExpenses.toFixed(2)}`, color: '#C62828', bg: '#FFEBEE', icon: TrendingDown },
        { label: 'Concluídos', value: String(data.monthCompleted), color: '#00695C', bg: '#E0F2F1', icon: CheckCircle2 },
        { label: 'Pendentes', value: String(data.pending), color: '#E65100', bg: '#FFF3E0', icon: Clock },
      ]
    : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Olá, {user?.name?.split(' ')[0] || 'Usuário'} 👋</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <View key={card.label} style={[styles.card, { borderColor: card.color + '40' }]}>
              <View style={[styles.cardIcon, { backgroundColor: card.bg }]}>
                <Icon size={22} color={card.color} />
              </View>
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={[styles.cardValue, { color: card.color }]}>{card.value}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Calendar size={22} color={theme.primary} />
            <Text style={styles.sectionTitle}>Resumo de Hoje</Text>
          </View>
        </View>

        {data?.todayAppointments?.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum agendamento para hoje</Text>
          </View>
        ) : (
          <View style={styles.appointmentsList}>
            {data.todayAppointments.map((apt: any) => (
              <View key={apt.id} style={styles.appointmentItem}>
                <View style={styles.appointmentTime}>
                  <Text style={styles.appointmentTimeText}>{format(new Date(apt.date), 'HH:mm')}</Text>
                  <Text style={styles.appointmentDurationText}>{apt.service.duration}min</Text>
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentClientName}>{apt.client.name}</Text>
                  <Text style={styles.appointmentServiceName}>{apt.service.name}</Text>
                </View>
                <View style={[styles.appointmentStatus, getStatusStyle(apt.status, theme)]}>
                  <Text style={styles.appointmentStatusText}>
                    {getStatusLabel(apt.status)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <AlertTriangle size={22} color={theme.primary} />
            <Text style={styles.sectionTitle}>Lembretes</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <AlertTriangle size={48} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum lembrete para hoje</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    completed: 'Concluído',
    confirmed: 'Confirmado',
    scheduled: 'Agendado',
    cancelled: 'Cancelado',
    no_show: 'Faltou',
  };
  return labels[status] || status;
}

function getStatusStyle(status: string, theme: any) {
  switch (status) {
    case 'completed': return { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' };
    case 'confirmed': return { backgroundColor: '#E3F2FD', borderColor: '#1565C0' };
    case 'scheduled': return { backgroundColor: '#FFF3E0', borderColor: '#E65100' };
    case 'cancelled': return { backgroundColor: '#FFEBEE', borderColor: '#C62828' };
    case 'no_show': return { backgroundColor: '#F5F5F5', borderColor: '#9E9E9E' };
    default: return { backgroundColor: theme.primaryLight, borderColor: theme.primary };
  }
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#FAFAFA' },
  contentContainer: { paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  greeting: { flex: 1 },
  greetingText: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  dateText: { fontSize: 14, color: '#666', marginTop: 4 },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 150,
    flex: 1,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: { fontSize: 11, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  cardValue: { fontSize: 18, fontWeight: '800' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  emptyState: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { marginTop: 12, fontSize: 14, color: '#888', fontWeight: '500' },
  appointmentsList: { gap: 8 },
  appointmentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#fafafa', borderRadius: 10, gap: 12 },
  appointmentTime: { alignItems: 'center', minWidth: 60 },
  appointmentTimeText: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  appointmentDurationText: { fontSize: 11, color: '#888', marginTop: 2 },
  appointmentInfo: { flex: 1, minWidth: 0 },
  appointmentClientName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  appointmentServiceName: { fontSize: 12, color: '#666', marginTop: 2 },
  appointmentStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  appointmentStatusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
});