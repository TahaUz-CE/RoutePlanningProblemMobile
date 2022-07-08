import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import { Marker } from 'react-native-maps';
import GlobalStyle from '../utils/GlobalStyle';
import MapView from 'react-native-maps';
import { openDatabase } from "react-native-sqlite-storage";
import MapViewDirections from 'react-native-maps-directions';

function TourRoute({ route, navigation }) {

    const { username, password, usertype, tourRouteMarker, stationName} = route.params;
    const [categories, setCategories] = useState([]);
    var say=0;
    var ad = "";
    const GOOGLE_MAP_KEY = 'AIzaSyAVHRhwshNUdWUr5FmBfTExhUfUUGk4Nss';

    const db = openDatabase({
        name: "rn_sqlite",
    });

    const tourRouteSelect = () => {
        navigation.navigate('tourRouteSelect', {
            username: username,
            password: password,
            usertype: usertype,
        });
    }
    
    return (
        <View style={styles.body}>
            <Text style={[
                GlobalStyle.CustomFont,
                styles.text
            ]}>
                {"Map"}
            </Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 40.766666,
                    longitude: 29.916668,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}

            >{tourRouteMarker.map((val, index) => {
                
                say=0;
                ad = "";
                {tourRouteMarker.map((val1, index1) => {
                //console.log(val1.station);
                if(val.station == val1.station){
                    say += 1;
                    ad = ad + val1.username +",";
                }
                })}
                
                //console.log(val.station);
                return (<MapView.Marker
                    coordinate={{
                        latitude: parseFloat(val.latitude),
                        longitude: parseFloat(val.longitude)
                    }}
                    key={index}
                    title={"Durak: " + val.station}
                    description={ad + " " + val.tourname + " Duraktaki Kişi: " + say}
                ></MapView.Marker>
                );
                
            })}

            
            {Object.keys(stationName).length > 0 && (<MapViewDirections
                        origin={{
                            latitude: 41.766666,
                            longitude: 30.916668,
                        }}
                        destination={{
                            latitude: 42.766666,
                            longitude: 29.916668,
                        }}
                        apikey={GOOGLE_MAP_KEY}
                        strokeWidth={6}
                        strokeColor="red"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            fetchTime(result.distance, result.duration),
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: {
                                        // right: 30,
                                        // bottom: 300,
                                        // left: 30,
                                        // top: 100,
                                    },
                                });
                        }}
                        onError={(errorMessage) => {
                            // console.log('GOT AN ERROR');
                        }}
                    />)}

            </MapView>
            <TouchableOpacity
                onPress={tourRouteSelect}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Tour Route Select</Text>
            </TouchableOpacity>
        </View>

    );
}

export default TourRoute

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 40,
        margin: 10,
    },
    map: {
        width: '100%',
        height: '50%',
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
});