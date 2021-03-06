import React from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler,
  SafeAreaView,
  Modal,
  StyleSheet
} from 'react-native';
import Video from 'RNVideoEnhanced';
import FastImage from 'react-native-fast-image';
import Icon from '../../assets/icons.js';
import { Download_V2, offlineContent, DownloadResources } from 'RNDownload';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Replies from '../../components/Replies';
import VerticalVideoList from '../../components/VerticalVideoList';
import Sort from '../../modals/Sort';
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
import ArrowLeft from '../../assets/img/svgs/arrowLeft';
import Resources from '../../assets/img/svgs/resources';
import Assignment from './Assignment';
import { NetworkContext } from '../../context/NetworkProvider';
import methodService from '../../services/method.service';
import { goBack, navigate } from '../../../AppNavigator';
import { connect } from 'react-redux';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
let localStyles;

class ViewLesson extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.limit = 10;
    this.allCommentsNum = 0;
    localStyles = setStyles(colors, sizing);
    this.state = {
      id: props.route?.params?.id,
      url: props.route?.params?.url,
      comments: [],
      chapters: [],
      relatedLessons: [],
      assignmentList: [],
      isLoadingAll: true,
      selectedComment: undefined,
      showAssignment: false,
      showSort: false,
      showMakeComment: false,
      showInfo: false,
      isLoadingComm: false,
      showAssignmentComplete: false,
      showOverviewComplete: false,
      showLessonComplete: false,
      showResDownload: false,
      showRestartCourse: false,
      showVideo: true,
      isLiked: false,
      isAddedToMyList: false,
      artist: null,
      instructor: null,
      nextLesson: null,
      previousLesson: null,
      selectedAssignment: null,
      resources: null,
      progress: null,
      likes: 0,
      videoId: 0,
      lessonImage: '',
      lessonTitle: '',
      commentId: '',
      sort: 'Popular',
      comment: '',
      description: '',
      publishedOn: '',
      reply: ''
    };
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
    this.limit = 10;
    this.getContent();
  };

  componentWillUnmount = () =>
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);

  getContent = async () => {
    let content, comments;
    if (!this.context.isConnected) {
      content =
        offlineContent[this.state.id]?.lesson ||
        offlineContent[
          this.props.route?.params?.parentId
        ]?.overview.lessons.find(l => l.id === this.state.id);
      comments = content.comments;
      this.allCommentsNum = comments.length;
    } else {
      let result;
      if (this.props.route?.params?.url) {
        result = await methodService.getMethodContent(this.state.url);
      } else {
        result = await contentService.getContent(this.state.id);
      }
      if (result.title && result.message) {
        return this.alert?.toggle(result.title, result.message);
      }
      content = result;
      this.allCommentsNum = result.total_comments;
    }

    let al = [];
    if (content.assignments) {
      for (let i in content.assignments) {
        let a = content.assignments[i];
        al.push({
          id: a.id,
          xp: a.xp,
          index: i,
          progress:
            parseInt(Object.values(a.user_progress)?.[0]?.progress_percent) ||
            0,
          title: a.title,
          description: a.description,
          slug: a.soundslice_slug,
          sheets: a.sheet_music_image_url,
          timeCodes: a.timecode
        });
      }
    }

    this.setState(
      {
        youtubeId: content.youtube_video_id,
        comments: content.comments,
        id: content.id,
        url: content.mobile_app_url,
        type: content.type,
        videoId: content.vimeo_video_id,
        lessonImage: content.thumbnail_url,
        lessonTitle: content.title,
        style: content.style,
        description:
          content.type === 'song-part'
            ? content.instructor.map(i => i.biography)
            : content.description,
        chapters: content.chapters,
        xp: content.xp,
        artist: content.artist,
        instructor: content.instructor,
        isLoadingAll: false,
        publishedOn: content.published_on,
        relatedLessons: content.related_lessons,
        likes: parseInt(content.like_count),
        isLiked: content.is_liked_by_current_user,
        lengthInSec: content.length_in_seconds,
        lastWatchedPosInSec: content.last_watch_position_in_seconds,
        progress:
          parseInt(
            Object.values(content.user_progress)?.[0].progress_percent
          ) || 0,
        isAddedToMyList: content.is_added_to_primary_playlist,
        assignmentList: al,
        nextLesson: content.next_lesson,
        previousLesson: content.previous_lesson,
        mp3s: content.mp3s || [],
        video_playback_endpoints: content.video_playback_endpoints,
        nextLessonId: content.next_lesson?.id,
        previousLessonId: content.previous_lesson?.id,
        nextLessonUrl: content.next_lesson?.mobile_app_url,
        previousLessonUrl: content.previous_lesson?.mobile_app_url,
        resources:
          content.resources && content.resources.length > 0
            ? Object.keys(content.resources).map(key => {
                return content.resources[key];
              })
            : undefined
      },
      async () => {
        if (this.state.resources) this.createResourcesArr();
        if (!this.state.video_playback_endpoints && !this.state.youtubeId) {
          this.alert?.toggle(
            `We're sorry, there was an issue loading this video, try reloading the lesson.`,
            `If the problem persists please contact support.`
          );
        }
        const { comment, commentId } = this.props.route?.params;
        if (comment)
          this.replies?.toggle(() =>
            this.setState({ selectedComment: comment })
          );
        else if (commentId) {
          const comments = (
            await commentsService.getComments(this.state.id, 'Mine')
          ).data;
          const selectedComment = comments?.find(f => f.id === commentId);
          if (selectedComment)
            this.replies?.toggle(() => this.setState({ selectedComment }));
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

  onBack = () => {
    const { commentId } = this.props.route?.params;
    if (commentId) {
      navigate('LESSONS');
    } else if (this.state.selectedComment) {
      this.replies?.toggle(() => this.setState({ selectedComment: undefined }));
    } else {
      goBack();
    }
    return true;
  };

  fetchComments = async id => {
    let comments = await commentsService.getComments(
      id || this.state.id,
      this.state.sort,
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
          this.props.route?.params?.parentId
        ]?.overview.lessons.find(l => l.id === id)
      )
        this.resetState(id, url);
      else this.context.showNoConnectionAlert();
    else this.resetState(id, url);
  }

  likeComment = id => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
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

  makeComment = () => {
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
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let { comments } = this.state;
    this.allCommentsNum -= 1;
    this.setState({ comments: comments.filter(c => c.id !== id) });
    commentsService.deleteComment(id);
  };

  lastPostTime(date) {
    let dif = new Date() - new Date(date);
    if (dif < 120 * 1000) return `1 Minute Ago`;
    if (dif < 60 * 1000 * 60)
      return `${(dif / 1000 / 60).toFixed()} Minutes Ago`;
    if (dif < 60 * 1000 * 60 * 2) return `1 Hour Ago`;
    if (dif < 60 * 1000 * 60 * 24)
      return `${(dif / 1000 / 60 / 60).toFixed()} Hours Ago`;
    if (dif < 60 * 1000 * 60 * 48) return `1 Day Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 30)
      return `${(dif / 1000 / 60 / 60 / 24).toFixed()} Days Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 60) return `1 Month Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 30 * 12)
      return `${(dif / 1000 / 60 / 60 / 24 / 30).toFixed()} Months Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 365 * 2) return `1 Year Ago`;
    return `${(dif / 1000 / 60 / 60 / 24 / 365).toFixed()} Years Ago`;
  }

  mapComments() {
    return this.state.comments.map((item, index) => (
      <View key={index} style={localStyles.commentContainer}>
        <View style={localStyles.commentUser}>
          <FastImage
            style={{
              height: onTablet ? 60 : 40,
              width: onTablet ? 60 : 40,
              borderRadius: 100,
              marginTop: 10
            }}
            source={{
              uri: item.user['fields.profile_picture_image_url']
            }}
            resizeMode={FastImage.resizeMode.stretch}
          />
          <Text style={localStyles.userXp}>{this.changeXP(item.user.xp)}</Text>
        </View>

        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={localStyles.commentText}>{item.comment}</Text>

          <Text style={localStyles.userTags}>
            {item.user['display_name']} | {item.user.rank} |{' '}
            {this.lastPostTime(item.created_on)}
          </Text>

          <View style={localStyles.commentIconsContainer}>
            <View style={{ flexDirection: 'row', marginRight: 15 }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => this.likeComment(item.id)}
              >
                <Icon.AntDesign
                  name={item.is_liked ? 'like1' : 'like2'}
                  size={sizing.infoButtonSize}
                  color={colors.pianoteRed}
                />
              </TouchableOpacity>
              {item.like_count > 0 && (
                <View style={localStyles.bubble}>
                  <Text style={localStyles.bubbleText}>
                    {item.like_count} {item.like_count === 1 ? 'LIKE' : 'LIKES'}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{
                  marginRight: 10,
                  marginLeft: -2.5
                }}
                onPress={() =>
                  this.replies?.toggle(() =>
                    this.setState({ selectedComment: item })
                  )
                }
              >
                <Icon.MaterialCommunityIcons
                  name={'comment-text-outline'}
                  size={sizing.infoButtonSize}
                  color={colors.pianoteRed}
                />
              </TouchableOpacity>
              {item.replies?.length > 0 && (
                <View style={localStyles.bubble}>
                  <Text style={localStyles.bubbleText}>
                    {item.replies?.length}{' '}
                    {item.replies?.length === 1 ? 'REPLY' : 'REPLIES'}
                  </Text>
                </View>
              )}
            </View>
            {this.props.user.id === item.user_id && (
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => this.deleteComment(item.id)}
              >
                <Icon.AntDesign
                  name={'delete'}
                  size={sizing.infoButtonSize}
                  color={colors.pianoteRed}
                />
              </TouchableOpacity>
            )}
          </View>

          {item.replies?.length !== 0 && (
            <TouchableOpacity
              onPress={() =>
                this.replies?.toggle(() =>
                  this.setState({ selectedComment: item })
                )
              }
            >
              <Text style={localStyles.repliesText}>
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
      }
      num = (num / 1000).toFixed(1).toString();
      num = num + 'k';
      return num + ' XP';
    }
  };

  async onResetProgress() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
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
        : res.type !== 'course'
        ? res.user_progress?.[this.props.user.id]?.progress_percent
        : state.progress
    }));
  }

  async onComplete(id) {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
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
    if (res?.parent) {
      if (res.parent.type !== 'course') {
        this.setState({
          progress: Object.values(res.parent.user_progress)?.[0]
            .progress_percent
        });
      }
    }
  }

  likeOrDislikeLesson = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.state.isLiked
      ? unlikeContent(this.state.id)
      : likeContent(this.state.id);
    this.setState({
      isLiked: !this.state.isLiked,
      likes: this.state.isLiked ? this.state.likes - 1 : this.state.likes + 1
    });
  };

  toggleMyList = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.state.isAddedToMyList
      ? removeFromMyList(this.state.id)
      : addToMyList(this.state.id);
    this.setState({ isAddedToMyList: !this.state.isAddedToMyList });
  };

  renderAssignments() {
    return this.state.assignmentList.map((row, index) => {
      return (
        <TouchableOpacity
          style={localStyles.assignmentBtn}
          key={index}
          onPress={() => {
            let assignment = row;
            assignment.index = index + 1;
            this.setState({ selectedAssignment: assignment });
          }}
        >
          <Text numberOfLines={1} style={localStyles.assignmentBtnText}>
            {index + 1}. {row.title}
          </Text>

          {row.progress === 100 ? (
            <Icon.AntDesign
              name={'checkcircle'}
              size={onTablet ? 25 : 20}
              style={{ paddingVertical: 5 }}
              color={colors.pianoteRed}
            />
          ) : (
            <Icon.Entypo
              name={'chevron-thin-right'}
              size={onTablet ? 25 : 20}
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
    let styleTag = style ? `${style.toUpperCase()} | ` : '';
    let artistTag = artist ? `${artist.toUpperCase()} | ` : '';
    let xpTag = `${xp || 0} XP`;
    let instructorTag = instructor
      ? `${instructor
          .map(i => i.name)
          .join(',')
          .toUpperCase()} | `
      : '';

    switch (type) {
      case 'song-part':
        return artistTag + styleTag + xpTag;
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

  secondsToTime = seconds => {
    if (seconds < 1) return '0:00';
    let h = parseInt(seconds / 3600);
    let m = parseInt((seconds - h * 3600) / 60);
    let s = parseInt(seconds - m * 60 - h * 3600);
    s = `${s < 10 ? 0 : ''}${s}`;
    m = `${h && m < 10 ? 0 : ''}${m}`;
    return h ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  render() {
    let { id, comments, youtubeId } = this.state;
    return (
      <View style={localStyles.lessonContainer}>
        <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
        {this.state.showVideo && (
          <>
            {this.state.isLoadingAll ||
            (!this.state.video_playback_endpoints && !youtubeId) ? (
              <View style={localStyles.videoPlaceholder}>
                <TouchableOpacity
                  onPress={() => this.onBack()}
                  style={localStyles.backBtnContainer}
                >
                  <ArrowLeft
                    width={onTablet ? 25 : 18}
                    height={onTablet ? 25 : 18}
                    fill={'white'}
                  />
                </TouchableOpacity>
                <ActivityIndicator size='large' color='#ffffff' />
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
                onBack={this.onBack}
                showControls={true}
                paused={true}
                goToNextLesson={() => {
                  if (this.state.nextLesson)
                    this.switchLesson(
                      this.state.nextLesson.id,
                      this.state.nextLesson.mobile_app_url
                    );
                }}
                goToPreviousLesson={() => {
                  if (this.state.previousLesson)
                    this.switchLesson(
                      this.state.previousLesson.id,
                      this.state.previousLesson.mobile_app_url
                    );
                }}
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
                }}
              />
            )}
          </>
        )}
        {!this.state.isLoadingAll ? (
          <View style={localStyles.belowVideoContainer}>
            <View style={{ flex: 1 }}>
              {this.state.selectedAssignment ? (
                <Assignment
                  onSeek={time => this.video?.onSeek?.(time)}
                  assignment={this.state.selectedAssignment}
                  assignmentProgress={this.state.selectedAssignment.progress}
                  onAssignmentFullscreen={() =>
                    this.setState({ showVideo: !this.state.showVideo })
                  }
                  onX={() => this.setState({ selectedAssignment: null })}
                  onCompleteAssignment={() => {
                    if (this.state.selectedAssignment.progress === 100) {
                      this.setState({ showRestartCourse: true });
                    } else {
                      this.onComplete(this.state.selectedAssignment.id);
                    }
                  }}
                />
              ) : (
                <KeyboardAwareScrollView
                  innerRef={ref => (this.scroll = ref)}
                  style={localStyles.belowVideoContainer}
                  keyboardShouldPersistTaps='handled'
                  removeClippedSubviews={false}
                  showsVerticalScrollIndicator={false}
                  contentInsetAdjustmentBehavior={'never'}
                  onScroll={({ nativeEvent }) => {
                    if (!isiOS && this.isCloseToBottom(nativeEvent)) {
                      this.loadMoreComments();
                    }
                  }}
                  onMomentumScrollEnd={({ nativeEvent }) => {
                    if (isiOS && this.isCloseToBottom(nativeEvent)) {
                      this.loadMoreComments();
                    }
                  }}
                  refreshControl={
                    <RefreshControl
                      colors={[colors.pianoteRed]}
                      refreshing={this.state.isLoadingAll}
                      onRefresh={() =>
                        this.setState({ isLoadingAll: true }, () =>
                          this.getContent()
                        )
                      }
                    />
                  }
                >
                  <Text style={localStyles.lessonTitle}>
                    {this.state.lessonTitle}
                  </Text>
                  <Text style={localStyles.tags}>
                    {this.renderTagsDependingOnContentType()}
                  </Text>
                  <View style={localStyles.iconsContainer}>
                    <TouchableOpacity
                      onPress={this.likeOrDislikeLesson}
                      style={localStyles.iconBtn}
                    >
                      <Icon.AntDesign
                        name={this.state.isLiked ? 'like1' : 'like2'}
                        size={sizing.infoButtonSize}
                        color={colors.pianoteRed}
                      />
                      <Text style={localStyles.belowIconText}>
                        {this.state.likes}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.toggleMyList}
                      style={localStyles.iconBtn}
                    >
                      <Icon.AntDesign
                        name={this.state.isAddedToMyList ? 'close' : 'plus'}
                        size={sizing.myListButtonSize}
                        color={colors.pianoteRed}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: sizing.descriptionText,
                          color: 'white'
                        }}
                      >
                        {this.state.isAddedToMyList ? 'Added' : 'My List'}
                      </Text>
                    </TouchableOpacity>
                    {this.state.resources && (
                      <TouchableOpacity
                        onPress={() => this.setState({ showResDownload: true })}
                        style={localStyles.iconBtn}
                      >
                        <Resources
                          height={sizing.infoButtonSize}
                          width={sizing.infoButtonSize}
                          fill={colors.pianoteRed}
                        />
                        <Text style={localStyles.belowIconText}>Resources</Text>
                      </TouchableOpacity>
                    )}
                    <Download_V2
                      entity={{
                        id,
                        comments,
                        content: this.props.route?.params?.url
                          ? methodService.getMethodContent(this.state.url)
                          : contentService.getContent(this.state.id)
                      }}
                      styles={{
                        touchable: { flex: 1 },
                        iconSize: {
                          width: sizing.myListButtonSize,
                          height: sizing.myListButtonSize
                        },
                        iconDownloadColor: colors.pianoteRed,
                        activityIndicatorColor: colors.pianoteRed,
                        animatedProgressBackground: colors.pianoteRed,
                        textStatus: {
                          color: '#ffffff',
                          fontSize: sizing.descriptionText,
                          fontFamily: 'OpenSans-Regular'
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
                      onPress={() =>
                        this.setState({
                          showInfo: !this.state.showInfo
                        })
                      }
                      style={localStyles.iconBtn}
                    >
                      <Icon.AntDesign
                        name={
                          this.state.showInfo ? 'infocirlce' : 'infocirlceo'
                        }
                        size={sizing.infoButtonSize}
                        color={colors.pianoteRed}
                      />
                      <Text style={localStyles.belowIconText}>Info</Text>
                    </TouchableOpacity>
                  </View>

                  <View>
                    {this.state.showInfo && (
                      <>
                        <Text style={localStyles.description}>
                          {this.state.description}
                        </Text>
                        {this.state.chapters?.map(item => (
                          <TouchableOpacity
                            style={localStyles.timecodeBtn}
                            onPress={() =>
                              this.video?.onSeek?.(item.chapter_timecode)
                            }
                          >
                            <Text style={localStyles.timeCodeDescription}>
                              <Text style={localStyles.timecode}>
                                {this.secondsToTime(item.chapter_timecode)}
                              </Text>{' '}
                              - {item.chapter_description}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </>
                    )}
                  </View>
                  {this.state.assignmentList?.length > 0 && (
                    <View style={{ marginVertical: 20 }}>
                      <Text style={localStyles.assignment}>ASSIGNMENTS</Text>
                      {this.renderAssignments()}
                    </View>
                  )}
                  {this.state.relatedLessons.length > 0 && (
                    <View style={{ marginTop: 10 }}>
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
                        imageWidth={(onTablet ? 0.2 : 0.28) * width}
                        navigator={row =>
                          this.switchLesson(row.id, row.mobile_app_url)
                        }
                      />
                    </View>
                  )}

                  <>
                    <View style={localStyles.commentTitleContainer}>
                      <Text style={localStyles.commentsNum}>
                        {this.allCommentsNum + ' COMMENTS'}
                      </Text>
                      {this.context.isConnected && (
                        <TouchableOpacity
                          onPress={() => this.setState({ showSort: true })}
                        >
                          <Icon.FontAwesome5
                            size={onTablet ? 20 : 15}
                            name={'sort-amount-down'}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => this.setState({ showMakeComment: true })}
                      style={localStyles.commentInputBtn}
                    >
                      <FastImage
                        style={{
                          height: onTablet ? 60 : 40,
                          width: onTablet ? 60 : 40,
                          paddingVertical: 10,
                          borderRadius: 100
                        }}
                        source={{
                          uri:
                            this.props.user.profile_picture_url ||
                            'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                      />

                      <Text style={localStyles.commentPlaceholder}>
                        Add a comment...
                      </Text>
                    </TouchableOpacity>

                    {this.state.isLoadingComm && (
                      <ActivityIndicator
                        size='small'
                        style={{ padding: 10 }}
                        color={colors.secondBackground}
                      />
                    )}
                    {this.state.comments.length > 0 && this.mapComments()}
                  </>
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
                    this.replies?.toggle(() =>
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
              ref={r => (this.replies = r)}
              comment={this.state.selectedComment}
              me={{
                userId: this.props.user.id,
                profileImage: this.props.user.profile_picture_url
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
          <View style={{ backgroundColor: colors.mainBackground }}>
            <View style={localStyles.progressBarContainer}>
              {!!this.state.progress && (
                <View
                  testID='progress'
                  style={[
                    localStyles.progress,
                    { width: this.state.progress + '%' }
                  ]}
                />
              )}
            </View>
            <SafeAreaView style={localStyles.bottomSafeArea}>
              <TouchableOpacity
                style={[
                  localStyles.prevBtn,
                  {
                    borderColor: this.state.previousLesson
                      ? colors.pianoteRed
                      : colors.secondBackground
                  }
                ]}
                disabled={!this.state.previousLesson?.id}
                onPress={() =>
                  this.switchLesson(
                    this.state.previousLesson.id,
                    this.state.previousLesson.mobile_app_url
                  )
                }
              >
                <Icon.Entypo
                  name={'chevron-thin-left'}
                  size={onTablet ? 22.5 : 17.5}
                  style={{ padding: 5 }}
                  color={
                    this.state.previousLesson
                      ? colors.pianoteRed
                      : colors.secondBackground
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.heightButtons, localStyles.completeBtn]}
                onPress={() =>
                  this.state.progress === 100
                    ? this.setState({ showRestartCourse: true })
                    : this.onComplete(this.state.id)
                }
              >
                <Text style={localStyles.completeBtnText}>
                  {this.state.progress === 100
                    ? 'COMPLETED'
                    : 'COMPLETE LESSON'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  localStyles.nextBtn,
                  {
                    borderColor: this.state.nextLesson
                      ? colors.pianoteRed
                      : colors.secondBackground
                  }
                ]}
                disabled={!this.state.nextLesson?.id}
                onPress={() =>
                  this.switchLesson(
                    this.state.nextLesson.id,
                    this.state.nextLesson.mobile_app_url
                  )
                }
              >
                <Icon.Entypo
                  name={'chevron-thin-right'}
                  size={onTablet ? 22.5 : 17.5}
                  style={{ padding: 5 }}
                  color={
                    this.state.nextLesson
                      ? colors.pianoteRed
                      : colors.secondBackground
                  }
                />
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        )}

        {this.state.selectedAssignment && (
          <AssignmentComplete
            onBackButtonPress={() =>
              this.setState({ showAssignmentComplete: false })
            }
            isVisible={this.state.showAssignmentComplete}
            title={this.state.selectedAssignment.title}
            xp={this.state.selectedAssignment.xp}
            hideAssignmentComplete={() => {
              this.setState({ showAssignmentComplete: false });
            }}
          />
        )}
        <Modal
          visible={this.state.showResDownload}
          transparent={true}
          onDismiss={() => this.modalDismissed}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={350}
          animationOutTiming={350}
          coverScreen={true}
          hasBackdrop={true}
          onBackButtonPress={() =>
            new Promise(res =>
              this.setState(
                {
                  showResDownload: false
                },
                () => (isiOS ? (this.modalDismissed = res) : res())
              )
            )
          }
        >
          <TouchableOpacity style={localStyles.modalContainer}>
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
                    () => (isiOS ? (this.modalDismissed = res) : res())
                  )
                );
              }}
            />
          </TouchableOpacity>
        </Modal>
        {!this.state.isLoadingAll && (
          <>
            <LessonComplete
              onBackButtonPress={() =>
                this.setState({ showLessonComplete: false })
              }
              isVisible={this.state.showLessonComplete}
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
                    this.state.nextLesson.mobile_app_url
                  );
                }
              }}
            />
            <RestartCourse
              isVisible={this.state.showRestartCourse}
              onBackButtonPress={() =>
                this.setState({ showRestartCourse: false })
              }
              hideRestartCourse={() =>
                this.setState({ showRestartCourse: false })
              }
              type={
                this.state.selectedAssignment ? 'assignment' : this.state.type
              }
              onRestart={() => this.onResetProgress()}
            />

            <OverviewComplete
              isVisible={this.state.showOverviewComplete}
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
            />
          </>
        )}
        {this.state.showSort && (
          <Sort
            type={'comments'}
            hideSort={() => this.setState({ showSort: false })}
            currentSort={this.state.sort}
            changeSort={sort => {
              this.setState({ sort }, () => {
                this.limit = 10;
                this.fetchComments();
              });
            }}
          />
        )}
        <CustomModal
          ref={r => (this.alert = r)}
          additionalBtn={
            <TouchableOpacity
              onPress={() => {
                this.setState({ isLoadingAll: true }, () => this.getContent());
                this.alert?.toggle();
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
            visible={this.state.showMakeComment}
            transparent={true}
            style={styles.modalContainer}
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
              style={localStyles.modalContainer}
              onPress={() => this.setState({ showMakeComment: false })}
            >
              <KeyboardAvoidingView
                behavior={`${isiOS ? 'padding' : ''}`}
                style={{ flex: 1, justifyContent: 'flex-end' }}
              >
                <View style={localStyles.inputContainer}>
                  <FastImage
                    style={{
                      height: onTablet ? 60 : 40,
                      width: onTablet ? 60 : 40,
                      paddingVertical: 10,
                      borderRadius: 100,
                      marginRight: 10
                    }}
                    source={{
                      uri:
                        this.props.user.profile_picture_url ||
                        'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                  />
                  <TextInput
                    autoFocus={true}
                    multiline={true}
                    style={localStyles.textInput}
                    onSubmitEditing={() => this.makeComment()}
                    returnKeyType={'go'}
                    onChangeText={comment => this.setState({ comment })}
                    placeholder={'Add a comment'}
                    placeholderTextColor={colors.secondBackground}
                  />
                  <TouchableOpacity
                    style={{
                      marginBottom: isiOS ? 0 : 10,
                      marginLeft: 20
                    }}
                    onPress={() => this.makeComment()}
                  >
                    <Icon.Ionicons
                      name={'md-send'}
                      size={onTablet ? 25 : 17.5}
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

const mapStateToProps = state => ({ user: state.userState.user });

export default connect(mapStateToProps, null)(ViewLesson);

const setStyles = (appColor, size) =>
  StyleSheet.create({
    lessonContainer: {
      backgroundColor: appColor.mainBackground,
      width: '100%',
      height: '100%'
    },
    videoPlaceholder: {
      backgroundColor: 'black',
      aspectRatio: 16 / 9,
      justifyContent: 'center'
    },
    backBtnContainer: {
      top: 0,
      left: 0,
      padding: 15,
      position: 'absolute',
      justifyContent: 'center'
    },
    belowVideoContainer: {
      flex: 1,
      backgroundColor: appColor.mainBackground
    },
    lessonTitle: {
      fontSize: size.titleViewLesson,
      marginTop: 15,
      marginBottom: 5,
      fontFamily: 'OpenSans-Bold',
      textAlign: 'center',
      color: 'white',
      paddingHorizontal: 10
    },
    tags: {
      fontSize: size.descriptionText,
      fontFamily: 'OpenSans-Regular',
      textAlign: 'center',
      color: appColor.secondBackground,
      paddingBottom: 20
    },
    iconsContainer: {
      paddingHorizontal: 10,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignContent: 'space-around'
    },
    iconBtn: {
      flex: 1,
      alignItems: 'center'
    },
    belowIconText: {
      textAlign: 'center',
      fontSize: size.descriptionText,
      color: 'white',
      marginTop: 5
    },
    description: {
      paddingHorizontal: 10,
      paddingTop: 20,
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      textAlign: 'left',
      color: 'white'
    },
    timecodeBtn: {
      alignSelf: 'flex-start',
      paddingVertical: 5
    },
    timeCodeDescription: {
      color: 'white',
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      marginTop: 5,
      paddingHorizontal: 10,
      textAlign: 'left'
    },
    timecode: {
      color: '#007AFF',
      textDecorationLine: 'underline'
    },
    assignment: {
      padding: 10,
      fontSize: size.verticalListTitleSmall,
      fontFamily: 'RobotoCondensed-Bold',
      color: appColor.secondBackground,
      borderBottomColor: appColor.secondBackground,
      borderBottomWidth: 1
    },
    commentTitleContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 10
    },
    commentsNum: {
      fontSize: size.verticalListTitleSmall,
      fontFamily: 'RobotoCondensed-Bold',
      color: appColor.secondBackground
    },
    commentInputBtn: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 20,
      flex: 1
    },
    commentPlaceholder: {
      textAlign: 'left',
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      color: 'white',
      paddingLeft: 10,
      alignSelf: 'center'
    },
    progressBarContainer: {
      backgroundColor: appColor.secondBackground,
      height: 2,
      width: '100%'
    },
    progress: {
      backgroundColor: appColor.pianoteRed,
      height: 3,
      alignItems: 'flex-end',
      justifyContent: 'center',
      position: 'relative'
    },
    bottomSafeArea: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      marginTop: 5,
      paddingVertical: 5,
      marginHorizontal: 5
    },
    prevBtn: {
      borderRadius: 500,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10
    },
    completeBtn: {
      backgroundColor: appColor.pianoteRed,
      borderRadius: 500,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    completeBtnText: {
      color: 'white',
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: size.verticalListTitleSmall
    },
    nextBtn: {
      borderRadius: 500,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,.5)'
    },
    textInput: {
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      flex: 1,
      backgroundColor: appColor.mainBackground,
      color: appColor.secondBackground,
      paddingVertical: 10
    },
    inputContainer: {
      backgroundColor: appColor.mainBackground,
      flexDirection: 'row',
      padding: 10,
      alignItems: 'center',
      borderTopWidth: 0.5,
      borderTopColor: appColor.secondBackground
    },
    assignmentBtn: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderBottomColor: appColor.secondBackground,
      borderBottomWidth: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row'
    },
    assignmentBtnText: {
      fontSize: size.verticalListTitleSmall,
      color: appColor.secondBackground,
      fontFamily: 'RobotoCondensed-Bold',
      maxWidth: '90%'
    },
    commentContainer: {
      backgroundColor: appColor.mainBackground,
      borderTopColor: appColor.secondBackground,
      flex: 1,
      borderTopWidth: 0.25,
      flexDirection: 'row',
      paddingTop: 10,
      paddingHorizontal: 10
    },
    commentUser: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingBottom: 10
    },
    userXp: {
      fontFamily: 'OpenSans-Bold',
      fontSize: 12,
      paddingTop: 5,
      color: appColor.pianoteGrey
    },
    commentText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      color: 'white',
      paddingTop: 10
    },
    userTags: {
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      color: appColor.secondBackground,
      paddingTop: 5,
      paddingBottom: 10
    },
    commentIconsContainer: {
      flexDirection: 'row',
      paddingBottom: 15,
      paddingTop: 5
    },
    bubble: {
      borderRadius: 40,
      backgroundColor: appColor.notificationColor,
      alignItems: 'center',
      justifyContent: 'center'
    },
    bubbleText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      color: appColor.pianoteRed,
      paddingHorizontal: 5
    },
    repliesText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: size.descriptionText,
      color: appColor.secondBackground,
      marginBottom: 10
    }
  });
