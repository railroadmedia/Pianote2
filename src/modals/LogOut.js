/**
 * LogOut
 */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import {logOut} from 'Pianote2/src/services/UserDataAuth.js';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import Intercom from 'react-native-intercom';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'LOGIN'})],
});

class LogOut extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            chosenInstructor: 2,
        };
    }

    logOut = async () => {
        Intercom.logout();
        await AsyncStorage.clear();
        await AsyncStorage.setItem('loggedInStatus', 'false');
        logOut();
        await this.props.navigation.dispatch(resetAction);
    };

    render = () => {
        return (
            <View style={styles.container}>
                <View style={{flex: 1, alignSelf: 'stretch'}}>
                    <TouchableOpacity
                        onPress={() => this.props.hideLogOut()}
                        style={{
                            height: '100%',
                            width: '100%',
                            alignSelf: 'stretch',
                        }}
                    ></TouchableOpacity>
                </View>
                <View
                    style={{
                        height:
                            fullHeight * 0.275 +
                            (global.isTablet ? fullHeight * 0.1 : 0),
                        flexDirection: 'row',
                        borderRadius: 10 * factorRatio,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => this.props.hideLogOut()}
                        style={{width: fullWidth * 0.05}}
                    />
                    <View
                        style={{
                            width: fullWidth * 0.9,
                            borderRadius: 10 * factorRatio,
                            backgroundColor: 'white',
                        }}
                    >
                        <View style={{flex: 0.03}} />
                        <View
                            key={'LogOut'}
                            style={[
                                styles.centerContent,
                                {
                                    flex: 0.175,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: 'bold',
                                    fontSize: 19 * factorRatio,
                                    marginTop: 10 * factorRatio,
                                }}
                            >
                                Log Out
                            </Text>
                        </View>
                        <View
                            key={'text'}
                            style={[
                                styles.centerContent,
                                {
                                    flex: 0.25,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 16 * factorRatio,
                                    textAlign: 'justify',
                                }}
                            >
                                Are you sure that you want to log out?
                            </Text>
                        </View>
                        <View
                            key={'ok'}
                            style={[
                                styles.centerContent,
                                {
                                    flex: 0.325,
                                    paddingLeft: fullWidth * 0.1 * factorRatio,
                                    paddingRight: fullWidth * 0.1 * factorRatio,
                                },
                            ]}
                        >
                            <View style={{flex: 0.15}} />
                            <View
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 0.7,
                                        backgroundColor: '#fb1b2f',
                                        alignSelf: 'stretch',
                                        borderRadius: 40,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.logOut();
                                    }}
                                    style={[
                                        styles.centerContent,
                                        {
                                            flex: 1,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontFamily: 'RobotoCondensed-Bold',
                                            fontSize: 14 * factorRatio,
                                        }}
                                    >
                                        LOG OUT
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 0.15}} />
                        </View>
                        <View
                            key={'cancel'}
                            style={[
                                styles.centerContent,
                                {
                                    flex: 0.125,
                                    paddingLeft: fullWidth * 0.1,
                                    paddingRight: fullWidth * 0.1,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 0.8,
                                        alignSelf: 'stretch',
                                    },
                                ]}
                            >
                                <TouchableOpacity>
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                flexDirection: 'row',
                                            },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.props.hideLogOut()
                                            }
                                            style={[
                                                styles.centerContent,
                                                {
                                                    height: '100%',
                                                    width: '100%',
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    fontSize: 14 * factorRatio,
                                                    color: 'grey',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                CANCEL
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.props.hideLogOut()}
                        style={{width: fullWidth * 0.05}}
                    />
                </View>
                <View style={{flex: 1, alignSelf: 'stretch'}}>
                    <TouchableOpacity
                        onPress={() => this.props.hideLogOut()}
                        style={{
                            height: '100%',
                            width: '100%',
                            alignSelf: 'stretch',
                        }}
                    ></TouchableOpacity>
                </View>
            </View>
        );
    };
}

export default withNavigation(LogOut);
