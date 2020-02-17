/**
 * Support
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';

export default class Support extends React.Component {
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
                        height: fullHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <View key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View key={'buffer'}
                            style={{
                                height: (hasNotch) ? 15*factorVertical : 0,
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
                            <View style={{flex: 0.66}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontWeight: '600',
                                    fontSize: 20*factorRatio,
                                }}
                            >
                                Support
                            </Text>
                            <View style={{flex: 0.33}}></View>
                        </View>
                        <View key={'info'}
                            style={{
                                flex: 0.95
                            }}
                        >
                            <View style={{height: 15*factorVertical}}/>
                            <View key={'text'}
                                style={{
                                    flex: 0.3775,
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }}
                            >
                                <Text 
                                    style={{
                                        fontSize: 15.5*factorRatio,
                                        fontFamily: 'Roboto',
                                    }}
                                >
                                    Lorem ipsum dolor sit amet, consecteur aclipsing elit. In facilisis orci felis, ac mollis, tellius dignissim ut. 
                                    Lorem ipsum dolor sit amet, consecteur aclipsing elit. In facilisis orci felis, ac mollis, tellius dignissim ut. 
                                </Text>
                                <View style={{height: 15*factorVertical}}/>
                                <Text 
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 15.5*factorRatio,
                                    }}
                                >
                                    Lorem ipsum dolor sit amet, consecteur aclipsing elit. In facilisis orci felis, ac mollis, tellius dignissim ut. 
                                    Lorem ipsum dolor sit amet, consecteur aclipsing elit. In facilisis orci felis, ac mollis, tellius dignissim ut. 
                                </Text>
                            </View>
                            <View key={'buttons'}
                                style={{
                                    flex: 0.28,
                                    justifyContent: 'space-around',
                                    alignContent: 'space-around',
                                }}
                            >
                                <View key={'chatSupport'}
                                    style={{
                                        height: '28.5%',
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
                                                fontFamily: 'Roboto',
                                                fontSize: 14*factorRatio,
                                                fontWeight: '800',
                                                color: 'white',
                                            }}
                                        >
                                            LIVE CHAT SUPPORT
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View key={'emailSupport'}
                                    style={{
                                        height: '28.5%',
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
                                                fontFamily: 'Roboto',
                                                fontSize: 14*factorRatio,
                                                fontWeight: '800',
                                                color: 'white',
                                            }}
                                        >
                                            EMAIL SUPPORT
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View key={'phoneSupport'}
                                    style={{
                                        height: '28.5%',
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
                                                fontFamily: 'Roboto',
                                                fontSize: 14*factorRatio,
                                                fontWeight: '800',
                                                color: 'white',
                                            }}
                                        >
                                            PHONE SUPPORT
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>
                            </View>
                            <View key={'email'}
                                style={{flex: 0.33}}
                            >
                                <View style={{height: 25*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
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
                                        fontFamily: 'Roboto',
                                        fontSize: 13.5*factorRatio,
                                        textAlign: 'center',
                                    }}
                                >
                                    support@musora.com
                                </Text>
                                <View style={{height: 20*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
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
                                        fontFamily: 'Roboto',
                                        fontSize: 13.5*factorRatio,
                                        textAlign: 'center',
                                    }}
                                >
                                    1-800-439-8921
                                </Text>
                                <View style={{height: 5*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 13.5*factorRatio,
                                        textAlign: 'center',
                                    }}
                                >
                                    1-604-921-6721
                                </Text>
                            </View>
                        </View>
                    </View>
                    <NavigationBar
                        currentPage={'PROFILE'}
                    />
                </View>
            </View>
        )
    }
}