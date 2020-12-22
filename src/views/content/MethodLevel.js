/**
 * MethodLevel
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ImageBackground
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';

import ResetIcon from '../../components/ResetIcon';
import RestartCourse from '../../modals/RestartCourse';
import NextVideo from '../../components/NextVideo';
import StartIcon from '../../components/StartIcon';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import ContinueIcon from '../../components/ContinueIcon';
import NavigationBar from '../../components/NavigationBar';
import VerticalVideoList from '../../components/VerticalVideoList';
import {
  addToMyList,
  removeFromMyList,
  resetProgress
} from '../../services/UserActions';
import { NetworkContext } from '../../context/NetworkProvider';
import methodService from '../../services/method.service';

let greaterWDim;

export default class MethodLevel extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      level: this.props.navigation.state.params.level,
      id: null,
      isStarted: false,
      isCompleted: false,
      nextLesson: null,
      isLoadingAll: true,
      url: '',
      xp: 0,
      description: '',
      showInfo: false,
      totalLength: 0,
      isAddedToList: false,
      progress: 0,
      refreshing: false,
      bannerNextLessonUrl: '',
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  componentDidMount = async () => {
    this.getContent();
    Orientation.addDeviceOrientationListener(this.orientationListener);
  };

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this.orientationListener);
  }

  getContent = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await methodService.getMethodContent(
      this.props.navigation.state.params.url
    );
    const newContent = response.courses.map(data => {
      return new ContentModel(data);
    });
    response = new ContentModel(response);
    try {
      let items = [];
      for (let i in newContent) {
        items.push({
          title: newContent[i].getField('title'),
          thumbnail: newContent[i].getData('thumbnail_url'),
          type: newContent[i].type,
          publishedOn:
            newContent[i].publishedOn.slice(0, 10) +
            'T' +
            newContent[i].publishedOn.slice(11, 16),
          id: newContent[i].id,
          isAddedToList: newContent[i].isAddedToList,
          isStarted: newContent[i].isStarted,
          isCompleted: newContent[i].isCompleted,
          progress_percent: newContent[i].post.progress_percent,
          mobile_app_url: newContent[i].post.mobile_app_url,
          levelNum: response.post.level_number
        });
      }

      this.setState({
        items: items,
        nextLesson: response.post.next_lesson
          ? new ContentModel(response.post.next_lesson)
          : null,
        isLoadingAll: false,
        totalLength: this.state.totalLength,
        id: response.id,
        bannerNextLessonUrl: response.post.banner_button_url,
        isStarted: response.isStarted,
        isCompleted: response.isCompleted,
        description: response
          .getData('description')
          .replace(/(<([^>]+)>)/g, '')
          .replace(/&nbsp;/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&#039;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<'),
        isAddedToList: response.isAddedToList,
        progress: response.post.progress_percent,
        refreshing: false
      });
    } catch (error) {
      console.log(error);
    }
  };

  toggleMyList = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.isAddedToList) {
      removeFromMyList(this.state.id);
    } else {
      addToMyList(this.state.id);
    }
    this.setState(state => ({ isAddedToList: !state.isAddedToList }));
  };

  refresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getContent();
    });
  };

  onRestartLevel = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    await resetProgress(this.state.id);
    this.setState(
      {
        items: [],
        isStarted: false,
        isCompleted: false,
        showRestartCourse: false,
        refreshing: true
      },
      () => {
        this.getContent();
      }
    );
  };

  getAspectRatio() {
    if (onTablet && this.state.isLandscape) return 3;
    if (onTablet && !this.state.isLandscape) return 2;
    return 1.8;
  }

  orientationListener = o => {
    if (o === 'UNKNOWN') return;
    let isLandscape = o.indexOf('LAND') >= 0;

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
        style={[styles.container, { backgroundColor: 'black' }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          style={{
            flex: 1,
            backgroundColor: 'black'
          }}
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
            source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
          >
            <LinearGradient
              colors={[
                'transparent',
                'rgba(20, 20, 20, 0.5)',
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
            <View
              style={{
                paddingHorizontal: this.state.isLandscape ? '10%' : 0,
                alignSelf: 'center',
                width: '100%',
                zIndex: 5,
                elevation: 5,
                opacity: 1
              }}
            >
              <View style={{ alignSelf: 'center' }}>
                <Pianote
                  height={fullHeight * 0.035}
                  width={fullWidth * 0.125}
                  fill={colors.pianoteRed}
                />
              </View>
              <FastImage
                style={{
                  height: greaterWDim / 40,
                  width: '50%',
                  alignSelf: 'center'
                }}
                source={require('Pianote2/src/assets/img/imgs/method-logo.png')}
                resizeMode={FastImage.resizeMode.contain}
              />
              <View style={{ height: 15 * factorRatio }} />
              <Text
                key={'level'}
                style={{
                  fontSize: 43 * factorRatio,
                  color: 'white',
                  fontFamily: 'RobotoCondensed-Bold',
                  textAlign: 'center'
                }}
              >
                LEVEL {this.state.level}
              </Text>
              <View style={{ height: 15 * factorRatio }} />
              <View
                key={'startIcon'}
                style={{
                  height: 40 * factorRatio,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly'
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
                  {!this.state.isAddedToList ? (
                    <AntIcon
                      name={'plus'}
                      size={27.5 * factorRatio}
                      color={colors.pianoteRed}
                    />
                  ) : (
                    <AntIcon
                      name={'close'}
                      size={27.5 * factorRatio}
                      color={colors.pianoteRed}
                    />
                  )}
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      color: 'white',
                      fontSize: 12 * factorRatio
                    }}
                  >
                    {this.state.isAddedToList ? 'Added' : 'My List'}
                  </Text>
                </TouchableOpacity>
                {this.state.isCompleted ? (
                  <ResetIcon
                    pressed={() => this.setState({ showRestartCourse: true })}
                  />
                ) : this.state.isStarted ? (
                  <ContinueIcon
                    pressed={() =>
                      this.props.navigation.navigate('VIDEOPLAYER', {
                        url: this.state.bannerNextLessonUrl
                      })
                    }
                  />
                ) : !this.state.isStarted ? (
                  <StartIcon
                    pressed={() =>
                      this.props.navigation.navigate('VIDEOPLAYER', {
                        url: this.state.bannerNextLessonUrl
                      })
                    }
                  />
                ) : null}
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
              <View style={{ height: 10 * factorVertical }} />
            </View>
          </ImageBackground>
          {this.state.showInfo && (
            <View
              key={'info'}
              style={{
                width: '100%',
                paddingHorizontal: this.state.isLandscape ? '10%' : 15
              }}
            >
              <View style={{ height: 20 * factorVertical }} />
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
              <View style={{ height: 15 * factorVertical }} />
            </View>
          )}
          <View
            style={{ paddingHorizontal: this.state.isLandscape ? '10%' : 0 }}
          >
            <VerticalVideoList
              methodLevel={true}
              title={'METHOD'}
              items={this.state.items}
              isLoading={this.state.isLoadingAll}
              showFilter={false} // shows filters button
              showType={false} // show course / song by artist name
              showArtist={false} // show artist name
              showLength={false} // duration of song
              showSort={false}
              showLines={true}
              imageWidth={fullWidth * 0.3} // image width
            />
          </View>
          <View style={{ height: 10 }} />
        </ScrollView>
        <Modal
          key={'restartCourse'}
          isVisible={this.state.showRestartCourse}
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
          <RestartCourse
            hideRestartCourse={() => {
              this.setState({
                showRestartCourse: false
              });
            }}
            type='level'
            onRestart={() => this.onRestartLevel()}
          />
        </Modal>
        {this.state.nextLesson && (
          <NextVideo
            isMethod={true}
            item={this.state.nextLesson}
            progress={this.state.progress}
            type='LEVEL'
            onNextLesson={() =>
              this.props.navigation.navigate('VIDEOPLAYER', {
                url: this.state.nextLesson.post.mobile_app_url
              })
            }
          />
        )}

        <NavigationBar currentPage={''} isMethod={true} />
      </SafeAreaView>
    );
  }
}