import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'
import { Header, Left, Body, Right, Button, Thumbnail } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore'
import { TouchableOpacity } from 'react-native-gesture-handler'

const UserList = props => {
	const [search, setSearch] = useState('')
	const [isSearch, setIsSearch] = useState(false)
	const [users, setUsers] = useState()
	const [isAsc, setIsAsc] = useState(true)

	const searchToggle = () => {
		if (isSearch) {
			setIsSearch(false)
		} else {
			setIsSearch(true)
		}
	}

	const userList = async () => {
		await firestore()
			.collection('users')
			.orderBy('name', isAsc ? 'asc' : 'desc')
			.limit(50)
			.onSnapshot(querySnapshot => {
				setUsers(querySnapshot.docs)
			})
	}

	const findUser = async () => {
		await firestore()
			.collection('users')
			.orderBy('name', isAsc ? 'asc' : 'desc')
			.where('name', '>=', search)
			.onSnapshot(querySnapshot => {
				setUsers(querySnapshot.docs)
			})
	}

	if (search.length > 2) {
		findUser()
	} else if (search.length < 1) {
		userList()
	}

	useEffect(() => {
		userList()
	}, [])

	return (
		<>
			<Header style={style.header}>
				<Left>
					<Button transparent onPress={() => searchToggle()}>
						<Icon name="magnify" size={25} color="#35ABFF" />
					</Button>
				</Left>
				<Body>
					<Text style={style.headerTitle}>SendTo</Text>
				</Body>
				<Right>
					<Button
						transparent
						onPress={() =>
							isAsc ? setIsAsc(false) : setIsAsc(true)
						}>
						<Icon
							name={isAsc ? 'sort-descending' : 'sort-ascending'}
							size={25}
							color="#35ABFF"
						/>
					</Button>
				</Right>
			</Header>
			{isSearch && (
				<View style={style.searchWrapper}>
					<TextInput
						onChangeText={text => setSearch(text)}
						style={style.search}
						placeholder="Search..."
						autoFocus
					/>
				</View>
			)}
			<FlatList
				data={users}
				renderItem={({ item }) => (
					<>
						<View style={style.listWrapper}>
							<TouchableOpacity
								style={{
									display: 'flex',
									flexDirection: 'row',
								}}
								onPress={() =>
									props.navigation.navigate(
										'UserProfileScreen',
										{
											id: item._data.id,
										},
									)
								}>
								<View style={style.listLeft}>
									<Thumbnail
										source={{ uri: item._data.avatar }}
									/>
								</View>
								<View style={style.listBody}>
									<Text style={style.listTitle}>
										{item._data.name}
									</Text>
									<Text style={style.listMeta}>
										@{item._data.username}
									</Text>
								</View>
							</TouchableOpacity>
							<View style={style.listRight}>
								<Button
									transparent
									onPress={() =>
										props.navigation.navigate(
											'ChatRoomScreen',
											{
												id: item._data.id,
											},
										)
									}>
									<Icon
										name="message-text"
										size={25}
										color="#35ABFF"
									/>
								</Button>
							</View>
						</View>
					</>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
		</>
	)
}

const style = {
	header: {
		backgroundColor: '#FFF',
		elevation: 0,
	},
	headerTitle: {
		color: '#35ABFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
	searchWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	search: {
		backgroundColor: '#eee',
		borderRadius: 5,
		padding: 10,
		width: '90%',
	},

	// List
	listWrapper: {
		backgroundColor: '#FFF',
		borderBottomColor: '#eee',
		borderBottomWidth: 1,
		display: 'flex',
		flexDirection: 'row',
		marginHorizontal: 10,
		padding: 5,
	},
	listLeft: {
		padding: 10,
		width: 'auto',
	},
	listBody: {
		justifyContent: 'center',
		padding: 10,
	},
	listRight: {
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 'auto',
		width: 'auto',
	},
	listTitle: {
		fontSize: 15,
		fontWeight: 'bold',
		paddingBottom: 5,
	},
	listMeta: {
		color: 'gray',
		fontSize: 12,
	},
}

export default UserList
