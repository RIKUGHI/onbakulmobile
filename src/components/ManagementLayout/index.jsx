import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import util from '../../util';
import Locked from '../Locked';

const ManagementLayout = ({ children, locked, goToUpgrade = undefined }) => {
  return(
    <View style={styles.container}>{locked ? <Locked goToUpgrade={goToUpgrade} /> : children}</View>
  )
}

ManagementLayout.Header = ({ children, title }) => {
  return(
    <View>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={{flexDirection: 'row'}}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 15, 
    backgroundColor: util.Colors.White
  },
  title: {
    fontSize: 20, 
    color: util.Colors.MainColor, 
    fontWeight: 'bold', 
    marginBottom: 10
  }
})

export default ManagementLayout