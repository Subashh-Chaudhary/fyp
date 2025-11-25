import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { colors } from '../styles';

export const AnimatedSplashScreen = () => {
    // Animation values
    const floatAnim = useRef(new Animated.Value(0)).current;
    const scanAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current; // Keep for text fade-in

    useEffect(() => {
        // 1. Fade in text only (logo is already visible)
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // 2. Floating animation (up and down loop)
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -15,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // 3. Scanning animation (line moving top to bottom)
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.delay(500), // Pause briefly between scans
            ])
        ).start();
    }, []);

    // Interpolate scan animation to move the line vertically
    const scanTranslateY = scanAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 100], // Adjusted for larger logo
    });

    // Interpolate scan opacity to fade out at ends
    const scanOpacity = scanAnim.interpolate({
        inputRange: [0, 0.1, 0.9, 1],
        outputRange: [0, 1, 1, 0],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        transform: [{ translateY: floatAnim }],
                    },
                ]}
            >
                {/* Logo */}
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Scanning Line */}
                <Animated.View
                    style={[
                        styles.scanLine,
                        {
                            transform: [{ translateY: scanTranslateY }],
                            opacity: scanOpacity,
                        },
                    ]}
                />
            </Animated.View>

            {/* App Name */}
            <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
                Crop Disease Detection System
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 250,
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 40, // Space between logo and text
    },
    logo: {
        width: 200,
        height: 200,
    },
    scanLine: {
        position: 'absolute',
        width: '100%',
        height: 3,
        backgroundColor: colors.primary[500],
        shadowColor: colors.primary[500],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.neutral[800],
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
