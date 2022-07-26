import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import util from '../../util';

export default ({ title, value, icon, marginBot, onPress = undefined }) => {
  const trueStyle = marginBot ? [styles.card, { marginBottom: 15 }] : styles.card
  return(
    <Pressable 
      onPress={onPress}
    >
      <View style={trueStyle}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 40, height: 40, marginRight: 15, justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesomeIcon icon={icon} color='black' size={38} />
          </View>
          <View>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>{value}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: 'black'}}>{title}</Text>
          </View>
        </View>
        {onPress && <FontAwesomeIcon icon={faChevronRight} color='black' size={25} />}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: util.Colors.White,
    padding: 15, 
    marginHorizontal: 15,
    marginTop: 15,
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20, 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 20,  
    elevation: 5,
    shadowColor: 'black'
  }, 
})
