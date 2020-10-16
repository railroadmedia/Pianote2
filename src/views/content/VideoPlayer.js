/**
 * VideoPlayer
 */
import React from 'react';
import {
    View,
    Text,
    Keyboard,
    Platform,
    Animated,
    StatusBar,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
//import Video from 'RNVideoEnhanced';
import {NavigationActions, StackActions} from 'react-navigation';

import Replies from '../../components/Replies.js';
import CommentSort from '../../modals/CommentSort.js';
import SoundSlice from '../../components/SoundSlice.js';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import LessonComplete from '../../modals/LessonComplete.js';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import Resources from 'Pianote2/src/assets/img/svgs/resources.svg';
import VerticalVideoList from '../../components/VerticalVideoList.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import downloadService from '../../services/download.service.js';
import commentsService from '../../services/comments.service.js';
import contentService from '../../services/content.service.js';
import {
    likeContent,
    unlikeContent,
    addToMyList,
    removeFromMyList,
    resetProgress,
    markComplete,
} from 'Pianote2/src/services/UserActions.js';
import {DownloadResources} from '../../components/ConnectedDownloadResources';
import OverviewComplete from '../../modals/OverviewComplete.js';
import VideoPlayerSong from './VideoPlayerSong.js';
import AssignmentComplete from '../../modals/AssignmentComplete.js';
import RestartCourse from '../../modals/RestartCourse.js';
import foundationsService from '../../services/foundations.service.js';

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
            url: this.props.navigation.state.params.url,
            commentSort: 'Popular', // Newest, Oldest, Mine, Popular
            profileImage: '',
            isLoadingAll: true,
            showReplies: false,
            showAssignment: false,
            showCommentSort: false,
            showSoundSlice: false,
            showMakeComment: false,
            showInfo: false,
            showAssignmentComplete: false,
            showOverviewComplete: false,
            showQualitySettings: false,
            showLessonComplete: false,
            showResDownload: false,
            showVideo: true,
            isReply: false,
            selectedComment: null,

            makeCommentVertDelta: new Animated.Value(0.01),

            comments: [],
            commentsLoading: true,
            outComments: false,
            page: 1,

            relatedLessons: [],
            likes: 0,
            isLiked: false,
            isAddedToMyList: false,
            artist: null,
            instructor: null,
            nextLesson: null,
            nextUnit: null,
            previousLesson: null,
            lessonImage: '',
            lessonTitle: '',
            comment: '',
            assignmentList: [],
            selectedAssignment: null,
            resources: null,
            description: '',
            progress: null,
            publishedOn: '',
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
    };

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
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
        Animated.timing(this.state.makeCommentVertDelta, {
            toValue: -250,
            duration: 275,
        }).start();
    };

    getContent = async () => {
        let content;
        if (this.props.navigation.state.params.url) {
            content = await foundationsService.getUnitLesson(this.state.url);
        } else {
            content = await contentService.getContent(this.state.id);
            content = content.data[0];
        }
        content = new ContentModel(content);
        this.fetchComments(content.id);
        let relatedLessons = content.post.related_lessons?.map(rl => {
            return new ContentModel(rl);
        });
        let al = [];
        if (content.post.assignments) {
            await downloadService.getAssignWHRatio(content.post.assignments);
            let assignments = content.post.assignments.map(assignment => {
                return new ContentModel(assignment);
            });

            for (let a in assignments) {
                al.push({
                    id: assignments[a].id,
                    title: assignments[a].getField('title'),
                    isCompleted: assignments[a].isCompleted,
                    description: assignments[a].getData('description').replace(/(<([^>]+)>)/g, "").replace(/&nbsp;/g, '').replace(/&amp;/g, '&').replace(/'/g, '&#039;').replace(/"/g, '&quot;').replace(/&gt;/g, '>').replace(/&lt;/g, '<'),
                    xp: assignments[a].xp,
                    progress:
                        parseInt(
                            Object.values(
                                assignments[a].post.user_progress,
                            )?.[0].progress_percent,
                        ) || 0,
                    slug: assignments[a].post.fields?.find(
                        f => f.key === 'soundslice_slug',
                    )?.value,
                    timeCodes: assignments[a].post.data
                        .filter(d => d.key === 'timecode')
                        .map(tc => ({value: tc.value})),
                    sheets: assignments[a].post.data
                        .filter(d => d.key === 'sheet_music_image_url')
                        .map(s => ({
                            value: s.value,
                            id: s.id,
                            whRatio: s.whRatio,
                        })),
                });
            }
        }
        let rl = [];

        for (i in relatedLessons) {
            rl.push({
                title: relatedLessons[i].getField('title'),
                thumbnail: relatedLessons[i].getData('thumbnail_url'),
                type: relatedLessons[i].type,
                id: relatedLessons[i].id,
                duration: relatedLessons[i].post.length_in_seconds,
                isAddedToList: relatedLessons[i].isAddedToList,
                isStarted: relatedLessons[i].isStarted,
                isCompleted: relatedLessons[i].isCompleted,
                progress_percent: relatedLessons[i].post.progress_percent,
            });
        }

        this.setState(
            {
                id: content.id,
                url: content.post.mobile_app_url,
                type: content.type,
                lessonImage: content.getData('thumbnail_url'),
                lessonTitle: content.getField('title'),
                description: content.getData('description').replace(/(<([^>]+)>)/g, "").replace(/&nbsp;/g, '').replace(/&amp;/g, '&').replace(/'/g, '&#039;').replace(/"/g, '&quot;').replace(/&gt;/g, '>').replace(/&lt;/g, '<'),
                xp: content.xp,
                artist: content.getField('artist'),
                instructor: content.getFieldMulti('instructor'),
                isLoadingAll: false,
                publishedOn: content.publishedOn,
                relatedLessons: [...this.state.relatedLessons, ...rl],
                likes: parseInt(content.likeCount),
                isLiked: content.isLiked,
                lengthInSec: content.post.length_in_seconds,
                lastWatchedPosInSec:
                    content.post.last_watch_position_in_seconds,
                progress:
                    parseInt(
                        Object.values(content.post.user_progress)?.[0]
                            .progress_percent,
                    ) || 0,
                isAddedToMyList: content.isAddedToList,
                assignmentList: [...this.state.assignmentList, ...al],
                nextUnit: content.post.next_unit
                    ? new ContentModel(content.post.next_unit)
                    : null,
                nextLesson: content.post.next_lesson
                    ? new ContentModel(content.post.next_lesson)
                    : null,
                previousLesson: content.post.previous_lesson
                    ? new ContentModel(content.post.previous_lesson)
                    : null,
                mp3s: content.post.mp3s || [],
                video_playback_endpoints: content.post.video_playback_endpoints,
                nextLessonId: content?.post?.next_lesson?.id,
                previousLessonId: content?.post?.previous_lesson?.id,
                nextLessonUrl: content?.post?.next_lesson?.mobile_app_url,
                previousLessonUrl:
                    content?.post?.previous_lesson?.mobile_app_url,
                resources:
                    content.post.resources && content.post.resources.length > 0
                        ? Object.keys(content.post.resources).map(key => {
                              return content.post.resources[key];
                          })
                        : undefined,
            },
            () => {
                if (this.state.resources) this.createResourcesArr();
            },
        );
    };

    createResourcesArr() {
        const {resources} = this.state;
        const extensions = ['mp3', 'pdf', 'zip'];

        resources.forEach(resource => {
            let extension = this.decideExtension(resource.resource_url);
            resource.extension = extension;
            if (!extensions.includes(extension)) {
                fetch(resource.resource_url)
                    .then(res => {
                        extension = this.getExtensionByType(
                            res?.headers?.map['content-type'],
                        );
                        this.setState({
                            resources: this.state.resources.map(r =>
                                r.resource_id === resource.resource_id
                                    ? {
                                          ...r,
                                          extension,
                                          wasWithoutExtension: true,
                                      }
                                    : r,
                            ),
                        });
                    })
                    .catch(e => {});
            } else {
                this.setState({
                    resources: this.state.resources.map(r =>
                        r.resource_id === resource.resource_id
                            ? {...r, extension}
                            : r,
                    ),
                });
            }
        });
    }

    decideExtension = url => {
        const lastDot = url.lastIndexOf('.');
        const extension = url.substr(lastDot + 1).toLowerCase();

        return extension;
    };

    getExtensionByType = path => {
        if (path === 'audio/mp3') return 'mp3';
        if (path === 'application/pdf') return 'pdf';
        if (path === 'application/zip') return 'zip';
    };

    fetchComments = async id => {
        this.setState({commentsLoading: true});

        let comments = await commentsService.getComments(
            id || this.state.id,
            this.state.commentSort,
            10,
        );
        this.allCommentsNum = comments.meta.totalResults;
        await this.setState({commentsLoading: false, comments: comments.data});
    };

    switchLesson(id, url) {
        this.setState(
            {
                id,
                url,
                isLoadingAll: true,
                assignmentList: [],
                relatedLessons: [],
                resources: null,
                selectedAssignment: null,
            },
            () => this.getContent(),
        );
    }

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

    likeComment = async id => {
        let comments = [...this.state.comments];
        let comment = comments?.find(f => f.id === id);
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
            this.allCommentsNum = comments.meta.totalResults;
            this.setState({comment: '', comments: comments.data});

            this.textInputRef.blur();
        }
    };

    deleteComment = id => {
        let {comments} = this.state;
        this.allCommentsNum -= 1;
        this.setState({
            comments: comments.filter(c => c.id !== id),
            showReplies: false,
        });
        commentsService.deleteComment(id);
    };

    mapComments() {
        return this.state.comments.map((comment, index) => {
            return (
                <View
                    key={index}
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
                                                        fontFamily: 'OpenSans-Regular',
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
                                                        fontFamily: 'OpenSans-Regular',
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

    async onResetProgress() {
        let {selectedAssignment, id} = this.state;
        id = selectedAssignment ? selectedAssignment.id : id;
        let res = await resetProgress(id);
        this.setState(state => ({
            showRestartCourse: false,
            selectedAssignment: state.selectedAssignment
                ? {...state.selectedAssignment, progress: 0}
                : undefined,
            assignmentList: !selectedAssignment
                ? state.assignmentList.map(a => ({
                      ...a,
                      progress: 0,
                  }))
                : state.assignmentList.map(a =>
                      a.id === id
                          ? {
                                ...a,
                                progress: 0,
                            }
                          : a,
                  ),
            progress: !selectedAssignment
                ? 0
                : res.type !== 'course'
                ? res.user_progress[0]?.progress_percent
                : state.progress,
        }));
    }

    async onComplete(id) {
        let incompleteAssignments;
        let {assignmentList, nextLesson, nextUnit} = this.state;
        if (id !== this.state.id) {
            incompleteAssignments = assignmentList.filter(
                a => a.progress !== 100 && a.id !== id,
            ).length;
            this.setState(state => ({
                showAssignmentComplete: incompleteAssignments ? true : false,
                showLessonComplete:
                    !incompleteAssignments && (nextLesson || nextUnit)
                        ? true
                        : false,
                showOverviewComplete:
                    !incompleteAssignments && !nextLesson && !nextUnit
                        ? true
                        : false,
                progress: incompleteAssignments ? state.progress : 100,
                selectedAssignment: {
                    ...this.state.selectedAssignment,
                    progress: 100,
                },
                assignmentList: state.assignmentList.map(a =>
                    a.id === id
                        ? {
                              ...a,
                              progress: 100,
                          }
                        : a,
                ),
            }));
        } else {
            this.setState(state => ({
                showLessonComplete: nextLesson || nextUnit ? true : false,
                showOverviewComplete: nextLesson || nextUnit ? false : true,
                progress: 100,
                assignmentList: state.assignmentList.map(a => ({
                    ...a,
                    progress: 100,
                })),
            }));
        }
        let res = await markComplete(id);
        if (res?.parent[0]) {
            this.setState({
                progress: res.parent[0].progress_percent,
            });
        }
    }

    likeOrDislikeLesson = () => {
        if (this.state.isLiked) {
            unlikeContent(this.state.id);
        } else {
            likeContent(this.state.id);
        }
        this.setState({
            isLiked: !this.state.isLiked,
            likes: this.state.isLiked
                ? this.state.likes - 1
                : this.state.likes + 1,
        });
    };

    toggleMyList = () => {
        if (this.state.isAddedToMyList) {
            removeFromMyList(this.state.id);
        } else {
            addToMyList(this.state.id);
        }
        this.setState({
            isAddedToMyList: !this.state.isAddedToMyList,
        });
    };

    renderAssignments() {
        return this.state.assignmentList.map((row, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        let assignment = row;
                        assignment.index = index + 1;
                        this.setState({selectedAssignment: assignment});
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
                        {row.progress === 100 ? (
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

    transformDate = date => {
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        try {
            let text =
                monthNames[new Date(date.slice(0, 10)).getMonth()]
                    .toUpperCase()
                    .slice(0, 3) +
                ' ' +
                date.slice(8, 10) +
                ', ' +
                date.slice(0, 4);

            return text;
        } catch (e) {
            return '';
        }
    };

    renderTagsDependingOnContentType = () => {
        let {artist, xp, type, publishedOn, instructor} = this.state;

        let releaseDate = this.transformDate(publishedOn);
        let releaseDateTag = releaseDate ? `${releaseDate} | ` : '';

        let artistTag = artist ? `${artist.toUpperCase()} | ` : '';
        let xpTag = `${xp || 0} XP`;
        switch (type) {
            case 'song-part':
                return artistTag + xpTag;
            case 'song':
                return artistTag + xpTag;
            case 'course-part':
                return instructor + xpTag;
            case 'student-focus':
                return instructor + artistTag + xpTag;
            case 'pack':
                return releaseDateTag + xpTag;
        }
    };

    render() {
        // this.props.navigation.goBack();
        return (
            <View
                style={[
                    styles.container,
                    {backgroundColor: colors.mainBackground},
                ]}
            >
                <StatusBar
                    backgroundColor={'black'}
                    barStyle={'light-content'}
                />
                {!this.state.isLoadingAll &&
                    this.state.video_playback_endpoints && (
                        <Video
                            quality={''}
                            aCasting={''}
                            gCasting={''}
                            offlinePath={''}
                            orientation={''}
                            connection={true}
                            toSupport={() => {}}
                            onRefresh={() => {}}
                            content={this.state}
                            maxFontMultiplier={1}
                            settingsMode={'bottom'}
                            onFullscreen={() => {}}
                            onQualityChange={q => {}}
                            onACastingChange={c => {}}
                            onGCastingChange={c => {}}
                            ref={r => (this.video = r)}
                            onOrientationChange={o => {}}
                            type={false ? 'audio' : 'video'}
                            onUpdateVideoProgress={() => {}}
                            onBack={this.props.navigation.goBack}
                            goToNextLesson={() =>
                                this.switchLesson(
                                    this.state.nextLesson.id,
                                    this.state.nextLesson.post.mobile_app_url,
                                )
                            }
                            goToPreviousLesson={() =>
                                this.switchLesson(
                                    this.state.previousLesson.id,
                                    this.state.previousLesson.post
                                        .mobile_app_url,
                                )
                            }
                            styles={{
                                timerCursorBackground: colors.pianoteRed,
                                beforeTimerCursorBackground: colors.pianoteRed,
                                settings: {
                                    cancel: {
                                        color: 'black',
                                    },
                                    separatorColor: 'rgb(230, 230, 230)',
                                    background: 'white',
                                    optionsBorderColor: 'rgb(230, 230, 230)',
                                    downloadIcon: {
                                        width: 20,
                                        height: 20,
                                        fill: colors.pianoteRed,
                                    },
                                },
                                //   alert: {
                                //     background: 'purple',
                                //     titleTextColor: 'blue',
                                //     subtitleTextColor: 'green',
                                //     reloadLesson: {color: 'green', background: 'blue'},
                                //     contactSupport: {color: 'green', background: 'blue'},
                                //   },
                            }}
                        />
                    )}
                {!this.state.isLoadingAll ? (
                    <View
                        key={'container2'}
                        style={{
                            height: fullHeight - navHeight,
                            alignSelf: 'stretch',
                            backgroundColor: colors.mainBackground,
                        }}
                    >
                        <View key={'belowVideo'} style={{flex: 1}}>
                            {this.state.selectedAssignment ? (
                                <VideoPlayerSong
                                    assignment={this.state.selectedAssignment}
                                    onAssignmentFullscreen={() =>
                                        this.setState({
                                            showVideo: !this.state.showVideo,
                                        })
                                    }
                                    onX={() =>
                                        this.setState({
                                            selectedAssignment: null,
                                        })
                                    }
                                    onCompleteAssignment={() => {
                                        if (
                                            this.state.selectedAssignment
                                                .progress === 100
                                        ) {
                                            this.setState({
                                                showRestartCourse: true,
                                            });
                                        } else {
                                            this.onComplete(
                                                this.state.selectedAssignment
                                                    .id,
                                            );
                                        }
                                    }}
                                />
                            ) : (
                                <KeyboardAwareScrollView
                                    innerRef={ref => {
                                        this.scroll = ref;
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    contentInsetAdjustmentBehavior={'never'}
                                    style={{
                                        flex: 1,
                                        backgroundColor: colors.mainBackground,
                                    }}
                                >
                                    <>
                                        <View
                                            style={{
                                                height: 2.5 * factorVertical,
                                            }}
                                        />
                                        <View key={'lessonTitle'}>
                                            <View
                                                style={{
                                                    height: fullHeight * 0.015,
                                                }}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 20 * factorRatio,
                                                    fontWeight: 'bold',
                                                    fontFamily: 'OpenSans-Regular',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                {this.state.lessonTitle}
                                            </Text>
                                            <View
                                                style={{
                                                    height: fullHeight * 0.01,
                                                }}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 12 * factorRatio,
                                                    fontWeight: '400',
                                                    color: 'grey',
                                                    fontFamily: 'OpenSans-Regular',
                                                    textAlign: 'center',
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                {this.renderTagsDependingOnContentType()}
                                            </Text>
                                            <View
                                                style={{
                                                    height: fullHeight * 0.015,
                                                }}
                                            />
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
                                                    justifyContent:
                                                        'space-around',
                                                    alignContent:
                                                        'space-around',
                                                }}
                                            >
                                                <TouchableOpacity
                                                    key={'like'}
                                                    onPress={
                                                        this.likeOrDislikeLesson
                                                    }
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
                                                        size={
                                                            27.5 * factorRatio
                                                        }
                                                        color={
                                                            colors.pianoteRed
                                                        }
                                                    />
                                                    <View
                                                        style={{
                                                            height:
                                                                5 *
                                                                factorVertical,
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {this.state.likes}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    key={'list'}
                                                    onPress={this.toggleMyList}
                                                    style={{
                                                        flex: 1,
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <AntIcon
                                                        name={
                                                            this.state
                                                                .isAddedToMyList
                                                                ? 'close'
                                                                : 'plus'
                                                        }
                                                        size={
                                                            27.5 * factorRatio
                                                        }
                                                        color={
                                                            colors.pianoteRed
                                                        }
                                                    />
                                                    <View
                                                        style={{
                                                            height:
                                                                5 *
                                                                factorVertical,
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {this.state
                                                            .isAddedToMyList
                                                            ? 'Added'
                                                            : 'My List'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {this.state.resources && (
                                                    <TouchableOpacity
                                                        key={'resource'}
                                                        onPress={() =>
                                                            this.setState({
                                                                showResDownload: true,
                                                            })
                                                        }
                                                        style={{
                                                            flex: 1,
                                                            alignItems:
                                                                'center',
                                                        }}
                                                    >
                                                        <Resources
                                                            height={
                                                                27.5 *
                                                                factorRatio
                                                            }
                                                            width={
                                                                27.5 *
                                                                factorRatio
                                                            }
                                                            fill={
                                                                colors.pianoteRed
                                                            }
                                                        />
                                                        <View
                                                            style={{
                                                                height:
                                                                    7.5 *
                                                                    factorVertical,
                                                            }}
                                                        />
                                                        <Text
                                                            style={{
                                                                textAlign:
                                                                    'center',
                                                                fontSize:
                                                                    12 *
                                                                    factorRatio,
                                                                color: 'white',
                                                            }}
                                                        >
                                                            Resources
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                                <TouchableOpacity
                                                    key={'download'}
                                                    onPress={() => {}}
                                                    style={{
                                                        flex: 1,
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <MaterialIcon
                                                        name={
                                                            'arrow-collapse-down'
                                                        }
                                                        size={
                                                            27.5 * factorRatio
                                                        }
                                                        color={
                                                            colors.pianoteRed
                                                        }
                                                    />
                                                    <View
                                                        style={{
                                                            height:
                                                                5 *
                                                                factorVertical,
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
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
                                                            showInfo: !this
                                                                .state.showInfo,
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
                                                        size={
                                                            27.5 * factorRatio
                                                        }
                                                        color={
                                                            colors.pianoteRed
                                                        }
                                                    />
                                                    <View
                                                        style={{
                                                            height:
                                                                5 *
                                                                factorVertical,
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
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
                                                        style={{
                                                            height:
                                                                fullHeight *
                                                                0.03,
                                                        }}
                                                    />
                                                    <Text
                                                        style={{
                                                            paddingLeft: '5%',
                                                            paddingRight: '5%',
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            fontSize:
                                                                14 *
                                                                factorRatio,
                                                            textAlign: 'center',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {this.state.description}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <View
                                            key={'buffer'}
                                            style={{
                                                height:
                                                    this.state.type !== 'song'
                                                        ? 20 * factorVertical
                                                        : 10 * factorVertical,
                                            }}
                                        />
                                        {this.state.assignmentList?.length >
                                            0 && (
                                            <>
                                                <View
                                                    key={'assingmentsHeader'}
                                                    style={{
                                                        paddingLeft:
                                                            fullWidth * 0.035,
                                                    }}
                                                >
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
                                                        ASSIGNMENTS
                                                    </Text>
                                                    <View
                                                        style={{
                                                            height:
                                                                20 *
                                                                factorVertical,
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
                                        <View
                                            style={{
                                                height: 20 * factorVertical,
                                            }}
                                        />
                                        {this.state.relatedLessons.length >
                                            0 && (
                                            <View
                                                key={'videoList'}
                                                style={{
                                                    minHeight: fullHeight * 0.5,
                                                }}
                                            >
                                                <VerticalVideoList
                                                    title={'RELATED LESSONS'}
                                                    items={
                                                        this.state
                                                            .relatedLessons
                                                    }
                                                    type={'LESSONS'}
                                                    isLoading={
                                                        this.state.isLoadingAll
                                                    }
                                                    showTitleOnly={true}
                                                    showFilter={true}
                                                    showType={false}
                                                    showArtist={false}
                                                    showSort={false}
                                                    showLength={true}
                                                    imageRadius={
                                                        5 * factorRatio
                                                    }
                                                    containerBorderWidth={0}
                                                    containerWidth={fullWidth}
                                                    containerHeight={
                                                        this.state.type !==
                                                        'song'
                                                            ? onTablet
                                                                ? fullHeight *
                                                                  0.15
                                                                : Platform.OS ==
                                                                  'android'
                                                                ? fullHeight *
                                                                  0.115
                                                                : fullHeight *
                                                                  0.0925
                                                            : fullWidth * 0.22
                                                    }
                                                    imageHeight={
                                                        this.state.type !==
                                                        'song'
                                                            ? onTablet
                                                                ? fullHeight *
                                                                  0.12
                                                                : Platform.OS ==
                                                                  'android'
                                                                ? fullHeight *
                                                                  0.09
                                                                : fullHeight *
                                                                  0.08
                                                            : fullWidth * 0.175
                                                    }
                                                    imageWidth={
                                                        this.state.type !==
                                                        'song'
                                                            ? fullWidth * 0.26
                                                            : fullWidth * 0.175
                                                    }
                                                    navigator={row =>
                                                        this.switchLesson(
                                                            row.id,
                                                            row.mobile_app_url,
                                                        )
                                                    }
                                                />
                                            </View>
                                        )}
                                        <View
                                            style={{
                                                height: 10 * factorVertical,
                                            }}
                                        />
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
                                                            minHeight:
                                                                fullHeight *
                                                                0.4,
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
                                                                        fullHeight *
                                                                        0.025,
                                                                }}
                                                            />
                                                            <View
                                                                key={
                                                                    'commentHeader'
                                                                }
                                                                style={{
                                                                    width: fullWidth,
                                                                    flexDirection:
                                                                        'row',
                                                                    paddingLeft:
                                                                        fullWidth *
                                                                        0.05,
                                                                    paddingRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                }}
                                                            >
                                                                <View>
                                                                    <View
                                                                        style={{
                                                                            flex: 1,
                                                                        }}
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
                                                                        {this
                                                                            .state
                                                                            .isReply
                                                                            ? 'REPLIES'
                                                                            : this
                                                                                  .allCommentsNum +
                                                                              ' COMMENTS'}
                                                                    </Text>
                                                                    <View
                                                                        style={{
                                                                            flex: 1,
                                                                        }}
                                                                    />
                                                                </View>
                                                                <View
                                                                    style={{
                                                                        flex: 1,
                                                                    }}
                                                                />
                                                                {this.state
                                                                    .isReply && (
                                                                    <TouchableOpacity
                                                                        onPress={() => {}}
                                                                    >
                                                                        <EntypoIcon
                                                                            size={
                                                                                27.5 *
                                                                                factorRatio
                                                                            }
                                                                            name={
                                                                                'cross'
                                                                            }
                                                                            color={
                                                                                '#c2c2c2'
                                                                            }
                                                                        />
                                                                    </TouchableOpacity>
                                                                )}
                                                                {!this.state
                                                                    .isReply && (
                                                                    <TouchableOpacity
                                                                        style={{
                                                                            marginLeft:
                                                                                factorHorizontal *
                                                                                10,
                                                                        }}
                                                                        onPress={() => {
                                                                            this.setState(
                                                                                {
                                                                                    showCommentSort: true,
                                                                                },
                                                                            );
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
                                                                <View
                                                                    style={{
                                                                        flex: 0.1,
                                                                    }}
                                                                />
                                                            </View>
                                                            <View
                                                                style={{
                                                                    flex: 1.25,
                                                                }}
                                                            />
                                                            {this.state
                                                                .isReply && (
                                                                <View
                                                                    key={
                                                                        'originalReply'
                                                                    }
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
                                                                            Lorem
                                                                            ipsum
                                                                            dolor
                                                                            sit
                                                                            smart
                                                                            cosaf
                                                                            adiffdsf
                                                                            eli,
                                                                            prascent
                                                                            quie
                                                                            eros
                                                                            magnia.
                                                                            Etrian
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
                                                                            user
                                                                            |
                                                                            rank
                                                                            |
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
                                                                                VIEW
                                                                                REPLIES
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            )}
                                                            <View
                                                                key={
                                                                    'addComment'
                                                                }
                                                                style={{
                                                                    width: fullWidth,
                                                                    height:
                                                                        fullHeight *
                                                                        0.1,
                                                                    flexDirection:
                                                                        'row',
                                                                    paddingLeft:
                                                                        fullWidth *
                                                                        0.05,
                                                                }}
                                                            >
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        this.setState(
                                                                            {
                                                                                showMakeComment: true,
                                                                            },
                                                                        ),
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
                                                                        key={
                                                                            'profileImage'
                                                                        }
                                                                        style={{
                                                                            height:
                                                                                '100%',
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
                                                                        key={
                                                                            'addComment'
                                                                        }
                                                                        style={{
                                                                            height:
                                                                                '100%',
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
                                                                            Add
                                                                            a
                                                                            comment...
                                                                        </Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View
                                                                style={{
                                                                    flex: 1,
                                                                }}
                                                            />
                                                        </View>
                                                        {this.mapComments()}
                                                    </View>
                                                    <View
                                                        style={{
                                                            height:
                                                                fullHeight *
                                                                0.035,
                                                        }}
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    </>
                                </KeyboardAwareScrollView>
                            )}
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
                                            borderTopColor:
                                                colors.secondBackground,
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
                                            backgroundColor:
                                                colors.mainBackground,
                                            color: colors.secondBackground,
                                        }}
                                        onSubmitEditing={() => {
                                            this.makeComment();
                                            this.textInputRef.clear();
                                        }}
                                        returnKeyType={'go'}
                                        onChangeText={comment =>
                                            this.setState({comment})
                                        }
                                        onBlur={() => this.textInputRef.clear()}
                                        placeholder={'Add a comment'}
                                        placeholderTextColor={
                                            colors.secondBackground
                                        }
                                    />
                                    <View
                                        style={{height: 10 * factorVertical}}
                                    />
                                </View>
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            flex: 1,
                                            borderTopWidth: 0.5 * factorRatio,
                                            borderTopColor:
                                                colors.secondBackground,
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
                        {!this.state.selectedAssignment && (
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
                                    },
                                ]}
                            >
                                <View style={{flexDirection: 'row'}}>
                                    <View
                                        style={{
                                            width:
                                                (fullWidth *
                                                    this.state.progress) /
                                                100,
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
                                                borderColor: this.state
                                                    .previousLesson
                                                    ? colors.pianoteRed
                                                    : colors.secondBackground,
                                            }}
                                        >
                                            <TouchableOpacity
                                                disabled={
                                                    !this.state.previousLesson
                                                        ?.id
                                                }
                                                onPress={() =>
                                                    this.switchLesson(
                                                        this.state
                                                            .previousLesson.id,
                                                        this.state
                                                            .previousLesson.post
                                                            .mobile_app_url,
                                                    )
                                                }
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
                                                    color={
                                                        this.state
                                                            .previousLesson
                                                            ? colors.pianoteRed
                                                            : colors.secondBackground
                                                    }
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
                                            onPress={() => {
                                                if (
                                                    this.state.progress === 100
                                                ) {
                                                    this.setState({
                                                        showRestartCourse: true,
                                                    });
                                                } else {
                                                    this.onComplete(
                                                        this.state.id,
                                                    );
                                                }
                                            }}
                                            style={[
                                                styles.centerContent,
                                                {
                                                    height: fullWidth * 0.1,
                                                    width: fullWidth * 0.6,
                                                    borderRadius: 100,
                                                    backgroundColor:
                                                        colors.pianoteRed,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily:
                                                        'RobotoCondensed-Bold',
                                                    fontSize: 14 * factorRatio,
                                                }}
                                            >
                                                {this.state.progress === 100
                                                    ? 'COMPLETED'
                                                    : 'COMPLETE LESSON'}
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
                                                borderColor: this.state
                                                    .nextLesson
                                                    ? colors.pianoteRed
                                                    : colors.secondBackground,
                                            }}
                                        >
                                            <TouchableOpacity
                                                disabled={
                                                    !this.state.nextLesson?.id
                                                }
                                                onPress={() =>
                                                    this.switchLesson(
                                                        this.state.nextLesson
                                                            .id,
                                                        this.state.nextLesson
                                                            .post
                                                            .mobile_app_url,
                                                    )
                                                }
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
                                                    color={
                                                        this.state.nextLesson
                                                            ? colors.pianoteRed
                                                            : colors.secondBackground
                                                    }
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                ) : (
                    <ActivityIndicator
                        size='large'
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        color={colors.pianoteRed}
                    />
                )}

                {this.state.selectedAssignment && (
                    <Modal
                        key={'assignmentComplete'}
                        isVisible={this.state.showAssignmentComplete}
                        style={[
                            {
                                margin: 0,
                                height: fullHeight,
                                width: fullWidth,
                            },
                        ]}
                        animation={'slideInUp'}
                        animationInTiming={250}
                        animationOutTiming={250}
                        coverScreen={false}
                        hasBackdrop={false}
                    >
                        <AssignmentComplete
                            title={this.state.selectedAssignment.title}
                            xp={this.state.selectedAssignment.xp}
                            hideAssignmentComplete={() => {
                                this.setState({showAssignmentComplete: false});
                            }}
                        />
                    </Modal>
                )}
                <Modal
                    key={'resourceDownload'}
                    isVisible={this.state.showResDownload}
                    onDismiss={() => this.modalDismissed()}
                    style={[
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                            justifyContent: 'flex-end',
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <DownloadResources
                        resources={this.state.resources}
                        onClose={() => {
                            new Promise(res =>
                                this.setState(
                                    {
                                        showResDownload: false,
                                    },
                                    () =>
                                        Platform.OS === 'ios'
                                            ? (this.modalDismissed = res)
                                            : res(),
                                ),
                            );
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
                {!this.state.isLoadingAll && (
                    <>
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
                                completedLessonImg={this.state.lessonImage}
                                completedLessonTitle={this.state.lessonTitle}
                                completedLessonXp={this.state.xp}
                                nextLesson={
                                    this.state.nextLesson || this.state.nextUnit
                                }
                                hideLessonComplete={() => {
                                    this.setState({showLessonComplete: false});
                                }}
                                onGoToNext={() => {
                                    this.setState({showLessonComplete: false});
                                    if (this.state.nextLesson) {
                                        this.switchLesson(
                                            this.state.nextLesson.id,
                                            this.state.nextLesson.post
                                                .mobile_app_url,
                                        );
                                    } else if (this.state.nextUnit) {
                                        console.log(
                                            this.state.nextUnit.post
                                                .mobile_app_url,
                                        );
                                        this.props.navigation.dispatch(
                                            StackActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({
                                                        routeName:
                                                            'FOUNDATIONSLEVEL',

                                                        params: {
                                                            url: this.state
                                                                .nextUnit.post
                                                                .mobile_app_url,
                                                        },
                                                    }),
                                                ],
                                            }),
                                        );
                                    }
                                }}
                            />
                        </Modal>
                        <Modal
                            key={'restartCourse'}
                            isVisible={this.state.showRestartCourse}
                            style={[
                                styles.centerContent,
                                {
                                    height: fullHeight,
                                    width: fullWidth,
                                    elevation: 5,
                                    margin: 0,
                                },
                            ]}
                            animation={'slideInUp'}
                            animationInTiming={350}
                            animationOutTiming={350}
                            coverScreen={false}
                            hasBackdrop={false}
                        >
                            <RestartCourse
                                hideRestartCourse={() => {
                                    this.setState({
                                        showRestartCourse: false,
                                    });
                                }}
                                type={
                                    this.state.selectedAssignment
                                        ? 'assignment'
                                        : this.state.type
                                }
                                onRestart={() => this.onResetProgress()}
                            />
                        </Modal>
                        <Modal
                            key={'overviewComplete'}
                            isVisible={this.state.showOverviewComplete}
                            style={{
                                margin: 0,
                                height: fullHeight,
                                width: fullWidth,
                            }}
                            animation={'slideInUp'}
                            animationInTiming={250}
                            animationOutTiming={250}
                            coverScreen={true}
                            hasBackdrop={true}
                        >
                            <OverviewComplete
                                title={this.state.lessonTitle}
                                xp={this.state.xp}
                                type={this.state.type}
                                hideOverviewComplete={() => {
                                    this.setState({
                                        showOverviewComplete: false,
                                    });
                                }}
                                onGoToNext={() => {}}
                            />
                        </Modal>
                    </>
                )}

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
                        changeSort={commentSort => {
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
