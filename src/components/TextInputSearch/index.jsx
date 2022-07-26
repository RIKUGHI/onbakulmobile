import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import util from '../../util';

export default ({ placeholder, onChangeText, onSubmitSearch }) => {
  const [isFocus, setIsFocus] = useState(false)
  const _onTextInputFocus = () => {
    setIsFocus(true)
  }

  const _onTextInputBlur = () => {
    setIsFocus(false)
  }

  return(
    <View style={isFocus ? [styles.container, styles.onFocus] : styles.container}>
      <TextInput 
        onSubmitEditing={onSubmitSearch}
        onChangeText={onChangeText}
        onFocus={_onTextInputFocus} 
        onBlur={_onTextInputBlur} 
        style={styles.input} placeholder={placeholder} 
      />
      <Pressable style={styles.iconContainer} onPress={onSubmitSearch}>
        <FontAwesomeIcon icon={faSearch} color={util.Colors.White} size={18} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: util.Colors.White, 
    flex: 1, 
    borderRadius: 10,
    paddingHorizontal: 6,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 20,  
    elevation: 5,
    shadowColor: 'black',
    borderWidth: 1,
    borderColor: 'white'
  },
  onFocus: {
    borderColor: util.Colors.MainColor,
    borderWidth: 1
  },
  input: {
    backgroundColor: 'transparent', 
    flex: 1, 
    padding: 0, 
    paddingRight: 6, 
    fontSize: 16, 
    height: 40,
    color: 'black'
  },
  iconContainer: {
    backgroundColor: util.Colors.MainColor, 
    width: 30, 
    height: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 10
  }
})