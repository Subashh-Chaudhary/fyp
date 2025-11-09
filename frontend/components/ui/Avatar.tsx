import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { colors, commonStyles } from '../../styles';

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  onEdit?: () => void;
  loading?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 100, onEdit, loading }) => {
  const initial = name?.charAt(0).toUpperCase() || '?';
  const radius = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: radius, backgroundColor: colors.neutral[100] }}
        />
      ) : (
        <View
          style={[
            commonStyles.itemsCenter,
            commonStyles.justifyCenter,
            {
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: colors.primary[100],
            },
          ]}
        >
          <Text style={[commonStyles.fontBold, { fontSize: size * 0.4, color: colors.primary[600] }]}>{initial}</Text>
        </View>
      )}
      {onEdit && (
        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            right: 4,
            bottom: 4,
            backgroundColor: colors.primary[500],
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: (size * 0.32) / 2,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {loading ? (
            <Ionicons name="hourglass-outline" size={size * 0.18} color="#fff" />
          ) : (
            <Ionicons name="camera-outline" size={size * 0.18} color="#fff" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
