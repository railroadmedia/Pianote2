/**
 * FoundationsLevel
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import ResetIcon from '../../components/ResetIcon';
import RestartCourse from '../../modals/RestartCourse';
import NextVideo from '../../components/NextVideo';
import StartIcon from '../../components/StartIcon';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import ContinueIcon from '../../components/ContinueIcon';
import foundationsService from '../../services/foundations.service';
import NavigationBar from '../../components/NavigationBar';
import GradientFeature from '../../components/GradientFeature';
import VerticalVideoList from '../../components/VerticalVideoList';
import {
  addToMyList,
  removeFromMyList,
  resetProgress
} from '../../services/UserActions';
import { NetworkContext } from '../../context/NetworkProvider';

export default class FoundationsLevel extends React.Component {
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
      progress: 0
    };
  }

  componentDidMount = async () => {
    this.getContent();
  };

  getContent = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await foundationsService.getUnit(
      this.props.navigation.state.params.url
    );
    const newContent = response.lessons.map(data => {
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
          id: newContent[i].id,
          isAddedToList: newContent[i].isAddedToList,
          isStarted: newContent[i].isStarted,
          isCompleted: newContent[i].isCompleted,
          progress_percent: newContent[i].post.progress_percent,
          mobile_app_url: newContent[i].post.mobile_app_url
        });
      }

      this.setState({
        items: [...this.state.items, ...items],
        nextLesson: response.post.current_lesson
          ? new ContentModel(response.post.current_lesson)
          : null,
        isLoadingAll: false,
        totalLength: this.state.totalLength,
        id: response.id,
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
        progress: response.post.progress_percent
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
    this.setState({ isLoadingAll: true, items: [] }, () => {
      this.getContent();
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

  render() {
    return (
      <SafeAreaView
        forceInset={{
          bottom: 'never'
        }}
        style={[styles.container, { backgroundColor: colors.mainBackground }]}
      >
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
            key={'image'}
            style={[
              styles.centerContent,
              {
                height: fullHeight * 0.33
              }
            ]}
          >
            <View
              key={'goBackIcon'}
              style={[
                styles.centerContent,
                {
                  position: 'absolute',
                  left: 7.5 * factorHorizontal,
                  top: 10 * factorVertical,
                  height: 35 * factorRatio,
                  width: 35 * factorRatio,
                  borderRadius: 100,
                  zIndex: 5
                }
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={[
                  styles.centerContent,
                  {
                    height: '100%',
                    width: '100%',
                    borderRadius: 100,
                    backgroundColor: 'black',
                    opacity: 0.4
                  }
                ]}
              >
                <EntypoIcon
                  name={'chevron-thin-left'}
                  size={22.5 * factorRatio}
                  color={'white'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={[
                  styles.centerContent,
                  {
                    height: '100%',
                    width: '100%',
                    borderRadius: 100,
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }
                ]}
              >
                <EntypoIcon
                  name={'chevron-thin-left'}
                  size={22.5 * factorRatio}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>

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
              <View style={{ flex: 0.7 }} />
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
                  fontSize: 30 * factorRatio,
                  fontWeight: '700',
                  color: 'white',
                  fontFamily: 'RobotoCondensed-Regular',
                  transform: [{ scaleX: 0.7 }],
                  textAlign: 'center'
                }}
              >
                FOUNDATIONS
              </Text>
              <View style={{ flex: 0.15 }} />
              <Text
                key={'level'}
                style={{
                  fontSize: 60 * factorRatio,
                  fontWeight: 'bold',
                  color: 'white',
                  fontFamily: 'RobotoCondensed-Regular',
                  textAlign: 'center'
                }}
              >
                LEVEL {this.state.level}
              </Text>
              <View style={{ flex: 0.3 }} />
              <View
                key={'startIcon'}
                style={{
                  height: onTablet ? fullHeight * 0.065 : fullHeight * 0.05
                }}
              >
                <View
                  key={'mylist'}
                  style={[
                    styles.centerContent,
                    {
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: fullWidth * 0.25,
                      height: onTablet
                        ? fullHeight * 0.065
                        : fullHeight * 0.053,
                      zIndex: 3,
                      elevation: 3
                    }
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.toggleMyList();
                    }}
                    style={{
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    {!this.state.isAddedToList && (
                      <AntIcon
                        name={'plus'}
                        size={27.5 * factorRatio}
                        color={colors.pianoteRed}
                      />
                    )}
                    {this.state.isAddedToList && (
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
                </View>

                {this.state.isCompleted ? (
                  <ResetIcon
                    pxFromTop={0}
                    buttonHeight={
                      onTablet ? fullHeight * 0.065 : fullHeight * 0.05
                    }
                    pxFromLeft={(fullWidth * 0.5) / 2}
                    buttonWidth={fullWidth * 0.5}
                    pressed={() =>
                      this.setState({
                        showRestartCourse: true
                      })
                    }
                  />
                ) : this.state.isStarted ? (
                  <ContinueIcon
                    pxFromTop={0}
                    buttonHeight={
                      onTablet ? fullHeight * 0.065 : fullHeight * 0.05
                    }
                    pxFromLeft={(fullWidth * 0.5) / 2}
                    buttonWidth={fullWidth * 0.5}
                    pressed={() =>
                      this.props.navigation.navigate('VIDEOPLAYER', {
                        url: this.state.nextLesson.post.mobile_app_url
                      })
                    }
                  />
                ) : !this.state.isStarted ? (
                  <StartIcon
                    pxFromTop={0}
                    buttonHeight={
                      onTablet ? fullHeight * 0.065 : fullHeight * 0.05
                    }
                    pxFromLeft={(fullWidth * 0.5) / 2}
                    buttonWidth={fullWidth * 0.5}
                    pressed={() =>
                      this.props.navigation.navigate('VIDEOPLAYER', {
                        url: this.state.nextLesson.post.mobile_app_url
                      })
                    }
                  />
                ) : null}
                <View
                  key={'info'}
                  style={[
                    styles.centerContent,
                    {
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      width: fullWidth * 0.25,
                      height: onTablet
                        ? fullHeight * 0.065
                        : fullHeight * 0.053,
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
              <View style={{ height: 20 * factorVertical }} />
            </View>
          </View>
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
              <View style={{ height: 15 * factorVertical }} />
            </View>
          )}
          <VerticalVideoList
            items={this.state.items}
            isLoading={this.state.isLoadingAll}
            showFilter={false} // shows filters button
            showType={false} // show course / song by artist name
            showArtist={false} // show artist name
            showLength={false} // duration of song
            showSort={false}
            showLines={true}
            imageRadius={5 * factorRatio} // radius of image shown
            containerBorderWidth={0} // border of box
            containerWidth={fullWidth} // width of list
            containerHeight={
              onTablet
                ? fullHeight * 0.15
                : Platform.OS == 'android'
                ? fullHeight * 0.115
                : fullHeight * 0.11
            } // height per row
            imageHeight={
              onTablet
                ? fullHeight * 0.12
                : Platform.OS == 'android'
                ? fullHeight * 0.09
                : fullHeight * 0.0825
            } // image height
            imageWidth={fullWidth * 0.3} // image width
          />
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
            type='unit'
            onRestart={() => this.onRestartFoundation()}
          />
        </Modal>
        {this.state.nextLesson && (
          <NextVideo
            item={this.state.nextLesson}
            progress={this.state.progress}
            type='UNIT'
            onNextLesson={() =>
              this.props.navigation.navigate('VIDEOPLAYER', {
                url: this.state.nextLesson.post.mobile_app_url
              })
            }
          />
        )}

        <NavigationBar currentPage={''} />
      </SafeAreaView>
    );
  }
}
