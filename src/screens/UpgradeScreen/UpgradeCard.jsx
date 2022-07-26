import { faCheck, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../../components';
import util from '../../util';

export default ({ label, shortDesc, longDesc, features, isLastItem, onShowModal = undefined }) => {
  return(
    <View style={{
      borderWidth: 2, 
      // borderColor: util.Colors.SecondaryWhite,
      borderColor: '#e0e3e8',
      borderRadius: 10,
      width: 350,
      marginLeft: isLastItem ? 10 : 0,
      alignItems: 'center',
      padding: 24,
    }}>
      <View
        style={{
          // borderWidth: 1,
          backgroundColor: 'white',
          width: 75,
          height: 75,
          borderRadius: 75 / 2,
          marginBottom: 15,
          justifyContent: 'center',
          alignItems: 'center',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 20,  
          elevation: 5,
        }}
      >
        <FontAwesomeIcon icon={faShoppingBasket} color={isLastItem ? 'black' : util.Colors.Success} size={50} />
      </View>
      <Text style={{
          fontSize: 20, 
          color: isLastItem ? 'black' : util.Colors.Success, 
          fontWeight: 'bold'
      }}>{label}</Text>
      <Text style={{color: 'black', fontSize: 16, marginBottom: 15}}>{shortDesc}</Text>
      {!isLastItem && (
        <View style={{
          flexDirection: 'row',
          marginBottom: 15
        }}>
          <ActionButton label='Upgrade' backgroundColor={util.Colors.Success} onPress={onShowModal} />
        </View>
      )}
      <Text style={{color: 'black', textAlign: 'center', fontSize: 14, marginBottom: 15}}>{longDesc}</Text>
      {features.map((d, i) => (
        <View 
          key={i}
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <FontAwesomeIcon icon={faCheck} color={isLastItem ? 'black' : util.Colors.Success} size={12} style={{marginRight: 10}} />
          <Text style={{color: 'black', fontSize: 14, fontWeight: 'bold'}}>{d}</Text>
        </View>
      ))}
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