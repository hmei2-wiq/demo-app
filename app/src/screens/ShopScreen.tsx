import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../api';
import { Banner } from '../components/ui';
import { ProductRow } from '../components/ProductRow';
import { useStore } from '../state/Store';
import { MIN_TARGET, colors } from '../theme';
import type { Product } from '../types';

const SPECIALS = '__specials__';

export function ShopScreen({ navigation }: { navigation: any }) {
  const { categories, add, ready, loadError, reload } = useStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // @FR-CAT-01 @FR-CAT-02 @FR-CAT-03
  useEffect(() => {
    if (!ready || loadError) return;
    let cancelled = false;
    const q = query.trim();
    setLoading(true);
    api
      .products({
        category: selected && selected !== SPECIALS ? selected : undefined,
        special: selected === SPECIALS,
        q: q.length >= 2 ? q : undefined,
      })
      .then((p) => !cancelled && (setItems(p), setError(null)))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query, selected, ready, loadError]);

  const chip = (id: string | null, label: string) => (
    <Pressable
      key={id ?? 'all'}
      onPress={() => setSelected(id)}
      accessibilityRole="button"
      accessibilityLabel={`Show ${label}`}
      accessibilityState={{ selected: selected === id }}
      style={[styles.chip, selected === id && styles.chipOn]}
    >
      <Text style={[styles.chipText, selected === id && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Search products"
        accessibilityLabel="Search products"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {chip(null, 'All')}
        {chip(SPECIALS, 'Specials')}
        {categories.map((c) => chip(c.id, c.name))}
      </ScrollView>
      {loadError ? <Banner message={loadError} onRetry={reload} /> : null}
      {error ? <Banner message={error} /> : null}
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <ProductRow product={item} onOpen={() => navigation.navigate('Detail', { id: item.id })} onAdd={() => add(item.id)} />
        )}
        ListEmptyComponent={!loading && !loadError ? <Text style={styles.empty}>No products found.</Text> : null}
      />
      {loading ? <Text style={styles.loading}>Loading…</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  search: {
    margin: 16,
    minHeight: MIN_TARGET,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    fontSize: 16,
  },
  chips: { flexGrow: 0, marginBottom: 8 },
  chip: {
    minHeight: MIN_TARGET,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.leaf,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  chipOn: { backgroundColor: colors.leaf },
  chipText: { color: colors.leaf, fontSize: 15 },
  empty: { textAlign: 'center', marginTop: 32, color: colors.muted },
  loading: { textAlign: 'center', padding: 8, color: colors.muted },
});
