import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { commafyNumber } from 'commafy-any-number';
import Colors from '../constants/Colors';
import { getContinentMap } from '../utils-async/Data';

const CountryCard = (props) => {
  const { 
    player, wonGame, capital, flag, name, population, continents, seal 
  } = props;
  const [loading, setLoading] = useState(true);
  const continentMapLink = getContinentMap(continents[0]);
  const emblemUri = Object.keys(seal).length !== 0 && seal.png;
  const loadingGifLink = 'https://c.tenor.com/oGoY4h0pGYUAAAAj/updatess.gif';
  let emblemOrMapUri = loading ? loadingGifLink : (!emblemUri ? continentMapLink : emblemUri);

  useEffect(() => {
    if(loading) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);       
    }

    return () => setLoading(false);
  }, [props]);

  let cmpStyles = wonGame ? styles.winsScreenDisplay : styles.gameScreenDisplay;

  return (
    <View style={[styles.card, cmpStyles]}>
     <Text style={styles.flag}>{flag}</Text>
    
     <View style={styles.countryDetails}>
      <Text style={styles.name}>
        {name == "Saint Vincent and the Grenadines" 
        ? "St. Vincent & Grenadines" 
        : name}
      </Text>  
      <Text>Population: {commafyNumber(population)}</Text>
      <Text>
       {continents[0] == "Oceania" ? "Region: " : "Continent: "} 
       {name == "Russia" ? "Eurasia" : continents[0]}
      </Text>
      {wonGame && (
       <>
       <Text>Capital: {capital.join(", ")}</Text>
       <Text>Winner: {player}</Text>
       </>
      )}
    </View>

    <Image source={{ uri: emblemOrMapUri }} style={styles.seal} /> 
  </View>
  );
};

export default CountryCard;

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get("screen").width - 45,
    alignSelf: 'center',
    alignItems: 'center',    
    marginVertical: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderColor: Colors.appTheme.blue,
    borderWidth: 2
  },
  gameScreenDisplay: {
    height: 400
  },
  winsScreenDisplay: {
    height: 465
  },
  flag: {
   fontSize: 50
  },
  countryDetails: {
   alignItems: 'center'
  },
  name: {
   fontSize: 18
  },
  seal: {
   width: 320,
   height: '60%',
   resizeMode: 'contain' 
  }
});