import React, { useEffect } from 'react'
import { ActivityIndicator, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'

const AuthLoadingScreen = props => {
	const isLogin = async () => {
		try {
			const token = await AsyncStorage.getItem('Authorization')

			props.navigation.navigate(
				token ? 'BottomTabNavigator' : 'AuthStack',
			)
		} catch (e) {
			console.log(e.message)
		}
	}

	useEffect(() => {
		isLogin()
	}, [])

	return (
		<LinearGradient style={style.wrapper} colors={['#35ABFF', '#16E1F5']}>
			<ActivityIndicator size="large" color="#eee" />
			<StatusBar barStyle="default" />
		</LinearGradient>
	)
}

const style = {
	wrapper: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
}

export default AuthLoadingScreen
