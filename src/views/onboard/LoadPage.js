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

import {getToken} from '../../services/UserDataAuth';
import {getUserData} from '../../services/UserDataAuth';

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
            if (!this.context.isConnected)
                return this.props.navigation.navigate('DOWNLOADS');
            let data = (
                await AsyncStorage.multiGet([
                    'loggedIn',
                    'resetKey',
                    'lessonUrl',
                    'commentId',
                    'email',
                    'password',
                ])
            ).reduce((i, j) => {
                i[j[0]] =
                    j[1] === 'true' ? true : j[1] === 'false' ? false : j[1];
                return i;
            }, {});
            const {
                email,
                resetKey,
                password,
                loggedIn,
                lessonUrl,
                commentId,
            } = data;
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
                await AsyncStorage.multiSet([
                    ['loggedIn', 'true'],
                    ['token', JSON.stringify(res.token)],
                ]);
                let userData = await getUserData();
                if (lessonUrl && commentId) {
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
                    let currentDate = new Date().getTime() / 1000;
                    let userExpDate =
                        new Date(userData.expirationDate).getTime() / 1000;

                    if (userData.isLifetime || currentDate < userExpDate) {
                        // go to lessons
                        this.props.navigation.dispatch(resetAction);
                    } else {
                        // go to membership expired
                        this.props.navigation.navigate('MEMBERSHIPEXPIRED');
                    }
                }
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
                        height={90 * factorRatio}
                        width={190 * factorRatio}
                        fill={'#fb1b2f'}
                    />
                </View>
            </View>
        );
    }
}
