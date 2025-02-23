import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Pressable, TouchableOpacity, Switch } from "react-native";

import SignIn from "../settingsTab/SignIn.tsx";
import { ThemedText } from "../ThemedText.tsx";
import { ThemedView } from "../ThemedView.tsx";
import { IconSymbol } from "../ui/IconSymbol.tsx";

export default function SettingsView() {
  const [mode, setMode] = useState(true);  // true == light mode
  const [notifications, setNotifications] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const toggleMode = () => setMode(previousState => !previousState);
  const toggleNotifications = () => setNotifications(previousState => !previousState);
  const userEmail = "planteater@uci.edu";

  return (
    <View style={{
      flex: 1,
      paddingTop: 60,
      paddingHorizontal: 20,
      backgroundColor: "white"
    }}>
      <ThemedText
        type="default"
        style={{fontSize: 22}}
      >Settings</ThemedText>
      
      <View style={styles.signInSection}>
        {signedIn ? <View style={{alignItems: "center"}}>
          <ThemedText style={{color: '#9e9e9e'}}>Signed In As:</ThemedText>
          <ThemedText style={styles.email}>{userEmail}</ThemedText>
        </View>
        : <SignIn />}
      </View>

      <View style={styles.section}>
        <ThemedText
          style={styles.sectionTitle}
          type="title"
        >Preferences</ThemedText>

        <TouchableOpacity 
          onPress={() => {}}
          style={styles.row}>
          <ThemedText style={styles.rowLabel}>Light / Dark Mode</ThemedText>
          <View style={styles.rowSpacer} />

          <Switch
            trackColor={{false: '#309CFF', true: '#309CFF'}}
            onValueChange={toggleMode}
            value={mode}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => {}}
          style={styles.row}>
          <ThemedText style={styles.rowLabel}>Notifications</ThemedText>
          <View style={styles.rowSpacer} />

          <Switch
            trackColor={{false: '#309CFF', true: '#309CFF'}}
            onValueChange={toggleNotifications}
            value={notifications}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <ThemedText
        style={styles.sectionTitle}
        type="title"
        >About</ThemedText>

        <TouchableOpacity 
          onPress={() => {}}
          style={styles.row}>
          <ThemedText style={styles.rowLabel}>About ZotMeal</ThemedText>
          <View style={styles.rowSpacer} />
          <IconSymbol name="chevron.right" color="black"></IconSymbol>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => {}}
          style={styles.row}>
          <ThemedText style={styles.rowLabel}>Privacy Policy</ThemedText>
          <View style={styles.rowSpacer} />
          <IconSymbol name="chevron.right" color="black"></IconSymbol>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  signInSection: {
    paddingVertical: 40,
  },

  userInfo: {
    alignItems: "center"
  },

  email: {
    color: "#309CFF",
    fontSize: 20
  },

  /** Section */
  section: {
    // paddingHorizontal: 24,
  },
  sectionTitle: {
    // paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#9e9e9e',
    // textTransform: 'uppercase',
    // letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    // fontSize: 17,
    // fontWeight: '400',
    // color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
})