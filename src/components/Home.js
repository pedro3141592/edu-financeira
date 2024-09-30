// BoasVindas.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Graphics from './Graphics';
export default function Home() {
    return (
        <View style={styles.container}>
            <Graphics/>
         </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginHorizontal:10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,

    },
    text: {
        fontSize: 24,
        marginBottom: 4,
    },
    text2:{
        fontSize: 16,
        marginBottom: 4,
    },
});
