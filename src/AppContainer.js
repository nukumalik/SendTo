import React, { useState, useEffect } from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Screens
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import AuthEmailConfirmScreen from './screens/AuthEmailConfirmScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ChatListScreen from './screens/ChatListScreen'
import ChatRoomScreen from './screens/ChatRoomScreen'
import ProfileScreen from './screens/ProfileScreen'
import EditProfileScreen from './screens/EditProfileScreen'
import UserList from './screens/UserList'
import UserProfileScreen from './screens/UserProfileScreen'
import MapScreen from './screens/MapScreen'

const AuthStack = createStackNavigator(
	{
		LoginScreen,
		RegisterScreen,
	},
	{
		defaultNavigationOptions: {
			header: null,
		},
	},
)

const UserStack = createStackNavigator(
	{
		UserList,
		UserProfileScreen,
	},
	{
		defaultNavigationOptions: {
			header: null,
		},
	},
)

const ChatStack = createStackNavigator(
	{
		ChatListScreen,
		ChatRoomScreen,
		MapScreen,
	},
	{
		defaultNavigationOptions: {
			header: null,
		},
	},
)

ChatStack.navigationOptions = ({ navigation }) => {
	let tabBarVisible = true
	if (navigation.state.index > 0) {
		tabBarVisible = false
	}

	return { tabBarVisible }
}

const ProfileStack = createStackNavigator(
	{
		ProfileScreen,
		EditProfileScreen,
	},
	{
		defaultNavigationOptions: {
			header: null,
		},
	},
)

ProfileStack.navigationOptions = ({ navigation }) => {
	let tabBarVisible = true
	if (navigation.state.index > 0) {
		tabBarVisible = false
	}

	return { tabBarVisible }
}

const BottomTabNavigator = createBottomTabNavigator(
	{
		Chat: ChatStack,
		User: UserStack,
		Profile: ProfileStack,
	},
	{
		initialRouteName: 'Chat',
		defaultNavigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, horizontal, tintColor }) => {
				const { routeName } = navigation.state
				let iconName
				if (routeName === 'Chat') {
					iconName = 'message-text'
				} else if (routeName === 'User') {
					iconName = 'account-plus'
					// } else if (routeName === 'Around') {
					// 	iconName = 'map-marker-radius'
					// } else if (routeName === 'Photo') {
					// 	iconName = 'account-group'
				} else {
					iconName = 'account-circle'
				}
				return <Icon name={iconName} size={30} color={tintColor} />
			},
		}),

		tabBarOptions: {
			tabStyle: {
				borderTopWidth: 0,
				borderTopColor: '#000',
			},
			style: {
				elevation: 10,
			},
			showLabel: false,
			activeBackgroundColor: '#35ABFF',
			activeTintColor: '#FFF', //#f7c847
			inactiveBackgroundColor: '#35ABFF',
			inactiveTintColor: '#eee',
			keyboardHidesTabBar: false,
		},
	},
)

const AppContainer = createAppContainer(
	createSwitchNavigator(
		{
			AuthLoadingScreen,
			AuthEmailConfirmScreen,
			BottomTabNavigator,
			AuthStack,
		},
		{
			initialRouteName: 'AuthLoadingScreen',
		},
	),
)

export default AppContainer
