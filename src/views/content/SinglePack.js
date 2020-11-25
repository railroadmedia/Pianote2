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
  ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import { Download_V2 } from 'RNDownload';
import { SafeAreaView } from 'react-navigation';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import StartIcon from '../../components/StartIcon';
import ContinueIcon from '../../components/ContinueIcon';
import NavigationBar from '../../components/NavigationBar';
import NavigationMenu from '../../components/NavigationMenu';
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
      url: this.props.navigation.state.params.url,
      isAddedToList: false,
      description: '',
      thumbnail: '',
      logo: '',
      xp: 0,
      isStarted: false,
      isCompleted: false,
      nextLessonUrl: '',
      isLoadingAll: true
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  componentDidMount = () => {
    this.getBundle();
  };

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
      videos: [...this.state.videos, ...items],
      nextLessonUrl: newContent.post.next_lesson_mobile_app_url,
      isLoadingAll: false
    });
  };

  async resetProgress() {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    await resetProgress(this.state.id);
    this.setState(
      { showRestartCourse: false, isLoadingAll: true, videos: [] },
      () => this.getBundle()
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
    this.setState({ isLoadingAll: true, videos: [] }, () => {
      this.getBundle();
    });
  };

  render() {
    return (
      <SafeAreaView
        forceInset={{
          bottom: 'never'
        }}
        style={[styles.container, { backgroundColor: colors.mainBackground }]}
      >
        {!this.state.isLoadingAll ? (
          <ScrollView
            style={{ backgroundColor: colors.mainBackground }}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            refreshControl={
              <RefreshControl
                colors={[colors.pianoteRed]}
                refreshing={this.state.isLoadingAll}
                onRefresh={() => this.refresh()}
              />
            }
          >
            <View
              key={'imageContainer'}
              style={{
                height: fullHeight * 0.5,
                zIndex: 3,
                elevation: 3
              }}
            >
              <View
                key={'goBackIcon'}
                style={[
                  styles.centerContent,
                  {
                    position: 'absolute',
                    left: 7.5 * factorHorizontal,
                    top: 10 * factorVertical,
                    height: 35 * factorRatio,
                    width: 35 * factorRatio,
                    borderRadius: 100,
                    zIndex: 5
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: '100%',
                      width: '100%',
                      borderRadius: 100,
                      backgroundColor: 'black',
                      opacity: 0.4
                    }
                  ]}
                >
                  <EntypoIcon
                    name={'chevron-thin-left'}
                    size={22.5 * factorRatio}
                    color={'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: '100%',
                      width: '100%',
                      borderRadius: 100,
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }
                  ]}
                >
                  <EntypoIcon
                    name={'chevron-thin-left'}
                    size={22.5 * factorRatio}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
              <GradientFeature
                color={'blue'}
                opacity={1}
                height={'100%'}
                borderRadius={0}
              />
              <FastImage
                style={{ flex: 1 }}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,w_${
                    (greaterWDim >> 0) * 2
                  },ar_16:9,c_fill,g_face/${this.state.thumbnail}`
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View
                key={'logo'}
                style={{
                  position: 'absolute',
                  bottom:
                    30 * factorRatio +
                    (onTablet ? fullHeight * 0.065 : fullHeight * 0.053),
                  left: 0,
                  width: fullWidth,
                  zIndex: 10,
                  elevation: 10,
                  flexDirection: 'row'
                }}
              >
                <View style={{ flex: 1 }} />
                <FastImage
                  style={{
                    height: 100 * factorRatio,
                    width: '80%'
                  }}
                  source={{ uri: this.state.logo }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={{ flex: 1 }} />
              </View>
              <View
                key={'buttons'}
                style={{
                  position: 'absolute',
                  bottom: 10 * factorRatio,
                  left: 0,
                  width: fullWidth,
                  zIndex: 10,
                  elevation: 10
                }}
              >
                <View key={'buttonRow'} style={{ flexDirection: 'row' }}>
                  <View
                    key={'plusButton'}
                    style={[
                      styles.centerContent,
                      {
                        flex: 1
                      }
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.toggleMyList();
                      }}
                      style={{
                        alignItems: 'center',
                        flex: 1
                      }}
                    >
                      <AntIcon
                        name={this.state.isAddedToList ? 'close' : 'plus'}
                        size={30 * factorRatio}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: 'white',
                        marginTop: 3 * factorRatio,
                        fontSize: 12 * factorRatio
                      }}
                    >
                      {this.state.isAddedToList ? 'Added' : 'My List'}
                    </Text>
                  </View>
                  <View key={'start'} style={{ width: fullWidth * 0.5 }}>
                    <View style={{ flex: 1 }} />
                    {this.state.isCompleted ? (
                      <ResetIcon
                        pxFromTop={0}
                        pxFromLeft={0}
                        buttonWidth={fullWidth * 0.5}
                        buttonHeight={
                          onTablet ? fullHeight * 0.065 : fullHeight * 0.053
                        }
                        pressed={() =>
                          this.setState({
                            showRestartCourse: true
                          })
                        }
                      />
                    ) : !this.state.isStarted ? (
                      <StartIcon
                        pxFromTop={0}
                        pxFromLeft={0}
                        buttonWidth={fullWidth * 0.5}
                        buttonHeight={
                          onTablet ? fullHeight * 0.065 : fullHeight * 0.053
                        }
                        pressed={() => {
                          this.props.navigation.navigate('VIDEOPLAYER', {
                            url: this.state.nextLessonUrl
                          });
                        }}
                      />
                    ) : (
                      this.state.isStarted && (
                        <ContinueIcon
                          pxFromTop={0}
                          pxFromLeft={0}
                          buttonWidth={fullWidth * 0.5}
                          buttonHeight={
                            onTablet ? fullHeight * 0.065 : fullHeight * 0.053
                          }
                          pressed={() =>
                            this.props.navigation.navigate('VIDEOPLAYER', {
                              url: this.state.nextLessonUrl
                            })
                          }
                        />
                      )
                    )}
                    <View style={{ flex: 1 }} />
                  </View>
                  <View
                    key={'infoButton'}
                    style={[
                      styles.centerContent,
                      {
                        flex: 1
                      }
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          showInfo: !this.state.showInfo
                        });
                      }}
                      style={{
                        flex: 1,
                        alignItems: 'center'
                      }}
                    >
                      <AntIcon
                        name={
                          this.state.showInfo ? 'infocirlce' : 'infocirlceo'
                        }
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
              </View>
            </View>
            {this.state.showInfo && (
              <View
                key={'info'}
                style={{
                  width: fullWidth,
                  backgroundColor: colors.mainBackground,
                  paddingLeft: fullWidth * 0.05,
                  paddingRight: fullWidth * 0.05
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
                      flex: (this.state.id == 262875 ? 0.5 : 1),
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
                        touchable: {},
                        iconDownloadColor: colors.pianoteRed,
                        activityIndicatorColor: colors.pianoteRed,
                        animatedProgressBackground: colors.pianoteRed,
                        textStatus: {
                          color: '#ffffff',
                          fontSize: 13 * factorRatio,
                          fontFamily: 'OpenSans-Regular',
                          marginTop: 10 * factorVertical
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
                        size={25}
                        name={'replay'}
                        color={colors.pianoteRed}
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 13 * factorRatio,
                          fontFamily: 'OpenSans-Regular',
                          marginTop: 10 * factorVertical
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
              style={[
                styles.centerContent,
                {
                  minHeight: fullHeight * 0.29 * 0.90625,
                  justifyContent: 'space-around',
                  alignContent: 'space-around',
                  flexDirection: 'row'
                }
              ]}
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
                imageRadius={5 * factorRatio} // radius of image shown
                containerBorderWidth={0} // border of box
                containerWidth={fullWidth} // width of list
                containerHeight={
                  onTablet
                    ? fullHeight * 0.15
                    : Platform.OS == 'android'
                    ? fullHeight * 0.115
                    : fullHeight * 0.095
                } // height per row
                imageHeight={
                  onTablet
                    ? fullHeight * 0.12
                    : Platform.OS == 'android'
                    ? fullHeight * 0.095
                    : fullHeight * 0.0825
                } // image height
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
          key={'navMenu'}
          isVisible={this.state.showModalMenu}
          style={{
            margin: 0,
            height: fullHeight,
            width: fullWidth
          }}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
        >
          <NavigationMenu
            onClose={e => {
              this.setState({ showModalMenu: e });
            }}
            parentPage={this.state.parentPage}
            menu={this.state.menu}
          />
        </Modal>
        <Modal
          key={'restartCourse'}
          isVisible={this.state.showRestartCourse}
          style={[
            styles.centerContent,
            {
              margin: 0,
              height: fullHeight,
              width: fullWidth
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
