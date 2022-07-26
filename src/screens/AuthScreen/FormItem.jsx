import { faCheck, faEye, faEyeSlash, faStore, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import util from '../../util';

export default ({ icon, secondIcon, secureTextEntry = false, warning, warningMessage, placeholder, value, onChangeText }) => {
  const [isSecureText, setIsSecureText] = useState(secureTextEntry)

  return(
    <View>
      <View style={[styles.root, {marginBottom: 5}]}>
        <FontAwesomeIcon icon={icon} color={util.Colors.MainColor} size={25} />
        <TextInput 
          placeholder={placeholder} 
          style={{flex: 1, height: 45, marginHorizontal: 10, fontSize: 16, color: 'black'}}
          secureTextEntry={isSecureText}
          keyboardType={placeholder.toLowerCase() === 'email' ? 'email-address' : 'default'}
          onChangeText={onChangeText} 
        />
        {(value !== '' || placeholder.toLowerCase() === 'password' || placeholder.toLowerCase() === 'pin') && (
          <Pressable 
            onPress={secureTextEntry ? () => setIsSecureText(!isSecureText) : undefined}
          >
            <FontAwesomeIcon icon={(placeholder.toLowerCase() === 'password' || placeholder.toLowerCase() === 'pin') ? (isSecureText ? faEyeSlash : faEye) : warning ? faTimes : faCheck} color={secureTextEntry ? util.Colors.MainColor : (warning ? util.Colors.Warning : util.Colors.Success)} size={25} />
          </Pressable>
        )}
      </View>
      {warning && value !== '' && <Text style={{fontSize: 12, color: 'red'}}>{warningMessage}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderColor: util.Colors.MainColor
  }
})