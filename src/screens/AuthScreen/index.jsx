import { faEnvelope, faLock, faStore, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { StackActions } from '@react-navigation/native';
import axios from 'axios';
import React, { Component } from 'react';
import { Text, View, StyleSheet, ToastAndroid, Dimensions, Pressable } from 'react-native';
import { ActionButton } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';
import FormItem from './FormItem';

const defaultFormLogin = {
  login_as: 0,
  email: {
    error: true,
    errorMessage: 'Format email salah',
    value: ''
  },
  owner_code: {
    error: true,
    errorMessage: 'Kode tidak valid',
    value: ''
  },
  password: {
    error: true,
    errorMessage: 'Password minimal lebih dari 3 karakter',
    value: ''
  },
  pin: {
    error: true,
    errorMessage: 'Pin minimal lebih dari 3 karakter',
    value: ''
  }
}

const defaultFormSignUp = {
  bussiness_name: {
    error: true,
    errorMessage: 'Nama usaha minimal lebih dari 3 karakter',
    value: ''
  },
  owner_name: {
    error: true,
    errorMessage: 'Nama pemilik minimal lebih dari 3 karakter',
    value: ''
  },
  email: {
    error: true,
    errorMessage: 'Format email salah',
    value: ''
  },
  password: {
    error: true,
    errorMessage: 'Password minimal lebih dari 3 karakter',
    value: ''
  }
}

class AuthScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      height: Dimensions.get('window').height / 1.8,
      isLogin: true,
      isLoading: false,
      formLogin: defaultFormLogin,
      formSignUp: defaultFormSignUp
    }
    this._onSubmit = this._onSubmit.bind(this)
  }

  componentDidMount(){
    // console.log(this.props.state);
  }
  
  componentDidUpdate(){
    // console.log('updated auth state', this.props.state);
    // if (this.props.state.login) this.props.navigation.dispatch(StackActions.replace('Main'))
  }

  async _onSubmit(){
    if (this.state.isLogin) {
      if ((this.state.formLogin.login_as === 0 && (this.state.formLogin.email.error || this.state.formLogin.password.error)) || (this.state.formLogin.login_as === 1 && (this.state.formLogin.owner_code.error || this.state.formLogin.pin.error))) {
        ToastAndroid.show('Semua inputan tidak boleh kosong dan icon harus berwarna hijau', ToastAndroid.SHORT)
      } else {
        const data = new FormData()
        data.append('level', this.state.formLogin.login_as.toString())
        data.append('email', this.state.formLogin.email.value.toString())
        data.append('owner_code', this.state.formLogin.owner_code.value.toString())
        data.append('password', this.state.formLogin.login_as === 0 ? this.state.formLogin.password.value : this.state.formLogin.pin.value)
      
        this.setState({isLoading: true})
        const res = await util.CallAPIPost('auth/login', data, (success, message) => {
          // nothing to do
        })
        console.log(res);
        if (res.response_code === 200) {
          try {
            await AsyncStorage.multiSet([
              ['login', 'true'],
              ['level', res.result.level.toString()],
              ['id_owner', res.result.id_owner.toString()],
              ['owner_name', res.result.owner_name.toString()],
              ['business_name', res.result.business_name.toString()],
              ['id_category', res.result.id_category.toString()],
              ['id_outlet', res.result.id_outlet.toString()],
              ['outlet_name', res.result.outlet_name.toString()],
              ['owner_code', res.result.owner_code.toString()],
              ['products_ro', res.result.products_ro.toString()],
              ['units_ro', res.result.units_ro.toString()],
              ['categories_ro', res.result.categories_ro.toString()],
              ['customers_ro', res.result.customers_ro.toString()],
              ['suppliers_ro', res.result.suppliers_ro.toString()],
              ['outlets_ro', res.result.outlets_ro.toString()],
              ['transactions_ro', res.result.transactions_ro.toString()],
              ['purchases_ro', res.result.purchases_ro.toString()]
            ])

            this.props.navigation.dispatch(StackActions.replace('Main'))
          } catch(e) {
            console.log(e);
            ToastAndroid.show(e, ToastAndroid.SHORT)
          }
        } else {
          ToastAndroid.show(res.result.message, ToastAndroid.SHORT)
        }

        this.setState({isLoading: false})
      }
    } else {
      if (this.state.formSignUp.bussiness_name.error || this.state.formSignUp.owner_name.error || this.state.formSignUp.email.error || this.state.formSignUp.password.error ) {
        ToastAndroid.show('Semua inputan tidak boleh kosong dan icon harus berwarna hijau', ToastAndroid.SHORT)
      } else {
        const data = new FormData()
      
        data.append('business_name', this.state.formSignUp.bussiness_name.value.toString().trim())
        data.append('owner_name', this.state.formSignUp.owner_name.value.toString().trim())
        data.append('email', this.state.formSignUp.email.value.toString().trim())
        data.append('password', this.state.formSignUp.password.value.toString().trim())
    
        this.setState({isLoading: true})
        const res = await util.CallAPIPost('auth/signup', data, (success, message) => {
          // nothing to do
        })

        if (res.response_code === 200) {
          try {
            await AsyncStorage.multiSet([
              ['login', 'true'],
              ['level', '0'],
              ['id_owner', res.result.id_owner.toString()],
              ['owner_name', res.result.owner_name.toString()],
              ['business_name', res.result.business_name.toString()],
              ['id_outlet', res.result.id_outlet.toString()],
              ['outlet_name', res.result.outlet_name.toString()],
              ['owner_code', res.result.owner_code.toString()],
            ])

            this.props.navigation.dispatch(StackActions.replace('Main'))
          } catch(e) {
            console.log(e);
            ToastAndroid.show(e, ToastAndroid.SHORT)
          }
        } else {
          ToastAndroid.show(res.result.message, ToastAndroid.SHORT)
        }

        this.setState({isLoading: false})
      }
    }
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 28}}>{this.state.isLogin ? 'Masuk' : 'Daftar'}</Text>
        </View>
        <View style={[styles.form, {maxHeight: this.state.height, minHeight: 250}]}>
          {this.state.isLogin ? (
            <View>
              <View style={{height: 45, marginBottom: 10}}>
                <Picker 
                  style={{backgroundColor: util.Colors.SecondaryWhite, flex: 1, height: 42}}
                  selectedValue={this.state.formLogin.login_as}
                  mode='dropdown'
                  onValueChange={v => this.setState({
                    formLogin: {
                      ...defaultFormLogin,
                      login_as: parseInt(v)
                    }
                  })}
                >
                  <Picker.Item label='Pemilik' value={0} />
                  <Picker.Item label='Toko' value={1} />
                </Picker>
              </View>
              {
                this.state.formLogin.login_as === 0 ? (
                  <View>
                    <FormItem 
                      icon={faEnvelope} 
                      placeholder='Email' 
                      warning={this.state.formLogin.email.error}
                      warningMessage={this.state.formLogin.email.errorMessage}
                      value={this.state.formLogin.email.value}
                      onChangeText={v => {
                        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (regex.test(String(v).toLowerCase())) {
                          this.setState({
                            formLogin: {
                              ...this.state.formLogin,
                              email: {
                                error: false,
                                errorMessage: '',
                                value: v
                              }
                            }
                          })
                        } else {
                          this.setState({
                            formLogin: {
                              ...this.state.formLogin,
                              email: {
                                ...this.state.formLogin.email,
                                error: true,
                                value: v
                              }
                            }
                          })
                        }
                      }}
                    />
                    <FormItem 
                      icon={faLock} 
                      placeholder='Password' 
                      secureTextEntry
                      warning={this.state.formLogin.password.error}
                      warningMessage={this.state.formLogin.password.errorMessage}
                      value={this.state.formLogin.password.value}
                      onChangeText={v => this.setState({
                        formLogin: {
                          ...this.state.formLogin,
                          password: {
                            ...this.state.formLogin.password,
                            error: v.length < 4,
                            value: v
                          }
                        }
                      })}
                    />
                  </View>
                ) : (
                  <View>
                    <FormItem 
                      icon={faStore} 
                      placeholder='Kode Pemilik' 
                      warning={this.state.formLogin.owner_code.error}
                      warningMessage={this.state.formLogin.owner_code.errorMessage}
                      value={this.state.formLogin.owner_code.value}
                      onChangeText={v => this.setState({
                        formLogin: {
                          ...this.state.formLogin,
                          owner_code: {
                            ...this.state.formLogin.owner_code,
                            error: v.length < 4,
                            value: v
                          }
                        }
                      })}
                    />
                    <FormItem 
                      icon={faLock} 
                      placeholder='Pin' 
                      secureTextEntry
                      warning={this.state.formLogin.pin.error}
                      warningMessage={this.state.formLogin.pin.errorMessage}
                      value={this.state.formLogin.pin.value}
                      onChangeText={v => this.setState({
                        formLogin: {
                          ...this.state.formLogin,
                          pin: {
                            ...this.state.formLogin.pin,
                            error: v.length < 4,
                            value: v
                          }
                        }
                      })}
                    />
                  </View>
                )
              }
            </View>
          ) : (
            <View>
              <FormItem 
                icon={faStore} 
                placeholder='Nama Usaha' 
                warning={this.state.formSignUp.bussiness_name.error}
                warningMessage={this.state.formSignUp.bussiness_name.errorMessage}
                value={this.state.formSignUp.bussiness_name.value}
                onChangeText={v => this.setState({
                  formSignUp: {
                    ...this.state.formSignUp,
                    bussiness_name: {
                      ...this.state.formSignUp.bussiness_name,
                      error: v.length < 4,
                      value: v
                    }
                  }
                })}
              />
              <FormItem 
                icon={faUser} 
                placeholder='Nama Pemilik' 
                warning={this.state.formSignUp.owner_name.error}
                warningMessage={this.state.formSignUp.owner_name.errorMessage}
                value={this.state.formSignUp.owner_name.value}
                onChangeText={v => this.setState({
                  formSignUp: {
                    ...this.state.formSignUp,
                    owner_name: {
                      ...this.state.formSignUp.owner_name,
                      error: v.length < 4,
                      value: v
                    }
                  }
                })}
              />
              <FormItem 
                icon={faEnvelope} 
                placeholder='Email' 
                warning={this.state.formSignUp.email.error}
                warningMessage={this.state.formSignUp.email.errorMessage}
                value={this.state.formSignUp.email.value}
                onChangeText={v => {
                  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                  if (regex.test(String(v).toLowerCase())) {
                    axios.get(util.ServerUrl+'auth/checkemail', {
                      params: {
                        email: v.trim()
                      }
                    }).then(res => {
                      this.setState({
                        formSignUp: {
                          ...this.state.formSignUp,
                          email: {
                            error: res.data.response_code === 200 ? false : true,
                            errorMessage: res.data.result.message,
                            value: v
                          }
                        }
                      })
                    }).catch(err => console.log(err))
                  } else {
                    this.setState({
                      formSignUp: {
                        ...this.state.formSignUp,
                        email: {
                          ...this.state.formSignUp.email,
                          error: true,
                          value: v
                        }
                      }
                    })
                  }
                }}
              />
              <FormItem 
                icon={faLock} 
                placeholder='Password' 
                secureTextEntry
                warning={this.state.formSignUp.password.error}
                warningMessage={this.state.formSignUp.password.errorMessage}
                value={this.state.formSignUp.password.value}
                onChangeText={v => this.setState({
                  formSignUp: {
                    ...this.state.formSignUp,
                    password: {
                      ...this.state.formSignUp.password,
                      error: v.length < 4,
                      value: v
                    }
                  }
                })}
              />
            </View>
          )}

          <View style={{
            width: '100%',
            height: 42.,
            marginVertical: 10
          }}>
            <ActionButton 
              label={this.state.isLogin ? 'Masuk' : 'Daftar'}
              backgroundColor={util.Colors.MainColor} 
              loading={this.state.isLoading}
              onPress={this.state.isLoading ? undefined : this._onSubmit}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{color: 'black'}}>{this.state.isLogin ? 'Belum' : 'Sudah'} punya akun?</Text>
            <Pressable onPress={() => this.setState({
              isLogin: !this.state.isLogin,
              formLogin: defaultFormLogin,
              formSignUp: defaultFormSignUp
            })}>
              <Text style={{color: util.Colors.MainColor, fontWeight: 'bold'}}>{this.state.isLogin ? 'Daftar' : 'Masuk'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: util.Colors.MainColor
  },
  form: {
    backgroundColor: 'white',
    padding: 15,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40
  }
})

export default GlobalConsumer(AuthScreen)