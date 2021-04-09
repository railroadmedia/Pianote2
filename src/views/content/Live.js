/**
 * Live
 */
import React from 'react';
import {
  View,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';
import Video from 'RNVideoEnhanced';
import Modal from 'react-native-modal';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import NavigationBar from '../../components/NavigationBar.js';
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { getLiveScheduleContent } from '../../services/GetContent';
import {
  getMediaSessionId,
  updateUsersVideoProgress
} from '../../services/UserActions';

import ArrowLeft from 'Pianote2/src/assets/img/svgs/arrowLeft';

import { NetworkContext } from '../../context/NetworkProvider';
import { goBack, navigate } from '../../../AppNavigator';
import { getLiveContent } from 'Pianote2/src/services/GetContent';

export default class Live extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      isLoadingAll: true,
      showMakeComment: false,
      showVideo: true,
      isLive: false
    };
  }

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.onBack);

    let content = [await getLiveContent()];
    if (content[0]?.isLive) {
      this.setState({ isLive: true });
    } else {
      let response = await getLiveScheduleContent();
      console.log('rep', response);
    }
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  onBack = () => goBack();

  render() {
    return (
      <>
        {this.state.isLive ? (
          <View style={localStyles.container}>
            <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
            <>
              {this.state.showVideo && (
                // LIVE PLAYER HERE
                <>
                  {this.state.isLoadingAll ? (
                    <View style={{ backgroundColor: 'black' }}>
                      <View
                        style={{
                          aspectRatio: 16 / 9,
                          justifyContent: 'center'
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => this.onBack()}
                          style={{
                            top: 0,
                            left: 0,
                            padding: 15,
                            position: 'absolute',
                            justifyContent: 'center'
                          }}
                        >
                          <ArrowLeft
                            width={onTablet ? 25 : 18}
                            height={onTablet ? 25 : 18}
                            fill={'white'}
                          />
                        </TouchableOpacity>
                        <ActivityIndicator size='large' color='#ffffff' />
                      </View>
                    </View>
                  ) : (
                    <Video
                      youtubeId={youtubeId}
                      toSupport={() => {}}
                      onRefresh={() => {}}
                      content={this.state}
                      maxFontMultiplier={1}
                      settingsMode={'bottom'}
                      onFullscreen={() => {}}
                      ref={r => (this.video = r)}
                      type={false ? 'audio' : 'video'}
                      connection={this.context.isConnected}
                      onBack={this.onBack}
                      showControls={true}
                      paused={true}
                      goToNextLesson={() => {
                        if (this.state.nextLesson)
                          this.switchLesson(
                            this.state.nextLesson.id,
                            this.state.nextLesson.post.mobile_app_url
                          );
                      }}
                      goToPreviousLesson={() => {
                        if (this.state.previousLesson)
                          this.switchLesson(
                            this.state.previousLesson.id,
                            this.state.previousLesson.post.mobile_app_url
                          );
                      }}
                      onUpdateVideoProgress={async (
                        videoId,
                        id,
                        lengthInSec,
                        currentTime,
                        mediaCategory
                      ) => {
                        if (!this.context.isConnected) return;
                        updateUsersVideoProgress(
                          (
                            await getMediaSessionId(
                              videoId,
                              id,
                              lengthInSec,
                              mediaCategory
                            )
                          )?.session_id.id,
                          currentTime,
                          lengthInSec
                        );
                      }}
                      styles={{
                        timerCursorBackground: colors.pianoteRed,
                        beforeTimerCursorBackground: colors.pianoteRed,
                        settings: {
                          cancel: {
                            color: 'black'
                          },
                          separatorColor: 'rgb(230, 230, 230)',
                          background: 'white',
                          optionsBorderColor: 'rgb(230, 230, 230)',
                          downloadIcon: {
                            width: 20,
                            height: 20,
                            fill: colors.pianoteRed
                          }
                        }
                      }}
                    />
                  )}
                </>
              )}

              {!this.state.isLoadingAll ? (
                // LIVE CHAT HERE
                <View style={styles.mainBackground}></View>
              ) : (
                <ActivityIndicator
                  size='small'
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  color={colors.secondBackground}
                />
              )}

              {this.state.showMakeComment && (
                <Modal
                  isVisible={this.state.showMakeComment}
                  style={styles.modalContainer}
                  backdropColor={'transparent'}
                  animation={'slideInUp'}
                  animationInTiming={350}
                  animationOutTiming={350}
                  coverScreen={false}
                  hasBackdrop={true}
                  transparent={true}
                  onBackdropPress={() =>
                    this.setState({ showMakeComment: false })
                  }
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => this.setState({ showMakeComment: false })}
                  >
                    <KeyboardAvoidingView
                      behavior={`${isiOS ? 'padding' : ''}`}
                      style={{ flex: 1, justifyContent: 'flex-end' }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.mainBackground,
                          flexDirection: 'row',
                          padding: 10,
                          alignItems: 'center',
                          borderTopWidth: 0.5,
                          borderTopColor: colors.secondBackground
                        }}
                      >
                        <FastImage
                          style={{
                            height: onTablet ? 60 : 40,
                            width: onTablet ? 60 : 40,
                            paddingVertical: 10,
                            borderRadius: 100,
                            marginRight: 10
                          }}
                          source={{
                            uri:
                              this.state.profileImage ||
                              'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                        />
                        <TextInput
                          autoFocus={true}
                          multiline={true}
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: sizing.descriptionText,
                            flex: 1,
                            backgroundColor: colors.mainBackground,
                            color: colors.secondBackground,
                            paddingVertical: 10
                          }}
                          onSubmitEditing={() => {
                            this.makeComment();
                          }}
                          returnKeyType={'go'}
                          onChangeText={comment => this.setState({ comment })}
                          placeholder={'Add a comment'}
                          placeholderTextColor={colors.secondBackground}
                        />
                        <TouchableOpacity
                          style={{
                            marginBottom: Platform.OS == 'android' ? 10 : 0,
                            marginLeft: 20
                          }}
                          onPress={() => this.makeComment()}
                        >
                          <IonIcon
                            name={'md-send'}
                            size={onTablet ? 25 : 17.5}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      </View>
                    </KeyboardAvoidingView>
                  </TouchableOpacity>
                </Modal>
              )}
            </>
          </View>
        ) : (
          <View style={styles.mainContainer}>
            <NavMenuHeaders currentPage={'LESSONS'} parentPage={'LIVE'} />
            <StatusBar
              backgroundColor={colors.thirdBackground}
              barStyle={'light-content'}
            />
            <Text style={styles.contentPageHeader}>Live Schedule</Text>
            <View style={{ flex: 1 }}></View>
            <NavigationBar currentPage={'SCHEDULE'} />
          </View>
        )}
      </>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#00101d'
  }
});
