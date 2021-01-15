/**
 * Method
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
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';

import ResetIcon from '../../components/ResetIcon';
import NextVideo from '../../components/NextVideo';
import StartIcon from '../../components/StartIcon';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import RestartCourse from '../../modals/RestartCourse';
import ContinueIcon from '../../components/ContinueIcon';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import {
  likeContent,
  unlikeContent,
  resetProgress
} from '../../services/UserActions';
import { NetworkContext } from '../../context/NetworkProvider';
import methodService from '../../services/method.service';

let greaterWDim;

export default class Method extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      methodIsStarted: this.props.navigation.state.params.methodIsStarted,
      methodIsCompleted: this.props.navigation.state.params.methodIsCompleted,
      showRestartCourse: false,
      bannerNextLessonUrl: '',
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
      if (onTablet) this.setState({ isLandscape });
    } else {
      Orientation.getAutoRotateState(isAutoRotateOn => {
        if (isAutoRotateOn && onTablet) this.setState({ isLandscape });
      });
    }
  };

  getContent = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    const response = new ContentModel(await methodService.getMethod());
    const newContent = response.post.levels.map(data => {
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
      bannerNextLessonUrl: response.post.banner_button_url,
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
      nextLesson: new ContentModel(response.post.next_lesson),
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

  onRestartMethod = async () => {
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
    if (onTablet && this.state.isLandscape) return 3;
    if (onTablet && !this.state.isLandscape) return 2;
    return 1.8;
  }

  goToLesson(url) {
    return this.props.navigation.navigate('VIDEOPLAYER', { url });
  }

  render() {
    return (
      <View style={[styles.mainContainer, {backgroundColor: 'black'}]}>
        <NavMenuHeaders
          isMethod={true}
          currentPage={'LESSONS'}
          parentPage={'METHOD'}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          style={styles.methodContainer}
          refreshControl={
            <RefreshControl
              colors={[colors.pianoteRed]}
              refreshing={this.state.refreshing}
              onRefresh={() => this.refresh()}
            />
          }
        >
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
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '100%'
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
              <View style={styles.centerContent}>
                <Pianote
                  height={fullHeight * 0.04 * factorRatio}
                  width={fullWidth * 0.33 * factorRatio}
                  fill={colors.pianoteRed}
                />
              </View>
              <FastImage
                style={{
                  marginTop: 5 * factorVertical,
                  height: greaterWDim / 20,
                  width: '50%',
                  alignSelf: 'center'
                }}
                source={require('Pianote2/src/assets/img/imgs/method-logo.png')}
                resizeMode={FastImage.resizeMode.contain}
              />
              <View
                style={{
                  marginBottom: 10 * factorVertical,
                  marginTop: 25 * factorRatio,
                  height: 40 * factorRatio,
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <View style={{ flex: 0.5 }} />
                {this.state.methodIsCompleted ? (
                  <ResetIcon
                    pressed={() =>
                      this.setState({
                        showRestartCourse: true
                      })
                    }
                  />
                ) : this.state.methodIsStarted ? (
                  <ContinueIcon
                    pressed={() =>
                      this.goToLesson(this.state.bannerNextLessonUrl)
                    }
                  />
                ) : (
                  !this.state.methodIsStarted && (
                    <StartIcon
                      pressed={() =>
                        this.goToLesson(this.state.bannerNextLessonUrl)
                      }
                    />
                  )
                )}

                <TouchableOpacity
                  style={[styles.centerContent, { flex: 0.5 }]}
                  onPress={() => {
                    this.setState({
                      showInfo: !this.state.showInfo
                    });
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
            </View>
          </ImageBackground>
          {this.state.methodIsStarted && (
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
                paddingHorizontal: this.state.isLandscape ? '10%' : 15
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
                {this.state.description !== 'TBD' ? this.state.description : ''}
              </Text>
              <View key={'containStats'}>
                <View
                  key={'stats'}
                  style={[
                    styles.centerContent,
                    {
                      marginTop: 10 * factorVertical,
                      flex: 0.22,
                      flexDirection: 'row'
                    }
                  ]}
                >
                  <View style={{ flex: 1 }} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: 70 * factorRatio,
                        marginRight: 15 * factorRatio
                      }
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 17 * factorRatio,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Bold',
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
                      LEVELS
                    </Text>
                  </View>
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
                  <View style={{ flex: 1 }} />
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
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showRestartCourse: true
                      });
                    }}
                    style={[
                      styles.centerContent,
                      {
                        marginLeft: 15 * factorRatio,
                        marginBottom: 30 * factorVertical,
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
                  <View style={{ flex: 1 }} />
                </View>
              </View>
            </View>
          )}
          <View
            style={{
              paddingHorizontal: this.state.isLandscape ? '10%' : 0,
              marginBottom: 10 * factorVertical
            }}
          >
            <VerticalVideoList
              isMethod={true}
              items={this.state.items}
              isLoading={this.state.isLoadingAll}
              title={'METHOD'}
              type={'LESSONS'}
              showFilter={false}
              showType={false}
              showArtist={false}
              showLength={false}
              showSort={false}
              isMethodLevel={true}
              isSquare={true}
              imageWidth={fullWidth * 0.26}
            />
          </View>
        </ScrollView>
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
            type='method'
            onRestart={() => this.onRestartMethod()}
          />
        </Modal>
        {!this.state.isLoadingAll && this.state.nextLesson && (
          <NextVideo
            item={this.state.nextLesson}
            isMethod={true}
            progress={this.state.progress}
            type='METHOD'
            onNextLesson={() =>
              this.goToLesson(this.state.nextLesson.post.mobile_app_url)
            }
          />
        )}
        <NavigationBar currentPage={''} isMethod={true} />
      </View>
    );
  }
}
