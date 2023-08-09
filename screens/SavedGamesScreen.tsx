import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { DefaultButton } from '../components/Buttons';
import COLORS from '../colors';
const SQLite = require('react-native-sqlite-storage')
import { Bet, Game } from './GambleScreen';
import {SavedHouseIncome} from '../components/HouseIncome'

type SavedGamesScreenProps = {
    navigation: any;
}

// type Game = {
//     outcomeOne: string;
//     outcomeTwo: string;
//     bets: Bet[];
//     houseEquity: number;
//     currentPrize: number;
//     currentStake: number;
//     currentMultiplier: number;
//     selectedOption: string;
// }



const SavedGamesScreen: React.FC<SavedGamesScreenProps> = ({navigation}) => {

    const [savedGamesFound, setSavedGamesFound] = React.useState<boolean>(false);
    const [savedGames, setSavedGames] = React.useState<Game[]>([]);

    useEffect(() => {
        loadSavedGames();
    }, [])

    function loadSavedGames(){
        const db = SQLite.openDatabase(
            {
              name: "gamblecalc.db",
              location: "default",
            },
            () => {console.log('Database opened successfully!')},
            (error: any) => {console.log("Error while opening database: " + error)}
          )

          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM events',
              [],
              (tx, results: any) => {
                let len = results.rows.length;
                console.log('Result length', len);
                for (let i = 0; i < len; i++) {
                    setSavedGamesFound(true);
                    let row = results.rows.item(i);
                    row.bets = JSON.parse(row.bets);
                    setSavedGames([...savedGames, row as Game]);
                    console.log('Row:', row);
                }
                if (len == 0){
                    console.log('No saved games found')
                }
              },
              error => {
                console.error('Error querying events:', error);
              }
            );
          }) 
    }

    const gameParams = (game: Game) =>{

      return {
        outcomeOne: game.outcomeOne,
        outcomeTwo: game.outcomeTwo,
        bets: game.bets,
        houseEquity: game.houseEquity,
        currentPrize: game.currentPrize,
        currentStake: game.currentStake,
        currentMultiplier: game.currentMultiplier,
        selectedOption: game.selectedOption
        }
    }

    const SavedGame: React.FC<{game: Game}> = ({game}) => {

      console.log('Rendering saved game button', game.bets)

        return (
          <View style={styles.buttonContainer}>
               <TouchableHighlight style={styles.leftButtonContainer}
                                underlayColor={COLORS.secondary}
                                onPress={() => {
                                    navigation.navigate("GambleScreen", {
                                        ...gameParams(game),
                                        source: "saved"
                                    })
                                }}>
                  <View style={{alignItems: 'center'}}>
                    <View style={{justifyContent: 'center', height: "50%"}}>
                      <Text style={styles.text}>{game.outcomeOne} vs. {game.outcomeTwo}</Text>
                    </View>
                      {game.bets && <SavedHouseIncome bets={game.bets} />}
                  </View>
             </TouchableHighlight>

             <TouchableHighlight style={styles.rightButtonContainer}>
                <View style={styles.removeButtonWrapper}>
                  <Text style={styles.text}>X</Text>
                </View>
             </TouchableHighlight>
          </View>
      
        )
    }
 
    return (
        <View style={styles.container}>
             {savedGames.map((game: Game) => {
                    return <SavedGame game={game} key={game.gameId}/>
                })}
        </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    height: '12%'
  },
  leftButtonContainer: {
    backgroundColor: COLORS.primary,
    height: "auto",
    width: "70%",
    justifyContent: 'center',
  },
  rightButtonContainer: {
    width: '17%',
    justifyContent: 'center'
  },
  removeButtonWrapper: {
    borderLeftWidth: 1,
    borderColor: 'white',
    height: "80%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: "Play-Bold",
    textTransform: 'uppercase',
    color: 'white'
  }
})



export default SavedGamesScreen;