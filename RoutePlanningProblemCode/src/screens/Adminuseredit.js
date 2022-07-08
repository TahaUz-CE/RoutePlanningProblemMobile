import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Text, StatusBar, TextInput, Button, FlatList } from "react-native";
import { openDatabase } from "react-native-sqlite-storage";
import { useNavigation } from '@react-navigation/core'

const db = openDatabase({
  name: "rn_sqlite",
});

const Adminuseredit = () => {
  const navigation = useNavigation()
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS logindata (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20), password VARCHAR(20), usertype VARCHAR(20))`,
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
    if (!category) {
      alert("Enter category");
      return false;
    }

    console.log(category.split(" ")[0])
    console.log(category.split(" ")[1])
    console.log(category.split(" ")[2])

    db.transaction(txn => {
      txn.executeSql(
        `INSERT INTO logindata (username,password,usertype) VALUES (?,?,?)`,
        [category.split(" ")[0],category.split(" ")[1],category.split(" ")[2]],
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
  };

  const delCategory = () => {
    if (!category) {
      alert("Enter category");
      return false;
    }

    db.transaction(txn => {
      txn.executeSql(
        `DELETE FROM logindata WHERE id=?`,
        [category],
        (sqlTxn, res) => {
          console.log(`${category} category delete successfully`);
          getCategories();
          setCategory("");
        },
        error => {
          console.log("error on adding category " + error.message);
        },
      );
    });
  };

  const updateCategory = () => {
    if (!category) {
      alert("Enter category");
      return false;
    }
    console.log(category.split(" ")[0])
    console.log(category.split(" ")[1])
    db.transaction(txn => {
      txn.executeSql(
        `UPDATE logindata SET username=?,password=?,usertype=? WHERE id=?`,
        [category.split(" ")[0],category.split(" ")[1],category.split(" ")[2],category.split(" ")[3]],
        (sqlTxn, res) => {
          console.log(`${category} category update successfully`);
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
        `SELECT * FROM logindata ORDER BY id DESC`,
        [],
        (sqlTxn, res) => {
          console.log("categories retrieved successfully");
          let len = res.rows.length;

          if (len > 0) {
            let results = [];
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              results.push({ id: item.id, username: item.username, password: item.password, usertype: item.usertype });
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
        <Text style={{ marginRight: 9 }}>{"Username: " + item.username}</Text>
        <Text style={{ marginRight: 9 }}>{"Password: " + item.password}</Text>
        <Text style={{ marginRight: 9 }}>{"Usertype: " + item.usertype}</Text>
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
      <StatusBar backgroundColor="#222" />

      <TextInput
        placeholder="Enter category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <Button style={styles.buttonOutlineText} title="Add" onPress={addCategory} />

      <TextInput
        placeholder="Enter category for delete"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <Button style={styles.buttonOutlineText} title="Delete" onPress={delCategory} />

      <TextInput
        placeholder="Enter category for update"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <Button style={styles.buttonOutlineText} title="Update" onPress={updateCategory} />

      <FlatList
        style={{ height: '30%' }}
        data={categories}
        renderItem={renderCategory}
        key={cat => cat.id}
      />
    </View>
    </KeyboardAvoidingView>
    
    
  );
};

export default Adminuseredit;

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