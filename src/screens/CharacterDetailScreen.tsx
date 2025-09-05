import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
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
    <ImageBackground source={bgSource} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image
            source={{ uri: data.img }}
            style={styles.character}
            resizeMode="contain"
            accessibilityLabel={`Imagem de ${data.name}`}
          />
        </View>

        <View style={styles.sheet}>
          <Text style={styles.title}>{data.name}</Text>

          <View style={styles.chipsRow}>
            <Chip label="Idade" value={String(data.age ?? '—')} />
            <Chip label="Raça" value={data.race ?? '—'} />
            <Chip label="Gênero" value={data.gender ?? '—'} />
          </View>

          <Section title="Descrição" text={data.description ?? '—'} />
          <Quote text={data.quote ?? '—'} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <View style={chipStyles.item}>
      <Text style={chipStyles.label}>{label}:</Text>
      <Text style={chipStyles.value}>{value}</Text>
    </View>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <View style={sectionStyles.block}>
      <Text style={sectionStyles.blockTitle}>{title}</Text>
      <Text style={sectionStyles.blockText}>{text}</Text>
    </View>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <View style={quoteStyles.wrap}>
      <Text style={quoteStyles.text}>"{text}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },


  scroll: { flexGrow: 1, paddingBottom: 24 },


  header: {
    height: 260,
    position: 'relative',
    overflow: 'visible', // Android
    justifyContent: 'flex-end',
  },

 
  character: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -30, 
    height: 250,
    zIndex: 3,
    alignSelf: 'center',
  },

  
  sheet: {
    position: 'relative',
    zIndex: 1, 
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginHorizontal: 12,
    paddingHorizontal: 16,
    paddingTop: 56,  
    paddingBottom: 16,
    flexGrow: 1, 

    // sombra
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#000' },
  muted: { marginTop: 8, color: '#ccc' },
  error: { color: '#ff6b6b', textAlign: 'center' },
});

const chipStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f3',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  label: { color: '#666', fontSize: 12, marginRight: 4 },
  value: { color: '#c00', fontWeight: '800' },
});

const sectionStyles = StyleSheet.create({
  block: { backgroundColor: '#fff', marginTop: 8 },
  blockTitle: { color: '#111', fontWeight: '800', marginBottom: 6, fontSize: 14 },
  blockText: { color: '#333', lineHeight: 20 },
});

const quoteStyles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 12,
  },
  text: {
    color: '#fff',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
