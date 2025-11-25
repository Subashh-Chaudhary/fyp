import React from 'react';
import { View } from 'react-native';
import { colors } from '../../styles';

export function Divider({ style }: { style?: any }) {
  return <View style={[{ height: 1, backgroundColor: colors.neutral[200], width: '100%' }, style]} />;
}
