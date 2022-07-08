import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Text, StatusBar, TextInput, Button, FlatList } from 'react-native'
import React , { useEffect, useState } from 'react'
import { openDatabase } from "react-native-sqlite-storage";

const db = openDatabase({
  name: "rn_sqlite",
});

function AdminScreen ({ route, navigation }) {
  
  const [durakIsmi, setDurakIsmi] = useState('');
  const [durakLat, setDurakLat] = useState('');
  const [durakLong, setDurakLong] = useState('');
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const { username, password, usertype } = route.params;

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS stationdata (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), lat VARCHAR(20), long VARCHAR(20))`,
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

  const saveStation = () => {
    if (!durakIsmi && !durakLat && !durakLong) {
      alert("Check data");
      return false;
    }

    console.log(durakIsmi)
    console.log(durakLat)
    console.log(durakLong)

    db.transaction(txn => {
      txn.executeSql(
        `INSERT INTO stationdata (name,lat,long) VALUES (?,?,?)`,
        [durakIsmi,durakLat,durakLong],
        (sqlTxn, res) => {
          console.log(`${durakIsmi} category added successfully`);
          getCategories();
          setCategory("");
        },
        error => {
          console.log("error on adding category " + error.message);
        },
      );
    });
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
              results.push({ id: item.id, name: item.name, lat: item.lat, long: item.long });
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

  const delStation = () => {
    if (!durakIsmi && !durakLat && !durakLong) {
      alert("Check data");
      return false;
    }

    db.transaction(txn => {
      txn.executeSql(
        `DELETE FROM stationdata WHERE id=?`,
        [durakIsmi],
        (sqlTxn, res) => {
          console.log(`${durakIsmi} category delete successfully`);
          getCategories();
          setCategory("");
        },
        error => {
          console.log("error on adding category " + error.message);
        },
      );
    });
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
        <Text style={{ marginRight: 9 }}>{"Id: " + item.id}</Text>
        <Text style={{ marginRight: 9 }}>{"name: " + item.name}</Text>
        <Text style={{ marginRight: 9 }}>{"lat: " + item.lat}</Text>
        <Text style={{ marginRight: 9 }}>{"long: " + item.long}</Text>
      </View>
    );
  };

  useEffect(() => {
    (async () => {
        await createTables();
        await getCategories();
    })();
    }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.buttonContainer}>

      <Text>AdminScreen: {username} {password} {usertype}</Text>

      <StatusBar backgroundColor="#222" />

      <TextInput
        placeholder="Durak İsmi"
        value={durakIsmi}
        onChangeText={setDurakIsmi}
        style={styles.input}
      />
      <Text></Text>
      <TextInput
        placeholder="Durak Lat"
        value={durakLat}
        onChangeText={setDurakLat}
        style={styles.input}
      />
      <Text></Text>
      <TextInput
        placeholder="Durak Long"
        value={durakLong}
        onChangeText={setDurakLong}
        style={styles.input}
      />
      <Text></Text>
      <Button style={styles.buttonOutlineText} title="SaveStation" onPress={saveStation} />
      <Text></Text>
      <Button style={styles.buttonOutlineText} title="DeleteStation" onPress={delStation} />
      <Text></Text>
      <FlatList
        style={{ height: '30%' }}
        data={categories}
        renderItem={renderCategory}
        key={cat => cat.id}
      />
    </View>
    </KeyboardAvoidingView>
    
  )
}

export default AdminScreen

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