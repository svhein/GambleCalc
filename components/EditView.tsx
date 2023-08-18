import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import COLORS from '../colors';
import { DefaultButton, SelectionButton } from '../components/Buttons';
import { Bet, addZeroes, Options } from '../screens/GambleScreen';

interface EditViewProps {
    bet: Bet;
    bets: Bet[];
    setBets: React.Dispatch<React.SetStateAction<Bet[]>>;

    setEditView: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
}


const EditView: React.FC<EditViewProps> = ({bet, bets, setBets, setEditView}) => {

    const [newStake, setNewStake] = useState<number>(bet.stake);
    const [newMultiplier, setNewMultiplier] = useState<number>(bet.multiplier);
    const [gamblerName, setGamblerName] = useState<string>(bet.GamblerName);
    const [newOption, setNewOption] = useState<Options>(bet.option);

    const [incorrectStake, setIncorrectStake] = useState<boolean>(false);
    const [incorrectMultiplier, setIncorrectMultiplier] = useState<boolean>(false);

    // const initialStake = bet.stake;

    // const inputString = "123.45";
    // number is positive integer or positive valid decimal number
    const regex = new RegExp("^(?!-)[0-9]+(\.[0-9]+)?$");

    const validateStake = () => {
        return regex.test(newStake.toString());
    }

    const validateMultiplier = () => {
        return regex.test(newMultiplier.toString());
    }

    const handleOptionChange = (option: Options) => {
        setNewOption(option);
    }

    const handleSave = () => {
        if (validateStake() && validateMultiplier()) {
            setBets(bets.map((b) => {
                if (b.id === bet.id) {
                    return {
                        ...b,
                        GamblerName: gamblerName,
                        option: newOption,
                        stake: newStake,
                        multiplier: newMultiplier,
                    }
                } else {
                    return b;
                }
            }))
            setEditView(null);
        }
        else {
            if (!validateStake()) {
                setIncorrectStake(true);
            }
            if (!validateMultiplier()) {
                setIncorrectMultiplier(true);
            }
        }
    }

    const handleRemove = () => {
        setBets(bets.filter((b) => b.id !== bet.id));
        setEditView(null);
    }

    return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                onRequestClose={() => setEditView(null)}>
                
                <View style={[styles.container]}>

                    <View style={styles.removeButtonContainer}>
                        <DefaultButton text="REMOVE BET"
                            onPress={() => handleRemove()}
                            style={{width: 'auto'}}
                     />
                    </View>

                    <Text style={[styles.text, {marginTop: 20, marginBottom: 15, color: 'white', fontSize: 17}]}>edit</Text>

                    <View style={[styles.subContainer]}>
                        <Text style={styles.text}>Bettor name</Text>
                        <TextInput placeholder={bet.GamblerName}
                                onChangeText={setGamblerName}
                                style={[styles.textInput]}
                                autoCapitalize='characters'
                                placeholderTextColor={COLORS.placeholder}  />
                    </View> 

                    <View style={styles.subContainer}>
                        <Text style={styles.text}>Option</Text>
                        <View style={{flexDirection: 'row', marginBottom: 20}}>
                        <SelectionButton text={Options.one} style={styles.selectButton} onPress={() => handleOptionChange(Options.one)} selected={newOption}/>
                        <SelectionButton text={Options.even} style={[styles.selectButton, styles.middleButton]} onPress={() => handleOptionChange(Options.even)} selected={newOption}/>
                        <SelectionButton text={Options.two} style={styles.selectButton} onPress={() => handleOptionChange(Options.two)} selected={newOption}/>
                         </View>
                    </View>

                    <View style={styles.subContainer}>
                        <Text style={styles.text}>Stake</Text>
                        <TextInput placeholder={addZeroes(bet.stake)}
                                onChangeText={(number) => setNewStake(parseInt(number))}
                                style={[styles.textInput]}
                                autoCapitalize='characters'
                                keyboardType='numeric'
                                placeholderTextColor={COLORS.placeholder}  />
                    </View> 
                    <View style={styles.subContainer}>
                        <Text style={styles.text}>Multiplier</Text>
                        <TextInput placeholder={addZeroes(bet.multiplier)}
                                onChangeText={(number) => setNewMultiplier(parseInt(number))}
                                style={[styles.textInput]}
                                autoCapitalize='characters'
                                keyboardType='numeric'
                                placeholderTextColor={COLORS.placeholder}  />
                    </View> 

                    <View style={{width: '90%'}}> 
                        <DefaultButton  text="SAVE"
                                        onPress={handleSave}
                                        style={{marginBottom: 20, width: 'auto'}} />
                    </View>
                </View>  
            </Modal>
    )
}

const styles= StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        // flex: 1,
        // zIndex: 99,
        // marginTop: 75,
        width: "70%",
        height: "auto",
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: '20%',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },
    textInput: {
        borderColor: 'white',
        borderWidth: 1,
        width: "40%",
        height: 35,
        borderRadius: 5,
        // textAlign: 'center',
        fontFamily: "Play-Bold",
        marginBottom: 20,
        color: 'white'
    },
    text: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: "Play-Bold",
        textTransform: 'uppercase',
        // width: '20%',
        textDecorationLine: 'underline',
        marginBottom: 5,
        color: 'white'
    },
    middleButton: { marginLeft: 10, marginRight: 10},
    selectButton: {
        width: 70,
        height: 30,
    },
    subContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    removeButtonContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderColor: 'white',
        width: '90%'

    }

});

export default EditView;