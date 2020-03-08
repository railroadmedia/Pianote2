/**
 * forgotPassword
 */
import React from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity,
    Keyboard,
    Animated,
    TouchableHighlight,
} from 'react-native';
import { userForgotPassword } from '@musora/services';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';

export default class forgotPassword extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.forgotPassword - this.forgotPassword.bind(this)
        this.state = {
            email: '',
            pianoteYdelta: new Animated.Value(0),
            forgotYdelta: new Animated.Value(fullHeight*0.075),
            secureTextEntry: true,
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
                    toValue: fullHeight*0.375,
                    duration: 250,
                }
            ),
            Animated.timing(
                this.state.pianoteYdelta, {
                    toValue: fullHeight*0.15,
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


    forgotPassword = async () => {
        this.textInput.clear()

        const { response, error } = await userForgotPassword({
            email: this.state.email,
        });

        if(error) {
            console.error(error);
        } else {
            console.log(response)
            this.props.navigation.navigate('LOGINCREDENTIALS')
        }
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
                <Animated.View key={'forgotpassword'}
                        style={{
                            position: 'absolute',
                            bottom: this.state.forgotYdelta,
                            width: fullWidth,
                            zIndex: 4,
                        }}
                    >
                    <Text
                        onPress={() => {
                            this.props.navigation.navigate('LOGINCREDENTIALS')
                        }}
                        style={{
                            fontFamily: 'Roboto',
                            fontSize: 16*factorRatio,
                            color: 'grey',
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                        }}
                    >
                        Already a member? Log in.
                    </Text>
                    <View style={{height: 7.5*factorVertical}}/>
                    <Text
                        onPress={() => {
                            this.props.navigation.navigate('CREATEACCOUNT')
                        }}
                        style={{
                            fontFamily: 'Roboto',
                            fontSize: 16*factorRatio,
                            color: 'grey',
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                        }}
                    >
                        Not a member?
                    </Text>
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
                        zIndex: 5,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('LOGINCREDENTIALS')
                        }}
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
                        <View style={{flex: 0.425,}}/>
                        <Pianote
                            height={90*factorRatio}
                            width={190*factorRatio}
                            fill={'#fb1b2f'}
                        />
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                fontSize: 24*factorRatio,
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            The Ultimate Online  {"\n"} Piano Lessons Experience.
                        </Text>
                        <View style={{height: 30*factorVertical}}/>
                        <View key={'email'}
                            style={{
                                height: fullHeight*0.06,
                                width: fullWidth*0.9,
                                borderRadius: 50*factorRatio,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                paddingLeft: 20*factorHorizontal,
                            }}
                        >
                            <TextInput 
                                ref={(ref) => { this.textInput = ref }}
                                autoCorrect={false}
                                keyboardAppearance={'dark'}
                                placeholderTextColor={'grey'}
                                placeholder={'Email Address'}
                                onChangeText={(email) => this.setState({email})}
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 18*factorRatio
                                }}
                            />
                        </View>
                        <View style={{height: 30*factorVertical}}/>
                        <View key={'login'}
                            style={{
                                height: fullHeight*0.06,
                                width: fullWidth*0.65,
                                borderRadius: 50*factorRatio,
                                borderColor: '#fb1b2f',
                                backgroundColor: (this.state.email.length > 0) ? 
                                    '#fb1b2f' : 'transparent',
                                borderWidth: 2,
                            }}
                        >
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={() => {
                                    this.forgotPassword()
                                }}
                                style={[
                                    styles.centerContent, {
                                    height: '100%',
                                    width: '100%',
                                    flexDirection: 'row',
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
                                    RESET PASSWORD
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Animated.View>
            </View>
        )
    }
}