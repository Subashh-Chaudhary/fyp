import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Card } from "../../components/ui/Card"
import { DATA_RETENTION_DAYS, SUPPORT_EMAIL } from "../../constants"
import { colors, commonStyles } from "../../styles"

const SectionBadge = ({ icon, label }: { icon: string; label: string }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 }}>
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.primary[100],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 16 }}>{icon}</Text>
    </View>
    <Text style={[commonStyles.textLg, commonStyles.fontSemibold, { color: colors.neutral[900] }]}>{label}</Text>
  </View>
)

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: colors.neutral[50] }]}>
      <ScrollView contentContainerStyle={[commonStyles.p6]}>
        <View style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.neutral[900] }, commonStyles.mb2]}>
            Privacy Policy
          </Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[600] }]}>
            How we collect, use, and protect your data
          </Text>
        </View>

        <Card
          variant="outlined"
          margin="large"
          style={{ borderColor: colors.primary[200], backgroundColor: colors.primary[50] }}
        >
          <SectionBadge icon="📸" label="Data We Process" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            Uploaded plant images, basic device metadata (model, OS version), and non-identifying usage analytics. We do
            not sell personal data.
          </Text>
        </Card>

        <Card
          variant="outlined"
          margin="large"
          style={{ borderColor: colors.primary[200], backgroundColor: colors.primary[50] }}
        >
          <SectionBadge icon="⚙️" label="How We Use Data" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            To analyze leaf images for diseases, improve detection models, and maintain service reliability. Where
            required, we obtain consent before using images for model improvement.
          </Text>
        </Card>

        <Card
          variant="outlined"
          margin="large"
          style={{ borderColor: colors.primary[200], backgroundColor: colors.primary[50] }}
        >
          <SectionBadge icon="⏱️" label="Retention & Deletion" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            Images are retained for up to {DATA_RETENTION_DAYS} days unless you request earlier deletion. You can
            request deletion at any time via the app or by contacting support.
          </Text>
        </Card>

        <Card
          variant="outlined"
          margin="large"
          style={{ borderColor: colors.primary[200], backgroundColor: colors.primary[50] }}
        >
          <SectionBadge icon="🛡️" label="Your Rights" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            Access, rectify, or delete your data, and withdraw consent where applicable. We will respond to verified
            requests within a reasonable timeframe.
          </Text>
        </Card>

        <Card
          variant="outlined"
          margin="large"
          style={{ borderColor: colors.primary[200], backgroundColor: colors.primary[50] }}
        >
          <SectionBadge icon="💬" label="Contact" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700] }]}>
            Questions or requests: {SUPPORT_EMAIL}
          </Text>
        </Card>

        <Text style={[commonStyles.textSm, { color: colors.neutral[400] }, commonStyles.mt8, commonStyles.textCenter]}>
          This summary is for demonstration. Replace with a full, jurisdiction-specific policy before production.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
