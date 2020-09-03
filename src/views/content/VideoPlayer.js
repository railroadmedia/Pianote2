/**
 * VideoPlayer
 */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    Platform,
    ActivityIndicator,
    TextInput,
    Animated,
} from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import Replies from '../../components/Replies.js';
import CommentSort from '../../modals/CommentSort.js';
import SoundSlice from '../../components/SoundSlice.js';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import LessonComplete from '../../modals/LessonComplete.js';
import QualitySettings from '../../modals/QualitySettings.js';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import Resources from 'Pianote2/src/assets/img/svgs/resources.svg';
import VideoPlayerOptions from '../../modals/VideoPlayerOptions.js';
import VerticalVideoList from '../../components/VerticalVideoList.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import downloadService from '../../services/download.service.js';
import commentsService from '../../services/comments.service.js';
import contentService from '../../services/content.service.js';

var showListener =
    Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
var hideListener =
    Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export default class VideoPlayer extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.navigation.state.params.id,
            commentSort: 'Popular', // Newest, Oldest, Mine, Popular
            profileImage: '',
            isLoadingAll: true,
            showReplies: false,
            showAssignment: false,
            showCommentSort: false,
            showSoundSlice: false,
            showMakeComment: false,
            showInfo: false,
            showVideoPlayerOptions: false,
            showAssignmentComplete: false,
            showQualitySettings: false,
            showLessonComplete: false,
            isReply: false,
            selectedComment: null,

            makeCommentVertDelta: new Animated.Value(0.01),

            comments: [],
            commentsLoading: true,
            outComments: false,
            page: 1,

            videos: [],

            likes: 0,
            isLiked: false,
            isAddedToMyList: false,
            comment: '',

            assignmentList: [],

            clickedAssignment: {name: '', num: ''},
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
        this.limit = 10;
        this.userId = JSON.parse(await AsyncStorage.getItem('userId'));
        this.getContent();
        this.fetchComments();
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

    getContent = async () => {
        console.log(this.state.id);
        let content = await contentService.getContent(this.state.id);
        content = new ContentModel(content.data[0]);
        console.log('content', content);
        let relatedLessons = content.post.related_lessons.map((data) => {
            return new ContentModel(data);
        });
        let assignments = content.post.assignments.map((data) => {
            return new ContentModel(data);
        });
        console.log('rl', relatedLessons);
        let rl = [];
        let al = [];
        console.log(assignments);
        for (let a in assignments) {
            al.push({
                title: assignments[a].getField('title'),
                isCompleted: assignments[a].isCompleted,
                slug: assignments[a].post.fields.find(
                    (f) => f.key === 'soundslice_slug',
                )?.value,
                sheets: assignments[a].post.data
                    .filter((d) => d.key === 'sheet_music_image_url')
                    .map((s) => ({
                        value: s.value,
                        id: s.id,
                        whRatio: s.whRatio,
                    })),
            });
        }
        for (i in relatedLessons) {
            rl.push({
                title: relatedLessons[i].getField('title'),
                artist: relatedLessons[i].getFieldMulti('instructor'),
                thumbnail: relatedLessons[i].getData('thumbnail_url'),
                type: relatedLessons[i].post.type,
                description: relatedLessons[i]
                    .getData('description')
                    .replace(/(<([^>]+)>)/gi, ''),
                xp: relatedLessons[i].post.xp,
                id: relatedLessons[i].id,
                like_count: relatedLessons[i].post.like_count,
                duration: relatedLessons[i].post.length_in_seconds,
                isLiked: relatedLessons[i].isLiked,
                isAddedToList: relatedLessons[i].isAddedToList,
                isStarted: relatedLessons[i].isStarted,
                isCompleted: relatedLessons[i].isCompleted,
                bundle_count: relatedLessons[i].post.bundle_count,
                progress_percent: relatedLessons[i].post.progress_percent,
            });
        }

        if (content.assignments)
            await downloadService.getAssignWHRatio(content.assignments);

        this.setState({
            data: content,
            isLoadingAll: false,
            videos: [...this.state.videos, ...rl],
            likes: parseInt(content.likeCount),
            isLiked: content.isLiked,
            isAddedToMyList: content.isAddedToList,
            assignmentList: [...this.state.assignmentList, ...al],
        });
    };

    fetchComments = async () => {
        this.setState({commentsLoading: true});

        let comments = await commentsService.getComments(
            this.state.id,
            this.state.commentSort,
            10,
        );
        console.log('fetchComm', comments);
        this.allCommentsNum = comments.meta.totalResults;
        await this.setState({commentsLoading: false, comments: comments.data});
    };

    showFooter() {
        if (this.state.outComments == false) {
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
                        size={isTablet ? 'large' : 'small'}
                        color={'grey'}
                    />
                </View>
            );
        } else {
            return <View style={{height: 20 * factorVertical}} />;
        }
    }

    likeComment = async (id) => {
        let comments = [...this.state.comments];
        let comment = comments.find((f) => f.id === id);
        if (comment) {
            if (comment.is_liked) {
                comment.like_count--;
                comment.is_liked = false;
                commentsService.dislikeComment(id);
            } else {
                comment.like_count++;
                comment.is_liked = true;
                commentsService.likeComment(id);
            }
            this.setState({comments});
        }
    };

    makeComment = async () => {
        if (this.state.comment.length > 0) {
            let encodedCommentText = encodeURIComponent(this.state.comment);
            await commentsService.addComment(encodedCommentText, this.state.id);

            const comments = await commentsService.getComments(
                this.state.id,
                this.state.commentSort,
                this.allCommentsNum + 1,
            );
            console.log(comments);
            this.allCommentsNum = comments.meta.totalResults;
            this.setState({comment: '', comments: comments.data});

            this.textInputRef.blur();
        }
    };

    deleteComment = (id) => {
        let {comments} = this.state;
        this.allCommentsNum -= 1;
        this.setState({
            comments: comments.filter((c) => c.id !== id),
            showReplies: false,
        });
        commentsService.deleteComment(id);
    };

    mapComments() {
        return this.state.comments.map((comment, index) => {
            return (
                <View
                    style={{
                        backgroundColor: colors.mainBackground,
                        paddingTop: fullHeight * 0.025,
                        paddingBottom: fullHeight * 0.02,
                        paddingLeft: fullWidth * 0.05,
                        paddingRight: fullWidth * 0.03,
                        minHeight: 40 * factorVertical,
                        borderTopColor: colors.secondBackground,
                        borderTopWidth: 0.25,
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
                                        comment.user[
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
                                    fontWeight: 'bold',
                                    color: 'grey',
                                }}
                            >
                                {this.changeXP(comment.user.xp)}
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
                            {comment.comment}
                        </Text>
                        <View style={{height: 7.5 * factorVertical}} />
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 12 * factorRatio,
                                color: colors.secondBackground,
                            }}
                        >
                            {comment.user['display_name']} | {comment.user.rank}{' '}
                            | {moment.utc(comment.created_on).local().fromNow()}
                        </Text>
                        <View
                            style={{
                                paddingTop: 15 * factorVertical,
                                paddingBottom: 15 * factorVertical,
                            }}
                        >
                            <View style={{flex: 1}} />
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.likeComment(comment.id);
                                        }}
                                    >
                                        <AntIcon
                                            name={
                                                comment.is_liked
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
                                    {comment.like_count > 0 && (
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
                                                            10 * factorRatio,
                                                        color:
                                                            colors.pianoteRed,
                                                    }}
                                                >
                                                    {comment.like_count}{' '}
                                                    {comment.like_count === 1
                                                        ? 'LIKE'
                                                        : 'LIKES'}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1}} />
                                        </View>
                                    )}
                                </View>
                                <View style={{width: 20 * factorHorizontal}} />
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                showReplies: true,
                                                selectedComment: comment,
                                            });
                                        }}
                                    >
                                        <MaterialIcon
                                            name={'comment-text-outline'}
                                            size={20 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{width: 10 * factorHorizontal}}
                                    />
                                    {comment.replies.length > 0 && (
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
                                                            10 * factorRatio,
                                                        color:
                                                            colors.pianoteRed,
                                                    }}
                                                >
                                                    {comment.replies.length}{' '}
                                                    {comment.replies.length ===
                                                    1
                                                        ? 'REPLY'
                                                        : 'REPLIES'}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1}} />
                                        </View>
                                    )}
                                </View>
                                <View style={{width: 20 * factorHorizontal}} />
                                {this.userId === comment.user_id && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.deleteComment(comment.id)
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
                        {comment.replies.length !== 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        showReplies: true,
                                        selectedComment: comment,
                                    });
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 12 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    VIEW {comment.replies.length}{' '}
                                    {comment.replies.length === 1
                                        ? 'REPLY'
                                        : 'REPLIES'}
                                </Text>
                            </TouchableOpacity>
                        )}
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
                return num + ' XP';
            } else {
                num = (num / 1000).toFixed(1).toString();
                num = num + 'k';
                return num + ' XP';
            }
        }
    };

    renderAssignments() {
        return this.state.assignmentList.map((row, index) => {
            console.log(row);
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('VIDEOPLAYERSONG', {
                            assignmentName: row.title,
                            assignmentNum: index + 1,
                            showAssignment: true,
                            sheets: row.sheets,
                            slug: row.slug,
                        });
                    }}
                    style={{
                        height: 55 * factorVertical,
                        paddingLeft: fullWidth * 0.035,
                        borderBottomColor: colors.secondBackground,
                        borderBottomWidth: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <View>
                        <View style={{flex: 1}} />
                        <Text
                            style={{
                                fontSize: 18 * factorRatio,
                                color: colors.secondBackground,
                                fontFamily: 'RobotoCondensed-Bold',
                            }}
                        >
                            {index + 1}. {row.title}
                        </Text>
                        <View style={{flex: 1}} />
                    </View>
                    <View style={{flex: 1}} />
                    <View
                        style={[
                            styles.centerContent,
                            {
                                height: '100%',
                                width: 40 * factorHorizontal,
                                flexDirection: 'row',
                            },
                        ]}
                    >
                        {row.isCompleted ? (
                            <View style={styles.centerContent}>
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            height: 22.5 * factorRatio,
                                            width: 22.5 * factorRatio,
                                            borderRadius: 100,
                                            backgroundColor: '#fb1b2f',
                                        },
                                    ]}
                                >
                                    <EntypoIcon
                                        name={'check'}
                                        size={17.5 * factorRatio}
                                        color={colors.mainBackground}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View
                                style={[
                                    styles.centerContent,
                                    {flexDirection: 'row'},
                                ]}
                            >
                                <View style={{flex: 0.25}} />
                                <EntypoIcon
                                    name={'chevron-thin-right'}
                                    size={20 * factorRatio}
                                    color={colors.secondBackground}
                                />
                                <View style={{flex: 1}} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            );
        });
    }

    render() {
        return (
            <View styles={styles.container}>
                <View
                    key={'container2'}
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                        backgroundColor: colors.mainBackground,
                    }}
                >
                    <View
                        style={{
                            height: isNotch
                                ? fullHeight * 0.05
                                : fullHeight * 0.03,
                        }}
                    />
                    <View
                        key={'video'}
                        style={{
                            height: onTablet
                                ? fullHeight * 0.375
                                : fullHeight * 0.275,
                            backgroundColor: colors.mainBackground,
                        }}
                    >
                        {/* <FastImage
                            style={{flex: 1}}
                            source={{
                                uri: this.state.data?.getData('thumbnail_url'),
                            }}
                            resizeMode={FastImage.resizeMode.stretch}
                        /> */}
                    </View>
                    <View key={'belowVideo'} style={{flex: 1}}>
                        <KeyboardAwareScrollView
                            innerRef={(ref) => {
                                this.scroll = ref;
                            }}
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior={'never'}
                            style={{
                                flex: 1,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <View style={{height: 2.5 * factorVertical}} />
                            <View key={'lessonTitle'}>
                                <View style={{height: fullHeight * 0.015}} />
                                <Text
                                    style={{
                                        fontSize: 20 * factorRatio,
                                        fontWeight: 'bold',
                                        fontFamily: 'OpenSans-Regular',
                                        textAlign: 'center',
                                        color: 'white',
                                    }}
                                >
                                    {this.state.data?.getField('title')}
                                </Text>
                                <View style={{height: fullHeight * 0.01}} />
                                <Text
                                    style={{
                                        fontSize: 12 * factorRatio,
                                        fontWeight: '400',
                                        color: 'grey',
                                        fontFamily: 'OpenSans-Regular',
                                        textAlign: 'center',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    {this.state.data?.artist} | LESSON 7 |{' '}
                                    {this.state.data?.xp} XP
                                </Text>
                                <View style={{height: fullHeight * 0.015}} />
                            </View>
                            <View
                                key={'icons'}
                                style={{
                                    paddingLeft: fullWidth * 0.015,
                                    paddingRight: fullWidth * 0.015,
                                }}
                            >
                                <View style={{flex: 1}} />
                                <View
                                    key={'icon'}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                    }}
                                >
                                    <TouchableOpacity
                                        key={'like'}
                                        onPress={() => {
                                            this.setState({
                                                isLiked: !this.state.isLiked,
                                                likes: this.state.isLiked
                                                    ? this.state.likes - 1
                                                    : this.state.likes + 1,
                                            });
                                        }}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AntIcon
                                            name={
                                                this.state.isLiked
                                                    ? 'like1'
                                                    : 'like2'
                                            }
                                            size={27.5 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <View
                                            style={{height: 5 * factorVertical}}
                                        />
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12 * factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            {this.state.likes}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        key={'list'}
                                        onPress={() =>
                                            this.setState({
                                                isAddedToMyList: !this.state
                                                    .isAddedToMyList,
                                            })
                                        }
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AntIcon
                                            name={
                                                this.state.isAddedToMyList
                                                    ? 'close'
                                                    : 'plus'
                                            }
                                            size={27.5 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <View
                                            style={{height: 5 * factorVertical}}
                                        />
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12 * factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            {this.state.isAddedToMyList
                                                ? 'Added'
                                                : 'My List'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        key={'resource'}
                                        onPress={() => {}}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Resources
                                            height={27.5 * factorRatio}
                                            width={27.5 * factorRatio}
                                            fill={colors.pianoteRed}
                                        />
                                        <View
                                            style={{
                                                height: 7.5 * factorVertical,
                                            }}
                                        />
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12 * factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            Resources
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        key={'download'}
                                        onPress={() => {}}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <MaterialIcon
                                            name={'arrow-collapse-down'}
                                            size={27.5 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <View
                                            style={{height: 5 * factorVertical}}
                                        />
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12 * factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            Download
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        key={'info'}
                                        onPress={() => {
                                            this.setState({
                                                showInfo: !this.state.showInfo,
                                            });
                                        }}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AntIcon
                                            name={
                                                this.state.showInfo
                                                    ? 'infocirlce'
                                                    : 'infocirlceo'
                                            }
                                            size={27.5 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <View
                                            style={{height: 5 * factorVertical}}
                                        />
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12 * factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            Info
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1}} />
                            </View>
                            <View key={'infoExpanded'}>
                                {this.state.showInfo && (
                                    <View>
                                        <View
                                            style={{height: fullHeight * 0.03}}
                                        />
                                        {console.log('desc', this.state.data)}
                                        <Text
                                            style={{
                                                paddingLeft: '5%',
                                                paddingRight: '5%',
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 14 * factorRatio,
                                                textAlign: 'center',
                                                color: 'white',
                                            }}
                                        >
                                            {this.state.data?.getData(
                                                'description',
                                            )}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View
                                key={'buffer'}
                                style={{
                                    height:
                                        this.state.data?.type !== 'song'
                                            ? 20 * factorVertical
                                            : 10 * factorVertical,
                                }}
                            />
                            {this.state.assignmentList?.length > 0 && (
                                <>
                                    <View
                                        key={'assingmentsHeader'}
                                        style={{paddingLeft: fullWidth * 0.035}}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 18 * factorRatio,
                                                fontFamily:
                                                    'RobotoCondensed-Bold',
                                                color: colors.secondBackground,
                                            }}
                                        >
                                            ASSIGNMENTS
                                        </Text>
                                        <View
                                            style={{
                                                height: 20 * factorVertical,
                                            }}
                                        />
                                    </View>

                                    <View
                                        key={'assignments'}
                                        style={{
                                            width: fullWidth,
                                            borderTopColor:
                                                colors.secondBackground,
                                            borderTopWidth: 1,
                                        }}
                                    >
                                        {this.renderAssignments()}
                                    </View>
                                </>
                            )}
                            <View style={{height: 20 * factorVertical}} />
                            <View
                                key={'videoList'}
                                style={{
                                    minHeight: fullHeight * 0.5,
                                }}
                            >
                                <VerticalVideoList
                                    title={'RELATED LESSONS'}
                                    items={Object.values(this.state.videos)}
                                    type={'LESSONS'}
                                    isLoading={this.state.isLoadingAll}
                                    showTitleOnly={true}
                                    showFilter={true}
                                    showType={false}
                                    showArtist={false}
                                    showSort={false}
                                    showLength={true}
                                    imageRadius={5 * factorRatio}
                                    containerBorderWidth={0}
                                    containerWidth={fullWidth}
                                    containerHeight={
                                        this.state.data?.type !== 'song'
                                            ? onTablet
                                                ? fullHeight * 0.15
                                                : Platform.OS == 'android'
                                                ? fullHeight * 0.115
                                                : fullHeight * 0.0925
                                            : fullWidth * 0.22
                                    }
                                    imageHeight={
                                        this.state.data?.type !== 'song'
                                            ? onTablet
                                                ? fullHeight * 0.12
                                                : Platform.OS == 'android'
                                                ? fullHeight * 0.09
                                                : fullHeight * 0.08
                                            : fullWidth * 0.175
                                    }
                                    imageWidth={
                                        this.state.data?.type !== 'song'
                                            ? fullWidth * 0.26
                                            : fullWidth * 0.175
                                    }
                                    navigator={(row) =>
                                        this.props.navigation.navigate(
                                            'VIDEOPLAYER',
                                            {id: row.id},
                                        )
                                    }
                                />
                            </View>
                            <View style={{height: 10 * factorVertical}} />
                            <View
                                key={'commentList'}
                                style={{
                                    minHeight: fullHeight * 0.4,
                                }}
                            >
                                {!this.state.commentsLoading && (
                                    <View
                                        key={'commentContainer'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                minHeight: fullHeight * 0.4,
                                                width: fullWidth,
                                                zIndex: 10,
                                            },
                                        ]}
                                    >
                                        <View style={{flex: 1}}>
                                            <View
                                                style={{
                                                    width: fullWidth,
                                                    backgroundColor:
                                                        colors.mainBackground,
                                                    zIndex: 5,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        height:
                                                            fullHeight * 0.025,
                                                    }}
                                                />
                                                <View
                                                    key={'commentHeader'}
                                                    style={{
                                                        width: fullWidth,
                                                        flexDirection: 'row',
                                                        paddingLeft:
                                                            fullWidth * 0.05,
                                                        paddingRight:
                                                            fullWidth * 0.01,
                                                    }}
                                                >
                                                    <View>
                                                        <View
                                                            style={{flex: 1}}
                                                        />
                                                        <Text
                                                            style={{
                                                                fontSize:
                                                                    18 *
                                                                    factorRatio,
                                                                fontFamily:
                                                                    'RobotoCondensed-Bold',
                                                                color:
                                                                    colors.secondBackground,
                                                            }}
                                                        >
                                                            {this.state.isReply
                                                                ? 'REPLIES'
                                                                : this
                                                                      .allCommentsNum +
                                                                  ' COMMENTS'}
                                                        </Text>
                                                        <View
                                                            style={{flex: 1}}
                                                        />
                                                    </View>
                                                    <View style={{flex: 1}} />
                                                    {this.state.isReply && (
                                                        <TouchableOpacity
                                                            onPress={() => {}}
                                                        >
                                                            <EntypoIcon
                                                                size={
                                                                    27.5 *
                                                                    factorRatio
                                                                }
                                                                name={'cross'}
                                                                color={
                                                                    '#c2c2c2'
                                                                }
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                    {!this.state.isReply && (
                                                        <TouchableOpacity
                                                            style={{
                                                                marginLeft:
                                                                    factorHorizontal *
                                                                    10,
                                                            }}
                                                            onPress={() => {
                                                                this.setState({
                                                                    showCommentSort: true,
                                                                });
                                                            }}
                                                        >
                                                            <FontIcon
                                                                size={
                                                                    20 *
                                                                    factorRatio
                                                                }
                                                                name={
                                                                    'sort-amount-down'
                                                                }
                                                                color={
                                                                    colors.pianoteRed
                                                                }
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 0.1}} />
                                                </View>
                                                <View style={{flex: 1.25}} />
                                                {this.state.isReply && (
                                                    <View
                                                        key={'originalReply'}
                                                        style={{
                                                            backgroundColor:
                                                                colors.mainBackground,
                                                            paddingTop:
                                                                fullHeight *
                                                                0.025,
                                                            paddingBottom:
                                                                fullHeight *
                                                                0.02,
                                                            paddingLeft:
                                                                fullWidth *
                                                                0.05,
                                                            paddingRight:
                                                                fullWidth *
                                                                0.03,
                                                            minHeight:
                                                                40 *
                                                                factorVertical,
                                                            flexDirection:
                                                                'row',
                                                        }}
                                                    >
                                                        <View>
                                                            <View
                                                                style={{
                                                                    alignItems:
                                                                        'center',
                                                                }}
                                                            >
                                                                <FastImage
                                                                    style={{
                                                                        height:
                                                                            40 *
                                                                            factorHorizontal,
                                                                        width:
                                                                            40 *
                                                                            factorHorizontal,
                                                                        borderRadius: 100,
                                                                    }}
                                                                    source={{
                                                                        uri:
                                                                            'https://facebook.github.io/react-native/img/tiny_logo.png',
                                                                    }}
                                                                    resizeMode={
                                                                        FastImage
                                                                            .resizeMode
                                                                            .stretch
                                                                    }
                                                                />
                                                                <Text
                                                                    style={{
                                                                        fontFamily:
                                                                            'OpenSans-Regular',
                                                                        fontSize:
                                                                            10 *
                                                                            factorRatio,
                                                                        marginTop:
                                                                            2 *
                                                                            factorRatio,
                                                                        fontWeight:
                                                                            Platform.OS ==
                                                                            'ios'
                                                                                ? '700'
                                                                                : 'bold',
                                                                        color:
                                                                            'grey',
                                                                    }}
                                                                >
                                                                    'Hello'
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={{
                                                                    flex: 1,
                                                                }}
                                                            />
                                                        </View>
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                paddingLeft:
                                                                    12.5 *
                                                                    factorHorizontal,
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    height:
                                                                        3 *
                                                                        factorVertical,
                                                                }}
                                                            />
                                                            <Text
                                                                style={{
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    fontSize:
                                                                        13 *
                                                                        factorRatio,
                                                                }}
                                                            >
                                                                Lorem ipsum
                                                                dolor sit smart
                                                                cosaf adiffdsf
                                                                eli, prascent
                                                                quie eros
                                                                magnia. Etrian
                                                                tincidunt
                                                            </Text>
                                                            <View
                                                                style={{
                                                                    height:
                                                                        7.5 *
                                                                        factorVertical,
                                                                }}
                                                            />
                                                            <Text
                                                                style={{
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    fontSize:
                                                                        11 *
                                                                        factorRatio,
                                                                    color:
                                                                        'grey',
                                                                }}
                                                            >
                                                                user | rank |
                                                                time
                                                            </Text>
                                                            <View
                                                                style={{
                                                                    height:
                                                                        50 *
                                                                        factorVertical,
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flex: 1,
                                                                    }}
                                                                />
                                                                <View
                                                                    style={{
                                                                        flexDirection:
                                                                            'row',
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            flexDirection:
                                                                                'row',
                                                                        }}
                                                                    >
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                this.likeComment();
                                                                            }}
                                                                        >
                                                                            <AntIcon
                                                                                name={
                                                                                    'like2'
                                                                                }
                                                                                size={
                                                                                    20 *
                                                                                    factorRatio
                                                                                }
                                                                                color={
                                                                                    'black'
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
                                                                        <View>
                                                                            <View
                                                                                style={{
                                                                                    flex: 1,
                                                                                }}
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
                                                                                            '#ececec',
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
                                                                                            'dimgrey',
                                                                                    }}
                                                                                >
                                                                                    4
                                                                                    LIKES
                                                                                </Text>
                                                                            </View>
                                                                            <View
                                                                                style={{
                                                                                    flex: 1,
                                                                                }}
                                                                            />
                                                                        </View>
                                                                    </View>
                                                                    <View
                                                                        style={{
                                                                            width:
                                                                                20 *
                                                                                factorHorizontal,
                                                                        }}
                                                                    />
                                                                    <View
                                                                        style={{
                                                                            flexDirection:
                                                                                'row',
                                                                        }}
                                                                    >
                                                                        <TouchableOpacity
                                                                            onPress={() => {}}
                                                                        >
                                                                            <MaterialIcon
                                                                                name={
                                                                                    'comment-text-outline'
                                                                                }
                                                                                size={
                                                                                    20 *
                                                                                    factorRatio
                                                                                }
                                                                                color={
                                                                                    'black'
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
                                                                        <View>
                                                                            <View
                                                                                style={{
                                                                                    flex: 1,
                                                                                }}
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
                                                                                            '#ececec',
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
                                                                                            'dimgrey',
                                                                                    }}
                                                                                >
                                                                                    REPLIES
                                                                                </Text>
                                                                            </View>
                                                                            <View
                                                                                style={{
                                                                                    flex: 1,
                                                                                }}
                                                                            />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        flex: 1,
                                                                    }}
                                                                />
                                                            </View>
                                                            <TouchableOpacity
                                                                onPress={() => {}}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        fontFamily:
                                                                            'OpenSans-Regular',
                                                                        fontSize:
                                                                            11.5 *
                                                                            factorRatio,
                                                                        color:
                                                                            '#fb1b2f',
                                                                    }}
                                                                >
                                                                    VIEW REPLIES
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )}
                                                <View
                                                    key={'addComment'}
                                                    style={{
                                                        width: fullWidth,
                                                        height:
                                                            fullHeight * 0.1,
                                                        flexDirection: 'row',
                                                        paddingLeft:
                                                            fullWidth * 0.05,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                showMakeComment: true,
                                                            }),
                                                                setTimeout(
                                                                    () =>
                                                                        this.textInputRef.focus(),
                                                                    100,
                                                                );
                                                        }}
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                        }}
                                                    >
                                                        <View
                                                            key={'profileImage'}
                                                            style={{
                                                                height: '100%',
                                                                width:
                                                                    40 *
                                                                    factorHorizontal,
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    flex: 1,
                                                                }}
                                                            />
                                                            <FastImage
                                                                style={{
                                                                    height:
                                                                        40 *
                                                                        factorHorizontal,
                                                                    width:
                                                                        40 *
                                                                        factorHorizontal,
                                                                    borderRadius: 100,
                                                                }}
                                                                source={
                                                                    require('Pianote2/src/assets/img/imgs/lisa-witt.jpg')
                                                                    //    {uri: this.state.profileImage}
                                                                }
                                                                resizeMode={
                                                                    FastImage
                                                                        .resizeMode
                                                                        .stretch
                                                                }
                                                            />
                                                            <View
                                                                style={{
                                                                    flex: 1,
                                                                }}
                                                            />
                                                        </View>
                                                        <View
                                                            key={'addComment'}
                                                            style={{
                                                                height: '100%',
                                                                width:
                                                                    fullWidth *
                                                                        0.95 -
                                                                    40 *
                                                                        factorHorizontal,
                                                                justifyContent:
                                                                    'center',
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'left',
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    fontSize:
                                                                        13 *
                                                                        factorRatio,
                                                                    color:
                                                                        'white',
                                                                    paddingLeft:
                                                                        10 *
                                                                        factorHorizontal,
                                                                }}
                                                            >
                                                                Add a comment...
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}} />
                                            </View>
                                            {this.mapComments()}
                                        </View>
                                        <View
                                            style={{height: fullHeight * 0.035}}
                                        />
                                    </View>
                                )}
                            </View>
                            <View
                                style={{
                                    height: isNotch
                                        ? 90 * factorVertical
                                        : 60 * factorVertical,
                                }}
                            />
                        </KeyboardAwareScrollView>
                    </View>

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
                                        this.makeComment();
                                        this.textInputRef.clear();
                                    }}
                                    returnKeyType={'go'}
                                    onChangeText={(comment) =>
                                        this.setState({comment})
                                    }
                                    onBlur={() => this.textInputRef.clear()}
                                    placeholder={'Add a comment'}
                                    placeholderTextColor={
                                        colors.secondBackground
                                    }
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
                                    style={{
                                        marginBottom:
                                            Platform.OS == 'android'
                                                ? 10 * factorVertical
                                                : 0,
                                    }}
                                    onPress={() => {
                                        this.makeComment();
                                        this.textInputRef.clear();
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
                    <View
                        key={'completeLesson'}
                        style={[
                            styles.centerContent,
                            {
                                position: 'absolute',
                                left: 0 * factorHorizontal,
                                width: fullWidth,
                                backgroundColor: colors.mainBackground,
                                zIndex: 5,
                                bottom: 0,
                                paddingBottom: isNotch
                                    ? fullHeight * 0.035
                                    : fullHeight * 0.015,
                            },
                        ]}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <View
                                style={{
                                    width: fullWidth * 0.7,
                                    height: 2 * factorRatio,
                                    backgroundColor: colors.pianoteRed,
                                }}
                            />
                            <View style={{flex: 1}} />
                        </View>
                        <View
                            style={{
                                width: fullWidth,
                                height: 15 * factorVertical,
                            }}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <View
                                key={'last'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 0.2,
                                        alignSelf: 'stretch',
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        height: fullWidth * 0.1,
                                        width: fullWidth * 0.1,
                                        borderRadius: 100,
                                        borderWidth: 2 * factorRatio,
                                        borderColor: colors.secondBackground,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {}}
                                        style={[
                                            styles.centerContent,
                                            {
                                                height: '100%',
                                                width: '100%',
                                            },
                                        ]}
                                    >
                                        <EntypoIcon
                                            name={'chevron-thin-left'}
                                            size={22.5 * factorRatio}
                                            color={colors.secondBackground}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View
                                key={'complete'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 0.6,
                                        alignSelf: 'stretch',
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {}}
                                    style={[
                                        styles.centerContent,
                                        {
                                            height: fullWidth * 0.1,
                                            width: fullWidth * 0.6,
                                            borderRadius: 100,
                                            backgroundColor: colors.pianoteRed,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontFamily: 'RobotoCondensed-Bold',
                                            fontSize: 14 * factorRatio,
                                        }}
                                    >
                                        COMPLETE LESSON
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                key={'next'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 0.2,
                                        alignSelf: 'stretch',
                                    },
                                ]}
                            >
                                <View
                                    style={{
                                        height: fullWidth * 0.1,
                                        width: fullWidth * 0.1,
                                        borderRadius: 100,
                                        borderWidth: 2 * factorRatio,
                                        borderColor: colors.pianoteRed,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {}}
                                        style={[
                                            styles.centerContent,
                                            {
                                                height: '100%',
                                                width: '100%',
                                            },
                                        ]}
                                    >
                                        <EntypoIcon
                                            name={'chevron-thin-right'}
                                            size={22.5 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        key={'goBackIcon'}
                        style={[
                            styles.centerContent,
                            {
                                position: 'absolute',
                                left: 10 * factorHorizontal,
                                top: isNotch
                                    ? 55 * factorVertical
                                    : 45 * factorVertical,
                                height: 35 * factorRatio,
                                width: 35 * factorRatio,
                                borderRadius: 100,
                                zIndex: 5,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                            style={[
                                styles.centerContent,
                                {
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: 100,
                                    backgroundColor: 'black',
                                    opacity: 0.4,
                                },
                            ]}
                        >
                            <EntypoIcon
                                name={'chevron-thin-left'}
                                size={22.5 * factorRatio}
                                color={'white'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                            style={[
                                styles.centerContent,
                                {
                                    height: '100%',
                                    width: '100%',
                                    borderRadius: 100,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                            ]}
                        >
                            <EntypoIcon
                                name={'chevron-thin-left'}
                                size={22.5 * factorRatio}
                                color={'white'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    key={'VideoPlayerOptions'}
                    isVisible={this.state.showVideoPlayerOptions}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <VideoPlayerOptions
                        hideVideoPlayerOptions={() => {
                            this.setState({
                                showVideoPlayerOptions: false,
                            });
                        }}
                    />
                </Modal>
                <Modal
                    key={'QualitySettings'}
                    isVisible={this.state.showQualitySettings}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <QualitySettings
                        hideQualitySettings={() => {
                            this.setState({
                                showQualitySettings: false,
                            });
                        }}
                    />
                </Modal>
                <Modal
                    key={'replies'}
                    isVisible={this.state.showReplies}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={false}
                    hasBackdrop={false}
                >
                    <Replies
                        hideReplies={() => {
                            this.setState({showReplies: false});
                        }}
                        parentComment={this.state.selectedComment}
                        onLikeOrDisikeParentComment={this.likeComment}
                        onAddReply={this.fetchComments}
                        onDeleteReply={this.fetchComments}
                        onDeleteComment={this.deleteComment}
                    />
                </Modal>
                <Modal
                    key={'lessonComplete'}
                    isVisible={this.state.showLessonComplete}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <LessonComplete
                        hideLessonComplete={() => {
                            this.setState({showLessonComplete: false});
                        }}
                    />
                </Modal>
                <Modal
                    key={'modalCommentSort'}
                    isVisible={this.state.showCommentSort}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={false}
                    backdropColor={'white'}
                    backdropOpacity={0.79}
                >
                    <CommentSort
                        hideCommentSort={() => {
                            this.setState({showCommentSort: false});
                        }}
                        currentSort={this.state.commentSort}
                        changeSort={(commentSort) => {
                            this.setState({commentSort}, () =>
                                this.fetchComments(),
                            );
                        }}
                    />
                </Modal>

                <Modal
                    key={'soundSlice'}
                    isVisible={this.state.showSoundSlice}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <SoundSlice
                        hideSoundSlice={() => {
                            this.setState({
                                showSoundSlice: false,
                            });
                        }}
                    />
                </Modal>
            </View>
        );
    }
}
