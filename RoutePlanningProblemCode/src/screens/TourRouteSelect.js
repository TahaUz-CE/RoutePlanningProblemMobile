import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TextInput,
    Button,
    TouchableOpacity,
} from 'react-native';
import { openDatabase } from "react-native-sqlite-storage";

const db = openDatabase({
    name: "rn_sqlite",
});

function HomeScreen({ route, navigation }) {

    const { username, password, usertype } = route.params;
    const [categories, setCategories] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState('');
    const [busTrip, setBusTrip] = useState([]);
    const [stationNameAndCor, setStationNameAndCor] = useState([]);

    const getCostumerListCategories = () => {

        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM ${selectedTrip} ORDER BY id DESC`,
                [],
                (sqlTxn, res1) => {
                    console.log("categories retrieved successfully");
                    let len1 = res1.rows.length;

                    if (len1 > 0) {
                        let results = [];
                        for (let i = 0; i < len1; i++) {
                            let item = res1.rows.item(i);
                            results.push({ id: item.id, tourname: selectedTrip, username: item.username, station: item.stationname, date: item.date, latitude: item.lat, longitude: item.long });
                            console.log({ id: item.id, tourname: selectedTrip, username: item.username, station: item.stationname, date: item.date, latitude: item.lat, longitude: item.long })
                        }
                        setCategories(results);
                        alert(selectedTrip + ' islemi tamamlandi')
                        // setTimeout(tourRoute,
                        //     20000
                        // )
                    }
                },
                error => {
                    console.log("error on getting categories " + error.message);
                },
            );
        });

    };

    const tourRoute = () => {
        navigation.navigate('tourRoute', {
            username: username,
            password: password,
            usertype: usertype,
            tourRouteMarker: categories,
            stationName: stationNameAndCor,
        });
    };

    const getTripCategories = () => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM busTripName ORDER BY id DESC`,
                [],
                (sqlTxn, res) => {
                    console.log("categories retrieved successfully");
                    let len = res.rows.length;

                    if (len > 0) {
                        let results = [];
                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i);
                            results.push({ id: item.id, tripname: item.tripname });
                        }

                        setBusTrip(results);
                    }
                },
                error => {
                    console.log("error on getting categories " + error.message);
                },
            );
        });
    };

    const getStationCategories = () => {
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
                            results.push({ latitude: parseFloat(item.lat), longitude: parseFloat(item.long) });
                            //console.log({ station: item.name ,latitude: parseFloat(item.lat), longitude: parseFloat(item.long) });
                        }
                        //console.log("results")
                        //console.log(results[0]);

                        setStationNameAndCor(results);
                    }
                },
                error => {
                    console.log("error on getting categories " + error.message);
                },
            );
        });
    };

    const renderTripCategory = ({ item }) => {
        return (
            <View style={{
                flexDirection: "column",
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderColor: "#ddd",
            }}>
                <Text style={{ marginRight: 9 }}>{item.id + ". Trip: " + item.tripname}</Text>
            </View>
        );
    };

    useEffect(() => {
        (async () => {
            await getTripCategories();
            await getStationCategories();
        })();
    }, []);


    return (
        <View style={styles.body}>
            <Text style={{ marginDown: 9 }} >List of Trip</Text>
            <FlatList
                data={busTrip}
                renderItem={renderTripCategory}
                key={cat => cat.id}
            />
            <TextInput
                placeholder="Trip Name"
                value={selectedTrip}
                onChangeText={setSelectedTrip}
                style={styles.input}
            />
            <TouchableOpacity
                onPress={getCostumerListCategories}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Select Trip</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={tourRoute}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Load Map</Text>
            </TouchableOpacity>
            
            {/* <Button style={styles.buttonOutlineText} title="Select Trip" onPress={getCostumerListCategories} /> */}
            {/* <Button style={styles.buttonOutlineText} title="Load Page" onPress={tourRoute} /> */}
            <Text style={{ marginTop: 1 }}></Text>


        </View>
    )


}

export default HomeScreen

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 40,
        margin: 10,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
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