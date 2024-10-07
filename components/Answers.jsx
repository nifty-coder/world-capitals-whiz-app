import { StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';

const Answers = ({ 
  index, 
  disabled, 
  randomizedAnswer, 
  onAnswerClickHandler 
 }) => {
  
  let labelText;
  switch (index) {
   case 0:
    labelText = "a.";
   break;
   case 1:
    labelText = "b.";
   break;
   case 2:
    labelText = "c.";
   break;
   case 3:
    labelText = "d.";
   break;
   default:
    labelText; 
  }

  return (
  <View key={index} style={styles.answer}>
    <CustomButton 
      fontSize={16}
      disabled={disabled}
      bgColor={Colors.appTheme.reddish}
      textColor={Colors.white}
      label={labelText}
      buttonText={randomizedAnswer} 
      onPress={() => onAnswerClickHandler(Array.of(randomizedAnswer))} />
  </View>
 );
};

export default Answers;

const styles = StyleSheet.create({
    answer: { 
      marginBottom: 8, 
      borderRadius: 5 
    }
});