import { StyleSheet, Text, Pressable } from 'react-native';
import Colors from '../constants/Colors';

const CustomButton = (
  { 
    fontSize,
    onPress, 
    bgColor, 
    disabled, 
    textColor, 
    label, 
    buttonText 
  }
) => {
  return (
    <Pressable 
    android_ripple={{ color: Colors.white }} 
    onPress={onPress} 
    style={
      [
        styles.pressable,
        { 
          backgroundColor: bgColor,
          opacity: disabled ? 0.65 : 1
        }
      ]
    }
    disabled={disabled}>
      <Text style={[{ color: textColor, fontSize: fontSize }, styles.buttonText]}>{label} {buttonText}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
    pressable: {
     borderRadius: 90,
     elevation: 10,
     borderWidth: 2,
     marginHorizontal: 70,
     height: 38
    },
    buttonText: {
      paddingTop: 4,
      textAlign: 'center'
    }
});