/**
 * VerticalVideoList
 */
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Image
} from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

import { addToMyList, removeFromMyList } from '../services/UserActions';
import Relevance from '../modals/Relevance';
import ContentModal from '../modals/ContentModal';
import GradientFeature from '../components/GradientFeature';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';
import { NetworkContext } from '../context/NetworkProvider';
import AddToCalendar from '../modals/AddToCalendar';
import Filters_V2 from './Filters_V2';
import { navigate } from '../../AppNavigator';

const sortDict = {
  newest: 'NEWEST',
  oldest: 'OLDEST',
  popularity: 'POPULAR',
  trending: 'TRENDING',
  relevance: 'RELEVANCE'
};

let greaterWDim;

export default class VerticalVideoList extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      outVideos: this.props.outVideos,
      isLoading: this.props.isLoading,
      showRelevance: false,
      items: this.props.items,

      isPaging: false,
      addToCalendarModal: false
    };
  }

  componentWillReceiveProps = props => {
    if (props.isPaging !== this.state.isPaging) {
      if (!this.state.isLoading) {
        this.setState({ isPaging: props.isPaging });
      }
    }
    if (props.outVideos !== this.state.outVideos) {
      this.setState({ outVideos: props.outVideos });
    }
    if (props.isLoading !== this.state.isLoading) {
      this.setState({
        isLoading: props.isLoading,
        items: [...this.state.items, ...props.items]
      });
    } else if (props.items !== this.state.items) {
      this.setState({
        items: props.items
      });
    }
  };

  showSpinner = () => {
    return (
      <View style={[styles.centerContent, { minHeight: 40 }]}>
        <View style={{ flex: 1 }} />
        <ActivityIndicator
          size={onTablet ? 'large' : 'small'}
          animating={true}
          color={
            this.props.isMethod ? colors.pianoteGrey : colors.secondBackground
          }
        />
        <View style={{ flex: 1 }} />
      </View>
    );
  };

  addToMyList = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    for (i in this.state.items) {
      if (this.state.items[i].id == contentID) {
        this.state.items[i].isAddedToList = true;
      }
    }
    addToMyList(contentID);
    this.setState({ items: this.state.items });
  };

  removeFromMyList = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    for (i in this.state.items) {
      if (this.state.items[i].id == contentID) {
        this.state.items[i].isAddedToList = false;
      }
    }
    removeFromMyList(contentID);
    // if on my list page and user removes then delete item from listview
    if (this.props.type == 'MYLIST') {
      this.props.removeItem(contentID);
    }
    this.setState({ items: this.state.items });
  };

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';

    for (let i = 0; i < word.length; i++) {
      if (word[i] !== 'and') {
        word[i] = word[i][0].toUpperCase() + word[i].substr(1);
      }
    }

    for (i in word) {
      string = string + word[i] + ' ';
    }

    return string;
  };

  like = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    for (i in this.state.items) {
      if (this.state.items[i].id == contentID) {
        this.state.items[i].isLiked = !this.state.items[i].isLiked;
        this.state.items[i].like_count = this.state.items[i].isLiked
          ? this.state.items[i].like_count + 1
          : this.state.items[i].like_count - 1;
      }
    }
    this.setState({ items: this.state.items });
  };

  addEventToCalendar = () => {
    const eventConfig = {
      title: this.addToCalendarLessonTitle,
      startDate: new Date(this.addToCalendatLessonPublishDate),
      endDate: new Date(this.addToCalendatLessonPublishDate)
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        this.addToCalendarLessonTitle = '';
        this.addToCalendatLessonPublishDate = '';
        this.setState({ addToCalendarModal: false });
      })
      .catch(e => {});
  };

  navigate = (content, index) => {
    if (
      !this.context.isConnected &&
      this.props.title !== 'RELATED LESSONS' &&
      this.props.title !== 'METHOD'
    )
      return this.context.showNoConnectionAlert();
    if (
      this.props.title !== 'METHOD' &&
      new Date(content.publishedOn) > new Date()
    ) {
      return;
    }
    if (this.props.navigator) return this.props.navigator(content, index);
    switch (content.type) {
      case 'course':
        return navigate('PATHOVERVIEW', {
          data: content,
          isMethod: false
        });
      case 'song':
        if (content.lesson_count === 1)
          return navigate('VIDEOPLAYER', {
            id: content.currentLessonId
          });
        return navigate('PATHOVERVIEW', {
          data: content,
          isMethod: false
        });
      case 'learning-path':
        return navigate('METHOD', {
          url: content.mobile_app_url
        });
      case 'learning-path-level':
        return navigate('METHODLEVEL', {
          url: content.mobile_app_url,
          level: index + 1
        });
      case 'learning-path-course':
        return navigate('PATHOVERVIEW', {
          data: content,
          isMethod: true
        });
      case 'unit':
        return navigate('PATHOVERVIEW', {
          data: content,
          isFoundations: true
        });
      case 'learning-path-lesson':
        return navigate('VIDEOPLAYER', {
          url: content.mobile_app_url
        });
      case 'pack':
        return navigate('SINGLEPACK', {
          url: content.mobile_app_url
        });
      case 'pack-bundle':
        return navigate('SINGLEPACK', {
          url: content.mobile_app_url
        });
      case 'pack-bundle-lesson':
        return navigate('VIDEOPLAYER', {
          url: content.mobile_app_url
        });
      default:
        return navigate('VIDEOPLAYER', {
          id: content.id
        });
    }
  };

  getImageUrl(thumbnail, publishDate) {
    if (thumbnail.includes('var/mobile') || thumbnail.includes('data/user'))
      return thumbnail;
    if (thumbnail.includes('http')) {
      return `https://cdn.musora.com/image/fetch/w_${Math.round(
        this.props.imageWidth * 2
      )},ar_${
        this.props.isSquare ? '1' : '16:9'
      },fl_lossy,q_auto:eco,c_fill,g_face/${thumbnail}`;
    }
    if (new Date(publishDate) > new Date()) {
      return `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,e_grayscale/${fallbackThumb}`;
    }
    return fallbackThumb;
  }

  renderMappedList = () => {
    if (this.state.items.length == 0 && this.state.outVideos) {
      return;
    } else if (this.state.isLoading) {
      return this.showSpinner();
    }

    return this.state.items.map((row, index) => {
      return (
        <TouchableOpacity
          key={index}
          onLongPress={() => {
            row.type == 'learning-path-level' || row.type == 'unit'
              ? null
              : this.setState({
                  showModal: true,
                  item: row
                });
          }}
          onPress={() => this.navigate(row, index)}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginLeft: 10,
              paddingVertical: onTablet ? 10 : 5
            }}
          >
            <View
              style={{
                width: this.props.imageWidth,
                aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                borderRadius: 5
              }}
            >
              {row.isCompleted && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                    borderRadius: 5,
                    zIndex: 1,
                    opacity: 0.2,
                    backgroundColor: colors.pianoteRed
                  }}
                />
              )}
              <View
                style={[
                  styles.centerContent,
                  {
                    position: 'absolute',
                    width: '100%',
                    paddingBottom: this.props.isMethodLevel ? 10 : 0,
                    aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                    zIndex: 20
                  }
                ]}
              >
                {row.isStarted ? (
                  <Progress
                    height={onTablet ? 60 : 35}
                    width={onTablet ? 60 : 35}
                    fill={'white'}
                  />
                ) : row.isCompleted ? (
                  <ApprovedTeacher
                    height={onTablet ? 70 : 45}
                    width={onTablet ? 70 : 45}
                    fill={'white'}
                  />
                ) : null}
              </View>
              {this.props.showLines && (
                <>
                  <View
                    style={[
                      styles.centerContent,
                      {
                        top: -3,
                        height: 3,
                        left: 0,
                        zIndex: 9,
                        width: '100%',
                        position: 'absolute'
                      }
                    ]}
                  >
                    <View
                      style={{
                        backgroundColor: 'red',
                        width: '95%',
                        height: '100%',
                        borderRadius: 20
                      }}
                    />
                  </View>
                  <View
                    style={[
                      styles.centerContent,
                      {
                        position: 'absolute',
                        top: -6,
                        left: 0,
                        width: '100%',
                        height: 6,
                        zIndex: 8
                      }
                    ]}
                  >
                    <View
                      style={{
                        backgroundColor: '#7c1526',
                        width: '90%',
                        height: '100%',
                        borderRadius: 20
                      }}
                    />
                  </View>
                </>
              )}
              {this.props.isMethodLevel && (
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 15,
                    elevation: 15
                  }}
                >
                  <GradientFeature
                    color={'red'}
                    opacity={1}
                    height={'100%'}
                    borderRadius={5}
                  />
                  <View style={{ flex: 2.5 }} />
                  <Text
                    style={{
                      zIndex: 20,
                      elevation: 20,
                      textAlign: 'center',
                      marginBottom: 5,
                      color: 'white',
                      fontFamily: 'RobotoCondensed-Bold',
                      fontSize: sizing.titleVideoPlayer
                    }}
                  >
                    LEVEL {index + 1}
                  </Text>
                </View>
              )}
              {Platform.OS === 'ios' ? (
                <FastImage
                  style={{
                    flex: 1,
                    borderRadius: 5
                  }}
                  source={{
                    uri: this.getImageUrl(row.thumbnail, row.publishedOn)
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <Image
                  style={{
                    flex: 1,
                    borderRadius: 5
                  }}
                  source={{
                    uri: this.getImageUrl(row.thumbnail, row.publishedOn)
                  }}
                  resizeMode='cover'
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                paddingLeft: onTablet ? 10 : 5,
                justifyContent: 'center'
              }}
            >
              {this.props.isMethodLevel && (
                <Text
                  style={{
                    fontSize: sizing.descriptionText,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontFamily: 'OpenSans-Regular',
                    color: colors.pianoteRed
                  }}
                >
                  {row.artist}
                </Text>
              )}
              <Text
                numberOfLines={2}
                style={{
                  fontSize: sizing.descriptionText,
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontFamily: 'OpenSans-Regular',
                  color: 'white'
                }}
              >
                {row.title}
              </Text>
              {this.props.isMethodLevel && (
                <Text
                  numberOfLines={2}
                  style={{
                    marginTop: 2,
                    fontSize: sizing.descriptionText,
                    color: this.props.isMethod
                      ? colors.pianoteGrey
                      : colors.secondBackground,
                    textAlign: 'left',
                    fontFamily: 'OpenSans-Regular',
                    paddingRight: 10
                  }}
                >
                  {row.description}
                </Text>
              )}
              <View style={{ flexDirection: 'row' }}>
                {this.props.showLength && (
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: sizing.descriptionText,
                      color:
                        this.props.isMethod || this.props.methodLevel
                          ? colors.pianoteGrey
                          : colors.secondBackground,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Regular'
                    }}
                  >
                    {Math.floor(row.duration / 60)}{' '}
                    {Math.floor(row.duration / 60) == 1 ? 'min' : 'mins'}
                  </Text>
                )}
                {this.props.showLines && (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: sizing.descriptionText,
                      color:
                        this.props.isMethod || this.props.methodLevel
                          ? colors.pianoteGrey
                          : colors.secondBackground,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Regular'
                    }}
                  >
                    Level {row.levelNum}.{index + 1}
                  </Text>
                )}
                {this.props.showType && (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: sizing.descriptionText,
                      color: this.props.isMethod
                        ? colors.pianoteGrey
                        : colors.secondBackground,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Regular'
                    }}
                  >
                    {this.changeType(row.type)}/{' '}
                  </Text>
                )}
                {this.props.showArtist && (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: sizing.descriptionText,
                      color: this.props.isMethod
                        ? colors.pianoteGrey
                        : colors.secondBackground,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Regular'
                    }}
                  >
                    {row.artist}
                  </Text>
                )}
              </View>
            </View>
            {!this.props.isMethodLevel && (
              <View style={{ width: 45 }}>
                <View style={[styles.centerContent, { flex: 1 }]}>
                  {new Date(row.publishedOn) > new Date() ? (
                    <TouchableOpacity
                      onPress={() => {
                        this.addToCalendarLessonTitle = row.title;
                        this.addToCalendatLessonPublishDate = row.publishedOn;
                        this.setState({ addToCalendarModal: true });
                      }}
                    >
                      <FontIcon
                        size={sizing.myListButtonSize}
                        name={'calendar-plus'}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  ) : !row.isAddedToList ? (
                    <TouchableOpacity onPress={() => this.addToMyList(row.id)}>
                      <AntIcon
                        name={'plus'}
                        size={sizing.myListButtonSize}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  ) : row.isAddedToList ? (
                    <TouchableOpacity
                      onPress={() => this.removeFromMyList(row.id)}
                    >
                      <AntIcon
                        name={'close'}
                        size={sizing.myListButtonSize}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };

  render = () => {
    return (
      <View>
        <>
          {this.props.showFilter && (
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 2.5
              }}
            >
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  {this.props.showLargeTitle ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: onTablet ? 28 : 20,
                        color: 'white',
                        fontFamily: 'OpenSans-ExtraBold'
                      }}
                    >
                      {this.props.title}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: sizing.verticalListTitleSmall,
                        textAlign: 'left',
                        fontFamily: 'RobotoCondensed-Bold',
                        color: this.props.isMethod
                          ? 'white'
                          : colors.secondBackground
                      }}
                    >
                      {this.props.title}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.centerContent,
                    {
                      width: 45,
                      flexDirection: 'row'
                    }
                  ]}
                >
                  {this.props.showSort && (
                    <TouchableOpacity
                      style={[
                        styles.centerContent,
                        {
                          flexDirection: 'row',
                          position: 'absolute',
                          right: 45,
                          height: '100%'
                        }
                      ]}
                      onPress={() => {
                        this.setState({
                          showRelevance: !this.state.showRelevance
                        });
                      }}
                    >
                      <Text
                        style={{
                          color: colors.pianoteRed,
                          fontSize: sizing.videoTitleText,
                          fontFamily: 'OpenSans-Regular',
                          paddingRight: 5,
                          justifyContent: 'flex-end'
                        }}
                      >
                        {sortDict[this.props.currentSort]}
                      </Text>
                      <FontIcon
                        size={onTablet ? 20 : 15}
                        name={'sort-amount-down'}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  )}
                  {!this.props.hideFilterButton &&
                    !this.props.showTitleOnly && (
                      <Filters_V2
                        isMethod={this.props.isMethod}
                        disabled={!this.props.filters || this.state.isPaging}
                        onApply={() =>
                          this.props.applyFilters?.(this.filters?.filterQuery)
                        }
                        meta={this.props.filters}
                        reference={r => (this.filters = r)}
                      />
                    )}
                </View>
              </View>
            </View>
          )}
          <View style={{ marginHorizontal: 10 }}>
            {this.filters?.filterAppliedText}
          </View>
          {this.state.items.length == 0 &&
            this.state.outVideos &&
            !this.state.isLoading && (
              <>
                <Text
                  style={{
                    fontSize: sizing.descriptionText,
                    color: this.props.isMethod
                      ? 'white'
                      : colors.secondBackground,
                    fontFamily: 'OpenSans-Regular',
                    textAlign: 'left',
                    marginLeft: 10
                  }}
                >
                  {this.props.title.includes('SEARCH RESULTS')
                    ? ''
                    : 'There are no results for this content type.'}
                </Text>
              </>
            )}
        </>
        <View style={{ flex: 1 }}>
          {this.renderMappedList()}
          {this.state.isPaging && !this.state.isLoading && (
            <View
              style={[styles.centerContent, { minHeight: 20, marginTop: 20 }]}
            >
              <ActivityIndicator
                size={onTablet ? 'large' : 'small'}
                animating={true}
                color={
                  this.props.isMethod
                    ? colors.pianoteGrey
                    : colors.secondBackground
                }
              />
            </View>
          )}
          <View style={{ flex: 1 }} />
        </View>
        <Modal
          isVisible={this.state.showModal}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <ContentModal
            data={this.state.item}
            hideContentModal={() => this.setState({ showModal: false })}
            like={contentID => this.like(contentID)}
            addToMyList={contentID => this.addToMyList(contentID)}
            removeFromMyList={contentID => this.removeFromMyList(contentID)}
          />
        </Modal>
        <Modal
          isVisible={this.state.showRelevance}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
          backdropColor={'white'}
          backdropOpacity={0.79}
        >
          <Relevance
            hideRelevance={() => {
              this.setState({ showRelevance: false });
            }}
            isMethod={this.props.isMethod}
            currentSort={this.props.currentSort}
            changeSort={sort => {
              this.props.changeSort(sort);
            }}
          />
        </Modal>
        <Modal
          isVisible={this.state.addToCalendarModal}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <AddToCalendar
            hideAddToCalendar={() =>
              this.setState({ addToCalendarModal: false })
            }
            addEventToCalendar={() => this.addEventToCalendar()}
          />
        </Modal>
      </View>
    );
  };
}
