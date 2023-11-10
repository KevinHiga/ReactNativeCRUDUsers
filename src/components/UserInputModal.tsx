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
  Pressable,
} from 'react-native';
import colors from '../misc/Colors';
import RoundIconBtn from './RoundIconBtn';
import { useUsers } from '../contexts/UserProvider';
import { SelectList } from 'react-native-dropdown-select-list'
import DatePicker from 'react-native-date-picker'

const formatDate = ms => {
  const date = new Date(ms);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatDate2 = ms => {
  const date = new Date(ms);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${year}/${month}/${day}`;
};

const UserInputModal = ({ visible, onClose, onSubmit, user, isEdit }) => {
  const [dni, setDNI] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [civilStatus, setCivilStatus] = useState('');
  const [selectedCity, setSelectedCity] = useState({});
  const [selectedCity2, setSelectedCity2] = useState("");
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setError] = useState({});
  const [errors2, setError2] = useState("");
  const [errors3, setError3] = useState("");
  const [errors4, setError4] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [selected, setSelected] = React.useState("");
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null);
  const { findCitys, citys } = useUsers();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitRegex = /^\d+$/;

  const handleTextInputFocus = (inputNumber) => {
    setFocusedInput(inputNumber);
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    findCitys()
        
    validateDefaultFields("", "dni")
    validateDefaultFields("", "firstName")
    validateDefaultFields("", "lastName")
    validateDefaultFields("", "civilStatus")
    validateDefaultFields("", "email")
    validateDefaultFields("", "phone")
    validateDefaultFields("", "city")
    validateDefaultFields("", "birthDate")
  }, [visible]);

  const isUserAdult = (value) => {
    const currentDate = new Date();
    const eighteenYearsAgo = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
    console.log("adulto", value, eighteenYearsAgo, value <= eighteenYearsAgo);
    
    return value <= eighteenYearsAgo;
  };

  const validateDefaultFields = (value, name) => {
    if (value === "" || value === 0 || value === undefined || value === null) {
      errorMessage(name)
    } else if (name === "email") {
      if (value.match(emailRegex) === null) {
        errorMessageEmail(name)
      } else {
        errorSetMessage(name)
        setError2("");
      }
    } else if (name === "phone") {
      if (value.match(digitRegex) === null) {
        errorMessagePhone(name)
      } else {
        errorSetMessage(name)
        setError3("");
      }
    } else if (name === "birthDate") {
        console.log("paso");
        if (isUserAdult(value)) {
            console.log("paso2");
            
        errorSetMessage(name)
        setError4("");
      } else {
        errorMessageAdult(name)
      }
    } else {
      errorSetMessage(name)
    }
  }

  const errorMessageAdult = (name) => {
    errorSetMessage(name)
    setError4("El cliente no es mayor de edad");
  }

  const errorMessagePhone = (name) => {
    errorSetMessage(name)
    setError3("El teléfono no tiene el formato correcto");
  }

  const errorMessageEmail = (name) => {
    errorSetMessage(name)
    setError2("El correo no tiene el formato correcto");
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
    if (valueFor === 'dni') {
        validateDefaultFields(text, "dni")
        setDNI(text);
    }
    if (valueFor === 'firstName') {
        validateDefaultFields(text, "firstName")
        setFirstName(text);
    }
    if (valueFor === 'lastName') {
        validateDefaultFields(text, "lastName")
        setLastName(text);
    }
    if (valueFor === 'civilStatus') {
        validateDefaultFields(text, "civilStatus")
        setCivilStatus(text);
    }
    if (valueFor === 'email') {
        validateDefaultFields(text, "email")
        setEmail(text);
    }
    if (valueFor === 'phone') {
        validateDefaultFields(text, "phone")
        setPhone(text);
    }
    if (valueFor === 'city') {
        validateDefaultFields(text, "city")
        setSelectedCity2(text);
    }
  };

  const handleSubmit = async () => {
    const url = "http://192.168.1.40:6000/user/" + dni;
    const response = await fetch(url);
    const result = await response.json();
    if (dni.length !== 8) {
        alert("El DNI no cuenta con 8 digitos")
    } else if (result.data.data !== null && result.data.data !== undefined && result.data.data.length > 0) {
        alert("Ya existe el cliente con el dni " + dni)
    } else if (errors2 !== "") {
        alert(errors2)
    } else if (errors3 !== "") {
        alert(errors3)
    } else if (phone.length !== 9) {
        alert("El teléfono no tiene 9 digitos")
    } else if (errors4 !== "") {
        alert(errors4)
    } else {
        onSubmit(dni, firstName, lastName, civilStatus, formatDate2(date), selectedCity2, email, phone);
        setDNI('');
        setFirstName('');
        setLastName('');
        setCivilStatus('');
        setEmail('');
        setPhone('');
        setSelectedCity({})
        setSelectedCity2("")
        setError({})
        setDate(new Date())
        onClose();
    }
  };

  const closeModal = () => {
    setDNI('');
    setFirstName('');
    setLastName('');
    setCivilStatus('');
    setEmail('');
    setPhone('');
    setSelectedCity({})
    setSelectedCity2("")
    setError({})
    setDate(new Date())
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
  }, [errors, errors2, errors3, errors4]);

  return (
    <>
      <StatusBar hidden />
      <Modal visible={visible} animationType='fade'>
        <View style={styles.container}>
          <TextInput
            value={dni}
            onChangeText={text => handleOnChangeText(text, 'dni')}
            placeholder='DNI'
            keyboardType="numeric"
            maxLength={8}
            returnKeyType="next"
            onFocus={() => handleTextInputFocus(1)}
            onSubmitEditing={() => setFocusedInput(2)}
            style={[styles.input, styles.dni]}
          />
          <TextInput
            value={firstName}
            multiline
            placeholder='Nombres'
            style={[styles.input, styles.field]}
            returnKeyType="next"
            onFocus={() => handleTextInputFocus(2)}
            onSubmitEditing={() => setFocusedInput(3)}
            onChangeText={text => handleOnChangeText(text, 'firstName')}
          />
          <TextInput
            value={lastName}
            multiline
            placeholder='Apellidos'
            style={[styles.input, styles.field]}
            returnKeyType="next"
            onFocus={() => handleTextInputFocus(3)}
            onSubmitEditing={() => setFocusedInput(4)}
            onChangeText={text => handleOnChangeText(text, 'lastName')}
          />
          <TextInput
            value={civilStatus}
            multiline
            placeholder='Estado Civil'
            style={[styles.input, styles.field]}
            onChangeText={text => handleOnChangeText(text, 'civilStatus')}
          />
          <Pressable style={[styles.input, styles.field, styles.dateInput]} onPress={() => setOpen(true)}>
            <Text style={[styles.dateInput]}>{formatDate(date)}</Text>
          </Pressable>
          <DatePicker
            modal
            open={open}
            mode="date"
            date={date}
            onConfirm={(dateConfirm) => {
              setOpen(false)
              validateDefaultFields((dateConfirm), "birthDate")
              setDate(new Date(dateConfirm))
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
          <SelectList 
            onSelect={() => handleOnChangeText(selected, "city")}
            setSelected={setSelected} 
            data={citys}  
            boxStyles={{borderRadius:0}} //override default styles
            defaultOption={selectedCity}   //default selected option
          />
          <TextInput
            value={email}
            multiline
            placeholder='Correo'
            style={[styles.input, styles.field]}
            onChangeText={text => handleOnChangeText(text, 'email')}
          />
          <TextInput
            value={phone}
            multiline
            placeholder='Teléfono'
            keyboardType="numeric"
            maxLength={9}
            style={[styles.input, styles.field]}
            onChangeText={text => handleOnChangeText(text, 'phone')}
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
  dateInput: {
    justifyContent: "center",
    fontSize: 20,
    color: colors.DARK,
  },
  dni: {
    height: 50,
    marginTop: 15,
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

export default UserInputModal;