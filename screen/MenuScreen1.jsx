import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import WebView from "react-native-webview";

export default function MenuScreen1({ navigation }) {
    return (
        <View style={styles.webviewContainer}>
            <TouchableOpacity style={styles.menu}
                              onPress={() => navigation.openDrawer()}>
                <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity >
        </View>
    );
}

const styles = StyleSheet.create({
    webviewContainer: {
        flex: 1,
    },
    menu: {
        position: "absolute",
        top: "5%",
        left: "5%",
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: "#94D35C",
        justifyContent: "center",
        alignItems: "center",
    },

    menuText: {
        fontSize: 30
    },
});
