/**
 * TheFourPillars
 */
import React from 'react';
import { 
    View, 
    Text, 
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';


class TheFourPillars extends React.Component {
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
                        backgroundColor: 'transparent'
                    }]}
                    blurType={'xlight'}
                    blurAmount={10}
                >
                    
                    <View style={{flex: 0.9, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideTheFourPillars()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                    <View key={'contentContainer'}
                        style={{
                            height: fullHeight*0.75 + (
                                (global.isTablet) ? fullHeight*0.1 : 0),
                            flexDirection: 'row',
                            borderRadius: 10*factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideTheFourPillars()}
                            style={{width: fullWidth*0.05}}    
                        >
                        </TouchableWithoutFeedback>
                        <View 
                            style={{
                                width: fullWidth*0.9,
                                borderRadius: 10*factorRatio,
                                shadowOffset: { 
                                    width: 5*factorRatio, 
                                    height: 10*factorRatio,
                                },
                                shadowColor: 'black',
                                shadowOpacity: 0.1,
                                elevation: 3,
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
                                        height: 160*factorRatio,
                                        width: '90%',
                                        backgroundColor: 'white',
                                        zIndex: 10,
                                    }}
                                >
                                    <FastImage
                                        style={{flex:1, borderRadius: 10}}
                                        source={require('Pianote2/src/assets/img/imgs/image-1.jpg')}
                                        resizeMode={FastImage.resizeMode.stretch}
                                    />
                                </View>
                            </View>
                            <View style={{flex: 0.04}}/>
                            <View key={'title'}
                                style={[
                                    styles.centerContent, {
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontWeight: '700',
                                        fontSize: 22*factorRatio,
                                        textAlign: 'center',
                                    }}
                                >
                                    The Four Pillars {'\n'}Of Improvisation
                                </Text>
                            </View>
                            <View key={'artist'}
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
                                    Course / Cassi Falk
                                </Text>
                            </View>
                            <View key={'text'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.5,
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
                                    Hanon exercises have been around forever and there is a great reason for their sticking power. These exercises make the perfect warmup for daily practice. They will help you develop speed, dexterity, and finger independence as well as give you a platform to practice dynamics and articulations. Cassi walks you step by step through some of her favourite Hanon exercises in this course and includes a variation for each exercise that will target specific technical skills.
                                </Text>
                            </View>
                            <View key={'stats'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.2,
                                    flexDirection: 'row',
                                }]}
                            >
                                <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        width: 70*factorRatio,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontWeight: '700',
                                            fontSize: 18*factorRatio,
                                            textAlign: 'left',
                                            marginTop: 10*factorVertical,
                                        }}
                                    >
                                        11
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontWeight: '400',
                                            fontSize: 12*factorRatio,
                                            textAlign: 'left',
                                            marginTop: 10*factorVertical,
                                        }}
                                    >
                                        LESSONS
                                    </Text>
                                </View>
                                <View style={{width: 15*factorRatio}}/>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        width: 70*factorRatio,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontWeight: '700',
                                            fontSize: 18*factorRatio,
                                            textAlign: 'left',
                                            marginTop: 10*factorVertical,
                                        }}
                                    >
                                        2400
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontWeight: '400',
                                            fontSize: 12*factorRatio,
                                            textAlign: 'left',
                                            marginTop: 10*factorVertical,
                                        }}
                                    >
                                        XP
                                    </Text>
                                </View>
                                <View style={{flex: 1, alignSelf: 'stretch'}}/>
                            </View>
                            <View style={{flex: 0.02}}/>
                            <View key={'buttons'}
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.175,
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <TouchableOpacity>
                                            <AntIcon
                                                name={'like2'}
                                                size={25*factorRatio}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontWeight: '400',
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
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <TouchableOpacity>
                                            <AntIcon
                                                name={'plus'}
                                                size={30*factorRatio}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontWeight: '400',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </View>
                                    <View style={{width: 15*factorRatio}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <TouchableOpacity>
                                            <MaterialIcon
                                                name={'arrow-collapse-down'}
                                                size={30*factorRatio}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontWeight: '400',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            Download
                                        </Text>
                                    </View>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                </View>
                            <View style={{flex: 0.075}}/>
                        </View>
                        <View style={{width: fullWidth*0.05, backgroundColor:'transparent'}}/>
                    </View>
                    <View style={{flex: 1.1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideTheFourPillars()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                </BlurView>
            </View>
        )
    }
}


export default withNavigation(TheFourPillars);