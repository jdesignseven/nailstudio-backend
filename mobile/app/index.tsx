import { redirect } from 'expo-router';
import { useAuth } from '../src/auth';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    redirect('/(app)/(tabs)');
  } else {
    redirect('/(auth)/login');
  }

  return null;
}