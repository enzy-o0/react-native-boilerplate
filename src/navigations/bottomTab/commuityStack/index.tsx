import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Community from './Community';

const Stack = createNativeStackNavigator();

const HomeTabStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Community" component={Community} />
        </Stack.Navigator>
    );
};

export default HomeTabStack;
