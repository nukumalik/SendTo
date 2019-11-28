import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Text, View, ScrollView, TextInput } from 'react-native'
import { Button, Header, Left, Body, Right } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const EditProfileScreen = props => {
	const [userId, setUserId] = useState()
	const [name, setName] = useState()
	const [username, setUsername] = useState()
	const [phone, setPhone] = useState()
	const [email, setEmail] = useState()
	const [avatar, setAvatar] = useState()

	const getData = async () => {
		await auth().onAuthStateChanged(async user => {
			setUserId(user.uid)
			const documentSnapshot = await firestore()
				.collection('users')
				.doc(user.uid)
				.get()

			const data = documentSnapshot.data()
			setName(data.name)
			setUsername(data.username)
			setPhone(data.phone)
			setEmail(data.email)
			setAvatar(data.avatar)
		})
	}

	const update = async () => {
		await firestore()
			.collection('users')
			.doc(userId)
			.update({ name, username, phone, email, avatar })
		props.navigation.navigate('ProfileScreen')
	}

	useEffect(() => {
		getData()
	}, [])

	return (
		<>
			<ScrollView style={{ backgroundColor: '#e8f5ff' }}>
				<Header style={style.header}>
					<Left>
						<Button
							transparent
							onPress={() =>
								props.navigation.navigate('ProfileScreen')
							}>
							<Icon
								name="arrow-left-thick"
								size={25}
								color="#FFF"
							/>
						</Button>
					</Left>
					<Body>
						<Text style={style.headerTitle}>Edit Profile</Text>
					</Body>
					<Right></Right>
				</Header>
				<View style={style.wrapper}>
					<TextInput
						style={style.input}
						defaultValue={name}
						onChangeText={text => setName(text || name)}
						placeholder="Name"
					/>
					<TextInput
						style={style.input}
						defaultValue={username}
						onChangeText={text => setUsername(text || username)}
						placeholder="Username"
					/>
					<TextInput
						style={style.input}
						defaultValue={phone}
						onChangeText={text => setPhone(text || phone)}
						placeholder="Phone"
					/>
					<TextInput
						style={style.input}
						defaultValue={email}
						onChangeText={text => setEmail(text || email)}
						placeholder="Email"
					/>
					<TextInput
						style={style.input}
						defaultValue={avatar}
						onChangeText={text => setAvatar(text || avatar)}
						placeholder="Avatar URL"
					/>
					<Button style={style.button} onPress={() => update()}>
						<Text style={style.buttonText}>Update</Text>
					</Button>
				</View>
			</ScrollView>
		</>
	)
}

const style = {
	header: {
		backgroundColor: '#35ABFF',
	},
	headerTitle: {
		color: '#FFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	wrapper: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		paddingTop: 40,
	},
	input: {
		backgroundColor: '#FFF',
		borderColor: '#FFF',
		borderRadius: 5,
		borderWidth: 1,
		marginBottom: 20,
		opacity: 0.9,
		padding: 10,
		width: '80%',
	},
	button: {
		backgroundColor: '#222629',
		borderRadius: 4,
		elevation: 0,
		justifyContent: 'center',
		padding: 10,
		width: '80%',
	},
	buttonText: {
		color: '#FFF',
		fontWeight: 'bold',
	},
}

export default EditProfileScreen
