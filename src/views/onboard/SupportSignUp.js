/**
 * SupportSignUp
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    Platform,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

export default class SupportSignUp extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return (
            <View styles={{flex: 1, alignSelf: 'stretch'}}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <View key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View key={'buffer'}
                            style={{
                                height: (isNotch) ? 15*factorVertical : 0,
                            }}
                        >
                        </View>
                        <View key={'header'}
                            style={[
                                styles.centerContent, {
                                flex: 0.1,
                                borderBottomColor: '#ececec',
                                borderBottomWidth: 1*factorRatio,
                            }]}
                        >
                            <View key={'goback'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 0, 
                                    bottom: 0*factorRatio,
                                    height: 50*factorRatio,
                                    width: 50*factorRatio,
                                }]}
                            >
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.goBack()}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                    }]}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={22.5*factorRatio}
                                        color={'black'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 0.66}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: (Platform.OS == 'ios') ? '600': 'bold',
                                    fontSize: 20*factorRatio,
                                }}
                            >
                                Support
                            </Text>
                            <View style={{flex: 0.33}}/>
                        </View>
                        <View key={'info'}
                            style={{flex: 1}}
                        >
                            <View key={'text'}
                                style={{
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }}
                            >
                                <Text 
                                    style={{
                                        fontSize: 15.5*factorRatio,
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                >
                                    Lorem ipsum dolor sit amet, consecteur aclipsing elit. In facilisis orci felis, ac mollis, tellius dignissim ut. 
                                </Text>
                                <View style={{height: 15*factorVertical}}/>
                                <Text 
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 15.5*factorRatio,
                                    }}
                                >
                                    Lorem ipsum dolor sit amet, consecteur aclipsing elit. In facilisis orci felis, ac mollis, tellius dignissim ut. 
                                    Lorem ipsum dolor sit amet, consecteur aclipsing elit. In facilisis orci felis, ac mollis, tellius dignissim ut. 
                                </Text>
                            </View>
                            <View style={{height: 15*factorVertical}}/>
                            <View key={'buttons'}>
                                <View key={'chatSupport'}
                                    style={{
                                        height: fullHeight*0.075,
                                        width: '100%',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        style={[
                                            styles.centerContent, {
                                            height: '100%',
                                            width: '80%',
                                            borderRadius: 200,
                                            backgroundColor: '#fb1b2f',
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'RobotoCondensed-Bold',
                                                fontSize: 18*factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            LIVE CHAT SUPPORT
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{height: fullHeight*0.01}}/>
                                <View key={'emailSupport'}
                                    style={{
                                        height: fullHeight*0.075,
                                        width: '100%',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        style={[
                                            styles.centerContent, {
                                            height: '100%',
                                            width: '80%',
                                            borderRadius: 200,
                                            backgroundColor: '#fb1b2f',
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'RobotoCondensed-Bold',
                                                fontSize: 18*factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            EMAIL SUPPORT
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{height: fullHeight*0.01}}/>
                                <View key={'phoneSupport'}
                                    style={{
                                        height: fullHeight*0.075,
                                        width: '100%',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        style={[
                                            styles.centerContent, {
                                            height: '100%',
                                            width: '80%',
                                            borderRadius: 200,
                                            backgroundColor: '#fb1b2f',
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'RobotoCondensed-Bold',
                                                fontSize: 18*factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            PHONE SUPPORT
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>
                            </View>
                            <View style={{height: 15*factorVertical}}/>
                            <View key={'email'}>
                                <View style={{height: 25*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 14*factorRatio,
                                        fontWeight: '600',
                                        opacity: 0.8,
                                        color: 'grey',
                                        textAlign: 'center',
                                    }}
                                >
                                    EMAIL
                                </Text>
                                <View style={{height: 5*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 13.5*factorRatio,
                                        textAlign: 'center',
                                    }}
                                >
                                    support@musora.com
                                </Text>
                                <View style={{height: 20*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 14*factorRatio,
                                        fontWeight: '600',
                                        opacity: 0.8,
                                        color: 'grey',
                                        textAlign: 'center',
                                    }}
                                >
                                    PHONE
                                </Text>
                                <View style={{height: 5*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 13.5*factorRatio,
                                        textAlign: 'center',
                                    }}
                                >
                                    1-800-439-8921
                                </Text>
                                <View style={{height: 5*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 13.5*factorRatio,
                                        textAlign: 'center',
                                    }}
                                >
                                    1-604-921-6721
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}