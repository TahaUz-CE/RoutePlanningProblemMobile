import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Text, StatusBar, TextInput, Button, FlatList } from "react-native";
import { openDatabase } from "react-native-sqlite-storage";
import { useNavigation } from '@react-navigation/core'

const db = openDatabase({
  name: "rn_sqlite",
});

function DayOneTour ({ route, navigation }) {

  const { username, password, usertype } = route.params;

  const [category, setCategory] = useState("");
  const [busTripName, setBusTripName] = useState('');
  const [stationUserDate, setStationUserDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [busTrip, setBusTrip] = useState([]);

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS busTripName (id INTEGER PRIMARY KEY AUTOINCREMENT, tripname VARCHAR(20))`,
        [],
        (sqlTxn, res) => {
          console.log("busTripName table created successfully");
        },
        error => {
          console.log("error on creating table " + error.message);
        },
      );
    });
  };

  const createTripTables = () => {
    if (!busTripName) {
        alert("Enter category");
        return false;
    }
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS ${busTripName} (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20), stationname VARCHAR(20), date VARCHAR(20), lat VARCHAR(20), long VARCHAR(20))`,
        [],
        (sqlTxn, res) => {
          console.log("table created successfully");
          db.transaction(txn => {
            txn.executeSql(
              `INSERT INTO busTripName (tripname) VALUES (?)`,
              [busTripName],
              (sqlTxn, res) => {
                alert(`Created table for ${busTripName} trip`);
                getTripCategories();
                setCategory("");
              },
              error => {
                console.log("error on adding category " + error.message);
              },
            );
          });
        },
        error => {
          console.log("error on creating table " + error.message);
        },
      );
    });
  };

  const delTripCategory = () => {
    if (!busTripName) {
        alert("Enter category");
        return false;
      }
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
                results.push({ id: item.id, tripname: item.tripname});
  
                if(item.tripname == busTripName){
                  
                  db.transaction(txn => {
                    txn.executeSql(
                      `DELETE FROM busTripName WHERE id=?`,
                      [item.id],
                      (sqlTxn, res) => {
                        console.log(`${item.id} busTripName delete successfully`);
                        getTripCategories();
                        setCategory("");

                        db.transaction(txn => {
                            txn.executeSql(
                              `DROP TABLE ${busTripName}`,
                              [],
                              (sqlTxn, res) => {
                                alert(`${busTripName} table drop`);
                              },
                              error => {
                                console.log("error on adding category " + error.message);
                              },
                            );
                          });

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
              results.push({ id: item.id, tripname: item.tripname});
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

  const renderTripCategory = ({ item }) => {
    return (
      <View style={{
        flexDirection: "column",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
      }}>
        <Text style={{ marginRight: 9 }}>{item.id+". Trip: " + item.tripname}</Text>
      </View>
    );
  };

  useEffect(() => {
    (async () => {
        await createTables();
        await getTripCategories();
    })();
    }, []);


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.buttonContainer}>
      <StatusBar backgroundColor="#222" />

      {/* <Text>UserScreen: {username} {password} {usertype}</Text> */}
      <Text>{username} Please Select Trip</Text>

      <FlatList
        data={busTrip}
        renderItem={renderTripCategory}
        key={cat => cat.id}
      />
      <Text></Text>
      <TextInput
        placeholder="Trip Name"
        value={busTripName}
        onChangeText={setBusTripName}
        style={styles.input}
      />
      <Text></Text>
      <Button style={styles.buttonOutlineText} title="Create Trip" onPress={createTripTables} />
      <Text></Text>
      <Button style={styles.buttonOutlineText} title="Cancel Trip" onPress={delTripCategory} />
    </View>
    </KeyboardAvoidingView>
    
  )
}

export default DayOneTour

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