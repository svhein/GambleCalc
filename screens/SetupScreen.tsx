import React, {useEffect, useState} from "react";
import {View, Text, TextInput, StyleSheet} from "react-native";
import colors from "../colors";
import { DefaultButton } from "../components/Buttons";
import uuid from 'react-native-uuid';

interface SetupProps {
    navigation: any;
}

export const SetupScreen: React.FC<SetupProps> = ({navigation}) => {

    const [outcomeOne, setOutcomeOne] = useState<string>("")
    const [outcomeTwo, setOutcomeTwo] = useState<string>("")

    const [outComeOneMissing, setOutcomeOneMissing] = useState<boolean>(false);
    const [outComeTwoMissing, setOutcomeTwoMissing] = useState<boolean>(false);

    const gameId = String(uuid.v4());

    function handleButtonPress(){
        
        console.log("outcomeOne", outcomeOne)
        console.log("outcomeTwo", outcomeTwo)

        if (outcomeOne != "" && outcomeTwo != ""){
            navigation.navigate("GambleScreen", {
                outcomeOne: outcomeOne,
                outcomeTwo: outcomeTwo,
                gameId: gameId,
                source: "setup"
            })
        }
        if (outcomeOne == ""){
            setOutcomeOneMissing(true);
        }
        if (outcomeTwo == ""){
            setOutcomeTwoMissing(true);
        }
    }

    const handleOutComeOneChange = (text) => {
        setOutcomeOne(text);
        setOutcomeOneMissing(false);
    }
    
    const handleOutComeTwoChange = (text) => { 
        setOutcomeTwo(text);
        setOutcomeTwoMissing(false);
    }

    return (
        <View style={styles.container}>
            <TextInput placeholder="OUTCOME 1"
                        onChangeText={handleOutComeOneChange}
                        style={[styles.textInput, outComeOneMissing ? {borderColor: 'red'} : {}]}
                        autoCapitalize='characters' />

            <Text style={styles.text}>vs.</Text>

            <TextInput placeholder="OUTCOME 2"
                        onChangeText={handleOutComeTwoChange}
                        style={[styles.textInput, outComeTwoMissing ? {borderColor: 'red'} : {}]}
                        autoCapitalize='characters' />

            <DefaultButton onPress={handleButtonPress} 
                            text="Start" 
                            style={styles.button}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        // flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: "Play-Bold",
        textTransform: 'uppercase',
        padding: 20
      },
    textInput: {
        borderColor: 'white',
        borderWidth: 1,
        width: "50%",
        height: 40,
        borderRadius: 5,
        textAlign: 'center',
        fontFamily: "Play-Bold",
    },
    button: {
        marginTop: 100
    }
    
})

export default SetupScreen;