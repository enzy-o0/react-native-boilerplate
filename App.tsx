/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import BottomTab from './src/BottomTab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const Stack = createNativeStackNavigator();

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={BottomTab} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
