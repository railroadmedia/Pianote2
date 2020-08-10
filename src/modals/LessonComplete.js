/**
 * LessonComplete
 */
import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {withNavigation} from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';

class LessonComplete extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <View style={styles.container}>
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 5,
                        elevation: 5,
                        height: fullHeight,
                        width: fullWidth,
                    }}
                >
                    <View style={{flex: 0.8, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideLessonComplete()}
                            style={{
                                height: '100%',
                                width: '100%',
                                alignSelf: 'stretch',
                            }}
                        >
                            <View style={{flex: 1}} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        key={'contentContainer'}
                        style={{
                            flexDirection: 'row',
                            borderRadius: 10 * factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideLessonComplete()}
                            style={{width: fullWidth * 0.09}}
                        >
                            <View style={{flex: 1}} />
                        </TouchableWithoutFeedback>
                        <View
                            style={{
                                width: fullWidth * 0.82,
                                borderRadius: 10 * factorRatio,
                                backgroundColor: 'white',
                                elevation: 5,
                            }}
                        >
                            <View style={{height: 15 * factorVertical}} />
                            <View key={'trophy'} style={styles.centerContent}>
                                <IonIcon
                                    name={'ios-trophy'}
                                    size={32.5 * factorRatio}
                                    color={'#fb1b2f'}
                                />
                            </View>
                            <Text
                                key={'lessonComplete!'}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 20 * factorRatio,
                                    fontWeight:
                                        Platform.OS == 'ios' ? '700' : 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                Lesson{'\n'}Complete
                            </Text>
                            <View style={{height: '1%'}} />
                            <View
                                key={'image1'}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '20%',
                                        width: '100%',
                                        flexDirection: 'row',
                                        borderRadius: 10 * factorRatio,
                                    },
                                ]}
                            >
                                <View style={{flex: 1}} />
                                <View>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            width: fullWidth * 0.55,
                                            height: '100%',
                                            zIndex: 2,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 1}} />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    position: 'absolute',
                                                    width: fullWidth * 0.55,
                                                    height: '100%',
                                                    opacity: 1,
                                                    zIndex: 3,
                                                },
                                            ]}
                                        >
                                            <ApprovedTeacher
                                                height={57.5 * factorRatio}
                                                width={57.5 * factorRatio}
                                                fill={'white'}
                                            />
                                        </View>
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    opacity: 0.2,
                                                    backgroundColor: 'red',
                                                    width: fullWidth * 0.55,
                                                    alignSelf: 'stretch',
                                                    borderRadius:
                                                        10 * factorRatio,
                                                },
                                            ]}
                                        ></View>
                                        <View style={{flex: 1}} />
                                    </View>
                                    <FastImage
                                        style={{
                                            width: fullWidth * 0.55,
                                            height: '100%',
                                            alignSelf: 'stretch',
                                            borderRadius: 10 * factorRatio,
                                        }}
                                        source={{
                                            uri:
                                                'https://facebook.github.io/react-native/img/tiny_logo.png',
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{height: '1%'}} />
                            <View key={'lessonTitle'}>
                                <View style={{flex: 1}} />
                                <Text
                                    key={'congrats'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 15 * factorRatio,
                                        fontWeight: '300',
                                        textAlign: 'center',
                                    }}
                                >
                                    Congratulations! You completed
                                </Text>
                                <View style={{height: 2.5 * factorRatio}} />
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 15 * factorRatio,
                                        fontWeight:
                                            Platform.OS == 'ios'
                                                ? '700'
                                                : 'bold',
                                        textAlign: 'center',
                                    }}
                                >
                                    The assignment title
                                </Text>
                                <View style={{height: 15 * factorRatio}} />
                                <View
                                    key={'thumbs'}
                                    style={[
                                        styles.centerContent,
                                        {
                                            flexDirection: 'row',
                                        },
                                    ]}
                                >
                                    <View style={{flex: 1}} />
                                    <TouchableOpacity
                                        key={'like'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 0.5,
                                            },
                                        ]}
                                    >
                                        <AntIcon
                                            name={'like2'}
                                            size={22.5 * factorRatio}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                textAlign: 'center',
                                            }}
                                        >
                                            34
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 0.25}} />
                                    <TouchableOpacity
                                        key={'dislike'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 0.5,
                                            },
                                        ]}
                                    >
                                        <AntIcon
                                            name={'dislike2'}
                                            size={22.5 * factorRatio}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                textAlign: 'center',
                                            }}
                                        >
                                            2
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{height: 15 * factorRatio}} />
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 15 * factorRatio,
                                        fontWeight:
                                            Platform.OS == 'ios'
                                                ? '800'
                                                : 'bold',
                                        textAlign: 'center',
                                        color: '#fb1b2f',
                                    }}
                                >
                                    YOU EARNED 275 XP!
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                            <View
                                key={'line'}
                                style={{
                                    height: 20 * factorVertical,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ececec',
                                }}
                            />
                            <View style={{height: '1%'}} />
                            <Text
                                key={'upNext'}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 16 * factorRatio,
                                    color: '#a8a8a8',
                                    textAlign: 'center',
                                }}
                            >
                                Up next:
                            </Text>
                            <View style={{height: '1%'}} />
                            <View
                                key={'image2'}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '20%',
                                        width: '100%',
                                        flexDirection: 'row',
                                        borderRadius: 10 * factorRatio,
                                    },
                                ]}
                            >
                                <View style={{flex: 1}} />
                                <View>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            width: fullWidth * 0.55,
                                            height: '100%',
                                            zIndex: 2,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 1}} />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    position: 'absolute',
                                                    width: fullWidth * 0.55,
                                                    height: '100%',
                                                    opacity: 1,
                                                    zIndex: 3,
                                                },
                                            ]}
                                        >
                                            <ApprovedTeacher
                                                height={57.5 * factorRatio}
                                                width={57.5 * factorRatio}
                                                fill={'white'}
                                            />
                                        </View>
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    opacity: 0.2,
                                                    backgroundColor: 'red',
                                                    width: fullWidth * 0.55,
                                                    alignSelf: 'stretch',
                                                    borderRadius:
                                                        10 * factorRatio,
                                                },
                                            ]}
                                        ></View>
                                        <View style={{flex: 1}} />
                                    </View>
                                    <FastImage
                                        style={{
                                            width: fullWidth * 0.55,
                                            height: '100%',
                                            alignSelf: 'stretch',
                                            borderRadius: 10 * factorRatio,
                                        }}
                                        source={{
                                            uri:
                                                'https://facebook.github.io/react-native/img/tiny_logo.png',
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{height: '1%'}} />
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 15 * factorRatio,
                                    fontWeight:
                                        Platform.OS == 'ios' ? '700' : 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                This is the lesson title
                            </Text>
                        </View>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideLessonComplete()}
                            style={{width: fullWidth * 0.09}}
                        >
                            <View style={{flex: 1}} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1.1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideLessonComplete()}
                            style={{
                                height: '100%',
                                width: '100%',
                                alignSelf: 'stretch',
                            }}
                        >
                            <View style={{flex: 1}} />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    };
}

export default withNavigation(LessonComplete);
