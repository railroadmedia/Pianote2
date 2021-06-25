import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import FastImage from 'react-native-fast-image';
import Icon from '../assets/icons';
import { addToMyList, removeFromMyList } from '../services/UserActions';
import Sort from '../modals/Sort';
import ContentModal from '../modals/ContentModal';
import GradientFeature from '../components/GradientFeature';
import ApprovedTeacher from '../assets/img/svgs/approved-teacher.svg';
import Progress from '../assets/img/svgs/progress.svg';
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
const onTablet = global.onTablet;

export default class VerticalVideoList extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isLoading: this.props.isLoading,
      showSort: false,
      items: this.props.items,
      isPaging: false,
      addToCalendarModal: false
    };
  }

  componentWillReceiveProps = props => {
    if (props.isPaging !== this.state.isPaging) {
      if (!this.state.isLoading) this.setState({ isPaging: props.isPaging });
    }
    if (props.isLoading !== this.state.isLoading) {
      this.setState({
        isLoading: props.isLoading,
        items: [...this.state.items, ...props.items]
      });
    } else if (props.items !== this.state.items) {
      this.setState({ items: props.items });
    }
  };

  showSpinner = () => {
    return (
      <ActivityIndicator
        size={onTablet ? 'large' : 'small'}
        animating={true}
        style={{
          justifyContent: 'center',
          minHeight: 40
        }}
        color={
          this.props.isMethod ? colors.pianoteGrey : colors.secondBackground
        }
      />
    );
  };

  addToMyList = contentID => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    for (i in this.state.items) {
      if (this.state.items[i].id === contentID) {
        let items = Object.assign([], this.state.items);
        items[i].is_added_to_primary_playlist = true;
        this.setState({ items });
      }
    }
    addToMyList(contentID);
  };

  removeFromMyList = contentID => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    for (i in this.state.items) {
      if (this.state.items[i].id === contentID) {
        let items = Object.assign([], this.state.items);
        items[i].is_added_to_primary_playlist = false;
        this.setState({ items });
      }
    }
    removeFromMyList(contentID);
    // if on my list page and user removes then delete item from listview
    if (this.props.type === 'MYLIST') this.props.removeItem(contentID);
  };

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';
    for (i in word) string = string + word[i] + ' ';
    return string;
  };

  like = contentID => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    for (i in this.state.items) {
      if (this.state.items[i].id === contentID) {
        let items = Object.assign([], this.state.items);
        items[i].isLiked = !items[i].isLiked;
        items[i].like_count = items[i].isLiked
          ? items[i].like_count + 1
          : items[i].like_count - 1;
        this.setState({ items });
      }
    }
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
          return navigate('VIEWLESSON', {
            id: content.lessons?.[0]?.id
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
        return navigate('VIEWLESSON', {
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
        return navigate('VIEWLESSON', {
          url: content.mobile_app_url
        });
      default:
        return navigate('VIEWLESSON', {
          id: content.id
        });
    }
  };

  getImageUrl(thumbnail, publishDate) {
    if (thumbnail?.includes('var/mobile') || thumbnail?.includes('data/user'))
      return thumbnail;
    if (thumbnail?.includes('http')) {
      return `https://cdn.musora.com/image/fetch/w_250,ar_${
        this.props.isSquare ? '1' : '16:9'
      },fl_lossy,q_auto:eco,c_fill,g_face/${thumbnail}`;
    }
    if (new Date(publishDate) > new Date()) {
      return `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,e_grayscale/${fallbackThumb}`;
    }
    return fallbackThumb;
  }

  renderMappedList = () => {
    if (this.state.items?.length === 0) return;
    if (this.state.isLoading) return this.showSpinner();
    return this.state.items?.map((row, index) => {
      return (
        <TouchableOpacity
          key={index}
          onLongPress={() => {
            row.type === 'learning-path-level' || row.type === 'unit'
              ? null
              : this.setState({ showModal: true, item: row });
          }}
          onPress={() => this.navigate(row, index)}
        >
          <View style={localStyles.videoContainer}>
            <View
              style={{
                width: this.props.imageWidth,
                aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                borderRadius: 5
              }}
            >
              {row.completed && (
                <View
                  style={[
                    localStyles.rowComplete,
                    {
                      aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                      backgroundColor: colors.pianoteRed
                    }
                  ]}
                />
              )}
              <View
                style={[
                  localStyles.centerContent,
                  {
                    position: 'absolute',
                    width: '100%',
                    paddingBottom: this.props.isMethodLevel ? 10 : 0,
                    aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                    zIndex: 20
                  }
                ]}
              >
                {row.started ? (
                  <Progress
                    height={onTablet ? 60 : 35}
                    width={onTablet ? 60 : 35}
                    fill={'white'}
                  />
                ) : row.completed ? (
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
                      localStyles.centerContent,
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
                      localStyles.centerContent,
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
                <View style={localStyles.gradientContainer}>
                  <GradientFeature
                    color={'red'}
                    opacity={1}
                    height={'100%'}
                    borderRadius={5}
                  />
                  <View style={{ flex: 2.5 }} />
                  <Text
                    style={[
                      localStyles.levelText,
                      {
                        fontSize: sizing.titleViewLesson
                      }
                    ]}
                  >
                    LEVEL {index + 1}
                  </Text>
                </View>
              )}
              {isiOS ? (
                <FastImage
                  style={{ flex: 1, borderRadius: 5 }}
                  source={{
                    uri: this.getImageUrl(row.thumbnail_url, row.published_on)
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <Image
                  style={{ flex: 1, borderRadius: 5 }}
                  source={{
                    uri: this.getImageUrl(row.thumbnail_url, row.published_on)
                  }}
                  resizeMode={'cover'}
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
                    fontFamily: 'OpenSans-Bold',
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
                  fontFamily: 'OpenSans-Bold',
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
                    {Math.floor(row.length_in_seconds / 60)}{' '}
                    {Math.floor(row.length_in_seconds / 60) === 1
                      ? 'min'
                      : 'mins'}
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
                      fontFamily: 'OpenSans-Regular',
                      textTransform: 'capitalize'
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
                    {row.artist || row.instructors?.join(', ')}
                  </Text>
                )}
              </View>
            </View>
            {!this.props.isMethodLevel && (
              <View style={{ width: 45 }}>
                <View style={[localStyles.centerContent, { flex: 1 }]}>
                  {new Date(row.published_on) > new Date() ? (
                    <TouchableOpacity
                      onPress={() => {
                        this.addToCalendarLessonTitle = row.title;
                        this.addToCalendatLessonPublishDate = row.published_on;
                        this.setState({ addToCalendarModal: true });
                      }}
                    >
                      <Icon.FontAwesome5
                        size={sizing.myListButtonSize}
                        name={'calendar-plus'}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  ) : !row.is_added_to_primary_playlist ? (
                    <TouchableOpacity onPress={() => this.addToMyList(row.id)}>
                      <Icon.AntDesign
                        name={'plus'}
                        size={sizing.myListButtonSize}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.removeFromMyList(row.id)}
                    >
                      <Icon.AntDesign
                        name={'close'}
                        size={sizing.myListButtonSize}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  )}
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
            <View style={localStyles.filterContainer}>
              <View style={localStyles.titleContainer}>
                {this.props.showLargeTitle ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: sizing.titleViewLesson,
                      textAlign: 'left',
                      fontFamily: 'RobotoCondensed-Bold',
                      color: 'white'
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

                <View
                  style={[localStyles.centerContent, localStyles.SortButton]}
                >
                  {this.props.showSort && (
                    <TouchableOpacity
                      style={[
                        localStyles.centerContent,
                        localStyles.sortContainer
                      ]}
                      onPress={() =>
                        this.setState({ showSort: !this.state.showSort })
                      }
                    >
                      <Text
                        style={[
                          localStyles.sortText,
                          {
                            color: colors.pianoteRed,
                            fontSize: sizing.videoTitleText
                          }
                        ]}
                      >
                        {sortDict[this.props.currentSort]}
                      </Text>
                      <Icon.FontAwesome5
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
          {this.state.items?.length === 0 && !this.state.isLoading && (
            <Text
              style={{
                fontSize: sizing.descriptionText,
                color: this.props.isMethod ? 'white' : colors.secondBackground,
                fontFamily: 'OpenSans-Regular',
                textAlign: 'left',
                marginLeft: 10
              }}
            >
              {this.props.title.includes('SEARCH RESULTS')
                ? ''
                : 'There are no results for this content type.'}
            </Text>
          )}
        </>
        {this.renderMappedList()}
        {this.state.isPaging && !this.state.isLoading && (
          <ActivityIndicator
            size={onTablet ? 'large' : 'small'}
            style={[
              localStyles.centerContent,
              { minHeight: 20, marginTop: 20 }
            ]}
            animating={true}
            color={
              this.props.isMethod ? colors.pianoteGrey : colors.secondBackground
            }
          />
        )}
        {this.state.showModal && (
          <ContentModal
            data={this.state.item}
            hideContentModal={() => this.setState({ showModal: false })}
            like={contentID => this.like(contentID)}
            addToMyList={contentID => this.addToMyList(contentID)}
            removeFromMyList={contentID => this.removeFromMyList(contentID)}
          />
        )}
        {this.state.showSort && (
          <Sort
            hideSort={() => this.setState({ showSort: false })}
            isMethod={this.props.isMethod}
            currentSort={this.props.currentSort}
            changeSort={sort => this.props.changeSort(sort)}
          />
        )}
        <AddToCalendar
          onBackButtonPress={() => this.setState({ addToCalendarModal: false })}
          isVisible={this.state.addToCalendarModal}
          hideAddToCalendar={() => this.setState({ addToCalendarModal: false })}
          addEventToCalendar={() => this.addEventToCalendar()}
        />
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    paddingVertical: onTablet ? 10 : 5
  },
  levelText: {
    zIndex: 20,
    elevation: 20,
    textAlign: 'center',
    marginBottom: 5,
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold'
  },
  gradientContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 15,
    elevation: 15
  },
  rowComplete: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    borderRadius: 5,
    zIndex: 1,
    opacity: 0.2
  },
  filterContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    marginVertical: 5
  },
  largeTitle: {
    fontSize: onTablet ? 28 : 20,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold'
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  sortContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 45,
    height: '100%'
  },
  sortText: {
    fontFamily: 'OpenSans-Regular',
    paddingRight: 5,
    justifyContent: 'flex-end'
  },
  SortButton: {
    width: 45,
    flexDirection: 'row'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
});
