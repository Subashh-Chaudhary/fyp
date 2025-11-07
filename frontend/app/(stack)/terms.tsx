import React from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { COMPANY_NAME, SUPPORT_EMAIL } from '../../constants';
import { colors, commonStyles } from '../../styles';

export default function TermsScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: colors.neutral[50] }]}>
      <ScrollView contentContainerStyle={[commonStyles.p6]}>
        <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.neutral[900] }, commonStyles.mb4]}>Terms & Conditions</Text>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>1. Acceptance of Terms</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Using this application constitutes agreement to these terms. If you do not agree, discontinue use immediately.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>2. Diagnostic Accuracy</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>AI predictions are probabilistic. Results should be verified with a qualified agronomist for high-impact decisions (e.g., large-scale pesticide application).</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>3. Acceptable Use</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>You agree not to upload unrelated or abusive imagery, attempt to reverse engineer the service, or misuse network resources.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>4. Limitation of Liability</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Under no circumstances shall {COMPANY_NAME} be liable for indirect or consequential losses arising from reliance on automated disease assessments.</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>5. Contact</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>Questions about these terms may be sent to {SUPPORT_EMAIL}.</Text>
        </Card>

        <Text style={[commonStyles.textSm, { color: colors.neutral[400] }, commonStyles.mt8, commonStyles.textCenter]}>This summary is not exhaustive. Provide full legal review before production deployment.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
