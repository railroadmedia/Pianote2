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
import { SafeAreaView } from 'react-navigation';
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
import foundationsService from '../../services/foundations.service';

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
        result = await foundationsService.getUnitLesson(this.state.url);
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

    if (content.post.assignments && this.context.isConnected) {
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
          progress:
            parseInt(
              Object.values(assignments[a].post.user_progress)?.[0]
                .progress_percent
            ) || 0,
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

    this.setState(
      {
        comments: content.post.comments,
        id: content.id,
        url: content.post.mobile_app_url,
        type: content.type,
        videoId: content.post.fields?.find(f => f.key === 'video')
          ? new ContentModel(content.getFieldMulti('video')[0])?.getField(
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
          content.post.type === 'unit-part'
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
        if (!this.state.video_playback_endpoints) {
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
          paddingTop: fullHeight * 0.025,
          paddingLeft: fullWidth * 0.05,
          paddingRight: fullWidth * 0.03,
          flex: 1,
          borderTopColor: colors.secondBackground,
          borderTopWidth: 0.25,
          flexDirection: 'row'
        }}
      >
        <View>
          <View style={{ alignItems: 'center' }}>
            <FastImage
              style={{
                height: 40 * factorHorizontal,
                width: 40 * factorHorizontal,
                borderRadius: 100
              }}
              source={{
                uri: item.user['fields.profile_picture_image_url']
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 10 * factorRatio,
                marginTop: 2 * factorRatio,
                fontWeight: 'bold',
                color: 'grey'
              }}
            >
              {this.changeXP(item.user.xp)}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
        <View style={{ flex: 1, paddingLeft: 12.5 * factorHorizontal }}>
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: 13 * factorRatio,
              color: 'white',
              paddingTop: 3 * factorVertical,
              paddingBottom: 7.5 * factorVertical
            }}
          >
            {item.comment}
          </Text>

          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              fontSize: 12 * factorRatio,
              color: colors.secondBackground
            }}
          >
            {item.user['display_name']} | {item.user.rank} |{' '}
            {moment.utc(item.created_on).local().fromNow()}
          </Text>
          <View
            style={{
              paddingTop: 15 * factorVertical,
              paddingBottom: 15 * factorVertical
            }}
          >
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => this.likeComment(item.id)}>
                  <AntIcon
                    name={item.is_liked ? 'like1' : 'like2'}
                    size={20 * factorRatio}
                    color={colors.pianoteRed}
                  />
                </TouchableOpacity>
                <View style={{ width: 10 * factorHorizontal }} />
                {item.like_count > 0 && (
                  <View>
                    <View style={{ flex: 1 }} />
                    <View
                      style={[
                        styles.centerContent,
                        {
                          borderRadius: 40,
                          paddingLeft: 8 * factorHorizontal,
                          paddingRight: 8 * factorHorizontal,
                          paddingTop: 4 * factorVertical,
                          paddingBottom: 4 * factorVertical,
                          backgroundColor: colors.notificationColor
                        }
                      ]}
                    >
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          fontSize: 10 * factorRatio,
                          color: colors.pianoteRed
                        }}
                      >
                        {item.like_count}{' '}
                        {item.like_count === 1 ? 'LIKE' : 'LIKES'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                )}
              </View>
              <View style={{ width: 20 * factorHorizontal }} />
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() =>
                    this.replies.toggle(() =>
                      this.setState({ selectedComment: item })
                    )
                  }
                >
                  <MaterialIcon
                    name={'comment-text-outline'}
                    size={20 * factorRatio}
                    color={colors.pianoteRed}
                  />
                </TouchableOpacity>
                <View style={{ width: 10 * factorHorizontal }} />
                {item.replies?.length > 0 && (
                  <View>
                    <View style={{ flex: 1 }} />
                    <View
                      style={[
                        styles.centerContent,
                        {
                          borderRadius: 40,
                          paddingLeft: 8 * factorHorizontal,
                          paddingRight: 8 * factorHorizontal,
                          paddingTop: 4 * factorVertical,
                          paddingBottom: 4 * factorVertical,
                          backgroundColor: colors.notificationColor
                        }
                      ]}
                    >
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          fontSize: 10 * factorRatio,
                          color: colors.pianoteRed
                        }}
                      >
                        {item.replies?.length}{' '}
                        {item.replies?.length === 1 ? 'REPLY' : 'REPLIES'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                )}
              </View>
              <View style={{ width: 20 * factorHorizontal }} />
              {this.userId === item.user_id && (
                <TouchableOpacity onPress={() => this.deleteComment(item.id)}>
                  <AntIcon
                    name={'delete'}
                    size={20 * factorRatio}
                    color={colors.pianoteRed}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flex: 1 }} />
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
                  fontSize: 12 * factorRatio,
                  color: colors.secondBackground
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
    let { assignmentList, nextLesson, nextUnit } = this.state;
    if (id !== this.state.id) {
      incompleteAssignments = assignmentList.filter(
        a => a.progress !== 100 && a.id !== id
      ).length;
      this.setState(state => ({
        showAssignmentComplete: incompleteAssignments ? true : false,
        showLessonComplete:
          !incompleteAssignments && (nextLesson || nextUnit) ? true : false,
        showOverviewComplete:
          !incompleteAssignments && !nextLesson && !nextUnit ? true : false,
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
        showLessonComplete: nextLesson || nextUnit ? true : false,
        showOverviewComplete: nextLesson || nextUnit ? false : true,
        progress: 100,
        assignmentList: state.assignmentList.map(a => ({
          ...a,
          progress: 100
        }))
      }));
    }
    let res = await markComplete(id);

    if (res?.parent[0]) {
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
            height: 55 * factorVertical,
            paddingLeft: fullWidth * 0.035,
            borderBottomColor: colors.secondBackground,
            borderBottomWidth: 1,
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'row'
          }}
        >
          <View>
            <View style={{ flex: 1 }} />
            <Text
              style={{
                fontSize: 18 * factorRatio,
                color: colors.secondBackground,
                fontFamily: 'RobotoCondensed-Bold'
              }}
            >
              {index + 1}. {row.title}
            </Text>
            <View style={{ flex: 1 }} />
          </View>
          <View style={{ flex: 1 }} />
          <View
            style={[
              styles.centerContent,
              {
                height: '100%',
                width: 40 * factorHorizontal,
                flexDirection: 'row'
              }
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
                      backgroundColor: '#fb1b2f'
                    }
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
              <View style={[styles.centerContent, { flexDirection: 'row' }]}>
                <View style={{ flex: 0.25 }} />
                <EntypoIcon
                  name={'chevron-thin-right'}
                  size={20 * factorRatio}
                  color={colors.secondBackground}
                />
                <View style={{ flex: 1 }} />
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
      case 'pack':
        return releaseDateTag + xpTag;
      default:
        return instructorTag + xpTag;
    }
  };

  render() {
    let { id, comments } = this.state;
    return (
      <View
        style={[styles.container, { backgroundColor: colors.mainBackground }]}
      >
        <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
        {this.state.showVideo && (
          <>
            {this.state.isLoadingAll || !this.state.video_playback_endpoints ? (
              <SafeAreaView
                forceInset={{ top: 'always', bottom: 'never' }}
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
                    <ArrowLeft width={18} height={18} fill={'white'} />
                  </TouchableOpacity>
                  <ActivityIndicator size='large' color='#ffffff' />
                </View>
              </SafeAreaView>
            ) : (
              <Video
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
                  currentTime
                ) => {
                  if (this.context.isConnected) {
                    if (!this.sessionId)
                      try {
                        this.sessionId = (
                          await getMediaSessionId(
                            videoId,
                            id,
                            lengthInSec,
                            'vimeo'
                          )
                        ).session_id.id;
                      } catch (e) {}

                    updateUsersVideoProgress(
                      this.sessionId,
                      currentTime,
                      lengthInSec
                    );
                  }
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
                    <Text
                      style={{
                        fontSize: 20 * factorRatio,
                        fontWeight: 'bold',
                        fontFamily: 'OpenSans-Regular',
                        textAlign: 'center',
                        color: 'white',
                        paddingVertical: fullHeight * 0.015,
                        paddingHorizontal: 15
                      }}
                    >
                      {this.state.lessonTitle}
                    </Text>

                    <Text
                      style={{
                        fontSize: 12 * factorRatio,
                        fontWeight: '400',
                        color: 'grey',
                        fontFamily: 'OpenSans-Regular',
                        textAlign: 'center',
                        color: colors.secondBackground,
                        paddingBottom: fullHeight * 0.015
                      }}
                    >
                      {this.renderTagsDependingOnContentType()}
                    </Text>
                  </View>
                  <View
                    key={'icons'}
                    style={{
                      paddingLeft: fullWidth * 0.015,
                      paddingRight: fullWidth * 0.015
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <View
                      key={'icon'}
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
                        <AntIcon
                          name={this.state.isLiked ? 'like1' : 'like2'}
                          size={27.5 * factorRatio}
                          color={colors.pianoteRed}
                        />
                        <View style={{ height: 5 * factorVertical }} />
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 12 * factorRatio,
                            color: 'white'
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
                        <AntIcon
                          name={this.state.isAddedToMyList ? 'close' : 'plus'}
                          size={27.5 * factorRatio}
                          color={colors.pianoteRed}
                        />
                        <View style={{ height: 5 * factorVertical }} />
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 12 * factorRatio,
                            color: 'white'
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
                          <Resources
                            height={27.5 * factorRatio}
                            width={27.5 * factorRatio}
                            fill={colors.pianoteRed}
                          />
                          <View style={{ height: 7.5 * factorVertical }} />
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 12 * factorRatio,
                              color: 'white'
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
                            ? foundationsService.getUnitLesson(this.state.url)
                            : contentService.getContent(this.state.id)
                        }}
                        styles={{
                          touchable: { flex: 1 },
                          iconDownloadColor: colors.pianoteRed,
                          activityIndicatorColor: colors.pianoteRed,
                          animatedProgressBackground: colors.pianoteRed,
                          textStatus: {
                            color: '#ffffff',
                            fontSize: 12 * factorRatio,
                            fontFamily: 'OpenSans-Regular',
                            marginTop: 7.5 * factorVertical
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
                        style={{ flex: 1, alignItems: 'center' }}
                      >
                        <AntIcon
                          name={
                            this.state.showInfo ? 'infocirlce' : 'infocirlceo'
                          }
                          size={27.5 * factorRatio}
                          color={colors.pianoteRed}
                        />
                        <View style={{ height: 5 * factorVertical }} />
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 12 * factorRatio,
                            color: 'white'
                          }}
                        >
                          Info
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View key={'infoExpanded'}>
                    {this.state.showInfo && (
                      <View>
                        <View style={{ height: fullHeight * 0.03 }} />
                        <Text
                          style={{
                            paddingLeft: '5%',
                            paddingRight: '5%',
                            fontFamily: 'OpenSans-Regular',
                            fontSize: 14 * factorRatio,
                            textAlign: 'center',
                            color: 'white'
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
                          : 10 * factorVertical
                    }}
                  />
                  {this.state.assignmentList?.length > 0 && (
                    <>
                      <View
                        key={'assingmentsHeader'}
                        style={{ paddingLeft: fullWidth * 0.035 }}
                      >
                        <Text
                          style={{
                            fontSize: 18 * factorRatio,
                            fontFamily: 'RobotoCondensed-Bold',
                            color: colors.secondBackground
                          }}
                        >
                          ASSIGNMENTS
                        </Text>
                        <View style={{ height: 20 * factorVertical }} />
                      </View>

                      <View
                        key={'assignments'}
                        style={{
                          width: fullWidth,
                          borderTopColor: colors.secondBackground,
                          borderTopWidth: 1
                        }}
                      >
                        {this.renderAssignments()}
                      </View>
                    </>
                  )}
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
                      imageRadius={5 * factorRatio}
                      containerBorderWidth={0}
                      containerWidth={fullWidth}
                      containerHeight={
                        this.state.type !== 'song'
                          ? onTablet
                            ? fullHeight * 0.15
                            : Platform.OS == 'android'
                            ? fullHeight * 0.115
                            : fullHeight * 0.0925
                          : fullWidth * 0.22
                      }
                      imageHeight={
                        this.state.type !== 'song'
                          ? onTablet
                            ? fullHeight * 0.12
                            : Platform.OS == 'android'
                            ? fullHeight * 0.09
                            : fullHeight * 0.08
                          : fullWidth * 0.175
                      }
                      imageWidth={
                        this.state.type !== 'song'
                          ? fullWidth * 0.26
                          : fullWidth * 0.175
                      }
                      navigator={row =>
                        this.switchLesson(row.id, row.mobile_app_url)
                      }
                    />
                  )}
                  <View key={'commentList'} style={{ flex: 1 }}>
                    <View
                      key={'commentContainer'}
                      style={[
                        styles.centerContent,
                        { flex: 1, width: fullWidth, zIndex: 10 }
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            width: fullWidth,
                            backgroundColor: colors.mainBackground,
                            zIndex: 5
                          }}
                        >
                          <View style={{ height: fullHeight * 0.025 }} />
                          <View
                            key={'commentHeader'}
                            style={{
                              width: fullWidth,
                              flexDirection: 'row',
                              paddingLeft: fullWidth * 0.05,
                              paddingRight: fullWidth * 0.01
                            }}
                          >
                            <View>
                              <View style={{ flex: 1 }} />
                              <Text
                                style={{
                                  fontSize: 18 * factorRatio,
                                  fontFamily: 'RobotoCondensed-Bold',
                                  color: colors.secondBackground
                                }}
                              >
                                {this.allCommentsNum + ' COMMENTS'}
                              </Text>
                              <View style={{ flex: 1 }} />
                            </View>
                            <View style={{ flex: 1 }} />

                            <TouchableOpacity
                              style={{ marginLeft: factorHorizontal * 10 }}
                              onPress={() =>
                                this.setState({ showCommentSort: true })
                              }
                            >
                              <FontIcon
                                size={20 * factorRatio}
                                name={'sort-amount-down'}
                                color={colors.pianoteRed}
                              />
                            </TouchableOpacity>
                            <View style={{ flex: 0.1 }} />
                          </View>
                          <View style={{ flex: 1.25 }} />
                          <View
                            key={'addComment'}
                            style={{
                              width: fullWidth,
                              height: fullHeight * 0.1,
                              flexDirection: 'row',
                              paddingLeft: fullWidth * 0.05
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({ showMakeComment: true })
                              }
                              style={{ flexDirection: 'row' }}
                            >
                              <View
                                key={'profileImage'}
                                style={{
                                  height: '100%',
                                  width: 40 * factorHorizontal
                                }}
                              >
                                <View style={{ flex: 1 }} />
                                <FastImage
                                  style={{
                                    height: 40 * factorHorizontal,
                                    width: 40 * factorHorizontal,
                                    borderRadius: 100
                                  }}
                                  source={{
                                    uri:
                                      this.state.profileImage ||
                                      'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                                  }}
                                  resizeMode={FastImage.resizeMode.stretch}
                                />
                                <View style={{ flex: 1 }} />
                              </View>
                              <View
                                key={'addComment'}
                                style={{
                                  height: '100%',
                                  width:
                                    fullWidth * 0.95 - 40 * factorHorizontal,
                                  justifyContent: 'center'
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 13 * factorRatio,
                                    color: 'white',
                                    paddingLeft: 10 * factorHorizontal
                                  }}
                                >
                                  Add a comment...
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flex: 1 }} />
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
                      <View style={{ height: fullHeight * 0.035 }} />
                    </View>
                  </View>
                </KeyboardAwareScrollView>
              )}
            </View>
            {!this.state.selectedAssignment && !this.state.showMakeComment && (
              <SafeAreaView
                key={'completeLesson'}
                forceInset={{ bottom: 'always' }}
                style={[
                  styles.centerContent,
                  {
                    width: fullWidth,
                    backgroundColor: colors.mainBackground,
                    zIndex: 2,
                    justifyContent: 'flex-end'
                  }
                ]}
              >
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      width: (fullWidth * this.state.progress) / 100,
                      height: 2 * factorRatio,
                      backgroundColor: colors.pianoteRed
                    }}
                  />
                  <View style={{ flex: 1 }} />
                </View>
                <View
                  style={{ width: fullWidth, height: 15 * factorVertical }}
                />
                <View style={{ flexDirection: 'row' }}>
                  <View
                    key={'last'}
                    style={[
                      styles.centerContent,
                      { flex: 0.2, alignSelf: 'stretch' }
                    ]}
                  >
                    <View
                      style={{
                        height: fullWidth * 0.1,
                        width: fullWidth * 0.1,
                        borderRadius: 100,
                        borderWidth: 2 * factorRatio,
                        borderColor: this.state.previousLesson
                          ? colors.pianoteRed
                          : colors.secondBackground
                      }}
                    >
                      <TouchableOpacity
                        disabled={!this.state.previousLesson?.id}
                        onPress={() =>
                          this.switchLesson(
                            this.state.previousLesson.id,
                            this.state.previousLesson.post.mobile_app_url
                          )
                        }
                        style={[
                          styles.centerContent,
                          { height: '100%', width: '100%' }
                        ]}
                      >
                        <EntypoIcon
                          name={'chevron-thin-left'}
                          size={22.5 * factorRatio}
                          color={
                            this.state.previousLesson
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
                      { flex: 0.6, alignSelf: 'stretch' }
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        this.state.progress === 100
                          ? this.setState({ showRestartCourse: true })
                          : this.onComplete(this.state.id)
                      }
                      style={[
                        styles.centerContent,
                        {
                          height: fullWidth * 0.1,
                          width: fullWidth * 0.6,
                          borderRadius: 100,
                          backgroundColor: colors.pianoteRed
                        }
                      ]}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'RobotoCondensed-Bold',
                          fontSize: 14 * factorRatio
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
                      { flex: 0.2, alignSelf: 'stretch' }
                    ]}
                  >
                    <View
                      style={{
                        height: fullWidth * 0.1,
                        width: fullWidth * 0.1,
                        borderRadius: 100,
                        borderWidth: 2 * factorRatio,
                        borderColor: this.state.nextLesson
                          ? colors.pianoteRed
                          : colors.secondBackground
                      }}
                    >
                      <TouchableOpacity
                        disabled={!this.state.nextLesson?.id}
                        onPress={() =>
                          this.switchLesson(
                            this.state.nextLesson.id,
                            this.state.nextLesson.post.mobile_app_url
                          )
                        }
                        style={[
                          styles.centerContent,
                          { height: '100%', width: '100%' }
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
              </SafeAreaView>
            )}
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

        {this.state.selectedAssignment && (
          <Modal
            key={'assignmentComplete'}
            isVisible={this.state.showAssignmentComplete}
            style={{ margin: 0, height: fullHeight, width: fullWidth }}
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
          onDismiss={() => this.modalDismissed()}
          style={[
            {
              margin: 0,
              height: fullHeight,
              width: fullWidth,
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
                width: fullWidth
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
              style={[
                styles.centerContent,
                { margin: 0, height: fullHeight, width: fullWidth }
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
                type={this.state.type}
                nextLesson={this.state.nextLesson || this.state.nextUnit}
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
                  } else if (this.state.nextUnit) {
                    this.props.navigation.dispatch(
                      StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({
                            routeName: 'FOUNDATIONSLEVEL',

                            params: {
                              url: this.state.nextUnit.post.mobile_app_url
                            }
                          })
                        ]
                      })
                    );
                  }
                }}
              />
            </Modal>
            <Modal
              key={'restartCourse'}
              isVisible={this.state.showRestartCourse}
              style={{ height: fullHeight, width: fullWidth, margin: 0 }}
              animation={'slideInUp'}
              animationInTiming={250}
              animationOutTiming={250}
              coverScreen={true}
              hasBackdrop={true}
            >
              <RestartCourse
                hideRestartCourse={() => {
                  this.setState({
                    showRestartCourse: false
                  });
                }}
                type={
                  this.state.selectedAssignment ? 'assignment' : this.state.type
                }
                onRestart={() => this.onResetProgress()}
              />
            </Modal>
            <Modal
              key={'overviewComplete'}
              isVisible={this.state.showOverviewComplete}
              style={{ margin: 0, height: fullHeight, width: fullWidth }}
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
            { margin: 0, height: fullHeight, width: fullWidth }
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
            { margin: 0, height: fullHeight, width: fullWidth }
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
                style={{
                  padding: 15,
                  fontSize: 15,
                  color: '#ffffff',
                  textAlign: 'center',
                  fontFamily: 'OpenSans-Bold'
                }}
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
                    padding: 10,
                    alignItems: 'center',
                    borderTopWidth: 0.5 * factorRatio,
                    borderTopColor: colors.secondBackground
                  }}
                >
                  <FastImage
                    style={{
                      height: 40 * factorHorizontal,
                      width: 40 * factorHorizontal,
                      borderRadius: 100,
                      marginRight: 15
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
                      fontSize: 14 * factorRatio,
                      width: '75%',
                      backgroundColor: colors.mainBackground,
                      color: colors.secondBackground,
                      paddingVertical: 10 * factorVertical
                    }}
                    onSubmitEditing={() => {
                      this.makeComment();
                    }}
                    returnKeyType={'go'}
                    onChangeText={comment => this.setState({ comment })}
                    placeholder={'Add a comment'}
                    placeholderTextColor={colors.secondBackground}
                  />

                  <View style={styles.centerContent}>
                    <TouchableOpacity
                      style={{
                        marginBottom:
                          Platform.OS == 'android' ? 10 * factorVertical : 0
                      }}
                      onPress={() => this.makeComment()}
                    >
                      <IonIcon
                        name={'md-send'}
                        size={25 * factorRatio}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  }
}
