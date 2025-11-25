import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Card } from "../../components/ui/Card"
import { COMPANY_NAME, SUPPORT_EMAIL } from "../../constants"
import { colors, commonStyles } from "../../styles"

const SectionBadge = ({ number, label }: { number: string; label: string }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 }}>
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.primary[600],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={[commonStyles.fontBold, { color: colors.neutral[50], fontSize: 14 }]}>{number}</Text>
    </View>
    <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[900] }]}>{label}</Text>
  </View>
)

export default function TermsScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: colors.neutral[50] }]}>
      <ScrollView contentContainerStyle={[commonStyles.p6]}>
        <View style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.neutral[900] }, commonStyles.mb2]}>
            Terms & Conditions
          </Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[600] }]}>
            Please read carefully before using our service
          </Text>
        </View>

        <Card variant="outlined" margin="large" style={{ borderLeftWidth: 4, borderLeftColor: colors.primary[600] }}>
          <SectionBadge number="1" label="Acceptance of Terms" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            Using this application constitutes agreement to these terms. If you do not agree, discontinue use
            immediately.
          </Text>
        </Card>

        <Card variant="outlined" margin="large" style={{ borderLeftWidth: 4, borderLeftColor: colors.primary[600] }}>
          <SectionBadge number="2" label="Diagnostic Accuracy" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            AI predictions are probabilistic. Results should be verified with a qualified agronomist for high-impact
            decisions (e.g., large-scale pesticide application).
          </Text>
        </Card>

        <Card variant="outlined" margin="large" style={{ borderLeftWidth: 4, borderLeftColor: colors.primary[600] }}>
          <SectionBadge number="3" label="Acceptable Use" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            You agree not to upload unrelated or abusive imagery, attempt to reverse engineer the service, or misuse
            network resources.
          </Text>
        </Card>

        <Card variant="outlined" margin="large" style={{ borderLeftWidth: 4, borderLeftColor: colors.primary[600] }}>
          <SectionBadge number="4" label="Limitation of Liability" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            Under no circumstances shall {COMPANY_NAME} be liable for indirect or consequential losses arising from
            reliance on automated disease assessments.
          </Text>
        </Card>

        <Card variant="outlined" margin="large" style={{ borderLeftWidth: 4, borderLeftColor: colors.primary[600] }}>
          <SectionBadge number="5" label="Contact" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>
            Questions about these terms may be sent to {SUPPORT_EMAIL}.
          </Text>
        </Card>

        <Text style={[commonStyles.textSm, { color: colors.neutral[400] }, commonStyles.mt8, commonStyles.textCenter]}>
          This summary is not exhaustive. Provide full legal review before production deployment.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
