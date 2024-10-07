import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/Colors';

const ScoreCard = ({ gnum, correctAns, wrongAns }) => {
  return (
    <View style={styles.card}>
      <Text>Game {gnum}</Text>
      <Text>You got {correctAns} correct</Text>
      <Text>AND</Text>
      <Text>{wrongAns} wrong</Text>
      <Text>out of 10 questions. {correctAns == 10 && 'Woohoo, fantastic job!'}</Text>
    </View>
  );
};

export default ScoreCard;

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get("screen").width - 100,
    height: 100, 
    alignSelf: 'center',
    alignItems: 'center',    
    marginVertical: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderColor: Colors.appTheme.blue,
    borderWidth: 2
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