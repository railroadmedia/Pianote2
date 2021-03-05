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
  Dimensions,
  Image
} from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
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

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

const sortDict = {
  newest: 'NEWEST',
  oldest: 'OLDEST',
  popularity: 'POPULAR',
  trending: 'TRENDING',
  relevance: 'RELEVANCE'
};

const instructorDict = {
  197077: 'Brett',
  197087: 'Cassi',
  197106: 'Colin',
  266932: 'Dave',
  247373: 'Sean',
  279887: 'Eleny',
  218895: 'Gabriel',
  202588: 'Jay',
  197048: 'Jonny',
  196994: 'Jordan',
  221245: 'Josh',
  203416: 'Kenny',
  196999: 'Lisa',
  197084: 'Nate',
  243082: 'Sam'
};

let greaterWDim;

class VerticalVideoList extends React.Component {
  static navigationOptions = { header: null };
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
        return this.props.navigation.navigate('PATHOVERVIEW', {
          data: content,
          isMethod: false
        });
      case 'song':
        if (content.lesson_count === 1)
          return this.props.navigation.navigate('VIDEOPLAYER', {
            id: content.currentLessonId
          });
        return this.props.navigation.navigate('PATHOVERVIEW', {
          data: content,
          isMethod: false
        });
      case 'learning-path':
        return this.props.navigation.navigate('METHOD', {
          url: content.mobile_app_url
        });
      case 'learning-path-level':
        return this.props.navigation.navigate('METHODLEVEL', {
          url: content.mobile_app_url,
          level: index + 1
        });
      case 'learning-path-course':
        return this.props.navigation.push('PATHOVERVIEW', {
          data: content,
          isMethod: true
        });
      case 'learning-path-lesson':
        return this.props.navigation.push('VIDEOPLAYER', {
          url: content.mobile_app_url
        });
      case 'pack':
        return this.props.navigation.push('SINGLEPACK', {
          url: content.mobile_app_url
        });
      case 'pack-bundle':
        return this.props.navigation.push('SINGLEPACK', {
          url: content.mobile_app_url
        });
      case 'pack-bundle-lesson':
        return this.props.navigation.push('VIDEOPLAYER', {
          url: content.mobile_app_url
        });
      default:
        return this.props.navigation.navigate('VIDEOPLAYER', {
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
            row.type == 'learning-path-level'
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
              padding: paddingInset,
              flexDirection: 'row',
              borderTopColor: '#ececec'
            }}
          >
            <View style={{ justifyContent: 'center' }}>
              <View
                style={{
                  width: this.props.imageWidth,
                  aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                  borderRadius: 5 * factor
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
                      borderRadius: 5 * factor,
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
                      aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                      zIndex: 20
                    }
                  ]}
                >
                  {row.isStarted ? (
                    <Progress
                      height={onTablet ? 40 : 32.5 * factor}
                      width={onTablet ? 40 : 32.5 * factor}
                      fill={'white'}
                    />
                  ) : row.isCompleted ? (
                    <ApprovedTeacher
                      height={onTablet ? 50 : 40 * factor}
                      width={onTablet ? 50 : 40 * factor}
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
                          top: -3.5 * factor,
                          height: 5 * factor,
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
                          top: -7.5 * factor,
                          left: 0,
                          width: '100%',
                          height: 7.5 * factor,
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
                      borderRadius={5 * factor}
                    />
                    <View style={{ flex: 1.5 }} />
                    <View
                      style={{
                        flex: 1
                      }}
                    />
                    <Text
                      style={{
                        zIndex: 20,
                        elevation: 20,
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'RobotoCondensed-Bold',
                        fontSize: (onTablet ? 16 : 21) * factor
                      }}
                    >
                      LEVEL {index + 1}
                    </Text>
                    <View style={{ height: 5 * factor }} />
                  </View>
                )}
                {Platform.OS === 'ios' ? (
                  <FastImage
                    style={{
                      flex: 1,
                      borderRadius: 5 * factor
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
                      borderRadius: 5 * factor
                    }}
                    source={{
                      uri: this.getImageUrl(row.thumbnail, row.publishedOn)
                    }}
                    resizeMode='cover'
                  />
                )}
              </View>
            </View>
            <View style={{ width: paddingInset / 2 }} />
            <View style={{ flex: 0.85, justifyContent: 'center' }}>
              {this.props.isMethodLevel && (
                <Text
                  style={{
                    fontSize: (onTablet ? 8 : 16) * factor,
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
                  fontSize: (onTablet ? 10 : 16) * factor,
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
                    marginTop: 2 * factor,
                    fontSize: (onTablet ? 8 : 12) * factor,
                    color: this.props.isMethod
                      ? colors.pianoteGrey
                      : colors.secondBackground,
                    textAlign: 'left',
                    fontFamily: 'OpenSans-Regular',
                    paddingRight: paddingInset
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
                      fontSize: (onTablet ? 10 : 12) * factor,
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
                      fontSize: (onTablet ? 8 : 12) * factor,
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
                    numberOfLines={2}
                    style={{
                      fontSize: (onTablet ? 10 : 12) * factor,
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
                    numberOfLines={2}
                    style={{
                      fontSize: (onTablet ? 9 : 12) * factor,
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
              <View style={{ flex: 0.15 }}>
                <View style={[styles.centerContent, { flex: 1 }]}>
                  {new Date(row.publishedOn) > new Date() ? (
                    <TouchableOpacity
                      style={{
                        paddingTop: 5 * factor
                      }}
                      onPress={() => {
                        this.addToCalendarLessonTitle = row.title;
                        this.addToCalendatLessonPublishDate = row.publishedOn;
                        this.setState({ addToCalendarModal: true });
                      }}
                    >
                      <FontIcon
                        size={onTablet ? 17.5 * factor : 27.5 * factor}
                        name={'calendar-plus'}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  ) : !row.isAddedToList ? (
                    <TouchableOpacity
                      style={{
                        paddingTop: 5 * factor
                      }}
                      onPress={() => this.addToMyList(row.id)}
                    >
                      <AntIcon
                        name={'plus'}
                        size={(onTablet ? 20 : 28.5) * factor}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  ) : row.isAddedToList ? (
                    <TouchableOpacity
                      style={{
                        paddingTop: 5 * factor
                      }}
                      onPress={() => this.removeFromMyList(row.id)}
                    >
                      <AntIcon
                        name={'close'}
                        size={(onTablet ? 20 : 28.5) * factor}
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
        <View style={{ marginTop: paddingInset }}>
          {this.props.showFilter && (
            <View
              style={{
                flexDirection: 'row',
                padding: paddingInset
              }}
            >
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  {this.props.showLargeTitle ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: (onTablet ? 25 : 30) * factor,
                        color: 'white',
                        fontFamily: 'OpenSans-ExtraBold',
                        justifyContent: 'center'
                      }}
                    >
                      {this.props.title}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: (onTablet ? 12 : 18) * factor,
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
                      width: onTablet ? 50 : 30,
                      position: 'relative',
                      flexDirection: 'row',
                      right: 0
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
                          right: onTablet ? 55 : 35,
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
                          fontSize: (onTablet ? 10 : 14.5) * factor,
                          fontFamily: 'OpenSans-Regular',
                          marginRight: 5,
                          justifyContent: 'flex-end'
                        }}
                      >
                        {onTablet
                          ? sortDict[this.props.currentSort].charAt(0) +
                            sortDict[this.props.currentSort]
                              .substring(1)
                              .toLowerCase()
                          : sortDict[this.props.currentSort]}
                      </Text>
                      <FontIcon
                        size={(onTablet ? 10 : 15) * factor}
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
          <View style={{ paddingLeft: paddingInset }}>
            {this.filters?.filterAppliedText}
          </View>
          {this.state.items.length == 0 &&
            this.state.outVideos &&
            !this.state.isLoading && (
              <View
                style={{
                  paddingHorizontal: paddingInset
                }}
              >
                <Text
                  style={{
                    fontSize: (onTablet ? 10 : 14) * factor,
                    color: this.props.isMethod
                      ? 'white'
                      : colors.secondBackground,
                    fontFamily: 'OpenSans-Regular',
                    textAlign: 'left'
                  }}
                >
                  {this.props.title.includes('SEARCH RESULTS')
                    ? ''
                    : 'There are no results for this content type.'}
                </Text>
              </View>
            )}
        </View>
        <View style={{ flex: 1 }}>
          {this.renderMappedList()}
          {this.state.isPaging && !this.state.isLoading && (
            <View
              style={[
                styles.centerContent,
                { minHeight: 20, marginTop: 15 * factor }
              ]}
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

export default withNavigation(VerticalVideoList);
