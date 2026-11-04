import React from 'react';
import { View, useWindowDimensions } from 'react-native';
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
import { contentWidth, navPosition } from './src/lib/layout';

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
  const { width } = useWindowDimensions();
  // @FR-DSK-02 side navigation from the regular breakpoint up; bottom tabs on phones
  const position = navPosition(width);
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.leaf,
        tabBarPosition: position,
        // The uikit variant only supports top/bottom; the material variant is the sidebar layout.
        tabBarVariant: position === 'left' ? 'material' : 'uikit',
      }}
    >
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
  const { width } = useWindowDimensions();
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer>
          {/* @FR-DSK-04 centred content column, capped at 1200 */}
          <View style={{ flex: 1, alignItems: 'center', backgroundColor: colors.cream }}>
            <View style={{ flex: 1, width: contentWidth(width) }}>
              <Root />
            </View>
          </View>
          <StatusBar style="dark" />
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
