import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchCharacters } from '../api';
import { Character } from '../types';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterList'>;

export default function CharacterListScreen({ navigation }: Props) {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const list = await fetchCharacters(45);
      setData(list);
    } catch (e: any) {
      setError(e?.message ?? 'Erro inesperado');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Carregando personagens…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Falha ao carregar: {error}</Text>
        <TouchableOpacity onPress={load} style={styles.retryBtn}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('CharacterDetail', { id: item.id })}
          >
            <Image source={{ uri: item.img }} style={styles.avatar} />
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#eee',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  avatar: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#ddd' },
  name: { fontWeight: '700', fontSize: 18, flexShrink: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  muted: { marginTop: 8, color: '#666' },
  error: { color: '#ff6b6b', textAlign: 'center', marginBottom: 12 },
  retryBtn: { backgroundColor: '#333', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});
