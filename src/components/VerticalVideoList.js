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
import {
  addToMyList,
  removeFromMyList
} from 'Pianote2/src/services/UserActions.js';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import Modal from 'react-native-modal';
import Relevance from '../modals/Relevance';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import ContentModal from '../modals/ContentModal';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';
import { NetworkContext } from '../context/NetworkProvider';
import AddToCalendar from '../modals/AddToCalendar';

const sortDict = {
  newest: 'NEWEST',
  oldest: 'OLDEST',
  popularity: 'POPULAR',
  trending: 'TRENDING',
  relevance: 'RELEVANCE'
};

const instructorDict = {
  197077: "Brett",
  197087: "Cassi",
  197106: "Colin", 
  266932: "Dave", 
  247373: "Sean", 
  279887: "Eleny",
  218895: "Gabriel", 
  202588: "Jay", 
  197048: "Jonny", 
  196994: "Jordan", 
  221245: "Josh", 
  203416: "Kenny", 
  196999: "Lisa",
  197084: "Nate",
  243082: "Sam",
}

let greaterWDim;

class VerticalVideoList extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      outVideos: this.props.outVideos,
      showRelevance: false,
      items: this.props.items,
      isLoading: this.props.isLoading,
      isPaging: false,
      addToCalendarModal: false
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  UNSAFE_componentWillReceiveProps = props => {
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
      <View
        style={[
          styles.centerContent,
          {
            height: fullHeight * 0.415,
            marginTop: 15 * factorRatio
          }
        ]}
      >
        <ActivityIndicator
          size={onTablet ? 'large' : 'small'}
          animating={true}
          color={this.props.isMethod ? colors.pianoteGrey : colors.secondBackground}
        />
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

  topics = () => {
    let topics = this.props.filters.displayTopics;
    if (topics.length > 0) {
      var topicString = '/ ';

      for (i in topics) {
        if (i == topics.length - 1) {
          topicString = topicString + topics[i];
        } else {
          topicString = topicString + topics[i] + ', ';
        }
      }

      return topicString;
    } else {
      return '';
    }
  };

  instructors = () => {
    let instructors = [];

    for (i in this.props.filters.instructors) {
      instructors.push(instructorDict[this.props.filters.instructors[i]]);
    }

    if (instructors.length > 0) {
      var instructorString = '/ ';

      for (i in instructors) {
        if (i == instructors.length - 1) {
          instructorString = instructorString + instructors[i];
        } else {
          instructorString = instructorString + instructors[i] + ', ';
        }
      }

      return instructorString;
    } else {
      return '';
    }
  };

  progress = () => {
    if (this.props.filters.progress.length > 0) {
      var progressString = '/ ';

      for (i in this.props.filters.progress) {
        if (i == this.props.filters.progress.length - 1) {
          progressString = progressString + this.props.filters.progress[i];
        } else {
          progressString =
            progressString + this.props.filters.progress[i] + ', ';
        }
      }

      return progressString;
    } else {
      return '';
    }
  };

  stringifyFilters = () => {
    return (
      (this.props.filters.level.length > 0
        ? '/ ' +
          this.props.filters.level[1] +
          ' ' +
          this.props.filters.level[0] +
          ' '
        : '') +
      (typeof this.topics() !== 'undefined' ? this.topics() + ' ' : '') +
      (typeof this.instructors() !== 'undefined'
        ? this.instructors() + ' '
        : '') +
      (typeof this.progress() !== 'undefined' ? this.progress() : '')
    );
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
        this.state.items[i].isLiked = !this.state.items.isLiked;
        this.state.items[i].like_count = this.state.items.isLiked
          ? this.state.items.like_count + 1
          : this.state.items.like_count - 1;
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
      .catch(error => {
        console.log(error);
      });
  };

  navigate = (content, index) => {
    if (
      !this.context.isConnected &&
      this.props.title !== 'RELATED LESSONS' &&
      this.props.title !== 'Foundations'
    )
      return this.context.showNoConnectionAlert();
    if (new Date(content.publishedOn) > new Date()) {
      return;
    }
    if (this.props.navigator) return this.props.navigator(content, index);
    switch (content.type) {
      case 'course':
        return this.props.navigation.navigate('PATHOVERVIEW', {
          data: content
        });
      case 'song':
        if (content.lesson_count === 1)
          return this.props.navigation.navigate('VIDEOPLAYER', {
            id: content.currentLessonId
          });
        return this.props.navigation.navigate('PATHOVERVIEW', {
          data: content
        });
      case 'learning-path':
        return this.props.navigation.navigate('FOUNDATIONS', {
          url: content.mobile_app_url
        });
      case 'unit':
        return this.props.navigation.navigate('FOUNDATIONSLEVEL', {
          url: content.mobile_app_url,
          level: index + 1
        });
      case 'unit-part':
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
    if (new Date(publishDate) > new Date()) {
      return `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,e_grayscale/${fallbackThumb}`;
    }
    if (thumbnail.includes('http') && thumbnail !== 'TBD') {
      return `https://cdn.musora.com/image/fetch/w_${Math.round(
        this.props.imageWidth * 2
      )},ar_${
        this.props.imageWidth === this.props.imageHeight ? '1' : '16:9'
      },fl_lossy,q_auto:eco,c_fill,g_face/${thumbnail}`;
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
            row.type == 'unit'
              ? null
              : this.setState({
                  showModal: true,
                  item: row
                });
          }}
          onPress={() => this.navigate(row, index)}
        >
          {(index >= 0 || !this.props.showNextVideo) && (
            <View
              style={{
                height: this.props.containerHeight,
                flex: 1,
                borderTopWidth: this.props.containerBorderWidth,
                paddingLeft: 10 * factorHorizontal,
                flexDirection: 'row',
                borderTopColor: '#ececec'
              }}
            >
              <View
                style={{ justifyContent: 'center' }}
                underlayColor={'transparent'}
              >
                <View
                  style={{
                    width: this.props.imageWidth,
                    height: this.props.imageHeight,
                    borderRadius: this.props.imageRadius
                  }}
                >
                  {row.isCompleted && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: this.props.imageWidth,
                        height: this.props.imageHeight,
                        borderRadius: this.props.imageRadius,
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
                        top: 0,
                        left: 0,
                        width: this.props.imageWidth,
                        height: this.props.imageHeight,
                        zIndex: 2
                      }
                    ]}
                  >
                    {row.isStarted ? (
                      <Progress
                        height={40}
                        width={40 * factorRatio}
                        fill={'white'}
                      />
                    ) : row.isCompleted ? (
                      <ApprovedTeacher
                        height={50}
                        width={50 * factorRatio}
                        fill={'white'}
                      />
                    ) : null}
                  </View>

                  {this.props.showLines && (
                    <View
                      style={[
                        styles.centerContent,
                        {
                          top: -3.5 * factorVertical,
                          height: 5 * factorVertical,
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
                  )}
                  {this.props.showLines && (
                    <View
                      style={[
                        styles.centerContent,
                        {
                          position: 'absolute',
                          top: -7.5 * factorVertical,
                          left: 0,
                          width: '100%',
                          height: 7.5 * factorVertical,
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
                  )}
                  {this.props.isFoundationsLevel && (
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
                        borderRadius={this.props.imageRadius}
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
                          fontSize: 21 * factorRatio
                        }}
                      >
                        LEVEL {index + 1}
                      </Text>
                      <View style={{ flex: 0.5 }} />
                    </View>
                  )}
                  {Platform.OS === 'ios' ? (
                    <FastImage
                      style={{
                        flex: 1,
                        borderRadius: this.props.imageRadius
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
                        borderRadius: this.props.imageRadius
                      }}
                      source={{
                        uri: this.getImageUrl(row.thumbnail, row.publishedOn)
                      }}
                      resizeMode='cover'
                    />
                  )}
                </View>
              </View>
              <View style={{ width: 10 * factorHorizontal }} />
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                {this.props.isFoundationsLevel && (
                  <Text
                    style={{
                      fontSize: 10 * factorRatio,
                      marginBottom: 2 * factorRatio,
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
                    fontSize: 15 * factorRatio,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    fontFamily: 'OpenSans-Regular',
                    color: 'white'
                  }}
                >
                  {row.title}
                </Text>
                {this.props.isFoundationsLevel && (
                  <Text
                    numberOfLines={2}
                    style={{
                      marginTop: 2 * factorRatio,
                      fontSize: 12 * factorRatio,
                      color: this.props.isMethod ? colors.pianoteGrey : colors.secondBackground,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Regular',
                      paddingRight: 20 * factorHorizontal
                    }}
                  >
                    {row.description}
                  </Text>
                )}
                <View style={{ height: 2 * factorVertical }} />
                <View style={{ flexDirection: 'row' }}>
                  {this.props.showLength && (
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 12 * factorRatio,
                        color: (this.props.isMethod || this.props.foundationsLevel) ? colors.pianoteGrey : colors.secondBackground,
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
                        fontSize: 12 * factorRatio,
                        color: (this.props.isMethod || this.props.foundationsLevel) ? colors.pianoteGrey : colors.secondBackground,
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Regular'
                      }}
                    >
                      Level {(1.1 + index / 10).toFixed(1)}
                    </Text>
                  )}
                  {this.props.showType && (
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 12 * factorRatio,
                        color: this.props.isMethod ? colors.pianoteGrey : colors.secondBackground,
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
                        fontSize: 12 * factorRatio,
                        color: this.props.isMethod ? colors.pianoteGrey : colors.secondBackground,
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Regular'
                      }}
                    >
                      {row.artist}
                    </Text>
                  )}
                </View>
              </View>
              {!this.props.isFoundationsLevel && (
                <View style={{ flex: 0.5 }}>
                  <View style={[styles.centerContent, { flex: 1 }]}>
                    {new Date(row.publishedOn) > new Date() ? (
                      <TouchableOpacity
                        style={{
                          paddingTop: 5 * factorVertical
                        }}
                        onPress={() => {
                          this.addToCalendarLessonTitle = row.title;
                          this.addToCalendatLessonPublishDate = row.publishedOn;
                          this.setState({ addToCalendarModal: true });
                        }}
                      >
                        <FontIcon
                          size={30 * factorRatio}
                          name={'calendar-plus'}
                          color={(this.props.isMethod && !this.props.foundationsLevel) ? colors.pianoteGrey : colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    ) : !row.isAddedToList ? (
                      <TouchableOpacity
                        style={{
                          paddingTop: 5 * factorVertical
                        }}
                        onPress={() => this.addToMyList(row.id)}
                      >
                        <AntIcon
                          name={'plus'}
                          size={30 * factorRatio}
                          color={(this.props.isMethod && !this.props.foundationsLevel) ? colors.pianoteGrey : colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    ) : row.isAddedToList ? (
                      <TouchableOpacity
                        style={{
                          paddingTop: 5 * factorVertical
                        }}
                        onPress={() => this.removeFromMyList(row.id)}
                      >
                        <AntIcon
                          name={'close'}
                          size={30 * factorRatio}
                          color={(this.props.isMethod && !this.props.foundationsLevel) ? colors.pianoteGrey : colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              )}
            </View>
          )}
          {index == 0 && this.props.showNextVideo && (
            <View
              style={{
                height:
                  this.props.showNextVideo && index == 0
                    ? this.props.containerHeight
                    : this.props.containerHeight + 50 * factorVertical,
                width: this.props.containerWidth,
                flexDirection: 'row',
                paddingLeft: 10 * factorHorizontal,
                backgroundColor: '#FFF1F2'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 22.5 * factorVertical,
                  left: 10 * factorHorizontal,
                  width: fullWidth * 0.5
                }}
              >
                <Text
                  style={{
                    fontSize: 12 * factorRatio,
                    fontFamily: 'OpenSans-Bold'
                  }}
                  numberOfLines={1}
                >
                  YOUR NEXT LESSON
                </Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  top: 25 * factorVertical,
                  right: 15 * factorHorizontal,
                  width: fullWidth * 0.2
                }}
              >
                <Text
                  style={{
                    fontSize: 12 * factorRatio,
                    fontFamily: 'OpenSans-Regular',
                    color: 'red',
                    textAlign: 'right'
                  }}
                  numberOfLines={1}
                >
                  LESSON 7
                </Text>
              </View>
              <TouchableOpacity
                onLongPress={() => {
                  row.type == 'unit'
                    ? null
                    : this.setState({
                        showModal: true,
                        item: row
                      });
                }}
                onPress={() => this.props.navigator(row, index)}
                style={{ justifyContent: 'center' }}
                underlayColor={'transparent'}
              >
                <View style={{ flex: 2 }} />
                <View
                  style={{
                    width: this.props.imageWidth,
                    height: this.props.imageHeight,
                    borderRadius: this.props.imageRadius,
                    borderColor: '#ececec',
                    borderWidth: this.props.containerBorderWidth
                  }}
                >
                  <View
                    style={[
                      styles.centerContent,
                      {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: this.props.imageWidth,
                        height: this.props.imageHeight,
                        borderRadius: this.props.imageRadius,
                        zIndex: 4,
                        opacity: 0.3,
                        backgroundColor:
                          row.progress == 'check' || row.progress == 'progress'
                            ? '#ff3333'
                            : 'transparent'
                      }
                    ]}
                  ></View>
                  <View
                    style={[
                      styles.centerContent,
                      {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: this.props.imageWidth,
                        height: this.props.imageHeight,
                        borderRadius: this.props.imageRadius,
                        zIndex: 4,
                        opacity: 1,
                        backgroundColor: 'transparent'
                      }
                    ]}
                  >
                    {(row.progress == 'check' ||
                      row.progress == 'progress') && (
                      <ApprovedTeacher
                        height={50}
                        width={50 * factorRatio}
                        fill={'white'}
                      />
                    )}
                  </View>
                  <FastImage
                    style={{
                      flex: 1,
                      borderRadius: this.props.imageRadius
                    }}
                    source={{ uri: row.thumbnail || '' }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <View style={{ flex: 1 }} />
              </TouchableOpacity>
              <View style={{ width: 10 * factorHorizontal }} />
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <View style={{ flex: 1.66 }} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15 * factorRatio,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Bold'
                    }}
                  >
                    {row.title}
                  </Text>
                  <View style={{ height: 2 * factorVertical }} />
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 12 * factorRatio,
                      color: '#9b9b9b',
                      textAlign: 'left',
                      fontWeight: '500'
                    }}
                  >
                    {Math.floor(row.duration / 60)} mins
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ flex: 0.5 }}>
                <View style={{ flex: 1.66 }} />
                <View style={{ flex: 1 }}>
                  {this.props.showPlus == null && (
                    <TouchableOpacity
                      onPress={() => {
                        this.addToMyList(row.id);
                      }}
                      style={[styles.centerContent, { flex: 1 }]}
                    >
                      <AntIcon
                        name={'plus'}
                        size={30 * factorRatio}
                        color={'#c2c2c2'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          )}
        </TouchableOpacity>
      );
    });
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View>
          <View style={{ height: 5 * factorVertical }} />
          {this.props.showFilter && (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ paddingLeft: 10 * factorHorizontal }}>
                {this.props.showLargeTitle && (
                  <Text
                    style={{
                      fontSize: 30 * factorRatio,
                      color: 'white',
                      fontFamily: 'OpenSans-ExtraBold'
                    }}
                  >
                    {this.props.title}
                  </Text>
                )}
                {!this.props.showLargeTitle && (
                  <Text
                    style={{
                      fontSize: 18 * factorRatio,
                      marginBottom: 5 * factorVertical,
                      textAlign: 'left',
                      fontFamily: 'RobotoCondensed-Bold',
                      color: this.props.isMethod ? 'white' : colors.secondBackground
                    }}
                  >
                    {this.props.title}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }} />
              {!this.props.showTitleOnly && (
                <View
                  style={{
                    paddingRight: 10 * factorHorizontal,
                    flexDirection: 'row'
                  }}
                >
                  {this.props.showSort && (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'
                      }}
                      onPress={() => {
                        this.setState({
                          showRelevance: !this.state.showRelevance
                        });
                      }}
                    >
                      <View style={{ flex: 1 }} />
                      <Text
                        style={{
                          color: colors.pianoteRed,
                          fontSize: 12 * factorRatio,
                          fontFamily: 'OpenSans-Regular'
                        }}
                      >
                        {sortDict[this.props.currentSort]}
                      </Text>
                      <View
                        style={{
                          width: 5 * factorHorizontal
                        }}
                      />
                      <View>
                        <FontIcon
                          size={14 * factorRatio}
                          name={'sort-amount-down'}
                          color={colors.pianoteRed}
                        />
                      </View>
                      <View style={{ flex: 1 }} />
                    </TouchableOpacity>
                  )}
                  <View style={{ width: 10 * factorHorizontal }} />
                  <View>
                    <View style={{ flex: 1 }} />
                    {!this.props.hideFilterButton && (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.filterResults();
                        }}
                        style={[
                          styles.centerContent,
                          {
                            borderWidth: 1.5 * factorRatio,
                            borderColor: colors.pianoteRed,
                            height: 30 * factorRatio,
                            width: 30 * factorRatio,
                            borderRadius: 20 * factorRatio
                          }
                        ]}
                      >
                        <View style={{ flex: 1 }} />
                        <View
                          style={{
                            transform: [{ rotate: '90deg' }]
                          }}
                        >
                          <IonIcon
                            size={14 * factorRatio}
                            name={'md-options'}
                            color={colors.pianoteRed}
                          />
                        </View>
                        <View style={{ flex: 1 }} />
                      </TouchableOpacity>
                    )}
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ width: 5 * factorHorizontal }} />
                </View>
              )}
            </View>
          )}
          {!this.props.showTitleOnly && this.props.showFilter && (
            <View>
              {this.props.filters !== null &&
                (this.props.filters.topics.length > 0 ||
                  this.props.filters.level.length > 0 ||
                  this.props.filters.progress.length > 0 ||
                  this.props.filters.instructors.length > 0) && (
                  <View
                    style={{
                      paddingLeft: 10 * factorHorizontal,
                      paddingRight: 10 * factorHorizontal,
                      paddingTop: 5 * factorVertical
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12 * factorRatio,
                        marginBottom: 5 * factorVertical,
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Regular',
                        color: this.props.isMethod ? 'white' : colors.secondBackground
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12 * factorRatio,
                          marginBottom: 5 * factorVertical,
                          textAlign: 'left',
                          fontFamily: 'OpenSans-Bold',
                          color: this.props.isMethod ? 'white' : colors.secondBackground
                        }}
                      >
                        FILTERS APPLIED{' '}
                      </Text>
                      {this.stringifyFilters()}
                    </Text>
                  </View>
                )}
            </View>
          )}
          {this.state.items.length == 0 &&
            this.state.outVideos &&
            !this.state.isLoading && (
              <View
                style={{
                  marginTop: 7.5 * factorRatio,
                  paddingLeft: 10 * factorHorizontal,
                  paddingRight: 10 * factorHorizontal
                }}
              >
                <Text
                  style={{
                    fontSize: 12 * factorRatio,
                    color: this.props.isMethod ? 'white' : colors.secondBackground,
                    fontFamily: 'OpenSans-Regular',
                    textAlign: 'left'
                  }}
                >
                  There are no results that match those filters.
                </Text>
                <View
                  style={{
                    height: fullHeight * 0.3
                  }}
                />
              </View>
            )}
          <View style={{ height: 5 * factorVertical }} />
        </View>
        <View style={{ flex: 1 }}>
          {this.renderMappedList()}
          {this.state.isPaging && !this.state.isLoading && (
            <View
              style={[
                styles.centerContent,
                {
                  height: fullHeight * 0.115,
                  marginTop: 15 * factorRatio
                }
              ]}
            >
              <ActivityIndicator
                size={onTablet ? 'large' : 'small'}
                animating={true}
                color={this.props.isMethod ? colors.pianoteGrey : colors.secondBackground}
              />
            </View>
          )}
          <View style={{ flex: 1 }} />
        </View>
        <Modal
          key={'modal'}
          isVisible={this.state.showModal}
          style={[
            styles.centerContent,
            {
              margin: 0,
              height: '100%',
              width: '100%'
            }
          ]}
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
          key={'modalRelevance'}
          isVisible={this.state.showRelevance}
          style={[
            styles.centerContent,
            {
              margin: 0,
              height: '100%',
              width: '100%'
            }
          ]}
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
            currentSort={this.props.currentSort}
            changeSort={sort => {
              this.props.changeSort(sort);
            }}
          />
        </Modal>

        <Modal
          key={'calendarModal'}
          isVisible={this.state.addToCalendarModal}
          style={{
            margin: 0,
            height: '100%',
            width: '100%'
          }}
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
