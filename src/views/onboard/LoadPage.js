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

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LESSONS'})],
});

export default class LoadPage extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {
        await SplashScreen.hide();
        isLoggedIn = await AsyncStorage.getItem('loggedInStatus');
        let userData = await getUserData();

        if (isLoggedIn !== 'true') {
            setTimeout(() => this.props.navigation.navigate('LOGIN'), 1000);
        } else {
            // membership expired
            if ('membershipValid' == 'membershipValid') {
                console.log(userData);
                const userID = await userData.id.toString();
                await AsyncStorage.setItem('userID', userID);
                await AsyncStorage.setItem(
                    'displayName',
                    userData.display_name,
                );
                await AsyncStorage.setItem(
                    'profileURI',
                    userData.profile_picture_url,
                );
                await AsyncStorage.setItem('joined', userData.created_at);
                setTimeout(
                    () => this.props.navigation.dispatch(resetAction),
                    1000,
                );
            } else {
                setTimeout(
                    () => this.props.navigation.navigate('MEMBERSHIPEXPIRED'),
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
