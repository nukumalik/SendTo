import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
import { View, Text, ScrollView } from 'react-native'
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const UserProfileScreen = props => {
	const [data, setData] = useState({})
	const userId = props.navigation.getParam('id')

	const getData = async () => {
		const documentSnapshot = await firestore()
			.collection('users')
			.doc(userId)
			.get()
		const data = documentSnapshot.data()
		setData(data)
	}

	useEffect(() => {
		getData()
	}, [])

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
		margin: 10,
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

export default UserProfileScreen
