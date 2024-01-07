import { StyleSheet, Text, View, Button, Alert} from 'react-native';
import React, { useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faStar} from '@fortawesome/free-solid-svg-icons';
import { TouchableWithoutFeedback} from 'react-native-gesture-handler';

export default function Detail(props) {

    const movie = props.navigation.getParam('movie', null);
    const token = props.navigation.getParam('token', '');
    const [ highlight, setHighlight ] = useState(0);

    const rateClicked = () => {
        if(highlight > 0 && highlight < 6){
            fetch(`http://127.0.0.1:8000/api/movies/${movie.id}/rate_movie/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token b3bc1e60b52d90532f997733b158244d53eede82`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({stars: highlight})
        })
        .then(res => res.json())
        .then( res => {
            setHighlight(0);
            Alert.alert("Success", res.message);
        })
        .catch(error => Alert.alert("Error", error));
        }
    }

  return (
    <View style={styles.detailContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.description}>{movie.description}</Text>
        <View style={styles.starContainer}>
            <FontAwesomeIcon style={movie.avg_rating > 0 ? styles.orange : styles.white} icon={faStar} size={21}/>
            <FontAwesomeIcon style={movie.avg_rating > 1 ? styles.orange : styles.white} icon={faStar} size={21}/>
            <FontAwesomeIcon style={movie.avg_rating > 2 ? styles.orange : styles.white} icon={faStar} size={21}/>
            <FontAwesomeIcon style={movie.avg_rating > 3 ? styles.orange : styles.white} icon={faStar} size={21}/>
            <FontAwesomeIcon style={movie.avg_rating > 4 ? styles.orange : styles.white} icon={faStar} size={21}/>
            <Text style={styles.noOfRatings}>({movie.no_of_ratings})</Text>
        </View>
        <View style={styles.separator} />
        <Text style={styles.rate}>Rate it</Text>
        <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((index) => (
                <TouchableWithoutFeedback key={index} onPress={() => setHighlight(index)}>
                <FontAwesomeIcon
                    style={highlight >= index ? styles.orange : styles.white}
                    icon={faStar}
                    size={35}
                />
                </TouchableWithoutFeedback>
            ))}
        </View>
        <Button title="Rate" onPress={() => rateClicked()} color='rgba(255, 255, 255, 0.6)'/>
    </View>
  );
}

Detail.navigationOptions = screenProps => ({
    title: screenProps.navigation.getParam('title'),
    headerStyle: {
        backgroundColor: 'rgba(255, 166, 0, 0.75)'
    },
    headerTintColor: 'black',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
    headerRight: (
        <Button title="Edit" color="black" 
            onPress={() => screenProps.navigation.navigate("Edit", {movie: screenProps.navigation.getParam("movie")})}
        />
    )
})

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    backgroundColor: '#282C35',
    padding: 10,
    textAlign: 'center',
  },

   starContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
   },

   orange: {
    color: "orange",
   },

   white: {
    color: "white",
   },

   title: {
    color: 'white',
    fontSize: 24,
    paddingTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
   },

   description: {
    fontSize: 18,
    color: 'white',
    padding: 15,
    textAlign: 'center',
   },

   noOfRatings: {
    color: 'white',
    fontSize: 18,
   },

   separator: {
    marginTop: 25,
    marginBottom: 10,
    borderBottomColor: 'rgb(85, 82, 85)', 
    borderBottomWidth: 2,
    width: 250,
    alignSelf: 'center',
   },

   rate: {
    color: 'white',
    fontSize: 24,
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
   },
});
