/**
 * WelcomeBack
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import SwipeLeft from 'Pianote2/src/assets/img/svgs/swipe-left.svg'

export default class WelcomeBack extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
        }
    }


    async changeColor(number) {
        let index = number.nativeEvent.contentOffset.x/fullWidth
        if(index == 0) {
            await this.setState({page: 1})
        } else if(index == 1) {
            await this.setState({page: 2})
        } else if(index == 2) {
            await this.setState({page: 3})
        } 

        await this.forceUpdate()
    }


    render() {
        return (
            <View style={[
                    styles.centerContent, {
                    height: fullHeight,
                }]}
            >
                <ScrollView
                    horizontal={true}
                    ref={(ref) => { this.myScroll = ref }}
                    pagingEnabled={true}
                    scrollEnabled={this.state.canScroll}
                    onMomentumScrollEnd={(e) => this.changeColor(e)}
                    contentContainerStyle={{flexGrow: 1}}
                >
                    <View key={'welcomeBack2'} 
                        style={[
                            styles.centerContent, {
                            height: fullHeight,
                            width: fullWidth,
                            alignSelf: 'stretch',
                            }
                        ]}
                    >
                        <View
                            style={[
                                styles.centerContent, {
                                flex: 0.47,
                                alignSelf: 'stretch',
                            }]}
                        >
                            <View 
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: '0%',
                                    height: (onTablet) ? '90%' : '80%',
                                    width: '100%',
                                    zIndex: 2,
                                }]}
                            >
                                <View
                                    style={{
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'white',
                                        borderRadius: 15*factorRatio,
                                        flexDirection: 'row',
                                        zIndex: 5,
                                    }}    
                                >
                                    <View style={{flex: 1}}>
                                        <FastImage
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                borderRadius: 15*factorRatio,
                                            }}
                                            source={require('Pianote2/src/assets/img/imgs/onboarding-lisa.png')}
                                            resizeMode={FastImage.resizeMode.contain}

                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 0.53}}/>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: fullHeight*0.535,
                                width: fullWidth,
                                alignSelf: 'stretch',
                                zIndex: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                }}
                            >
                                Welcome back to Pianote!
                            </Text>
                            <View style={{height: 25*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                }}
                            >
                                We're so excited to make the Pianote{"\n"}
                                experience more easily accessible to{"\n"}
                                our community.
                            </Text>
                            <View style={{height: 25*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                }}
                            >
                                Before you jump in, we wanted to{"\n"}
                                highlight a few new features in the app.
                            </Text>
                            
                        </View>
                        <View 
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: fullWidth,
                                height: (onTablet) ? fullHeight*0.235 : fullHeight*0.25,
                            }}
                        >
                            <View key={'dots'}
                                    style={{
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View style={{justifyContent: 'center'}}>
                                        <SwipeLeft
                                            height={65*factorRatio}
                                            width={100*factorRatio}
                                        />
                                        <View style={{flexDirection: 'row', height: fullHeight*0.035}}>
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={{
                                                    height: 10*factorRatio,
                                                    width: 10*factorRatio,
                                                    borderRadius: 100,
                                                    backgroundColor: (this.state.page == 1) ?
                                                        '#fb1b2f' : 'transparent',
                                                    borderWidth: 1,
                                                    borderColor: '#fb1b2f',
                                                }}
                                            >
                                            </View>
                                            <View style={{width: 7.5*factorHorizontal}}/>
                                            <View 
                                                style={{
                                                    height: 10*factorRatio,
                                                    width: 10*factorRatio,
                                                    borderRadius: 100,
                                                    backgroundColor: (this.state.page == 2) ?
                                                        '#fb1b2f' : 'transparent',
                                                    borderWidth: 1,
                                                    borderColor: '#fb1b2f',

                                                }}
                                            >

                                            </View>
                                            <View style={{width: 7.5*factorHorizontal}}/>
                                            <View 
                                                style={{
                                                    height: 10*factorRatio,
                                                    width: 10*factorRatio,
                                                    borderRadius: 100,
                                                    backgroundColor: (this.state.page == 3) ?
                                                        '#fb1b2f' : 'transparent',
                                                    borderWidth: 1,
                                                    borderColor: '#fb1b2f',
                                                }}
                                            >
                                            </View>
                                            <View style={{flex: 1}}/>
                                        </View>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                            <View style={{height: 10*factorVertical}}/>
                            <View key={'skip'}
                                style={{
                                    width: fullWidth,
                                    alignItems: 'center',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('LESSONS')
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 18*factorRatio,
                                            fontWeight: '700',
                                            color: '#fb1b2f',
                                        }}
                                    >
                                        SKIP
                                    </Text>
                                </TouchableOpacity>
                            </View>                        
                        </View>
                    </View>
                    <View key={'myList'} 
                        style={[
                            styles.centerContent, {
                            height: fullHeight,
                            width: fullWidth,
                            alignSelf: 'stretch',
                            }
                        ]}
                    >
                        <View
                            style={[
                                styles.centerContent, {
                                flex: 0.47,
                                alignSelf: 'stretch',
                            }]}
                        >
                            <View 
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: '0%',
                                    height: (onTablet) ? '90%' : '90%',
                                    width: '100%',
                                    zIndex: 2,
                                }]}
                            >
                                <View
                                    style={{
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'white',
                                        borderRadius: 15*factorRatio,
                                        flexDirection: 'row',
                                        zIndex: 5,
                                    }}    
                                >
                                    <View style={{flex: 1}}>
                                        <FastImage
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                borderRadius: 15*factorRatio,
                                            }}
                                            source={require('Pianote2/src/assets/img/imgs/onboarding-download.png')}
                                            resizeMode={FastImage.resizeMode.contain}

                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 0.53}}/>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: fullHeight*0.535,
                                width: fullWidth,
                                alignSelf: 'stretch',
                                zIndex: 5,
                            }}
                        >

                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }}
                            >
                                We support offline viewing!
                            </Text>
                            <View style={{height: 25*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }}
                            >
                                Tap the download button on any lesson and the lesson materials needed to complete that lesson will be stored on your device in the "Downloads" section.
                            </Text>
                            <View style={{height: 25*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }}
                            >
                                Now you can use Pianote wherever{"\n"}you go!
                            </Text>
                        </View>
                        <View 
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: fullWidth,
                                height: (onTablet) ? fullHeight*0.125 : fullHeight*0.17,
                            }}
                        >
                            <View key={'dots'}
                                style={{flexDirection: 'row'}}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row', height: fullHeight*0.035,}}>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 1,
                                                borderColor: '#fb1b2f',
                                            }}
                                        >
                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}/>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 1,
                                                borderColor: '#fb1b2f',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}/>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 1,
                                                borderColor: '#fb1b2f',
                                            }}
                                        >

                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{height: 10*factorVertical}}/>
                            <View key={'skip'}
                                style={{
                                    width: fullWidth,
                                    alignItems: 'center',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('LESSONS')
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            textAlign: 'center',
                                            fontSize: 18*factorRatio,
                                            fontWeight: '700',
                                            color: '#fb1b2f',
                                        }}
                                    >
                                        SKIP
                                    </Text>
                                </TouchableOpacity>
                            </View>                        
                        </View>
                    </View>
                    <View key={'cloudSync'} 
                        style={[
                            styles.centerContent, {
                            height: fullHeight,
                            width: fullWidth,
                            alignSelf: 'stretch',
                            }
                        ]}
                    >
                        <View
                            style={[
                                styles.centerContent, {
                                flex: 0.47,
                                alignSelf: 'stretch',
                            }]}
                        >
                            <View 
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: '0%',
                                    height: (onTablet) ? '90%' : '90%',
                                    width: '100%',
                                    zIndex: 2,
                                }]}
                            >
                                <View
                                    style={{
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: 'white',
                                        borderRadius: 15*factorRatio,
                                        flexDirection: 'row',
                                        zIndex: 5,
                                    }}    
                                >
                                    <View style={{flex: 1}}>
                                        <FastImage
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                borderRadius: 15*factorRatio,
                                            }}
                                            source={require('Pianote2/src/assets/img/imgs/onboarding-sync.png')}
                                            resizeMode={FastImage.resizeMode.contain}

                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 0.53}}/>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: fullHeight*0.535,
                                width: fullWidth,
                                alignSelf: 'stretch',
                                zIndex: 5,
                            }}
                        >
                            <View style={{height: 20*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }}
                            >
                                Your lesson progress is synced between the Pianote App and the Pianote Website.
                            </Text>
                            <View style={{height: 25*factorVertical}}/>
                            <Text
                                style={{
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }}
                            >
                                Feel free to watch a lesson on your phone, then pick up where you left later in the day when you're at the Piano next to your computer.
                            </Text>
                            <View style={{flex: 1}}/>
                            <View key={'dots'}
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row', height: fullHeight*0.05}}>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 1,
                                                borderColor: '#fb1b2f',
                                            }}
                                        >
                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}/>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 1,
                                                borderColor: '#fb1b2f',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}/>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 1,
                                                borderColor: '#fb1b2f',
                                            }}
                                        >

                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{flex: 0.5}}/>
                            <View key={'skip'}
                                style={{
                                    width: fullWidth,
                                    height: '11.5%',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    borderRadius: 30*factorRatio,
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('LESSONS')
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        width: '85%',
                                        height: '100%',
                                        borderRadius: 30*factorRatio,
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
                                        GET STARTED
                                    </Text>
                                </TouchableOpacity>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
