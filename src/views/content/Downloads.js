/**
 * Downloads
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';

export default class Downloads extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            editDone: true, // true EDIT | false DONE
            items: [
                ['This is the lesson title', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
                ['This is the lesson title', 'Song', '258MB', 'Februrary 21, 2019', false, 0],
                ['This is the lesson title', 'Course', '281MB', 'Februrary 21, 2019', false, 0],
                ['This is the lesson title', 'Play-Along', '201MB', 'Februrary 21, 2019', false, 0],
                ['This is the lesson title', 'Course', '355MB', 'Februrary 21, 2019', false, 0],
                ['This is the lesson title', 'Play-Along', '191MB', 'Februrary 21, 2019', false, 0],
                ['This is the lesson title', 'Course', '121MB', 'Februrary 21, 2019', false, 0],
                ['This is the lesson title', 'Show', '156MB', 'Februrary 21, 2019', false, 0],
                ['This is the lesson title', 'Show', '156MB', 'Februrary 21, 2019', false, 0],
                ['This is the lesson title', 'Show', '156MB', 'Februrary 21, 2019', false, 0],
            ]
        }
    }


    renderItems() {
        return this.state.items.map((data, index) => {
            return (
                <View
                    style={[
                        styles.centerContent, {
                        height: fullHeight*0.12,
                        width: fullWidth,
                        flexDirection: 'row',
                        borderBottomWidth: 1.25*factorRatio,
                        borderBottomColor: '#ececec',
                    }]}
                >
                    <View style={{flex: 0.035}}/>
                    <View>
                        <FastImage
                            style={{
                                height: (onTablet) ? fullHeight*0.1 : fullHeight*0.09,
                                width: (onTablet) ? fullWidth*0.325 : fullWidth*0.35,
                            }}
                            source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                    </View>
                    <View
                        style={{
                            flex: 1.175,
                            marginRight: fullWidth*0.03,
                            marginLeft: fullWidth*0.03,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15*factorRatio,
                                fontWeight: '700',
                                marginBottom: 5*factorVertical,
                                fontFamily: 'OpenSans-Regular',
                            }}
                        >
                            {this.state.items[index][0]}
                        </Text>
                        <Text
                            style={{
                                fontSize: 12*factorRatio,
                                fontWeight: '300',
                                marginBottom: 5*factorVertical,
                                fontFamily: 'OpenSans-Regular',
                            }}
                        >
                            {this.state.items[index][1]} | {this.state.items[index][2]}
                        </Text>
                        <Text
                            style={{
                                fontSize: 12*factorRatio,
                                fontWeight: '300',
                                color: '#c5c5c5',
                                fontFamily: 'OpenSans-Regular',
                            }}
                        >
                            {this.state.items[index][3]}
                        </Text>
                    </View>
                    <View style={{flex: 0.3}}>
                        {this.state.editDone && (
                        <View>
                            {!this.state.items[index][4] && (
                            <TouchableOpacity
                                onPress={() => {}}
                                style={[
                                    styles.centerContent, {
                                    height: '100%',
                                    width: '100%',
                                }]}
                            >
                                <Icon
                                    name={'right'}
                                    size={25*factorRatio}
                                    color={'#c2c2c2'}
                                />
                            </TouchableOpacity>
                            )}
                            {this.state.items[index][4] && (
                            <TouchableOpacity
                                onPress={() => {}}
                                style={[
                                    styles.centerContent, {
                                    height: '100%',
                                    width: '100%',
                                }]}
                            >
                                <View 
                                    style={{
                                        height: 25*factorRatio,
                                        width: 25*factorRatio,
                                        borderRadius: 30,
                                        borderWidth: 1.5*factorRatio,
                                        borderColor: '#fb1b2f',
                                    }}
                                >
                                    <View style={[styles.centerContent, {flex: 1}]}>
                                        <IconEntypo
                                            name={'controller-stop'}
                                            size={15*factorRatio}
                                            color={'#fb1b2f'}
                                        />
                                    </View>
                                </View>
                                <View 
                                    style={{
                                        width: 20*factorHorizontal,
                                        height: 3.5*factorRatio,
                                        marginTop: 5*factorRatio,
                                        backgroundColor: '#c2c2c2',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 20*factorHorizontal*this.state.items[index][5],
                                            height: 3.5*factorRatio,
                                            backgroundColor: '#fb1b2f',
                                        }}
                                    >
                                    </View>
                                    <View style={{flex: 1}}></View>
                                </View>
                            </TouchableOpacity>
                            )}
                        </View>
                        )}
                        {!this.state.editDone && (
                        <TouchableOpacity
                            onPress={() => {}}
                            style={[
                                styles.centerContent, {
                                height: '100%',
                                width: '100%',
                            }]}
                        >
                            <IconFeather
                                name={'trash-2'}
                                size={25*factorRatio}
                                color={'#fb1b2f'}
                            />
                        </TouchableOpacity>
                        )}
                    </View>
                </View>
            )
        })
    }


    render() {
        return (
            <View 
                style={{
                    height: fullHeight - navHeight, 
                    alignSelf: 'stretch'
                }}
            >
                <View key={'contentContainer'}
                    style={{flex: 1}}
                >
                    <View key={'buffer'}
                        style={{
                            height: (isNotch) ? 7.5*factorVertical : 0,
                        }}
                    >

                    </View>
                    <View key={'myProfile'}
                        style={[
                            styles.centerContent, {
                            flex: 0.125,
                            borderBottomColor: '#ececec',
                            borderBottomWidth: 1.5,
                        }]}
                    >
                        <View style={{flex: 0.66}}/>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 1}}>
                                <Text
                                    style={{
                                        fontWeight: (Platform.OS == 'android') ? 'bold' : '600',
                                        fontSize: 22*factorRatio,
                                        textAlign: 'center',
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                >
                                    Downloads
                                </Text>
                            </View>
                            <View style={{flex: 0.9}}>
                                <View style={{flex: 1}}/>
                                <Text
                                    onPress={() => {
                                        this.setState({
                                            editDone: !this.state.editDone
                                        })
                                    }}
                                    style={{
                                        fontWeight: (Platform.OS == 'android') ? 'bold' : '600',
                                        fontSize: 12*factorRatio,
                                        textAlign: 'right',
                                        color: '#fb1b2f',
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                >
                                    {(this.state.editDone) ? 'EDIT':'DONE'}
                                </Text>
                            </View>
                            <View style={{flex: 0.1}}/>
                        </View>
                        <View style={{flex: 0.33}}/>
                    </View>
                    <ScrollView key={'downloads'}
                        showsVerticalScrollIndicator={false}
                        style={{flex: 0.9}}
                    >
                        {this.renderItems()}
                    </ScrollView>
                </View>
                <NavigationBar
                    currentPage={'DOWNLOAD'}
                />
            </View>
        )
    }
}