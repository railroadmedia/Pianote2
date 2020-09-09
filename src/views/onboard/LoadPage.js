/**
 * LoadPage
 */
import React from 'react';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import {getUserData, checkMembershipStatus} from 'Pianote2/src/services/UserDataAuth.js';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LESSONS'})],
});

const resetAction2 = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LOGIN'})],
});

export default class LoadPage extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentWillMount() {
        try {
            let data = await fetch(
                'http://app-staging.pianote.com/api/profile/update', 
                {
                    method: 'POST',
                    data: {
                        display_name: 'KentonPALMER',
                        email: "kentonpalmer7@gmail.com",
                    }
                },
            );       
            
            let userData = await data.json()     
            console.log('userdata: ', userData)
        } catch (error) {
            console.log(error, " - ERROR")
        }
        return 
    }

    componentDidMount = async () => {
        await SplashScreen.hide();
        
        isLoggedIn = await AsyncStorage.getItem('loggedInStatus');
        
        let userData = await getUserData();

        if (isLoggedIn !== 'true' || userData.isMember == false) {
            // go to login
            setTimeout(() => this.props.navigation.dispatch(resetAction2), 1000);
        } else {
            console.log('ispackonly', userData.isPackOlyOwner)

            let currentDate = new Date().getTime()/1000
            let userExpDate = new Date(userData.expirationDate).getTime()/1000
            
            if (userData.isLifetime || currentDate < userExpDate) {
                // go to lessons
                setTimeout(() => this.props.navigation.dispatch(resetAction), 1000);
            } else {
                // go to membership expired
                setTimeout(() => this.props.navigation.navigate('MEMBERSHIPEXPIRED'), 1000);
            }
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
