import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import colors from '../misc/Colors';
var width = Dimensions.get('window').width;

const City = ({ item, onPress }) => {
  const { value } = item;
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text} numberOfLines={3}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.PRIMARY,
    padding: 8,
    borderRadius: 10,
    margin: 6,
    width: ((width/3) - 30),
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

export default City;