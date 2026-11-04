import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../api';
import { Banner, Button, Stepper } from '../components/ui';
import { useStore } from '../state/Store';
import { MIN_TARGET, colors, money, spokenMoney } from '../theme';
import type { FulfilmentType, Order, Quote, Slot } from '../types';

// @FR-CART-01 @FR-CART-02 @FR-CHK-01 @FR-CHK-02 @FR-CHK-03
export function CartScreen({ navigation }: { navigation: any }) {
  const { cart, setQuantity, clearCart } = useStore();
  const [type, setType] = useState<FulfilmentType>('pickup');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<Order | null>(null);

  // The API owns pricing: ask it for the quote whenever the basket or fulfilment changes.
  useEffect(() => {
    if (cart.length === 0) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    api
      .quote(cart, type)
      .then((q) => !cancelled && (setQuote(q), setError(null)))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [cart, type]);

  const loadSlots = useCallback(() => {
    setSlotId(null);
    api
      .slots(type)
      .then((s) => setSlots(s))
      .catch((e) => setError(e.message));
  }, [type]);
  useEffect(loadSlots, [loadSlots]);

  const place = async () => {
    if (!slotId) return;
    setPlacing(true);
    try {
      const order = await api.placeOrder(cart, type, slotId);
      setPlaced(order);
      clearCart();
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not place the order');
      loadSlots(); // the slot may have gone; refresh the list
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <View style={styles.center}>
        <Text style={styles.big} accessibilityRole="header">Order placed</Text>
        <Text style={styles.text}>Order {placed.id}</Text>
        <Text style={styles.text}>{placed.fulfilment.type === 'pickup' ? 'Pickup' : 'Delivery'}: {placed.fulfilment.slot.label}</Text>
        <Text style={styles.text}>Total {money(placed.totalCents)}. Pay at {placed.fulfilment.type === 'pickup' ? 'pickup' : 'delivery'}.</Text>
        <Button title="Back to shop" onPress={() => { setPlaced(null); navigation.navigate('Shop'); }} />
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Your cart is empty.</Text>
        <Button title="Go to Shop" onPress={() => navigation.navigate('Shop')} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 32 }}>
      {error ? <Banner message={error} /> : null}
      {(quote?.lines ?? []).map((l) => (
        <View key={l.productId} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{l.name}</Text>
            <Text style={styles.sub}>{l.size} · {money(l.unitCents)} each</Text>
          </View>
          <Stepper name={l.name} qty={l.qty} onChange={(q) => setQuantity(l.productId, q)} />
          <Text style={styles.line} accessibilityLabel={spokenMoney(l.lineCents)}>{money(l.lineCents)}</Text>
        </View>
      ))}

      <Text style={styles.section}>How do you want it?</Text>
      <View style={styles.toggle}>
        {(['pickup', 'delivery'] as FulfilmentType[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setType(t)}
            accessibilityRole="button"
            accessibilityLabel={t === 'pickup' ? 'Pickup' : 'Delivery'}
            accessibilityState={{ selected: type === t }}
            style={[styles.toggleBtn, type === t && styles.toggleOn]}
          >
            <Text style={[styles.toggleText, type === t && { color: colors.white }]}>{t === 'pickup' ? 'Pickup' : 'Delivery'}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Choose a time</Text>
      {slots.length === 0 ? <Text style={styles.sub}>No slots available.</Text> : null}
      <View style={styles.slots}>
        {slots.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => setSlotId(s.id)}
            accessibilityRole="button"
            accessibilityLabel={`Slot ${s.label}`}
            accessibilityState={{ selected: slotId === s.id }}
            style={[styles.slot, slotId === s.id && styles.toggleOn]}
          >
            <Text style={[styles.toggleText, slotId === s.id && { color: colors.white }]}>{s.label}</Text>
          </Pressable>
        ))}
      </View>

      {quote ? (
        <View style={styles.totals}>
          <Text style={styles.text}>Subtotal {money(quote.subtotalCents)}</Text>
          {quote.savingsCents > 0 ? <Text style={[styles.text, { color: colors.special }]}>You save {money(quote.savingsCents)}</Text> : null}
          <Text style={styles.text}>Delivery {quote.deliveryFeeCents === 0 ? 'free' : money(quote.deliveryFeeCents)}</Text>
          <Text style={styles.total} accessibilityLabel={`Total ${spokenMoney(quote.totalCents)}`}>Total {money(quote.totalCents)}</Text>
        </View>
      ) : null}

      <View style={{ paddingHorizontal: 16 }}>
        <Button title={placing ? 'Placing…' : 'Place order'} disabled={!slotId || !quote || placing} onPress={place} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, backgroundColor: colors.cream },
  big: { fontSize: 26, fontWeight: '700', color: colors.ink },
  text: { fontSize: 16, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  name: { fontSize: 16, fontWeight: '600', color: colors.ink },
  sub: { fontSize: 13, color: colors.muted },
  line: { minWidth: 64, textAlign: 'right', fontSize: 16, color: colors.ink },
  section: { fontSize: 16, fontWeight: '700', color: colors.ink, margin: 16, marginBottom: 8 },
  toggle: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  toggleBtn: { flex: 1, minHeight: MIN_TARGET, borderRadius: 10, borderWidth: 1, borderColor: colors.leaf, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  toggleOn: { backgroundColor: colors.leaf },
  toggleText: { color: colors.leaf, fontSize: 15 },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  slot: { minHeight: MIN_TARGET, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.leaf, justifyContent: 'center', backgroundColor: colors.white },
  totals: { padding: 16, gap: 4 },
  total: { fontSize: 22, fontWeight: '700', color: colors.ink },
});
