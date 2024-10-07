import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const GameContext = createContext();
export const GameContextProvider = (props) => {
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    (async () => {
      let player = await AsyncStorage.getItem("player");
      if(!player) {
        setPlayerName('');
      } else {
        setPlayerName(player);  
      }
    })();
  });

  return (
    <GameContext.Provider value={{playerName: playerName, updatePlayerName: setPlayerName}}>
      {props.children}
    </GameContext.Provider>
  );
};

export const CountriesContext = createContext();
export const CountriesContextProvider = (props) => {
    const [countriesList, setCountriesList] = useState([]);
    
    useEffect(() => {
      (async () => {
        const response = await fetch('https://restcountries.com/v3.1/all', {
            method: 'GET',
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }).then((res) => res.json()).catch(err => new Error("Something went wrong. " + err));

          if(!response) {
            throw new Error("No countries!");
          } else {
            setCountriesList(response);
          }
        })();
    }, []);

    const deleteFromCountriesList = (countryToRemove) => {
      const updatedList = countriesList.filter(item => item !== countriesList[countryToRemove]);
      setCountriesList(updatedList);
    };

    return (
      <CountriesContext.Provider 
      value={
        { 
          response: countriesList, 
          deleteCountry: deleteFromCountriesList 
        }
      }>
        {props.children}
      </CountriesContext.Provider>
    );
};