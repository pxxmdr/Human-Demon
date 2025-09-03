import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchCharacterById } from '../api';
import { Character } from '../types';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterDetail'>;

export default function CharacterDetailScreen({ route }: Props) {
  const { id } = route.params;
  const [data, setData] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const c = await fetchCharacterById(id);
        setData(c);
      } catch (e: any) {
        setError(e?.message ?? 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Carregando detalhes…</Text>
      </View>
    );
  }

  if (!data || error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Não foi possível carregar o personagem.</Text>
        {error ? <Text style={styles.muted}>{error}</Text> : null}
      </View>
    );
  }

 
  const isDemon = (data.race ?? '').toLowerCase().includes('demon');
  const bgSource = isDemon
    ? require('../../assets/background-demon.png')
    : require('../../assets/background-human.png');

  return (
    <ImageBackground source={bgSource} style={styles.bg} imageStyle={{ opacity: 0.35 }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: data.img }} style={styles.portrait} />
        <Text style={styles.title}>{data.name}</Text>

        <View style={styles.infoRow}>
          <Info label="Idade" value={String(data.age ?? '—')} />
          <Info label="Raça" value={data.race ?? '—'} />
          <Info label="Gênero" value={data.gender ?? '—'} />
        </View>

        <InfoBlock title="Descrição" text={data.description ?? '—'} />
        <InfoBlock title="Citação" text={data.quote ?? '—'} />
      </ScrollView>
    </ImageBackground>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.item}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <View style={blockStyles.block}>
      <Text style={blockStyles.blockTitle}>{title}</Text>
      <Text style={blockStyles.blockText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16, alignItems: 'center' },
  portrait: {
    width: 220, height: 300, borderRadius: 14,
    borderWidth: 2, borderColor: '#fff2',
    marginBottom: 12, backgroundColor: '#111',
  },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  infoRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#000' },
  muted: { marginTop: 8, color: '#ccc' },
  error: { color: '#ff6b6b', textAlign: 'center' },
});

const infoStyles = StyleSheet.create({
  item: { backgroundColor: '#111', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, minWidth: 96, alignItems: 'center' },
  label: { color: '#bbb', fontSize: 12 },
  value: { color: '#fff', fontWeight: '700' },
});

const blockStyles = StyleSheet.create({
  block: { backgroundColor: '#111', padding: 12, borderRadius: 12, width: '100%', marginTop: 10 },
  blockTitle: { color: '#fff', fontWeight: '800', marginBottom: 6 },
  blockText: { color: '#ddd', lineHeight: 20 },
});
