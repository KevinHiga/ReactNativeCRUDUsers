import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import colors from '../misc/Colors';
import RoundIconBtn from './RoundIconBtn';
import { useCitys } from '../contexts/CityProvider';
import CityInputModalEdit from './CityInputModalEdit';

const formatDate = ms => {
  const date = new Date(ms);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hrs = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `${day}/${month}/${year} - ${hrs}:${min}:${sec}`;
};

const CityDetail = props => {
  const [city, setCity] = useState(props.route.params.city);
  const { setTemp } = useCitys();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const deleteCity = async () => {
    fetch("http://192.168.1.40:6000/city/" + city.key, {
        method: 'DELETE'
    }).then((response) => response.json())
    .then((responseData) => {
        setTemp(city)
    })
    props.navigation.goBack();
  };

  const displayDeleteAlert = () => {
    Alert.alert(
      'Are You Sure!',
      'This action will delete your city permanently!',
      [
        {
          text: 'Delete',
          onPress: deleteCity,
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

  const handleUpdate = async (value) => {
    const cityUpdate = {
      value: value
    }
    console.log(city.key);
    
    fetch("http://192.168.1.40:6000/city/" + city.key, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cityUpdate)
    }).then((response) => response.json())
    .then((responseData) => {
        console.log(responseData);
        setCity(responseData.data.data)
        setTemp(cityUpdate)
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
        <Text style={styles.title}>{city.value}</Text>
      </ScrollView>
      <View style={styles.btnContainer}>
        <RoundIconBtn
          antIconName='remove'
          style={{ backgroundColor: colors.ERROR, marginBottom: 15 }}
          onPress={displayDeleteAlert}
        />
        <RoundIconBtn antIconName='edit' onPress={openEditModal} />
      </View>
      <CityInputModalEdit
        isEdit={isEdit}
        city={city}
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

export default CityDetail;