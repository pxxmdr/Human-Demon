import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchCharacters } from "../api";
import type { Character } from "../types";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "CharacterList">;

export default function CharacterListScreen({ navigation }: Props) {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const list = await fetchCharacters(45);
      const arr = Array.isArray(list) ? list : [];
      console.log("Carregados:", arr.length);
      setData(arr);
    } catch (e: any) {
      console.error("Erro ao buscar personagens:", e);
      setError(e?.message ?? "Erro inesperado");
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, []);

  const keyExtractor = useCallback((item: Character) => String(item.id), []);
  const renderItem = useCallback<ListRenderItem<Character>>(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("CharacterDetail", { id: item.id })}
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes de ${item.name}`}
      >
        <Image
          source={{ uri: item.img }}
          style={styles.avatar}
          resizeMode="contain"
        />
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ),
    [navigation]
  );

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

  const header = (
    <View style={styles.header}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
        accessible
        accessibilityLabel="Logo Demon Slayer"
      />
      <Text style={styles.headerSubtitle}>Escolha seu personagem abaixo</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.list}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.muted}>Nenhum personagem carregado.</Text>
          <TouchableOpacity
            onPress={load}
            style={[styles.retryBtn, { marginTop: 8 }]}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      }
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      initialNumToRender={12}
      windowSize={7}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12 },
  header: { alignItems: "center", marginBottom: 8 },
  logo: {
    width: 200,
    height: 120,
    marginTop: 6,
    marginBottom: 6,
    alignSelf: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#eee",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
  },
  name: { fontWeight: "700", fontSize: 18, flexShrink: 1 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  muted: { marginTop: 8, color: "#666", textAlign: "center" },
  error: { color: "#ff6b6b", textAlign: "center", marginBottom: 12 },
  retryBtn: {
    backgroundColor: "#333",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
