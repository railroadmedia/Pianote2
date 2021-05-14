import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../assets/icons';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import AddToCalendar from '../modals/AddToCalendar';
import Sort from '../modals/Sort';
import { addToMyList, removeFromMyList } from '../services/UserActions';
import ContentModal from '../modals/ContentModal';
import { NetworkContext } from '../context/NetworkProvider';
import ApprovedTeacher from '../assets/img/svgs/approved-teacher.svg';
import Progress from '../assets/img/svgs/progress.svg';
import Filters_V2 from './Filters_V2';
import { navigate } from '../../AppNavigator';

let greaterWDim;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const sortDict = {
  newest: 'NEWEST',
  oldest: 'OLDEST',
  popularity: 'POPULAR',
  trending: 'TRENDING',
  relevance: 'RELEVANCE'
};
const onTablet = global.onTablet;

export default class HorizontalVideoList extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      addToCalendarModal: false,
      showSort: false,
      outVideos: this.props.outVideos,
      isLoading: false,
      items: this.props.items
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
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

  componentDidUpdate(prevProps) {
    let { items: pItems } = prevProps;
    let myListStatusChanged, progressChanged;
    if (this.props.items.length !== pItems.length) progressChanged = true;
    else if (
      this.props.items.some(item =>
        pItems.some(
          pItem =>
            item.id === pItem.id &&
            item.is_added_to_primary_playlist !==
              pItem.is_added_to_primary_playlist
        )
      )
    )
      myListStatusChanged = true;
    if (progressChanged || myListStatusChanged)
      this.setState({ items: this.props.items });
  }

  decideWidth() {
    if (onTablet) {
      if (this.props.isSquare) return 125;
      else return (Dimensions.get('window').width - 4 * 10) / 3;
    } else {
      if (this.props.isSquare) return Dimensions.get('window').width / 3.25;
      else return ((Dimensions.get('window').width - 30) * 3) / 4;
    }
  }

  toggleMyList = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.state.isAddedToList
      ? removeFromMyList(this.state.id)
      : addToMyList(this.state.id);
    this.setState(state => ({ isAddedToList: !state.isAddedToList }));
  };

  addToMyList = contentID => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    for (i in this.state.items) {
      if (this.state.items[i].id === contentID) {
        let items = Object.assign([], this.state.items);
        items[i].isAddedToList = true;
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
        items[i].isAddedToList = false;
        this.setState({ items });
      }
    }
    removeFromMyList(contentID);
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

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';

    for (i in word) {
      string = string + word[i] + ' ';
    }

    return string;
  };

  navigate = (content, index) => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    if (
      this.props.title !== 'METHOD' &&
      new Date(content.publishedOn) > new Date()
    ) {
      return;
    }
    switch (content.type) {
      case 'course':
        return navigate('PATHOVERVIEW', {
          data: content
        });
      case 'song':
        if (content.lesson_count === 1)
          return navigate('VIEWLESSON', {
            id: content.lessons?.[0]?.id
          });
        return navigate('PATHOVERVIEW', {
          data: content
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

  listFooter = () => {
    if (this.state.outVideos || !this.state.callEndReached) {
      return <></>;
    }

    if (this.state.items.length > 0) {
      return (
        <View
          style={[
            styles.centerContent,
            {
              flex: 1,
              marginHorizontal: 40,
              flexDirection: 'row'
            }
          ]}
        >
          <View style={{ flex: 3 }} />
          <ActivityIndicator
            size={onTablet ? 'large' : 'small'}
            animating={true}
            color={
              this.props.isMethod ? colors.pianoteGrey : colors.secondBackground
            }
          />
          <View style={{ flex: 0.7 }} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: width,
            height: '100%'
          }}
        >
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
    }
  };

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h !== 0 && h + ' hour';
    var mDisplay = m !== 0 && m + ' min';
    var sDisplay = s !== 0 && s + ' sec';

    return [hDisplay, mDisplay, sDisplay].filter(Boolean).join(' ');
  }

  render = () => {
    return (
      <View style={{ marginLeft: 10 }}>
        <View style={localStyles.titleContain}>
          <Text
            style={[
              localStyles.title,
              {
                color: this.props.isMethod ? 'white' : colors.secondBackground
              }
            ]}
          >
            {this.props.Title}
          </Text>
          {!this.props.hideSeeAll && (
            <>
              {(!onTablet || (onTablet && this.props.hideFilterButton)) && (
                <TouchableOpacity onPress={() => this.props.seeAll()}>
                  <Text style={localStyles.seeAllText}>See All</Text>
                </TouchableOpacity>
              )}
              {onTablet && (
                <>
                  {!this.props.hideFilterButton && (
                    <>
                      <>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity
                          style={[
                            styles.centerContent,
                            {
                              flexDirection: 'row',
                              marginRight: 5
                            }
                          ]}
                          onPress={() => {
                            this.setState({
                              showSort: !this.state.showSort
                            });
                          }}
                        >
                          <View style={{ flex: 1 }} />
                          <Text
                            style={[
                              localStyles.seeAllText,
                              {
                                paddingRight: 5,
                                fontSize: sizing.descriptionText
                              }
                            ]}
                          >
                            {onTablet
                              ? sortDict[this.props.currentSort].charAt(0) +
                                sortDict[this.props.currentSort]
                                  .substring(1)
                                  .toLowerCase()
                              : sortDict[this.props.currentSort]}
                          </Text>
                          <View>
                            <Icon.FontAwesome
                              size={onTablet ? 18 : 14}
                              name={'sort-amount-down'}
                              color={colors.pianoteRed}
                            />
                          </View>
                          <View style={{ flex: 1 }} />
                        </TouchableOpacity>
                      </>
                      <View style={{ marginRight: 10 }}>
                        <Filters_V2
                          disabled={this.state.isPaging}
                          onApply={() =>
                            this.props.applyFilters?.(this.filters?.filterQuery)
                          }
                          meta={this.props.filters}
                          reference={r => (this.filters = r)}
                        />
                      </View>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>
        {this.filters?.filterAppliedText}
        <FlatList
          numColumns={this.props.isTile ? 3 : 1}
          data={this.state.items}
          extraData={this.state}
          horizontal={this.props.isTile ? false : true}
          style={{ width: '100%' }}
          showsHorizontalScrollIndicator={false}
          onEndReached={() => {
            this.props.callEndReached ? this.props.reachedEnd() : null;
          }}
          onEndReachedThreshold={1}
          ListFooterComponent={() => this.listFooter()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                width: this.decideWidth(),
                marginRight: 10,
                marginBottom: this.props.isTile ? 10 : 0
              }}
              onLongPress={() => {
                this.setState({
                  showModal: true,
                  item
                });
              }}
              delayLongPress={250}
              onPress={() => this.navigate(item, index)}
            >
              <View style={{ width: '100%' }}>
                <View style={[styles.centerContent, localStyles.progressItem]}>
                  {this.props.isLive ? (
                    <View
                      style={[
                        styles.centerContent,
                        {
                          height: '100%',
                          width: '100%',
                          borderRadius: 10
                        }
                      ]}
                    >
                      <LinearGradient
                        colors={[
                          'transparent',
                          'rgba(20, 20, 20, 0.7)',
                          'rgba(0, 0, 0, 1)'
                        ]}
                        style={{
                          borderRadius: 0,
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          left: 0,
                          bottom: 0
                        }}
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'OpenSans-Bold',
                          position: 'absolute',
                          fontSize: onTablet ? 16 : 12,
                          left: 5,
                          top: 10
                        }}
                      >
                        UPCOMING EVENT
                      </Text>
                      <Text>
                        <View>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              fontSize: onTablet ? 60 : 40,
                              textAlign: 'center'
                            }}
                          >
                            02
                          </Text>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              top: 0,
                              textAlign: 'center'
                            }}
                          >
                            HOURS
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              fontSize: onTablet ? 60 : 40
                            }}
                          >
                            {' '}
                            :{' '}
                          </Text>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              top: 0,
                              textAlign: 'center',
                              color: 'transparent'
                            }}
                          >
                            h
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              fontSize: onTablet ? 60 : 40,
                              textAlign: 'center'
                            }}
                          >
                            42
                          </Text>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              top: 0,
                              textAlign: 'center'
                            }}
                          >
                            MINUTES
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              fontSize: onTablet ? 60 : 40
                            }}
                          >
                            {' '}
                            :{' '}
                          </Text>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              top: 0,
                              textAlign: 'center',
                              color: 'transparent'
                            }}
                          >
                            h
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              fontSize: onTablet ? 60 : 40,
                              textAlign: 'center'
                            }}
                          >
                            02
                          </Text>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'OpenSans-Bold',
                              top: 0,
                              textAlign: 'center'
                            }}
                          >
                            SECONDS
                          </Text>
                        </View>
                      </Text>
                    </View>
                  ) : item.started ? (
                    <Progress
                      height={onTablet ? 55 : 45}
                      width={onTablet ? 55 : 45}
                      fill={'white'}
                    />
                  ) : item.completed ? (
                    <ApprovedTeacher
                      height={onTablet ? 70 : 55}
                      width={onTablet ? 70 : 55}
                      fill={'white'}
                    />
                  ) : null}
                </View>

                {isiOS ? (
                  <FastImage
                    style={[
                      localStyles.imageIOS,
                      { aspectRatio: this.props.isSquare ? 1 : 16 / 9 }
                    ]}
                    source={{
                      uri:
                        item.thumbnail_url && item.thumbnail_url !== 'TBD'
                          ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                              this.decideWidth() * 2
                            )},ar_${
                              this.props.isSquare ? '1' : '16:9'
                            },fl_lossy,q_auto:eco,c_fill,g_face/${
                              item.thumbnail_url
                            }`
                          : fallbackThumb
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <Image
                    style={[
                      localStyles.imageIOS,
                      { aspectRatio: this.props.isSquare ? 1 : 16 / 9 }
                    ]}
                    resizeMode='cover'
                    source={{
                      uri:
                        item.thumbnail_url && item.thumbnail_url !== 'TBD'
                          ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                              this.decideWidth() * 2
                            )},ar_${
                              this.props.isSquare ? '1' : '16:9'
                            },fl_lossy,q_auto:eco,c_fill,g_face/${
                              item.thumbnail_url
                            }`
                          : fallbackThumb
                    }}
                  />
                )}
              </View>

              <View style={localStyles.videoTitle}>
                <View style={{ width: '85%' }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={localStyles.videoTitleText}
                  >
                    {this.props.isLive ? 'Pianote Live Stream' : item.title}
                  </Text>
                  <View style={localStyles.typeContainer}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: this.props.isMethod
                          ? colors.pianoteGrey
                          : colors.secondBackground,

                        fontSize: sizing.descriptionText,
                        textTransform: 'capitalize'
                      }}
                    >
                      {this.props.showType && this.changeType(item.type)}
                      {this.props.showType && '/ '}
                      {item.artist || item.instructors?.join(', ')}
                    </Text>
                  </View>
                </View>
                {this.props.isLive && (
                  <TouchableOpacity
                    onPress={() =>
                      !item.isAddedToList
                        ? this.addToMyList(item.id)
                        : this.removeFromMyList(item.id)
                    }
                    style={{ paddingRight: 2.5 }}
                  >
                    <Icon.AntDesign
                      name={!item.isAddedToList ? 'plus' : 'close'}
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                )}
                {new Date(item.publishedOn) > new Date() ||
                this.props.isLive ? (
                  <TouchableOpacity
                    style={{ paddingRight: 5 }}
                    onPress={() => {
                      this.addToCalendarLessonTitle = item.title;
                      this.addToCalendatLessonPublishDate = item.publishedOn;
                      this.setState({ addToCalendarModal: true });
                    }}
                  >
                    <Icon.FontAwesome
                      size={sizing.infoButtonSize}
                      name={'calendar-plus'}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                ) : !item.is_added_to_primary_playlist ? (
                  <TouchableOpacity
                    onPress={() => this.addToMyList(item.id)}
                    style={{ paddingRight: 2.5 }}
                  >
                    <Icon.AntDesign
                      name={'plus'}
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ paddingRight: 2.5 }}
                    onPress={() => this.removeFromMyList(item.id)}
                  >
                    <Icon.AntDesign
                      name={'close'}
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
        <Modal
          isVisible={this.state.showModal}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
          onBackButtonPress={() => this.setState({ showModal: false })}
        >
          <ContentModal
            data={this.state.item}
            hideContentModal={() => this.setState({ showModal: false })}
            like={contentID => this.like(contentID)}
            addToMyList={contentID => this.addToMyList(contentID)}
            removeFromMyList={contentID => this.removeFromMyList(contentID)}
          />
        </Modal>
        <AddToCalendar
          isVisible={this.state.addToCalendarModal}
          hideAddToCalendar={() => this.setState({ addToCalendarModal: false })}
          addEventToCalendar={() => {
            this.addEventToCalendar();
          }}
        />
        <Modal
          isVisible={this.state.showSort}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
          backdropColor={'white'}
          backdropOpacity={0.79}
          onBackButtonPress={() => this.setState({ showSort: false })}
        >
          <Sort
            hideSort={() => {
              this.setState({ showSort: false });
            }}
            isMethod={this.props.isMethod}
            currentSort={this.props.currentSort}
            changeSort={sort => {
              this.props.changeSort(sort);
            }}
          />
        </Modal>
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  title: {
    fontSize: onTablet ? 20 : 16,
    fontFamily: 'RobotoCondensed-Bold',
    paddingVertical: 5
  },
  seeAllText: {
    textAlign: 'right',
    fontSize: onTablet ? 16 : 12,
    color: '#fb1b2f',
    paddingRight: 10
  },
  titleContain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  progressItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  imageIOS: {
    width: '100%',
    borderRadius: 7.5
  },
  videoTitle: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  videoTitleText: {
    fontSize: onTablet ? 16 : 14,
    fontFamily: 'OpenSans-Bold',
    color: 'white'
  },
  typeContainer: {
    flexDirection: 'row'
  }
});
