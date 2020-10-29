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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {withNavigation} from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import commentsService from '../services/comments.service';

var showListener =
    Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
var hideListener =
    Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

class Replies extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            replies: props.parentComment.replies, // video's comments
            profileImage: '',
            parentComment: props.parentComment,
            makeCommentVertDelta: new Animated.Value(0.01),
            showMakeComment: false,
            comment: '',
            userId: null,
        };
    }

    componentDidMount = async () => {
        // get profile image
        let profileImage = await AsyncStorage.getItem('profileURI');
        let userId = JSON.parse(await AsyncStorage.getItem('userId'));

        await this.setState({profileImage, userId});

        this.keyboardDidShowListener = Keyboard.addListener(
            showListener,
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            hideListener,
            this._keyboardDidHide,
        );
    };

    componentWillUnmount() {
        this.keyboardDidShowListener?.remove();
        this.keyboardDidHideListener?.remove();
    }

    _keyboardDidShow = async e => {
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
        this.setState({showMakeComment: false});
        Animated.timing(this.state.makeCommentVertDelta, {
            toValue: -250,
            duration: 275,
        }).start();
    };

    makeReply = async () => {
        if (this.state.comment.length > 0) {
            let encodedReply = encodeURIComponent(this.state.comment);
            let res = await commentsService.addReplyToComment(
                encodedReply,
                this.state.parentComment.id,
            );
            let replies = [...this.state.replies];
            let parentComment = {...this.state.parentComment};
            replies.push(res.data[0]);
            parentComment.replies.push(res.data[0]);
            this.props.onAddReply(this.state.parentComment.id);
            this.setState({
                replies,
                comment: '',
                parentComment,
            });
        }

        this.textInputRef.blur();
    };

    deleteReply = id => {
        let replies = [...this.state.replies];
        let parentComment = {...this.state.parentComment};
        parentComment.replies = parentComment.replies.filter(c => c.id !== id);
        this.setState({
            replies: replies.filter(c => c.id !== id),
            parentComment,
        });
        commentsService.deleteComment(id);
        this.props.onDeleteReply();
    };

    mapReplies() {
        return this.state.replies.map((reply, index) => {
            return (
                <View
                    key={index}
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
                                        reply.user[
                                            'fields.profile_picture_image_url'
                                        ],
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
                                {reply.user.display_name}
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
                            {reply.comment}
                        </Text>
                        <View style={{height: 7.5 * factorVertical}} />
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 11 * factorRatio,
                                color: 'grey',
                            }}
                        >
                            {reply.user['display_name']} | {reply.user.rank} |{' '}
                            {moment.utc(reply.created_on).local().fromNow()}
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
                                            this.likeOrDislikeReply(reply.id);
                                        }}
                                    >
                                        <AntIcon
                                            name={
                                                reply.is_liked
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
                                    {reply.like_count > 0 && (
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
                                                    {reply.like_count}{' '}
                                                    {reply.like_count === 1
                                                        ? 'LIKE'
                                                        : 'LIKES'}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1}} />
                                        </View>
                                    )}
                                </View>
                                <View style={{width: 20 * factorHorizontal}} />
                                {this.state.userId === reply.user_id && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.deleteReply(reply.id)
                                        }
                                    >
                                        <AntIcon
                                            name={'delete'}
                                            size={20 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={{flex: 1}} />
                        </View>
                    </View>
                </View>
            );
        });
    }

    changeXP = num => {
        if (num !== '') {
            num = Number(num);
            if (num < 10000) {
                num = num.toString();
                return num + ' XP';
            } else {
                num = (num / 1000).toFixed(1).toString();
                num = num + 'k';
                return num + ' XP';
            }
        }
    };

    likeOrDislikeParentComment = () => {
        let parentComment = {...this.state.parentComment};
        if (parentComment.is_liked) {
            parentComment.like_count--;
            parentComment.is_liked = false;
            commentsService.dislikeComment(parentComment.id);
        } else {
            parentComment.like_count++;
            parentComment.is_liked = true;
            commentsService.likeComment(parentComment.id);
        }
        this.props.onLikeOrDisikeParentComment(this.state.parentComment.id);
        this.setState({parentComment});
    };

    likeOrDislikeReply = id => {
        let replies = [...this.state.replies];
        let reply = replies.find(f => f.id === id);
        if (reply) {
            if (reply.is_liked) {
                reply.like_count--;
                reply.is_liked = false;
                commentsService.dislikeComment(id);
            } else {
                reply.like_count++;
                reply.is_liked = true;
                commentsService.likeComment(id);
            }
            this.setState({replies});
        }
    };

    render = () => {
        return (
            <View
                key={'componentContainer'}
                style={[
                    styles.centerContent,
                    {
                        flex: 1,
                        zIndex: 10,
                    },
                ]}
            >
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
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
                                                uri: this.state.parentComment
                                                    .user[
                                                    'fields.profile_picture_image_url'
                                                ],
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
                                                this.state.parentComment.user
                                                    .xp,
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
                                        {this.state.parentComment.comment}
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
                                        {
                                            this.state.parentComment.user
                                                .display_name
                                        }{' '}
                                        | {this.state.parentComment.user.rank} |{' '}
                                        {moment
                                            .utc(
                                                this.state.parentComment
                                                    .created_on,
                                            )
                                            .local()
                                            .fromNow()}
                                    </Text>
                                    <View style={{height: 50 * factorVertical}}>
                                        <View style={{flex: 1}} />
                                        <View style={{flexDirection: 'row'}}>
                                            <View
                                                style={{flexDirection: 'row'}}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.likeOrDislikeParentComment();
                                                    }}
                                                >
                                                    <AntIcon
                                                        name={
                                                            this.state
                                                                .parentComment
                                                                .is_liked
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
                                                {this.state.parentComment
                                                    .like_count > 0 && (
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
                                                                        .parentComment
                                                                        .like_count
                                                                }{' '}
                                                                {this.state
                                                                    .parentComment
                                                                    .like_count ===
                                                                1
                                                                    ? 'LIKE'
                                                                    : 'LIKES'}
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
                                                {this.state.parentComment
                                                    .replies.length > 0 && (
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
                                                                        .parentComment
                                                                        .replies
                                                                        .length
                                                                }{' '}
                                                                {this.state
                                                                    .parentComment
                                                                    .replies
                                                                    .length == 1
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
                                            <View
                                                style={{
                                                    width:
                                                        20 * factorHorizontal,
                                                }}
                                            />
                                            {this.state.userId ===
                                                this.state.parentComment
                                                    .user_id && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.props.onDeleteComment(
                                                            this.state
                                                                .parentComment
                                                                .id,
                                                        )
                                                    }
                                                >
                                                    <AntIcon
                                                        name={'delete'}
                                                        size={20 * factorRatio}
                                                        color={
                                                            colors.pianoteRed
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            )}
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
                                        });
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

                        <View>{this.mapReplies()}</View>
                    </View>
                    <View
                        style={{
                            height: isNotch
                                ? 90 * factorVertical
                                : 60 * factorVertical,
                        }}
                    />
                </KeyboardAwareScrollView>
                {this.state.showMakeComment && (
                    <Animated.View
                        key={'makeComment'}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            zIndex: 10,
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
                                ref={ref => {
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
                                onChangeText={comment =>
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
