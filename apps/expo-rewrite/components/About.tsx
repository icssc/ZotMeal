import React, { useCallback, useEffect } from "react";
import { Button, View, Text, StyleSheet, Linking, Image, ScrollView} from "react-native";

/**
 * Styles for the About screen components
 */
const styles = StyleSheet.create({
    container: {
      flexGrow: 1, // Use flexGrow instead of flex for ScrollView content
      padding: 20,
      alignItems: 'center',
    },
    title: {
      alignItems: 'center',
      paddingTop: 60, // Extra padding at top for better visual hierarchy
      paddingBottom: 20,
    },
    title_text: {
      fontSize: 30,
    },
    body: {
        alignItems: 'center',
        paddingVertical: 20,
        gap: 20, // Modern spacing between paragraphs using gap
    },
    body_text: {
        fontSize: 16,
        marginBottom: 10,
    },
    link_text: {
        color: 'blue',
        textDecorationLine: 'underline' // Visual indication of clickable links
    },
    image: {
        width: 300,
        height: 300,
        alignSelf: 'center',
    }
});
  
/**
 * Title component for the About screen
 * Displays the main heading "About ZotMeal"
 */
const Title = () => {
    return (
        <View style={styles.title}>
        <Text style={styles.title_text}>About ZotMeal</Text>
        </View>
    );
};

/**
 * Body component containing the app description, information about the development team,
 * and links to external resources like GitHub and Discord
 */
const Body = () => {
    return (
    <View style={styles.body}>
        <Text style={styles.body_text}>
        ZotMeal is your go-to app for everything dining at {' '}
        <Text 
            style={styles.link_text}
            onPress={() => Linking.openURL('https://uci.edu')}>
            UCI
        </Text>
        ! From up-to-date menus and nutritional information to dining 
        hall events and meal ratings, we make it easy to plan your 
        next meal. Built by students, for students, our goal is to 
        make campus dining more accessible and user-friendly!
        </Text>

        <Text style={styles.body_text}>
        This project is proudly developed and maintained by {' '}
        <Text 
            style={styles.link_text}
            onPress={() => Linking.openURL('https://icssc.club')}>
            ICS Student Council
        </Text>
        . As one of ICSSC's smaller teams, we're a 
        tight-knit group passionate about improving student life 
        through technology.
        </Text>

        <Text style={styles.body_text}>
        Want to contribute? ZotMeal is open-source, and we 
        welcome contributions on our {' '}
        <Text 
            style={styles.link_text}
            onPress={() => Linking.openURL('https://github.com/icssc/ZotMeal')}>
            GitHub
        </Text>
        ! Have questions or ideas? Join the conversation on our {' '}
        <Text 
            style={styles.link_text}
            onPress={() => Linking.openURL('https://discord.com/invite/c4t5dGcM9S')}>
            Discord
        </Text>
        !
        </Text>
    </View>)
}
  
/**
 * About component - Main screen that provides information about the ZotMeal app
 * Includes app description, development team information, and contribution links
 * Uses ScrollView to ensure content is accessible on all screen sizes
 */
export function About() {
    return (
        <ScrollView 
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={true} // Show scrollbar for better UX
        >
            <Title />
            <Image
                source={require('../assets/zotmeal-icon.png')}
                style={styles.image}
                alt="ZotMeal Logo" // Accessibility description
            />
            <Body />
        </ScrollView>
    );
}
