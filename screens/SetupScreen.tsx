import React, {useState} from "react";
import {View, Text, TextInput, StyleSheet} from "react-native";
import colors from "../colors";
import { DefaultButton } from "../components/Buttons";

interface SetupProps {
    navigation: any;
}

export const SetupScreen: React.FC<SetupProps> = ({navigation}) => {

    const [outcomeOne, setOutcomeOne] = useState<string>("")
    const [outcomeTwo, setOutcomeTwo] = useState<string>("")

    return (
        <View style={styles.container}>
            <TextInput placeholder="OUTCOME 1"
                        onChangeText={setOutcomeOne}
                        style={styles.textInput}
                        autoCapitalize='characters' />

            <Text style={styles.text}>vs.</Text>

            <TextInput placeholder="OUTCOME 2"
                        onChangeText={setOutcomeTwo}
                        style={styles.textInput}
                        autoCapitalize='characters' />

            <DefaultButton onPress={() => navigation.navigate("GambleScreen", {
                                 outcomeOne: outcomeOne,
                                 outcomeTwo: outcomeTwo,
                                 source: "setup"
                            })} 
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