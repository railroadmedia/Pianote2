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
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation-locker';

import StartIcon from '../../components/StartIcon';
import ResetIcon from '../../components/ResetIcon';
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

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

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
                  height: 35,
                  width: 35,
                  borderRadius: 100,
                  position: 'absolute',
                  left: paddingInset,
                  top: paddingInset,
                  zIndex: 4
                }
              ]}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
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
                    zIndex: 1,
                    marginBottom: onTablet ? '2%' : '4%'
                  }}
                  source={{ uri: this.state.logo }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View
                  style={[
                    styles.heightButtons,
                    {
                      marginBottom: 10,
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }
                  ]}
                >
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 0.5 }} />
                    <TouchableOpacity
                      style={{
                        flex: 0.5,
                        alignItems: 'center'
                      }}
                      onPress={() => {
                        this.toggleMyList();
                      }}
                    >
                      <View style={[styles.centerContent]}>
                        {!this.state.isAddedToList ? (
                          <AntIcon
                            name={'plus'}
                            size={sizing.myListButtonSize}
                            color={colors.pianoteRed}
                          />
                        ) : (
                          <AntIcon
                            name={'close'}
                            size={sizing.myListButtonSize}
                            color={colors.pianoteRed}
                          />
                        )}
                      </View>
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          color: 'white',
                          fontSize: sizing.descriptionText,
                        }}
                      >
                        {this.state.isAddedToList ? 'Added' : 'My List'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: '50%' }}>
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
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={{
                        flex: 0.5,
                        alignItems: 'center'
                      }}
                      onPress={() => {
                        this.setState({
                          showInfo: !this.state.showInfo
                        });
                      }}
                    >
                      <View
                        style={[styles.centerContent, { flexDirection: 'row' }]}
                      >
                        <AntIcon
                          name={
                            this.state.showInfo ? 'infocirlce' : 'infocirlceo'
                          }
                          size={sizing.infoButtonSize}
                          color={colors.pianoteRed}
                        />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          color: 'white',
                          marginTop: 2,
                          fontSize: sizing.descriptionText
                        }}
                      >
                        Info
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flex: 0.5 }} />
                  </View>
                </View>
              </View>
            </ImageBackground>
            {this.state.showInfo && (
              <View
                style={{
                  alignSelf: 'center',
                  backgroundColor: colors.mainBackground,
                  marginHorizontal: this.state.isLandscape
                    ? '10%'
                    : paddingInset,
                  marginTop: '2%'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    marginTop: '5%',
                    fontSize: sizing.descriptionText,
                    paddingHorizontal: paddingInset,

                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  {this.state.description}
                </Text>

                <View style={{ paddingHorizontal: '30%' }}>
                  <View
                    style={[
                      styles.centerContent,
                      { flexDirection: 'row', marginTop: '2%' }
                    ]}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontSize: onTablet ? 25 : 17.5,
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'OpenSans-Bold',
                        marginTop: 10
                      }}
                    >
                      {this.state.videos.length}
                      {`\n`}
                      <Text
                        style={{
                          fontSize: sizing.descriptionText,
                          textAlign: 'center',
                          color: 'white',
                          fontFamily: 'OpenSans-Regular',
                          marginTop: 5
                        }}
                      >
                        LESSONS
                      </Text>
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: onTablet ? 25 : 17.5,
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'OpenSans-Bold',
                        marginTop: 10
                      }}
                    >
                      {this.state.xp}
                      {`\n`}
                      <Text
                        style={{
                          fontSize: sizing.descriptionText,
                          textAlign: 'center',
                          color: 'white',
                          fontFamily: 'OpenSans-Regular',
                          marginTop: 5
                        }}
                      >
                        XP
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.centerContent,
                      { flexDirection: 'row', marginTop: '10%' }
                    ]}
                  >
                    {(this.state.id == 262875 ? false : true) && (
                      <Download_V2
                        entity={{
                          id: this.state.id,
                          content: packsService.getPack(this.state.url, true)
                        }}
                        styles={{
                          flex: this.state.id == 262875 ? 1 : 0,
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
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        flex: 1
                      }}
                      onPress={() => {
                        this.setState({
                          showRestartCourse: true
                        });
                      }}
                    >
                      <MaterialIcon
                        size={sizing.myListButtonSize}
                        name={'replay'}
                        color={colors.pianoteRed}
                      />
                      <Text
                        style={{
                          fontSize: sizing.descriptionText,
                          textAlign: 'center',
                          color: 'white',
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
            <View
              style={{
                paddingHorizontal: this.state.isLandscape ? '10%' : 0,
                marginBottom: 10,
                marginTop: onTablet ? '4%' : '8%'
              }}
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
                imageWidth={onTablet ? width * 0.225 : width * 0.3}
                outVideos={this.state.outVideos} // if paging and out of videos
                navigator={row => this.navigate(row)}
              />
            </View>
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
