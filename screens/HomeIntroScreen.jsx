import { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, View, PixelRatio } from 'react-native';
import BadWordsList from 'badwords-list';
import BadWordsFilter from 'bad-words';
import HindiBadWordsFilter from 'profanity-hindi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameContext } from '../utils-async/Context';
import Colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';
import introToGameList from '../constants/IntroToGame';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

const HomeIntroScreen = ({ navigation }) => {
  const worldMapURL = 'https://tinyurl.com/sk-app-world-map';
  const { playerName, updatePlayerName } = useContext(GameContext);
  const [player, setPlayer] = useState('');
  let EnglishBadWordsFilter = new BadWordsFilter(BadWordsList.array);
  let playerFitOrNotForSubmission = (
    (player.includes('<') || (player.includes('/>'))) 
    || (player.includes('>')) || (player.trim() == '') 
    || (EnglishBadWordsFilter.isProfane(player)) 
    || (HindiBadWordsFilter.isMessageDirty(player))
  );

  const playGameHandler = async () => {
    await AsyncStorage.setItem("player", player);
    updatePlayerName(player);
    navigation.navigate("Home", { screen: "HomeGame", initial: true });   
  };

  useEffect(() => {
    setPlayer(playerName);
    
    return () => {
      setPlayer('');
    };
  }, [playerName]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: worldMapURL }} style={styles.worldImage} />
      <Text adjustFontSizeToFit style={styles.introText} >Let's go on a world tour!</Text>
      <View style={styles.inputContainer}>
        <TextInput 
        style={styles.input}
        placeholder="Enter Player Name"
        placeholderTextColor={Colors.white}
        value={player} 
        maxLength={15}
        onChangeText={(text) => setPlayer(text)} />
      </View>
      
      <CustomButton 
      fontSize={normalize(18)}
      disabled={playerFitOrNotForSubmission}
      bgColor={Colors.black}
      textColor={Colors.white}
      buttonText="Play Game" 
      onPress={playGameHandler} />
      
      <View style={styles.aboutGameContainer}>
        <Text style={styles.introText}>About The Game:</Text>
        {introToGameList.map(
          ((line, i) => (
          <Text key={i} style={{ marginTop: 4 }}>
            {i + 1}. {line}
            </Text>
          )
          )
        )}
      </View>
      <Text style={styles.developerText}>
       Game developed by: <Text style={{ fontStyle: 'italic' }}>Surya Kasibhatla</Text> 
      </Text>
    </View>
  );
};

export default HomeIntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  worldImage: {
    width: 430,
    height: 220,
    alignSelf: 'center',
    marginTop: 4
  },
  introText: {
    marginTop: '2%',
    textAlign: 'center',
    fontSize: normalize(18),
    fontWeight: 'bold'
  },
  inputContainer: {
    height: '10%',
    paddingHorizontal: 4,
    paddingTop: Dimensions.get('window').width * 0.01,
    paddingBottom: Dimensions.get('window').width * 0.2
  },
  input: {
    backgroundColor: Colors.appTheme.blue,
    textAlign: "center",
    color: Colors.white,
    fontSize: normalize(18),
    height: 70,
    paddingLeft: 15,
    paddingRight: 15
  },
  aboutGameContainer: {
    width: Dimensions.get("screen").width - 45,
    alignSelf: 'center',
    marginVertical: 16,
    backgroundColor: Colors.appTheme.lightblue,
    borderRadius: 8,
    borderColor: Colors.appTheme.blue,
    borderWidth: 3
  },
  developerText: {
    marginTop: '0.4%',
    textAlign: "center",
    fontSize: normalize(16)
  }
});