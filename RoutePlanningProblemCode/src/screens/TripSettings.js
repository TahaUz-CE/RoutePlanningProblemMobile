import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Text, StatusBar, TextInput, Button, FlatList } from "react-native";
import { openDatabase } from "react-native-sqlite-storage";
import { useNavigation } from '@react-navigation/core'

const db = openDatabase({
    name: "rn_sqlite",
});

function TripSettings({ route, navigation }) {

    const { username, password, usertype } = route.params;

    const [category, setCategory] = useState("");
    const [busTripName, setBusTripName] = useState('');
    const [costumerData, setCostumerData] = useState('');
    const [costumerList, setCostumerList] = useState([]);
    const [costumerList1, setCostumerList1] = useState([]);
    const [costumerTourList, setCostumerTourList] = useState([]);
    const [busTrip, setBusTrip] = useState([]);

    const AddCostumerToTheList = () => {
        if (!busTripName && !costumerData) {
            alert("Enter category");
            return false;
        }
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM userStationSelect ORDER BY id DESC`,
                [],
                (sqlTxn, res) => {
                    console.log("categories retrieved successfully");
                    let len = res.rows.length;

                    if (len > 0) {
                        let results = [];
                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i);
                            results.push({ id: item.id, station: item.name });

                            if (costumerData == item.id) {
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
                                                    let item1 = res.rows.item(i);
                                                    results.push({ id: item1.id, station: item1.name });
                                                    if (item.stationname == item1.name) {
                                                        db.transaction(txn => {
                                                            txn.executeSql(
                                                                `INSERT INTO ${busTripName} (username,stationname,date,lat,long) VALUES (?,?,?,?,?)`,
                                                                [item.username, item.stationname, item.date, item1.lat, item1.long],
                                                                (sqlTxn, res) => {
                                                                    console.log(`${busTripName} ${item.username} ${item.stationname} ${item.date} ${item1.lat} ${item1.long} category added successfully`);
                                                                    getTourCostumerListCategories();
                                                                    getCostumerListCategories();
                                                                    setCostumerList("");
                                                                },
                                                                error => {
                                                                    console.log("error on adding category " + error.message);
                                                                },
                                                            );
                                                        });
                                                    }
                                                }
                                            }
                                        },
                                        error => {
                                            console.log("error on getting categories " + error.message);
                                        },
                                    );
                                });

                            }
                        }
                    }
                },
                error => {
                    console.log("error on getting categories " + error.message);
                },
            );
        });
    };

    const delTourCostumerListCategory = () => {
        if (!busTripName && !costumerData) {
            alert("Enter category");
            return false;
        }
        db.transaction(txn => {
            txn.executeSql(
                `DELETE FROM ${busTripName} WHERE id=?`,
                [costumerData],
                (sqlTxn, res) => {
                    console.log(`${costumerData} frome ${busTripName} table deleted successfully`);
                    getTourCostumerListCategories();
                    setCostumerList("");

                },
                error => {
                    console.log("error on adding category " + error.message);
                },
            );
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

    const getTourCostumerListCategories = () => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM userStationSelect ORDER BY id DESC`,
                [],
                (sqlTxn, res) => {
                    console.log("categories retrieved successfully");
                    let len = res.rows.length;

                    if (len > 0) {
                        let results = [];
                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i);
                            results.push({ id: item.id, username: item.username, stationname: item.stationname, date: item.date });
                        }

                        setCostumerList(results);
                    }
                },
                error => {
                    console.log("error on getting categories " + error.message);
                },
            );
        });
    };

    const getCostumerListCategories = () => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM busTripName ORDER BY id DESC`,
                [],
                (sqlTxn, res) => {
                    console.log("categories retrieved successfully");
                    let len = res.rows.length;

                    if (len > 0) {
                        let results1 = [];
                        let results = [];
                        for (let i = 0; i < len; i++) {
                            let item1 = res.rows.item(i);
                            results1.push({ id: item1.id, tripname: item1.tripname });
                            db.transaction(txn => {
                                txn.executeSql(
                                    `SELECT * FROM ${item1.tripname} ORDER BY id DESC`,
                                    [],
                                    (sqlTxn, res) => {
                                        console.log("categories retrieved successfully");
                                        let len = res.rows.length;
                    
                                        if (len > 0) {
                                            for (let i = 0; i < len; i++) {
                                                let item = res.rows.item(i);
                                                results.push({ id: item.id, tourname: item1.tripname, username: item.username, stationname: item.stationname, date: item.date, lat: item.lat, long: item.long });
                                            }
                                            
                                        }
                                    },
                                    error => {
                                        console.log("error on getting categories " + error.message);
                                    },
                                );
                            });
                        }
                        setCostumerTourList(results);
                        setBusTrip(results1);
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

    const renderCostumerListCategory = ({ item }) => {
        return (
            <View style={{
                flexDirection: "column",
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderColor: "#ddd",
            }}>
                <Text style={{ marginRight: 9 }}>{"Id: " + item.id}</Text>
                <Text style={{ marginRight: 9 }}>{"Username: " + item.username}</Text>
                <Text style={{ marginRight: 9 }}>{"Station: " + item.stationname}</Text>
                <Text style={{ marginRight: 9 }}>{"Ticket Date: " + item.date}</Text>
            </View>
        );
    };



    const renderCostumerTourListCategory = ({ item }) => {

        return (
            <View style={{
                flexDirection: "column",
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderColor: "#ddd",
            }}>
                <Text style={{ marginRight: 9 }}>{"Tour: " + item.tourname}</Text>
                <Text style={{ marginRight: 9 }}>{"Id: " + item.id}</Text>
                <Text style={{ marginRight: 9 }}>{"Username: " + item.username}</Text>
                <Text style={{ marginRight: 9 }}>{"Station: " + item.stationname}</Text>
                <Text style={{ marginRight: 9 }}>{"Ticket Date: " + item.date}</Text>
                <Text style={{ marginRight: 9 }}>{"Lat: " + item.lat}</Text>
                <Text style={{ marginRight: 9 }}>{"Long: " + item.long}</Text>
            </View>
        );

    };

    useEffect(() => {
        (async () => {
            await getTripCategories();
            await getTourCostumerListCategories();
            await getCostumerListCategories();
        })();
    }, []);


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <View style={{ height: '100%' }}>
                <StatusBar backgroundColor="#222" />

                {/* <Text>UserScreen: {username} {password} {usertype}</Text> */}

                <Text style={{ marginDown: 9 }} >List of Trip</Text>
                <FlatList
                    style={{ height: '1%' }}
                    data={busTrip}
                    renderItem={renderTripCategory}
                    key={cat => cat.id}
                />

                <Text style={{ marginTop: 9 }}>List of Customer</Text>
                <FlatList
                    style={{ height: '5%' }}
                    data={costumerList}
                    renderItem={renderCostumerListCategory}
                    key={cat1 => cat1.id}
                />
                <Text style={{ marginTop: 1 }}></Text>
                <TextInput
                    placeholder="Trip Name"
                    value={busTripName}
                    onChangeText={setBusTripName}
                    style={styles.input}
                />
                <Text style={{ marginTop: 1 }}></Text>
                <TextInput
                    placeholder="Customer ID"
                    value={costumerData}
                    onChangeText={setCostumerData}
                    style={styles.input}
                />
                <Text style={{ marginTop: 1 }}></Text>
                <Button style={styles.buttonOutlineText} title="Add to the List" onPress={AddCostumerToTheList} />
                <Text style={{ marginTop: 1 }}></Text>
                <Button style={styles.buttonOutlineText} title="Delete to the List" onPress={delTourCostumerListCategory} />

                <FlatList
                    style={{ height: '28%' }}
                    data={costumerTourList}
                    renderItem={renderCostumerTourListCategory}
                    key={cat2 => cat2.id}
                />
            </View>
        </KeyboardAvoidingView>

    )
}

export default TripSettings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
})