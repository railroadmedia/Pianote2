/**
 * LoadPage
 */
import React from 'react';
import {View} from 'react-native';

import {Download_V2} from 'RNDownload';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';

import {NetworkContext} from '../../context/NetworkProvider';

import {getToken, getUserData} from '../../services/UserDataAuth';
import {notif, updateFcmToken} from '../../services/notification.service';

import Pianote from '../../assets/img/svgs/pianote';

export default class LoadPage extends React.Component {
    static contextType = NetworkContext;
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        Download_V2.resumeAll().then(async () => {
            await SplashScreen.hide();
            if (!this.context.isConnected)
                return this.props.navigation.navigate('DOWNLOADS');
            let data = (
                await AsyncStorage.multiGet([
                    'loggedIn',
                    'resetKey',
                    'email',
                    'password',
                ])
            ).reduce((i, j) => {
                i[j[0]] =
                    j[1] === 'true' ? true : j[1] === 'false' ? false : j[1];
                i[j[0]] = j[1] === 'undefined' ? undefined : j[1];
                return i;
            }, {});
            const {email, resetKey, password, loggedIn} = data;
            if (!loggedIn)
                return this.props.navigation.dispatch(
                    StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({
                                routeName: 'LOGIN',
                            }),
                        ],
                    }),
                );
            const res = await getToken(email, password);
            if (res.success) {
                updateFcmToken();
                await AsyncStorage.multiSet([['loggedIn', 'true']]);
                let userData = await getUserData();
                console.log('ud', userData);
                let {lessonUrl, commentId} = notif;
                if (lessonUrl && commentId) {
                    // if lesson or comment notification go to video
                    this.props.navigation.dispatch(
                        StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({
                                    routeName: 'VIDEOPLAYER',
                                    params: {
                                        url: lessonUrl,
                                        commentId,
                                    },
                                }),
                            ],
                        }),
                    );
                } else if (resetKey) {
                    // go to reset pass
                    this.props.navigation.dispatch(
                        StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({
                                    routeName: 'RESETPASSWORD',
                                }),
                            ],
                        }),
                    );
                } else if (userData.isMember == false) {
                    // go to login
                    this.props.navigation.dispatch(
                        StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({
                                    routeName: 'LOGIN',
                                }),
                            ],
                        }),
                    );
                } else {
                    // if member then check membership type
                    let currentDate = new Date().getTime() / 1000;
                    let userExpDate =
                        new Date(userData.expirationDate).getTime() / 1000;
                    if (userData.isPackOlyOwner) {
                        // if pack only, set global variable to true & go to packs
                        global.isPackOnly = userData.isPackOlyOwner;
                        await this.props.navigation.dispatch(
                            StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({
                                        routeName: 'PACKS',
                                    }),
                                ],
                            }),
                        );
                    } else if (
                        userData.isLifetime ||
                        currentDate < userExpDate
                    ) {
                        // is logged in with valid membership go to lessons
                        await this.props.navigation.dispatch(
                            StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({
                                        routeName: 'LESSONS',
                                    }),
                                ],
                            }),
                        );
                    } else {
                        // membership expired, go to membership expired
                        this.props.navigation.navigate('MEMBERSHIPEXPIRED', {
                            email: this.state.email,
                            password: this.state.password,
                            token: res.token,
                        });
                    }
                }
            } else if (
                !res.success ||
                loggedIn == false ||
                loggedIn == 'false'
            ) {
                // is not logged in
                this.props.navigation.dispatch(
                    StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({
                                routeName: 'LOGIN',
                            }),
                        ],
                    }),
                );
            }
        });
    }

    render() {
        return (
            <View
                style={[
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
