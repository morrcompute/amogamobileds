import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

export interface StackProps {
  children?: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  style?: ViewStyle;
}

const gapMap: Record<string, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const alignMap: Record<string, ViewStyle['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const justifyMap: Record<string, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

export function Stack({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  style,
}: StackProps) {
  const gapValue = typeof gap === 'number' ? gap : gapMap[gap] ?? 16;

  const stackStyle: ViewStyle = {
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: gapValue,
    alignItems: alignMap[align] || 'stretch',
    justifyContent: justifyMap[justify] || 'flex-start',
    flexWrap: wrap ? 'wrap' : 'nowrap',
  };

  return <View style={[stackStyle, style]}>{children}</View>;
}
