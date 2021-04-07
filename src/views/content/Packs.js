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
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { bindActionCreators } from 'redux';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';

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

import { cacheAndWritePacks } from '../../redux/PacksCacheActions';
import ResetIcon from '../../components/ResetIcon';
import { navigate } from '../../../AppNavigator';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

let greaterWDim;
class Packs extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let { packsCache } = props;
    this.state = {
      packs: [],
      id: '',
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
        Dimensions.get('window').height < Dimensions.get('window').width,
      ...this.initialValidData(packsCache, true)
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
      if (onTablet) this.setState({ isLandscape });
    } else {
      Orientation.getAutoRotateState(isAutoRotateOn => {
        if (isAutoRotateOn && onTablet) this.setState({ isLandscape });
      });
    }
  };

  async getData() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    const response = await packsService.allPacks();
    console.log(response);
    this.props.cacheAndWritePacks(response);
    this.setState(this.initialValidData(response));
  }

  initialValidData = (content, fromCache) => {
    return {
      packs: content.myPacks,
      isLoading: false,
      refreshing: fromCache,
      showRestartCourse: false,
      id: content.topHeaderPack.id,
      headerPackImg: content.topHeaderPack.thumbnail,
      headerPackLogo: content.topHeaderPack.pack_logo,
      headerPackUrl: content.topHeaderPack.mobile_app_url,
      headerPackCompleted: content.topHeaderPack.completed,
      headerPackStarted: content.topHeaderPack.started,
      headerPackNextLessonUrl: content.topHeaderPack.next_lesson_url
    };
  };

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
    if (onTablet) {
      if (isLandscape) {
        return 3;
      }
      return 2;
    }
    return 1.2;
  }

  render() {
    return (
      <View style={styles.packsContainer}>
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
              tintColor={'transparent'}
              colors={[colors.pianoteRed]}
              onRefresh={() => this.refresh()}
              refreshing={isiOS ? false : this.state.refreshing}
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
            <>
              {isiOS && this.state.refreshing && (
                <ActivityIndicator
                  size='small'
                  style={{ padding: 20 }}
                  color={colors.secondBackground}
                />
              )}
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
                    zIndex: 6,
                    marginBottom: onTablet ? '3%' : '4.5%'
                  }}
                  source={{
                    uri: `https://cdn.musora.com/image/fetch/f_png,q_auto:eco,w_${Math.round(
                      greaterWDim * 2
                    )}/${this.state.headerPackLogo}`
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View
                  style={[
                    styles.heightButtons,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: onTablet ? '5%' : '7.5%'
                    }
                  ]}
                >
                  <View style={{ flex: 1 }} />
                  <View
                    style={{
                      width: onTablet ? 200 : '45%'
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
                          navigate('VIDEOPLAYER', {
                            url: this.state.headerPackNextLessonUrl
                          })
                        }
                      />
                    ) : (
                      <ContinueIcon
                        pressed={() =>
                          navigate('VIDEOPLAYER', {
                            url: this.state.headerPackNextLessonUrl
                          })
                        }
                      />
                    )}
                  </View>
                  <View style={onTablet ? { width: 10 } : { flex: 0.5 }} />
                  <View
                    style={{
                      width: onTablet ? 200 : '45%'
                    }}
                  >
                    <MoreInfoIcon
                      pressed={() => {
                        navigate('SINGLEPACK', {
                          url: this.state.headerPackUrl
                        });
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
              </ImageBackground>
            </>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigate('SINGLEPACK', {
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
                  borderRadius: 10,
                  width: '100%',
                  aspectRatio: 0.7
                }}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,c_thumb,w_${
                    ((greaterWDim / 3) >> 0) * 2
                  },ar_0.7/${item.thumbnail}`
                }}
                resizeMode={FastImage.resizeMode.cover}
              >
                <View
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
                        }/${item.pack_logo}`
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
            type='pack'
            onRestart={() => this.onRestartPack()}
          />
        </Modal>
      </View>
    );
  }
}
const mapStateToProps = state => ({ packsCache: state.packsCache });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWritePacks }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Packs);
