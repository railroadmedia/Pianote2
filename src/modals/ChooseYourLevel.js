/**
 * ChooseYourLevel
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class ChooseYourLevel extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            circle1: this.props.circle1,
            circle2: this.props.circle2,
            circle3: this.props.circle3,
            circle4: this.props.circle4,
            circle5: this.props.circle5,
            circle6: this.props.circle6,
            circle7: this.props.circle7,
            circle8: this.props.circle8,
            circle9: this.props.circle9,
            circle10: this.props.circle10,
        }
    }


    isChosen = () => {
        if(this.state.circle1 !== false || 
            this.state.circle2 !== false ||
            this.state.circle3 !== false ||
            this.state.circle4 !== false ||
            this.state.circle5 !== false ||
            this.state.circle6 !== false ||
            this.state.circle7 !== false ||
            this.state.circle8 !== false ||
            this.state.circle9 !== false ||
            this.state.circle10 !== false) {
            this.props.setLevel(true)
        } else {
            this.props.setLevel(false)
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
                    }]}
                    blurType={'xlight'}
                    blurAmount={10}
                >
                    
                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseYourLevel()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        style={{
                            height: fullHeight*0.575 + (
                                (global.isTablet) ? fullHeight*0.1 : 0),
                            flexDirection: 'row',
                            borderRadius: 10*factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseYourLevel()}
                            style={{width: fullWidth*0.05}}
                        >
                        </TouchableWithoutFeedback>
                        <View 
                            style={{
                                width: fullWidth*0.9,
                                borderRadius: 10*factorRatio,
                                backgroundColor: 'white',
                                shadowOffset: { 
                                    width: 5*factorRatio, 
                                    height: 10*factorRatio,
                                },
                                shadowColor: 'black',
                                shadowOpacity: 0.1,
                                elevation: 3,
                            }}
                        >
                            <View style={{flex: 0.06}}/>
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
                                    Choose Your Level(s)
                                </Text>
                            </View>
                            <View key={'text'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.2,
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
                            />
                            <View key={'instructors'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.375,
                                }]}
                            >
                                <View key={'buff1'}
                                    style={{flex: 1}}
                                />
                                <View key={'topRow'}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        alignSelf: 'stretch',
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.05,
                                    }}
                                >
                                    <View key={'level1'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle1) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle1) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    circle1: !this.state.circle1
                                                })
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    color: (this.state.circle1) ? 'white':'black',
                                                    fontSize: 20*factorHorizontal
                                                }}
                                            >
                                                1
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View key={'buffer1'}
                                        style={{
                                            width: 5*factorHorizontal
                                        }}
                                    />
                                    <View key={'level2'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle2) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle2) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        circle2: !this.state.circle2
                                                    })
                                                }}
                                                style={[
                                                    styles.centerContent, {
                                                    flex: 1
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto',
                                                        color: (this.state.circle2) ? 'white':'black',
                                                        fontSize: 20*factorHorizontal
                                                    }}
                                                >
                                                    2
                                                </Text>
                                            </TouchableOpacity>
                                    </View>
                                    <View key={'buffer2'}
                                        style={{
                                            width: 5*factorHorizontal
                                        }}
                                    />
                                    <View key={'level3'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle3) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle3) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        circle3: !this.state.circle3
                                                    })
                                                }}
                                                style={[
                                                    styles.centerContent, {
                                                    flex: 1
                                                }]}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto',
                                                        color: (this.state.circle3) ? 'white':'black',
                                                        fontSize: 20*factorHorizontal
                                                    }}
                                                >
                                                    3
                                                </Text>
                                            </TouchableOpacity>
                                    </View>
                                    <View key={'buffer3'}
                                        style={{
                                            width: 5*factorHorizontal
                                        }}
                                    />
                                    <View key={'level4'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle4) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle4) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                        >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    circle4: !this.state.circle4
                                                })
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    color: (this.state.circle4) ? 'white':'black',
                                                    fontSize: 20*factorHorizontal
                                                }}
                                            >
                                                4
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View key={'buffer4'}
                                        style={{
                                            width: 5*factorHorizontal
                                        }}
                                    />
                                    <View key={'level5'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle5) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle5) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    circle5: !this.state.circle5
                                                })
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    color: (this.state.circle5) ? 'white':'black',
                                                    fontSize: 20*factorHorizontal
                                                }}
                                            >
                                                5
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View key={'buff2'}
                                    style={{flex: 1*factorRatio}}
                                />
                                <View key={'bottomRow'}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        alignSelf: 'stretch',
                                        paddingLeft: fullWidth*0.05,
                                        paddingRight: fullWidth*0.05,
                                    }}
                                >
                                    <View key={'level6'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle6) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle6) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    circle6: !this.state.circle6
                                                })
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    color: (this.state.circle6) ? 'white':'black',
                                                    fontSize: 20*factorHorizontal
                                                }}
                                            >
                                                6
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View key={'buffer6'}
                                        style={{
                                            width: 5*factorHorizontal
                                        }}
                                    />
                                    <View key={'level7'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle7) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle7) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    circle7: !this.state.circle7,
                                                })
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorHorizontal,
                                                    color: (this.state.circle7) ? 'white':'black',
                                                }}
                                            >
                                                7
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View key={'buffer7'}
                                        style={{
                                            width: 5*factorHorizontal
                                        }}
                                    />
                                    <View key={'level8'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle8) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle8) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                    >        
                                       <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    circle8: !this.state.circle8
                                                })
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 20*factorHorizontal,
                                                    color: (this.state.circle8) ? 'white':'black',
                                                }}
                                            >
                                                8
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View key={'buffer8'}
                                        style={{
                                            width: 5*factorHorizontal
                                        }}
                                    />
                                    <View key={'level9'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle9) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle9) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                        >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    circle9: !this.state.circle9
                                                })
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    color: (this.state.circle9) ? 'white':'black',
                                                    fontSize: 20*factorHorizontal
                                                }}
                                            >
                                                9
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View key={'buffer9'}
                                        style={{
                                            width: 5*factorHorizontal
                                        }}
                                    />
                                    <View key={'level10'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.15,
                                            width: fullWidth*0.15,
                                            borderRadius: 100,
                                            borderColor: (this.state.circle10) ? '#fb1b2f':'black',
                                            backgroundColor: (this.state.circle10) ? '#fb1b2f':'white',
                                            borderWidth: 2,
                                        }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    circle10: !this.state.circle10
                                                })
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                flex: 1
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    color: (this.state.circle10) ? 'white':'black',
                                                    fontSize: 20*factorHorizontal
                                                }}
                                            >
                                                10
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View key={'buff3'}
                                    style={{flex: 1}}
                                />
                            </View>  
                            <View key={'ok'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.15,
                                        paddingLeft: fullWidth*0.1*factorRatio,
                                        paddingRight: fullWidth*0.1*factorRatio,
                                    }]}
                                >
                                    <View style={{flex: 0.15}}/>
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
                                                this.props.hideChooseYourLevel(
                                                    this.state.circle1,
                                                    this.state.circle2,
                                                    this.state.circle3,
                                                    this.state.circle4,
                                                    this.state.circle5,
                                                    this.state.circle6,
                                                    this.state.circle7,
                                                    this.state.circle8,
                                                    this.state.circle9,
                                                    this.state.circle10,
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
                                    <View style={{flex: 0.15}}/>
                                </View>
                            <View key={'cancel'}
                            style={[
                                styles.centerContent, {
                                flex: 0.085,
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
                                <View
                                    style={[
                                        styles.centerContent, {
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.setState({
                                            circle1: false, 
                                            circle2: false,
                                            circle3: false,
                                            circle4: false,
                                            circle5: false,
                                            circle6: false,
                                            circle7: false,
                                            circle8: false,
                                            circle9: false,
                                            circle10: false,
                                        })}
                                        style={[
                                            styles.centerContent, {
                                            flexDirection: 'row',
                                            height: '100%',
                                            width: '100%',
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
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        </View>
                        <View style={{width: fullWidth*0.05, backgroundColor:'transparent'}}/>
                    </View>
                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideChooseYourLevel()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                </BlurView>
            </View>
        )
    }
}


export default withNavigation(ChooseYourLevel);