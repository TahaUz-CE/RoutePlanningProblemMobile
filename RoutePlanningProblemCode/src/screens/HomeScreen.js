import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

function HomeScreen({ route, navigation }) {

  const { username, password, usertype } = route.params;

  const handleSignOut = () => {
    navigation.replace("sqlitedatabase")
  }

  const adminScreenTurn = () => {
    navigation.navigate('admin',{
      username: username,
      password: password,
      usertype: usertype,
  });
  }

  const userScreenTurn = () => {
    navigation.navigate('user',{
      username: username,
      password: password,
      usertype: usertype,
  });
  }

  const mapStation = () => {
    navigation.navigate('mapStation',{
      username: username,
      password: password,
      usertype: usertype,
  });
  }

  const adminUserEdit = () => {
    navigation.navigate('adminUserEdit',{
      username: username,
      password: password,
      usertype: usertype,
  });
  }

  const tripEdit = () => {
    navigation.navigate('dayOneTour',{
      username: username,
      password: password,
      usertype: usertype,
  });
  }

  const tourSettings = () => {
    navigation.navigate('tripSettings',{
      username: username,
      password: password,
      usertype: usertype,
  });
  }

  const tourRouteSelect = () => {
    navigation.navigate('tourRouteSelect',{
      username: username,
      password: password,
      usertype: usertype,
  });
  }

  if(usertype != "admin"){
    return (
      <View style={styles.container}>
        <Text> Welcome {username} {password} {usertype}</Text>
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={userScreenTurn}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Durak Seç</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={mapStation}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Duraklar</Text>
        </TouchableOpacity>
  
      </View>
    )
  }else{
    return (
      <View style={styles.container}>
        <Text> Welcome {username} {password} {usertype}</Text>
        
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={adminScreenTurn}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Station Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={mapStation}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Map Station</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={adminUserEdit}
          style={styles.button}
        >
          <Text style={styles.buttonText}>User Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={tripEdit}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Trip Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={tourSettings}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Tour Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={tourRouteSelect}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Tour Route</Text>
        </TouchableOpacity>
  
      </View>
    )
  }
  
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
   button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})