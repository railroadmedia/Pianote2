/**
 * WelcomeBack
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-carousel-view';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';

export default class WelcomeBack extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
        }
    }


    async changeColor(number) {
        console.log(number)
        if(number == 0) {
            await this.setState({page: 1})
        } else if(number == 1) {
            await this.setState({page: 2})
        } else if(number == 2) {
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
                <Carousel 
                    width={fullWidth} 
                    height={fullHeight}
                    delay={100000}
                    loop={true}
                    hideIndicators={true}
                    onPageChange={(number) => this.changeColor(number)}
                >
                    <View key={'welcomeBack2'} style={styles.centerContent}>
                        <View
                            style={[
                                styles.centerContent, {
                                flex: 0.53,
                                alignSelf: 'stretch',
                            }]}
                        >
                            <View 
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: '10%',
                                    height: '68%',
                                    width: '80%',
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
                                            resizeMode={FastImage.resizeMode.cover}

                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 0.47}}></View>
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
                                    fontFamily: 'Roboto',
                                    fontSize: 20*factorRatio,
                                    textAlign: 'center',
                                }}
                            >
                                Welcome back to Pianote!
                            </Text>
                            <View style={{height: 25*factorVertical}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20*factorRatio,
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
                                    fontFamily: 'Roboto',
                                    fontSize: 20*factorRatio,
                                    textAlign: 'center',
                                }}
                            >
                                Before you jump in, we wanted to{"\n"}
                                highlight a few new features in the app.
                            </Text>
                            <View style={{height: 35*factorVertical}}/>
                            <View key={'dots'}
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{justifyContent: 'center'}}>
                                    <Pianote
                                        height={65*factorRatio}
                                        width={50*factorRatio}
                                        fill={'#fb1b2f'}
                                    />
                                    <View style={{flexDirection: 'row', height: fullHeight*0.035}}>
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
                            <View style={{height: 30*factorVertical}}/>
                            <View key={'skip'}
                                style={{
                                    width: fullWidth,
                                    alignItems: 'center',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('HOME')
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 20*factorRatio,
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
                    <View key={'myList'} style={styles.centerContent}>
                        <View
                            style={[
                                styles.centerContent, {
                                flex: 0.53,
                                alignSelf: 'stretch',
                            }]}
                        >
                            <View 
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: '10%',
                                    height: '68%',
                                    width: '80%',
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
                                            resizeMode={FastImage.resizeMode.cover}

                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 0.47}}></View>
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
                                    fontFamily: 'Roboto',
                                    fontSize: 20*factorRatio,
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
                                    fontFamily: 'Roboto',
                                    fontSize: 20*factorRatio,
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
                                    fontFamily: 'Roboto',
                                    fontSize: 20*factorRatio,
                                    textAlign: 'center',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }}
                            >
                                Now you can use Pianote wherever{"\n"}you go!
                            </Text>
                            <View style={{height: 47.5*factorVertical}}/>
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
                            <View style={{height: 30*factorVertical}}/>
                            <View key={'skip'}
                                style={{
                                    width: fullWidth,
                                    alignItems: 'center',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('HOME')
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            textAlign: 'center',
                                            fontSize: 20*factorRatio,
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
                    <View key={'cloudSync'} style={styles.centerContent}>
                        <View
                            style={[
                                styles.centerContent, {
                                flex: 0.53,
                                alignSelf: 'stretch',
                            }]}
                        >
                            <View 
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: '10%',
                                    height: '68%',
                                    width: '80%',
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
                                            resizeMode={FastImage.resizeMode.cover}

                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 0.47}}/>
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
                                    fontFamily: 'Roboto',
                                    fontSize: 20*factorRatio,
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
                                    fontSize: 20*factorRatio,
                                    textAlign: 'center',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }}
                            >
                                Feel free to watch a lesson on your phone, then pick up where you left later in the day when you're at the Piano next to your computer.
                            </Text>
                            <View style={{height: 77.5*factorVertical}}/>
                            <View key={'dots'}
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}></View>
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
                            <View style={{height: 5*factorVertical}}/>
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
                                        this.props.navigation.navigate('HOME')
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
                                            fontFamily: 'Roboto',
                                            fontSize: 18*factorRatio,
                                            fontWeight: '700',
                                            color: 'white',
                                        }}
                                    >
                                        GET STARTED
                                    </Text>
                                </TouchableOpacity>
                                <View style={{flex: 1}}/>
                            </View>
                        </View>
                    </View>
                </Carousel>
            </View>
        )
    }
}
