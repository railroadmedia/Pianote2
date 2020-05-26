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
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
                ['Lesson title here', 'Show', '156MB', 'Februrary 21, 2019', true, 0.5],
            ]
        }
    }


    renderItems() {
        return this.state.items.map((data, index) => {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('VIDEOPLAYER')
                    }}
                    style={[
                        styles.centerContent, {
                        height: fullHeight*0.12,
                        width: fullWidth,
                        flexDirection: 'row',
                        backgroundColor: colors.mainBackground,
                    }]}
                >
                    <View style={{flex: 0.035}}/>
                    <View>
                        <FastImage
                            style={{
                                height: (onTablet) ? fullHeight*0.1 : fullHeight*0.085,
                                width: (onTablet) ? fullWidth*0.325 : fullWidth*0.325,
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
                    </View>
                </TouchableOpacity>
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
                    <View 
                        style={[
                            styles.centerContent, {
                            height: (Platform.OS == 'android') ?  fullHeight*0.1 : 
                                (isNotch ? fullHeight*0.12 : fullHeight*0.055),
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