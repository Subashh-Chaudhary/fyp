import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Card } from "../../components/ui/Card"
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "../../constants"
import { colors, commonStyles } from "../../styles"

const SectionHeader = ({ icon, label }: { icon: string; label: string }) => (
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

export default function HelpScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: colors.neutral[50] }]}>
      <ScrollView contentContainerStyle={[commonStyles.p6]}>
        <View style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: colors.neutral[900] }, commonStyles.mb2]}>
            Help & Support
          </Text>
          <Text style={[commonStyles.textBase, { color: colors.neutral[600] }]}>
            Get answers and troubleshoot issues
          </Text>
        </View>

        <Card
          variant="outlined"
          margin="large"
          style={{ borderColor: colors.primary[200], backgroundColor: colors.primary[50] }}
        >
          <SectionHeader icon="📱" label="Getting a Good Scan" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            Photograph a single leaf against a neutral background. Avoid harsh shadows. Center the leaf and keep the
            camera steady. Natural diffuse light works best.
          </Text>
        </Card>

        <Card
          variant="outlined"
          margin="large"
          style={{ borderColor: colors.primary[200], backgroundColor: colors.primary[50] }}
        >
          <SectionHeader icon="🔧" label="Common Issues" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            Blurry image: hold still for 1–2 seconds. Upload failure: check network connectivity. Wrong diagnosis:
            retake with clearer focus and ensure leaf fills most of the frame.
          </Text>
        </Card>

        <Card
          variant="outlined"
          margin="large"
          style={{ borderColor: colors.primary[200], backgroundColor: colors.primary[50] }}
        >
          <SectionHeader icon="✅" label="Recommended Actions" />
          <Text style={[commonStyles.textBase, { color: colors.neutral[700], lineHeight: 22 }]}>
            If severity is high or critical, isolate affected plants and consult a local agronomist. Follow integrated
            pest management guidelines whenever applying treatments.
          </Text>
        </Card>

        <Card
          variant="outlined"
          margin="large"
          style={{ borderColor: colors.primary[200], backgroundColor: colors.primary[50] }}
        >
          <SectionHeader icon="📞" label="Contact Support" />
          <View style={{ gap: 12 }}>
            <View>
              <Text style={[commonStyles.textSm, { color: colors.neutral[600], marginBottom: 4 }]}>Email:</Text>
              <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.primary[700] }]}>
                {SUPPORT_EMAIL}
              </Text>
            </View>
            <View>
              <Text style={[commonStyles.textSm, { color: colors.neutral[600], marginBottom: 4 }]}>Phone:</Text>
              <Text style={[commonStyles.textBase, commonStyles.fontSemibold, { color: colors.primary[700] }]}>
                {SUPPORT_PHONE}
              </Text>
            </View>
          </View>
        </Card>

        <Text style={[commonStyles.textSm, { color: colors.neutral[400] }, commonStyles.mt8, commonStyles.textCenter]}>
          Always cross-check treatment decisions with local agricultural guidelines.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
