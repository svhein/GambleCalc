import React, {useState, useEffect} from 'react'
import {View, Text, StyleSheet} from "react-native";
import { Bet, Options, addZeroes } from "../screens/Gamble";

interface BetListProps {
    bets: Bet[];
    currentPrice: number;
    houseEquity: number;
}

const HouseIncome: React.FC<BetListProps> = ({bets, currentPrice, houseEquity}) => {

    function calculateHouseIncome(option: Options) {
        let payout = 0;
        bets.forEach(bet => {
            if (bet.option == option) {
                payout += bet.stake * bet.multiplier;
            }
        }) 
        return addZeroes(houseEquity - payout);
    }

    function getTextColor(option: Options) {
        if (Number(calculateHouseIncome(option)) > 0){
            return {color: 'green'}
        }
        else if (Number(calculateHouseIncome(option)) < 0){
            return {color: 'red'}
        }
        else {
            return {color: 'white'}
        }
    }



    return (
        <View style={styles.container}>
            <Text style={styles.header}>House income</Text>

            <View style={[styles.textRow]}>
                <Text style={styles.text}>1</Text>
                <Text style={styles.text}>X</Text>
                <Text style={styles.text}>2</Text>
            </View>
            <View style={[styles.textRow]}>
                <Text style={[styles.text, getTextColor(Options.one)]}>{calculateHouseIncome(Options.one)} €</Text>
                <Text style={[styles.text, getTextColor(Options.even)]}>{calculateHouseIncome(Options.even)} €</Text>
                <Text style={[styles.text, getTextColor(Options.two)]}>{calculateHouseIncome(Options.two)} €</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: 'white',
        borderTopWidth: 1,
        width: "90%",
        marginTop: 20,
    },
    header: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: "Play-Bold",
        textTransform: 'uppercase',
        textDecorationLine: 'underline'
    },
    text: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: "Play-Bold",
        textTransform: 'uppercase',
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: "100%" 

    }
})

export default HouseIncome;