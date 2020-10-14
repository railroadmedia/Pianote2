/**
 * LoadPage
 */
import React from 'react';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import {getUserData} from 'Pianote2/src/services/UserDataAuth.js';
import commonService from '../../services/common.service';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LESSONS'})],
});

const resetAction2 = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LOGIN'})],
});

const resetPassAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'RESETPASSWORD'})],
});

export default class LoadPage extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentWillMount() {
        try {
            return;
            let data = await fetch(
                `${commonService.rootUrl}/api/profile/update`,
                {
                    method: 'POST',
                    data: {
                        display_name: 'KentonPALMER',
                        email: 'kentonpalmer7@gmail.com',
                    },
                },
            );

            let userData = await data.json();
            console.log('userdata: ', userData);
        } catch (error) {
            console.log(error, ' - ERROR');
        }
        return;
    }

    componentDidMount = async () => {
        await SplashScreen.hide();

        isLoggedIn = await AsyncStorage.getItem('loggedInStatus');
        let resetKey = await AsyncStorage.getItem('resetKey');
        let pass = await AsyncStorage.getItem('password');
        let userData = await getUserData();

        console.log(userData);
        if (resetKey) {
            setTimeout(
                () => this.props.navigation.dispatch(resetPassAction),
                1000,
            );
        } else if (isLoggedIn !== 'true' || userData.isMember == false) {
            // go to login
            setTimeout(
                () => this.props.navigation.dispatch(resetAction2),
                1000,
            );
        } else {
            console.log('ispackonly', userData.isPackOlyOwner);

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
                        this.props.navigation.navigate('MEMBERSHIPEXPIRED', {
                            email: userData.email,
                            password: pass,
                        }),
                    1000,
                );
            }
        }
        // if (isLoggedIn !== 'true') {
        //     setTimeout(() => this.props.navigation.navigate('LOGIN'), 1000);
        // } else {
        //     // membership expired
        //     await fetch('http://18.218.118.227:5000/checkMembershipStatus', {
        //         method: 'POST',
        //         headers: {'Content-Type': 'application/json'},
        //         body: JSON.stringify({
        //             email: email,
        //         }),
        //     })
        //         .then((response) => response.json())
        //         .then((response) => {
        //             if (response == 'success') {
        //                 setTimeout(
        //                     () => this.props.navigation.dispatch(resetAction),
        //                     1000,
        //                 );
        //             } else {
        //                 setTimeout(
        //                     () =>
        //                         this.props.navigation.navigate(
        //                             'MEMBERSHIPEXPIRED',
        //                         ),
        //                     1000,
        //                 );
        //             }
        //         })
        //         .catch((error) => {
        //             console.log('API Error: ', error);
        //             setTimeout(
        //                 () => this.props.navigation.dispatch(resetAction),
        //                 1000,
        //             );
        //         });
        // }
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
                    <View style={{height: 60 * factorVertical}} />
                </View>
            </View>
        );
    }
}
