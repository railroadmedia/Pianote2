/**
 * Foundations
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Dimensions,
  ImageBackground
} from 'react-native';
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

import ResetIcon from '../../components/ResetIcon';
import NextVideo from '../../components/NextVideo';
import StartIcon from '../../components/StartIcon';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import RestartCourse from '../../modals/RestartCourse';
import ContinueIcon from '../../components/ContinueIcon';
import foundationsService from '../../services/foundations.service';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import GradientFeature from '../../components/GradientFeature';
import VerticalVideoList from '../../components/VerticalVideoList';
import {
  likeContent,
  unlikeContent,
  resetProgress
} from '../../services/UserActions';
import { NetworkContext } from '../../context/NetworkProvider';

let greaterWDim;

export default class Foundations extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      foundationIsStarted: this.props.navigation.state.params
        .foundationIsStarted,
      foundationIsCompleted: this.props.navigation.state.params
        .foundationIsCompleted,
      showRestartCourse: false,
      id: null,
      isStarted: false,
      isCompleted: false,
      isLiked: false,
      likeCount: 0,
      showInfo: false,
      isLoadingAll: true,
      totalLength: 0,
      level: 1,
      profileImage: '',
      xp: 0,
      description: '',
      nextLesson: null,
      progress: 0,
      refreshing: false,
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  async componentDidMount() {
    Orientation.addDeviceOrientationListener(this.orientationListener);

    let profileImage = await AsyncStorage.getItem('profileURI');
    if (profileImage) {
      this.setState({ profileImage });
    }

    this.getContent();
  }

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this.orientationListener);
  }

  orientationListener = o => {
    if (o === 'UNKNOWN') return;
    let isLandscape = o.indexOf('LAND') >= 0;

    if (Platform.OS === 'ios') {
      if (DeviceInfo.isTablet()) this.setState({ isLandscape });
    } else {
      Orientation.getAutoRotateState(isAutoRotateOn => {
        if (isAutoRotateOn && DeviceInfo.isTablet())
          this.setState({ isLandscape });
      });
    }
  };

  getContent = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    const response = new ContentModel(
      await foundationsService.getFoundation('foundations-2019')
    );
    const newContent = response.post.units.map(data => {
      return new ContentModel(data);
    });
    let items = [];
    for (let i in newContent) {
      items.push({
        title: newContent[i].getField('title'),
        artist: newContent[i].post.fields
          .filter(d => d.key === 'instructor')
          .map(s => ({
            value: s.value.fields.find(f => f.key === 'name').value
          }))
          .reduce((r, obj) => r.concat(obj.value, '  '), []),
        thumbnail: newContent[i].getData('thumbnail_url'),
        type: newContent[i].post.type,
        publishedOn:
          newContent[i].publishedOn.slice(0, 10) +
          'T' +
          newContent[i].publishedOn.slice(11, 16),
        description: newContent[i]
          .getData('description')
          .replace(/(<([^>]+)>)/g, '')
          .replace(/&nbsp;/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&#039;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<'),
        id: newContent[i].id,
        progress_percent: newContent[i].post.progress_percent,
        mobile_app_url: newContent[i].post.mobile_app_url
      });
    }

    this.setState({
      items: items,
      id: response.id,
      isStarted: response.isStarted,
      isCompleted: response.isCompleted,
      isLiked: response.post.is_liked_by_current_user,
      likeCount: response.likeCount,
      isLoadingAll: false,
      totalLength: response.post.length_in_seconds,
      xp: response.post.total_xp,
      description: response
        .getData('description')
        .replace(/(<([^>]+)>)/g, '')
        .replace(/&nbsp;/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<'),
      progress: response.post.progress_percent,
      nextLesson: new ContentModel(response.post.current_lesson),
      refreshing: false
    });
  };

  toggleLike = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.isLiked) {
      unlikeContent(this.state.id);
    } else {
      likeContent(this.state.id);
    }
    this.setState({
      isLiked: !this.state.isLiked,
      likeCount: this.state.isLiked
        ? this.state.likeCount - 1
        : this.state.likeCount + 1
    });
  };

  onRestartFoundation = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    resetProgress(this.state.id);
    this.setState(
      {
        isStarted: false,
        isCompleted: false,
        showRestartCourse: false,
        isLoadingAll: true,
        refreshing: true
      },
      () => {
        this.getContent();
      }
    );
  };

  refresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getContent();
    });
  };

  getAspectRatio() {
    if (DeviceInfo.isTablet() && this.state.isLandscape) return 3;
    if (DeviceInfo.isTablet() && !this.state.isLandscape) return 2;
    return 1.8;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
        <NavMenuHeaders
          isMethod={true}
          currentPage={'LESSONS'}
          parentPage={'FOUNDATIONS'}
        />

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
          {/* <GradientFeature
            color={'black'}
            opacity={1}
            height={'100%'}
            borderRadius={0}
          /> */}
          <ImageBackground
            resizeMode={'cover'}
            style={{
              width: '100%',
              aspectRatio: this.getAspectRatio(),
              justifyContent: 'flex-end'
            }}
            source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
          >
            <View style={{ alignSelf: 'center' }}>
              <Pianote
                height={fullHeight * 0.04}
                width={fullWidth * 0.45}
                fill={colors.pianoteRed}
              />
            </View>
            <FastImage
              style={{
                height: greaterWDim / 20,
                width: '100%',
                alignSelf: 'center'
              }}
              source={require('Pianote2/src/assets/img/imgs/method-logo.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                paddingVertical: 25 * factorRatio
              }}
            >
              <View key='placeholder' style={{ flex: 0.5 }} />
              {this.state.foundationIsCompleted ? (
                <ResetIcon
                  pressed={() =>
                    this.setState({
                      showRestartCourse: true
                    })
                  }
                />
              ) : this.state.foundationIsStarted ? (
                <ContinueIcon
                  pressed={() =>
                    this.props.navigation.navigate('VIDEOPLAYER', {
                      url: this.state.nextLesson.post.mobile_app_url
                    })
                  }
                />
              ) : (
                !this.state.foundationIsStarted && (
                  <StartIcon
                    pressed={() =>
                      this.props.navigation.navigate('VIDEOPLAYER', {
                        url: this.state.nextLesson.post.mobile_app_url
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
                    fontSize: 12 * factorRatio
                  }}
                >
                  Info
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          {this.state.foundationIsStarted && (
            <View
              key={'profile'}
              style={{
                backgroundColor: 'black',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 20 * factorVertical
              }}
            >
              <FastImage
                style={{
                  height: 50 * factorRatio,
                  aspectRatio: 1,
                  borderRadius: 100,
                  backgroundColor: 'white',
                  borderWidth: 3 * factorRatio,
                  borderColor: 'white',
                  marginRight: 5
                }}
                source={{
                  uri:
                    this.state.profileImage ||
                    'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                }}
                resizeMode={FastImage.resizeMode.cover}
              />

              <Text
                style={{
                  color: 'white',
                  fontSize: 35 * factorRatio,
                  fontFamily: 'OpenSans-ExtraBold',
                  textAlign: 'center',
                  marginLeft: 5
                }}
              >
                LEVEL {this.state.level}
              </Text>
            </View>
          )}
          {this.state.showInfo && (
            <View
              key={'info'}
              style={{
                width: '100%',
                paddingVertical: 15,
                paddingLeft: fullWidth * 0.035,
                paddingRight: fullWidth * 0.035
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
              <View key={'containStats'}>
                <View style={{ height: 10 * factorVertical }} />
                <View
                  key={'stats'}
                  style={[
                    styles.centerContent,
                    {
                      flex: 0.22,
                      flexDirection: 'row'
                    }
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'stretch'
                    }}
                  />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: 70 * factorRatio
                      }
                    ]}
                  >
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 17 * factorRatio,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 10 * factorVertical
                      }}
                    >
                      {this.state.items.length}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13 * factorRatio,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 10 * factorVertical
                      }}
                    >
                      COURSES
                    </Text>
                  </View>
                  <View style={{ width: 15 * factorRatio }} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: 70 * factorRatio
                      }
                    ]}
                  >
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 17 * factorRatio,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 10 * factorVertical
                      }}
                    >
                      {this.state.xp}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13 * factorRatio,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 10 * factorVertical
                      }}
                    >
                      XP
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'stretch'
                    }}
                  />
                </View>
                <View style={{ height: 15 * factorVertical }} />
                <View
                  key={'buttons'}
                  style={[
                    styles.centerContent,
                    {
                      flex: 0.25,
                      flexDirection: 'row'
                    }
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'stretch'
                    }}
                  />
                  <View style={{ width: 15 * factorRatio }} />
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showRestartCourse: true
                      });
                    }}
                    style={[
                      styles.centerContent,
                      {
                        width: 70 * factorRatio
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }} />
                    <MaterialIcon
                      name={'replay'}
                      size={27.5 * factorRatio}
                      color={colors.pianoteRed}
                    />
                    <Text
                      style={{
                        fontSize: 13 * factorRatio,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 10 * factorVertical
                      }}
                    >
                      Restart
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'stretch'
                    }}
                  />
                </View>
                <View style={{ height: 30 * factorVertical }} />
              </View>
            </View>
          )}
          <VerticalVideoList
            isMethod={true}
            items={this.state.items}
            isLoading={this.state.isLoadingAll}
            title={'FOUNDATIONS'}
            type={'LESSONS'}
            showFilter={false}
            showType={false}
            showArtist={false}
            showLength={false}
            showSort={false}
            isFoundationsLevel={true}
            imageRadius={5 * factorRatio}
            containerBorderWidth={0}
            containerWidth={fullWidth}
            containerHeight={fullWidth * 0.3}
            imageHeight={fullWidth * 0.26}
            imageWidth={fullWidth * 0.26}
            imageRadius={7.5 * factorRatio}
            containerBorderWidth={0}
            containerWidth={fullWidth}
            containerHeight={fullWidth * 0.285}
            imageHeight={fullWidth * 0.25}
            imageWidth={fullWidth * 0.25}
          />
          <View style={{ height: 10 * factorVertical }} />
        </ScrollView>
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
            type='foundation'
            onRestart={() => this.onRestartFoundation()}
          />
        </Modal>
        {!this.state.isLoadingAll && this.state.nextLesson && (
          <NextVideo
            item={this.state.nextLesson}
            isMethod={true}
            progress={this.state.progress}
            type='FOUNDATION'
            onNextLesson={() =>
              this.props.navigation.navigate('VIDEOPLAYER', {
                url: this.state.nextLesson.post.mobile_app_url
              })
            }
          />
        )}
        <NavigationBar currentPage={''} isMethod={true} />
      </View>
    );
  }
}
