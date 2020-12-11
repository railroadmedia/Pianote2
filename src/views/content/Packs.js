/**
 * Packs
 */
import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  FlatList,
  RefreshControl,
  Dimensions,
  ImageBackground
} from 'react-native';
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';

import StartIcon from '../../components/StartIcon';
import MoreInfoIcon from '../../components/MoreInfoIcon';
import RestartCourse from '../../modals/RestartCourse';
import ContinueIcon from '../../components/ContinueIcon';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import GradientFeature from '../../components/GradientFeature';
import { resetProgress } from '../../services/UserActions';
import packsService from '../../services/packs.service';
import { NetworkContext } from '../../context/NetworkProvider';
import Orientation from 'react-native-orientation-locker';

let greaterWDim;
export default class Packs extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      packs: [],
      headerPackImg: '',
      headerPackLogo: '',
      headerPackUrl: '',
      headerPackNextLessonUrl: '',
      headerPackCompleted: false,
      headerPackStarted: false,
      isLoading: true,
      refreshing: false,
      showRestartCourse: false,
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  componentDidMount() {
    Orientation.addDeviceOrientationListener(this.orientationListener);

    this.getData();
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

  async getData() {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    const response = await packsService.allPacks();
    const newContent = response.myPacks.map(data => {
      return new ContentModel(data);
    });
    const topHeaderPack = new ContentModel(response.topHeaderPack);

    let items = [];
    for (let i in newContent) {
      items.push({
        id: newContent[i].id,
        thumbnail: newContent[i].getData('thumbnail_url'),
        logo: newContent[i].getData('logo_image_url'),
        bundle_count: newContent[i].post.bundle_count,
        mobile_app_url: newContent[i].post.mobile_app_url
      });
    }

    this.setState({
      packs: items,
      isLoading: false,
      refreshing: false,
      showRestartCourse: false,
      headerPackImg: topHeaderPack.getData('thumbnail_url'),
      headerPackLogo: topHeaderPack.getData('logo_image_url'),
      headerPackUrl: topHeaderPack.post.mobile_app_url,
      headerPackCompleted: topHeaderPack.isCompleted,
      headerPackStarted: topHeaderPack.isStarted,
      headerPackNextLessonUrl: topHeaderPack.post.next_lesson_mobile_app_url
    });
  }

  onRestartPack = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    await resetProgress(this.state.id);
    this.setState({ refreshing: true, showRestartCourse: false }, () =>
      this.getData()
    );
  };

  refresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getData();
    });
  };

  getAspectRatio() {
    let { isLandscape } = this.state;
    if (DeviceInfo.isTablet()) {
      if (isLandscape) {
        return 3;
      }
      return 2;
    }
    return 1.2;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.thirdBackground }}>
        <NavMenuHeaders currentPage={'PACKS'} />

        <FlatList
          windowSize={10}
          style={{ flex: 1 }}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          numColumns={3}
          removeClippedSubviews={true}
          keyExtractor={item => item.id}
          data={this.state.packs}
          keyboardShouldPersistTaps='handled'
          refreshControl={
            <RefreshControl
              colors={[colors.pianoteRed]}
              refreshing={this.state.refreshing}
              onRefresh={() => this.refresh()}
            />
          }
          ListEmptyComponent={() => (
            <View
              style={[
                styles.centerContent,
                {
                  flex: 1
                }
              ]}
            >
              <ActivityIndicator
                size={onTablet ? 'large' : 'small'}
                animating={true}
                color={'white'}
              />
            </View>
          )}
          ListHeaderComponent={() => (
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
                )},ar_2,c_fill,g_face/${this.state.headerPackImg}`
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
              <FastImage
                style={{
                  height: greaterWDim / 15,
                  width: '100%',
                  zIndex: 6
                }}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/f_png,q_auto:eco,w_${Math.round(
                    greaterWDim * 2
                  )}/${this.state.headerPackLogo}`
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  margin: 15,
                  zIndex: 3
                }}
              >
                {this.state.headerPackCompleted ? (
                  <ResetIcon
                    pressed={() =>
                      this.setState({
                        showRestartCourse: true
                      })
                    }
                  />
                ) : !this.state.headerPackStarted ? (
                  <StartIcon
                    pressed={() =>
                      this.props.navigation.navigate('VIDEOPLAYER', {
                        url: this.state.headerPackNextLessonUrl
                      })
                    }
                  />
                ) : (
                  <ContinueIcon
                    pressed={() =>
                      this.props.navigation.navigate('VIDEOPLAYER', {
                        url: this.state.headerPackNextLessonUrl
                      })
                    }
                  />
                )}
                <View style={{ flex: 0.1 }} />
                <MoreInfoIcon
                  pressed={() => {
                    this.props.navigation.push('SINGLEPACK', {
                      url: this.state.headerPackUrl
                    });
                  }}
                />
              </View>
            </ImageBackground>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push('SINGLEPACK', {
                  url: item.mobile_app_url
                });
              }}
              style={{
                width: '33%',
                paddingLeft: 10,
                paddingTop: 10
              }}
            >
              <FastImage
                style={{
                  borderRadius: 7.5 * factorRatio,
                  width: '100%',
                  aspectRatio: 0.7,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,c_thumb,w_${
                    ((greaterWDim / 3) >> 0) * 2
                  },ar_0.7/${item.thumbnail}`
                }}
                resizeMode={FastImage.resizeMode.cover}
              >
                <View
                  key={'logo'}
                  style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingBottom: 10
                  }}
                >
                  <View />
                  <View style={{ width: '100%' }}>
                    <FastImage
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        height: 2 * (greaterWDim / 50)
                      }}
                      source={{
                        uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,w_${
                          (((0.9 * greaterWDim) / 3) >> 0) * 2
                        }/${item.logo}`
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </View>
                </View>
              </FastImage>
            </TouchableOpacity>
          )}
        />

        <NavigationBar currentPage={'PACKS'} />

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
            onRestart={() => this.onRestartPack()}
          />
        </Modal>
      </View>
    );
  }
}
