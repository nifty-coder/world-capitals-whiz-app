import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/Colors';

function VictoryScreen({ navigation, route }) {
  const [uri, setUri] = useState('https://c.tenor.com/oGoY4h0pGYUAAAAj/updatess.gif');
  const [playerName, setPlayerName] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ 
      title: "Game Over",
      headerLeft: () => (
       <Pressable 
       android_ripple={{ color: '#fff' }} 
       onPress={() => navigation.navigate("HomeGame", { playerName: playerName })}>
        <Ionicons name="arrow-back" size={24} color={Colors.white} />
       </Pressable> 
      )
    });
  }, [navigation]);

  useEffect(() => {
    const link = (
     route.params.participationType == true 
     ? '/Wy8Z2bM/trophygtc.jpg' 
     : '/DtJtV7V/trophy.jpg'
    );  

    setTimeout(() => {
      setUri('https://i.ibb.co' + link);
    }, 100);
    
    (async () => {
      let player = await AsyncStorage.getItem("player");
      setPlayerName(player);
    })();
  }, []);
  
  return (
    <View style={styles.container}>
      <Image source={{ uri: uri }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <CustomButton 
        fontSize={16}
        disabled={false}
        style={styles.playAgainButton} 
        bgColor={Colors.appTheme.darkblue}
        textColor={Colors.white} 
        buttonText="Play another game"
        onPress={() => navigation.navigate("HomeGame")} />
  
        <CustomButton 
        fontSize={16}
        disabled={false}
        style={styles.scoreSummaryButton} 
        bgColor={Colors.appTheme.darkgreen} 
        textColor={Colors.white} 
        buttonText={"Score Summary"}
        onPress={() => navigation.navigate("Score", { playerName: playerName })} />
      </View>
    </View>
  );
};

export default VictoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 300,
    height: 300
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16
  },
  playAgainButton: {
    width: 200,
    marginRight: 5
  },
  scoreSummaryButton: {
    width: 150,
    marginLeft: 7
  }
});