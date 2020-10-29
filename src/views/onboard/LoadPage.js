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
import commonService from '../../services/common.service';
import {NetworkContext} from '../../context/NetworkProvider';
import {getToken} from '../../services/UserDataAuth';

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
            let data = await AsyncStorage.multiGet([
                'loggedInStatus',
                'resetKey',
                'lessonUrl',
                'commentId',
                'email',
                'password',
            ]);
            console.log(data);
            const isLoggedIn = data[0][1];
            const resetKey = data[1][1];
            const lessonUrl = data[2][1];
            const commentId = data[3][1];
            const email = data[4][1];
            const pass = data[5][1];
            const res = await getToken(email, pass);
            if (res.success) {
                await AsyncStorage.multiSet([
                    ['loggedInStatus', 'true'],
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
                } else if (
                    isLoggedIn !== 'true' ||
                    userData.isMember == false
                ) {
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
                    let currentDate = new Date().getTime() / 1000;
                    let userExpDate =
                        new Date(userData.expirationDate).getTime() / 1000;

                    if (userData.isLifetime || currentDate < userExpDate) {
                        // go to lessons
                        setTimeout(
                            () => this.props.navigation.dispatch(resetAction),
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
