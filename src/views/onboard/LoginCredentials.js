/**
 * LoginCredentials
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
import EntypoIcon from 'react-native-vector-icons/Entypo';
import PasswordEmailMatch from '../../modals/PasswordEmailMatch.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import PasswordHidden from 'Pianote2/src/assets/img/svgs/passwordHidden.svg';
import PasswordVisible from 'Pianote2/src/assets/img/svgs/passwordVisible.svg';

export default class LoginCredentials extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            pianoteYdelta: new Animated.Value(0),
            forgotYdelta: new Animated.Value(fullHeight*0.075),
            secureTextEntry: true,
            showPasswordEmailMatch: false,
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


    login = async () => {
        const { response, error } = await userLogin({
            email: this.state.email,
            password: this.state.password,
        });

        if(error) {
            console.log(error)
            this.setState({showPasswordEmailMatch: true})
        } else {
            await AsyncStorage.multiSet([
                ['token', JSON.stringify(response.data.token)],
                ['tokenTime', JSON.stringify(response.data.token)],
                ['email', this.state.email],
                ['password', this.state.password],
            ])
            this.props.navigation.navigate('HOME')
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
                            this.props.navigation.navigate('FORGOTPASSWORD')
                        }}
                        style={{
                            fontSize: 16*factorRatio,
                            fontFamily: 'Roboto',
                            color: 'grey',
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                        }}
                    >
                        Forgot your password? 
                    </Text>
                    <View style={{height: 7.5*factorVertical}}/>
                    <Text
                        onPress={() => {
                            this.props.navigation.navigate('SUPPORT')
                        }}
                        style={{
                            fontSize: 16*factorRatio,
                            fontFamily: 'Roboto',
                            color: 'grey',
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                        }}
                    >
                        Can't log in? Contact support.
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
                                fontSize: 24*factorRatio,
                                fontFamily: 'Roboto',
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            The Ultimate Online  {"\n"} Piano Lessons Experience.
                        </Text>
                        <View style={{height: 35*factorVertical}}/>
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
                        <View style={{height: 10*factorVertical}}/>
                        <View key={'password'}
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
                                placeholder={'Password'}
                                keyboardType={'email-address'}
                                secureTextEntry={this.state.secureTextEntry}
                                onChangeText={(password) => this.setState({password})}
                                style={{
                                    fontSize: 18*factorRatio,
                                    fontFamily: 'Roboto',
                                    flex: 1,
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({secureTextEntry: !this.state.secureTextEntry})
                                }}
                                style={[
                                    styles.centerContent, {
                                    height: '100%',
                                    marginRight: 10*factorHorizontal,
                                }]}
                            >
                                {this.state.secureTextEntry && (
                                <PasswordHidden
                                    height={22.5*factorRatio}
                                    width={22.5*factorRatio}
                                />
                                )}
                                {!this.state.secureTextEntry && (
                                <PasswordVisible
                                    height={22.5*factorRatio}
                                    width={22.5*factorRatio}
                                />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 35*factorVertical}}/>
                        <View key={'login'}
                            style={{
                                height: fullHeight*0.06,
                                width: fullWidth*0.4,
                                borderRadius: 50*factorRatio,
                                borderColor: '#fb1b2f',
                                borderWidth: 2*factorRatio,
                                backgroundColor: (this.state.email.length > 0 && 
                                                    this.state.password.length > 0) ? 
                                                    '#fb1b2f' : 'transparent',
                            }}
                        >
                            <TouchableOpacity
                                underlayColor={'transparent'}
                                onPress={() => {
                                    (this.state.password.length > 0 && this.state.email.length > 0) ? 
                                    Alert.alert(
                                        'Simulate failed payment', 'or continue', 
                                        [
                                            {text: 'Test failed payment', onPress: () => {
                                                this.props.navigation.navigate('MEMBERSHIPEXPIRED')
                                            }},
                                            {text: 'Continue', onPress: () => {
                                                this.login()
                                            }}
                                        ],
                                        { cancelable: false }
                                    )
                                    : 
                                    null
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
                                        fontSize: 20*factorRatio,
                                        fontFamily: 'Roboto',
                                        fontWeight: '700',
                                        color: (this.state.email.length > 0 && 
                                            this.state.password.length > 0) ? 
                                            'white' : '#fb1b2f',
                                    }}                            
                                >
                                    LOG IN
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
                <Modal key={'passwords'}
                    isVisible={this.state.showPasswordEmailMatch}
                    style={{
                        margin: 0, 
                        height: fullHeight,
                        width: fullWidth,
                    }}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={false}
                >
                    <PasswordEmailMatch
                        hidePasswordEmailMatch={() => {
                            this.setState({showPasswordEmailMatch: false})
                        }}
                    />
                </Modal>
            </View>
        )
    }
}