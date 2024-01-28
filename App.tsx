/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Community from './src/navigations/bottomTab/commuityStack/Community';
import Setting from './src/navigations/bottomTab/settingStack/Setting';
import HomeTabStack from './src/navigations/bottomTab/homeTabStack';
import { NativeBaseProvider } from 'native-base';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
    const Stack = createNativeStackNavigator();

    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="홈" component={HomeTabStack} />
                    <Stack.Screen name="커뮤니티" component={Community} />
                    <Stack.Screen name="마이페이지" component={Setting} />
                </Tab.Navigator>
            </NavigationContainer>
        </NativeBaseProvider>
    );
}

export default App;
