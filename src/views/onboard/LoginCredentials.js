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
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import RNIap from 'react-native-iap';
import FastImage from 'react-native-fast-image';
import {userLogin, configure} from '@musora/services';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import {getUserData} from 'Pianote2/src/services/UserDataAuth.js';
import PasswordEmailMatch from '../../modals/PasswordEmailMatch.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import PasswordHidden from 'Pianote2/src/assets/img/svgs/passwordHidden.svg';
import PasswordVisible from 'Pianote2/src/assets/img/svgs/passwordVisible.svg';
import Loading from '../../components/Loading.js';
import CustomModal from '../../modals/CustomModal.js';

var showListener =
    Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
var hideListener =
    Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LESSONS'})],
});

export default class LoginCredentials extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            pianoteYdelta: new Animated.Value(0),
            forgotYdelta: new Animated.Value(fullHeight * 0.075),
            secureTextEntry: true,
            showPasswordEmailMatch: false,
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
                    toValue:
                        (Platform.OS === 'ios' && fullHeight > 811) || onTablet
                            ? fullHeight * 0.325
                            : fullHeight * 0.35,
                    duration: 250,
                }),
                Animated.timing(this.state.pianoteYdelta, {
                    toValue: fullHeight * 0.15,
                    duration: 250,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(this.state.forgotYdelta, {
                    toValue: fullHeight * 0.4,
                    duration: 250,
                }),
                Animated.timing(this.state.pianoteYdelta, {
                    toValue: fullHeight * 0.25,
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
                toValue: fullHeight * 0.075,
                duration: 250,
            }),
        ]).start();
    };

    login = async () => {
        const {response, error} = await userLogin({
            email: this.state.email,
            password: this.state.password,
        });

        if (typeof response == 'undefined') {
            this.setState({showPasswordEmailMatch: true});
        } else if (response.data.success) {
            // store auth data
            await AsyncStorage.multiSet([
                ['loggedInStatus', 'true'],
                ['email', this.state.email],
                ['password', this.state.password],
                ['token', JSON.stringify(response.data.token)],
                ['tokenTime', JSON.stringify(response.data.token)],
                ['userId', JSON.stringify(response.data.userId)],
            ]);

            // configure token
            await configure({authToken: response.data.token});

            // checkmembership status
            let userData = await getUserData();
            let currentDate = new Date().getTime() / 1000;
            let userExpDate =
                new Date(userData.expirationDate).getTime() / 1000;

            if (userData.isLifetime || currentDate < userExpDate) {
                await configure({authToken: response.data.token});
                await this.props.navigation.dispatch(resetAction);
            } else {
                this.props.navigation.navigate('MEMBERSHIPEXPIRED');
            }
        }

        //this.props.navigation.navigate('MEMBERSHIPEXPIRED')
    };

    restorePurchases = async () => {
        try {
            await RNIap.initConnection();
        } catch (e) {
            return this.customModal.toggle(
                'Connection to app store refused',
                'Please try again later.',
            );
        }
        this.loadingRef?.toggleLoading();
        try {
            const purchases = await RNIap.getAvailablePurchases();
            if (!purchases.length) {
                this.loadingRef?.toggleLoading();
                return this.customModal.toggle(
                    'No purchases',
                    'There are no active purchases for this account.',
                );
            }
            let reducedPurchase;
            if (isiOS) {
                reducedPurchase = purchases;
            } else {
                reducedPurchase = purchases.map(m => {
                    return {
                        purchase_token: m.purchaseToken,
                        package_name: 'com.drumeo',
                        product_id: m.productId,
                    };
                });
            }
            //   let resp = await authService.restorePurchase(reducedPurchase);
            // if (this.loadingRef) this.loadingRef.toggleLoading();
            //   if (resp) {
            //     if (resp.shouldCreateAccount) {
            //       // redirect to sign up
            //     } else if (resp.shouldLogin) {
            //       this.setState({email: resp.email});
            //     }
            //   }
        } catch (err) {
            this.loadingRef?.toggleLoading();
            this.customModal.toggle(
                'Something went wrong',
                'Something went wrong.\nPlease try Again later.',
            );
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
                    key={'forgotpassword'}
                    style={{
                        position: 'absolute',
                        bottom: this.state.forgotYdelta,
                        width: fullWidth,
                        zIndex: 4,
                        elevation: Platform.OS == 'android' ? 4 : 0,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('FORGOTPASSWORD');
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16 * factorRatio,
                                fontFamily: 'OpenSans',
                                color: 'grey',
                                textAlign: 'center',
                                textDecorationLine: 'underline',
                            }}
                        >
                            Forgot your password?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.restorePurchases}>
                        <Text
                            style={{
                                fontSize: 16 * factorRatio,
                                fontFamily: 'OpenSans',
                                color: 'grey',
                                textAlign: 'center',
                                textDecorationLine: 'underline',
                            }}
                        >
                            Restore Purchases
                        </Text>
                    </TouchableOpacity>
                    <View style={{height: 7.5 * factorVertical}} />
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('SUPPORTSIGNUP');
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16 * factorRatio,
                                fontFamily: 'OpenSans',
                                color: 'grey',
                                textAlign: 'center',
                                textDecorationLine: 'underline',
                            }}
                        >
                            Can't log in? Contact support.
                        </Text>
                    </TouchableOpacity>
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
                            top: 40 * factorVertical,
                            height: 50 * factorRatio,
                            width: 50 * factorRatio,
                            zIndex: 5,
                            elevation: Platform.OS == 'android' ? 5 : 0,
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
                        <View style={{flex: 0.425}} />
                        <Pianote
                            height={90 * factorRatio}
                            width={190 * factorRatio}
                            fill={'#fb1b2f'}
                        />
                        <Text
                            style={{
                                fontSize: 24 * factorRatio,
                                fontFamily: 'OpenSans',
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            The Ultimate Online {'\n'} Piano Lessons Experience.
                        </Text>
                        <View style={{height: 35 * factorVertical}} />
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
                            }}
                        >
                            <TextInput
                                autoCorrect={false}
                                keyboardAppearance={'dark'}
                                placeholderTextColor={'grey'}
                                placeholder={'Email Address'}
                                onChangeText={email => this.setState({email})}
                                style={{
                                    fontFamily: 'OpenSans',
                                    fontSize: 18 * factorRatio,
                                }}
                            />
                        </View>
                        <View style={{height: 10 * factorVertical}} />
                        <View
                            key={'password'}
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
                                placeholder={'Password'}
                                keyboardType={
                                    Platform.OS == 'android'
                                        ? 'default'
                                        : 'email-address'
                                }
                                secureTextEntry={this.state.secureTextEntry}
                                onChangeText={password =>
                                    this.setState({password})
                                }
                                style={{
                                    fontSize: 18 * factorRatio,
                                    fontFamily: 'OpenSans',
                                    flex: 1,
                                }}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        secureTextEntry: !this.state
                                            .secureTextEntry,
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
                                {this.state.secureTextEntry && (
                                    <PasswordHidden
                                        height={22.5 * factorRatio}
                                        width={22.5 * factorRatio}
                                    />
                                )}
                                {!this.state.secureTextEntry && (
                                    <PasswordVisible
                                        height={22.5 * factorRatio}
                                        width={22.5 * factorRatio}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={{height: 35 * factorVertical}} />
                        <View
                            key={'login'}
                            style={{
                                height: fullHeight * 0.06,
                                width: fullWidth * 0.4,
                                borderRadius: 50 * factorRatio,
                                borderColor: '#fb1b2f',
                                borderWidth: 2 * factorRatio,
                                backgroundColor:
                                    this.state.email.length > 0 &&
                                    this.state.password.length > 0
                                        ? '#fb1b2f'
                                        : 'transparent',
                            }}
                        >
                            <TouchableOpacity
                                underlayColor={'transparent'}
                                onPress={() => {
                                    this.state.password.length > 0 &&
                                    this.state.email.length > 0
                                        ? this.login()
                                        : null;
                                }}
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
                                        fontSize: 20 * factorRatio,
                                        fontFamily: 'RobotoCondensed-Bold',
                                        color:
                                            this.state.email.length > 0 &&
                                            this.state.password.length > 0
                                                ? 'white'
                                                : '#fb1b2f',
                                    }}
                                >
                                    LOG IN
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
                <Modal
                    key={'passwords'}
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
                            this.setState({showPasswordEmailMatch: false});
                        }}
                    />
                </Modal>
                <Loading
                    ref={ref => {
                        this.loadingRef = ref;
                    }}
                />
                <CustomModal
                    ref={ref => {
                        this.customModal = ref;
                    }}
                />
            </View>
        );
    }
}
