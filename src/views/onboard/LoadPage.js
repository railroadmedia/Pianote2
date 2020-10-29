/**
 * LoadPage
 */
import React from 'react';
import {View} from 'react-native';

import {Download_V2} from 'RNDownload';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import {getUserData, getToken} from 'Pianote2/src/services/UserDataAuth.js';
import {NetworkContext} from '../../context/NetworkProvider';
import Pianote from '../../assets/img/svgs/pianote';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LESSONS'})],
});

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
            if (!this.context.isConnected) {
                return this.props.navigation.navigate('DOWNLOADS');
            }

            let data = await AsyncStorage.multiGet(['loggedInStatus', 'resetKey', 'lessonUrl', 'commentId', 'email', 'password']);

            const isLoggedIn = data[0][1];
            const resetKey = data[1][1];
            const lessonUrl = data[2][1];
            const commentId = data[3][1];
            const email = data[4][1];
            const pass = data[5][1];
            const res = await getToken(email, pass);

            // if getToken success, else == no email or pass, which means not logged in
            if (res.success || isLoggedIn == true || isLoggedIn == 'true') {    
                // set logged in status to true
                await AsyncStorage.multiSet([['loggedInStatus', 'true']]);
                
                // get userData
                let userData = await getUserData();
                
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
                } else if (isLoggedIn !== 'true' || userData.isMember == false) {
                    // if not logged in or not a member go to login
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
                    let userExpDate = new Date(userData.expirationDate).getTime() / 1000;
                    if(userData.isPackOlyOwner) {
                        // if pack only, set global variable to true & go to packs
                        global.isPackOnly = userData.isPackOlyOwner;
                        await this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({routeName: 'PACKS'})],
                        }));
                    } else if (userData.isLifetime || currentDate < userExpDate) {
                        // is logged in with valid membership go to lessons
                        await this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({routeName: 'LESSONS'})],
                        }));
                    } else {
                        // membership expired, go to membership expired
                        this.props.navigation.navigate('MEMBERSHIPEXPIRED', {
                            email: this.state.email,
                            password: this.state.password,
                            token: res.token,
                        });
                    }
                }
            } else if(!res.success || isLoggedIn == false || isLoggedIn == 'false') {
                // is not logged in
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
