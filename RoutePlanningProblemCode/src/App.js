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
import MapStation from "./screens/MapStation";
import Adminuseredit from "./screens/Adminuseredit";
import DayOneTour from "./screens/DayOneTour";
import TripSettings from "./screens/TripSettings";
import TourRouteSelect from "./screens/TourRouteSelect";
import TourRoute from "./screens/TourRoute";

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

            <Stack.Screen
              name="mapStation"
              component={MapStation}
            />

            <Stack.Screen
              name="adminUserEdit"
              component={Adminuseredit}
            />

            <Stack.Screen
              name="dayOneTour"
              component={DayOneTour}
            />

            <Stack.Screen
              name="tripSettings"
              component={TripSettings}
            />

            <Stack.Screen
              name="tourRouteSelect"
              component={TourRouteSelect}
            />

            <Stack.Screen
              name="tourRoute"
              component={TourRoute}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
  
  export default App;