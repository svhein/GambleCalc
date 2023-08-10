import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { DefaultButton } from '../components/Buttons';
import COLORS from '../colors';
const SQLite = require('react-native-sqlite-storage')
import { Bet, Game } from './GambleScreen';
import {SavedHouseIncome} from '../components/HouseIncome'
import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';

type SavedGamesScreenProps = {
    navigation: any;
}

const SavedGamesScreen: React.FC<SavedGamesScreenProps> = ({navigation}) => {

    const [savedGamesFound, setSavedGamesFound] = React.useState<boolean>(false);
    const [savedGames, setSavedGames] = React.useState<Game[]>([]);

    useEffect(() => {
      function loadSavedGames(){

        let games: Game[] = [];

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
                    games.push(row as Game);
                    // setSavedGames([...savedGames, row as Game]);
                    // console.log('Row:', row);
                }
                if (len == 0){
                    console.log('No saved games found')
                }
                setSavedGames(games);
                db.close()
              },
              error => {
                console.error('Error querying events:', error);
              }
            );
          }) 
      } 
      loadSavedGames();
    }, [])

    function remove(gameId: string){
      console.log('Removing game id', gameId)
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
          'DELETE FROM events WHERE gameId = ?',
          [gameId],
          (tx, results: any) => {
            console.log('Deleted game with id', gameId);
            let games = savedGames.filter((game: Game) => game.gameId != gameId);
            setSavedGames(games);
            db.close()
          },
          error => {
            console.error('Error deleting game:', error);
          }
        );
      }) 
    }


    const gameParams = (game: Game) =>{

      return {
        gameId: game.gameId,
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

             <TouchableHighlight style={styles.rightButtonContainer} onPress={() => remove(game.gameId)} underlayColor={COLORS.secondary}>
                <View style={styles.removeButtonWrapper}>
                  <Text style={styles.text}>X</Text>
                </View>
             </TouchableHighlight>
          </View>
      
        )
    }

    const renderGame = ({ item }) => {
      return <SavedGame game={item} />
    }

    // pagingEnabled={true}
 
    return (
      
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Saved Books</Text>
          </View>

          {savedGames.length > 0 ? 
           <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center'}}>
           {savedGames.map((game: Game) => {
                  return <SavedGame game={game} key={game.gameId}/>
              })}
          </ScrollView> : 
          //  ---  OTHERWISE ----
         
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.text}>No saved books</Text>
          </View>
          }
          
         
      
        </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    // justifyContent: 'center'
  },
  buttonContainer: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    // height: '12%',
    height: 100,
    margin: 10,
    width: '95%'
  },
  leftButtonContainer: {
    backgroundColor: COLORS.primary,
    height: "auto",
    width: "80%",
    justifyContent: 'center',
  },
  rightButtonContainer: {
    width: '20%',
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
  },
  headerContainer: {
    height: '10%',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  headerText: {
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: "Play-Bold",
    textTransform: 'uppercase',
    color: 'white',
    fontSize: 20,
  },
  noSavedText: {
    
  }
})



export default SavedGamesScreen;