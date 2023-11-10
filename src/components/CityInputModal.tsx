import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import colors from '../misc/Colors';
import RoundIconBtn from './RoundIconBtn';

const CityInputModal = ({ visible, onClose, onSubmit, city, isEdit }) => {
  const [value, setValue] = useState('');
  const [errors, setError] = useState({});
  const [disableButton, setDisableButton] = useState(false);

  const handleModalClose = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    validateDefaultFields("", "value")
  }, [visible]);

  const validateDefaultFields = (value, name) => {
    if (value === "" || value === 0 || value === undefined || value === null) {
      errorMessage(name)
    } else {
      errorSetMessage(name)
    }
  }

  const errorMessage = (name) => {
    let errorsAux = errors;
    errorsAux[name] = {
      type: "mandatory",
      message: "El campo es obligatorio",
    };
    setError(prevState => ({
      ...prevState,
      ...errorsAux
    }));
  }

  const errorSetMessage = (name) => {
    setError(current => {
      const copy = {...current};
      delete copy[name];
      return copy;
    });
  }

  const handleOnChangeText = (text, valueFor) => {
    if (valueFor === 'value') {
        validateDefaultFields(text, "value")
        setValue(text);
    }
  };

  const handleSubmit = async() => {
    const url = "http://192.168.1.40:6000/citys/" + value;
    const response = await fetch(url);
    const result = await response.json();
    if (result.data.data !== null && result.data.data !== undefined && result.data.data.length > 0) {
      alert("Ya existe la ciudad con el nombre " + value)
    } else {
      onSubmit(value);
      setValue('');
      setError({})
      onClose();
    }
  };

  const closeModal = () => {
    setValue('');
    setError({})
    onClose();
  };

  useEffect(() => {
    var count = 0
    
    const propertyNames = Object.keys(errors)
    for (const key in propertyNames) {
      if (Object.hasOwnProperty.call(propertyNames, key)) {
        count++
      }
    }
    if (count <= 0) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [errors]);

  return (
    <>
      <StatusBar hidden />
      <Modal visible={visible} animationType='fade'>
        <View style={styles.container}>
          <TextInput
            value={value}
            multiline
            placeholder='Ciudad'
            style={[styles.input, styles.field]}
            onChangeText={text => handleOnChangeText(text, 'value')}
          />
          <View style={styles.btnContainer}>
            <RoundIconBtn
              size={15} 
              antIconName='check'
              onPress={handleSubmit}
              disabled={disableButton}
            />
            <RoundIconBtn
              size={15}
              style={{ marginLeft: 15 }}
              antIconName='close'
              onPress={closeModal}
            />
          </View>
        </View>
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: colors.PRIMARY,
    fontSize: 20,
    color: colors.DARK,
  },
  dni: {
    height: 40,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  field: {
    height: 50,
  },
  modalBG: {
    flex: 1,
    zIndex: -1,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
  },
});

export default CityInputModal;