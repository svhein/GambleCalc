import React, {useState, useEffect, useMemo} from 'react'
import {View, Text, StyleSheet} from "react-native";
import { Bet, Options, addZeroes } from "../screens/GambleScreen";

interface BetListProps {
    bets: Bet[];
    currentPrice: number;
    houseEquity: number;
    currentStake: number;
    currentMultiplier: number;
    selectedOption: Options;
}

function getTextColor(income: number | string) {
    income = Number(income);
    if (income < 0) {
        return {color: 'red'}
    }
    else if (income > 0) {
        return {color: 'green'}
    }
    else {
        return {color: 'white'}
    }

}

const HouseIncome: React.FC<BetListProps> = ({bets, currentPrice, houseEquity, currentStake, currentMultiplier, selectedOption}) => {

    const [incomeOne, setIncomeOne] = useState<number>(0);
    const [incomeTwo, setIncomeTwo] = useState<number>(0);
    const [incomeEven, setIncomeEven] = useState<number>(0);

    useMemo(() => {
        let payoutOne = 0;
        let payoutTwo = 0;
        let payoutEven = 0;

        bets.forEach(bet => {
            if (bet.option == Options.one) {
                payoutOne += bet.stake * bet.multiplier;
            }
            else if (bet.option == Options.two) {
                payoutTwo += bet.stake * bet.multiplier;
            }
            else if (bet.option == Options.even) {
                payoutEven += bet.stake * bet.multiplier;
            }
        }) 

        switch(selectedOption) {
            case Options.one:
                payoutOne += currentStake * currentMultiplier;
                break;
            case Options.two:
                payoutTwo += currentStake * currentMultiplier;
                break;
            case Options.even:
                payoutEven += currentStake * currentMultiplier; 
                break;
        }

        let currentEquity: number = houseEquity + currentStake;

        setIncomeOne(Number(addZeroes(currentEquity - payoutOne)));
        setIncomeTwo(Number(addZeroes(currentEquity - payoutTwo)));
        setIncomeEven(Number(addZeroes(currentEquity - payoutEven)));
    }, [bets, houseEquity, currentStake, currentMultiplier, selectedOption])

    function calculateHouseIncome(option: Options) {
        let payout = 0;
        bets.forEach(bet => {
            if (bet.option == option) {
                payout += bet.stake * bet.multiplier;
            }
        }) 
        return addZeroes(houseEquity - payout);
    }
    return (
        <View style={styles.container}>
            <Text style={styles.header}>income</Text>

            <View style={[styles.textRow]}>
                <Text style={styles.text}>1</Text>
                <Text style={styles.text}>X</Text>
                <Text style={styles.text}>2</Text>
            </View>
            <View style={[styles.textRow]}>
                <Text style={[styles.text, getTextColor(incomeOne)]}>{incomeOne} €</Text>
                <Text style={[styles.text, getTextColor(incomeEven)]}>{incomeEven} €</Text>
                <Text style={[styles.text, getTextColor(incomeTwo)]}>{incomeTwo} €</Text>
            </View>
        </View>
    )
}

export const SavedHouseIncome: React.FC<{bets: Bet[]}> = ({bets}) => {

    const calculateEquity = () => {
        let equity = 0;
        bets.forEach(bet => {
            equity += bet.stake;
        }) 
        return equity;
    }

    let houseEquity = calculateEquity();

    const incomeOne = () => {
        let payout = 0;
        bets.forEach(bet => {
            if (bet.option == Options.one) {
                payout += bet.stake * bet.multiplier;
            }
        }) 
        return addZeroes(houseEquity - payout);
    }

    const incomeTwo = () => {
        let payout = 0;
        bets.forEach(bet => {
            if (bet.option == Options.two) {
                payout += bet.stake * bet.multiplier;
            }
        })
        return addZeroes(houseEquity - payout);
    }

    const incomeEven = () => {
        let payout = 0;
        bets.forEach(bet => {
            if (bet.option == Options.even) {
                payout += bet.stake * bet.multiplier;
            }
        })
        return addZeroes(houseEquity - payout);
    }

    const one  = incomeOne();
    const two = incomeTwo();
    const even = incomeEven();

    return (
        <View style={[styles.container, {marginTop: 2}]}>
    
            <View style={[styles.textRow]}>
                <Text style={styles.text}>1</Text>
                <Text style={styles.text}>X</Text>
                <Text style={styles.text}>2</Text>
            </View>
            <View style={[styles.textRow]}>
                <Text style={[styles.text, getTextColor(one)]}>{one} €</Text>
                <Text style={[styles.text, getTextColor(even)]}>{two} €</Text>
                <Text style={[styles.text, getTextColor(two)]}>{even} €</Text>
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