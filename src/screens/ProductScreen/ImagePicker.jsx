import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, Image, ToastAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { MyOwnModal } from '../../components';
import util from '../../util';

export default ({ onClick, file, srcUri, isEdit }) => {
  const [uri, setUri] = useState(isEdit ? (srcUri === null ? '' : (typeof srcUri === 'object' ? srcUri.uri : util.ServerUrl+`assets/img/${srcUri.split('/')[6]}`)) : '')
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const _launchImage = async (type = 'gallery') => {
    let result
    const options = {
      mediaType: 'photo',
      includeBase64: true
    }

    setIsLoading(true)

    if (type === 'camera') {
      result = await launchCamera(options, (cb) => {
        // console.log('callback camera', cb);
      })
    } else {
      result = await launchImageLibrary(options, (cb) => {
        // console.log('callback gallery', cb);
      })
    }

    setIsLoading(false)

    if (!result.didCancel) {
      if (result.assets[0].fileSize > 5000000) {
        ToastAndroid.show('Ukuran gambar maks 5 megabytes', ToastAndroid.SHORT)
      } else {
        file(result.assets[0])
        setUri(result.assets[0].uri)
      }
    }
  }


  useEffect(() => {
    // console.log(uri);
  })

  return(
    <View>
      <View style={{
        // backgroundColor: 'salmon',
        // borderWidth: 1,
        alignItems: 'center',
        marginBottom: 10
      }}>
        <Pressable style={{
            backgroundColor: util.Colors.SecondaryWhite, 
            width: 100, 
            height: 100,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}
          onPress={isLoading ? undefined : () => setShowModal(true)}
        >
          {isLoading ? <Text style={styles.text}>Loading...</Text> : (uri ? (
            <Image source={uri ? {uri: uri} : require('../../assets/img/no-product-image.jpg')} style={{width: 100, height: 100}} />
          ) : (
            <Text style={styles.text}>Pilih Foto</Text>
          ))}
          {isEdit && uri !== '' && (
            <View style={styles.editContainer}>
              <FontAwesomeIcon icon={faPen} color={util.Colors.MainColor} size={18} />
            </View>
          )}
        </Pressable>
      </View>

    {/* ============================================= Modal Actions Camera ============================================= */}
    <MyOwnModal visible={showModal}>
      <MyOwnModal.Actions.Camera
        onDismiss={() => setShowModal(false)}
        onLaunchCamera={() => {
          setShowModal(false)
          _launchImage('camera')
        }}
        onLaunchGallery={() => {
          setShowModal(false)
          _launchImage()
        }}
      />
    </MyOwnModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editContainer : {
    backgroundColor: 'white', 
    width: 30, 
    height: 30, 
    position: 'absolute',
    bottom: 5, 
    right: 5, 
    borderRadius: 8 ,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  text: {
    color: util.Colors.MainColor, 
    fontWeight: 'bold'
  }
})
