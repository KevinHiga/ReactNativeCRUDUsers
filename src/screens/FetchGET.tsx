import {
  View,
  FlatList,
  StatusBar,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Dimensions,
} from 'react-native';
import User from '../components/User';
import SearchBar from '../components/SearchBar';
import NotFound from '../components/NotFound';
import colors from '../misc/Colors';
import RoundIconBtn from '../components/RoundIconBtn';
import UserInputModal from '../components/UserInputModal';
import { useUsers } from '../contexts/UserProvider';
import React, { useEffect, useState} from 'react';

const FetchGET = ({navigation}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const { users, setUsers, findUsers, filterUsers, setFilterUsers, resultNotFound, setResultNotFound, setTemp } = useUsers();

    const openUser = (user) => {
      navigation.navigate('DetalleUsuario', { user });
    };

    const handleOnSubmit = async (dni, firstName, lastName, civilStatus, birthDateString, City, Email, Phone) => {
        const user = {
            dni: dni,
            firstName: firstName,
            lastName: lastName,
            civilStatus: civilStatus,
            birthDateString: birthDateString,
            cityId: City,
            email: Email,
            phone: Phone
        }
        fetch("http://192.168.1.40:6000/user", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then((response) => response.json())
        .then((responseData) => {
            console.log('====================================');
            console.log(responseData);
            console.log('====================================');
            setTemp(user)
        })
    };

    const handleOnSearchInput = async text => {
      setSearchQuery(text);
      if (!text.trim()) {
        setSearchQuery('');
        setResultNotFound(false);
        return await findUsers();
      }
      const filteredUser = filterUsers.filter(user => {
        if (user.dni.toLowerCase().includes(text.toLowerCase())) {
          return user;
        }
      });
  
      if (filteredUser.length) {
        setUsers([...filteredUser]);
      } else {
        setResultNotFound(true);
      }
    };

    const handleOnrefresh = async () => {
      const url = "http://192.168.1.40:6000/users"
      fetch(url)
          .then(res=>res.json())
          .then((result) => {
            const filteredCity2 = result.data.data.filter(user => {
              if (user.dni.toLowerCase().includes(searchQuery.toLowerCase())) {
                return user;
              }
            });
        
            if (filteredCity2.length) {
              setUsers(filteredCity2);
              setFilterUsers(result.data.data)
            } else {
              setResultNotFound(true);
            }
          }, (error) => {
            setResultNotFound(true);
          })
    };

    const handleOnClear = async () => {
      setSearchQuery('');
      setResultNotFound(false);
      await findUsers();
    };
    
    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor={colors.LIGHT} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                {users.length ? (
                    <SearchBar
                    value={searchQuery}
                    onChangeText={handleOnSearchInput}
                    containerStyle={{ marginVertical: 15 }}
                    onClear={handleOnClear}
                    />
                ) : null}

                {resultNotFound ? (
                  <NotFound />
                ) : (
                    <FlatList 
                        data={users}
                        numColumns={2}
                        columnWrapperStyle={{
                        justifyContent: 'space-between',
                        }}
                        keyExtractor={(item) => item.dni}
                        renderItem={({item}) => (
                            <User onPress={() => openUser(item)} item={item} />
                        )}
                    />
                )}
                </View>
            </TouchableWithoutFeedback>
            <RoundIconBtn
                onPress={() => handleOnrefresh()}
                antIconName='refresh'
                style={styles.refreshBtn}
            />
            <RoundIconBtn
                onPress={() => setModalVisible(true)}
                antIconName='plus'
                style={styles.addBtn}
            />
            <UserInputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleOnSubmit}
            />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    container: {
      paddingHorizontal: 20,
      flex: 1,
      zIndex: 1,
    },
    emptyHeader: {
      fontSize: 30,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      opacity: 0.2,
    },
    emptyHeaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: -1,
    },
    refreshBtn: {
      position: 'absolute',
      right: 15,
      bottom: 110,
      zIndex: 1,
    },
    addBtn: {
      position: 'absolute',
      right: 15,
      bottom: 50,
      zIndex: 1,
    },
});

export default FetchGET;
