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
  RefreshControl
} from 'react-native';
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

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
      progress: 0
    };
  }

  async componentDidMount() {
    let profileImage = await AsyncStorage.getItem('profileURI');
    if (profileImage) {
      this.setState({ profileImage });
    }

    this.getContent();
  }

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
      items: [...this.state.items, ...items],
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
      nextLesson: new ContentModel(response.post.current_lesson)
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
        items: []
      },
      () => {
        this.getContent();
      }
    );
  };

  refresh = () => {
    this.setState({ isLoadingAll: true, items: [] }, () => {
      this.getContent();
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: fullHeight * 0.1,
            width: fullWidth,
            position: 'absolute',
            zIndex: 2,
            elevation: 2,
            alignSelf: 'stretch'
          }}
        >
          <NavMenuHeaders currentPage={'LESSONS'} parentPage={'FOUNDATIONS'} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          style={{
            flex: 1,
            backgroundColor: colors.mainBackground
          }}
          refreshControl={
            <RefreshControl
              colors={[colors.pianoteRed]}
              refreshing={this.state.isLoadingAll}
              onRefresh={() => this.refresh()}
            />
          }
        >
          <View
            key={'backgroundColoring'}
            style={{
              backgroundColor: colors.thirdBackground,
              position: 'absolute',
              height: fullHeight,
              top: -fullHeight,
              left: 0,
              right: 0,
              zIndex: 10,
              elevation: 10
            }}
          />
          <View
            key={'header'}
            style={{
              height: fullHeight * 0.1,
              backgroundColor: colors.thirdBackground
            }}
          />
          <View
            key={'image'}
            style={[
              styles.centerContent,
              {
                height: fullHeight * 0.32
              }
            ]}
          >
            <GradientFeature
              color={'blue'}
              opacity={1}
              height={'100%'}
              borderRadius={0}
            />
            <FastImage
              style={{
                flex: 1,
                alignSelf: 'stretch',
                backgroundColor: colors.mainBackground
              }}
              source={require('Pianote2/src/assets/img/imgs/foundations-background-image.png')}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View
              key={'pianoteSVG'}
              style={{
                position: 'absolute',
                height: '100%',
                width: fullWidth,
                zIndex: 2,
                elevation: 2
              }}
            >
              <View style={{ flex: 0.4 }} />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }} />
                <Pianote
                  height={fullHeight * 0.03}
                  width={fullWidth * 0.35}
                  fill={'white'}
                />
                <View style={{ flex: 1 }} />
              </View>
              <Text
                key={'foundations'}
                style={{
                  fontSize: 60 * factorRatio,
                  color: 'white',
                  fontFamily: 'RobotoCondensed-Bold',
                  transform: [{ scaleX: 0.7 }],
                  textAlign: 'center'
                }}
              >
                FOUNDATIONS
              </Text>
              <View style={{ flex: 0.6 }} />
              {this.state.foundationIsCompleted ? (
                <ResetIcon
                  pxFromTop={
                    onTablet
                      ? fullHeight * 0.32 * 0.725
                      : fullHeight * 0.305 * 0.725
                  }
                  buttonHeight={
                    onTablet
                      ? fullHeight * 0.06
                      : Platform.OS == 'ios'
                      ? fullHeight * 0.05
                      : fullHeight * 0.055
                  }
                  pxFromLeft={(fullWidth * 0.5) / 2}
                  buttonWidth={fullWidth * 0.5}
                  pressed={() =>
                    this.setState({
                      showRestartCourse: true
                    })
                  }
                />
              ) : this.state.foundationIsStarted ? (
                <ContinueIcon
                  pxFromTop={
                    onTablet
                      ? fullHeight * 0.32 * 0.725
                      : fullHeight * 0.305 * 0.725
                  }
                  buttonHeight={
                    onTablet
                      ? fullHeight * 0.06
                      : Platform.OS == 'ios'
                      ? fullHeight * 0.05
                      : fullHeight * 0.055
                  }
                  pxFromLeft={(fullWidth * 0.5) / 2}
                  buttonWidth={fullWidth * 0.5}
                  pressed={() =>
                    this.props.navigation.navigate('VIDEOPLAYER', {
                      url: this.state.nextLesson.post.mobile_app_url
                    })
                  }
                />
              ) : (
                !this.state.foundationIsStarted && (
                  <StartIcon
                    pxFromTop={
                      onTablet
                        ? fullHeight * 0.32 * 0.725
                        : fullHeight * 0.305 * 0.725
                    }
                    buttonHeight={
                      onTablet
                        ? fullHeight * 0.06
                        : Platform.OS == 'ios'
                        ? fullHeight * 0.05
                        : fullHeight * 0.055
                    }
                    pxFromLeft={(fullWidth * 0.5) / 2}
                    buttonWidth={fullWidth * 0.5}
                    pressed={() =>
                      this.props.navigation.navigate('VIDEOPLAYER', {
                        url: this.state.nextLesson.post.mobile_app_url
                      })
                    }
                  />
                )
              )}
              <View
                key={'info'}
                style={[
                  styles.centerContent,
                  {
                    position: 'absolute',
                    right: 0,
                    top: onTablet
                      ? fullHeight * 0.32 * 0.725
                      : fullHeight * 0.305 * 0.725,
                    width: fullWidth * 0.25,
                    height: onTablet
                      ? fullHeight * 0.06
                      : Platform.OS == 'ios'
                      ? fullHeight * 0.05
                      : fullHeight * 0.055,
                    zIndex: 3,
                    elevation: 3
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
            </View>
          </View>
          {this.state.foundationIsStarted && (
            <View
              key={'profile'}
              style={{
                height: fullHeight * 0.06,
                backgroundColor: colors.mainBackground,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FastImage
                style={{
                  height: fullHeight * 0.06,
                  width: fullHeight * 0.06,
                  borderRadius: 100,
                  backgroundColor: colors.secondBackground,
                  alignSelf: 'stretch',
                  borderWidth: 3 * factorRatio,
                  borderColor: colors.secondBackground,
                  marginHorizontal: 10
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
                  marginHorizontal: 10
                }}
              >
                LEVEL 1
              </Text>
            </View>
          )}
          {this.state.showInfo && (
            <View
              key={'info'}
              style={{
                width: fullWidth,
                paddingLeft: fullWidth * 0.05,
                paddingRight: fullWidth * 0.05
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
                  <TouchableOpacity
                    style={[
                      styles.centerContent,
                      {
                        width: 70 * factorRatio
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }} />
                    <MaterialIcon
                      name={'arrow-collapse-down'}
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
                      Download
                    </Text>
                  </TouchableOpacity>
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
            type='foundation'
            onRestart={() => this.onRestartFoundation()}
          />
        </Modal>
        {!this.state.isLoadingAll && this.state.nextLesson && (
          <NextVideo
            item={this.state.nextLesson}
            progress={this.state.progress}
            type='FOUNDATION'
            onNextLesson={() =>
              this.props.navigation.navigate('VIDEOPLAYER', {
                url: this.state.nextLesson.post.mobile_app_url
              })
            }
          />
        )}
        <NavigationBar currentPage={''} />
      </View>
    );
  }
}
