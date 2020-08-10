/**
 * Replies
 */
import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Keyboard,
    Animated,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {withNavigation} from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

var showListener =
    Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
var hideListener =
    Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

class Replies extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            replies: [], // video's comments
            profileImage: '',
            parentComment: this.props.parentComment,
            makeCommentVertDelta: new Animated.Value(0.01),
            showMakeComment: false,
            comment: '',
            commentsLoading: false,
        };
    }

    componentDidMount = async () => {
        // get profile image
        let profileImage = await AsyncStorage.getItem('profileURI');
        if (profileImage !== null) {
            await this.setState({profileImage});
        }

        this.keyboardDidShowListener = Keyboard.addListener(
            showListener,
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            hideListener,
            this._keyboardDidHide,
        );

        this.fetchReplies();
    };

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = async (e) => {
        const {height, screenX, screenY, width} = e.endCoordinates;

        if (Platform.OS == 'ios') {
            Animated.timing(this.state.makeCommentVertDelta, {
                toValue: height,
                duration: 275,
            }).start();
        } else {
            Animated.timing(this.state.makeCommentVertDelta, {
                toValue: height,
                duration: 0,
            }).start();
        }
    };

    _keyboardDidHide = async () => {
        Animated.timing(this.state.makeCommentVertDelta, {
            toValue: -250,
            duration: 275,
        }).start();
    };

    makeReply = async () => {
        // reply to comment
        console.log('reply to commentID: ', this.state.parentComment[9]);
        this.setState({
            comment: '',
        });
        this.textInputRef.blur();
    };

    showFooter() {
        if (this.props.outReplies == false) {
            return (
                <View
                    style={[
                        styles.centerContent,
                        {
                            marginTop: 15 * factorRatio,
                            height: 35 * factorVertical,
                        },
                    ]}
                >
                    <ActivityIndicator
                        size={onTablet ? 'large' : 'small'}
                        color={'grey'}
                    />
                </View>
            );
        } else {
            return <View style={{height: 20 * factorVertical}} />;
        }
    }

    fetchReplies = async () => {
        await this.setState({commentsLoading: true});

        email = await AsyncStorage.getItem('email');

        await fetch('http://3.17.144.93:5000/getComments', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                contentID: this.state.parentComment[9],
                email,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('comments: ', response);
                this.setState({
                    replies: [...response, ...this.state.replies],
                });
            })
            .catch((error) => {
                console.log('API Error: ', error);
            });

        await this.setState({commentsLoading: false});
    };

    mapReplies() {
        return this.state.replies.map((row, index) => {
            return (
                <View
                    style={{
                        paddingTop: fullHeight * 0.01,
                        paddingBottom: fullHeight * 0.01,
                        paddingLeft: fullWidth * 0.05,
                        paddingRight: fullWidth * 0.03,
                        minHeight: 30 * factorVertical,
                        flexDirection: 'row',
                    }}
                >
                    <View>
                        <View style={{alignItems: 'center'}}>
                            <FastImage
                                style={{
                                    height: 40 * factorHorizontal,
                                    width: 40 * factorHorizontal,
                                    borderRadius: 100,
                                }}
                                source={{
                                    uri:
                                        'https://facebook.github.io/react-native/img/tiny_logo.png',
                                }}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 10 * factorRatio,
                                    marginTop: 2 * factorRatio,
                                    fontWeight:
                                        Platform.OS == 'ios' ? '700' : 'bold',
                                    color: 'grey',
                                }}
                            >
                                {row[4]}
                            </Text>
                        </View>
                        <View style={{flex: 1}} />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: 12.5 * factorHorizontal,
                        }}
                    >
                        <View style={{height: 3 * factorVertical}} />
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 13 * factorRatio,
                                color: 'white',
                            }}
                        >
                            {row[0]}
                        </Text>
                        <View style={{height: 7.5 * factorVertical}} />
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 11 * factorRatio,
                                color: 'grey',
                            }}
                        >
                            {row[1]} | {row[2]} | {row[3]}
                        </Text>
                        <View
                            style={{
                                height: 50 * factorVertical,
                            }}
                        >
                            <View style={{flex: 1}} />
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.likeReply(index);
                                        }}
                                    >
                                        <AntIcon
                                            name={
                                                this.state.replies[index][8] ==
                                                1
                                                    ? 'like1'
                                                    : 'like2'
                                            }
                                            size={20 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{width: 10 * factorHorizontal}}
                                    />
                                    {row[6] > 0 && (
                                        <View>
                                            <View style={{flex: 1}} />
                                            <View
                                                style={[
                                                    styles.centerContent,
                                                    {
                                                        borderRadius: 40,
                                                        paddingLeft:
                                                            8 *
                                                            factorHorizontal,
                                                        paddingRight:
                                                            8 *
                                                            factorHorizontal,
                                                        paddingTop:
                                                            4 * factorVertical,
                                                        paddingBottom:
                                                            4 * factorVertical,
                                                        backgroundColor:
                                                            colors.notificationColor,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            'OpenSans-Regular',
                                                        fontSize:
                                                            9.5 * factorRatio,
                                                        color:
                                                            colors.pianoteRed,
                                                    }}
                                                >
                                                    {row[6]}{' '}
                                                    {row[6] == 1
                                                        ? 'Like'
                                                        : 'Likes'}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1}} />
                                        </View>
                                    )}
                                </View>
                                <View style={{width: 20 * factorHorizontal}} />
                            </View>
                            <View style={{flex: 1}} />
                        </View>
                    </View>
                </View>
            );
        });
    }

    changeXP = (num) => {
        if (num !== '') {
            num = Number(num);
            if (num < 10000) {
                num = num.toString();
                return num;
            } else {
                num = (num / 1000).toFixed(1).toString();
                num = num + 'k';
                return num;
            }
        }
    };

    likeParentComment = async () => {
        if (this.state.parentComment[8] == 0) {
            this.state.parentComment[8] = 1;
            this.state.parentComment[6] = this.state.parentComment[6] + 1;
            await fetch('http://3.17.144.93:5000/likeComment', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    commentID: this.state.parentComment[9],
                    email,
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log('liked : ', response);
                })
                .catch((error) => {
                    console.log('API Error: ', error);
                });
        } else {
            this.state.parentComment[8] = 0;
            this.state.parentComment[6] = this.state.parentComment[6] - 1;
            await fetch('http://3.17.144.93:5000/unlikeComment', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    commentID: this.state.parentComment[9],
                    email,
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log('unliked : ', response);
                })
                .catch((error) => {
                    console.log('API Error: ', error);
                });
        }

        await this.setState({
            parentComment: this.state.parentComment,
        });
    };

    likeReply = async (index) => {
        console.log(this.state.replies);
        if (this.state.replies[index][8] == 0) {
            this.state.replies[index][8] = 1;
            this.state.replies[index][6] = this.state.replies[index][6] + 1;
            await fetch('http://3.17.144.93:5000/likeComment', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    commentID: this.state.replies[index][9],
                    email,
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log('liked : ', response);
                })
                .catch((error) => {
                    console.log('API Error: ', error);
                });
        } else {
            this.state.replies[index][8] = 0;
            this.state.replies[index][6] = this.state.replies[index][6] - 1;
            await fetch('http://3.17.144.93:5000/unlikeComment', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    commentID: this.state.replies[index][9],
                    email,
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log('unliked : ', response);
                })
                .catch((error) => {
                    console.log('API Error: ', error);
                });
        }

        await this.setState({
            replies: this.state.replies,
        });
        console.log(this.state.replies);
    };

    render = () => {
        return (
            <View
                key={'componentContainer'}
                style={[
                    styles.centerContent,
                    {
                        position: 'absolute',
                        bottom: 0,
                        height:
                            fullHeight -
                            ((isNotch ? fullHeight * 0.05 : fullHeight * 0.03) +
                                (onTablet
                                    ? fullHeight * 0.375
                                    : fullHeight * 0.275)),
                        width: fullWidth,
                        zIndex: 10,
                    },
                ]}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior={'never'}
                    style={{
                        flex: 1,
                        backgroundColor: colors.mainBackground,
                    }}
                >
                    <View style={{flex: 1}}>
                        <View
                            key={'commentCount'}
                            style={{
                                width: fullWidth,
                                zIndex: 5,
                            }}
                        >
                            <View style={{height: fullHeight * 0.025}} />
                            <View
                                key={'commentHeader'}
                                style={{
                                    width: fullWidth,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth * 0.05,
                                    paddingRight: fullWidth * 0.02,
                                }}
                            >
                                <View>
                                    <View style={{flex: 1}} />
                                    <Text
                                        style={{
                                            fontSize: 18 * factorRatio,
                                            marginBottom: 5 * factorVertical,
                                            textAlign: 'left',
                                            fontFamily: 'RobotoCondensed-Bold',
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        REPLIES
                                    </Text>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{flex: 1}} />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.hideReplies();
                                    }}
                                >
                                    <EntypoIcon
                                        size={27.5 * factorRatio}
                                        name={'cross'}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                <View style={{flex: 0.07}} />
                            </View>
                            <View style={{flex: 1.25}} />
                            <View
                                key={'originalReply'}
                                style={{
                                    paddingTop: fullHeight * 0.02,
                                    paddingLeft: fullWidth * 0.05,
                                    paddingRight: fullWidth * 0.03,
                                    minHeight: 30 * factorVertical,
                                    flexDirection: 'row',
                                }}
                            >
                                <View>
                                    <View style={{alignItems: 'center'}}>
                                        <FastImage
                                            style={{
                                                height: 40 * factorHorizontal,
                                                width: 40 * factorHorizontal,
                                                borderRadius: 100,
                                            }}
                                            source={{
                                                uri:
                                                    'https://facebook.github.io/react-native/img/tiny_logo.png',
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.stretch
                                            }
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 10 * factorRatio,
                                                marginTop: 2 * factorRatio,
                                                fontWeight:
                                                    Platform.OS == 'ios'
                                                        ? '700'
                                                        : 'bold',
                                                color: 'grey',
                                            }}
                                        >
                                            {this.changeXP(
                                                this.state.parentComment[4],
                                            )}
                                        </Text>
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        paddingLeft: 12.5 * factorHorizontal,
                                    }}
                                >
                                    <View
                                        style={{height: 3 * factorVertical}}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 13 * factorRatio,
                                            color: 'white',
                                        }}
                                    >
                                        {this.state.parentComment[0]}
                                    </Text>
                                    <View
                                        style={{height: 7.5 * factorVertical}}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 11 * factorRatio,
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        {this.state.parentComment[1]} |{' '}
                                        {this.state.parentComment[2]} |{' '}
                                        {this.state.parentComment[3]}
                                    </Text>
                                    <View style={{height: 50 * factorVertical}}>
                                        <View style={{flex: 1}} />
                                        <View style={{flexDirection: 'row'}}>
                                            <View
                                                style={{flexDirection: 'row'}}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.likeParentComment();
                                                    }}
                                                >
                                                    <AntIcon
                                                        name={
                                                            this.state
                                                                .parentComment[8] ==
                                                            1
                                                                ? 'like1'
                                                                : 'like2'
                                                        }
                                                        size={20 * factorRatio}
                                                        color={
                                                            colors.pianoteRed
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <View
                                                    style={{
                                                        width:
                                                            10 *
                                                            factorHorizontal,
                                                    }}
                                                />
                                                {this.state
                                                    .parentComment[5] && (
                                                    <View>
                                                        <View
                                                            style={{flex: 1}}
                                                        />
                                                        <View
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    borderRadius: 40,
                                                                    paddingLeft:
                                                                        8 *
                                                                        factorHorizontal,
                                                                    paddingRight:
                                                                        8 *
                                                                        factorHorizontal,
                                                                    paddingTop:
                                                                        4 *
                                                                        factorVertical,
                                                                    paddingBottom:
                                                                        4 *
                                                                        factorVertical,
                                                                    backgroundColor:
                                                                        colors.notificationColor,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    fontSize:
                                                                        9.5 *
                                                                        factorRatio,
                                                                    color:
                                                                        colors.pianoteRed,
                                                                }}
                                                            >
                                                                {
                                                                    this.state
                                                                        .parentComment[6]
                                                                }{' '}
                                                                LIKES
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={{flex: 1}}
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                            <View
                                                style={{
                                                    width:
                                                        20 * factorHorizontal,
                                                }}
                                            />
                                            <View
                                                style={{flexDirection: 'row'}}
                                            >
                                                <MaterialIcon
                                                    name={
                                                        'comment-text-outline'
                                                    }
                                                    size={20 * factorRatio}
                                                    color={colors.pianoteRed}
                                                />
                                                <View
                                                    style={{
                                                        width:
                                                            10 *
                                                            factorHorizontal,
                                                    }}
                                                />
                                                {this.state
                                                    .parentComment[6] && (
                                                    <View>
                                                        <View
                                                            style={{flex: 1}}
                                                        />
                                                        <View
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    borderRadius: 40,
                                                                    paddingLeft:
                                                                        8 *
                                                                        factorHorizontal,
                                                                    paddingRight:
                                                                        8 *
                                                                        factorHorizontal,
                                                                    paddingTop:
                                                                        4 *
                                                                        factorVertical,
                                                                    paddingBottom:
                                                                        4 *
                                                                        factorVertical,
                                                                    backgroundColor:
                                                                        colors.notificationColor,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    fontSize:
                                                                        9.5 *
                                                                        factorRatio,
                                                                    color:
                                                                        colors.pianoteRed,
                                                                }}
                                                            >
                                                                {
                                                                    this.state
                                                                        .parentComment[5]
                                                                }{' '}
                                                                {this.state
                                                                    .parentComment[5] ==
                                                                1
                                                                    ? 'REPLY'
                                                                    : 'REPLIES'}
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={{flex: 1}}
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        <View style={{flex: 1}} />
                                    </View>
                                </View>
                            </View>
                            <View style={{height: 10 * factorRatio}} />
                            <View
                                key={'addComment'}
                                style={{
                                    width: fullWidth,
                                    height: 85 * factorHorizontal,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth * 0.05,
                                    borderTopWidth: 0.5 * factorRatio,
                                    borderBottomWidth: 0.5 * factorRatio,
                                    borderBottomColor: colors.secondBackground,
                                    borderTopColor: colors.secondBackground,
                                }}
                            >
                                <View
                                    key={'profileImage'}
                                    style={{
                                        height: '100%',
                                        width: 40 * factorHorizontal,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <FastImage
                                        style={{
                                            height: 40 * factorHorizontal,
                                            width: 40 * factorHorizontal,
                                            borderRadius: 100,
                                        }}
                                        source={{uri: this.state.profileImage}}
                                        resizeMode={
                                            FastImage.resizeMode.stretch
                                        }
                                    />
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    style={{width: 12.5 * factorHorizontal}}
                                />
                                <TouchableOpacity
                                    key={'makeReply'}
                                    onPress={() => {
                                        this.setState({
                                            showMakeComment: true,
                                        }),
                                            setTimeout(
                                                () => this.textInputRef.focus(),
                                                100,
                                            );
                                    }}
                                    style={{
                                        height: 85 * factorHorizontal,
                                        width: fullWidth,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <Text
                                        style={{
                                            textAlign: 'left',
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 13 * factorRatio,
                                            color: 'white',
                                            paddingLeft: 10 * factorHorizontal,
                                        }}
                                    >
                                        Add a reply...
                                    </Text>
                                    <View style={{flex: 1}} />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}} />
                        </View>
                        {!this.state.commentsLoading && (
                            <View>{this.mapReplies()}</View>
                        )}
                    </View>
                    <View
                        style={{
                            height: isNotch
                                ? 90 * factorVertical
                                : 60 * factorVertical,
                        }}
                    />
                </ScrollView>
                {this.state.showMakeComment && (
                    <Animated.View
                        key={'makeComment'}
                        style={{
                            position: 'absolute',
                            bottom: this.state.makeCommentVertDelta,
                            left: 0,
                            minHeight: fullHeight * 0.125,
                            maxHeight: fullHeight * 0.175,
                            width: fullWidth,
                            backgroundColor: colors.mainBackground,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                borderTopWidth: 0.5 * factorRatio,
                                borderTopColor: colors.secondBackground,
                            }}
                        />
                        <View
                            stlye={{
                                borderTopWidth: 0.5 * factorRatio,
                                borderTopColor: colors.secondBackground,
                            }}
                        >
                            <View
                                style={{
                                    height: 10 * factorVertical,
                                    borderTopWidth: 0.5 * factorRatio,
                                    borderTopColor: colors.secondBackground,
                                }}
                            />
                            <TextInput
                                multiline={true}
                                ref={(ref) => {
                                    this.textInputRef = ref;
                                }}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 14 * factorRatio,
                                    width: fullWidth * 0.6,
                                    backgroundColor: colors.mainBackground,
                                    color: colors.secondBackground,
                                }}
                                onSubmitEditing={() => {
                                    this.makeReply(), this.textInputRef.clear();
                                }}
                                returnKeyType={'go'}
                                onChangeText={(comment) =>
                                    this.setState({comment})
                                }
                                onBlur={() => this.textInputRef.clear()}
                                placeholder={'Add a reply'}
                                placeholderTextColor={colors.secondBackground}
                            />
                            <View style={{height: 10 * factorVertical}} />
                        </View>
                        <View
                            style={[
                                styles.centerContent,
                                {
                                    flex: 1,
                                    borderTopWidth: 0.5 * factorRatio,
                                    borderTopColor: colors.secondBackground,
                                },
                            ]}
                        >
                            <View style={{flex: 1}} />
                            <TouchableOpacity
                                onPress={() => {
                                    this.makeReply(), this.textInputRef.clear();
                                }}
                            >
                                <IonIcon
                                    name={'md-send'}
                                    size={25 * factorRatio}
                                    color={colors.pianoteRed}
                                />
                            </TouchableOpacity>
                            <View style={{flex: 0.2}} />
                        </View>
                    </Animated.View>
                )}
            </View>
        );
    };
}

export default withNavigation(Replies);
