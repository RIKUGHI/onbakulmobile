import { faCamera, faImage, faPen, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { Text, View, StyleSheet, Modal, Pressable, FlatList } from 'react-native';
import util from '../../util';
import ActionButton from '../ActionButton';
import Card from '../Card';
import CommonTextInput from '../CommonTextInput';

const MyOwnModal = ({ children, visible }) => {
  return(
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
    >
      {children}
    </Modal>
  )
}

MyOwnModal.Picker = ({ title, isLoading, list, isCategory, isAddMode, setIsAddMode, onPress, onDismiss, onSubmitNewData }) => {
  const [newValue, setNewValue] = useState('')

  return(
    <View 
      style={{
        backgroundColor: util.Colors.ModalBackground,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Pressable 
        style={{
          backgroundColor: 'white',
          width: 330,
          height: 42,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }}
        onPress={() => {
          setIsAddMode(true)
          setNewValue('')
        }}
      >
        <Text style={{color: util.Colors.MainColor, fontSize: 20, fontWeight: 'bold', marginRight: 10}}>Tambah {title}</Text>
        <FontAwesomeIcon icon={faPlus} color={util.Colors.MainColor} size={27} />
      </Pressable>

      <View 
        style={{
          backgroundColor: 'white',
          width: 330,
          maxHeight: 300,
          padding: 10,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: util.Colors.ModalBackground
        }}
      >
        {isAddMode ? (
          <CommonTextInput label={`Nama ${title}`} onChangeText={v => setNewValue(v)} />
        ) : (
          <FlatList
            data={list}
            renderItem={({ item, index }) => <Card
                                                index={index}
                                                totalData={list.length - 1}
                                                onPress={() => onPress(item)}
                                              >
                                                <Card.SingleData label={isCategory ? item.category_name : item.unit_name} />
                                              </Card>
                                            }
            ListEmptyComponent={() => <Text>{title+' tidak tersedia'}</Text>}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View 
        style={{
          backgroundColor: 'white',
          width: 330,
          height: 42,
          flexDirection: 'row',
          justifyContent: 'flex-end', 
          alignItems: 'center',
          paddingHorizontal: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10
        }}
      >
        <Pressable onPress={isAddMode ? () => setIsAddMode(false) : onDismiss}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>Batal</Text>
        </Pressable>
        {isAddMode && (
          <Pressable 
            onPress={isLoading ? undefined : () => onSubmitNewData(isCategory, newValue)}
          >
            <Text style={{color: util.Colors.MainColor, fontSize: 20, fontWeight: 'bold', marginLeft: 10}}>{isLoading ? 'Proses...' : 'Simpan'}</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

MyOwnModal.Purchase = ({ title, isLoading, list, isProduct, onPress, onDismiss, onSubmitNewData }) => {
  return(
    <View 
      style={{
        backgroundColor: util.Colors.ModalBackground,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Pressable 
        style={{
          backgroundColor: 'white',
          width: 330,
          height: 42,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }}
      >
        <Text style={{color: util.Colors.MainColor, fontSize: 20, fontWeight: 'bold', marginRight: 10}}>{isProduct ? 'Produk' : 'Supplier'}</Text>
      </Pressable>

      <View 
        style={{
          backgroundColor: 'white',
          width: 330,
          maxHeight: 300,
          padding: 10,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: util.Colors.ModalBackground
        }}
      >
        <FlatList
            data={list}
            renderItem={({ item, index }) => <Card
                                                index={index}
                                                totalData={list.length - 1}
                                                onPress={() => onPress(item)}
                                              >
                                                <Card.SingleData label={isProduct ? item.product_name : item.supplier_name} />
                                              </Card>
                                            }
            ListEmptyComponent={() => <Text>{title+' tidak tersedia'}</Text>}
            showsVerticalScrollIndicator={false}
          />
      </View>

      <View 
        style={{
          backgroundColor: 'white',
          width: 330,
          height: 42,
          flexDirection: 'row',
          justifyContent: 'flex-end', 
          alignItems: 'center',
          paddingHorizontal: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10
        }}
      >
        <Pressable onPress={onDismiss}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Batal</Text>
        </Pressable>
      </View>
    </View>
  )
}

MyOwnModal.Customer = ({ title, isLoading, list, isAddMode, setIsAddMode, onPress, onDismiss, onSubmitNewData }) => {
  const [newValue, setNewValue] = useState('')

  return(
    <View 
      style={{
        backgroundColor: util.Colors.ModalBackground,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Pressable 
        style={{
          backgroundColor: 'white',
          width: 330,
          height: 42,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }}
        onPress={() => {
          setIsAddMode(true)
          setNewValue('')
        }}
      >
        <Text style={{color: util.Colors.MainColor, fontSize: 20, fontWeight: 'bold', marginRight: 10}}>Tambah {title}</Text>
        <FontAwesomeIcon icon={faPlus} color={util.Colors.MainColor} size={27} />
      </Pressable>

      <View 
        style={{
          backgroundColor: 'white',
          width: 330,
          maxHeight: 300,
          padding: 10,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: util.Colors.ModalBackground
        }}
      >
        {isAddMode ? (
          <CommonTextInput label={`Nama ${title}`} onChangeText={v => setNewValue(v)} />
        ) : (
          <FlatList
            data={list}
            renderItem={({ item, index }) => <Card
                                                index={index}
                                                totalData={list.length - 1}
                                                onPress={() => onPress(item)}
                                              >
                                                <Card.SingleData label={item.customer_name} />
                                              </Card>
                                            }
            ListEmptyComponent={() => <Text>{title+' tidak tersedia'}</Text>}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View 
        style={{
          backgroundColor: 'white',
          width: 330,
          height: 42,
          flexDirection: 'row',
          justifyContent: 'flex-end', 
          alignItems: 'center',
          paddingHorizontal: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10
        }}
      >
        <Pressable onPress={isAddMode ? () => setIsAddMode(false) : onDismiss}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>Batal</Text>
        </Pressable>
        {isAddMode && (
          <Pressable 
            onPress={isLoading ? undefined : () => onSubmitNewData(newValue)}
          >
            <Text style={{color: util.Colors.MainColor, fontSize: 20, fontWeight: 'bold', marginLeft: 10}}>{isLoading ? 'Proses...' : 'Simpan'}</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}


MyOwnModal.Delete = ({ label, onDismiss, onDelete, loading = false }) => {
  return(
    <Pressable 
      style={{
        backgroundColor: util.Colors.ModalBackground,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onPress={onDismiss}
    >
      <View style={{
        backgroundColor: 'white',
        width: 330,
        borderRadius: 10,
        padding: 15
      }}>
        <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15}}>Konfirmasi</Text>
        <Text style={{color: 'black', textAlign: 'center'}}>Apakah kamu yakin akan menghapus</Text>
        <Text style={{color: 'black', textAlign: 'center', fontWeight: 'bold'}}>{label}..?</Text>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <ActionButton label='Tidak' enableMarginRight backgroundColor={util.Colors.Warning} onPress={onDismiss} />
          <ActionButton label='Iya' loading={loading} backgroundColor={util.Colors.MainColor} onPress={onDelete} />
        </View>
      </View>
    </Pressable>
  )
}

MyOwnModal.Actions = ({ onDismiss, onEdit, onDelete }) => {
  return(
    <Pressable
      style={{
        backgroundColor: util.Colors.ModalBackground,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onPress={onDismiss}
    >
      <View
        style={{
          backgroundColor: 'white',
          width: 330,
          height: 80,
          borderRadius: 10,
          padding: 15,
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <Pressable 
          style={[styles.actionButton, {marginRight: 10}]}
          onPress={onEdit}
        >
          <FontAwesomeIcon icon={faPen} color={util.Colors.MainColor} size={27} />
        </Pressable>
        <Pressable 
          style={styles.actionButton}
          onPress={onDelete}
        >
          <FontAwesomeIcon icon={faTrashAlt} color={util.Colors.MainColor} size={27} />
        </Pressable>
      </View>
    </Pressable>
  )
}

MyOwnModal.Actions.Camera = ({onDismiss, onLaunchCamera, onLaunchGallery}) => {
  return(
    <Pressable
      style={{
        backgroundColor: util.Colors.ModalBackground,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onPress={onDismiss}
    >
      <View
        style={{
          backgroundColor: 'white',
          width: 330,
          height: 80,
          borderRadius: 10,
          padding: 15,
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <Pressable 
          style={[styles.actionButton, {marginRight: 10}]}
          onPress={onLaunchCamera}
        >
          <FontAwesomeIcon icon={faCamera} color={util.Colors.MainColor} size={27} />
        </Pressable>
        <Pressable 
          style={styles.actionButton}
          onPress={onLaunchGallery}
        >
          <FontAwesomeIcon icon={faImage} color={util.Colors.MainColor} size={27} />
        </Pressable>
      </View>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButton: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8, 
    shadowRadius: 20,  
    elevation: 2,
    shadowColor: 'black'
    }
})

export default MyOwnModal