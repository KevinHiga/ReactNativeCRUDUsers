import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import colors from '../misc/Colors';
var width = Dimensions.get('window').width;

const User = ({ item, onPress }) => {
  const { dni, firstName, lastName, civilStatus, birthDate, city, email, phone } = item;
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>
        {dni}
      </Text>
      <Text style={styles.text} numberOfLines={2}>{firstName + ", " + lastName}</Text>
      <Text style={styles.text} numberOfLines={1}>{civilStatus}</Text>
      <Text style={styles.text}>{((birthDate && birthDate.substring(0, 10) !== "0001-01-01") ? (birthDate.substring(0, 10)) : (""))}</Text>
      <Text style={styles.text} numberOfLines={1}>{city}</Text>
      <Text style={styles.text} numberOfLines={1}>{email}</Text>
      <Text style={styles.text} numberOfLines={1}>{phone}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.PRIMARY,
    padding: 8,
    borderRadius: 10,
    margin: 6,
    width: ((width/2) - 30),
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.LIGHT,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default User;