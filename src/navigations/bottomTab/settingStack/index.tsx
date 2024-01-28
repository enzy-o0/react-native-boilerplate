import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Setting from './Setting';

const Stack = createNativeStackNavigator();

const HomeTabStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Setting" component={Setting} />
        </Stack.Navigator>
    );
};

export default HomeTabStack;
