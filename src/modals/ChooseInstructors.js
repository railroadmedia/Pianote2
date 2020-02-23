/**
 * ChooseInstructors
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import FastImage from 'react-native-fast-image';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
            josh: this.props.josh,
        }
    }

    isChosen = () => {
        if(this.state.lisa !== false ||
            this.state.cassi !== false ||
            this.state.jordan !== false ||
            this.state.nate !== false ||
            this.state.brett !== false ||
            this.state.josh !== false) {
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
                >
                    
                    <View style={{flex: 1, alignSelf: 'stretch',}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseInstructors()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        style={{
                            height: fullHeight*0.7 + (
                                (global.isTablet) ? fullHeight*0.1 : 0),
                            flexDirection: 'row',
                            borderRadius: 10*factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseInstructors()}
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
                            <View style={{flex: 0.06}}></View>
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
                                    Choose Your Instructor(s)
                                </Text>
                            </View>
                            <View key={'text'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.175,
                                    paddingLeft: fullWidth*0.1,
                                    paddingRight: fullWidth*0.1,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontWeight: '300',
                                        fontSize: 16*factorRatio,
                                        textAlign: 'left',
                                    }}
                                >
                                    praesent ac ipsum a lorem rutrum ullamcorpoer. Praescent rutrum nisl et mi pretium digissim non id felis.
                                </Text>
                            </View>
                            <View key={'buffer'}
                                style={{
                                    flex: 0.01
                                }}
                            ></View>
                            <View key={'instructors'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.45,
                                }]}
                            >
                                <View key={'topRow'}
                                    style={{
                                        flex: 1, 
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    <View key={'circle1'}
                                        style={{
                                            width: 80*factorRatio,
                                        }}
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
                                                source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
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
                                                source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
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
                                                source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
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
                                <View key={'bottomRow'}
                                    style={{
                                        flex: 1, 
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
                                                source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
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
                                                source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
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
                                            onPress={() => this.setState({josh: !this.state.josh})}
                                            style={{
                                                borderWidth: this.state.josh ? 4*factorRatio : 2.5*factorRatio,
                                                borderColor: this.state.josh ? '#fb1b2f' : 'black',
                                                height: 80*factorRatio,
                                                width: 80*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                marginTop: 5*factorRatio,
                                                fontSize: 11*factorRatio,
                                                fontWeight: '600',
                                                textAlign: 'center'
                                            }}
                                        >
                                            JOSH DION
                                        </Text>
                                    </View>
                                </View>
                            </View>  
                            <View key={'ok'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.12,
                                        paddingLeft: fullWidth*0.1*factorRatio,
                                        paddingRight: fullWidth*0.1*factorRatio,
                                    }]}
                                >
                                    <View style={{flex: 0.15}}></View>
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
                                                    this.state.josh,
                                                )
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                flex:1,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    color: 'white',
                                                    fontSize: 14*factorRatio,
                                                    fontWeight: '700',
                                                }}
                                            >
                                                OK
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 0.15}}></View>
                                </View>
                            <View key={'cancel'}
                            style={[
                                styles.centerContent, {
                                flex: 0.075,
                                paddingLeft: fullWidth*0.1,
                                paddingRight: fullWidth*0.1,
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
                                            josh: false,
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
                                                    fontFamily: 'Roboto',
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
                                                fontFamily: 'Roboto',
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
                        </View>
                        <View style={{width: fullWidth*0.05, backgroundColor:'transparent'}}></View>
                    </View>
                    <View style={{flex: 1, alignSelf: 'stretch',}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseInstructors()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                </BlurView>
            </View>
        )
    }
}


export default withNavigation(ChooseInstructors);