/**
 * SinglePack
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StatusBar
} from 'react-native';
import Modal from 'react-native-modal';
import { Download_V2 } from 'RNDownload';
import { SafeAreaView } from 'react-navigation';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation-locker';

import StartIcon from '../../components/StartIcon';
import ContinueIcon from '../../components/ContinueIcon';
import NavigationBar from '../../components/NavigationBar';
import GradientFeature from '../../components/GradientFeature';
import VerticalVideoList from '../../components/VerticalVideoList';
import RestartCourse from '../../modals/RestartCourse';
import packsService from '../../services/packs.service';
import {
  addToMyList,
  removeFromMyList,
  resetProgress
} from '../../services/UserActions';
import { NetworkContext } from '../../context/NetworkProvider';

let greaterWDim;
export default class SinglePack extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
      isDisplayingLessons: true,
      videos: [],
      id: '',
      url: this.props.navigation.state.params.url,
      isAddedToList: false,
      description: '',
      thumbnail: '',
      logo: '',
      xp: 0,
      isStarted: false,
      isCompleted: false,
      nextLessonUrl: '',
      isLoadingAll: true,
      refreshing: false,
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  componentDidMount = () => {
    this.getBundle();
    Orientation.addDeviceOrientationListener(this.orientationListener);
  };

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this.orientationListener);
  }

  getBundle = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    // get bundles
    const response = await packsService.getPack(this.state.url);
    const newContent = new ContentModel(response);
    const lessons = newContent.post.lessons.map(rl => {
      return new ContentModel(rl);
    });
    // if more than one bundle then display bundles otherwise show videos
    if (newContent.post.bundle_count > 1)
      this.setState({ isDisplayingLessons: false });
    let items = [];
    try {
      for (let i in lessons) {
        items.push({
          title: lessons[i].getField('title'),
          type: lessons[i].post.type,
          thumbnail: lessons[i].getData('thumbnail_url'),
          id: lessons[i].id,
          publishedOn:
            lessons[i].publishedOn.slice(0, 10) +
            'T' +
            lessons[i].publishedOn.slice(11, 16),
          duration:
            newContent.post.bundle_count > 1
              ? 0
              : new ContentModel(
                  lessons[i].getFieldMulti('video')[0]
                )?.getField('length_in_seconds'),

          isAddedToList: lessons[i].isAddedToList,
          isStarted: lessons[i].isStarted,
          isCompleted: lessons[i].isCompleted,
          progress_percent: lessons[i].post.progress_percent,
          mobile_app_url: lessons[i].post.mobile_app_url
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.setState({
      id: newContent.id,
      isAddedToList: newContent.isAddedToList,
      thumbnail:
        newContent.post.thumbnail_url || newContent.getData('thumbnail_url'),
      logo: newContent.post.pack_logo,
      description: newContent.getData('description'),
      isStarted: newContent.isStarted,
      isCompleted: newContent.isCompleted,
      xp: newContent.xp,
      videos: items,
      nextLessonUrl: newContent.post.next_lesson_mobile_app_url,
      isLoadingAll: false,
      refreshing: false
    });
  };

  async resetProgress() {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    await resetProgress(this.state.id);
    this.setState({ showRestartCourse: false, refreshing: true }, () =>
      this.getBundle()
    );
  }

  toggleMyList = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.isAddedToList) {
      removeFromMyList(this.state.id);
    } else {
      addToMyList(this.state.id);
    }
    this.setState({
      isAddedToList: !this.state.isAddedToList
    });
  };

  navigate = row => {
    if (this.state.isDisplayingLessons) {
      this.props.navigation.navigate('VIDEOPLAYER', {
        url: row.mobile_app_url
      });
    } else {
      this.props.navigation.push('SINGLEPACK', {
        url: row.mobile_app_url
      });
    }
  };

  refresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getBundle();
    });
  };

  getAspectRatio() {
    if (onTablet && this.state.isLandscape) return 3;
    if (onTablet && !this.state.isLandscape) return 2;

    return 1.8;
  }

  orientationListener = o => {
    if (o === 'UNKNOWN') return;
    let isLandscape = o.indexOf('LAND') >= 0;
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
    if (Platform.OS === 'ios') {
      if (onTablet) this.setState({ isLandscape });
    } else {
      Orientation.getAutoRotateState(isAutoRotateOn => {
        if (isAutoRotateOn && onTablet) this.setState({ isLandscape });
      });
    }
  };

  render() {
    return (
      <SafeAreaView
        forceInset={{
          bottom: 'never'
        }}
        style={[styles.container, { backgroundColor: colors.mainBackground }]}
      >
        <StatusBar
          backgroundColor={colors.mainBackground}
          barStyle={'light-content'}
        />
        {!this.state.isLoadingAll ? (
          <ScrollView
            style={{ backgroundColor: colors.mainBackground }}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            refreshControl={
              <RefreshControl
                colors={[colors.pianoteRed]}
                refreshing={this.state.refreshing}
                onRefresh={() => this.refresh()}
              />
            }
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
              style={[
                styles.centerContent,
                {
                  position: 'absolute',
                  height: 35 * factorRatio,
                  width: 35 * factorRatio,
                  borderRadius: 100,
                  position: 'absolute',
                  left: 7.5 * factorHorizontal,
                  top: 10 * factorVertical,
                  backgroundColor: 'black',
                  zIndex: 4
                }
              ]}
            >
              <EntypoIcon
                name={'chevron-thin-left'}
                size={22.5 * factorRatio}
                color={'white'}
              />
            </TouchableOpacity>

            <ImageBackground
              resizeMode={'cover'}
              style={{
                width: '100%',
                aspectRatio: this.getAspectRatio(),
                justifyContent: 'flex-end'
              }}
              source={{
                uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,w_${Math.round(
                  greaterWDim * 2
                )},ar_16:9,c_fill,g_face/${this.state.thumbnail}`
              }}
            >
              <GradientFeature
                color={'blue'}
                opacity={1}
                height={'100%'}
                borderRadius={0}
                zIndex={0}
                elevation={0}
              />
              <View
                style={
                  this.state.isLandscape ? { marginHorizontal: '10%' } : {}
                }
              >
                <FastImage
                  style={{
                    height: greaterWDim / 15,
                    width: '100%',
                    zIndex: 1
                  }}
                  source={{ uri: this.state.logo }}
                  resizeMode={FastImage.resizeMode.contain}
                />

                <View
                  key={'buttonRow'}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    paddingVertical: 15 * factorRatio
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.toggleMyList();
                    }}
                    style={{
                      flex: 0.5,
                      alignItems: 'center'
                    }}
                  >
                    <AntIcon
                      name={this.state.isAddedToList ? 'close' : 'plus'}
                      size={22 * factorRatio}
                      color={colors.pianoteRed}
                    />
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: 'white',
                        marginTop: 3 * factorRatio,
                        fontSize: 13 * factorRatio
                      }}
                    >
                      {this.state.isAddedToList ? 'Added' : 'My List'}
                    </Text>
                  </TouchableOpacity>

                  {this.state.isCompleted ? (
                    <ResetIcon
                      pressed={() =>
                        this.setState({
                          showRestartCourse: true
                        })
                      }
                    />
                  ) : !this.state.isStarted ? (
                    <StartIcon
                      pressed={() => {
                        this.props.navigation.navigate('VIDEOPLAYER', {
                          url: this.state.nextLessonUrl
                        });
                      }}
                    />
                  ) : (
                    this.state.isStarted && (
                      <ContinueIcon
                        pressed={() =>
                          this.props.navigation.navigate('VIDEOPLAYER', {
                            url: this.state.nextLessonUrl
                          })
                        }
                      />
                    )
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showInfo: !this.state.showInfo
                      });
                    }}
                    style={{
                      flex: 0.5,
                      alignItems: 'center'
                    }}
                  >
                    <AntIcon
                      name={this.state.showInfo ? 'infocirlce' : 'infocirlceo'}
                      size={22 * factorRatio}
                      color={colors.pianoteRed}
                    />
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: 'white',
                        marginTop: 3 * factorRatio,
                        fontSize: 13 * factorRatio
                      }}
                    >
                      Info
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>

            {this.state.showInfo && (
              <View
                key={'info'}
                style={{
                  alignSelf: 'center',
                  backgroundColor: colors.mainBackground,
                  marginHorizontal: this.state.isLandscape ? '10%' : 15
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    marginTop: 5 * factorVertical,
                    fontSize: 15 * factorRatio,
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  {this.state.description}
                </Text>
                <View key='row1' style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      paddingRight: 20,
                      alignItems: 'flex-end'
                    }}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 17 * factorRatio,
                          fontFamily: 'OpenSans-Bold'
                        }}
                      >
                        {this.state.videos.length}
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 13 * factorRatio,
                          fontFamily: 'OpenSans-Regular'
                        }}
                      >
                        LESSONS
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      paddingLeft: 20,
                      alignItems: 'flex-start'
                    }}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 17 * factorRatio,
                          fontFamily: 'OpenSans-Bold'
                        }}
                      >
                        {this.state.xp}
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 13 * factorRatio,
                          fontFamily: 'OpenSans-Regular'
                        }}
                      >
                        XP
                      </Text>
                    </View>
                  </View>
                </View>
                <View key='row2' style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      flex: this.state.id == 262875 ? 0.5 : 1,
                      padding: 10,
                      paddingRight: 20,
                      alignItems: 'flex-end'
                    }}
                  >
                    {(this.state.id == 262875 ? false : true) && (
                      <Download_V2
                        entity={{
                          id: this.state.id,
                          content: packsService.getPack(this.state.url, true)
                        }}
                        styles={{
                          touchable: { flex: 1 },
                          iconSize: {
                            width: 27.5 * factorRatio,
                            height: 27.5 * factorRatio
                          },
                          iconDownloadColor: colors.pianoteRed,
                          activityIndicatorColor: colors.pianoteRed,
                          animatedProgressBackground: colors.pianoteRed,
                          textStatus: {
                            color: '#ffffff',
                            fontSize: 13 * factorRatio,
                            fontFamily: 'OpenSans-Regular',
                            marginTop: 5
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
                    )}
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      paddingLeft: 20,
                      alignItems: 'flex-start'
                    }}
                  >
                    <TouchableOpacity
                      style={{ alignItems: 'center' }}
                      onPress={() => {
                        this.setState({
                          showRestartCourse: true
                        });
                      }}
                    >
                      <MaterialIcon
                        size={27.5 * factorRatio}
                        name={'replay'}
                        color={colors.pianoteRed}
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 13 * factorRatio,
                          fontFamily: 'OpenSans-Regular',
                          marginTop: 5
                        }}
                      >
                        Restart
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            <View style={{ height: 5 * factorVertical }} />
            <View
              key={'verticalVideoList'}
              style={this.state.isLandscape ? { marginHorizontal: '10%' } : {}}
            >
              <VerticalVideoList
                items={this.state.videos}
                title={'Packs'} // title for see all page
                type={'PACK'} // the type of content on page
                isLoading={this.state.isLoadingAll}
                showFilter={false} //
                showType={false} // show course / song by artist name
                showArtist={this.state.isDisplayingLessons ? false : true} // show artist name
                showLength={this.state.isDisplayingLessons ? true : false}
                showLines={!this.state.isDisplayingLessons}
                imageWidth={fullWidth * 0.26} // image width
                outVideos={this.state.outVideos} // if paging and out of videos
                navigator={row => this.navigate(row)}
              />
            </View>
            <View style={{ height: 15 * factorVertical }} />
          </ScrollView>
        ) : (
          <View
            style={[
              styles.centerContent,
              {
                flex: 1,
                backgroundColor: colors.mainBackground
              }
            ]}
          >
            <ActivityIndicator
              size={onTablet ? 'large' : 'small'}
              animating={true}
              color={colors.secondBackground}
            />
          </View>
        )}

        <NavigationBar currentPage={'SINGLEPACK'} />

        <Modal
          key={'restartCourse'}
          isVisible={this.state.showRestartCourse}
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
          <RestartCourse
            hideRestartCourse={() => {
              this.setState({
                showRestartCourse: false
              });
            }}
            type='pack'
            onRestart={() => this.resetProgress()}
          />
        </Modal>
      </SafeAreaView>
    );
  }
}
