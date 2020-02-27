/**
 * QuickTips
 */
import React from 'react';
import { View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import FastImage from 'react-native-fast-image';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Wrench from 'Pianote2/src/assets/img/svgs/wrench.svg'

class QuickTips extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render = () => {
        return (
            <View style={styles.container}>
                <BlurView
                    style={[
                        styles.centerContent, {
                        height: fullHeight,
                        width: fullWidth,
                        backgroundColor: 'white',
                    }]}
                    blurType={'dark'}
                    blurAmount={100}
                >
                    
                    <View style={{flex: 0.9, alignSelf: 'stretch',}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideQuickTips()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                    <View key={'contentContainer'}
                        style={{
                            height: fullHeight*0.6 + (
                                (global.isTablet) ? fullHeight*0.1 : 0),
                            flexDirection: 'row',
                            borderRadius: 10*factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideQuickTips()}
                            style={{width: fullWidth*0.05,}}    
                        >
                        </TouchableWithoutFeedback>
                        <View 
                            style={{
                                width: fullWidth*0.9,
                                borderRadius: 10*factorRatio,
                                backgroundColor: 'white',
                            }}
                        >
                            <View style={{flex: 0.035}}/>
                            <View key={'image'}
                                style={[
                                    styles.centerContent, {
                                }]}
                            >
                                <View
                                    style={{
                                        height: 180*factorRatio,
                                        width: 180*factorRatio,
                                        backgroundColor: 'white',
                                        zIndex: 10,
                                    }}
                                >
                                    <FastImage
                                        style={{flex:1, borderRadius: 10}}
                                        source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                        resizeMode={FastImage.resizeMode.stretch}
                                    />
                                </View>
                            </View>
                            <View key={'buffer0'}
                                style={{flex: 0.04}}
                            >

                            </View>
                            <View key={'chooseIntructor'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.075,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontWeight: '700',
                                        fontSize: 19*factorRatio
                                    }}
                                >
                                    Quick Tips
                                </Text>
                            </View>
                            <View key={'buffer1'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.075,
                                    marginTop: 5*factorRatio,
                                }]}
                            >
                                <Text 
                                    style={{
                                        fontFamily: 'Roboto',
                                        textAlign: 'center',
                                        fontSize: 12*factorRatio,
                                        color: 'grey',
                                        fontWeight: '400',
                                    }}
                                >
                                    Student Focus
                                </Text>
                            </View>
                            <View key={'text'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.4,
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontWeight: '300',
                                        fontSize: 14*factorRatio,
                                        textAlign: 'left',
                                    }}
                                >
                                    These videos are great for quick inspiration or if you don't have time to sit down and watch a full lesson. They are short and to the point, giving you tips, concepts, and exercises you can take right to the piano!
                                </Text>
                            </View>
                            <View key={'buffer2'}
                                style={{
                                    flex: 0.01
                                }}
                            />
                            <View key={'buttons'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.25,
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 50*factorRatio,
                                        }]}
                                    >
                                        <Wrench
                                            height={25*factorRatio}
                                            width={25*factorRatio}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontWeight: '300',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            100
                                        </Text>
                                    </View>
                                    <View style={{width: 15*factorRatio}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 50*factorRatio,
                                        }]}
                                    >
                                        <Wrench
                                            height={25*factorRatio}
                                            width={25*factorRatio}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontWeight: '300',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </View>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                </View>
                        </View>
                        <View style={{width: fullWidth*0.05, backgroundColor:'transparent'}}/>
                    </View>
                    <View style={{flex: 1.1, alignSelf: 'stretch',}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideQuickTips()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                </BlurView>
            </View>
        )
    }
}

export default withNavigation(QuickTips);