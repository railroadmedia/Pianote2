/**
 * LoadPage
 */
import React from 'react';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LESSONS'})],
});

export default class LoadPage extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            username: '',
        };
    }

    componentDidMount = async () => {
        await SplashScreen.hide();
        isLoggedIn = await AsyncStorage.getItem('loggedInStatus');
        email = await AsyncStorage.getItem('email');
        userId = await AsyncStorage.getItem('userId');

        console.log(userId);

        if (isLoggedIn !== 'true') {
            setTimeout(() => this.props.navigation.navigate('LOGIN'), 1000);
        } else {
            await fetch('https://staging.pianote.com/members/profile/155577')
                .then((response) => response.json())
                .then((response) => {
                    console.log('PROFILE RESPONSE: ', response);
                })
                .catch((error) => {
                    console.log('API Error members/profile: ', error);
                });

            // membership expired
            await fetch('http://18.218.118.227:5000/checkMembershipStatus', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: email,
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response == 'success') {
                        setTimeout(
                            () => this.props.navigation.dispatch(resetAction),
                            1000,
                        );
                    } else {
                        setTimeout(
                            () =>
                                this.props.navigation.navigate(
                                    'MEMBERSHIPEXPIRED',
                                ),
                            1000,
                        );
                    }
                })
                .catch((error) => {
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
