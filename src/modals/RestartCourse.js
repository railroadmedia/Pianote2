/**
 * RestartCourse
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


class RestartCourse extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            chosenInstructor: 2,
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
                    <View style={{flex: 1, alignSelf: 'stretch',}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideRestartCourse()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        style={{
                            height: fullHeight*0.4 + (
                                (global.isTablet) ? fullHeight*0.1 : 0),
                            flexDirection: 'row',
                            borderRadius: 10*factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideRestartCourse()}
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
                            <View style={{flex: 0.03}}></View>
                            <View key={'restartCourse'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.175,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontWeight: '700',
                                        fontSize: 19*factorRatio,
                                        marginTop: 10*factorRatio,
                                    }}
                                >
                                    Restart this course?
                                </Text>
                            </View>
                            <View key={'text'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.325,
                                    paddingLeft: fullWidth*0.1,
                                    paddingRight: fullWidth*0.1,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontWeight: '300',
                                        fontSize: 16*factorRatio,
                                        textAlign: 'justify',
                                    }}
                                >
                                    Take this course again as a refresher, or just to make sure you've got the concepts nailed! This will remove the XP you've earned.
                                </Text>
                            </View>
                            <View key={'ok'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.25,
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
                                                RESTART LEVEL
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 0.15}}></View>
                                </View>
                        <View key={'cancel'}
                            style={[
                                styles.centerContent, {
                                flex: 0.125,
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
                                
                                >
                                    <View
                                        style={[
                                            styles.centerContent, {
                                            flexDirection: 'row',
                                        }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.props.hideRestartCourse()}
                                            style={[
                                                styles.centerContent, {
                                                height: '100%',
                                                width: '100%',
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 14*factorRatio,
                                                    color: 'grey',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                CANCEL
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        </View>
                        <View style={{width: fullWidth*0.05, backgroundColor:'transparent'}}></View>
                    </View>
                    <View style={{flex: 1, alignSelf: 'stretch',}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideRestartCourse()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                </BlurView>
            </View>
        )
    }
}

export default withNavigation(RestartCourse);