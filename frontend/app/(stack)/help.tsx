import React from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '../../constants';
import { colors, commonStyles } from '../../styles';

export default function HelpScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: colors.neutral[50] }]}>
      <ScrollView contentContainerStyle={[commonStyles.p6]}>
        <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.neutral[900] }, commonStyles.mb4]}>Help & Support</Text>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>Getting a Good Scan</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Photograph a single leaf against a neutral background. Avoid harsh shadows. Center the leaf and keep the camera steady. Natural diffuse light works best.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>Common Issues</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Blurry image: hold still for 1–2 seconds. Upload failure: check network connectivity. Wrong diagnosis: retake with clearer focus and ensure leaf fills most of the frame.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>Recommended Actions</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>If severity is high or critical, isolate affected plants and consult a local agronomist. Follow integrated pest management guidelines whenever applying treatments.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>Contact Support</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Email: {SUPPORT_EMAIL}</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }, commonStyles.mt2]}>Phone: {SUPPORT_PHONE}</Text>
        </Card>

        <Text style={[commonStyles.textSm, { color: colors.neutral[400] }, commonStyles.mt8, commonStyles.textCenter]}>Always cross-check treatment decisions with local agricultural guidelines.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
