/**
 * CreateAccount
 */
import React from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity,
    Keyboard,
    Animated,
    Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { userLogin } from '@musora/services';
import FastImage from 'react-native-fast-image';
import CheckEmail from '../../modals/CheckEmail.js';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';

export default class CreateAccount extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            pianoteYdelta: new Animated.Value(0),
            forgotYdelta: new Animated.Value(fullHeight*0.075),
            showCheckEmail: false,
            step: 1,
            email: '',
            validEmail: true,
        }
    }


    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardWillShow', this._keyboardDidShow
        )
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardWillHide', this._keyboardDidHide
        )
    }


    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
  

    _keyboardDidShow = async () => {
        Animated.parallel([
            Animated.timing(
                this.state.forgotYdelta, {
                    toValue: fullHeight*0.365,
                    duration: 250,
                }
            ),
            Animated.timing(
                this.state.pianoteYdelta, {
                    toValue: fullHeight*0.2,
                    duration: 250,
                }
            )
        ]).start()
    }
  

    _keyboardDidHide = async () => {
        Animated.parallel([
            Animated.timing(
                this.state.forgotYdelta, {
                    toValue: fullHeight*0.075,
                    duration: 250,
                }
            ),
            Animated.timing(
                this.state.pianoteYdelta, {
                    toValue: 0,
                    duration: 250,
                }
            )
        ]).start()
    }


    verifyEmail = () => {
        if(this.state.email.length > 0) {
            Alert.alert(
                'Test when email is taken', 'or continue', 
                [
                    {text: 'Test failure', onPress: () => this.setState({showCheckEmail: true})},
                    {text: 'Continue', onPress: () => this.emailValid()}
                ],
                { cancelable: false }
            )
        }
    }


    emailValid = async () => {
        // verified email
        await AsyncStorage.setItem('email', this.state.email)
        await this.props.navigation.navigate('CREATEACCOUNT2')
    }

    render() {
        return (
            <View 
                styles={[
                    styles.centerContent, {
                    flex: 1, 
                    alignSelf: 'stretch',
                }]}
            >
                <GradientFeature
                    color={'dark'}
                    opacity={0.5}
                    height={'100%'}
                    borderRadius={0}
                />
                
                <Animated.View key={'progress'}
                    style={{
                        position: 'absolute',
                        bottom: this.state.forgotYdelta,
                        height: fullHeight*0.06,
                        width: fullWidth,
                        zIndex: 4,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{flex: 1}}></View>
                    <View
                        style={{
                            height: '100%',
                            width: '92.5%',
                            borderRadius: 40*factorRatio,
                            borderWidth: 2*factorRatio,
                            backgroundColor: 'rgba(23, 24, 25, 0.6)',
                            flexDirection: 'row',
                        }}
                    >
                        <View key={'step1'}
                            style={{
                                flex: 1.1,
                                height: '100%',
                                borderTopLeftRadius: 40*factorRatio,
                                borderBottomLeftRadius: 40*factorRatio,
                                borderTopRightRadius: (this.state.step == 1) ? 40*factorRatio : null,
                                borderBottomRightRadius: (this.state.step == 1) ? 40*factorRatio : null,
                                backgroundColor: 'black',
                                zIndex: 2,
                            }}
                        >
                            <View
                                style={[
                                    styles.centerContent, {
                                    flex: 1,
                                    borderTopRightRadius: (this.state.step == 1) ? 40*factorRatio : null,
                                    borderBottomRightRadius: (this.state.step == 1) ? 40*factorRatio : null,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'RobotoCondensed-Regular',
                                        fontSize: 12*factorRatio,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}    
                                >
                                    Step 1:
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'RobotoCondensed-Regular',
                                        fontSize: 12*factorRatio,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}    
                                >
                                    EMAIL ADDRESS
                                </Text>
                            </View>
                        </View>
                        <View key={'step2'}
                            style={{
                                flex: 1.1,
                                borderTopRightRadius: (this.state.step == 1) ? 40*factorRatio : null,
                                borderBottomRightRadius: (this.state.step == 1) ? 40*factorRatio : null,
                            }}
                        >
                            <View
                                style={[
                                    styles.centerContent, {
                                    flex: 1,
                                    borderTopRightRadius: (this.state.step == 2) ? 40*factorRatio : null,
                                    borderBottomRightRadius: (this.state.step == 2) ? 40*factorRatio : null,
                                    backgroundColor: (this.state.step > 1) ? 'black' : null,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'RobotoCondensed-Regular',
                                        fontSize: 12*factorRatio,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}    
                                >
                                    Step 2:
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'RobotoCondensed-Regular',
                                        fontSize: 12*factorRatio,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}    
                                >
                                    SET A PASSWORD
                                </Text>
                            </View>
                   </View>
                        <View key={'step3'}
                            style={{
                                flex: 1,
                                borderTopRightRadius: (this.state.step == 3) ? 40*factorRatio : null,
                                borderBottomRightRadius: (this.state.step == 3) ? 40*factorRatio : null,
                            }}
                        >
                            <View
                                style={[
                                    styles.centerContent, {
                                    flex: 1,
                                    borderTopRightRadius: (this.state.step == 3) ? 40*factorRatio : null,
                                    borderBottomRightRadius: (this.state.step == 3) ? 40*factorRatio : null,
                                    backgroundColor: (this.state.step > 2) ? 'black' : null,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'RobotoCondensed-Regular',
                                        fontSize: 12*factorRatio,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}    
                                >
                                    Step 3:
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'RobotoCondensed-Regular',
                                        fontSize: 12*factorRatio,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}    
                                >
                                    CHOOSE A PLAN
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1}}></View>
                </Animated.View>
                
                <FastImage
                    style={{
                        height: fullHeight,
                        width: fullWidth, 
                        alignSelf: 'stretch',
                    }}
                    source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View key={'goBackIcon'}
                    style={[
                        styles.centerContent, {
                        position: 'absolute',
                        left: 15*factorHorizontal,
                        top: 40*factorVertical,
                        height: 50*factorRatio,
                        width: 50*factorRatio,
                        zIndex: 10,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <EntypoIcon
                            name={'chevron-thin-left'}
                            size={25*factorRatio}
                            color={'white'}
                        />
                    </TouchableOpacity>
                </View>
                
                <View key={'CreateAccount'}
                    style={[
                        styles.centerContent, {
                        position: 'absolute',
                        top: 40*factorVertical,
                        width: fullWidth,
                        zIndex: 5,
                    }]}
                >
                    <Text
                        style={{
                            fontFamily: 'Roboto',
                            fontSize: 24*factorRatio,
                            fontWeight: '600',
                            color: 'white',
                        }}
                    >
                        Create Account
                    </Text>
                </View>
                
                <Animated.View key={'items'}
                    style={{
                        position: 'absolute',
                        bottom: this.state.pianoteYdelta,
                        height: fullHeight,
                        width: fullWidth,
                        zIndex: 3,
                    }}
                >
                    <View key={'container'}
                        style={{
                            height: fullHeight,
                            width: fullWidth,
                            alignItems: 'center',
                        }}
                    >
                        <View style={{flex: 0.45,}}></View>
                        <View key={'whatYourEmail'}
                            style={{
                                height: 35*factorVertical,
                                flexDirection: 'row',
                                paddingLeft: 20*factorHorizontal,  
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20*factorRatio,
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    color: 'white',
                                }}
                            >
                                What's your email?
                            </Text>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View key={'email'}
                            style={{
                                height: fullHeight*0.06,
                                width: fullWidth*0.9,
                                borderRadius: 50*factorRatio,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                paddingLeft: 20*factorHorizontal,
                                flexDirection: 'row',
                            }}
                        >
                            <TextInput 
                                autoCorrect={false}
                                keyboardAppearance={'dark'}
                                placeholderTextColor={'grey'}
                                placeholder={'Email Address'}
                                keyboardType={'email-address'}
                                onChangeText={(email) => this.setState({email})}
                                style={{
                                    fontSize: 18*factorRatio,
                                    fontFamily: 'Roboto',
                                    flex: 1,
                                }}
                            />
                        </View>
                        <View style={{height: 45*factorVertical}}></View>
                        <View key={'login'}
                            style={{
                                height: fullHeight*0.06,
                                width: fullWidth*0.4,
                                borderRadius: 50*factorRatio,
                                borderColor: '#fb1b2f',
                                backgroundColor: (this.state.email.length > 0) ? 
                                                    '#fb1b2f' : 'transparent',
                                borderWidth: 2,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => this.verifyEmail()}
                                style={[
                                    styles.centerContent, {
                                    height: '100%',
                                    width: '100%',
                                    flexDirection: 'row',
                                    zIndex: 10,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontSize: 18*factorRatio,
                                        fontFamily: 'Roboto',
                                        fontWeight: '700',
                                        color: (this.state.email.length > 0) ? 
                                            'white' : '#fb1b2f',
                                    }}                            
                                >
                                    NEXT
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                <Modal key={'checkEmailModal'}
                    isVisible={this.state.showCheckEmail}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <CheckEmail
                        hideCheckEmail={() => {
                            this.setState({
                                showCheckEmail: false
                            })
                        }}
                    />
                </Modal>
            </View>
        )
    }
}