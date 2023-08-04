import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import COLORS from '../colors';
import {SelectionButton, DefaultButton} from '../components/Buttons';

import CircularSlider from '../components/CircularSlider';

export enum Option {
    none = "none",
    option1 = "1",
    option2 = "2",
    even = "X",
}

const GambleScreen: React.FC = () => {


    const [selectedOption, setSelectedOption] = useState<Option>(Option.none);
    const [bet, setBet] = useState<number>(0);
    console.log(selectedOption)

  return (
    <View style={styles.container}>
        <Text>Gamble Screen</Text>
        <View style={styles.buttonRow}>
            <SelectionButton text={Option.option1} onPress={() => setSelectedOption(Option.option1)} selected={selectedOption}/>
            <SelectionButton text={Option.even} onPress={() => setSelectedOption(Option.even)} selected={selectedOption}/>
            <SelectionButton text={Option.option2} onPress={() => setSelectedOption(Option.option2)} selected={selectedOption}/>
        </View>

        <CircularSlider value={bet}
                        onChange={(val) => setBet(val) }
                        trackColor='red' 
                        showText={true}/>

        <DefaultButton text="Add Bet" onPress={() => console.log("Gamble")} />



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    }
});


export default GambleScreen;