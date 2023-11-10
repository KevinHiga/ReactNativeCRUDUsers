import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../misc/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const RoundIconBtn = ({ antIconName, size, color, style, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.icon, { backgroundColor: disabled ? colors.DISABLED : colors.PRIMARY }, { ...style }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon name={antIconName} size={size} color={color || colors.LIGHT} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    icon: {
      backgroundColor: colors.PRIMARY,
      padding: 15,
      borderRadius: 50,
      justifyContent: "center",
      alignSelf: "center",
      elevation: 5,
    },
});

export default RoundIconBtn;