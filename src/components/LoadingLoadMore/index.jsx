import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import util from '../../util';

export default ({ show = false }) => {
  if (!show) return null

  return(
    <ActivityIndicator size='large' color={util.Colors.MainColor} />
  )
}
