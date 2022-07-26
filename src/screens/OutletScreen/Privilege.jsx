import CheckBox from '@react-native-community/checkbox';
import React, { useRef, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import util from '../../util';

export default ({ label, value, disabled = false, onValueChange }) => {
  return(
    <View>
      <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{label}</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <CheckBox 
            disabled={disabled}
            value={value}
            onValueChange={newValue => onValueChange(newValue ? 1 : 0)}
            tintColors={{true: util.Colors.MainColor, false: util.Colors.MainColor}}
          />
          <Text style={{color: 'black'}}>Readonly</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <CheckBox 
            disabled={disabled}
            value={!value}
            style={{
              borderRadius: 10
            }}
            
            onValueChange={newValue => onValueChange(!newValue ? 1 : 0)}
            tintColors={{true: util.Colors.MainColor, false: util.Colors.MainColor}}
          />
          <Text style={{color: 'black'}}>Tambah, Edit, Hapus</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})