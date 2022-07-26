import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import util from '../../util';

export default ({ label, defaultValue = undefined, value = undefined, number, disable, secureTextEntry = false, onChangeText, onPress = undefined }) => {
  if (disable) {
    return(
      <Pressable onPress={onPress}>
        <TextInput 
          mode='outlined' 
          label={label} 
          activeOutlineColor={util.Colors.MainColor}
          outlineColor='transparent'
          defaultValue={defaultValue}
          value={value}
          disabled
          style={{
            backgroundColor: util.Colors.SecondaryWhite
          }}
          onChangeText={onChangeText}
        />
      </Pressable>
    )
  } else {
    return(
      <TextInput 
        mode='outlined' 
        label={label} 
        keyboardType={number ? 'number-pad' : 'default'}
        activeOutlineColor={util.Colors.MainColor}
        secureTextEntry={secureTextEntry}
        outlineColor='transparent'
        value={value}
        style={{
          backgroundColor: util.Colors.SecondaryWhite
        }}
        onChangeText={onChangeText}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})