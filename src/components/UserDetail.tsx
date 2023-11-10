import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import colors from '../misc/Colors';
import RoundIconBtn from './RoundIconBtn';
import { useUsers } from '../contexts/UserProvider';
import UserInputModalEdit from './UserInputModalEdit';

const UserDetail = props => {
  const [user, setUser] = useState(props.route.params.user);
  const { setTemp } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const deleteUser = async () => {
    fetch("http://192.168.1.40:6000/user/" + user.id, {
        method: 'DELETE'
    }).then((response) => response.json())
    .then((responseData) => {
        setTemp(user)
    })
    props.navigation.goBack();
  };

  const displayDeleteAlert2 = () => {
    Alert.alert(
      'Are You Sure!',
      'This action will delete your user permanently!',
      [
        {
          text: 'Delete',
          onPress: deleteUser,
        },
        {
          text: 'No Thanks',
          onPress: () => console.log('no thanks'),
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleUpdate = async (dni, firstName, lastName, civilStatus, birthDate, City, Email, Phone) => {
    const userUpdate = {
        dni: dni,
        firstName: firstName,
        lastName: lastName,
        civilStatus: civilStatus,
        birthDateString: birthDate,
        cityId: City,
        email: Email,
        phone: Phone
    }
    
    fetch("http://192.168.1.40:6000/user/" + user.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userUpdate)
    }).then((response) => response.json())
    .then((responseData) => {
        setUser(responseData.data.data)
        setTemp(userUpdate)
    })
  };
  const handleOnClose = () => setShowModal(false);

  const openEditModal = () => {
    setIsEdit(true);
    setShowModal(true);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: 10 }]}
      >
        <Text style={styles.title}>{user.dni}</Text>
        <Text style={styles.desc}>{user.firstName + ", " + user.lastName}</Text>
        <Text style={styles.desc}>{user.civilStatus}</Text>
        <Text style={styles.desc}>{((user.birthDate && user.birthDate.substring(0, 10) !== "0001-01-01") ? (user.birthDate.substring(0, 10)) : (""))}</Text>
        <Text style={styles.desc}>{user.city}</Text>
        <Text style={styles.desc}>{user.email}</Text>
        <Text style={styles.desc}>{user.phone}</Text>
      </ScrollView>
      <View style={styles.btnContainer}>
        <RoundIconBtn
          antIconName='remove'
          style={{ backgroundColor: colors.ERROR, marginBottom: 15 }}
          onPress={displayDeleteAlert2}
        />
        <RoundIconBtn antIconName='edit' onPress={openEditModal} />
      </View>
      <UserInputModalEdit
        isEdit={isEdit}
        user={user}
        onClose={handleOnClose}
        onSubmit={handleUpdate}
        visible={showModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 30,
    color: colors.PRIMARY,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 20,
    opacity: 0.6,
  },
  time: {
    textAlign: 'right',
    fontSize: 12,
    opacity: 0.5,
  },
  btnContainer: {
    position: 'absolute',
    right: 15,
    bottom: 50,
  },
});

export default UserDetail;