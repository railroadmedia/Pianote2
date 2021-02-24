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
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
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
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
        style={styles.methodContainer}
        forceInset={{ bottom: 'never' }}
      >
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
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={[
              styles.centerContent,
              {
                position: 'absolute',
                height: 35 * factor,
                width: 35 * factor,
                borderRadius: 100,
                position: 'absolute',
                left: 7.5 * factor,
                top: 10 * factor,
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
              <View style={styles.centerContent}>
                <FastImage
                  style={{
                    width: '75%',
                    height: 65 * factor,
                    alignSelf: 'center',
                    marginBottom: onTablet ? '3%' : '5%'
                  }}
                  source={require('Pianote2/src/assets/img/imgs/pianote-method.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              <View
                style={[styles.heightButtons, {
                  marginBottom: 10 * factor,
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center'
                }]}
              >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{flex: 0.5}}/>
                  <TouchableOpacity
                    style={{
                      flex: 0.5,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      this.toggleMyList();
                    }}
                  >
                    <View
                      style={[styles.centerContent]}
                    >
                      {!this.state.isAddedToList ? (
                        <AntIcon
                          name={'plus'}
                          size={(onTablet ? 18 : 25) * factor}
                          color={colors.pianoteRed}
                        />
                      ) : (
                        <AntIcon
                          name={'close'}
                          size={(onTablet ? 18 : 25) * factor}
                          color={colors.pianoteRed}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: 'white',
                        fontSize: (onTablet ? 8 : 12) * factor
                      }}
                    >
                      {this.state.isAddedToList ? 'Added' : 'My List'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: '45%' }}>
                  {this.state.isCompleted ? (
                    <ResetIcon
                      isMethod={true}
                      pressed={() => this.setState({ showRestartCourse: true })}
                    />
                  ) : this.state.isStarted ? (
                    <ContinueIcon
                      isMethod={true}
                      pressed={() =>
                        this.props.navigation.navigate('VIDEOPLAYER', {
                          url: this.state.bannerNextLessonUrl
                        })
                      }
                    />
                  ) : !this.state.isStarted ? (
                    <StartIcon
                      isMethod={true}
                      pressed={() =>
                        this.props.navigation.navigate('VIDEOPLAYER', {
                          url: this.state.bannerNextLessonUrl
                        })
                      }
                    />
                  ) : null}
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <TouchableOpacity
                      style={{
                        flex: 0.5,
                        alignItems: 'center',
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
                          size={(onTablet ? 15 : 20) * factor}
                          color={colors.pianoteRed}
                        />
                      </View>
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          color: 'white',
                          marginTop: 2,
                          fontSize: (onTablet ? 8 : 12) * factor
                        }}
                      >
                        Info
                      </Text>
                    </TouchableOpacity>
                  <View style={{flex: 0.5}}/>
                </View>
              </View>
            </View>
          </ImageBackground>
          {this.state.showInfo && (
            <View
              style={{
                width: '100%',
                paddingHorizontal: this.state.isLandscape ? '10%' : 15
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  marginTop: onTablet ? 40 : 30,
                  fontSize: (onTablet ? 10 : 15) * factor,
                  paddingHorizontal: paddingInset,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                {this.state.description}
              </Text>
            </View>
          )}
          <View
            style={{
              paddingHorizontal: this.state.isLandscape ? '10%' : 0,
              marginBottom: 10,
              marginTop: onTablet ? 40 : 30
            }}
          >
            <VerticalVideoList
              methodLevel={true}
              title={'METHOD'}
              items={this.state.items}
              isLoading={this.state.isLoadingAll}
              showFilter={false}
              showType={false}
              showArtist={false}
              showLength={false}
              showSort={false}
              showLines={true}
              imageWidth={onTablet ? width * 0.225 : width * 0.3}
            />
          </View>
        </ScrollView>
        <Modal
          isVisible={this.state.showRestartCourse}
          style={styles.modalContainer}
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
