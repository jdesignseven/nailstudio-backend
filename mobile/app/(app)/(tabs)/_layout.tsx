import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';

const iconMap: Record<string, { focused: string; unfocused: string }> = {
  index: { focused: 'home', unfocused: 'home-outline' },
  agenda: { focused: 'calendar', unfocused: 'calendar-outline' },
  clientes: { focused: 'people', unfocused: 'people-outline' },
  servicos: { focused: 'cut', unfocused: 'cut-outline' },
  despesas: { focused: 'receipt', unfocused: 'receipt-outline' },
  relatorios: { focused: 'bar-chart', unfocused: 'bar-chart-outline' },
  estudio: { focused: 'settings', unfocused: 'settings-outline' },
  mais: { focused: 'ellipsis-horizontal', unfocused: 'ellipsis-horizontal-outline' },
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: insets.bottom || 8,
          height: (insets.bottom || 8) + 60,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          const icons = iconMap[route.name] || iconMap.mais;
          return (
            <Ionicons
              name={focused ? icons.focused : icons.unfocused}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="agenda" options={{ title: 'Agenda' }} />
      <Tabs.Screen name="clientes" options={{ title: 'Clientes' }} />
      <Tabs.Screen name="servicos" options={{ title: 'Serviços' }} />
      <Tabs.Screen name="despesas" options={{ title: 'Despesas' }} />
      <Tabs.Screen name="relatorios" options={{ title: 'Relatórios' }} />
      <Tabs.Screen name="estudio" options={{ title: 'Estúdio' }} />
      <Tabs.Screen name="mais" options={{ title: 'Mais' }} />
    </Tabs>
  );
}