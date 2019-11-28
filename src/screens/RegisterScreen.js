import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import firstore from '@react-native-firebase/firestore'
import { View, Text, TextInput } from 'react-native'
import { Button } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore'

function RegisterScreen(props) {
	const [name, setName] = useState('')
	const [username, setUsername] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isNameEmpty, setIsNameEmpty] = useState(false)
	const [isUsernameEmpty, setIsUsernameEmpty] = useState(false)
	const [isPhoneEmpty, setIsPhoneEmpty] = useState(false)
	const [isEmailEmpty, setIsEmailEmpty] = useState(false)
	const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)

	const register = async (email, password) => {
		try {
			if (!name) {
				setIsNameEmpty(true)
				return
			} else {
				setIsNameEmpty(false)
			}
			if (!username) {
				setIsUsernameEmpty(true)
				return
			} else {
				setIsUsernameEmpty(false)
			}
			if (!phone) {
				setIsPhoneEmpty(true)
				return
			} else {
				setIsPhoneEmpty(false)
			}
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
				.createUserWithEmailAndPassword(email, password)
				.then(async result => {
					console.log(result)
					await firestore()
						.collection('users')
						.doc(result.user.uid)
						.set({
							id: result.user.uid,
							name,
							username,
							phone,
							email,
							password,
							avatar: '',
						})
					await firestore()
						.collection('messages')
						.doc(result.user.uid)
						.set({})
					await firestore()
						.collection('friends')
						.doc(result.user.uid)
						.set({})
					await AsyncStorage.setItem('Authorization', result.user.uid)
					props.navigation.navigate('BottomTabNavigator')
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
				<Text style={style.title}>Register</Text>
				<TextInput
					style={isNameEmpty ? style.inputError : style.input}
					placeholder="Name"
					onChangeText={text => setName(text)}
				/>
				<TextInput
					style={isUsernameEmpty ? style.inputError : style.input}
					placeholder="Username"
					onChangeText={text => setUsername(text)}
				/>
				<TextInput
					style={isPhoneEmpty ? style.inputError : style.input}
					placeholder="Phone"
					onChangeText={text => setPhone(text)}
				/>
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
					Do you have an account?
				</Text>
				<Button
					transparent
					onPress={() => props.navigation.navigate('LoginScreen')}>
					<Text
						style={{
							padding: 10,
							backgroundColor: '#FFF',
							borderRadius: 50,
							opacity: 0.9,
							color: '#555',
						}}>
						Please Sign In
					</Text>
				</Button>
			</LinearGradient>
			<Button
				style={style.button}
				onPress={() => register(email, password)}>
				<Text style={style.buttonText}>Register</Text>
			</Button>
		</>
	)
}

const style = {
	wrapper: {
		backgroundColor: '#eee',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 50,
	},
	title: {
		fontSize: 40,
		marginBottom: 20,
		fontWeight: 'bold',
		color: '#fff',
	},
	input: {
		backgroundColor: '#FFF',
		opacity: 0.9,
		borderColor: '#FFF',
		borderRadius: 5,
		borderWidth: 2,
		marginBottom: 20,
		padding: 10,
		width: '80%',
	},
	inputError: {
		backgroundColor: '#FFF',
		opacity: 0.9,
		borderColor: '#FF146A',
		borderRadius: 5,
		borderWidth: 2,
		marginBottom: 20,
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

export default RegisterScreen
