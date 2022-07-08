import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Text, StatusBar, TextInput, Button, FlatList } from "react-native";
import { openDatabase } from "react-native-sqlite-storage";
import { useNavigation } from '@react-navigation/core'

const db = openDatabase({
  name: "rn_sqlite",
});

function UserScreen ({ route, navigation }) {

  const { username, password, usertype } = route.params;

  const [category, setCategory] = useState("");
  const [stationUser, setStationUser] = useState('');
  const [stationUserDate, setStationUserDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [stationName, setStationName] = useState([]);

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS userStationSelect (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20), stationname VARCHAR(20), date VARCHAR(20))`,
        [],
        (sqlTxn, res) => {
          console.log("table created successfully");
        },
        error => {
          console.log("error on creating table " + error.message);
        },
      );
    });
  };

  const addCategory = () => {
    if (!stationUser && !stationUserDate) {
      alert("Enter category");
      return false;
    }

    console.log(username)
    console.log(stationUser)
    console.log(stationUserDate)
    
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
              results.push({ id: item.id, station: item.name});
              
              if(stationUser == item.name){
                
                db.transaction(txn => {
                  txn.executeSql(
                    `INSERT INTO userStationSelect (username,stationname,date) VALUES (?,?,?)`,
                    [username,stationUser,stationUserDate],
                    (sqlTxn, res) => {
                      console.log(`${category} category added successfully`);
                      getCategories();
                      setCategory("");
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

  const delCategory = () => {
    if (!stationUser && !stationUserDate) {
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
              results.push({ id: item.id, username: item.username, stationname: item.stationname, date: item.date });

              if(item.username == username && item.stationname == stationUser && item.date == stationUserDate){
                
                db.transaction(txn => {
                  txn.executeSql(
                    `DELETE FROM userStationSelect WHERE id=?`,
                    [item.id],
                    (sqlTxn, res) => {
                      console.log(`${item.id} category delete successfully`);
                      getCategories();
                      setCategory("");
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

  const updateCategory = () => {
    if (!stationUser && !stationUserDate) {
      alert("Enter category");
      return false;
    }
    console.log(stationUserDate)
    console.log(username)
    console.log(stationUser)

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

              if(item.username == username && item.stationname == stationUser){
                db.transaction(txn => {
                  txn.executeSql(
                    `UPDATE userStationSelect SET date=? WHERE id=?`,
                    [stationUserDate,item.id],
                    (sqlTxn, res) => {
                      console.log(`${item.id} category update successfully`);
                      getCategories();
                      setCategory("");
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

  const getCategories = () => {
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

            setCategories(results);
          }
        },
        error => {
          console.log("error on getting categories " + error.message);
        },
      );
    });
  };

  const getStationName = () => {
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
              results.push({ id: item.id, station: item.name});
            }

            setStationName(results);
          }
        },
        error => {
          console.log("error on getting categories " + error.message);
        },
      );
    });
  };

  const renderSelectedStation = ({ item }) => {
    if(item.username == username){
      return (
        <View style={{
          flexDirection: "column",
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderColor: "#ddd",
        }}>
          {/* <Text style={{ marginRight: 9 }}>{"Id: " + item.id}</Text> */}
          <Text style={{ marginRight: 9 }}>{"Username: " + item.username}</Text>
          <Text style={{ marginRight: 9 }}>{"Station: "  + item.stationname}</Text>
          <Text style={{ marginRight: 9 }}>{"Ticket Date: " + item.date}</Text>
        </View>
      );
    }
    
  };

  const renderCategory = ({ item }) => {
    return (
      <View style={{
        flexDirection: "column",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
      }}>
        <Text style={{ marginRight: 9 }}>{item.id+". Station: " + item.station}</Text>
      </View>
    );
  };

  useEffect(() => {
    (async () => {
        await createTables();
        await getStationName();
        await getCategories();
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
      <Text>{username} Please Select Station</Text>

      <FlatList
        data={stationName}
        renderItem={renderCategory}
        key={cat => cat.id}
      />

      <TextInput
        placeholder="Durak İsmi"
        value={stationUser}
        onChangeText={setStationUser}
        style={styles.input}
      />

      <TextInput
        placeholder="Date"
        value={stationUserDate}
        onChangeText={setStationUserDate}
        style={styles.input}
      />

      <Button style={styles.buttonOutlineText} title="Buy Ticket" onPress={addCategory} />

      <Button style={styles.buttonOutlineText} title="Update Ticket" onPress={updateCategory} />

      <Button style={styles.buttonOutlineText} title="Cancel Ticket" onPress={delCategory} />

      <Text>{username} Your Selected Station</Text>

      <FlatList
        data={categories}
        renderItem={renderSelectedStation}
        key={cat1 => cat1.id}
      />
    </View>
    </KeyboardAvoidingView>
    
  )
}

export default UserScreen

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