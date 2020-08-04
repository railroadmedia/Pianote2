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
import IconFeather from 'react-native-vector-icons/Feather';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';

export default class Downloads extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            editDone: true, // true EDIT | false DONE
            items: [
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5, 0],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5, 1],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5, 2],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5, 3],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5, 4],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5, 5],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5, 6],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5, 7],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5, 8],
            ]
        }
    }


    renderItems() {
        if(this.state.items.length > 0) {
            return this.state.items.map((data, index) => {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('VIDEOPLAYER')
                        }}
                        style={[
                            styles.centerContent, {
                            height: (onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.095,
                            width: fullWidth,
                            flexDirection: 'row',
                            backgroundColor: colors.mainBackground,
                        }]}
                    >
                        <View style={{flex: 0.035}}/>
                        <View>
                            <FastImage
                                style={{
                                    height: (onTablet) ? fullHeight*0.12 : (Platform.OS == 'android') ? fullHeight*0.095 : fullHeight*0.075,
                                    width: fullWidth*0.275,
                                    
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
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginBottom: 5*factorVertical,
                                    fontFamily: 'OpenSans-Regular',
                                }}
                            >
                                {this.state.items[index][0]}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12*factorRatio,
                                    color: colors.secondBackground,
                                    marginBottom: 5*factorVertical,
                                    fontFamily: 'OpenSans-Regular',
                                }}
                            >
                                {this.state.items[index][1]} | {this.state.items[index][2]}
                            </Text>
                        </View>
                        <View style={{flex: 0.3}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.removeItem(data[6])
                                }}
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
                        </View>
                    </TouchableOpacity>
                )
            })
        } else {
            return (
            <View
                style={{
                    justifyContent: 'center',
                    paddingLeft: fullWidth*0.05,
                    height: '100%',
                    width: '100%',
                }}
            >
                <View style={{height: 20*factorVertical}}/>
                <Text 
                    style={{
                        fontSize: 18*factorRatio,
                        fontFamily: 'OpenSans-Regular',
                        color: 'white',
                    }}
                >
                    No Videos Downloaded
                </Text>
            </View>
            )
        }
    }


    removeItem = async (contentID) => {
        for(i in this.state.items) {
            if(this.state.items[i][6] == contentID) {
                await this.state.items.splice(i, 1)
                await this.setState({items: this.state.items})
            }
        }
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
                    <View 
                        style={[
                            styles.centerContent, {
                            height: (Platform.OS == 'android') ?  fullHeight*0.1 : 
                                (isNotch ? fullHeight*0.12 : fullHeight*0.1),
                            backgroundColor: colors.thirdBackground,
                        }]}
                    >
                        <View style={{flex: 1}}/>
                        <View 
                            style={[
                                styles.centerContent, {
                                backgroundColor: colors.thirdBackground,
                            }]}
                        >
                            <Text
                                style={{
                                    fontSize: 22*factorRatio,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontFamily: 'OpenSans-Regular',
                                }}
                            >
                                Downloads
                            </Text>
                        </View>
                        <View style={{height: 20*factorVertical}}/>
                    </View>
                    <ScrollView key={'downloads'}
                        showsVerticalScrollIndicator={false}
                        style={{
                            flex: 0.9, 
                            backgroundColor: colors.mainBackground
                        }}
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