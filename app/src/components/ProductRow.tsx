import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from './ui';
import { colors, money, spokenMoney } from '../theme';
import type { Product } from '../types';

type Props = { product: Product; onOpen: () => void; onAdd: () => void };

export function ProductRow({ product, onOpen, onAdd }: Props) {
  const special = product.wasCents !== undefined && product.wasCents > product.priceCents;
  return (
    <View style={styles.row}>
      <Pressable
        style={styles.info}
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`${product.name}, ${product.size}, ${spokenMoney(product.priceCents)}${special ? ', special' : ''}`}
      >
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.size}>{product.size}</Text>
        <View style={styles.prices}>
          <Text style={[styles.price, special && { color: colors.special }]}>{money(product.priceCents)}</Text>
          {special ? <Text style={styles.was}>{money(product.wasCents!)}</Text> : null}
        </View>
      </Pressable>
      <Button title="Add" accessibilityLabel={`Add ${product.name} to cart`} onPress={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  info: { flex: 1, minHeight: 44, justifyContent: 'center' },
  name: { fontSize: 16, color: colors.ink, fontWeight: '600' },
  size: { fontSize: 13, color: colors.muted },
  prices: { flexDirection: 'row', gap: 8, alignItems: 'baseline' },
  price: { fontSize: 16, color: colors.ink },
  was: { fontSize: 13, color: colors.muted, textDecorationLine: 'line-through' },
});
