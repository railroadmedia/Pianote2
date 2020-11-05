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
import FastImage from 'react-native-fast-image';
import PasswordMatch from '../../modals/PasswordMatch';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import PasswordHidden from 'Pianote2/src/assets/img/svgs/passwordHidden.svg';
import PasswordVisible from 'Pianote2/src/assets/img/svgs/passwordVisible.svg';
import {signUp, getUserData} from '../../services/UserDataAuth';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NetworkContext} from '../../context/NetworkProvider';

var showListener =
    Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
var hideListener =
    Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export default class CreateAccount extends React.Component {
    static navigationOptions = {header: null};
    static contextType = NetworkContext;
    constructor(props) {
        super(props);
        this.state = {
            pianoteYdelta: new Animated.Value(0.01),
            forgotYdelta: new Animated.Value(fullHeight * 0.075),
            showCheckEmail: false,
            showDisplayName: false,
            showConfirmPassword: false,
            showPassword: false,
            step: 2,
            password: '',
            confirmPassword: '',
            email: this.props.navigation.state.params.email,
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
                    toValue: fullHeight * 0.125,
                    duration: 250,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(this.state.forgotYdelta, {
                    toValue: fullHeight * 0,
                    duration: 250,
                }),
                Animated.timing(this.state.pianoteYdelta, {
                    toValue: fullHeight * 0.17,
                    duration: 250,
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

    savePassword = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        if (this.state.password == this.state.confirmPassword) {
            if (this.state.password.length > 7) {
                if (this.props.navigation.state.params?.purchase) {
                    let response = await signUp(
                        this.state.email,
                        this.state.password,
                        this.props.navigation.state.params?.purchase,
                    );
                    console.log(response);
                    if (response.meta) {
                        try {
                            await AsyncStorage.multiSet([
                                ['loggedIn', 'true'],
                                ['email', this.state.email],
                                ['password', this.state.password],
                            ]);
                        } catch (e) {}

                        let userData = await getUserData();
                        console.log(userData);
                        let currentDate = new Date().getTime() / 1000;
                        let userExpDate =
                            new Date(userData.expirationDate).getTime() / 1000;
                        console.log(currentDate, userExpDate);
                        if (userData.isLifetime || currentDate < userExpDate) {
                            this.props.navigation.navigate('CREATEACCOUNT3', {
                                data: {
                                    email: this.state.email,
                                    password: this.state.password,
                                },
                            });
                        } else {
                            this.props.navigation.navigate(
                                'MEMBERSHIPEXPIRED',
                                {
                                    email: this.state.email,
                                    password: this.state.password,
                                },
                            );
                        }
                    } else {
                        let {title, detail} = response.errors[0];
                        Alert.alert(title, detail, [{text: 'OK'}], {
                            cancelable: false,
                        });
                    }
                } else {
                    this.props.navigation.navigate('NEWMEMBERSHIP', {
                        data: {
                            type: 'SIGNUP',
                            email: this.state.email,
                            password: this.state.password,
                        },
                    });
                }
            }
        } else {
            this.setState({showPasswordMatch: true});
        }
    };

    render() {
        return (
            <KeyboardAwareScrollView
                style={{flex: 1}}
                scrollEnabled={false}
                keyboardShouldPersistTaps='handled'
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
                        elevation: 4,
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
                                elevation: 2,
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
                                        fontFamily: 'OpenSans-Regular',
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
                                        fontFamily: 'OpenSans-Regular',
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
                                        fontFamily: 'OpenSans-Regular',
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
                                        fontFamily: 'OpenSans-Regular',
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
                                        fontFamily: 'OpenSans-Regular',
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
                                        fontFamily: 'OpenSans-Regular',
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
                        height: fullHeight,
                        width: fullWidth,
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
                            elevation: 10,
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
                            elevation: 5,
                        },
                    ]}
                >
                    <Text
                        style={{
                            fontFamily: 'OpenSans-Regular',
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
                        elevation: 3,
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
                            key={'createPassword'}
                            style={{
                                height: 35 * factorVertical,
                                marginBottom: 2 * factorVertical,
                                flexDirection: 'row',
                                paddingLeft: 20 * factorHorizontal,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 19 * factorRatio,
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    color: 'white',
                                }}
                            >
                                Create a password
                            </Text>
                            <View style={{flex: 1}} />
                        </View>
                        <View
                            key={'pass'}
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
                                multiline={false}
                                keyboardAppearance={'dark'}
                                placeholderTextColor={'grey'}
                                placeholder={'Password'}
                                keyboardType={
                                    Platform.OS == 'android'
                                        ? 'default'
                                        : 'email-address'
                                }
                                secureTextEntry={!this.state.showPassword}
                                onChangeText={password =>
                                    this.setState({password})
                                }
                                style={{
                                    fontSize: 18 * factorRatio,
                                    fontFamily: 'OpenSans-Regular',
                                    flex: 1,
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        showPassword: !this.state.showPassword,
                                    });
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        marginRight: 17.5 * factorHorizontal,
                                    },
                                ]}
                            >
                                {!this.state.showPassword && (
                                    <PasswordHidden
                                        height={22.5 * factorRatio}
                                        width={22.5 * factorRatio}
                                    />
                                )}
                                {this.state.showPassword && (
                                    <PasswordVisible
                                        height={22.5 * factorRatio}
                                        width={22.5 * factorRatio}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 20 * factorVertical}} />
                        <View
                            key={'confirmPassword'}
                            style={{
                                height: 35 * factorVertical,
                                marginBottom: 2 * factorVertical,
                                flexDirection: 'row',
                                paddingLeft: 20 * factorHorizontal,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 19 * factorRatio,
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    color: 'white',
                                }}
                            >
                                Confirm password
                            </Text>
                            <View style={{flex: 1}} />
                        </View>
                        <View
                            key={'confirmPass'}
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
                                multiline={false}
                                keyboardAppearance={'dark'}
                                placeholderTextColor={'grey'}
                                placeholder={'Confirm Password'}
                                keyboardType={
                                    Platform.OS == 'android'
                                        ? 'default'
                                        : 'email-address'
                                }
                                secureTextEntry={
                                    !this.state.showConfirmPassword
                                }
                                onChangeText={confirmPassword =>
                                    this.setState({confirmPassword})
                                }
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 18 * factorRatio,
                                    flex: 1,
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        showConfirmPassword: !this.state
                                            .showConfirmPassword,
                                    });
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        marginRight: 10 * factorHorizontal,
                                    },
                                ]}
                            >
                                {!this.state.showPassword && (
                                    <PasswordHidden
                                        height={22.5 * factorRatio}
                                        width={22.5 * factorRatio}
                                    />
                                )}
                                {this.state.showPassword && (
                                    <PasswordVisible
                                        height={22.5 * factorRatio}
                                        width={22.5 * factorRatio}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 10 * factorVertical}} />
                        <View
                            style={{
                                width: fullWidth,
                                paddingLeft: fullWidth * 0.05,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    textAlign: 'left',
                                    fontSize: 14 * factorRatio,
                                    color: 'white',
                                }}
                            >
                                Use at least 8 characters
                            </Text>
                        </View>
                        <View style={{height: 50 * factorVertical}} />
                        <View
                            key={'login'}
                            style={{
                                height: fullHeight * 0.06,
                                width: fullWidth * 0.4,
                                borderRadius: 50 * factorRatio,
                                borderColor: '#fb1b2f',
                                backgroundColor:
                                    this.state.password.length > 0 &&
                                    this.state.confirmPassword.length > 0 &&
                                    this.state.password ==
                                        this.state.confirmPassword
                                        ? '#fb1b2f'
                                        : 'transparent',
                                borderWidth: 2,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => this.savePassword()}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '100%',
                                        flexDirection: 'row',
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontSize: 18 * factorRatio,
                                        fontFamily: 'RobotoCondensed-Bold',
                                        color:
                                            this.state.password.length > 0 &&
                                            this.state.confirmPassword.length >
                                                0 &&
                                            this.state.password ==
                                                this.state.confirmPassword
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
                    key={'passwordMatch'}
                    isVisible={this.state.showPasswordMatch}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={450}
                    animationOutTiming={450}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <PasswordMatch
                        hidePasswordMatch={() => {
                            this.setState({
                                showPasswordMatch: false,
                            });
                        }}
                    />
                </Modal>
            </KeyboardAwareScrollView>
        );
    }
}
