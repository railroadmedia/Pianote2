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
import FastImage from 'react-native-fast-image';
import Icon from '../../assets/icons.js';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';
import LongButton from '../../components/LongButton';
import NextVideo from '../../components/NextVideo';
import RestartCourse from '../../modals/RestartCourse';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import { resetProgress } from '../../services/UserActions';
import { NetworkContext } from '../../context/NetworkProvider';
import methodService from '../../services/method.service';
import { navigate } from '../../../AppNavigator';

let greaterWDim;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

export default class Method extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      methodIsStarted: props.route?.params.methodIsStarted,
      methodIsCompleted: props.route?.params.methodIsCompleted,
      showRestartCourse: false,
      id: null,
      isStarted: false,
      isCompleted: false,
      showInfo: false,
      isLoadingAll: true,
      level: 1,
      xp: 0,
      description: '',
      nextLesson: null,
      refreshing: false,
      xp: 0,
      progress: 0,
      description: '',
      bannerNextLessonUrl: '',
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  componentDidMount() {
    Orientation.addDeviceOrientationListener(this.orientationListener);
    this.getContent();
  }

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this.orientationListener);
  }

  orientationListener = o => {
    if (o === 'UNKNOWN') return;
    let isLandscape = o.indexOf('LAND') >= 0;

    if (isiOS) {
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
    const response = await methodService.getMethod();

    this.setState({
      items: response.levels,
      id: response.id,
      isStarted: response.started,
      isCompleted: response.completed,
      bannerNextLessonUrl: response.banner_button_url,
      isLoadingAll: false,
      xp: response.total_xp, //missing
      description: response.description,
      progress: response.progress_percent,
      nextLesson: response.next_lesson,
      refreshing: false
    });
  };

  onRestartMethod = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState({ items: [], showRestartCourse: false });
    await resetProgress(this.state.id);
    this.setState(
      {
        methodIsStarted: false,
        methodIsCompleted: false,
        isStarted: false,
        isCompleted: false,
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
    return navigate('VIEWLESSON', { url });
  }

  getSquareHeight = () => {
    if (onTablet) {
      return 150;
    }
    return width * 0.26;
  };

  render() {
    return (
      <View style={[styles.mainContainer, { backgroundColor: 'black' }]}>
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
            source={require('../../../src/assets/img/imgs/backgroundHands.png')}
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
                <FastImage
                  style={{
                    width: '70%',
                    height: onTablet ? 100 : 65,
                    alignSelf: 'center',
                    marginBottom: onTablet ? '2%' : '4%'
                  }}
                  source={require('../../../src/assets/img/imgs/pianote-method.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              <View
                style={[
                  styles.heightButtons,
                  {
                    marginBottom: '3%',
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }
                ]}
              >
                <View style={{ flex: 1 }} />
                <View style={{ width: '50%' }}>
                  <LongButton
                    isMethod={true}
                    type={
                      this.state.methodIsCompleted
                        ? 'RESET'
                        : !this.state.methodIsStarted
                        ? 'START'
                        : 'CONTINUE'
                    }
                    pressed={() => {
                      if (this.state.methodIsCompleted) {
                        this.setState({ showRestartCourse: true });
                      } else {
                        this.goToLesson(this.state.bannerNextLessonUrl);
                      }
                    }}
                  />
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
                    <Icon.AntDesign
                      name={this.state.showInfo ? 'infocirlce' : 'infocirlceo'}
                      size={onTablet ? 20 : 15}
                      color={colors.pianoteRed}
                    />
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
                </View>
              </View>
            </View>
          </ImageBackground>
          {this.state.showInfo && (
            <View
              style={{
                width: '100%',
                paddingHorizontal: this.state.isLandscape ? '10%' : 10
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: sizing.descriptionText,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                {this.state.description || ''}
              </Text>
              <View>
                <View
                  style={[
                    styles.centerContent,
                    {
                      flex: 0.22,
                      flexDirection: 'row',
                      justifyContent: 'center'
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: onTablet ? 100 : 70,
                        marginRight: 15
                      }
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: onTablet ? 25 : 17.5,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Bold'
                      }}
                    >
                      {this.state.items.length}
                    </Text>
                    <Text
                      style={{
                        fontSize: sizing.descriptionText,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 5
                      }}
                    >
                      Levels
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: onTablet ? 100 : 70
                      }
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: onTablet ? 25 : 17.5,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Bold'
                      }}
                    >
                      {this.state.xp}
                    </Text>
                    <Text
                      style={{
                        fontSize: sizing.descriptionText,
                        textAlign: 'left',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 5
                      }}
                    >
                      XP
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.centerContent,
                    {
                      flex: 0.25,
                      flexDirection: 'row',
                      marginTop: 15
                    }
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showRestartCourse: true
                      });
                    }}
                    style={[
                      styles.centerContent,
                      {
                        marginLeft: 10,
                        marginBottom: 10,
                        width: onTablet ? 100 : 70
                      }
                    ]}
                  >
                    <Icon.MaterialCommunityIcons
                      name={'replay'}
                      size={onTablet ? 28 : 20}
                      color={colors.pianoteRed}
                    />
                    <Text
                      style={{
                        fontSize: sizing.descriptionText,
                        textAlign: 'left',
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
              marginBottom: 10
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
              imageWidth={this.getSquareHeight()}
            />
          </View>
        </ScrollView>
        <RestartCourse
          isVisible={this.state.showRestartCourse}
          onBackButtonPress={() => this.setState({ showRestartCourse: false })}
          hideRestartCourse={() => this.setState({ showRestartCourse: false })}
          type='method'
          onRestart={() => this.onRestartMethod()}
        />
        {!this.state.isLoadingAll && this.state.nextLesson && (
          <NextVideo
            item={this.state.nextLesson}
            isMethod={true}
            progress={this.state.progress}
            type='METHOD'
            onNextLesson={() =>
              this.goToLesson(this.state.nextLesson.mobile_app_url)
            }
          />
        )}
        <NavigationBar currentPage={''} isMethod={true} />
      </View>
    );
  }
}
