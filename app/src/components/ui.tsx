import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MIN_TARGET, colors } from '../theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

/** @NFR-A11Y-01 44pt minimum target and always a label. */
export function Button({ title, onPress, accessibilityLabel, variant = 'primary', disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!disabled }}
      style={[styles.button, variant === 'secondary' && styles.secondary, disabled && styles.disabled]}
    >
      <Text style={[styles.buttonText, variant === 'secondary' && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

type StepperProps = { name: string; qty: number; onChange: (qty: number) => void };

/** @NFR-A11Y-01 */
export function Stepper({ name, qty, onChange }: StepperProps) {
  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease quantity of ${name}`}
        onPress={() => onChange(qty - 1)}
        style={styles.stepBtn}
      >
        <Text style={styles.stepText}>−</Text>
      </Pressable>
      <Text accessibilityLabel={`Quantity ${qty}`} style={styles.qty}>
        {qty}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase quantity of ${name}`}
        onPress={() => onChange(qty + 1)}
        style={styles.stepBtn}
      >
        <Text style={styles.stepText}>+</Text>
      </Pressable>
    </View>
  );
}

export function Banner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.bannerText}>{message}</Text>
      {onRetry ? <Button title="Retry" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

export const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TARGET,
    minWidth: MIN_TARGET,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.leaf },
  disabled: { opacity: 0.5 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  secondaryText: { color: colors.leaf },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepBtn: {
    minHeight: MIN_TARGET,
    minWidth: MIN_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.leaf,
  },
  stepText: { fontSize: 22, color: colors.leaf },
  qty: { minWidth: 36, textAlign: 'center', fontSize: 16, color: colors.ink },
  banner: { margin: 16, padding: 12, borderRadius: 10, backgroundColor: '#FBE9E7', gap: 8 },
  bannerText: { color: colors.special, fontSize: 15 },
});
