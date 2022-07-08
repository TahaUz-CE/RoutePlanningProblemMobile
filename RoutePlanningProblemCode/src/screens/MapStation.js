import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { Marker } from 'react-native-maps';
import GlobalStyle from '../utils/GlobalStyle';
import MapView from 'react-native-maps';
import { openDatabase } from "react-native-sqlite-storage";

function MapStation({ route }) {

    const { username, password, usertype } = route.params;
    const [categories, setCategories] = useState([]);

    const db = openDatabase({
        name: "rn_sqlite",
    });

    // const markers = {
    //     latitude,
    //     longitude,
    //     latitudeDelta,
    //     longitudeDelta,
    // };

    const markers2 = {
        latitude: 41.766666,
        longitude: 30.916668,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const getCategories = () => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM stationdata ORDER BY id DESC`,
                [],
                (sqlTxn, res) => {
                    console.log("categories retrieved successfully");
                    let len = res.rows.length;

                    if (len > 0) {
                        let results = [];
                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i);
                            results.push({ station: item.name ,latitude: parseFloat(item.lat), longitude: parseFloat(item.long) });
                            console.log({ station: item.name ,latitude: parseFloat(item.lat), longitude: parseFloat(item.long) });
                        }
                        console.log("results")
                        console.log(results[0]);

                        setCategories(results);
                    }
                },
                error => {
                    console.log("error on getting categories " + error.message);
                },
            );
        });
    };

    const getDene = () => {
        console.log("Dene");
    };

    const getRender = ({ item }) => {
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

                ><Marker coordinate={{
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.long),
                }} title="İzmit" /></MapView>
            </View>
        );
    };

    useEffect(() => {
        (async () => {
            await getCategories();
            await getDene();
        })();
    }, []);

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

            >{categories.map((val, index) => {
                return (<MapView.Marker
                        coordinate={{
                        latitude: parseFloat(val.latitude),
                        longitude:parseFloat(val.longitude)
                        }}
                        key={index}
                        title = {val.station}
                        />); 

                })}
            </MapView>

        </View>
    );
}

export default MapStation

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
        height: '100%',
    }
});