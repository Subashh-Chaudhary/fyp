import React from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { DATA_RETENTION_DAYS, SUPPORT_EMAIL } from '../../constants';
import { colors, commonStyles } from '../../styles';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: colors.neutral[50] }]}>
      <ScrollView contentContainerStyle={[commonStyles.p6]}>
        <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.neutral[900] }, commonStyles.mb4]}>Privacy Policy</Text>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>Data We Process</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Uploaded plant images, basic device metadata (model, OS version), and non-identifying usage analytics. We do not sell personal data.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>How We Use Data</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>To analyze leaf images for diseases, improve detection models, and maintain service reliability. Where required, we obtain consent before using images for model improvement.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>Retention & Deletion</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Images are retained for up to {DATA_RETENTION_DAYS} days unless you request earlier deletion. You can request deletion at any time via the app or by contacting support.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>Your Rights</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Access, rectify, or delete your data, and withdraw consent where applicable. We will respond to verified requests within a reasonable timeframe.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>Contact</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Questions or requests: {SUPPORT_EMAIL}</Text>
        </Card>

        <Text style={[commonStyles.textSm, { color: colors.neutral[400] }, commonStyles.mt8, commonStyles.textCenter]}>This summary is for demonstration. Replace with a full, jurisdiction-specific policy before production.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
