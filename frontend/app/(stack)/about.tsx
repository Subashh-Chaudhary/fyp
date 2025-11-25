import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Collapsible } from "../../components/Collapsible"
import { Card } from "../../components/ui/Card"
import { Divider } from "../../components/ui/Divider"
import { APP_NAME, APP_TAGLINE, APP_VERSION, COMPANY_LOCATION, COMPANY_NAME, COPYRIGHT_NOTICE } from "../../constants"
import { colors, commonStyles } from "../../styles"

const ACCURACY = "99.83%"
const DISEASE_COUNT = 38
const CROP_COUNT = 14

const SUPPORTED_CROPS = [
  { crop: "Apple", count: 4 },
  { crop: "Blueberry", count: 1 },
  { crop: "Cherry", count: 2 },
  { crop: "Corn (Maize)", count: 4 },
  { crop: "Grape", count: 4 },
  { crop: "Orange", count: 1 },
  { crop: "Peach", count: 2 },
  { crop: "Pepper (Bell)", count: 2 },
  { crop: "Potato", count: 3 },
  { crop: "Raspberry", count: 1 },
  { crop: "Soybean", count: 1 },
  { crop: "Squash", count: 1 },
  { crop: "Strawberry", count: 2 },
  { crop: "Tomato", count: 10 },
]

const ALL_CLASSES = [
  "Apple___Apple_scab",
  "Apple___Black_rot",
  "Apple___Cedar_apple_rust",
  "Apple___healthy",
  "Blueberry___healthy",
  "Cherry_(including_sour)___Powdery_mildew",
  "Cherry_(including_sour)___healthy",
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
  "Corn_(maize)___Common_rust_",
  "Corn_(maize)___Northern_Leaf_Blight",
  "Corn_(maize)___healthy",
  "Grape___Black_rot",
  "Grape___Esca_(Black_Measles)",
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
  "Grape___healthy",
  "Orange___Haunglongbing_(Citrus_greening)",
  "Peach___Bacterial_spot",
  "Peach___healthy",
  "Pepper,_bell___Bacterial_spot",
  "Pepper,_bell___healthy",
  "Potato___Early_blight",
  "Potato___Late_blight",
  "Potato___healthy",
  "Raspberry___healthy",
  "Soybean___healthy",
  "Squash___Powdery_mildew",
  "Strawberry___Leaf_scorch",
  "Strawberry___healthy",
  "Tomato___Bacterial_spot",
  "Tomato___Early_blight",
  "Tomato___Late_blight",
  "Tomato___Leaf_Mold",
  "Tomato___Septoria_leaf_spot",
  "Tomato___Spider_mites Two-spotted_spider_mite",
  "Tomato___Target_Spot",
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
  "Tomato___Tomato_mosaic_virus",
  "Tomato___healthy",
]

const StatBadge = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View
    style={[
      {
        flex: 1,
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[200],
      },
    ]}
  >
    <Ionicons name={icon as any} size={28} color={colors.primary[600]} style={{ marginBottom: 8 }} />
    <Text style={[commonStyles.textSm, { color: colors.neutral[600], marginBottom: 4 }]}>{label}</Text>
    <Text style={[commonStyles.fontBold, { fontSize: 18, color: colors.primary[700] }]}>{value}</Text>
  </View>
)

const FeatureItem = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <View style={[commonStyles.flexRow, commonStyles.itemsStart, { gap: 12 }]}>
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: colors.primary[100],
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
      }}
    >
      <Ionicons name={icon as any} size={20} color={colors.primary[600]} />
    </View>
    <View style={[commonStyles.flex1]}>
      <Text style={[commonStyles.fontSemibold, { color: colors.neutral[800], marginBottom: 4 }]}>{title}</Text>
      <Text style={[commonStyles.textSm, { color: colors.neutral[600], lineHeight: 20 }]}>{description}</Text>
    </View>
  </View>
)

export default function AboutScreen() {
  return (
    <SafeAreaView style={[commonStyles.flex1, { backgroundColor: "#f8fafb" }]}>
      <ScrollView contentContainerStyle={[commonStyles.p6]}>
        <View
          style={{
            borderRadius: 20,
            backgroundColor: colors.primary[600],
            padding: 24,
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          {/* Background accent */}
          <View
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: colors.primary[500],
              opacity: 0.3,
            }}
          />

          <View
            style={[
              commonStyles.flexRow,
              commonStyles.itemsCenter,
              commonStyles.justifyBetween,
              { position: "relative", zIndex: 1 },
            ]}
          >
            <View>
              <Text style={[commonStyles.text2xl, commonStyles.fontBold, { color: "white", marginBottom: 4 }]}>
                {APP_NAME}
              </Text>
              <Text style={[commonStyles.textBase, { color: colors.primary[100], marginBottom: 12 }]}>
                v{APP_VERSION}
              </Text>
              <Text style={[commonStyles.textSm, { color: colors.primary[50], maxWidth: 220, lineHeight: 20 }]}>
                {APP_TAGLINE}
              </Text>
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.primary[50],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="leaf" size={40} color={colors.primary[600]} />
              </View>
            </View>
          </View>
        </View>

        <View style={[commonStyles.flexRow, { gap: 12, marginBottom: 24 }]}>
          <StatBadge icon="checkmark-circle" label="Accuracy" value={ACCURACY} />
          <StatBadge icon="leaf" label="Crops" value={CROP_COUNT.toString()} />
          <StatBadge icon="bug" label="Diseases" value={DISEASE_COUNT.toString()} />
        </View>

        <Card variant="elevated" margin="large">
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { gap: 8, marginBottom: 16 }]}>
            <Ionicons name="sparkles" size={24} color={colors.primary[600]} />
            <Text style={[commonStyles.textLg, commonStyles.fontBold, { color: colors.neutral[900] }]}>
              Key Features
            </Text>
          </View>
          <View style={{ gap: 12 }}>
            <FeatureItem
              icon="bullseye"
              title="Industry-Leading Accuracy"
              description={`${ACCURACY} validation accuracy with deep learning`}
            />
            <FeatureItem
              icon="globe"
              title="Comprehensive Coverage"
              description={`${DISEASE_COUNT} disease classes across ${CROP_COUNT} supported crops`}
            />
            <FeatureItem
              icon="lightning"
              title="Fast Processing"
              description="~50ms on GPU, ~150ms on CPU for real-time detection"
            />
            <FeatureItem
              icon="server"
              title="Production Ready"
              description="Enterprise-grade FastAPI REST endpoint with scaling"
            />
            <FeatureItem
              icon="phone-portrait"
              title="Accessible Training"
              description="Trains on consumer 4GB GPUs (e.g. GTX 1650 Ti)"
            />
            <FeatureItem
              icon="git-network"
              title="Advanced Architecture"
              description="EfficientNet transfer learning with two-stage training"
            />
          </View>
        </Card>

        <Card variant="outlined" margin="large">
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { gap: 8, marginBottom: 16 }]}>
            <Ionicons name="layers" size={24} color={colors.primary[600]} />
            <Text style={[commonStyles.textLg, commonStyles.fontBold, { color: colors.neutral[800] }]}>
              Supported Crops
            </Text>
          </View>
          <Text style={[commonStyles.textSm, { color: colors.neutral[500], marginBottom: 16 }]}>
            Detection available for {CROP_COUNT} crop types with multiple disease variants each
          </Text>

          <View style={{ gap: 8 }}>
            {SUPPORTED_CROPS.map((c) => (
              <View
                key={c.crop}
                style={[
                  commonStyles.flexRow,
                  commonStyles.itemsCenter,
                  commonStyles.justifyBetween,
                  {
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor: colors.neutral[50],
                    borderLeftWidth: 3,
                    borderLeftColor: colors.primary[400],
                  },
                ]}
              >
                <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { gap: 10 }]}>
                  <Ionicons name="leaf" size={16} color={colors.primary[500]} />
                  <Text style={[commonStyles.textBase, { color: colors.neutral[800] }]}>{c.crop}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.primary[100],
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                    minWidth: 36,
                    alignItems: "center",
                  }}
                >
                  <Text style={[commonStyles.textSm, commonStyles.fontBold, { color: colors.primary[700] }]}>
                    {c.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Collapsible title={`View all ${ALL_CLASSES.length} disease classes (tap to expand)`} >
            <View style={{ gap: 0, marginTop: 12 }}>
              {ALL_CLASSES.map((cls, idx) => (
                <React.Fragment key={cls}>
                  <View style={{ paddingVertical: 10 }}>
                    <Text style={[commonStyles.textSm, { color: colors.neutral[200] }]}>
                      {cls.replace(/___/g, " — ")}
                    </Text>
                  </View>
                  {idx < ALL_CLASSES.length - 1 && <Divider style={{ marginVertical: 4 }} />}
                </React.Fragment>
              ))}
            </View>
          </Collapsible>
        </Card>

        <Card variant="outlined" margin="large">
          <View style={[commonStyles.flexRow, commonStyles.itemsCenter, { gap: 8, marginBottom: 16 }]}>
            <Ionicons name="telescope" size={24} color={colors.primary[600]} />
            <Text style={[commonStyles.textLg, commonStyles.fontBold, { color: colors.neutral[800] }]}>
              Planned Enhancements
            </Text>
          </View>
          {[
            { title: "Expand Coverage", desc: "100+ disease classes (rice, wheat, cotton, etc.)" },
            { title: "Severity Detection", desc: "Early, moderate, and severe level detection" },
            { title: "Multi-Disease Mode", desc: "Simultaneous detection of multiple diseases per image" },
            { title: "Smart Recommendations", desc: "Location-aware treatment suggestions" },
            { title: "Mobile Deployment", desc: "iOS & Android native apps with real-time video" },
            { title: "Advanced Research", desc: "ViT/Swin experiments, ensembles, uncertainty estimation" },
          ].map((item) => (
            <View
              key={item.title}
              style={[commonStyles.flexRow, commonStyles.itemsStart, { gap: 10, marginBottom: 12 }]}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: colors.primary[100],
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                <Ionicons name="add" size={14} color={colors.primary[600]} />
              </View>
              <View style={[commonStyles.flex1]}>
                <Text style={[commonStyles.fontSemibold, { color: colors.neutral[800], marginBottom: 2 }]}>
                  {item.title}
                </Text>
                <Text style={[commonStyles.textSm, { color: colors.neutral[600] }]}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={[commonStyles.itemsCenter, { marginTop: 32, marginBottom: 12, paddingHorizontal: 12 }]}>
          <Text
            style={[commonStyles.textSm, commonStyles.fontSemibold, { color: colors.neutral[600], marginBottom: 4 }]}
          >
            {COMPANY_NAME}
          </Text>
          <Text style={[commonStyles.textSm, { color: colors.neutral[400] }]}>{COMPANY_LOCATION}</Text>
          <Text style={[commonStyles.textXs, { color: colors.neutral[400], marginTop: 12, textAlign: "center" }]}>
            {COPYRIGHT_NOTICE}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
