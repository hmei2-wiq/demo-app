import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Stepper } from '../components/ui';
import { useStore } from '../state/Store';
import { colors, money, spokenMoney } from '../theme';

// @FR-CAT-04
export function DetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { products, add, lists, addProductToList } = useStore();
  const product = products.get(route.params.id);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  if (!product) return <Text style={styles.missing}>This product is no longer available.</Text>;
  const special = product.wasCents !== undefined && product.wasCents > product.priceCents;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={styles.name} accessibilityRole="header">{product.name}</Text>
      <Text style={styles.size}>{product.size}</Text>
      <View style={styles.prices} accessibilityLabel={`Price ${spokenMoney(product.priceCents)}`}>
        <Text style={[styles.price, special && { color: colors.special }]}>{money(product.priceCents)}</Text>
        {special ? <Text style={styles.was}>was {money(product.wasCents!)}</Text> : null}
      </View>
      <Stepper name={product.name} qty={qty} onChange={(q) => setQty(Math.max(1, Math.min(20, q)))} />
      <Button
        title="Add to cart"
        accessibilityLabel={`Add ${qty} of ${product.name} to cart`}
        onPress={() => {
          add(product.id, qty);
          setMessage(`Added ${qty} to your cart.`);
        }}
      />
      <Text style={styles.section}>Add to a list</Text>
      {lists.length === 0 ? (
        <Button title="Create a list first" variant="secondary" onPress={() => navigation.navigate('Lists')} />
      ) : (
        lists.map((l) => (
          <Button
            key={l.id}
            title={l.name}
            variant="secondary"
            accessibilityLabel={`Add ${product.name} to list ${l.name}`}
            onPress={() => {
              addProductToList(l.id, product.id);
              setMessage(`Added to ${l.name}.`);
            }}
          />
        ))
      )}
      {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  missing: { padding: 24, color: colors.muted },
  name: { fontSize: 24, fontWeight: '700', color: colors.ink },
  size: { fontSize: 15, color: colors.muted },
  prices: { flexDirection: 'row', gap: 10, alignItems: 'baseline' },
  price: { fontSize: 26, color: colors.ink },
  was: { fontSize: 15, color: colors.muted, textDecorationLine: 'line-through' },
  section: { marginTop: 16, fontSize: 16, fontWeight: '600', color: colors.ink },
  message: { color: colors.leaf, fontSize: 15 },
});
