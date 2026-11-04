// NOT RUN in the build session (npm registry unreachable). Run with: npm test
import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { Button, Stepper } from '../src/components/ui';
import { MIN_TARGET } from '../src/theme';

describe('shared controls', () => {
  it('@NFR-A11Y-01 › Control audit: Button', () => {
    const { getByRole } = render(<Button title="Add" onPress={() => {}} />);
    const btn = getByRole('button');
    const style = StyleSheet.flatten(btn.props.style);
    expect(style.minHeight).toBeGreaterThanOrEqual(MIN_TARGET);
    expect(style.minWidth).toBeGreaterThanOrEqual(MIN_TARGET);
    expect(btn.props.accessibilityLabel).toBeTruthy();
  });

  it('@NFR-A11Y-01 › Control audit: Stepper', () => {
    const { getAllByRole } = render(<Stepper name="Milk" qty={1} onChange={() => {}} />);
    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
    for (const b of buttons) {
      const style = StyleSheet.flatten(b.props.style);
      expect(style.minHeight).toBeGreaterThanOrEqual(MIN_TARGET);
      expect(style.minWidth).toBeGreaterThanOrEqual(MIN_TARGET);
      expect(b.props.accessibilityLabel).toMatch(/quantity of Milk/);
    }
  });
});
