import React, { useState, useEffect, useMemo } from 'react';
import type {PropsWithChildren} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Vibration,
  Alert,
  BackHandler
} from 'react-native';

import COLORS from '../colors';
import {SelectionButton, DefaultButton} from '../components/Buttons';
import BetList from '../components/BetList';
import uuid from 'react-native-uuid';

import CircularSlider from '../components/CircularSlider';
import { Slider} from '@rneui/themed';
import HouseIncome from '../components/HouseIncome';
const SQLite = require('react-native-sqlite-storage')
// import { db } from '../dbService';

export enum Options {
    none = "none",
    one = "1",
    two = "2",
    even = "X",
}

export type Bet = {
  GamblerName: string,
  option: Options,
  stake: number,
  multiplier: number,
  id: string
}

export type Game = {
  gameId: string,
  outcomeOne: string,
  outcomeTwo: string,
  bets: Bet[],
  houseEquity: number,
  currentPrize: number,
  currentStake: number,
  currentMultiplier: number,
  selectedOption: Options
}

export function addZeroes(num: number | string): string {
  const numberValue = typeof num === 'number' ? num : Number(num);
  return numberValue.toFixed(2);
}

// enum options {
//   one = 1,
//   two = 2,
//   even = 3
// }

type GambleScreenProps = {
    navigation: any;
    route: any;
}
// SQLite.DEBUG(true);

const GambleScreen: React.FC<GambleScreenProps> = ({navigation, route}) => {

    const [selectedOption, setSelectedOption] = useState<Options>(Options.none);
    const [stake, setStake] = useState<number>(0);
    const [previousValue, setPreviousValue] = useState<number>(-1);
    const [multiplier, setMultiplier] = useState<number>(2);
    const [gamblerName, setGamblerName] = useState<string>("");

    const [currentPrize, setCurrentPrize] = useState<number>(0);
    const [houseEquity, setHouseEquity] = useState<number>(0);

    const [stakeMissing, setStakeMissing] = useState<boolean>(false);
    const [optionMissing, setOptionMissing] = useState<boolean>(false);
    const [gamblerNameMissing, setGamblerNameMissing] = useState<boolean>(false);

    const [outcomeOne, setOutcomeOne] = useState<string>("")
    const [outcomeTwo, setOutcomeTwo] = useState<string>("")

    const [gameId, setGameId] = useState<any>("")
    const [bets, setBets] = useState<Bet[]>([])


    
    // Helper to prevent save function from running on initial render
    const [isInitial, setIsInitial] = useState<boolean>(true)

    useEffect(() => {
      if (route.params.source == "setup"){
        console.log('Initializing from setup')
        const {outcomeOne, outcomeTwo, gameId} = route.params;
        console.log('params', outcomeOne, outcomeTwo, gameId)
        // Setting states and then saving by using straigtly states doesnt work; save function doesn't run with updated state values.
        // setState is asynchronous, so it doesn't update the state immediately. (You cant event log the updated state value)
        // So this is a workaround:
        // save with params 
        save({
          gameId: gameId,
          outcomeOne: outcomeOne,
          outcomeTwo: outcomeTwo
        });  
        setOutcomeOne(outcomeOne);
        setOutcomeTwo(outcomeTwo);
        setGameId(gameId)
        setIsInitial(false)
      }
      else if (route.params.source == "saved"){
        console.log('Initializing from saved')
        const {outcomeOne, outcomeTwo, bets, gameId, houseEquity} = route.params;
        // TODO: deserialize bets
        setOutcomeOne(outcomeOne);
        setOutcomeTwo(outcomeTwo);
        setBets(bets)
        setGameId(gameId)
        setIsInitial(false)
        setHouseEquity(houseEquity)
      }
    }, [])

    useEffect(() => {
      console.log("Game id set to: ", gameId)
    }, [gameId])

    useEffect(() => {
      const backAction = () => {
          navigation.navigate('LaunchScreen')
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
  
      return () => backHandler.remove();
    }, []);
    
    useEffect(() => {
      if (Math.round(stake) != previousValue){
        Vibration.vibrate(15)
      }
      setPreviousValue(Math.round(stake))
    }, [stake])

    useMemo(() => {
      setCurrentPrize(stake * multiplier)
    }, [stake, multiplier])


    enum multiplierChange {
      decrease,
      increase
    }

    type SetupParams = {
      gameId: string,
      outcomeOne: string,
      outcomeTwo: string
    }

    // When new bet is added, selectedOption is set to none. This triggers save function.
    useEffect(() => {
      console.log('selectedOption changed', selectedOption)
      if (selectedOption == Options.none && !isInitial){
        console.log('Autosave...')
        save();
      }
    }, [selectedOption])
    
    async function save(setupParams?: SetupParams){
      const db = SQLite.openDatabase(
        {
          name: "gamblecalc.db",
          location: "default",
        },
        () => {console.log('Database opened successfully!')},
        (error: any) => {console.log("Error while opening database: " + error)}
      )

      // delete database:
      
      // db.transaction((tx: any) => {
      //   tx.executeSql(
      //     'INSERT OR REPLACE INTO events (gameId) VALUES (?)',
      //     ['idtest123'],
      //     (_ , results: any) => {
      //       console.log('Saved succesfully')
      //       db.close()
      //     },
      //     (error: any) => {
      //       console.log('Error while saving', error)
      //       db.close()
      //     }
      //   );
      // })

      db.transaction((tx: any) => {
          console.log('saving with id', setupParams ? setupParams.gameId : gameId)
          tx.executeSql('INSERT OR REPLACE INTO events (gameId, outcomeOne, outcomeTwo, bets, houseEquity, currentPrize, currentStake, currentMultiplier, selectedOption) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            setupParams ? setupParams.gameId : gameId,
            setupParams ? setupParams.outcomeOne : outcomeOne,
            setupParams ? setupParams.outcomeTwo : outcomeTwo,
            JSON.stringify(bets),
            houseEquity,
            currentPrize,
            stake,
            multiplier,
            selectedOption
          ],
          (_ , results: any) => {
            const rows = results.rows;
            // for (let i = 0; i < rows.length; i++) {
            //   console.log('Saved row: ', rows.item(i));
            //   // console.log('Row:', rows.item(i));
            // }
            // console.log('rows affected length: ', results.rowsAffected);
            // for (let i = 0; i < results.rowsAffected.length; i++){
            //   console.log('Row affected: ', results.rowsAffected[i])
            // }
            
            if (results.rowsAffected === 1) {
              console.log('Row inserted');
            } else if (results.rowsAffected === 0) {
              console.log('Row replaced');
            }
          },
          (error: any) => {
            console.log('Error while saving: ', error)
            db.close();
          }
          )
      })

      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM events',
          [],
          (_, result) => {
            const rows = result.rows;
      
            // Log each row's content
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              console.log('Row:', row);
            }
          },
          (_, error) => {
            console.error('Error executing query:', error);
          }
        );
      });
    }

    function handleOptionChange(option: Options){
      setSelectedOption(option)
      setOptionMissing(false)
    }

    function handleMultiplierChange(type: multiplierChange){
      if (type == multiplierChange.decrease){
        if (multiplier > 1){
          setMultiplier(Number((multiplier - 0.05).toFixed(2)))
          Vibration.vibrate(50)
        }
      }
      else if (type == multiplierChange.increase){
        if (multiplier < 10){
          setMultiplier(Number((multiplier + 0.05).toFixed(2)))
          Vibration.vibrate(50)
        }
      }
    }

  
    const handleNameInputChange = (text: string) => {
      setGamblerName(text);
      setGamblerNameMissing(false);
    };

    function addBet(){
      
      if (selectedOption != Options.none && stake > 0 && gamblerName != ""){
        setBets([...bets, {
          GamblerName: gamblerName,
          option: selectedOption,
          stake: stake,
          multiplier: multiplier,
          id: String(uuid.v4())
        }]);
        setHouseEquity(houseEquity + stake);
        setGamblerName("");
        setStake(0);
        setSelectedOption(Options.none)

        // wait setstate then save
        
        
      }
      if (selectedOption == Options.none){setOptionMissing(true)}
      if (stake <= 0){}
      if (gamblerName == ""){setGamblerNameMissing(true)}          
    }

  return (
    <View style={styles.container}>

        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}><Text style={styles.headerText}>{outcomeOne}</Text></View>
          <View style={{flexDirection: 'column'}}>
            <Text style={[styles.headerText, {textDecorationLine: 'underline'}]}>Gamble Book</Text>
            <Text style={styles.headerText}>vs.</Text>
          </View>
          <View style={styles.headerTextContainer}><Text style={styles.headerText}>{outcomeTwo}</Text></View>
        </View>

        <TextInput
                style={[styles.textInput, gamblerNameMissing ? {borderColor: 'red'} : {}]}
                onChangeText={handleNameInputChange}
                value={gamblerName}
                placeholder="Name of bettor"
                autoCapitalize='characters'
          />

        <View style={styles.buttonRow}>
            <SelectionButton text={Options.one} style={optionMissing ? {borderColor: 'red'} : {}} onPress={() => handleOptionChange(Options.one)} selected={selectedOption}/>
            <SelectionButton text={Options.even} style={[optionMissing ? {borderColor: 'red'} : {}, styles.middleButton]} onPress={() => handleOptionChange(Options.even)} selected={selectedOption}/>
            <SelectionButton text={Options.two} style={optionMissing ? {borderColor: 'red'} : {}} onPress={() => handleOptionChange(Options.two)} selected={selectedOption}/>
        </View>

        <CircularSlider value={stake}
                        onChange={(val: number) => setStake(Math.round(val))}
                        textSize={30}
                        showText={true}
                        showEuro={true}
                        textColor="white"
                        trackColor='white' 
                        trackTintColor='grey'
                        trackWidth={3}
                        thumbColor='white'
        />

        <Slider value={multiplier}
                onValueChange={(val: number) => setMultiplier(Number(val.toFixed(2)))}
                style={{width:"80%",height:50}}
                minimumValue={1}
                maximumValue={10} 
                step={0.05}
                allowTouchTrack
                trackStyle={{height: 3}}
                maximumTrackTintColor = 'grey'
                minimumTrackTintColor = 'white'
                thumbStyle={{height: 30, width: 30, backgroundColor: 'white'}}
                thumbTouchSize={{width: 1, height: 1}}
          />
         
        <Text style={{color: 'white', fontFamily: "Play-Bold"}}>{addZeroes(stake)}€ &times; {addZeroes(multiplier)} = {addZeroes(currentPrize)}€</Text>

        <View style={{flexDirection: 'row', marginTop: 10}}>
          <DefaultButton text="<<" onPress={() => handleMultiplierChange(multiplierChange.decrease)} />
          <DefaultButton text=">>" onPress={() => handleMultiplierChange(multiplierChange.increase)} />
        </View>

        <View style={{flexDirection: 'row'}}>
          <DefaultButton text="Add Bet"
                         onPress={() => addBet()}
                        style={{marginTop: 10}} />
        </View>
        

    
        <BetList bets={bets} />

        <View style={styles.bottomContainer}>
          <HouseIncome bets={bets}
                       currentPrice={currentPrize}
                       houseEquity={houseEquity}
                       currentStake={stake}
                       currentMultiplier={multiplier}
                       selectedOption={selectedOption} />
        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
    alignItems: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: 'white', 
      marginBottom: 7, 
      width: "90%"
    },
    headerTextContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 10
    },
    headerText: {
      // flex: 1,
      textAlign: 'center',
      justifyContent: 'center',
      fontFamily: "Play-Bold",
      textTransform: 'uppercase',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 20
    },
    textInput: { 
      height: 40, 
      width: "35%",
      borderColor: 'white', 
      borderWidth: 1, 
      color: 'white',
      borderRadius: 5,
      textAlign: 'center',
      marginBottom: 10
    },
    bottomContainer: {
      justifyContent: 'flex-end', 
      flex: 1,
      marginBottom: 20,
    },
    middleButton: {
      marginLeft: 5,
      marginRight: 5
        
    }
});

export default GambleScreen;