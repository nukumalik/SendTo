import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {
	Text,
	View,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from 'react-native'
import { Button, Header, Left, Body, Right, Thumbnail } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ImagePicker from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import Blob from 'react-native-fetch-blob'

const EditProfileScreen = props => {
	const [userId, setUserId] = useState()
	const [name, setName] = useState()
	const [username, setUsername] = useState()
	const [phone, setPhone] = useState()
	const [email, setEmail] = useState()
	const [avatar, setAvatar] = useState()
	const [photoData, setPhotoData] = useState()
	const [photoType, setPhotoType] = useState()
	const [photoFileName, setPhotoFileName] = useState()
	const [photoFilePath, setPhotoFilePath] = useState()

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
			.update({
				name,
				username,
				phone,
				email,
				avatar:
					'https://firebasestorage.googleapis.com/v0/b/sendto-6b33a.appspot.com/o/avatar%2F' +
					username +
					(photoType == 'image/jpeg' ? '.jpeg' : '.png') +
					'?alt=media&token=83fd1d8d-7dfd-4179-96a0-5dc39f6cdda4',
			})
		props.navigation.navigate('ProfileScreen')
		await storage()
			.refFromURL('gs://sendto-6b33a.appspot.com')
			.child(
				'avatar/' +
					username +
					(photoType == 'image/jpeg' ? '.jpeg' : '.png'),
			)
			.putString(photoData, 'base64', { contentType: photoType })
	}

	const chooseFile = () => {
		ImagePicker.showImagePicker(
			{
				title: 'Select Image',
				cameraType: 'front',
				storageOptions: {
					skipBackup: true,
					path: 'images',
				},
			},
			response => {
				if (response.didCancel) {
					console.log('User cancelled image picker')
				} else if (response.error) {
					console.log('ImagePicker Error: ', response.error)
				} else {
					const source = response
					setPhotoData(source.data)
					setPhotoFileName(source.fileName)
					setPhotoFilePath(source.uri)
					setPhotoType(source.type)
					setAvatar(source.uri)
				}
			},
		)
	}

	useEffect(() => {
		getData()
	}, [])

	// if (photoData && photoFileName && photoFilePath) {
	// 	// console.log(photoData)
	// 	console.log(photoFileName)
	// 	console.log(photoFilePath)
	// 	console.log(photoType)
	// }

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
					<TouchableOpacity onPress={() => chooseFile()}>
						<Thumbnail
							source={{
								uri: avatar
									? avatar
									: 'https://community.smartsheet.com/sites/default/files/default_user.jpg',
							}}
							style={style.thumbnail}
						/>
					</TouchableOpacity>
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
	thumbnail: {
		borderRadius: 125,
		height: 125,
		marginBottom: 25,
		width: 125,
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
