import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import {
	Button,
	Thumbnail,
	List,
	ListItem,
	Header,
	Left,
	Body,
	Right,
} from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { withNavigation } from 'react-navigation'

const UserProfileScreen = props => {
	const [data, setData] = useState({})
	const userId = props.navigation.getParam('id')

	const logout = async () => {
		await AsyncStorage.removeItem('Authorization')
		props.navigation.navigate('AuthLoadingScreen')
	}

	const getData = async () => {
		const documentSnapshot = await firestore()
			.collection('users')
			.doc(userId)
			.get()
		const data = documentSnapshot.data()
		// console.log(auth().currentUser.uid)
		// console.log('='.repeat(100))
		// console.log(data)
		setData(data)
	}

	useEffect(() => {
		getData()
	}, [])

	console.log('='.repeat(200))
	console.log(data.avatar)

	return (
		<>
			<Header style={style.header}>
				<Left>
					<Button
						transparent
						onPress={() => props.navigation.goBack()}>
						<Icon
							name="arrow-left-thick"
							size={25}
							color="#35ABFF"
						/>
					</Button>
				</Left>
				<Body>
					<Text style={style.headerTitle}>Profile</Text>
				</Body>
				<Right>
					<Button
						transparent
						onPress={() =>
							props.navigation.navigate('ChatRoomScreen', {
								id: userId,
							})
						}>
						<Icon
							name="android-messages"
							size={25}
							color="#35ABFF"
						/>
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
				</View>
			</ScrollView>
		</>
	)
}

const style = {
	header: {
		backgroundColor: '#fff',
		elevation: 0,
		borderBottomWidth: 1,
		borderBottomColor: '#35ABFF',
	},
	headerTitle: {
		color: '#35ABFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	wrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 20,
	},
	thumbnail: {
		width: 125,
		height: 125,
		borderRadius: 125,
		margin: 10,
	},
	listItem: {
		padding: 20,
		backgroundColor: '#FFF',
	},
	listKey: {
		width: 'auto',
		marginRight: 20,
	},
	listValue: {
		width: 'auto',
		marginLeft: 'auto',
	},
	button: {
		backgroundColor: '#111',
		justifyContent: 'center',
		width: '50%',
		borderRadius: 5,
		elevation: 0,
		marginVertical: 20,
	},
	buttonText: {
		color: '#FFF',
	},
}

export default UserProfileScreen
