import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { APP_NAME, APP_TAGLINE, APP_VERSION, COMPANY_LOCATION, COMPANY_NAME, COPYRIGHT_NOTICE } from '../../constants';
import { colors, commonStyles } from '../../styles';

export default function AboutScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: colors.neutral[50] }]}>
      <ScrollView contentContainerStyle={[commonStyles.p6]}>
        <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.neutral[900] }, commonStyles.mb4]}>About</Text>

        <Card variant="elevated" margin="large">
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter]}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              {/* Simple app mark using text initials */}
              <Text style={[commonStyles.fontBold, { color: colors.primary[700] }]}>AI</Text>
            </View>
            <View style={commonStyles.flex1}>
              <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[900] }]}>{APP_NAME}</Text>
              <Text style={[commonStyles.textSm, { color: colors.neutral[500], marginTop: 2 }]}>Version {APP_VERSION}</Text>
            </View>
          </View>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }, commonStyles.mt4]}>{APP_TAGLINE}</Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>What this app does</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}> 
            Capture a clear photo of your crop leaf and our on-device and cloud AI will analyze it for common diseases.
            You’ll receive a severity estimate and actionable steps, such as recommended treatments and preventive care.
          </Text>
        </Card>

        <Card variant="outlined" margin="large">
          <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[800] }, commonStyles.mb2]}>Who we are</Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>
            {COMPANY_NAME} is an agri-tech team focused on practical AI for smallholder farmers.
            We collaborate with agronomists and local communities to make plant care faster and more affordable.
          </Text>
          <Text style={[commonStyles.textSm, { color: colors.neutral[500] }, commonStyles.mt2]}>
            {COMPANY_LOCATION}
          </Text>
        </Card>

        <Text style={[commonStyles.textSm, { color: colors.neutral[400] }, commonStyles.mt8, commonStyles.textCenter]}>
          {COPYRIGHT_NOTICE}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
