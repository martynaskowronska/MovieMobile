import { StyleSheet, Text, View, Button, TextInput} from 'react-native';
import React, { useState } from 'react';

export default function Edit(props) {

    const movie = props.navigation.getParam('movie', null);
    const [title, setTile] = useState(movie.title);
    const [description, setDesription] = useState(movie.description);
    const token = props.navigation.getParam('token', '');

    const saveMovie = () => {
        if(movie.id){
            fetch(`http://127.0.0.1:8000/api/movies/${movie.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token b3bc1e60b52d90532f997733b158244d53eede82`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: title, description: description})
            })
            .then(res => res.json())
            .then( movie => {
                props.navigation.navigate("Detail", {movie: movie, title: movie.title, token: token})
            })
            .catch(error => console.log(error));
        }
        else{
            fetch(`http://127.0.0.1:8000/api/movies/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token b3bc1e60b52d90532f997733b158244d53eede82`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: title, description: description})
            })
            .then(res => res.json())
            .then( movie => {
                props.navigation.navigate("MovieList")
            })
            .catch(error => console.log(error));
        }
    };

  return (
    <View style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput 
            style={styles.titleInput}
            placeholder="Title"
            onChangeText={text => setTile(text)}
            value={title}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput 
            style={styles.descriptionInput}
            multiline={true} 
            placeholder="Description"
            onChangeText={text => setDesription(text)}
            value={description}
        />
        <Button onPress={() => saveMovie()} title="Save" color='rgba(255, 255, 255, 0.6)'/> 
    </View>
  );
}

Edit.navigationOptions = screenProps => ({
    title: screenProps.navigation.getParam('title'),
    headerStyle: {
        backgroundColor: 'rgba(255, 166, 0, 0.75)'
    },
    headerTintColor: 'black',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
    headerRight: (
        <Button title="Delete" color="black" 
            onPress={() => removeClicked(screenProps)}
        />
    )
})

const removeClicked = (props) => {
    const movie = props.navigation.getParam("movie")
    fetch(`http://127.0.0.1:8000/api/movies/${movie.id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token b3bc1e60b52d90532f997733b158244d53eede82`,
            'Content-Type': 'application/json'
    }})
    .then( movie => {
        props.navigation.navigate("MovieList", {token: token})
    })
    .catch(error => console.log(error));
} 

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        backgroundColor: '#282C35',
        textAlign: 'center'
    },

  label: {
    color: 'white',
    fontSize: 20,
    paddingTop: 20,
    textAlign: 'center',
    fontWeight: '500',
   },

   titleInput: {
    marginTop: 10,
    width: 170,
    height: 50,
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#282c34',
    borderRadius: 5,
    paddingLeft: 10,
   },

   descriptionInput: {
    marginTop: 10,
    width: 270,
    height: 120,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#282c34',
    borderRadius: 5,
    paddingLeft: 10,
   }, 
});
