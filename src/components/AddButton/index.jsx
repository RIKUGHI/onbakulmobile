import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import util from '../../util';

export default ({ onPress }) => {
  return(
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={{
        fontSize: 16, 
        color: util.Colors.MainColor,
      }}>Tambah</Text>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={faPlus} color='white' size={18} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 42, 
    marginLeft: 10,
    borderRadius: 10,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 20,  
    elevation: 5,
    shadowColor: 'black'
  },
  iconContainer: {
    backgroundColor: util.Colors.MainColor, 
    width: 30, 
    height: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 10,
    marginLeft: 10
  }
})