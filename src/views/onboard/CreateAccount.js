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
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import CheckEmail from '../../modals/CheckEmail.js';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';

var showListener =
    Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
var hideListener =
    Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export default class CreateAccount extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            pianoteYdelta: new Animated.Value(0.01),
            forgotYdelta: new Animated.Value(fullHeight * 0.075),
            showCheckEmail: false,
            step: 1,
            email: '',
            validEmail: true,
        };
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            showListener,
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            hideListener,
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = async () => {
        if (Platform.OS == 'ios') {
            Animated.parallel([
                Animated.timing(this.state.forgotYdelta, {
                    toValue: fullHeight * 0.365,
                    duration: 250,
                }),
                Animated.timing(this.state.pianoteYdelta, {
                    toValue: fullHeight * 0.2,
                    duration: 250,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(this.state.forgotYdelta, {
                    toValue: fullHeight * 0.035,
                    duration: 0,
                }),
                Animated.timing(this.state.pianoteYdelta, {
                    toValue: fullHeight * -0.25,
                    duration: 0,
                }),
            ]).start();
        }
    };

    _keyboardDidHide = async () => {
        Animated.parallel([
            Animated.timing(this.state.forgotYdelta, {
                toValue: fullHeight * 0.075,
                duration: 250,
            }),
            Animated.timing(this.state.pianoteYdelta, {
                toValue: 0.01,
                duration: 250,
            }),
        ]).start();
    };

    verifyEmail = async () => {
        if (this.state.email.length > 0) {
            await fetch(
                `http://app-staging.pianote.com/usora/is-email-unique?email=${this.state.email}`,
            )
                .then(response => response.json())
                .then(response => {
                    if (response.exists == false) {
                        this.props.navigation.navigate('CREATEACCOUNT2', {
                            email: this.state.email,
                        });
                    } else {
                        this.setState({showCheckEmail: true});
                    }
                })
                .catch(error => {
                    console.log('API Error: ', error);
                });
        }
    };

    render() {
        return (
            <View
                styles={[
                    styles.centerContent,
                    {
                        flex: 1,
                        alignSelf: 'stretch',
                    },
                ]}
            >
                <GradientFeature
                    color={'dark'}
                    opacity={0.5}
                    height={'100%'}
                    borderRadius={0}
                />
                <Animated.View
                    key={'progress'}
                    style={{
                        position: 'absolute',
                        bottom: this.state.forgotYdelta,
                        height: fullHeight * 0.06,
                        width: fullWidth,
                        zIndex: 4,
                        elevation: Platform.OS == 'android' ? 4 : 0,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{flex: 1}} />
                    <View
                        style={{
                            height: '100%',
                            width: '92.5%',
                            borderRadius: 40 * factorRatio,
                            borderWidth: 2 * factorRatio,
                            backgroundColor: 'rgba(23, 24, 25, 0.6)',
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            key={'step1'}
                            style={{
                                flex: 1.1,
                                height: '100%',
                                borderTopLeftRadius: 40 * factorRatio,
                                borderBottomLeftRadius: 40 * factorRatio,
                                borderTopRightRadius:
                                    this.state.step == 1 ? 40 * factorRatio : 0,
                                borderBottomRightRadius:
                                    this.state.step == 1 ? 40 * factorRatio : 0,
                                backgroundColor: 'black',
                                zIndex: 2,
                                elevation: Platform.OS == 'android' ? 2 : 0,
                            }}
                        >
                            <View
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 1,
                                        borderTopRightRadius:
                                            this.state.step == 1
                                                ? 40 * factorRatio
                                                : 0,
                                        borderBottomRightRadius:
                                            this.state.step == 1
                                                ? 40 * factorRatio
                                                : 0,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        fontSize: 12 * factorRatio,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                    Step 1:
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        fontSize: 12 * factorRatio,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                    EMAIL ADDRESS
                                </Text>
                            </View>
                        </View>
                        <View
                            key={'step2'}
                            style={{
                                flex: 1.1,
                                borderTopRightRadius:
                                    this.state.step == 1 ? 40 * factorRatio : 0,
                                borderBottomRightRadius:
                                    this.state.step == 1 ? 40 * factorRatio : 0,
                            }}
                        >
                            <View
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 1,
                                        borderTopRightRadius:
                                            this.state.step == 2
                                                ? 40 * factorRatio
                                                : 0,
                                        borderBottomRightRadius:
                                            this.state.step == 2
                                                ? 40 * factorRatio
                                                : 0,
                                        backgroundColor:
                                            this.state.step > 1
                                                ? 'black'
                                                : null,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        fontSize: 12 * factorRatio,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                    Step 2:
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        fontSize: 12 * factorRatio,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                    SET A PASSWORD
                                </Text>
                            </View>
                        </View>
                        <View
                            key={'step3'}
                            style={{
                                flex: 1,
                                borderTopRightRadius:
                                    this.state.step == 3 ? 40 * factorRatio : 0,
                                borderBottomRightRadius:
                                    this.state.step == 3 ? 40 * factorRatio : 0,
                            }}
                        >
                            <View
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 1,
                                        borderTopRightRadius:
                                            this.state.step == 3
                                                ? 40 * factorRatio
                                                : 0,
                                        borderBottomRightRadius:
                                            this.state.step == 3
                                                ? 40 * factorRatio
                                                : 0,
                                        backgroundColor:
                                            this.state.step > 2
                                                ? 'black'
                                                : null,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        fontSize: 12 * factorRatio,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                    Step 3:
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        fontSize: 12 * factorRatio,
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
                    <View style={{flex: 1}} />
                </Animated.View>
                <FastImage
                    style={{
                        height: '100%',
                        width: '100%',
                        alignSelf: 'stretch',
                    }}
                    source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View
                    key={'goBackIcon'}
                    style={[
                        styles.centerContent,
                        {
                            position: 'absolute',
                            left: 15 * factorHorizontal,
                            top: isNotch
                                ? 40 * factorVertical
                                : 30 * factorVertical,
                            height: 50 * factorRatio,
                            width: 50 * factorRatio,
                            zIndex: 10,
                            elevation: Platform.OS == 'android' ? 10 : 0,
                        },
                    ]}
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
                            size={25 * factorRatio}
                            color={'white'}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    key={'CreateAccount'}
                    style={[
                        styles.centerContent,
                        {
                            position: 'absolute',
                            top: isNotch
                                ? 40 * factorVertical
                                : 30 * factorVertical,
                            width: fullWidth,
                            zIndex: 5,
                            elevation: Platform.OS == 'android' ? 5 : 0,
                        },
                    ]}
                >
                    <Text
                        style={{
                            fontFamily: 'OpenSans',
                            fontSize: 24 * factorRatio,
                            fontWeight: Platform.OS == 'ios' ? '600' : 'bold',
                            color: 'white',
                        }}
                    >
                        Create Account
                    </Text>
                </View>
                <Animated.View
                    key={'items'}
                    style={{
                        position: 'absolute',
                        bottom: this.state.pianoteYdelta,
                        height: fullHeight,
                        width: fullWidth,
                        zIndex: 3,
                        elevation: Platform.OS == 'android' ? 3 : 0,
                    }}
                >
                    <View
                        key={'container'}
                        style={{
                            height: fullHeight,
                            width: fullWidth,
                            alignItems: 'center',
                        }}
                    >
                        <View style={{flex: 0.45}} />
                        <View
                            key={'whatYourEmail'}
                            style={{
                                flexDirection: 'row',
                                paddingLeft: 20 * factorHorizontal,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'OpenSans',
                                    fontSize: 20 * factorRatio,
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    color: 'white',
                                }}
                            >
                                What's your email?
                            </Text>
                            <View style={{flex: 1}} />
                        </View>
                        <View style={{height: 10 * factorVertical}} />
                        <View
                            key={'email'}
                            style={{
                                height:
                                    Platform.OS == 'android'
                                        ? fullHeight * 0.07
                                        : fullHeight * 0.06,
                                width: fullWidth * 0.9,
                                borderRadius: 50 * factorRatio,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                paddingLeft: 20 * factorHorizontal,
                                flexDirection: 'row',
                            }}
                        >
                            <TextInput
                                autoCorrect={false}
                                keyboardAppearance={'dark'}
                                placeholderTextColor={'grey'}
                                placeholder={'Email Address'}
                                keyboardType={
                                    Platform.OS == 'android'
                                        ? 'visible-password'
                                        : 'email-address'
                                }
                                onChangeText={email => this.setState({email})}
                                style={{
                                    fontSize: 18 * factorRatio,
                                    fontFamily: 'OpenSans',
                                    flex: 1,
                                }}
                            />
                        </View>
                        <View style={{height: 45 * factorVertical}} />
                        <View
                            key={'next'}
                            style={{
                                height: fullHeight * 0.06,
                                width: fullWidth * 0.4,
                                borderRadius: 50 * factorRatio,
                                borderColor: '#fb1b2f',
                                backgroundColor:
                                    this.state.email.length > 0
                                        ? '#fb1b2f'
                                        : 'transparent',
                                borderWidth: 2,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => this.verifyEmail()}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '100%',
                                        flexDirection: 'row',
                                        zIndex: 10,
                                        elevation:
                                            Platform.OS == 'android' ? 10 : 0,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontSize: 18 * factorRatio,
                                        fontFamily: 'RobotoCondensed-Bold',
                                        color:
                                            this.state.email.length > 0
                                                ? 'white'
                                                : '#fb1b2f',
                                    }}
                                >
                                    NEXT
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
                <Modal
                    key={'checkEmailModal'}
                    isVisible={this.state.showCheckEmail}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <CheckEmail
                        hideCheckEmail={() => {
                            this.setState({
                                showCheckEmail: false,
                            });
                        }}
                    />
                </Modal>
            </View>
        );
    }
}
