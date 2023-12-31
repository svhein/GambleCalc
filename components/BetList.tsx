import React, {useMemo, useState} from "react";
import {View, Text, StyleSheet, ScrollView, TouchableHighlight} from "react-native";
import COLORS from "../colors";
import { Bet, addZeroes } from "../screens/GambleScreen";


interface BetListProps {
    bets: Bet[];
    openEditView(bet: Bet): void;
}

const BetList: React.FC<BetListProps> = ({ bets, openEditView }) => {
    const renderedBets = useMemo(() => {
      return bets.map((bet) => {
        return (
          <TouchableHighlight key={bet.id} style={styles.row} onPress={() => openEditView(bet)} underlayColor={COLORS.secondary}>
            <>
            <Text style={styles.text}>{bet.GamblerName}</Text>
            <Text style={styles.text}>{bet.option}</Text>
            <Text style={styles.text}>{addZeroes(bet.stake)}€</Text>
            <Text style={styles.text}>{addZeroes(bet.multiplier)}</Text>
            <Text style={styles.text}>{addZeroes(bet.stake * bet.multiplier)}€</Text>
            </>
          </TouchableHighlight>
        );
      });
    }, [bets]);
    if (bets.length > 0 ){
        return <View style={{flex: 2, marginTop: 10, width: "90%"}}><ScrollView>{renderedBets}</ScrollView></View>;
    } else {
        return (
            <View style={styles.NoBetsContainer}>
                <Text style={styles.noBetsText}>No Bets </Text>
            </View>
        )
    }
    
  };
  
  const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%",
        backgroundColor: COLORS.primary,
        borderTopWidth: 1,
        borderColor: 'white',
    },
    text: {
        color: 'white',
        alignSelf: 'stretch',
        textAlign: 'center',
        width: "20%",
    },
    NoBetsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
        borderTopWidth: 1,
        borderColor: 'white',
        width: "90%",
        marginTop: 10,
    },
    noBetsText: {
        textAlign: 'center',
        color: 'white',
        fontFamily: "Play-Bold",
        textTransform: 'uppercase',
    }
  });
  
  export default BetList;