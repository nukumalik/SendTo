import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import {
	Header,
	Left,
	Body,
	Right,
	List,
	ListItem,
	Thumbnail,
	Button,
} from 'native-base'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ChatListScreen = props => {
	const [chats, setChats] = useState()

	const getChats = async () => {
		await auth().onAuthStateChanged(user => {
			const koleksi = firestore()
				.collection('messages')
				.doc(user.uid)
		})
	}

	useEffect(() => {
		getChats()
	}, [])

	return (
		<>
			<Header style={style.header}>
				<Left>
					<TouchableOpacity
						onPress={() =>
							props.navigation.navigate('NewChatScreen')
						}>
						<Icon name="message-plus" size={25} color="#35ABFF" />
					</TouchableOpacity>
				</Left>
				<Body>
					<Text style={style.headerTitle}>SendTo</Text>
				</Body>
				<Right>
					<Icon name="dots-vertical" size={25} color="#35ABFF" />
				</Right>
			</Header>
			<List>
				<FlatList
					data={chats}
					renderItem={({ item }) => (
						<>
							<ListItem avatar>
								<Left>
									<Button
										onPress={() =>
											props.navigation.navigate(
												'ChatRoomScreen',
											)
										}>
										<Thumbnail
											source={{ uri: item.avatar }}
											small
										/>
									</Button>
								</Left>
								<Body>
									<Text style={style.title}>{item.name}</Text>
									<Text style={style.text}>
										{item.message}
									</Text>
								</Body>
								<Right>
									<Text style={style.time}>10.00</Text>
									<Icon
										name={
											(item.status === 'success' &&
												'check') ||
											(item.status === 'read' &&
												'check-all') ||
											(item.status === 'process' &&
												'clock-outline')
										}
										size={16}
										color={
											item.status === 'read'
												? '#37b8ff'
												: 'gray'
										}
									/>
								</Right>
							</ListItem>
						</>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			</List>
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
	},
	title: {
		fontWeight: 'bold',
	},
	text: {
		color: '#555',
	},
	time: {
		fontSize: 10,
		paddingBottom: 5,
	},
}

export default ChatListScreen
