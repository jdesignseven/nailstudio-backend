import { Stack } from 'expo-router';
import { useAuth } from '../../src/auth';
import { redirect } from 'expo-router';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    redirect('/(auth)/login');
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    />
  );
}