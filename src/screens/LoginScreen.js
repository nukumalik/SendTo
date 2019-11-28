import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { Text, TextInput } from 'react-native'
import { Button } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-community/async-storage'

function LoginScreen(props) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isEmailEmpty, setIsEmailEmpty] = useState(false)
	const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)

	const login = async (email, password) => {
		try {
			if (!email) {
				setIsEmailEmpty(true)
				return
			} else {
				setIsEmailEmpty(false)
			}
			if (!password) {
				setIsPasswordEmpty(true)
				return
			} else {
				setIsPasswordEmpty(false)
			}
			await auth()
				.signInWithEmailAndPassword(email, password)
				.then(async result => {
					await AsyncStorage.setItem('Authorization', result.user.uid)
					props.navigation.navigate('BottomTabNavigator')
					console.log(result.user.uid)
				})
		} catch (e) {
			console.log(e.message)
		}
	}

	return (
		<>
			<LinearGradient
				style={style.wrapper}
				colors={['#35ABFF', '#16E1F5']}>
				<Text style={style.title}>Sign In</Text>
				<TextInput
					style={isEmailEmpty ? style.inputError : style.input}
					placeholder="Email"
					onChangeText={text => setEmail(text)}
				/>
				<TextInput
					style={isPasswordEmpty ? style.inputError : style.input}
					secureTextEntry={true}
					placeholder="Password"
					onChangeText={text => setPassword(text)}
				/>
				<Text
					style={{ paddingTop: 10, paddingBottom: 5, color: '#FFF' }}>
					Don't you have an account?
				</Text>
				<Button
					transparent
					onPress={() => props.navigation.navigate('RegisterScreen')}>
					<Text
						style={{
							padding: 10,
							backgroundColor: '#FFF',
							borderRadius: 50,
							opacity: 0.9,
							color: '#555',
						}}>
						Register now
					</Text>
				</Button>
			</LinearGradient>
			<Button style={style.button} onPress={() => login(email, password)}>
				<Text style={style.buttonText}>Sign In</Text>
			</Button>
		</>
	)
}

const style = {
	wrapper: {
		alignItems: 'center',
		backgroundColor: '#eee',
		flex: 1,
		justifyContent: 'center',
		paddingVertical: 50,
	},
	title: {
		color: '#fff',
		fontSize: 40,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		backgroundColor: '#FFF',
		borderColor: '#FFF',
		borderRadius: 5,
		borderWidth: 2,
		marginBottom: 20,
		opacity: 0.9,
		padding: 10,
		width: '80%',
	},
	inputError: {
		backgroundColor: '#FFF',
		borderColor: '#FF146A',
		borderRadius: 5,
		borderWidth: 2,
		marginBottom: 20,
		opacity: 0.9,
		padding: 10,
		width: '80%',
	},
	button: {
		backgroundColor: '#ffb400',
		borderRadius: 0,
		elevation: 0,
		justifyContent: 'center',
	},
	buttonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
}

export default LoginScreen
