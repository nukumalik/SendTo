import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'native-base'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'

const AuthEmailConfirmScreen = props => {
	const [timer, setTimer] = useState(30)
	const [sendClick, setSendClick] = useState(false)

	const confirmed = async () => {
		await auth().onAuthStateChanged(async result => {
			if (result.emailVerified) {
				await AsyncStorage.setItem('Authorization', result.uid)
				props.navigation.navigate('BottomTabNavigator')
			}
			console.log(result)
		})
	}

	const sendEmailConfirm = () => {
		auth().onAuthStateChanged(result => {
			setSendClick(true)
			result.sendEmailVerification()
			setTimeout(() => {
				setSendClick(false)
				setTimer(30)
			}, 30000)
		})
	}

	return (
		<>
			<LinearGradient
				style={style.wrapper}
				colors={['#35ABFF', '#16E1F5']}>
				<Text style={style.text}>Please confirm your email first</Text>
				{sendClick && (
					<Text style={{ color: '#FFF' }}>
						Wait {timer} seconds to resend
					</Text>
				)}
				{!sendClick && (
					<Button
						style={{
							padding: 20,
							backgroundColor: '#FFF',
							borderRadius: 50,
							elevation: 0,
						}}
						onPress={() => sendEmailConfirm()}>
						<Text>Send me email confirm</Text>
					</Button>
				)}
			</LinearGradient>
			<Button style={style.button} onPress={() => confirmed()}>
				<Text style={style.buttonText}>
					I have been confirm the email
				</Text>
			</Button>
		</>
	)
}

const style = {
	wrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		padding: 20,
		backgroundColor: '#ffb400',
		justifyContent: 'center',
	},
	buttonText: {
		color: '#FFF',
	},
	text: {
		color: '#FFF',
		fontSize: 18,
		fontWeight: 'bold',
		paddingBottom: 20,
	},
}

export default AuthEmailConfirmScreen
