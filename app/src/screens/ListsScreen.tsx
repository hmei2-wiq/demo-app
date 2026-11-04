import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Stepper } from '../components/ui';
import { useStore } from '../state/Store';
import { MIN_TARGET, colors } from '../theme';

// @FR-LST-01
export function ListsScreen({ navigation }: { navigation: any }) {
  const { lists, newList, removeList } = useStore();
  const [name, setName] = useState('');

  return (
    <View style={styles.screen}>
      <View style={styles.create}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="New list name, e.g. Weekly"
          accessibilityLabel="New list name"
          maxLength={40}
        />
        <Button
          title="Create"
          disabled={name.trim().length === 0}
          onPress={() => {
            newList(name);
            setName('');
          }}
        />
      </View>
      <FlatList
        data={lists}
        keyExtractor={(l) => l.id}
        ListEmptyComponent={<Text style={styles.empty}>No lists yet. Create one for your weekly shop.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              style={styles.rowMain}
              accessibilityRole="button"
              accessibilityLabel={`Open list ${item.name}, ${item.items.length} items`}
              onPress={() => navigation.navigate('ListDetail', { id: item.id })}
            >
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.count}>{item.items.length} items</Text>
            </Pressable>
            <Button title="Delete" variant="secondary" accessibilityLabel={`Delete list ${item.name}`} onPress={() => removeList(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

// @FR-LST-01 @FR-LST-02
export function ListDetailScreen({ route }: { route: any }) {
  const { lists, products, addListToCart, setListQuantity } = useStore();
  const list = lists.find((l) => l.id === route.params.id);
  const [message, setMessage] = useState<string | null>(null);
  if (!list) return <Text style={styles.empty}>This list no longer exists.</Text>;

  return (
    <View style={styles.screen}>
      <FlatList
        data={list.items}
        keyExtractor={(i) => i.productId}
        ListEmptyComponent={<Text style={styles.empty}>Empty. Add products from a product page.</Text>}
        renderItem={({ item }) => {
          const p = products.get(item.productId);
          const name = p?.name ?? 'Unavailable product';
          return (
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.listName}>{name}</Text>
                {p ? <Text style={styles.count}>{p.size}</Text> : null}
              </View>
              <Stepper
                name={name}
                qty={item.qty}
                onChange={(q) => setListQuantity(list.id, item.productId, q)}
              />
            </View>
          );
        }}
      />
      <View style={{ padding: 16, gap: 8 }}>
        <Button
          title="Add all to cart"
          disabled={list.items.length === 0}
          accessibilityLabel={`Add all items from ${list.name} to cart`}
          onPress={() => {
            addListToCart(list.id);
            setMessage(`Added ${list.items.length} items to your cart.`);
          }}
        />
        {message ? <Text accessibilityLiveRegion="polite" style={{ color: colors.leaf }}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  create: { flexDirection: 'row', gap: 8, padding: 16 },
  input: {
    flex: 1,
    minHeight: MIN_TARGET,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    fontSize: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowMain: { flex: 1, minHeight: MIN_TARGET, justifyContent: 'center' },
  listName: { fontSize: 16, fontWeight: '600', color: colors.ink },
  count: { fontSize: 13, color: colors.muted },
  empty: { textAlign: 'center', marginTop: 32, color: colors.muted, paddingHorizontal: 24 },
});
