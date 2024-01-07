import { StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Auth(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerView, setRegisterView] = useState(false);

    useEffect(() => {
        getData();
    }, [])

    const auth = () => {
        if (registerView){
            fetch(`http://127.0.0.1:8000/api/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })
            .then(res => res.json())
            .then( res => {
                setRegisterView(false);
                props.navigation.navigate("MovieList");
            })
            .catch(error => console.log(error));
        } else {
            fetch(`http://127.0.0.1:8000/auth/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })
            .then(res => res.json())
            .then( res => {
                saveData(res.token);
                props.navigation.navigate("MovieList");
            })
            .catch(error => console.log(error));
        }
    };

    const saveData = async (token) => {
        await AsyncStorage.setItem('MR_Token', token)
    }

    const getData = async () => {
        const token = await AsyncStorage.getItem('MR_Token');
        if(token) props.navigation.navigate("MovieList");
    }

    const toggleView = () => {
        setRegisterView(!registerView);
    }

  return (
    <View style={styles.authContainer}>
        <Image source={require('../assets/MR-logo.png')} 
            style = {{width: '100%', height: 135, paddingTop: 40}}
            resizeMode="contain"
        />
        <View style={styles.authBox}>
            {registerView ? 
                <Text style={styles.authHeader}>Login</Text> :
                <Text style={styles.authHeader}>Register</Text>
            }  
            <Text style={styles.authLabel}>Username</Text>
            <TextInput 
                style={styles.authInput}
                placeholder="Username"
                onChangeText={text => setUsername(text)}
                value={username}
                autoCapitalize={'none'}
            />
            <Text style={styles.authLabel}>Password</Text>
            <TextInput 
                style={styles.authInput}
                placeholder="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                autoCapitalize={'none'}
                secureTextEntry={true}
            />
            <View style={styles.button}>
                <Button onPress={() => auth()} title={registerView ? "Login" : "Register"} color='rgba(255, 255, 255, 0.6)'/> 
                <TouchableOpacity onPress={() => toggleView()}>
                    {registerView ? 
                        <Text style={styles.regLabel}>You don't have an account? Register here!</Text> :
                        <Text style={styles.regLabel}>You already have an account? Login here!</Text>                        
                    }                
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}

Auth.navigationOptions = screenProps => ({
    title: "Login",
    headerStyle: {
        backgroundColor: 'rgba(255, 166, 0, 0.75)'
    },
    headerTintColor: 'black',
    headerTitleStyle: {
        fontWeight: 'bold',
    }
})

const styles = StyleSheet.create({
    authContainer: {
        alignItems: "center",
        flex: 1,
        backgroundColor: '#282C35',
        textAlign: 'center'
    },

    authHeader: {
        color: 'rgba(255, 166, 0, 0.9)',
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 20,
    },

    authBox: {
        width: 330,
        height: 350,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'rgb(166, 166, 166)',
    },

  authLabel: {
    color: 'rgb(166, 166, 166)',
    fontSize: 18,
    paddingTop: 25,
    textAlign: 'left',
    fontWeight: '500',
    paddingLeft: 46,
   },

   authInput: {
    marginTop: 10,
    width: 240,
    height: 40,
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: '#282c34',
    borderRadius: 8,
    paddingLeft: 3,
    marginLeft: 45,
   },

   button: {
    marginTop: 15,
   },

   regLabel: {
    marginTop: 8,
    textAlign: 'center',
    color: 'rgb(152, 152, 152)',
    fontSize: 14,
   }
});
