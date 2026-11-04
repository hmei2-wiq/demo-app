import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/state/Store';
import { ShopScreen } from './src/screens/ShopScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { ListsScreen, ListDetailScreen } from './src/screens/ListsScreen';
import { CartScreen } from './src/screens/CartScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { colors } from './src/theme';

const Tabs = createBottomTabNavigator();
const ShopStack = createNativeStackNavigator();
const ListsStack = createNativeStackNavigator();

function ShopNav() {
  return (
    <ShopStack.Navigator>
      <ShopStack.Screen name="ShopHome" component={ShopScreen} options={{ title: 'FreshCart' }} />
      <ShopStack.Screen name="Detail" component={DetailScreen} options={{ title: 'Product' }} />
    </ShopStack.Navigator>
  );
}

function ListsNav() {
  return (
    <ListsStack.Navigator>
      <ListsStack.Screen name="ListsHome" component={ListsScreen} options={{ title: 'Lists' }} />
      <ListsStack.Screen name="ListDetail" component={ListDetailScreen} options={{ title: 'List' }} />
    </ListsStack.Navigator>
  );
}

function Root() {
  const { cartCount } = useStore();
  return (
    <Tabs.Navigator screenOptions={{ tabBarActiveTintColor: colors.leaf }}>
      <Tabs.Screen name="Shop" component={ShopNav} options={{ headerShown: false }} />
      <Tabs.Screen name="Lists" component={ListsNav} options={{ headerShown: false }} />
      <Tabs.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined, tabBarAccessibilityLabel: `Cart, ${cartCount} items` }}
      />
      <Tabs.Screen name="Orders" component={OrdersScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer>
          <Root />
          <StatusBar style="dark" />
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
