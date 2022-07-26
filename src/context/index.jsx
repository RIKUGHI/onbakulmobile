import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { Component, createContext } from "react"

const RootContext = createContext()

// Provider
const Provider = RootContext.Provider
export default function GlobalProvider(Children) {
  return(
    class ParentComp extends Component{
      constructor(props){
        super(props)
        this.state = {
          login: false,
          level: 0,
          display_name: 'Test Display Name',
          business_name: 'Loading Business Name',
          id_category: 0,
          id_owner: 0,
          id_outlet: 0,
          owner_code: '',
          products_ro: false,
          units_ro: false,
          categories_ro: false,
          customers_ro: false,
          suppliers_ro: false,
          outlets_ro: false,
          transactions_ro: false,
          purchases_ro: false,
          logout: async (cb) => {
            try {
              await AsyncStorage.clear()
              cb()
            } catch (error) {
              console.log(error);
            }
          }
        }
      }

      componentDidMount(){

      }
    
      render(){
        return(
          <Provider value={
            {
              state: this.state
            }
          }>
            <Children />
          </Provider>
        )
      }
    }
  )
}

// Consumer
const Consumer = RootContext.Consumer
export const GlobalConsumer = (Children) => {
  return(
    class ParentConsumer extends Component{
      render(){
        return(
          <Consumer>
            {
              value => {
                return(
                  <Children {...this.props} {...value} />
                )
              }
            }
          </Consumer>
        )
      }
    }
  )
}
