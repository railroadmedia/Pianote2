/**
 * VideoPlayer
 */
import React from 'react';
import {
  View,
  Text,
  Platform,
  Animated,
  StatusBar,
  TextInput,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import moment from 'moment';
import Video from 'RNVideoEnhanced';
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import { Download_V2, offlineContent, DownloadResources } from 'RNDownload';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Replies from '../../components/Replies';
import SoundSlice from '../../components/SoundSlice';
import VerticalVideoList from '../../components/VerticalVideoList';

import CommentSort from '../../modals/CommentSort';
import CustomModal from '../../modals/CustomModal';
import RestartCourse from '../../modals/RestartCourse';
import LessonComplete from '../../modals/LessonComplete';
import OverviewComplete from '../../modals/OverviewComplete';
import AssignmentComplete from '../../modals/AssignmentComplete';

import contentService from '../../services/content.service';
import commentsService from '../../services/comments.service';
import {
  likeContent,
  addToMyList,
  markComplete,
  unlikeContent,
  resetProgress,
  removeFromMyList,
  getMediaSessionId,
  updateUsersVideoProgress
} from '../../services/UserActions';

import ArrowLeft from 'Pianote2/src/assets/img/svgs/arrowLeft';
import Resources from 'Pianote2/src/assets/img/svgs/resources';

import VideoPlayerSong from './VideoPlayerSong';

import { NetworkContext } from '../../context/NetworkProvider';
import methodService from '../../services/method.service';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class VideoPlayer extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.limit = 10;
    this.allCommentsNum = 0;
    this.state = {
      id: this.props.navigation.state.params.id,
      url: this.props.navigation.state.params.url,
      commentId: '',
      commentSort: 'Popular', // Newest, Oldest, Mine, Popular
      profileImage: '',
      isLoadingAll: true,
      selectedComment: undefined,
      showAssignment: false,
      showCommentSort: false,
      showSoundSlice: false,
      showMakeComment: false,
      showInfo: false,
      isLoadingComm: false,
      showAssignmentComplete: false,
      showOverviewComplete: false,
      showQualitySettings: false,
      showLessonComplete: false,
      showResDownload: false,
      showVideo: true,
      makeCommentVertDelta: new Animated.Value(0.01),
      comments: [],
      outComments: false,
      relatedLessons: [],
      likes: 0,
      videoId: 0,
      isStarted: false,
      isLiked: false,
      isAddedToMyList: false,
      artist: null,
      instructor: null,
      nextLesson: null,
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
      reply: '',
      makeReply: false
    };
  }

  componentDidMount = async () => {
    // get profile image
    this.limit = 10;
    let storage = await Promise.all([
      AsyncStorage.getItem('userId'),
      AsyncStorage.getItem('profileURI')
    ]);
    if (storage[1]) this.setState({ profileImage: storage[1] });
    this.userId = JSON.parse(storage[0]);
    this.getContent();
  };

  getContent = async () => {
    let content, comments;
    if (!this.context.isConnected) {
      content =
        offlineContent[this.state.id]?.lesson ||
        offlineContent[
          this.props.navigation.state.params.parentId
        ]?.overview.lessons.find(l => l.id === this.state.id);
      comments = content.comments;
      this.allCommentsNum = comments.length;
    } else {
      let result;
      if (this.props.navigation.state.params.url) {
        result = await methodService.getMethodContent(this.state.url);
      } else {
        result = await contentService.getContent(this.state.id);
      }
      if (result.title && result.message) {
        return this.alert.toggle(result.title, result.message);
      }
      content = result;
      this.allCommentsNum = result.total_comments;
    }
    content = new ContentModel(content);
    let relatedLessons = content.post.related_lessons?.map(rl => {
      return new ContentModel(rl);
    });
    let al = [];
    if (content.post.assignments) {
      let assignments = content.post.assignments.map(assignment => {
        return new ContentModel(assignment);
      });

      for (let a in assignments) {
        al.push({
          id: assignments[a].id,
          title: assignments[a].getField('title'),
          isCompleted: assignments[a].isCompleted,
          description: assignments[a]
            .getData('description')
            .replace(/(<([^>]+)>)/g, '')
            .replace(/&nbsp;/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&#039;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<'),
          xp: assignments[a].xp,
          progress: assignments[a].post.progress_percent,
          slug: assignments[a].post.fields?.find(
            f => f.key === 'soundslice_slug'
          )?.value,
          timeCodes: assignments[a].post.data
            .filter(d => d.key === 'timecode')
            .map(tc => ({ value: tc.value })),
          sheets:
            assignments[a].post.data
              .filter(d => d.key === 'sheet_music_image_url')
              .map(s => ({
                value: s.value,
                id: s.id,
                whRatio: s.whRatio
              })) || []
        });
      }
    }
    let rl = [];
    if (relatedLessons) {
      for (let i in relatedLessons) {
        let duration = relatedLessons[i].post.fields?.find(
          f => f.key === 'video'
        )
          ? new ContentModel(
              relatedLessons[i].getFieldMulti('video')[0]
            )?.getField('length_in_seconds')
          : 0;
        rl.push({
          title: relatedLessons[i].getField('title'),
          thumbnail: relatedLessons[i].getData('thumbnail_url'),
          type: relatedLessons[i].type,
          id: relatedLessons[i].id,
          mobile_app_url: relatedLessons[i].post.mobile_app_url,
          duration: duration < 60 ? 60 : duration,
          isAddedToList: relatedLessons[i].isAddedToList,
          isStarted: relatedLessons[i].isStarted,
          isCompleted: relatedLessons[i].isCompleted,
          progress_percent: relatedLessons[i].post.progress_percent
        });
      }
    }
    let youtubeId = content.post.fields
      ?.find(f => f.key === 'video')
      ?.value?.fields?.find(f => f.key === 'youtube_video_id')?.value;
    this.setState(
      {
        youtubeId,
        comments: content.post.comments,
        id: content.id,
        url: content.post.mobile_app_url,
        type: content.type,
        videoId: content.post.fields?.find(f => f.key === 'video')
          ? youtubeId
            ? new ContentModel(content.getFieldMulti('video')[0])?.getField(
                'youtube_video_id'
              )
            : new ContentModel(content.getFieldMulti('video')[0])?.getField(
                'vimeo_video_id'
              )
          : -1,
        lessonImage: content.getData('thumbnail_url'),
        lessonTitle: content.getField('title'),
        style:
          content.post.type === 'song-part' && content.post.parent
            ? `${new ContentModel(content.post.parent)
                .getField('style')
                .toUpperCase()} | `
            : '',
        description:
          content.post.type === 'song-part' && content.post.parent
            ? new ContentModel(content.post.parent)
                .getField('instructor')
                ?.data?.find(d => d.key === 'biography')?.value
            : content
                .getData('description')
                .replace(/(<([^>]+)>)/g, '')
                .replace(/&nbsp;/g, '')
                .replace(/&amp;/g, '&')
                .replace(/&#039;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<'),
        xp: content.post.total_xp,
        artist:
          content.post.type === 'song-part' && content.post.parent
            ? new ContentModel(content.post.parent).getField('artist')
            : content.getField('artist'),
        instructor:
          content.post.type === 'learning-path-level'
            ? content.post.instructors
            : content.post.type === 'course-part' && content.post.parent
            ? new ContentModel(content.post.parent).getFieldMulti('instructor')
            : content.getFieldMulti('instructor'),
        isLoadingAll: false,
        publishedOn: content.publishedOn,
        relatedLessons: rl,
        likes: parseInt(content.likeCount),
        isLiked: content.post.is_liked_by_current_user,
        lengthInSec: content.post.fields?.find(f => f.key === 'video')
          ? new ContentModel(content.getFieldMulti('video')[0])?.getField(
              'length_in_seconds'
            )
          : 0,
        lastWatchedPosInSec: content.post.last_watch_position_in_seconds,
        progress:
          parseInt(
            Object.values(content.post.user_progress)?.[0].progress_percent
          ) || 0,
        isAddedToMyList: content.isAddedToList,
        isStarted: content.isStarted,
        assignmentList: al,
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
        previousLessonUrl: content?.post?.previous_lesson?.mobile_app_url,
        resources:
          content.post.resources && content.post.resources.length > 0
            ? Object.keys(content.post.resources).map(key => {
                return content.post.resources[key];
              })
            : undefined
      },
      async () => {
        if (this.state.resources) this.createResourcesArr();
        if (!this.state.video_playback_endpoints && !this.state.youtubeId) {
          this.alert.toggle(
            `We're sorry, there was an issue loading this video, try reloading the lesson.`,
            `If the problem persists please contact support.`
          );
        }
        const { comment, commentId } = this.props.navigation.state.params;
        if (comment)
          this.replies.toggle(() =>
            this.setState({ selectedComment: comment })
          );
        else if (commentId) {
          const comments = (
            await commentsService.getComments(this.state.id, 'Mine')
          ).data;
          const selectedComment = comments?.find(f => f.id == commentId);
          if (selectedComment)
            this.replies.toggle(() => this.setState({ selectedComment }));
        }
      }
    );
  };

  createResourcesArr() {
    const { resources } = this.state;
    const extensions = ['mp3', 'pdf', 'zip'];

    resources.forEach(resource => {
      let extension = this.decideExtension(resource.resource_url);
      resource.extension = extension;
      if (!extensions.includes(extension)) {
        fetch(resource.resource_url)
          .then(res => {
            extension = this.getExtensionByType(
              res?.headers?.map['content-type']
            );
            this.setState({
              resources: this.state.resources.map(r =>
                r.resource_id === resource.resource_id
                  ? {
                      ...r,
                      extension,
                      wasWithoutExtension: true
                    }
                  : r
              )
            });
          })
          .catch(e => {});
      } else {
        this.setState({
          resources: this.state.resources.map(r =>
            r.resource_id === resource.resource_id ? { ...r, extension } : r
          )
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
    let comments = await commentsService.getComments(
      id || this.state.id,
      this.state.commentSort,
      this.limit
    );

    this.allCommentsNum = comments.meta.totalResults;
    this.setState(state => ({
      comments:
        this.limit === 10 ? comments.data : state.comments.concat(comments.data)
    }));
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 40;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  loadMoreComments = () => {
    if (this.limit < this.allCommentsNum) {
      this.limit += 10;
      this.fetchComments();
    }
  };

  resetState(id, url) {
    this.setState(
      {
        id,
        url,
        isLoadingAll: true,
        resources: null,
        selectedAssignment: null
      },
      () => this.getContent()
    );
  }

  switchLesson(id, url) {
    if (!this.context.isConnected)
      if (
        offlineContent[id]?.lesson ||
        offlineContent[
          this.props.navigation.state.params.parentId
        ]?.overview.lessons.find(l => l.id === id)
      )
        this.resetState(id, url);
      else this.context.showNoConnectionAlert();
    else this.resetState(id, url);
  }

  likeComment = async id => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
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
      this.setState({ comments });
    }
  };

  makeComment = async () => {
    if (!this.state.comment) return this.setState({ showMakeComment: false });
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState({ comment: '', isLoadingComm: true, showMakeComment: false });
    commentsService
      .addComment(encodeURIComponent(this.state.comment), this.state.id)
      .then(r =>
        this.setState(({ comments }) => ({
          isLoadingComm: false,
          comments: [r.data[0], ...comments]
        }))
      );
  };

  deleteComment = id => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let { comments } = this.state;
    this.allCommentsNum -= 1;
    this.setState({
      comments: comments.filter(c => c.id !== id)
    });
    commentsService.deleteComment(id);
  };

  mapComments() {
    return this.state.comments.map((item, index) => (
      <View
        key={index}
        style={{
          backgroundColor: colors.mainBackground,
          borderTopColor: colors.secondBackground,
          flex: 1,
          borderTopWidth: 0.25,
          flexDirection: 'row',
          paddingTop: 10 * factor,
          paddingBottom: 0 * factor,
          paddingHorizontal: 10 * factor
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingBottom: 10 * factor
          }}
        >
          <FastImage
            style={{
              height: (onTablet ? 30 : 40) * factor,
              width: (onTablet ? 30 : 40) * factor,
              borderRadius: 100,
              marginTop: 10 * factor
            }}
            source={{
              uri: item.user['fields.profile_picture_image_url']
            }}
            resizeMode={FastImage.resizeMode.stretch}
          />
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: onTablet ? 15 : 10 * factor,
              marginTop: 5 * factor,
              fontWeight: 'bold',
              color: colors.pianoteGrey
            }}
          >
            {this.changeXP(item.user.xp)}
          </Text>
        </View>

        <View style={{ flex: 1, paddingLeft: paddingInset }}>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: (onTablet ? 10 : 13) * factor,
              color: 'white',
              paddingTop: 10 * factor
            }}
          >
            {item.comment}
          </Text>

          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: (onTablet ? 9 : 10) * factor,
              color: colors.secondBackground,
              paddingTop: 5 * factor,
              paddingBottom: 10 * factor
            }}
          >
            {item.user['display_name']} | {item.user.rank} |{' '}
            {moment.utc(item.created_on).local().fromNow()}
          </Text>
          <View
            style={{
              paddingBottom: 15 * factor,
              paddingTop: 5 * factor
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', marginRight: 15 }}>
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => this.likeComment(item.id)}
                >
                  <AntIcon
                    name={item.is_liked ? 'like1' : 'like2'}
                    size={(onTablet ? 15 : 22.5) * factor}
                    color={colors.pianoteRed}
                  />
                </TouchableOpacity>
                {item.like_count > 0 && (
                  <View
                    style={{
                      borderRadius: 40,
                      backgroundColor: colors.notificationColor,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: (onTablet ? 8 : 10) * factor,
                        color: colors.pianoteRed,
                        paddingHorizontal: 5 * factor
                      }}
                    >
                      {item.like_count}{' '}
                      {item.like_count === 1 ? 'LIKE' : 'LIKES'}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    marginRight: 10,
                    marginLeft: -2.5 * factor
                  }}
                  onPress={() =>
                    this.replies.toggle(() =>
                      this.setState({ selectedComment: item })
                    )
                  }
                >
                  <MaterialIcon
                    name={'comment-text-outline'}
                    size={(onTablet ? 15 : 22.5) * factor}
                    color={colors.pianoteRed}
                  />
                </TouchableOpacity>
                {item.replies?.length > 0 && (
                  <View
                    style={{
                      borderRadius: 40,
                      backgroundColor: colors.notificationColor,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: (onTablet ? 8 : 10) * factor,
                        color: colors.pianoteRed,
                        paddingHorizontal: 5 * factor
                      }}
                    >
                      {item.replies?.length}{' '}
                      {item.replies?.length === 1 ? 'REPLY' : 'REPLIES'}
                    </Text>
                  </View>
                )}
              </View>
              {this.userId === item.user_id && (
                <TouchableOpacity
                  style={{ marginLeft: paddingInset }}
                  onPress={() => this.deleteComment(item.id)}
                >
                  <AntIcon
                    name={'delete'}
                    size={20 * factor}
                    color={colors.pianoteRed}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {item.replies?.length !== 0 && (
            <TouchableOpacity
              onPress={() =>
                this.replies.toggle(() =>
                  this.setState({ selectedComment: item })
                )
              }
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: (onTablet ? 9 : 10) * factor,
                  color: colors.secondBackground,
                  marginBottom: 10 * factor
                }}
              >
                VIEW {item.replies?.length}{' '}
                {item.replies?.length === 1 ? 'REPLY' : 'REPLIES'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ));
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

  refresh = () => {
    this.setState({ isLoadingAll: true }, () => {
      this.getContent();
    });
  };

  async onResetProgress() {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let { selectedAssignment, id } = this.state;
    id = selectedAssignment ? selectedAssignment.id : id;
    let res = await resetProgress(id);
    this.setState(state => ({
      showRestartCourse: false,
      selectedAssignment: state.selectedAssignment
        ? { ...state.selectedAssignment, progress: 0 }
        : undefined,
      assignmentList: !selectedAssignment
        ? state.assignmentList.map(a => ({
            ...a,
            progress: 0
          }))
        : state.assignmentList.map(a =>
            a.id === id
              ? {
                  ...a,
                  progress: 0
                }
              : a
          ),
      progress: !selectedAssignment
        ? 0
        : res[0].type !== 'course'
        ? res[0].user_progress?.[this.userId]?.progress_percent
        : state.progress
    }));
  }

  async onComplete(id) {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let incompleteAssignments;
    let { assignmentList, nextLesson } = this.state;
    if (id !== this.state.id) {
      incompleteAssignments = assignmentList.filter(
        a => a.progress !== 100 && a.id !== id
      ).length;
      this.setState(state => ({
        showAssignmentComplete: incompleteAssignments ? true : false,
        showLessonComplete: !incompleteAssignments && nextLesson ? true : false,
        showOverviewComplete:
          !incompleteAssignments && !nextLesson ? true : false,
        progress: incompleteAssignments ? state.progress : 100,
        selectedAssignment: {
          ...this.state.selectedAssignment,
          progress: 100
        },
        assignmentList: state.assignmentList.map(a =>
          a.id === id
            ? {
                ...a,
                progress: 100
              }
            : a
        )
      }));
    } else {
      this.setState(state => ({
        showLessonComplete: nextLesson ? true : false,
        showOverviewComplete: nextLesson ? false : true,
        progress: 100,
        assignmentList: state.assignmentList.map(a => ({
          ...a,
          progress: 100
        }))
      }));
    }
    let res = await markComplete(id);
    if (res?.parent?.[0]) {
      if (res.parent[0].type !== 'course') {
        this.setState({
          progress: res.parent[0].progress_percent
        });
      }
    }
  }

  likeOrDislikeLesson = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.isLiked) {
      unlikeContent(this.state.id);
    } else {
      likeContent(this.state.id);
    }
    this.setState({
      isLiked: !this.state.isLiked,
      likes: this.state.isLiked ? this.state.likes - 1 : this.state.likes + 1
    });
  };

  toggleMyList = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.isAddedToMyList) {
      removeFromMyList(this.state.id);
    } else {
      addToMyList(this.state.id);
    }

    this.setState({
      isAddedToMyList: !this.state.isAddedToMyList
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
            this.setState({ selectedAssignment: assignment });
          }}
          style={{
            paddingHorizontal: 10 * factor,
            paddingVertical: 5,
            borderBottomColor: colors.secondBackground,
            borderBottomWidth: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: (onTablet ? 12 : 16) * factor,
              color: colors.secondBackground,
              fontFamily: 'RobotoCondensed-Bold',
              maxWidth: '90%'
            }}
          >
            {index + 1}. {row.title}
          </Text>

          {row.progress === 100 ? (
            <AntIcon
              name={'checkcircle'}
              size={(onTablet ? 15 : 25) * factor}
              style={{ paddingVertical: 5 }}
              color={colors.pianoteRed}
            />
          ) : (
            <EntypoIcon
              name={'chevron-thin-right'}
              size={(onTablet ? 15 : 20) * factor}
              style={{ paddingVertical: 5 }}
              color={colors.secondBackground}
            />
          )}
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
      'December'
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
    let { artist, xp, type, publishedOn, instructor, style } = this.state;
    let releaseDate = this.transformDate(publishedOn);
    let releaseDateTag = releaseDate ? `${releaseDate} | ` : '';

    let artistTag = artist ? `${artist.toUpperCase()} | ` : '';
    let xpTag = `${xp || 0} XP`;
    let instructorTag = instructor
      ? `${instructor
          .map(i => i.fields.find(f => f.key === 'name').value)
          .join(', ')
          .toUpperCase()} | `
      : '';
    switch (type) {
      case 'song-part':
        return artistTag + style + xpTag;
      case 'song':
        return artistTag + xpTag;
      case 'course-part':
        return instructorTag + xpTag;
      case 'student-focus':
        return instructorTag + artistTag + xpTag;
      case 'pack-bundle-lesson':
        return releaseDateTag + xpTag;
      default:
        return instructorTag + xpTag;
    }
  };

  render() {
    let { id, comments, youtubeId } = this.state;
    return (
      <View
        style={[
          {
            backgroundColor: colors.mainBackground,
            width: '100%',
            height: '100%'
          }
        ]}
      >
        <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
        {this.state.showVideo && (
          <>
            {this.state.isLoadingAll ||
            (!this.state.video_playback_endpoints && !youtubeId) ? (
              <View
                //forceInset={{ top: 'always', bottom: 'never' }}
                style={{ backgroundColor: 'black' }}
              >
                <View style={{ aspectRatio: 16 / 9, justifyContent: 'center' }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={{
                      top: 0,
                      left: 0,
                      padding: 15,
                      position: 'absolute',
                      justifyContent: 'center'
                    }}
                  >
                    <ArrowLeft
                      width={18 * factor}
                      height={18 * factor}
                      fill={'white'}
                    />
                  </TouchableOpacity>
                  <ActivityIndicator size='large' color='#ffffff' />
                </View>
              </View>
            ) : (
              <Video
                youtubeId={youtubeId}
                toSupport={() => {}}
                onRefresh={() => {}}
                content={this.state}
                maxFontMultiplier={1}
                settingsMode={'bottom'}
                onFullscreen={() => {}}
                ref={r => (this.video = r)}
                type={false ? 'audio' : 'video'}
                connection={this.context.isConnected}
                onBack={this.props.navigation.goBack}
                showControls={true}
                paused={true}
                goToNextLesson={() =>
                  this.switchLesson(
                    this.state.nextLesson.id,
                    this.state.nextLesson.post.mobile_app_url
                  )
                }
                goToPreviousLesson={() =>
                  this.switchLesson(
                    this.state.previousLesson.id,
                    this.state.previousLesson.post.mobile_app_url
                  )
                }
                onUpdateVideoProgress={async (
                  videoId,
                  id,
                  lengthInSec,
                  currentTime,
                  mediaCategory
                ) => {
                  if (!this.context.isConnected) return;
                  updateUsersVideoProgress(
                    (
                      await getMediaSessionId(
                        videoId,
                        id,
                        lengthInSec,
                        mediaCategory
                      )
                    )?.session_id.id,
                    currentTime,
                    lengthInSec
                  );
                }}
                styles={{
                  timerCursorBackground: colors.pianoteRed,
                  beforeTimerCursorBackground: colors.pianoteRed,
                  settings: {
                    cancel: {
                      color: 'black'
                    },
                    separatorColor: 'rgb(230, 230, 230)',
                    background: 'white',
                    optionsBorderColor: 'rgb(230, 230, 230)',
                    downloadIcon: {
                      width: 20,
                      height: 20,
                      fill: colors.pianoteRed
                    }
                  }
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
          </>
        )}

        {!this.state.isLoadingAll ? (
          <View
            key={'container2'}
            style={{ flex: 1, backgroundColor: colors.mainBackground }}
          >
            <View key={'belowVideo'} style={{ flex: 1 }}>
              {this.state.selectedAssignment ? (
                <VideoPlayerSong
                  onSeek={time => this.video?.onSeek?.(time)}
                  assignment={this.state.selectedAssignment}
                  assignmentProgress={this.state.selectedAssignment.progress}
                  onAssignmentFullscreen={() =>
                    this.setState({
                      showVideo: !this.state.showVideo
                    })
                  }
                  onX={() =>
                    this.setState({
                      selectedAssignment: null
                    })
                  }
                  onCompleteAssignment={() => {
                    if (this.state.selectedAssignment.progress === 100) {
                      this.setState({
                        showRestartCourse: true
                      });
                    } else {
                      this.onComplete(this.state.selectedAssignment.id);
                    }
                  }}
                />
              ) : (
                <KeyboardAwareScrollView
                  innerRef={ref => {
                    this.scroll = ref;
                  }}
                  keyboardShouldPersistTaps='handled'
                  removeClippedSubviews={false}
                  showsVerticalScrollIndicator={false}
                  contentInsetAdjustmentBehavior={'never'}
                  onScroll={({ nativeEvent }) => {
                    if (
                      Platform.OS === 'android' &&
                      this.isCloseToBottom(nativeEvent)
                    ) {
                      this.loadMoreComments();
                    }
                  }}
                  onMomentumScrollEnd={({ nativeEvent }) => {
                    if (
                      Platform.OS === 'ios' &&
                      this.isCloseToBottom(nativeEvent)
                    ) {
                      this.loadMoreComments();
                    }
                  }}
                  refreshControl={
                    <RefreshControl
                      colors={[colors.pianoteRed]}
                      refreshing={this.state.isLoadingAll}
                      onRefresh={() => this.refresh()}
                    />
                  }
                  style={{ flex: 1, backgroundColor: colors.mainBackground }}
                >
                  <View key={'lessonTitle'}>
                    <View style={{ height: 5 }} />
                    <Text
                      style={{
                        fontSize: (onTablet ? 12 : 20) * factor,
                        marginTop: 10 * factor,
                        marginBottom: 5 * factor,
                        fontFamily: 'OpenSans-Bold',
                        textAlign: 'center',
                        color: 'white',
                        paddingHorizontal: paddingInset
                      }}
                    >
                      {this.state.lessonTitle}
                    </Text>
                    <Text
                      style={{
                        fontSize: (onTablet ? 10 : 14) * factor,
                        fontFamily: 'OpenSans-Regular',
                        textAlign: 'center',
                        color: colors.secondBackground,
                        paddingBottom: 12.5 * factor
                      }}
                    >
                      {this.renderTagsDependingOnContentType()}
                    </Text>
                  </View>
                  <View
                    key={'icons'}
                    style={{
                      paddingHorizontal: 10 * factor
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignContent: 'space-around'
                      }}
                    >
                      <TouchableOpacity
                        key={'like'}
                        onPress={this.likeOrDislikeLesson}
                        style={{ flex: 1, alignItems: 'center' }}
                      >
                        <View style={{ flex: 1 }} />
                        <AntIcon
                          name={this.state.isLiked ? 'like1' : 'like2'}
                          size={onTablet ? 17.5 * factor : 27.5 * factor}
                          color={colors.pianoteRed}
                        />
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: (onTablet ? 9 : 12) * factor,
                            color: 'white',
                            marginTop: 5 * factor
                          }}
                        >
                          {this.state.likes}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        key={'list'}
                        onPress={this.toggleMyList}
                        style={{ flex: 1, alignItems: 'center' }}
                      >
                        <View style={{ flex: 1 }} />
                        <AntIcon
                          name={this.state.isAddedToMyList ? 'close' : 'plus'}
                          size={(onTablet ? 20 : 28.5) * factor}
                          color={colors.pianoteRed}
                        />
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: (onTablet ? 9 : 12) * factor,
                            color: 'white',
                            marginTop: 2 * factor
                          }}
                        >
                          {this.state.isAddedToMyList ? 'Added' : 'My List'}
                        </Text>
                      </TouchableOpacity>
                      {this.state.resources && (
                        <TouchableOpacity
                          key={'resource'}
                          onPress={() =>
                            this.setState({
                              showResDownload: true
                            })
                          }
                          style={{ flex: 1, alignItems: 'center' }}
                        >
                          <View style={{ flex: 1 }} />
                          <Resources
                            height={onTablet ? 17.5 * factor : 27.5 * factor}
                            width={onTablet ? 17.5 * factor : 27.5 * factor}
                            fill={colors.pianoteRed}
                          />
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: (onTablet ? 9 : 12) * factor,
                              color: 'white',
                              marginTop: 5 * factor
                            }}
                          >
                            Resources
                          </Text>
                        </TouchableOpacity>
                      )}
                      <Download_V2
                        entity={{
                          id,
                          comments,
                          content: this.props.navigation.state.params.url
                            ? methodService.getMethodContent(this.state.url)
                            : contentService.getContent(this.state.id)
                        }}
                        styles={{
                          touchable: { flex: 1 },
                          iconSize: {
                            height: (onTablet ? 18 : 27.5) * factor,
                            width: (onTablet ? 18 : 27.5) * factor
                          },
                          iconDownloadColor: colors.pianoteRed,
                          activityIndicatorColor: colors.pianoteRed,
                          animatedProgressBackground: colors.pianoteRed,
                          textStatus: {
                            color: '#ffffff',
                            fontSize: (onTablet ? 9 : 12) * factor,
                            fontFamily: 'OpenSans-Regular',
                            marginTop: 2 * factor
                          },
                          alert: {
                            alertTextMessageFontFamily: 'OpenSans-Regular',
                            alertTouchableTextDeleteColor: 'white',
                            alertTextTitleColor: 'black',
                            alertTextMessageColor: 'black',
                            alertTextTitleFontFamily: 'OpenSans-Bold',
                            alertTouchableTextCancelColor: colors.pianoteRed,
                            alertTouchableDeleteBackground: colors.pianoteRed,
                            alertBackground: 'white',
                            alertTouchableTextDeleteFontFamily: 'OpenSans-Bold',
                            alertTouchableTextCancelFontFamily: 'OpenSans-Bold'
                          }
                        }}
                      />
                      <TouchableOpacity
                        key={'info'}
                        onPress={() =>
                          this.setState({
                            showInfo: !this.state.showInfo
                          })
                        }
                        style={{
                          flex: 1,
                          alignItems: 'center'
                        }}
                      >
                        <View style={{ flex: 1 }} />
                        <AntIcon
                          name={
                            this.state.showInfo ? 'infocirlce' : 'infocirlceo'
                          }
                          size={(onTablet ? 15 : 22.5) * factor}
                          color={colors.pianoteRed}
                        />
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: (onTablet ? 9 : 12) * factor,
                            color: 'white',
                            marginTop: 5 * factor
                          }}
                        >
                          Info
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View key={'infoExpanded'}>
                    {this.state.showInfo && (
                      <Text
                        style={{
                          paddingHorizontal: '5%',
                          paddingTop: 10 * factor,
                          fontFamily: 'OpenSans-Regular',
                          fontSize: (onTablet ? 10 : 14) * factor,
                          textAlign: 'center',
                          color: 'white'
                        }}
                      >
                        {this.state.description}
                      </Text>
                    )}
                  </View>
                  <View style={{ height: 10 * factor }} />
                  {this.state.assignmentList?.length > 0 && (
                    <>
                      <View
                        key={'assingmentsHeader'}
                        style={{ paddingLeft: paddingInset, paddingBottom: 10 }}
                      >
                        <Text
                          style={{
                            fontSize: (onTablet ? 12 : 18) * factor,
                            fontFamily: 'RobotoCondensed-Bold',
                            color: colors.secondBackground
                          }}
                        >
                          ASSIGNMENTS
                        </Text>
                      </View>

                      <View
                        key={'assignments'}
                        style={{
                          width: '100%',
                          borderTopColor: colors.secondBackground,
                          borderTopWidth: 1
                        }}
                      >
                        {this.renderAssignments()}
                      </View>
                    </>
                  )}
                  <View style={{ height: 5 }} />
                  {this.state.relatedLessons.length > 0 && (
                    <VerticalVideoList
                      title={'RELATED LESSONS'}
                      items={this.state.relatedLessons}
                      type={'LESSONS'}
                      isLoading={this.state.isLoadingAll}
                      showTitleOnly={true}
                      showFilter={true}
                      showType={false}
                      showArtist={false}
                      showSort={false}
                      showLength={true}
                      imageWidth={onTablet ? width * 0.2 : width * 0.28}
                      navigator={row =>
                        this.switchLesson(row.id, row.mobile_app_url)
                      }
                    />
                  )}

                  <View
                    key={'commentContainer'}
                    style={[
                      styles.centerContent,
                      {
                        flex: 1,
                        width: '100%',
                        zIndex: 10,
                        marginTop: 10 * factor
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          width: '100%',
                          backgroundColor: colors.mainBackground,
                          zIndex: 5
                        }}
                      >
                        <View
                          key={'commentHeader'}
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            justifyContent: 'space-between',
                            paddingHorizontal: 10 * factor
                          }}
                        >
                          <Text
                            style={{
                              fontSize: (onTablet ? 12 : 18) * factor,
                              fontFamily: 'RobotoCondensed-Bold',
                              color: colors.secondBackground
                            }}
                          >
                            {this.allCommentsNum + ' COMMENTS'}
                          </Text>
                          {global.isConnected && (
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({ showCommentSort: true })
                              }
                            >
                              <FontIcon
                                size={(onTablet ? 15 : 20) * factor}
                                name={'sort-amount-down'}
                                color={colors.pianoteRed}
                              />
                            </TouchableOpacity>
                          )}
                        </View>

                        <View
                          key={'addComment'}
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            paddingHorizontal: 10 * factor,
                            paddingVertical: 20 * factor
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({ showMakeComment: true })
                            }
                            style={{ flexDirection: 'row', flex: 1 }}
                          >
                            <FastImage
                              style={{
                                height: (onTablet ? 30 : 40) * factor,
                                width: (onTablet ? 30 : 40) * factor,
                                paddingVertical: 10 * factor,
                                borderRadius: 100
                              }}
                              source={{
                                uri:
                                  this.state.profileImage ||
                                  'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                              }}
                              resizeMode={FastImage.resizeMode.stretch}
                            />

                            <View
                              key={'addComment'}
                              style={{
                                flex: 1,
                                justifyContent: 'center'
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: 'left',
                                  fontFamily: 'OpenSans-Regular',
                                  fontSize: (onTablet ? 10 : 13) * factor,
                                  color: 'white',
                                  paddingLeft: paddingInset
                                }}
                              >
                                Add a comment...
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {this.state.isLoadingComm && (
                        <ActivityIndicator
                          size='small'
                          style={{ padding: 10 }}
                          color={colors.secondBackground}
                        />
                      )}
                      {this.state.comments.length > 0 && this.mapComments()}
                    </View>
                  </View>
                </KeyboardAwareScrollView>
              )}
            </View>

            <Replies
              sendReply={reply =>
                commentsService
                  .addReplyToComment(
                    encodeURIComponent(reply),
                    this.state.selectedComment.id
                  )
                  .then(r =>
                    this.setState(({ comments, selectedComment }) => ({
                      comments: comments.map(c =>
                        c.id === selectedComment.id
                          ? {
                              ...c,
                              replies: [r.data[0], ...c.replies]
                            }
                          : c
                      ),
                      selectedComment: {
                        ...selectedComment,
                        replies: [r.data[0], ...selectedComment.replies]
                      }
                    }))
                  )
              }
              deleteReply={id => {
                commentsService.deleteComment(id);
                this.setState(({ comments, selectedComment }) => ({
                  comments: comments.map(c => ({
                    ...c,
                    replies: c.replies.filter(r => r.id !== id)
                  })),
                  selectedComment: {
                    ...selectedComment,
                    replies: selectedComment.replies.filter(r => r.id !== id)
                  }
                }));
              }}
              deleteComment={id => {
                commentsService.deleteComment(id);
                this.setState(
                  ({ comments }) => ({
                    comments: comments.filter(c => c.id !== id)
                  }),
                  () =>
                    this.replies.toggle(() =>
                      this.setState({ selectedComment: undefined })
                    )
                );
              }}
              toggleCommentLike={(id, action) => {
                commentsService[action](id);
                this.setState(({ comments, selectedComment }) => ({
                  comments: comments.map(c =>
                    c.id === id
                      ? {
                          ...c,
                          is_liked: !c.is_liked,
                          like_count: c.is_liked
                            ? c.like_count - 1
                            : c.like_count + 1
                        }
                      : c
                  ),
                  selectedComment: {
                    ...selectedComment,
                    is_liked: !selectedComment.is_liked,
                    like_count: selectedComment.is_liked
                      ? selectedComment.like_count - 1
                      : selectedComment.like_count + 1
                  }
                }));
              }}
              toggleReplyLike={(id, action) => {
                commentsService[action](id);
                this.setState(({ comments, selectedComment }) => ({
                  comments: comments.map(c => ({
                    ...c,
                    replies: c.replies.map(r =>
                      r.id === id
                        ? {
                            ...r,
                            is_liked: !r.is_liked,
                            like_count: r.is_liked
                              ? r.like_count - 1
                              : r.like_count + 1
                          }
                        : r
                    )
                  })),
                  selectedComment: {
                    ...selectedComment,
                    replies: selectedComment.replies.map(r =>
                      r.id === id
                        ? {
                            ...r,
                            is_liked: !r.is_liked,
                            like_count: r.is_liked
                              ? r.like_count - 1
                              : r.like_count + 1
                          }
                        : r
                    )
                  }
                }));
              }}
              close={() =>
                this.replies.toggle(() =>
                  this.setState({ selectedComment: undefined })
                )
              }
              onRef={r => (this.replies = r)}
              comment={this.state.selectedComment}
              me={{
                userId: this.userId,
                profileImage: this.state.profileImage
              }}
            />
          </View>
        ) : (
          <ActivityIndicator
            size='small'
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            color={colors.secondBackground}
          />
        )}
        {!this.state.selectedAssignment && !this.state.showMakeComment && (
          <View
            key={'completeLesson'}
            //forceInset={{ bottom: 'always' }}
            style={[
              {
                backgroundColor: colors.mainBackground
              }
            ]}
          >
            <View
              style={{
                backgroundColor: colors.mainBackground,
                height: 2 * factor,
                width: '100%'
              }}
            >
              {!!this.state.progress && (
                <View
                  testID='progress'
                  style={[
                    styles.progressBarCompleted,
                    {
                      backgroundColor: colors.pianoteRed,
                      height: 3,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      position: 'relative',
                      width: this.state.progress + '%'
                    }
                  ]}
                />
              )}
            </View>
            <View style={{ height: 5 }} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                paddingVertical: 5 * factor,
                paddingHorizontal: 10 * factor
              }}
            >
              <TouchableOpacity
                testID='prevBtn'
                style={{
                  borderRadius: 500,
                  borderWidth: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10 * factor,
                  borderColor: this.state.previousLesson
                    ? colors.pianoteRed
                    : colors.secondBackground
                }}
                disabled={!this.state.previousLesson?.id}
                onPress={() =>
                  this.switchLesson(
                    this.state.previousLesson.id,
                    this.state.previousLesson.post.mobile_app_url
                  )
                }
              >
                <EntypoIcon
                  name={'chevron-thin-left'}
                  size={(onTablet ? 17.5 : 22.5) * factor}
                  style={{ padding: (onTablet ? 3 : 7.5) * factor }}
                  color={
                    this.state.previousLesson
                      ? colors.pianoteRed
                      : colors.secondBackground
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.pianoteRed,
                  borderRadius: 500,
                  minHeight: (onTablet ? 30 : 50) * factor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1
                }}
                onPress={() =>
                  this.state.progress === 100
                    ? this.setState({ showRestartCourse: true })
                    : this.onComplete(this.state.id)
                }
              >
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: (onTablet ? 12 : 17.5) * factor,
                    paddingVertical: 10
                  }}
                >
                  {this.state.progress === 100
                    ? 'COMPLETED'
                    : 'COMPLETE LESSON'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID='prevBtn'
                style={{
                  borderRadius: 500,
                  borderWidth: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: paddingInset,
                  borderColor: this.state.nextLesson
                    ? colors.pianoteRed
                    : colors.secondBackground
                }}
                disabled={!this.state.nextLesson?.id}
                onPress={() =>
                  this.switchLesson(
                    this.state.nextLesson.id,
                    this.state.nextLesson.post.mobile_app_url
                  )
                }
              >
                <EntypoIcon
                  name={'chevron-thin-right'}
                  size={(onTablet ? 17.5 : 22.5) * factor}
                  style={{ padding: (onTablet ? 3 : 7.5) * factor }}
                  color={
                    this.state.nextLesson
                      ? colors.pianoteRed
                      : colors.secondBackground
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {this.state.selectedAssignment && (
          <Modal
            key={'assignmentComplete'}
            isVisible={this.state.showAssignmentComplete}
            style={{ margin: 0, height: '100%', width: '100%' }}
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
                this.setState({ showAssignmentComplete: false });
              }}
            />
          </Modal>
        )}
        <Modal
          key={'resourceDownload'}
          isVisible={this.state.showResDownload}
          onDismiss={() => this.modalDismissed}
          style={[
            {
              margin: 0,
              height: '100%',
              width: '100%',
              justifyContent: 'flex-end'
            }
          ]}
          animation={'slideInUp'}
          animationInTiming={350}
          animationOutTiming={350}
          coverScreen={true}
          hasBackdrop={true}
        >
          <DownloadResources
            styles={{
              container: {
                backgroundColor: colors.mainBackground,
                width: '100%'
              },
              touchableTextResourceNameFontFamily: 'OpenSans',
              touchableTextResourceExtensionFontFamily: 'OpenSans',
              touchableTextResourceCancelFontFamily: 'OpenSans',
              borderColor: colors.secondBackground,
              color: '#ffffff'
            }}
            resources={this.state.resources}
            lessonTitle={this.state.lessonTitle}
            onClose={() => {
              new Promise(res =>
                this.setState(
                  {
                    showResDownload: false
                  },
                  () =>
                    Platform.OS === 'ios' ? (this.modalDismissed = res) : res()
                )
              );
            }}
          />
        </Modal>

        {!this.state.isLoadingAll && (
          <>
            <Modal
              key={'lessonComplete'}
              isVisible={this.state.showLessonComplete}
              style={{ margin: 0, height: '100%', width: '100%' }}
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
                type={this.state.type}
                nextLesson={this.state.nextLesson}
                hideLessonComplete={() => {
                  this.setState({ showLessonComplete: false });
                }}
                onGoToNext={() => {
                  this.setState({ showLessonComplete: false });
                  if (this.state.nextLesson) {
                    this.switchLesson(
                      this.state.nextLesson.id,
                      this.state.nextLesson.post.mobile_app_url
                    );
                  }
                }}
              />
            </Modal>
            <Modal
              key={'restartCourse'}
              isVisible={this.state.showRestartCourse}
              style={{
                margin: 0,
                flex: 1
              }}
              animation={'slideInUp'}
              animationInTiming={250}
              animationOutTiming={250}
              coverScreen={true}
              hasBackdrop={true}
            >
              <RestartCourse
                hideRestartCourse={() =>
                  this.setState({ showRestartCourse: false })
                }
                type={
                  this.state.selectedAssignment ? 'assignment' : this.state.type
                }
                onRestart={() => this.onResetProgress()}
              />
            </Modal>
            <Modal
              key={'overviewComplete'}
              isVisible={this.state.showOverviewComplete}
              style={{ margin: 0, height: '100%', width: '100%' }}
              animation={'slideInUp'}
              animationInTiming={250}
              animationOutTiming={250}
              coverScreen={true}
              hasBackdrop={true}
            >
              <OverviewComplete
                title={this.state.lessonTitle}
                xp={this.state.xp}
                type={
                  this.state.type === 'learning-path-lesson'
                    ? 'Method'
                    : this.state.type
                }
                hideOverviewComplete={() => {
                  this.setState({
                    showOverviewComplete: false
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
            { margin: 0, height: '100%', width: '100%' }
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
              this.setState({ showCommentSort: false });
            }}
            currentSort={this.state.commentSort}
            changeSort={commentSort => {
              this.setState({ commentSort }, () => {
                this.limit = 10;
                this.fetchComments();
              });
            }}
          />
        </Modal>
        <Modal
          key={'soundSlice'}
          isVisible={this.state.showSoundSlice}
          style={[
            styles.centerContent,
            { margin: 0, height: '100%', width: '100%' }
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
                showSoundSlice: false
              });
            }}
          />
        </Modal>
        <CustomModal
          ref={r => (this.alert = r)}
          additionalBtn={
            <TouchableOpacity
              onPress={() => {
                this.refresh();
                this.alert.toggle();
              }}
              style={{
                marginTop: 10,
                borderRadius: 50,
                backgroundColor: colors.pianoteRed
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  {
                    padding: 15,
                    fontSize: 15,
                    color: '#ffffff'
                  }
                ]}
              >
                RELOAD LESSON
              </Text>
            </TouchableOpacity>
          }
          onClose={() => {}}
        />

        {this.state.showMakeComment && (
          <Modal
            isVisible={this.state.showMakeComment}
            style={{ margin: 0 }}
            backdropColor={'transparent'}
            animation={'slideInUp'}
            animationInTiming={350}
            animationOutTiming={350}
            coverScreen={false}
            hasBackdrop={true}
            transparent={true}
            onBackdropPress={() => this.setState({ showMakeComment: false })}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.setState({ showMakeComment: false })}
            >
              <KeyboardAvoidingView
                key={'makeComment'}
                behavior={`${isiOS ? 'padding' : ''}`}
                style={{ flex: 1, justifyContent: 'flex-end' }}
              >
                <View
                  style={{
                    backgroundColor: colors.mainBackground,
                    flexDirection: 'row',
                    padding: 10 * factor,
                    alignItems: 'center',
                    borderTopWidth: 0.5 * factor,
                    borderTopColor: colors.secondBackground
                  }}
                >
                  <FastImage
                    style={{
                      height: (onTablet ? 30 : 40) * factor,
                      width: (onTablet ? 30 : 40) * factor,
                      paddingVertical: 10 * factor,
                      borderRadius: 100,
                      marginRight: 10 * factor
                    }}
                    source={{
                      uri:
                        this.state.profileImage ||
                        'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                  <TextInput
                    autoFocus={true}
                    multiline={true}
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: (onTablet ? 10 : 14) * factor,
                      flex: 1,
                      backgroundColor: colors.mainBackground,
                      color: colors.secondBackground,
                      paddingVertical: 10 * factor
                    }}
                    onSubmitEditing={() => {
                      this.makeComment();
                    }}
                    returnKeyType={'go'}
                    onChangeText={comment => this.setState({ comment })}
                    placeholder={'Add a comment'}
                    placeholderTextColor={colors.secondBackground}
                  />
                  <TouchableOpacity
                    style={{
                      marginBottom: Platform.OS == 'android' ? 10 * factor : 0,
                      marginLeft: 20
                    }}
                    onPress={() => this.makeComment()}
                  >
                    <IonIcon
                      name={'md-send'}
                      size={(onTablet ? 17.5 : 25) * factor}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  }
}
