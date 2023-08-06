import React, {useMemo, useState} from "react";
import {View, Text, StyleSheet, ScrollView} from "react-native";
import COLORS from "../colors";
import { Bet, addZeroes } from "../screens/Gamble";


interface BetListProps {
    bets: Bet[];
}

const BetList: React.FC<BetListProps> = ({ bets }) => {
    const renderedBets = useMemo(() => {
      return bets.map((bet) => {
        return (
          <View key={bet.id} style={styles.row}>
            <Text style={styles.text}>{bet.GamblerName}</Text>
            <Text style={styles.text}>{bet.option}</Text>
            <Text style={styles.text}>{addZeroes(bet.stake)}€</Text>
            <Text style={styles.text}>{addZeroes(bet.multiplier)}</Text>
            <Text style={styles.text}>{addZeroes(bet.stake * bet.multiplier)}€</Text>
          </View>
        );
      });
    }, [bets]);
  
    return <View style={{flex: 1}}><ScrollView>{renderedBets}</ScrollView></View>;
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
    }
  });
  
  export default BetList;