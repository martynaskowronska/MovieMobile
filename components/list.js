import { StyleSheet, Text, View, FlatList, Image, Button} from 'react-native';
import React, {useState, useEffect} from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export default function MovieList(props) {

  const [movies, setMovies] = useState([]);
  const [location, setLocation] = useState();
  const [city, setCity] = useState('');
  let token = null;

  useEffect(() => {
    const getPermission = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return ;
      }
    
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    const {coords} = currentLocation;
    const address = await Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude});

    if (address && address.length > 0) {
      setCity(address[0].city || 'Unknown city')
    }
  };
    getPermission();
  },[])

  const getData = async () => {
    token = await AsyncStorage.getItem('MR_Token');
    if (token) {
      getMovies();
    } else {
      props.navigation.navigate("Auth")
    }
  };

  useEffect(() => {
    getData();
  }, [movies]);

  const getMovies = () => {
    fetch('http://127.0.0.1:8000/api/movies/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(res => res.json())
    .then( jsonRes => setMovies(jsonRes))
    .catch( error => console.log(error));
  }

  const movieclicked = (movie) => {
    console.log(token);
    props.navigation.navigate("Detail", {movie: movie, title: movie.title, token: token})
  }

  return (
    <View style={styles.container}>
        <Image source={require('../assets/MR-logo.png')} 
            style = {{width: '100%', height: 135, paddingTop: 40}}
            resizeMode="contain"
            />
      <FlatList 
        data = {movies}
        renderItem={({item}) => (
            <TouchableOpacity onPress={() => movieclicked(item)}>
                <View style={styles.item}>
                    <Text style={styles.itemText}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text style={styles.location}>{location ? `You are currently in ${city}` : 'Unknown location'} </Text>
    </View>
  );
}

MovieList.navigationOptions = screenProps => ({
  title: "List of movies",
  headerStyle: {
      backgroundColor: 'rgba(255, 166, 0, 0.75)'
  },
  headerTintColor: 'black',
  headerTitleStyle: {
      fontWeight: 'bold',
  },
  headerRight: (
      <Button title="Add new" color="black" 
          onPress={() => screenProps.navigation.navigate("Edit", {movie: {title: '', description: ''}})}
      />
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282C35',
    justifyContent: 'center',
    alignItems: 'center',
  },

  item: {
    flex: 1,
    height: 50,
  },

  itemText: {
    flex: 1,
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },

  location: {
    color: 'grey',
    fontSize: 14,
    marginBottom: 20,
  }
});
