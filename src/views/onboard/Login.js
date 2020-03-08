/**
 * Login
 */
import React from 'react';
import { 
    View, 
    Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-carousel-view';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';

export default class Login extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
        }
    }


    async changeColor(number) {
        if(number == 0) {
            await this.setState({page: 1})
        } else if(number == 1) {
            await this.setState({page: 2})
        } else if(number == 2) {
            await this.setState({page: 3})
        } else if(number == 3) {
            await this.setState({page: 4})
        } else if(number == 4) {
            await this.setState({page: 5})
        }

        await this.forceUpdate()
    }


    render() {
        return (
            <View 
                style={[
                    styles.centerContent, {
                    height: fullHeight,
                }]}
            >
                <Carousel 
                    width={fullWidth} 
                    height={fullHeight}
                    delay={250000000000}
                    animatedDuration={2000}
                    loop={true}
                    hideIndicators={true}
                    onPageChange={(number) => this.changeColor(number)}
                >
                    <View key={'loginSignup'} style={styles.centerContent}>
                        <View key={'pianote1'}
                            style={{
                                position: 'absolute', 
                                top: fullHeight*0.03,
                                zIndex: 2,
                            }}
                        >
                            <Pianote
                                height={75*factorRatio}
                                width={125*factorRatio}
                                fill={'#fb1b2f'}
                            />
                        </View>
                        <GradientFeature
                            color={'grey'}
                            opacity={1}
                            height={'70%'}
                            borderRadius={0}
                        />
                        <View key={'image1'}
                            style={{
                                flex: 0.75, 
                                alignSelf: 'stretch',
                            }}
                        >
                            <FastImage
                                style={{flex: 1}}
                                source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                        <View key={'buffer1'}
                            style={{
                                flex: 0.25,
                                backgroundColor: 'rgba(23, 26, 26, 1)',
                                alignSelf: 'stretch',
                            }}
                        >
                        </View>
                        <View key={'content1'}
                            style={{
                                position: 'absolute',
                                bottom: fullHeight*0.23,
                                width: fullWidth,
                                zIndex: 3,
                            }}
                        >
                            <View style={{flex: 1}}></View>
                            <View style={[
                                styles.centerContent, {
                                    flexDirection: 'row',
                                }]}
                            >   
                                <View style={{flex: 1}}/>
                                <FastImage
                                    style={{
                                        height: 120*factorRatio,
                                        width: fullWidth*0.75,
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/devices.png')}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 30*factorRatio,
                                    paddingLeft: fullWidth*0.15,
                                    paddingRight: fullWidth*0.15,
                                    fontWeight: '800',
                                    textAlign: 'center',
                                    color: 'white',
                                }}
                            >
                                {'Pianote Lessons, Songs, & Support'}
                            </Text>
                            <View style={{height: 10*factorVertical}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 20*factorRatio,
                                    textAlign: 'center',
                                    color: 'grey',
                                }}
                            >
                                Everywhere you go.
                            </Text>
                        </View>
                        <View key={'content1b'}
                            style={{
                                position: 'absolute',
                                bottom: fullHeight*0.055,
                                width: fullWidth,
                                zIndex: 3,
                            }}
                        >
                            <View key={'dots'}
                                style={{
                                    height: fullHeight*0.035,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}></View>
                                <View style={{justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1}}></View>
                            </View>
                            <View key={'buff'}
                                style={{height: fullHeight*0.02}}
                            >
                            </View>
                            <View key={'buttons'}
                                style={{
                                    height: fullHeight*0.075,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth*0.02,
                                    paddingRight: fullWidth*0.02,
                                }}
                            >
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: 'transparent',
                                            borderWidth: 2,
                                            borderColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('LOGINCREDENTIALS')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: '#fb1b2f',
                                                }}
                                            >
                                                LOG IN
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('CREATEACCOUNT')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                SIGN UP
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View key={'whatToPractive'} style={styles.centerContent}>
                        <View key={'pianote1'}
                            style={{
                                position: 'absolute', 
                                top: fullHeight*0.03,
                                zIndex: 2,
                            }}
                        >
                            <Pianote
                                height={75*factorRatio}
                                width={125*factorRatio}
                                fill={'#fb1b2f'}
                            />
                        </View>
                        <GradientFeature
                            color={'grey'}
                            opacity={1}
                            height={'70%'}
                            borderRadius={0}
                        />
                        <View key={'image1'}
                            style={{
                                flex: 0.75, 
                                alignSelf: 'stretch',
                            }}
                        >
                            <FastImage
                                style={{flex: 1}}
                                source={require('Pianote2/src/assets/img/imgs/prescreenPractice.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                        <View key={'buffer1'}
                            style={{
                                flex: 0.25,
                                backgroundColor: 'rgba(23, 26, 26, 1)',
                                alignSelf: 'stretch',
                            }}
                        >
                        </View>
                        <View key={'content1'}
                            style={{
                                position: 'absolute',
                                bottom: fullHeight*0.215,
                                width: fullWidth,
                                zIndex: 3,
                            }}
                        >
                            <View style={{flex: 1}}></View>
                            <View style={[
                                styles.centerContent, {
                                    flexDirection: 'row',
                                }]}
                            >   
                                <View style={{flex: 1}}/>
                                <FastImage
                                    style={{
                                        height: 120*factorRatio,
                                        width: fullWidth,
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/practice.png')}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 30*factorRatio,
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    color: 'white',
                                }}
                            >
                                Always know 
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 30*factorRatio,
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.05,
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                   {' exactly '}
                                </Text>
                                what to practice.
                            </Text>
                            <View style={{height: 20*factorVertical}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                    color: 'grey',
                                }}
                            >
                                Unlike "video game" learning where you only learn what keys to hit, you'll actually play music with step-by-step lessons that will build your piano playing foundations!
                            </Text>
                        </View>
                        <View key={'content1b'}
                            style={{
                                position: 'absolute',
                                bottom: fullHeight*0.055,
                                width: fullWidth,
                                zIndex: 3,
                            }}
                        >
                            <View key={'dots'}
                                style={{
                                    height: fullHeight*0.035,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}></View>
                                <View style={{justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1}}></View>
                            </View>
                            <View key={'buff'}
                                style={{height: fullHeight*0.02}}
                            >
                            </View>
                            <View key={'buttons'}
                                style={{
                                    height: fullHeight*0.075,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth*0.02,
                                    paddingRight: fullWidth*0.02,
                                }}
                            >
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: 'transparent',
                                            borderWidth: 2,
                                            borderColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('LOGINCREDENTIALS')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: '#fb1b2f',
                                                }}
                                            >
                                                LOG IN
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('CREATEACCOUNT')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                SIGN UP
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View key={'favSongs'} style={styles.centerContent}>
                        <View key={'pianote1'}
                            style={{
                                position: 'absolute', 
                                top: fullHeight*0.03,
                                zIndex: 2,
                            }}
                        >
                            <Pianote
                                height={75*factorRatio}
                                width={125*factorRatio}
                                fill={'#fb1b2f'}
                            />
                        </View>
                        <GradientFeature
                            color={'grey'}
                            opacity={1}
                            height={'70%'}
                            borderRadius={0}
                        />
                        <View key={'image1'}
                            style={{
                                flex: 0.75, 
                                alignSelf: 'stretch',
                            }}
                        >
                            <FastImage
                                style={{flex: 1}}
                                source={require('Pianote2/src/assets/img/imgs/prescreenSongs.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                        <View key={'buffer1'}
                            style={{
                                flex: 0.25,
                                backgroundColor: 'rgba(23, 26, 26, 1)',
                                alignSelf: 'stretch',
                            }}
                        >
                        </View>
                        <View key={'content1'}
                            style={{
                                position: 'absolute',
                                bottom: fullHeight*0.22,
                                width: fullWidth,
                                zIndex: 3,
                            }}
                        >
                            <View style={{flex: 1}}></View>
                            <View style={[
                                styles.centerContent, {
                                    flexDirection: 'row',
                                }]}
                            >   
                                <View style={{flex: 1}}/>
                                <FastImage
                                    style={{
                                        height: 120*factorRatio,
                                        width: fullWidth,
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/favorite-songs.png')}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 30*factorRatio,
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    color: 'white',
                                }}
                            >
                                Play Your {"\n"}
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 30*factorRatio,
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.05,
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                   {' Favorite Songs'}
                                </Text>
                            </Text>
                            <View style={{height: 20*factorVertical}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                    color: 'grey',
                                }}
                            >
                                Nothing is better than playing to real music! So you'll get custom play-alongs to help you apply specific-skills PLUS breakdowns of popular music so you can play your favorite tunes!
                            </Text>
                        </View>
                        <View key={'content1b'}
                            style={{
                                position: 'absolute',
                                bottom: fullHeight*0.055,
                                width: fullWidth,
                                zIndex: 3,
                            }}
                        >
                            <View key={'dots'}
                                style={{
                                    height: fullHeight*0.035,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}></View>
                                <View style={{justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1}}></View>
                            </View>
                            <View key={'buff'}
                                style={{height: fullHeight*0.02}}
                            >
                            </View>
                            <View key={'buttons'}
                                style={{
                                    height: fullHeight*0.075,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth*0.02,
                                    paddingRight: fullWidth*0.02,
                                }}
                            >
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: 'transparent',
                                            borderWidth: 2,
                                            borderColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('LOGINCREDENTIALS')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: '#fb1b2f',
                                                }}
                                            >
                                                LOG IN
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('CREATEACCOUNT')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                SIGN UP
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View key={'lessonSupport'} style={styles.centerContent}>
                        <View key={'pianote1'}
                            style={{
                                position: 'absolute', 
                                top: fullHeight*0.03,
                                zIndex: 2,
                            }}
                        >
                            <Pianote
                                height={75*factorRatio}
                                width={125*factorRatio}
                                fill={'#fb1b2f'}
                            />
                        </View>
                        <GradientFeature
                            color={'grey'}
                            opacity={1}
                            height={'70%'}
                            borderRadius={0}
                        />
                        <View key={'image1'}
                            style={{
                                flex: 0.75, 
                                alignSelf: 'stretch',
                            }}
                        >
                            <FastImage
                                style={{flex: 1}}
                                source={require('Pianote2/src/assets/img/imgs/prescreenSupport.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                        <View key={'buffer1'}
                            style={{
                                flex: 0.25,
                                backgroundColor: 'rgba(23, 26, 26, 1)',
                                alignSelf: 'stretch',
                            }}
                        >
                        </View>
                        <View key={'content1'}
                            style={{
                                position: 'absolute',
                                bottom: fullHeight*0.22,
                                width: fullWidth,
                                zIndex: 3,
                            }}
                        >
                            <View style={{flex: 1}}></View>
                            <View style={[
                                styles.centerContent, {
                                    flexDirection: 'row',
                                }]}
                            >   
                                <View style={{flex: 1}}/>
                                <FastImage
                                    style={{
                                        height: 120*factorRatio,
                                        width: fullWidth,
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/support.png')}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 30*factorRatio,
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    color: 'white',
                                }}
                            >
                                Personalized {"\n"}
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 30*factorRatio,
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.05,
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                   {' Lessons & Support'}
                                </Text>
                            </Text>
                            <View style={{height: 20*factorVertical}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                    fontSize: 18*factorRatio,
                                    textAlign: 'center',
                                    color: 'grey',
                                }}
                            >
                                Get direct acces to real teachers any time you have a question, access weekly live-streaming video lessons, and connect with teachers and students in the community forums!
                            </Text>
                        </View>
                        <View key={'content1b'}
                            style={{
                                position: 'absolute',
                                bottom: fullHeight*0.055,
                                width: fullWidth,
                                zIndex: 3,
                            }}
                        >
                            <View key={'dots'}
                                style={{
                                    height: fullHeight*0.035,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}></View>
                                <View style={{justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1}}></View>
                            </View>
                            <View key={'buff'}
                                style={{height: fullHeight*0.02}}
                            >
                            </View>
                            <View key={'buttons'}
                                style={{
                                    height: fullHeight*0.075,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth*0.02,
                                    paddingRight: fullWidth*0.02,
                                }}
                            >
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: 'transparent',
                                            borderWidth: 2,
                                            borderColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('LOGINCREDENTIALS')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: '#fb1b2f',
                                                }}
                                            >
                                                LOG IN
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('CREATEACCOUNT')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                SIGN UP
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View key={'done'} style={styles.centerContent}>
                        <View key={'pianote1'}
                            style={{
                                position: 'absolute', 
                                top: fullHeight*0.03,
                                zIndex: 4,
                            }}
                        >
                            <Pianote
                                height={75*factorRatio}
                                width={125*factorRatio}
                                fill={'#fb1b2f'}
                            />
                        </View>
                        <GradientFeature
                            color={'grey'}
                            opacity={1}
                            height={'70%'}
                            borderRadius={0}
                        />
                        <View
                            style={[
                                styles.centerContent, {
                                flex: 1,
                                backgroundColor: 'rgba(23, 26, 26, 1)',
                                alignSelf: 'stretch',
                                zIndex: 3,
                                marginBottom: 60*factorVertical,
                            }]}
                        >
                            <View key={'content1'}
                                style={[
                                    styles.centerContent, {
                                    width: fullWidth,
                                    zIndex: 3,
                                }]}
                            >
                                <View style={{flex: 1}}></View>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 30*factorRatio,
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.05,
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 30*factorRatio,
                                            paddingLeft: fullWidth*0.05,
                                            paddingRight: fullWidth*0.05,
                                            fontWeight: '800',
                                            textAlign: 'center',
                                            color: 'white',
                                        }}
                                    >
                                    Not a Member?
                                    </Text>
                                </Text>
                                <View style={{height: 10*factorVertical}}></View>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.05,
                                        fontSize: 20*factorRatio,
                                        textAlign: 'center',
                                        color: 'grey',
                                    }}
                                >
                                    Try it for free for 7-days when you click the sign up button below to set up your Pianote account.
                                </Text>
                            </View>
                        </View>
                        <View key={'content1b'}
                            style={{
                                position: 'absolute',
                                bottom: fullHeight*0.055,
                                width: fullWidth,
                                zIndex: 3,
                            }}
                        >
                            <View key={'dots'}
                                style={{
                                    height: fullHeight*0.035,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}}></View>
                                <View style={{justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 1) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 2) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 3) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 4) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                        <View style={{width: 7.5*factorHorizontal}}></View>
                                        <View 
                                            style={{
                                                height: 10*factorRatio,
                                                width: 10*factorRatio,
                                                borderRadius: 100,
                                                backgroundColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'transparent',
                                                borderWidth: 2,
                                                borderColor: (this.state.page == 5) ?
                                                    '#fb1b2f' : 'grey',

                                            }}
                                        >

                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1}}></View>
                            </View>
                            <View key={'buff'}
                                style={{height: fullHeight*0.02}}
                            >
                            </View>
                            <View key={'buttons'}
                                style={{
                                    height: fullHeight*0.075,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth*0.02,
                                    paddingRight: fullWidth*0.02,
                                }}
                            >
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: 'transparent',
                                            borderWidth: 2,
                                            borderColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('LOGINCREDENTIALS')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: '#fb1b2f',
                                                }}
                                            >
                                                LOG IN
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 1,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            height: '80%',
                                            width: '90%',
                                            borderRadius: 60,
                                            backgroundColor: '#fb1b2f',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('CREATEACCOUNT')
                                            }}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorRatio,
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                SIGN UP
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Carousel>
        </View>
        )
    }
}




