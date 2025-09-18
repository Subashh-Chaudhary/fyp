import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../../../styles';

export default function ScanCameraScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, commonStyles.bgNeutral50]}>
      {/* Header */}
      <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween, commonStyles.px4, commonStyles.py3]}>
        <TouchableOpacity accessibilityLabel="Go back" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.neutral[800]} />
        </TouchableOpacity>
        <Text style={[commonStyles.textLg, commonStyles.fontSemibold]}>Scan</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Camera preview placeholder */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.neutral[800],
          borderRadius: 16,
          marginHorizontal: 16,
          overflow: 'hidden',
        }}
      >
        {/* Scan frame */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: '80%',
              aspectRatio: 1,
              borderColor: colors.primary[400],
              borderWidth: 2,
              borderRadius: 16,
            }}
          />
          <Text style={[commonStyles.mt3, commonStyles.textSm, { color: colors.neutral[200] }]}>Align the plant within the frame</Text>
        </View>
      </View>

      {/* Bottom controls */}
      <View style={[commonStyles.px6, commonStyles.py4]}>
        <View style={[commonStyles.flexRow, commonStyles.itemsCenter, commonStyles.justifyBetween]}>
          <TouchableOpacity
            accessibilityLabel="Toggle flash"
            style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.neutral[100] }]}
          >
            <Ionicons name="flash" size={22} color={colors.neutral[800]} />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Capture"
            style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary[500] }]}
          >
            <Ionicons name="scan" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Switch camera"
            style={[commonStyles.itemsCenter, commonStyles.justifyCenter, { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.neutral[100] }]}
          >
            <Ionicons name="sync" size={22} color={colors.neutral[800]} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
