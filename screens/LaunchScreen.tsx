import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DefaultButton } from '../components/Buttons';
import COLORS from '../colors';
const SQLite = require('react-native-sqlite-storage')

type LaunchScreenProps = {
    navigation: any;
}

const LauchScreen: React.FC<LaunchScreenProps> = ({navigation}) => {

    const [dbInit, setDbInit] = React.useState<boolean>(false);

    useEffect(() => {
        // Initialize DB (Table) to the device
        const db = SQLite.openDatabase(
            {
              name: "gamblecalc.db",
              location: "default"
            },
            () => {console.log('Database opened successfully!')
                   setDbInit(true)},
            (error: any) => {console.log("Error while opening database: " + error)}
          )

        //   db.transaction((tx: any) => {
        //     tx.executeSql(
        //       'DROP TABLE IF EXISTS events',
        //       [],
        //       () => {
        //         console.log('events removed successfully');
        //       },
        //       (tx: any, error: any) => {
        //         console.log('Error removing table:', error);
        //       }
        //     );
        //   });
    
          db.transaction((tx: any) => {
              tx.executeSql('CREATE TABLE IF NOT EXISTS events (gameId TEXT UNIQUE, outcomeOne TEXT, outcomeTwo TEXT, bets TEXT, houseEquity INTEGER, currentPrize INTEGER, currentStake INTEGER, currentMultiplier INTEGER, selectedOption TEXT)', [], (tx: any, results: any) => {
                    db.close();
              })
          })         
    }, [])

    return (
        <View style={styles.container}>
            <DefaultButton onPress={() => navigation.navigate("SetupScreen")} text="New" style={styles.button}/>
            <DefaultButton  onPress={() => navigation.navigate("SavedGamesScreen")} text="Load" style={styles.button}/>
        </View>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        margin: 20
    }
})

export default  LauchScreen;