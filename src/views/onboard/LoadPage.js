/**
 * LoadPage
 */
import React from 'react';
import {View} from 'react-native';
import {Download_V2} from 'RNDownload';
import SplashScreen from 'react-native-splash-screen';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import {getUserData} from 'Pianote2/src/services/UserDataAuth.js';

export default class LoadPage extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        Download_V2.resumeAll().then(async () => {
            await SplashScreen.hide();

            isLoggedIn = await AsyncStorage.getItem('loggedInStatus');
            let resetKey = await AsyncStorage.getItem('resetKey');
            let pass = await AsyncStorage.getItem('password');
            let userData = await getUserData();
            if (resetKey) {
                setTimeout(
                    () =>
                        this.props.navigation.dispatch(
                            StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({
                                        routeName: 'RESETPASSWORD',
                                    }),
                                ],
                            }),
                        ),
                    1000,
                );
            } else if (isLoggedIn !== 'true' || userData.isMember == false) {
                // go to login
                setTimeout(
                    () =>
                        this.props.navigation.dispatch(
                            StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({
                                        routeName: 'LOGIN',
                                    }),
                                ],
                            }),
                        ),
                    1000,
                );
            } else {
                isLoggedIn = await AsyncStorage.getItem('loggedInStatus');
                let resetKey = await AsyncStorage.getItem('resetKey');
                let userData = await getUserData();
                if (resetKey) {
                    setTimeout(
                        () => this.props.navigation.dispatch(resetPassAction),
                        1000,
                    );
                } else if (
                    isLoggedIn !== 'true' ||
                    userData.isMember == false
                ) {
                    // go to login
                    setTimeout(
                        () =>
                            this.props.navigation.navigate(
                                'MEMBERSHIPEXPIRED',
                                {
                                    email: userData.email,
                                    password: pass,
                                },
                            ),
                        1000,
                    );
                } else {
                    global.isPackOnly = userData.isPackOlyOwner;
                    let route = isPackOnly ? 'PACKS' : 'LESSONS';
                    let currentDate = new Date().getTime() / 1000;
                    let userExpDate =
                        new Date(userData.expirationDate).getTime() / 1000;

                    if (userData.isLifetime || currentDate < userExpDate) {
                        setTimeout(
                            () =>
                                this.props.navigation.dispatch(
                                    StackActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({
                                                routeName: route,
                                            }),
                                        ],
                                    }),
                                ),
                            1000,
                        );
                    } else {
                        // go to membership expired
                        setTimeout(
                            () =>
                                this.props.navigation.navigate(
                                    'MEMBERSHIPEXPIRED',
                                ),
                            1000,
                        );
                    }
                }
            }
        });
    }

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
                <View
                    key={'loadPage'}
                    style={[
                        styles.centerContent,
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: fullHeight,
                            width: fullWidth,
                            zIndex: 4,
                            elevation: Platform.OS == 'android' ? 4 : 0,
                            backgroundColor: colors.mainBackground,
                        },
                    ]}
                >
                    <Pianote
                        height={77.5 * factorRatio}
                        width={190 * factorHorizontal}
                        fill={'#fb1b2f'}
                    />
                </View>
            </View>
        );
    }
}
