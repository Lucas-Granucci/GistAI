import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking } from "react-native";
import { Stack } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']} // Modern indigo to purple gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.menubar}
      >
        <Text style={styles.logo}>GistAI</Text>
        <View style={styles.linksContainer}>
          <TouchableOpacity 
            style={styles.menuLink} 
            onPress={() => openLink('https://github.com')}
          >
            <Text style={styles.menuLinkText}>GitHub</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuLink} 
            onPress={() => openLink('https://www.linkedin.com')}
          >
            <Text style={styles.menuLinkText}>LinkedIn</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
      </Stack>
    </View>
  );
}

function openLink(url: string) {
  Linking.openURL(url);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menubar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLink: {
    marginLeft: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuLinkText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.9,
  },
  main: {
    flex: 1,
  },
});