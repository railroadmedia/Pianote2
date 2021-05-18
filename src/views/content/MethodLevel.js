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
import { SafeAreaView } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import Icon from '../../assets/icons.js';
import Back from '../../assets/img/svgs/back.svg';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';
import LongButton from '../../components/LongButton';
import RestartCourse from '../../modals/RestartCourse';
import NextVideo from '../../components/NextVideo';
import NavigationBar from '../../components/NavigationBar';
import VerticalVideoList from '../../components/VerticalVideoList';
import {
  addToMyList,
  removeFromMyList,
  resetProgress
} from '../../services/UserActions';
import { NetworkContext } from '../../context/NetworkProvider';
import methodService from '../../services/method.service';
import { goBack, navigate } from '../../../AppNavigator';

let greaterWDim;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

export default class MethodLevel extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      level: props.route?.params.level,
      id: null,
      started: false,
      completed: false,
      nextLesson: null,
      isLoadingAll: true,
      showInfo: false,
      isAddedToList: false,
      refreshing: false,
      progress: 0,
      bannerNextLessonUrl: '',
      url: '',
      description: '',
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width,
      showRestartCourse: false
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  componentDidMount = () => {
    this.getContent();
    Orientation.addDeviceOrientationListener(this.orientationListener);
  };

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this.orientationListener);
  }

  getContent = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let response = await methodService.getMethodContent(
      this.props.route?.params.url
    );

    this.setState({
      items: response.courses,
      nextLesson: response.next_lesson,
      isLoadingAll: false,
      id: response.id,
      bannerNextLessonUrl: response.banner_button_url,
      started: response.started,
      completed: response.completed,
      description: response.description,
      isAddedToList: response.is_added_to_primary_playlist,
      progress: response.progress_percent,
      refreshing: false
    });
  };

  toggleMyList = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.state.isAddedToList
      ? removeFromMyList(this.state.id)
      : addToMyList(this.state.id);
    this.setState(state => ({ isAddedToList: !state.isAddedToList }));
  };

  refresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getContent();
    });
  };

  onRestartLevel = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    await resetProgress(this.state.id);
    this.setState(
      {
        items: [],
        started: false,
        completed: false,
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

    if (isiOS) {
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
            onPress={() => goBack()}
            style={[
              styles.centerContent,
              {
                position: 'absolute',
                height: 40,
                width: 40,
                borderRadius: 100,
                left: 10,
                top: 10,
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
                    height: onTablet ? 100 : 60,
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
                    marginBottom: 10,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }
                ]}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    flexDirection: 'row'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingRight: 10,
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      this.toggleMyList();
                    }}
                  >
                    <View style={styles.centerContent}>
                      <Icon.AntDesign
                        name={!this.state.isAddedToList ? 'plus' : 'close'}
                        size={sizing.myListButtonSize}
                        color={colors.pianoteRed}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: 'white',
                        fontSize: sizing.descriptionText
                      }}
                    >
                      {this.state.isAddedToList ? 'Added' : 'My List'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ width: '50%' }}>
                  <LongButton
                    isMethod={true}
                    type={
                      this.state.completed
                        ? 'RESET'
                        : !this.state.started
                        ? 'START'
                        : 'CONTINUE'
                    }
                    pressed={() => {
                      if (this.state.completed) {
                        this.setState({ showRestartCourse: true });
                      } else {
                        navigate('VIEWLESSON', {
                          url: this.state.bannerNextLessonUrl
                        });
                      }
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    flexDirection: 'row'
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingLeft: 15,
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
                      <Icon.AntDesign
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
                  fontSize: sizing.descriptionText,
                  paddingHorizontal: 10,
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
              imageWidth={(onTablet ? 0.225 : 0.3) * width}
            />
          </View>
        </ScrollView>
        <RestartCourse
          isVisible={this.state.showRestartCourse}
          onBackButtonPress={() => this.setState({ showRestartCourse: false })}
          hideRestartCourse={() => {
            this.setState({
              showRestartCourse: false
            });
          }}
          type='level'
          onRestart={() => this.onRestartLevel()}
        />
        {this.state.nextLesson && (
          <NextVideo
            isMethod={true}
            item={this.state.nextLesson}
            progress={this.state.progress}
            type='LEVEL'
            onNextLesson={() =>
              navigate('VIEWLESSON', {
                url: this.state.nextLesson.mobile_app_url
              })
            }
          />
        )}
        <NavigationBar currentPage={''} isMethod={true} />
      </SafeAreaView>
    );
  }
}
