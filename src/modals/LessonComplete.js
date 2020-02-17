/**
 * LessonComplete
 */
import React from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';

class LessonComplete extends React.Component {
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
                            onPress={() => this.props.hideLessonComplete()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                    <View key={'contentContainer'}
                        style={{
                            height: '86%',
                            flexDirection: 'row',
                            borderRadius: 10*factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideLessonComplete()}
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
                            <View style={{height: '4%'}}></View>
                            <View key={'trophy'}
                                style={styles.centerContent}
                            >
                                <IonIcon
                                    name={'ios-trophy'}
                                    size={35*factorRatio}
                                    color={'#fb1b2f'}
                                />
                            </View>
                            <Text key={'lessonComplete!'}
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 24*factorRatio,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                }}
                            >
                                Lesson{"\n"}Complete
                            </Text>
                            <View style={{height: '2%'}}></View>
                            <View key={'image1'}
                                style={[
                                    styles.centerContent, {
                                    height: '20%',
                                    width: '100%',
                                    flexDirection: 'row',
                                    borderRadius: 10*factorRatio,
                                }]}
                            >
                                <View
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 2,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{flex: 1}}></View>
                                    <View
                                        style={[
                                            styles.centerContent, {
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            opacity: 1,
                                            zIndex: 3,
                                        }]}
                                    >
                                        <ApprovedTeacher
                                            height={57.5*factorRatio}
                                            width={57.5*factorRatio}
                                            fill={'white'}
                                        />
                                    </View>
                                    <View
                                        style={[
                                            styles.centerContent, {
                                            opacity: 0.2,
                                            backgroundColor: 'red',
                                            width: '76%',
                                            alignSelf: 'stretch',
                                            borderRadius: 10*factorRatio,
                                        }]}
                                    >
                                    </View>
                                    <View style={{flex: 1}}></View>
                                </View>
                                <View style={{flex: 1}}></View>
                                <FastImage
                                    style={{
                                        width: '76%',
                                        alignSelf: 'stretch',
                                        borderRadius: 10*factorRatio,
                                    }}
                                    source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{height: '2%'}}/>
                            <View key={'lessonTitle'}>
                                <View style={{flex: 1}}/>
                                <Text key={'congrats'}
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 15*factorRatio,
                                        fontWeight: '300',
                                        textAlign: 'center',
                                    }}
                                >
                                    Congratulations! You completed
                                </Text>
                                <View style={{height: 2.5*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 15*factorRatio,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    }}
                                >
                                    The assignment title
                                </Text>
                                <View style={{height: 15*factorRatio}}/>
                                <View key={'thumbs'}
                                    style={[
                                        styles.centerContent, {
                                        flexDirection: 'row',

                                    }]}
                                >
                                    <View key={'like'}
                                        styles={[
                                            styles.centerContent, {
                                            flex: 1,
                                        }]}
                                    >
                                        <AntIcon
                                            name={'like2'}
                                            size={27.5*factorRatio}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                textAlign: 'center',
                                            }}
                                        >
                                            34
                                        </Text>
                                    </View>
                                    <View style={{flex: 0.175}}/>
                                    <View key={'dislike'}
                                        styles={[
                                            styles.centerContent, {
                                            flex: 1,
                                        }]}
                                    >
                                        <AntIcon
                                            name={'dislike2'}
                                            size={27.5*factorRatio}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                textAlign: 'center',
                                            }}
                                        >
                                            2
                                        </Text>
                                    </View>
                                    
                                </View>
                                <View style={{height: 15*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 15*factorRatio,
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        color: '#fb1b2f',
                                    }}
                                >
                                    YOU EARNED 275 XP!
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <View key={'line'}
                                style={{
                                    height: 20*factorVertical,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ececec',
                                }}
                            >
                            </View>
                            <View style={{height: '2%'}}/>
                            <Text key={'upNext'}
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16*factorRatio,
                                    color: '#a8a8a8',
                                    textAlign: 'center',
                                }}
                            >
                                Up next:
                            </Text>
                            <View style={{height: '2%'}}/>
                            <View key={'image2'}
                                style={[
                                    styles.centerContent, {
                                    height: '20%',
                                    width: '100%',
                                    flexDirection: 'row',
                                    borderRadius: 10*factorRatio,
                                }]}
                            >
                                <View style={{flex: 1}}/>
                                <FastImage
                                    style={{
                                        width: '76%',
                                        alignSelf: 'stretch',
                                        borderRadius: 10*factorRatio,
                                    }}
                                    source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{height: '2%'}}/>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 15*factorRatio,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                }}
                            >
                                This is the lesson title
                            </Text>
                        </View>
                        <View style={{width: fullWidth*0.05, backgroundColor:'transparent'}}/>
                    </View>
                    <View style={{flex: 1.1, alignSelf: 'stretch',}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideLessonComplete()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                        </TouchableWithoutFeedback>
                    </View>
                </BlurView>
            </View>
        )
    }
}


export default withNavigation(LessonComplete);