import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { NavigationEvents } from 'react-navigation'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import {
	Body,
	Button,
	Header,
	Left,
	List,
	ListItem,
	Right,
	Thumbnail,
} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ProfileScreen = props => {
	const [data, setData] = useState({})

	const logout = async () => {
		await AsyncStorage.removeItem('Authorization')
		props.navigation.navigate('AuthLoadingScreen')
	}

	const getData = async () => {
		const uid = await auth().currentUser.uid
		const documentSnapshot = await firestore()
			.collection('users')
			.doc(uid)
			.get()
		const data = documentSnapshot.data()
		setData(data)
	}

	const refresh = () => {}

	useEffect(() => {
		getData()
	}, [])

	return (
		<>
			<Header style={style.header}>
				<Left>
					<Text style={style.headerTitle}>Profile</Text>
				</Left>
				<Body></Body>
				<Right>
					<Button
						transparent
						onPress={() =>
							props.navigation.navigate('EditProfileScreen')
						}>
						<Icon name="pencil" size={25} color="#35ABFF" />
					</Button>
				</Right>
			</Header>
			<ScrollView style={{ backgroundColor: '#fff' }}>
				<View style={style.wrapper}>
					<Thumbnail
						source={{
							uri: data.avatar
								? data.avatar
								: 'https://community.smartsheet.com/sites/default/files/default_user.jpg',
						}}
						style={style.thumbnail}
					/>
					<List style={{ width: '100%' }}>
						<ListItem itemDivider>
							<Text>Profile</Text>
						</ListItem>
						<ListItem style={style.listItem} noIndent={true}>
							<Text style={style.listKey}>Name</Text>
							<Text style={style.listValue}>{data.name}</Text>
						</ListItem>
						<ListItem style={style.listItem} noIndent={true}>
							<Text style={style.listKey}>Username</Text>
							<Text style={style.listValue}>{data.username}</Text>
						</ListItem>
						<ListItem style={style.listItem} noIndent={true}>
							<Text style={style.listKey}>Phone</Text>
							<Text style={style.listValue}>{data.phone}</Text>
						</ListItem>
						<ListItem style={style.listItem} noIndent={true}>
							<Text style={style.listKey}>Email</Text>
							<Text style={style.listValue}>{data.email}</Text>
						</ListItem>
					</List>
					<Button style={style.button} onPress={() => logout()}>
						<Text style={style.buttonText}>Logout</Text>
					</Button>
				</View>
			</ScrollView>
		</>
	)
}

const style = {
	header: {
		backgroundColor: '#fff',
		borderBottomColor: '#35ABFF',
		borderBottomWidth: 1,
		elevation: 0,
	},
	headerTitle: {
		color: '#35ABFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	wrapper: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		paddingVertical: 20,
	},
	thumbnail: {
		borderRadius: 125,
		height: 125,
		marginBottom: 20,
		width: 125,
	},
	listItem: {
		backgroundColor: '#FFF',
		padding: 20,
	},
	listKey: {
		marginRight: 20,
		width: 'auto',
	},
	listValue: {
		marginLeft: 'auto',
		width: 'auto',
	},
	button: {
		backgroundColor: '#111',
		borderRadius: 5,
		elevation: 0,
		justifyContent: 'center',
		marginVertical: 20,
		width: '50%',
	},
	buttonText: {
		color: '#FFF',
	},
}

export default ProfileScreen
