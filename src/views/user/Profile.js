/**
 * Profile
 */
import React from 'react';
import { View, Text, TouchableNativeFeedbackBase } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import Icon from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';


export default class Profile extends React.Component {
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
                        <View key={'myProfile'}
                            style={[
                                styles.centerContent, {
                                flex: 0.1,
                            }]}
                        >
                            <View style={{flex: 0.66}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontWeight: '600',
                                    fontSize: 20*factorRatio,
                                }}
                            >
                                My Profile
                            </Text>
                            <View style={{flex: 0.33}}></View>
                        </View>
                        <View key={'profilePicture'}
                            style={[
                                styles.centerContent, {
                                flex: 0.45,
                                borderTopWidth: 1.5*factorRatio,
                                borderTopColor: '#ececec',
                            }]}
                        >
                            <View style={{flex: 0.2, alignSelf: 'stretch'}}></View>
                            <View 
                                style={{
                                    height: (isTablet) ? 100*factorRatio : 125*factorRatio,
                                    width: (isTablet) ? 100*factorRatio : 125*factorRatio,
                                }}
                            >
                                <FastImage
                                    style={{flex: 1, borderRadius: 250}}
                                    source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            </View>
                            <View 
                                style={[
                                    styles.centerContent, {
                                    flex: 0.8, 
                                    alignSelf: 'stretch'
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 30*factorRatio,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    }}
                                >
                                    Jared Falk
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 12.5*factorRatio,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        color: '#9b9b9b',
                                        marginTop: 10*factorVertical,
                                    }}
                                >
                                    @drummer_jared
                                </Text>
                            
                            </View>
                        </View>
                        <View key={'rank'}
                            style={{
                                flex: 0.15,
                                borderTopWidth: 1.5*factorRatio,
                                borderTopColor: '#ececec',
                                flexDirection: 'row',
                            }}
                        >
                            <View style={{flex: 1}}></View>
                            <View style={[styles.centerContent, {flex: 10}]}>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 12.5*factorRatio,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        color: '#fb1b2f',
                                    }}
                                >
                                    XP
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 22.5*factorRatio,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    }}
                                >
                                    11,768
                                </Text>
                            </View>
                            <View style={{flex: 1}}></View>
                            <View style={[styles.centerContent, {flex: 10}]}>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 12.5*factorRatio,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        color: '#fb1b2f',
                                    }}
                                >
                                    RANK
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 22.5*factorRatio,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    }}
                                >
                                    MAESTRO
                                </Text>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View key={'scrollview'}
                            style={{
                                flex: 0.42,
                                borderTopWidth: 1.5*factorRatio,
                                borderTopColor: '#ececec',
                            }}
                        >
                            <ScrollView>
                                <TouchableOpacity 
                                    onPress={() => {
                                        this.props.navigation.navigate('SETTINGS')
                                    }}
                                    key={'profileSettings'}
                                    style={[styles.centerContent, {
                                        height: 50*factorRatio,
                                        width: fullWidth,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                        flexDirection: 'row',
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.025,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 20*factorRatio,
                                            color: '#fb1b2f',
                                        }}
                                    >
                                        Profile Settings
                                    </Text>
                                    <View style={{flex: 1}}></View>
                                    <Icon
                                        name={'right'}
                                        size={22.5*factorRatio}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity key={'loginCredentials'}
                                    style={[styles.centerContent, {
                                        height: 50*factorRatio,
                                        width: fullWidth,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                        flexDirection: 'row',
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.025,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 20*factorRatio,
                                            color: '#fb1b2f',
                                        }}
                                    >
                                        Login Credentials
                                    </Text>
                                    <View style={{flex: 1}}></View>
                                    <Icon
                                        name={'right'}
                                        size={22.5*factorRatio}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity key={'payments'}
                                    style={[styles.centerContent, {
                                        height: 50*factorRatio,
                                        width: fullWidth,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                        flexDirection: 'row',
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.025,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 20*factorRatio,
                                            color: '#fb1b2f',
                                        }}
                                    >
                                        Payments
                                    </Text>
                                    <View style={{flex: 1}}></View>
                                    <Icon
                                        name={'right'}
                                        size={22.5*factorRatio}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity key={'memberships'}
                                    style={[styles.centerContent, {
                                        height: 50*factorRatio,
                                        width: fullWidth,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                        flexDirection: 'row',
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.025,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 20*factorRatio,
                                            color: '#fb1b2f',
                                        }}
                                    >
                                        Memberships
                                    </Text>
                                    <View style={{flex: 1}}></View>
                                    <Icon
                                        name={'right'}
                                        size={22.5*factorRatio}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity key={'support'}
                                    style={[styles.centerContent, {
                                        height: 50*factorRatio,
                                        width: fullWidth,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                        flexDirection: 'row',
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.025,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 20*factorRatio,
                                            color: '#fb1b2f',
                                        }}
                                    >
                                        Support
                                    </Text>
                                    <View style={{flex: 1}}></View>
                                    <Icon
                                        name={'right'}
                                        size={22.5*factorRatio}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
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