import { StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'

import firestore from '@react-native-firebase/firestore'

class firebaseApp extends Component {
    state = {
        user: {
            name: ""
        }
    }
    
    constructor(props){
        super(props);
        this.getUser();
        
    }
    
    getUser= async () =>{
        const userDocument = await firestore().collection("users")
        .doc('vFRqJ5Ei5gXh8nF3hFjb').get()
        console.log(userDocument)
    }
    render(){
        return (
            <View>
              <Text>Name: {this.state.user.name}</Text>
            </View>
          );
    }
}

export default firebaseApp

const styles = StyleSheet.create({})