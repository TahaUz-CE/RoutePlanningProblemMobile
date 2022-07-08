import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SqlScreen from "./screens/sqlitedatabase";
import HomeScreen from "./screens/HomeScreen";
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import AdminScreen from "./screens/AdminScreen";
import UserScreen from "./screens/UserScreen";


const Stack = createStackNavigator();

function App() {
    return (
      <Provider store={Store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="sqlitedatabase"
            screenOptions={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#0080ff'
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontSize: 25,
                fontWeight: 'bold'
              }
            }}
          >
            <Stack.Screen
              name="sqlitedatabase"
              component={SqlScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              name="admin"
              component={AdminScreen}
            />

            <Stack.Screen
              name="user"
              component={UserScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
  
  export default App;