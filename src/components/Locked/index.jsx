import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Security from '../../assets/img/security.svg'
import util from '../../util';

export default ({ goToUpgrade = undefined }) => {
  const [level, setLevel] = useState(0)

  useEffect(() => {
    getLevel()
  })

  const getLevel = async () => {
    try {
      setLevel(parseInt(await AsyncStorage.getItem('level')))
    } catch (e) {
      console.log(e)
    }
  }

  return(
    <View style={styles.container}>
      <Security width={300} height={220} />
      {level === 0 ? (
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.commontText, {color: 'black'}]}>Upgrade fiturmu</Text>
          <Pressable onPress={goToUpgrade}>
            <Text style={[styles.commontText, {color: util.Colors.MainColor}]}> disini, </Text>
          </Pressable>
          <Text style={[styles.commontText, {color: 'black'}]}>mulai dari Rp1.000-an/hari</Text>
        </View>
      ) : <Text style={[styles.commontText, {color: 'black'}]}>Upgrade akun owner terlebih dahulu</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  commontText: {
    fontSize: 16, 
    fontWeight: 'bold'
  }
})