import React, { useState, useEffect, useMemo } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Vibration,
  Alert
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
SQLite.DEBUG(true);

const GambleScreen: React.FC<GambleScreenProps> = ({route}) => {

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

    const [gameId, setGameId] = useState<string>("")

    const [bets, setBets] = useState<Bet[]>([])

    console.log(route)

    useEffect(() => {
      if (route.params.source == "setup"){
        console.log('setup fored')
        const {outcomeOne, outcomeTwo} = route.params;
        setOutcomeOne(outcomeOne);
        setOutcomeTwo(outcomeTwo);
        setGameId(String(uuid.v4()));
        save();
      }
      else if (route.params.source == "load"){
        console.log('load fored')
        const {outcomeOne, outcomeTwo, bets, gameId} = route.params;
        // TODO: deserialize bets
        setOutcomeOne(outcomeOne);
        setOutcomeTwo(outcomeTwo);
        setBets(bets)
        setGameId(gameId)
      }
    }, [])



    // useEffect(() => {
    //   const {outcomeOne, outcomeTwo} = route.params;
    //   console.log(outcomeOne, outcomeTwo)

    // }, [])

    // const db = SQLite.openDatabase(
    //   {
    //     name: 'gamblecalc.db',
    //     location: 'default',
    //     createFromLocation: '~SQLite.db',
    //   },
    //   () => {console.log('Database opened successfully!')} ,
    //   error => {
    //     console.log("Error while opening database: " + error);
    //   }
    // );
    
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
    
    function save(){
      const db = SQLite.openDatabase(
        {
          name: "gamblecalc.db",
          location: "default",
        },
        () => {console.log('Database opened successfully!')},
        (error: any) => {console.log("Error while opening database: " + error)}
      )

      db.transaction((tx: any) => {
          console.log('saving...')
          tx.executeSql('INSERT OR REPLACE INTO events (id TEXT , outcomeOne TEXT, outcomeTwo TEXT, bets TEXT, houseEquity INTEGER, currentPrize INTEGER, currentStake INTEGER, currentMultiplier INTEGER, selectedOption TEXT)',
          [
            gameId,
            outcomeOne,
            outcomeTwo,
            JSON.stringify(bets),
            houseEquity,
            currentPrize,
            stake,
            multiplier,
            selectedOption
          ],
          (_ , results: any) => {
            const rows = results.rows;
            for (let i = 0; i < rows.length; i++) {
              console.log('Row:', rows.item(i));
            }
          },
          (error: any) => {
            console.log('Error while saving: ', error)
            db.close();
          }
          )
      })
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
        setHouseEquity(houseEquity + stake)
        // setGamblerName("")
      }
      if (selectedOption == Options.none){setOptionMissing(true)}
      if (stake <= 0){}
      if (gamblerName == ""){setGamblerNameMissing(true)}          
    }

  return (
    <View style={styles.container}>
        <Text style={[styles.headerText, {textDecorationLine: 'underline'}]}>Gamble Book</Text>

        <View style={{flexDirection: 'row'}}>
          <View style={styles.headerTextContainer}><Text style={styles.headerText}>{outcomeOne}</Text></View>
          <View style={styles.headerTextContainer}><Text style={styles.headerText}>vs.</Text></View>
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