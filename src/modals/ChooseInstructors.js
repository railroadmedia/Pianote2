/**
 * ChooseInstructors
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import FastImage from 'react-native-fast-image';

class ChooseInstructors extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            lisa: this.props.lisa,
            cassi: this.props.cassi,
            jordan: this.props.jordan,
            nate: this.props.nate,
            brett: this.props.brett,
            jonny: this.props.jonny,
            kenny: this.props.kenny,
            jay: this.props.jay,
        }
    }

    isChosen = () => {
        if(this.state.lisa !== false ||
            this.state.cassi !== false ||
            this.state.jordan !== false ||
            this.state.nate !== false ||
            this.state.brett !== false ||
            this.state.jonny !== false) {
            this.props.setInstructor(true)
        } else {
            this.props.setInstructor(false)
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
                        backgroundColor: 'transparent',
                        shadowOffset: { 
                            width: 5*factorRatio, 
                            height: 10*factorRatio,
                        },
                        shadowColor: 'black',
                        shadowOpacity: 0.1,
                        elevation: 3,
                    }]}
                    blurType={'xlight'}
                    blurAmount={10}
                />
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 5,
                        elevation: 5,
                        height: '100%',
                        width: '100%', 
                    }}
                >
                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseInstructors()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            borderRadius: 10*factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseInstructors()}
                            style={{width: fullWidth*0.05}}    
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        </TouchableWithoutFeedback>
                        <View 
                            style={{
                                width: fullWidth*0.9,
                                borderRadius: 10*factorRatio,
                                backgroundColor: 'white',
                                elevation: 2,
                            }}
                        >
                            <View style={{height: '5%'}}/>
                            <Text key={'chooseIntructor'}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: '700',
                                    fontSize: 19*factorRatio,
                                    textAlign: 'center',
                                }}
                            >
                                Choose Your Instructor(s)
                            </Text>
                            <View style={{height: '2%'}}/>
                            <View key={'text'}
                                style={[
                                    styles.centerContent, {
                                    paddingLeft: fullWidth*0.1,
                                    paddingRight: fullWidth*0.1,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight: '300',
                                        fontSize: 16*factorRatio,
                                        textAlign: 'left',
                                    }}
                                >
                                    praesent ac ipsum a lorem rutrum ullamcorpoer. Praescent rutrum nisl et mi pretium digissim non id felis.
                                </Text>
                            </View>
                            <View style={{height: '5%'}}/>
                            <ScrollView key={'instructors'}
                                showsVerticalScrollIndicator={false}
                                style={{height: 200*factorRatio}}
                            >
                                <View key={'topRow'}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    <View key={'circle1'}
                                        style={{width: 80*factorRatio}}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({lisa: !this.state.lisa})}
                                            style={{
                                                borderWidth: this.state.lisa ? 4*factorRatio : 2.5*factorRatio,
                                                borderColor: this.state.lisa ? '#fb1b2f' : 'black',
                                                height: 80*factorRatio,
                                                width: 80*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                                zIndex: 10,
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/lisa-witt.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}
                                        >
                                            LISA WITT
                                        </Text>
                                    </View>
                                    <View key={'circle2'}
                                        style={{
                                            width: 80*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({cassi: !this.state.cassi})}
                                            style={{
                                                borderWidth: this.state.cassi ? 4*factorRatio : 2.5*factorRatio,
                                                borderColor: this.state.cassi ? '#fb1b2f' : 'black',
                                                height: 80*factorRatio,
                                                width: 80*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >  
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/cassi-falk.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}
                                        >
                                            CASSI FALK
                                        </Text>
                                    </View>
                                    <View key={'circle3'}
                                        style={{
                                            width: 80*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({jordan: !this.state.jordan})}
                                            style={{
                                                borderWidth: this.state.jordan ? 4*factorRatio : 2.5*factorRatio,
                                                borderColor: this.state.jordan ? '#fb1b2f' : 'black',
                                                height: 80*factorRatio,
                                                width: 80*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/jordan-leibel.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}
                                        >
                                            JORDAN LEIBEL
                                        </Text>
                                    </View>
                                </View>
                                <View style={{height: fullHeight*0.03}}/>
                                <View key={'middleRow'}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        alignSelf: 'stretch'
                                    }}
                                >
                                    <View key={'circle4'}
                                        style={{
                                            width: 80*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({nate: !this.state.nate})}
                                            style={{
                                                borderWidth: this.state.nate ? 4*factorRatio : 2.5*factorRatio,
                                                borderColor: this.state.nate ? '#fb1b2f' : 'black',
                                                height: 80*factorRatio,
                                                width: 80*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/nate-bosch.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 11*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}
                                        >
                                            NATE BOSCH
                                        </Text>
                                    </View>
                                    <View key={'circle5'}
                                        style={{
                                            width: 80*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({brett: !this.state.brett})}
                                            style={{
                                                borderWidth: this.state.brett ? 4*factorRatio : 2.5*factorRatio,
                                                borderColor: this.state.brett ? '#fb1b2f' : 'black',
                                                height: 80*factorRatio,
                                                width: 80*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/brett-ziegler.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}
                                        >
                                            BRETT ZIEGLER
                                        </Text>
                                    </View>
                                    <View key={'circle6'}
                                        style={{
                                            width: 80*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({jonny: !this.state.jonny})}
                                            style={{
                                                borderWidth: this.state.jonny ? 4*factorRatio : 2.5*factorRatio,
                                                borderColor: this.state.jonny ? '#fb1b2f' : 'black',
                                                height: 80*factorRatio,
                                                width: 80*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/jonny-tobin.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 11*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}
                                        >
                                            JONNY TOBIN
                                        </Text>
                                    </View>
                                </View>
                                <View style={{height: fullHeight*0.03}}/>
                                <View key={'bottomRow'}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        alignSelf: 'stretch'
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View key={'circle7'}
                                        style={{
                                            width: 80*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({kenny: !this.state.kenny})}
                                            style={{
                                                borderWidth: this.state.kenny ? 4*factorRatio : 2.5*factorRatio,
                                                borderColor: this.state.kenny ? '#fb1b2f' : 'black',
                                                height: 80*factorRatio,
                                                width: 80*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/kenny-werner.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 11*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}
                                        >
                                            KENNY WERNER
                                        </Text>
                                    </View>
                                    <View style={{flex: 0.5}}/>
                                    <View key={'circle8'}
                                        style={{
                                            width: 80*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({jay: !this.state.jay})}
                                            style={{
                                                borderWidth: this.state.jay ? 4*factorRatio : 2.5*factorRatio,
                                                borderColor: this.state.jay ? '#fb1b2f' : 'black',
                                                height: 80*factorRatio,
                                                width: 80*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/jay-oliver.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}
                                        >
                                            JAY OLIVER
                                        </Text>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>   
                            </ScrollView>  
                            <View key={'ok'}
                                style={[
                                    styles.centerContent, {
                                    paddingLeft: fullWidth*0.1*factorRatio,
                                    paddingRight: fullWidth*0.1*factorRatio,
                                    height: fullHeight*0.1,
                                }]}
                            >
                                <View style={{flex: 0.2}}/>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.7,
                                        backgroundColor: '#fb1b2f',
                                        alignSelf: 'stretch',
                                        borderRadius: 40,
                                    }]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.isChosen(),
                                            this.props.hideChooseInstructors(
                                                this.state.lisa,
                                                this.state.cassi,
                                                this.state.jordan,
                                                this.state.nate,
                                                this.state.brett,
                                                this.state.jonny, 
                                                this.state.kenny, 
                                                this.state.jay
                                            )
                                        }}
                                        style={[
                                            styles.centerContent, {
                                            flex:1,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                color: 'white',
                                                fontSize: 14*factorRatio,
                                                fontWeight: '700',
                                            }}
                                        >
                                            OK
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 0.2}}/>
                            </View>
                            <View key={'cancel'}
                                style={[
                                    styles.centerContent, {
                                    paddingLeft: fullWidth*0.1,
                                    paddingRight: fullWidth*0.1,
                                    height: fullHeight*0.05,
                                }]}
                            >
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.8,
                                        alignSelf: 'stretch',
                                    }]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                lisa: false,
                                                cassi: false,
                                                jordan: false,
                                                nate: false,
                                                brett: false,
                                                jonny: false,
                                                kenny: false,
                                                jay: false,

                                            })
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.centerContent, {
                                                flexDirection: 'row',
                                            }]}
                                        >
                                            <Text
                                                style={[
                                                    styles.centerContent, {
                                                        fontFamily: 'OpenSans-Regular',
                                                    height: 22.5*factorRatio,
                                                    marginTop: 3.75*factorRatio,
                                                    fontSize: 14*factorRatio,
                                                    color: 'grey',
                                                    marginRight: 0.5,
                                                    fontWeight: '700',
                                                }]}
                                            >
                                                x </Text>
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 14*factorRatio,
                                                    color: 'grey',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                CLEAR
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: '5%'}}/>
                        </View>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseInstructors()}
                            style={{width: fullWidth*0.05}}    
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseInstructors()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        </TouchableWithoutFeedback>
                    </View>
                </View>         
            </View>
        )
    }
}


export default withNavigation(ChooseInstructors);