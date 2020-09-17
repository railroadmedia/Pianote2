/**
 * SupportSignUp
 */
import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Linking} from 'react-native';
//import Intercom from 'react-native-intercom';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {getUserData} from 'Pianote2/src/services/UserDataAuth.js';

export default class SupportSignUp extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = async () => {
        const userData = await getUserData();
        //Intercom.registerUnidentifiedUser({userId: this.props.user});
        //Intercom.addEventListener(Intercom.Notifications.UNREAD_COUNT, this.onUnreadChange);
        //Intercom.addEventListener(Intercom.Notifications.WINDOW_DID_HIDE, this.onUnreadChange);
    };

    componentWillUnmount() {
        //Intercom.removeEventListener(Intercom.Notifications.UNREAD_COUNT, this.onUnreadChange);
        //Intercom.removeEventListener(Intercom.Notifications.WINDOW_DID_HIDE, this.onUnreadChange);
    }

    componentWillMount() {
        //Intercom.handlePushMessage();
    }

    onUnreadChange(event) {
        console.log(event);
    }

    onIntercomPress = () => {
        //Intercom.displayMessenger();
    };

    render() {
        return (
            <View styles={{flex: 1, alignSelf: 'stretch'}}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                        backgroundColor: colors.mainBackground,
                    }}
                >
                    <View
                        key={'buffer'}
                        style={{
                            height: isNotch ? 15 * factorVertical : 0,
                        }}
                    />
                    <View
                        key={'header'}
                        style={[
                            styles.centerContent,
                            {
                                flex: 0.1,
                            },
                        ]}
                    >
                        <View
                            key={'goback'}
                            style={[
                                styles.centerContent,
                                {
                                    position: 'absolute',
                                    left: 0,
                                    paddingLeft: 5 * factorHorizontal,
                                    bottom: 0 * factorRatio,
                                    height: 50 * factorRatio,
                                    width: 50 * factorRatio,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '100%',
                                    },
                                ]}
                            >
                                <EntypoIcon
                                    name={'chevron-thin-left'}
                                    size={25 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 0.66}} />
                        <Text
                            style={{
                                fontSize: 22 * factorRatio,
                                fontWeight: 'bold',
                                fontFamily: 'OpenSans',
                                color: colors.secondBackground,
                            }}
                        >
                            Support
                        </Text>
                        <View style={{flex: 0.33}} />
                    </View>
                    <ScrollView key={'contentContainer'} style={{flex: 1}}>
                        <View style={{height: 20 * factorVertical}} />
                        <View
                            key={'text'}
                            style={{
                                paddingLeft: fullWidth * 0.05,
                                paddingRight: fullWidth * 0.05,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15.5 * factorRatio,
                                    fontFamily: 'OpenSans',
                                    color: colors.secondBackground,
                                }}
                            >
                                Lorem ipsum dolor sit amet, consecteur aclipsing
                                elit. In facilisis orci felis, ac mollis,
                                tellius dignissim ut.
                            </Text>
                            <View style={{height: 15 * factorVertical}} />
                            <Text
                                style={{
                                    fontFamily: 'OpenSans',
                                    fontSize: 15.5 * factorRatio,
                                    color: colors.secondBackground,
                                }}
                            >
                                Lorem ipsum dolor sit amet, consecteur aclipsing
                                elit. In facilisis orci felis, ac mollis,
                                tellius dignissim ut. Lorem ipsum dolor sit
                                amet, consecteur aclipsing elit. In facilisis
                                orci felis, ac mollis, tellius dignissim ut.
                            </Text>
                        </View>
                        <View style={{height: 30 * factorVertical}} />
                        <View
                            key={'chatSupport'}
                            style={{
                                height: fullHeight * 0.065,
                                width: '100%',
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{flex: 1}} />
                            <TouchableOpacity
                                onPress={() => this.onIntercomPress()}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '80%',
                                        borderRadius: 200,
                                        backgroundColor: '#fb1b2f',
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'RobotoCondensed-Bold',
                                        fontSize: 18 * factorRatio,
                                        color: 'white',
                                    }}
                                >
                                    LIVE CHAT SUPPORT
                                </Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}} />
                        </View>
                        <View style={{height: 10 * factorVertical}} />
                        <View
                            key={'emailSupport'}
                            style={{
                                height: fullHeight * 0.065,
                                width: '100%',
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{flex: 1}} />
                            <TouchableOpacity
                                onPress={() =>
                                    Linking.openURL('mailto:support@musora.com')
                                }
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '80%',
                                        borderRadius: 200,
                                        backgroundColor: '#fb1b2f',
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'RobotoCondensed-Bold',
                                        fontSize: 18 * factorRatio,
                                        color: 'white',
                                    }}
                                >
                                    EMAIL SUPPORT
                                </Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}} />
                        </View>
                        <View style={{height: 10 * factorVertical}} />
                        <View
                            key={'phoneSupport'}
                            style={{
                                height: fullHeight * 0.065,
                                width: '100%',
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{flex: 1}} />
                            <TouchableOpacity
                                onPress={() =>
                                    Linking.openURL(`tel:${'18004398921'}`)
                                }
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '80%',
                                        borderRadius: 200,
                                        backgroundColor: '#fb1b2f',
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'RobotoCondensed-Bold',
                                        fontSize: 18 * factorRatio,
                                        color: 'white',
                                    }}
                                >
                                    PHONE SUPPORT
                                </Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}} />
                        </View>
                        <View style={{height: 20 * factorVertical}} />
                        <Text
                            key={'email'}
                            style={{
                                fontFamily: 'OpenSans',
                                fontSize: 14 * factorRatio,
                                opacity: 0.8,
                                color: colors.secondBackground,
                                textAlign: 'center',
                            }}
                        >
                            EMAIL
                        </Text>
                        <View style={{height: 5 * factorRatio}} />
                        <Text
                            key={'emailaddress'}
                            style={{
                                fontFamily: 'OpenSans',
                                fontSize: 13.5 * factorRatio,
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            support@musora.com
                        </Text>
                        <View style={{height: 20 * factorRatio}} />
                        <Text
                            key={'phone'}
                            style={{
                                fontFamily: 'OpenSans',
                                fontSize: 14 * factorRatio,
                                opacity: 0.8,
                                color: colors.secondBackground,
                                textAlign: 'center',
                            }}
                        >
                            PHONE
                        </Text>
                        <View style={{height: 5 * factorRatio}} />
                        <Text
                            key={'phoneNumber'}
                            style={{
                                fontFamily: 'OpenSans',
                                fontSize: 13.5 * factorRatio,
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            1-800-439-8921
                        </Text>
                        <View style={{height: 5 * factorRatio}} />
                        <Text
                            key={'phoneNumber2'}
                            style={{
                                fontFamily: 'OpenSans',
                                fontSize: 13.5 * factorRatio,
                                textAlign: 'center',
                                color: 'white',
                            }}
                        >
                            1-604-921-6721
                        </Text>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
