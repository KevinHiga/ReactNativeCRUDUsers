import {
  View,
  FlatList,
  StatusBar,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Dimensions,
} from 'react-native';
import City from '../components/City';
import SearchBar from '../components/SearchBar';
import NotFound from '../components/NotFound';
import colors from '../misc/Colors';
import RoundIconBtn from '../components/RoundIconBtn';
import CityInputModal from '../components/CityInputModal';
import { useCitys } from '../contexts/CityProvider';
import React, { useEffect, useState} from 'react';

const FetchGET = ({navigation}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const { citys, setCitys, findCitys, filterCitys, setFilterCitys, resultNotFound, setResultNotFound, setTemp } = useCitys();

    const openCity = (city) => {
      navigation.navigate('DetalleCiudad', { city });
    };

    const handleOnSubmit = async (value) => {
        const city = {
          value: value
        }
        console.log('====================================');
        console.log(JSON.stringify(city));
        console.log('====================================');
        fetch("http://192.168.1.40:6000/city", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(city)
        }).then((response) => response.json())
        .then((responseData) => {
            console.log('====================================');
            console.log(responseData);
            console.log('====================================');
            setTemp(city)
        })
    };

    const handleOnSearchInput = async text => {
      setSearchQuery(text);
      if (!text.trim()) {
        setSearchQuery('');
        setResultNotFound(false);
        return await findCitys();
      }
      const filteredCity = filterCitys.filter(city => {
        if (city.value.toLowerCase().includes(text.toLowerCase())) {
          return city;
        }
      });
  
      if (filteredCity.length) {
        setCitys([...filteredCity]);
      } else {
        setResultNotFound(true);
      }
    };

    const handleOnrefresh = async () => {
      const url = "http://192.168.1.40:6000/citys"
      fetch(url)
          .then(res=>res.json())
          .then((result) => {
            const filteredCity2 = result.data.data.filter(city => {
              if (city.value.toLowerCase().includes(searchQuery.toLowerCase())) {
                return city;
              }
            });
        
            if (filteredCity2.length) {
              setCitys(filteredCity2);
              setFilterCitys(result.data.data)
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
      await findCitys();
    };
    
    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor={colors.LIGHT} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                {citys.length ? (
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
                        data={citys}
                        numColumns={3}
                        keyExtractor={(item) => item.dni}
                        renderItem={({item}) => (
                            <City onPress={() => openCity(item)} item={item} />
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
            <CityInputModal
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
