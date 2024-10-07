import {useContext, useEffect, useState} from 'react';
import {
    Alert,
    StyleSheet,
    Pressable,
    Text,
    View,
    BackHandler
} from 'react-native';
import {Ionicons, AntDesign} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GameContext} from '../utils-async/Context';
import {useFetchRandomCountries, fetchAnswers} from '../utils-async/Data';
import Colors from '../constants/Colors';
import CountryCard from '../components/CountryCard';
import Answers from '../components/Answers';

const HomeGameScreen = ({navigation}) => {
    const {playerName, updatePlayerName} = useContext(GameContext);
    const {fetchRandomCountries} = useFetchRandomCountries();

    const [randomizedCountry,
        setRandomizedCountry] = useState({});
    const [randomizedAnswers,
        setRandomizedAnswers] = useState([]);
    const [disabled,
        setDisabled] = useState(false);
    const [answerBgColor,
        setAnswerBgColor] = useState(Colors.appTheme.reddish);
    const [isCorrect,
        setIsCorrect] = useState(false);
    const [selectedIndex,
        setSelectedIndex] = useState(null);
    const [isQuestionAnswered,
        setIsQuestionAnswered] = useState(false);
    const [numberOfAttempts,
        setNumberOfAttempts] = useState(0);
    const [numberOfGames,
        setNumberOfGames] = useState(0);
    const [numberOfCorrectAnswers,
        setNumberOfCorrectAnswers] = useState(0);
    let correctAnsCt = numberOfCorrectAnswers;
    const [answerText, setAnswerText] = useState('');

    const loadData = async() => {
        let numGames = await AsyncStorage
            .getItem("numGames")
            .then((res) => {
                if (res) {
                    return + res;
                } else 
                    return 0;
                }
            );
        setNumberOfGames(numGames);
        const countriesResult = fetchRandomCountries();
        setRandomizedCountry(countriesResult[0]);

        const answersResult = fetchAnswers(countriesResult);
        setRandomizedAnswers(answersResult);

        setIsQuestionAnswered(false);

        setNumberOfAttempts((prevNumber) => prevNumber + 1);

        setDisabled(false);
        setIsCorrect(false);
    };

    useEffect(() => {
        (async() => {
            if (playerName) {
                setRandomizedCountry({});
                setRandomizedAnswers([]);
                setNumberOfAttempts(0);
                updatePlayerName(playerName);
                setAnswerBgColor(Colors.appTheme.reddish);
                await loadData();
                Alert.alert("Started a new game.", "All the best!", [
                    {
                        text: 'Okay'
                    }
                ]);
            }
        })();
    }, [navigation, playerName]);

    useEffect(() => {
        const exitApp = async() => {
            BackHandler.exitApp();
        };

        const clearData = async() => {
            Alert.alert("Are you sure?", "This will remove your game history and require you to enter a name again.", [
                {
                    text: 'No'
                }, {
                    text: 'Yes',
                    onPress: async() => {
                        updatePlayerName('');
                        const keys = ['player', 'numAttempts', 'numGames', 'gameHistory'];
                        await AsyncStorage.multiRemove(keys, (err) => {
                            if (!err) {
                                navigation.replace("HomeIntro");
                            } else {
                                Alert.alert("Something went wrong!", "Please try again.", [
                                    {
                                        text: 'Okay'
                                    }
                                ]);
                            }
                        });
                    }
                }
            ]);
        };

        navigation.setOptions({
            title: "Guess The Capital",
            headerLeft: () => (
                <Pressable
                    android_ripple={{
                    color: '#fff'
                }}
                    onPress={exitApp}>
                    <Ionicons
                        style={{
                        alignSelf: 'center'
                    }}
                        name="close-circle"
                        size={36}
                        color={Colors.white}/>
                    <Text
                        style={{
                        textAlign: 'center',
                        color: Colors.white
                    }}>Exit App</Text>
                </Pressable>
            ),
            headerRight: () => (
                <Pressable
                    android_ripple={{
                    color: '#fff'
                }}
                    onPress={clearData}>
                    <AntDesign
                        style={{
                        alignSelf: 'center'
                    }}
                        name="deleteuser"
                        size={36}
                        color={Colors.white}/>
                    <Text
                        style={{
                        textAlign: 'center',
                        color: Colors.white
                    }}>{playerName}</Text>
                </Pressable>
            )
        });
    }, [playerName]);

    const checkIfGameDone = async(numAtts) => {
        if (numAtts == 10) {
            let gameHistory = await AsyncStorage
                .getItem("gameHistory")
                .then((res) => {
                    if (res && res !== 1) {
                        return JSON.parse(res);
                    } else 
                        return [];
                    }
                );

            let gameData = {
                gameNum: numberOfGames + 1,
                correctAns: correctAnsCt,
                wrongAns: correctAnsCt === 10
                    ? 0
                    : 10 - correctAnsCt
            };
            gameHistory.push(gameData);
            await AsyncStorage.setItem("gameHistory", JSON.stringify(gameHistory));
            await AsyncStorage.setItem("numGames", JSON.stringify(numberOfGames + 1));

            setNumberOfCorrectAnswers(0);
            setTimeout(() => {
                navigation.navigate("GameVictory", {
                    participationType: correctAnsCt >= 7
                        ? false
                        : true
                });
                setNumberOfAttempts(0);
            }, 1500);
        } else {
            setTimeout(() => {
                loadData();
            }, 1500);
        }
    };

    const onAnswerClickHandler = async(answer, index) => {
        const correctAnswer = Array.of(randomizedCountry.capital.map((cap) => cap).join(", "));
        const correct = answer.length === correctAnswer.length && answer.every((value, index) => value === correctAnswer[index]);

        setIsQuestionAnswered(true);
        
        if (correct) {
            setDisabled(true);
            setIsCorrect(true);
            correctAnsCt++;
            setAnswerText("Correct!");
            setNumberOfCorrectAnswers((prevNumber) => {
                switch (correct) {
                    case true:
                        return prevNumber + 1;
                    case false:
                        return prevNumber;
                    default:
                        return prevNumber;
                }
            });

            await checkIfGameDone(numberOfAttempts);
        } else {
            setDisabled(true);
            setIsCorrect(false);
            setAnswerText("Correct answer: " + correctAnswer);
            await checkIfGameDone(numberOfAttempts);
        }
    };

    const renderCountry = () => {
        const {
            capital,
            flag,
            name,
            population,
            continents,
            coatOfArms
        } = randomizedCountry;

        return (<CountryCard
            player={playerName}
            capital={capital}
            flag={flag}
            name={name.common}
            population={population}
            continents={continents}
            seal={coatOfArms}/>);
    };

    const renderAnswers = () => {
      return randomizedAnswers.map((randomizedAnswer, i) => {    
        return (
          <Answers
            key={i}
            index={i}
            disabled={disabled}
            randomizedAnswer={randomizedAnswer}
            onAnswerClickHandler={onAnswerClickHandler}
          />
        );
      });
    };

    return (
        <View>
            <Text style={[styles.text, styles.questionText]}>
              Question {numberOfAttempts == 0 ? 1 : numberOfAttempts} of 10
            </Text>
            {JSON.stringify(randomizedCountry) !== "{}" && renderCountry()}
            {isQuestionAnswered && <Text style={[styles.text, {color: isCorrect ? Colors.appTheme.darkgreen : Colors.appTheme.reddish}]}>{answerText}</Text>}
            {JSON.stringify(randomizedAnswers) !== "[]" && renderAnswers(isQuestionAnswered, selectedIndex, isCorrect)}
        </View>
    );
};

export default HomeGameScreen;

const styles = StyleSheet.create({
    text: {
        fontSize: 15,
        textAlign: "center",
        marginTop: -15,
        marginBottom: 3
    },
    questionText: {
        marginTop: 10,
        marginRight: 22,
        textAlign: 'right',
        fontSize: 18,
        fontWeight: 'bold'
    }
});