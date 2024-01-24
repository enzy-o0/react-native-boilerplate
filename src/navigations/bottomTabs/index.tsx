import React from 'react';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import Community from './Community';
import Setting from './Setting';

// const Tab = createBottomTabNavigator();

export const BottomTab = () => {
    return (
        <div>BottomTab</div>
        // <Tab.Navigator
        //   initialRouteName="HomeTab"
        //   screenOptions={{
        //     headerShown: false,
        //     tabBarLabelStyle: {
        //       fontSize: 14,
        //     },
        //     tabBarStyle: {
        //       height: 60,
        //       paddingTop: 5,
        //       paddingBottom: 5,
        //     },
        //     tabBarHideOnKeyboard: true,
        //   }}>
        //   <Tab.Screen
        //     name="HomeTab"
        //     component={Home}
        //     options={{
        //       tabBarLabel: '홈',
        //     }}
        //   />
        //   <Tab.Screen
        //     name="CommunityTab"
        //     component={Community}
        //     options={{
        //       tabBarLabel: '커뮤니티',
        //     }}
        //   />
        //   <Tab.Screen
        //     name="SettingTab"
        //     component={Setting}
        //     options={{
        //       tabBarLabel: '설정',
        //     }}
        //   />
        // </Tab.Navigator>
    );
};
