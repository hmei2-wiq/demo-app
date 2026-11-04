import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api';
import { Banner, Button } from '../components/ui';
import { useStore } from '../state/Store';
import { colors, money } from '../theme';
import type { Order } from '../types';

// @FR-CHK-04 @FR-LST-03
export function OrdersScreen({ navigation }: { navigation: any }) {
  const { reorder } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .orders()
      .then((o) => (setOrders(o), setError(null)))
      .catch((e) => setError(e.message));
  }, []);
  useFocusEffect(load);

  return (
    <View style={styles.screen}>
      {error ? <Banner message={error} onRetry={load} /> : null}
      {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        ListEmptyComponent={!error ? <Text style={styles.empty}>No orders yet.</Text> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.sub}>
              {item.fulfilment.type === 'pickup' ? 'Pickup' : 'Delivery'} · {item.fulfilment.slot.label}
            </Text>
            <Text style={styles.sub}>
              {item.lines.length} products · {money(item.totalCents)}
            </Text>
            <Button
              title="Reorder"
              accessibilityLabel={`Reorder ${item.id}`}
              onPress={() => {
                const { skipped } = reorder(item);
                setMessage(skipped > 0 ? `Added to cart. ${skipped} item${skipped === 1 ? ' was' : 's were'} skipped (no longer sold).` : 'Added to cart.');
                navigation.navigate('Cart');
              }}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  card: { margin: 16, marginBottom: 0, padding: 16, borderRadius: 12, backgroundColor: colors.white, gap: 6 },
  id: { fontSize: 16, fontWeight: '700', color: colors.ink },
  sub: { fontSize: 14, color: colors.muted },
  empty: { textAlign: 'center', marginTop: 32, color: colors.muted },
  message: { margin: 16, color: colors.leaf },
});
