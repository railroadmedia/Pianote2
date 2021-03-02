/**
 * CreateAccount3
 */
import React from 'react';
import {
  View,
  Text,
  Keyboard,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
  StyleSheet
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { NavigationActions, StackActions } from 'react-navigation';

import X from 'Pianote2/src/assets/img/svgs/X.svg';
import Back from '../../assets/img/svgs/back';
import Courses from 'Pianote2/src/assets/img/svgs/courses.svg';
import Support from 'Pianote2/src/assets/img/svgs/support.svg';
import Songs from 'Pianote2/src/assets/img/svgs/headphones.svg';
import LearningPaths from 'Pianote2/src/assets/img/svgs/learningPaths.svg';

import ProfileImage from '../../modals/ProfileImage.js';
import DisplayName from '../../modals/DisplayName.js';
import commonService from '../../services/common.service.js';
import { NetworkContext } from '../../context/NetworkProvider.js';
import Orientation from 'react-native-orientation-locker';
import Loading from '../../components/Loading';

var data = new FormData();

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'LOADPAGE' })]
});

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class CreateAccount3 extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();
    this.state = {
      page: 1,
      showDisplayName: false,
      showProfileImage: false,
      showImage: false,
      canScroll: false,
      displayNameValid: false,
      pageNum: 0,
      displayName: '',
      imageURI: '',
      email: '',//this.props.navigation.state.params.email,
      password: '',//this.props.navigation.state.params.password
    };
  }

  changeColor = number => {
    let index = Math.round(number.nativeEvent.contentOffset.x / width);
    if (index == 0) {
      this.setState({ page: 1 });
    } else if (index == 1) {
      this.setState({ page: 2, canScroll: false });
    } else if (index == 2) {
      this.setState({ page: 3, canScroll: true });
    } else if (index == 3) {
      this.setState({ page: 4 });
    }
  };

  typingDisplayName = async displayName => {
    this.setState({ displayName });
  };

  chooseImage = async () => {
    await ImagePicker.showImagePicker(
      {
        tintColor: '#147efb',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      },
      response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else {
          data.append('file', {
            name: response.fileName || 'avatar',
            type: response.type,
            uri:
              Platform.OS == 'ios'
                ? response.uri.replace('file://', '')
                : 'file://' + response.path
          });
          data.append('target', response.fileName || 'avatar');

          this.setState({
            response,
            imageURI: response.uri,
            showImage: true
          });
        }
      }
    );
  };

  clearImage = () => {
    data = new FormData();
    this.setState({
      imageURI: '',
      showImage: false,
      response: null
    });
  };

  setName = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.displayName.length > 0) {
      Keyboard.dismiss();
      // check if valid
      let response = await fetch(
        `${commonService.rootUrl}/usora/api/is-display-name-unique?display_name=${this.state.displayName}`
      );
      response = await response.json();
      if (response.unique) {
        this.myScroll.scrollTo({
          x: width,
          y: 0,
          animated: true
        });
        this.setState({
          page: 2,
          displayNameValid: true
        });
      } else {
        this.setState({ showDisplayName: true });
      }
    }
  };

  createAccount = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.page === 1) {
      this.myScroll.scrollTo({
        x: width,
        y: 0,
        animated: true
      });
      this.setState({ page: 2, canScroll: false });
    } else if (this.state.page === 2) {
      this.myScroll.scrollTo({
        x: width * 2,
        y: 0,
        animated: true
      });
      this.setState({
        page: 3,
        canScroll: true
      });
    } else if (this.state.page === 3) {
      this.myScroll.scrollTo({
        x: width * 3,
        y: 0,
        animated: true
      });
      this.setState({ page: 4 });
    } else {
      this.loadingRef?.toggleLoading();
      // if there is profile image upload it
      let url;

      try {
        // if has image
        if (data._parts.length > 0) {
          try {
            // upload file
            let response = await fetch(
              `${commonService.rootUrl}/api/avatar/upload`,
              {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: data
              }
            );

            // if image is too large
            if (response.status == 413) {
              this.setState({ showProfileImage: true });
              return;
            }

            // get data back, put image URL & display name in user details
            url = await response.json();
            await commonService.tryCall(
              `${commonService.rootUrl}/api/profile/update`,
              'POST',
              {
                file: url?.data?.[0]?.url,
                display_name: this.state.displayName
              }
            );

            // send to loadpage to update asyncstorage with new data
            await this.props.navigation.dispatch(resetAction);
          } catch (e) {}
        } else {
          await commonService.tryCall(
            `${commonService.rootUrl}/api/profile/update`,
            'POST',
            {
              file: url?.data?.[0]?.url,
              display_name: this.state.displayName
            }
          );

          // send to loadpage to update asyncstorage with new data
          await this.props.navigation.dispatch(resetAction);
        }
        this.loadingRef?.toggleLoading();
      } catch (e) {
        this.loadingRef?.toggleLoading();
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            horizontal={true}
            ref={ref => {
              this.myScroll = ref;
            }}
            keyboardShouldPersistTaps='handled'
            pagingEnabled={true}
            scrollEnabled={this.state.canScroll}
            onMomentumScrollEnd={e => {
              this.setState({ pageNum: e });
              this.changeColor(e);
            }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.centerContent}>
              <View style={[styles.centerContent, localStyles.container1]}>
                <TouchableOpacity
                  onPress={() => this.changeColor(this.state.pageNum - 1)}
                  style={{
                    paddingLeft: 10,
                    height: '100%',
                    width: '100%',
                    flex: 1,
                    justifyContent: 'center'
                  }}
                />
                <Text
                  style={[
                    styles.modalHeaderText,
                    {
                      fontSize: onTablet ? 36 : 24,
                      fontFamily: 'OpenSans-Bold'
                    }
                  ]}
                >
                  Create Account
                </Text>
                <View style={{ flex: 1 }} />
              </View>
              <View
                key={'items'}
                style={{
                  height: '90%',
                  width: width,
                  zIndex: 3
                }}
              >
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'height' : ''}
                  style={{ flex: 1, alignItems: 'center' }}
                >
                  <View style={{ flex: 0.45 }} />
                  <View
                    style={{
                      marginBottom: 2,
                      flexDirection: 'row',
                      paddingLeft: 20
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Bold',
                        fontSize: DeviceInfo.isTablet() ? 24 : 16,
                        textAlign: 'left',
                        paddingVertical: 15,
                      }}
                    >
                      Add a display name
                    </Text>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View
                    style={{
                      height: '7%',
                      width: '95%',
                      borderRadius: 50 * factor,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      paddingLeft: 20 * factor,
                      flexDirection: 'row',
                      borderWidth: 1 * factor,
                      borderRadius: 50 * factor,
                      borderColor: '#c2c2c2'
                    }}
                  >
                    <TextInput
                      autoCorrect={false}
                      placeholderTextColor={'grey'}
                      returnKeyType={'go'}
                      placeholder={'Display name'}
                      keyboardType={'email-address'}
                      onSubmitEditing={() => Keyboard.dismiss()}
                      onChangeText={displayName => {
                        this.typingDisplayName(displayName);
                      }}
                      style={{
                        color: 'black',
                        fontFamily: 'OpenSans-Regular',
                        fontSize: 18 * factor,
                        flex: 1
                      }}
                    />
                  </View>
                  <View style={{ height: 10 * factor }} />
                  <View
                    key={'appearsOnProfile'}
                    style={{
                      width: width,
                      height: 20 * factor,
                      paddingLeft: 20 * factor
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: 13 * factor,
                        textAlign: 'left'
                      }}
                    >
                      This appears on your Pianote profile and comments.
                    </Text>
                  </View>
                  <View style={{ height: 35 * factor }} />
                  <View
                    key={'next'}
                    style={{
                      height: height * 0.06,
                      width: '40%',
                      borderRadius: 50 * factor,
                      borderColor: '#fb1b2f',
                      backgroundColor:
                        this.state.displayName.length == 0
                          ? 'transparent'
                          : '#fb1b2f',
                      borderWidth: 1
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.setName()}
                      style={[
                        styles.centerContent,
                        {
                          height: '100%',
                          width: '100%',
                          flexDirection: 'row'
                        }
                      ]}
                    >
                      <Text
                        style={{
                          fontFamily: 'RobotoCondensed-Bold',
                          fontSize: 18 * factor,
                          color:
                            this.state.displayName.length == 0
                              ? '#fb1b2f'
                              : 'white'
                        }}
                      >
                        NEXT
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: 20 * factor }} />
                  <View
                    key={'dots'}
                    style={{
                      height: '3.5%',
                      flexDirection: 'row'
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <View style={{ justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View
                          style={{
                            height: 10 * factor,
                            width: 10 * factor,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 1 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        />
                        <View
                          style={{
                            width: 10 * factor
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factor,
                            width: 10 * factor,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 2 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        />
                        <View
                          style={{
                            width: 10 * factor
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factor,
                            width: 10 * factor,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 3 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        />
                        <View
                          style={{
                            width: 10 * factor
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factor,
                            width: 10 * factor,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 4 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ height: 30 * factor }} />
                  <View
                    key={'skip'}
                    style={{
                      width: width,
                      alignItems: 'center'
                    }}
                  >
                    {false && (
                      <TouchableOpacity
                        onPress={() => {
                          this.createAccount();
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'OpenSans-Bold',
                            fontSize: 20 * factor,
                            color: '#fb1b2f'
                          }}
                        >
                          SKIP
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </KeyboardAvoidingView>
              </View>
              <Modal
                key={'checkUserTakenModal'}
                isVisible={this.state.showDisplayName}
                style={[
                  styles.centerContent,
                  {
                    margin: 0,
                    height: '100%',
                    width: '100%'
                  }
                ]}
                animation={'slideInUp'}
                animationInTiming={350}
                animationOutTiming={350}
                coverScreen={true}
                hasBackdrop={true}
              >
                <DisplayName
                  hideDisplayName={() => {
                    this.setState({
                      showDisplayName: false
                    });
                  }}
                />
              </Modal>
            </View>
            <View style={styles.centerContent}>
              <View
                style={[
                  styles.centerContent,
                  localStyles.container1,
                  { flexDirection: 'row' }
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.myScroll.scrollTo({
                      x: 0,
                      y: 0,
                      animated: true
                    });
                  }}
                  style={{
                    paddingLeft: 15 * factor,
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <Back
                    width={backButtonSize}
                    height={backButtonSize}
                    fill={'black'}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.modalHeaderText,
                    { fontSize: 24 * factor, fontFamily: 'OpenSans-Bold' }
                  ]}
                >
                  Create Account
                </Text>
                <View style={{ flex: 1, paddingRight: 15 * factor }} />
              </View>

              <View
                key={'items'}
                style={{
                  bottom: 0,
                  height: '90%',
                  width: width,
                  zIndex: 3,
                  elevation: 3
                }}
              >
                <View
                  key={'container'}
                  style={{
                    height: '100%',
                    width: '100%',
                    alignItems: 'center'
                  }}
                >
                  <View style={{ flex: 0.2 }} />
                  <View
                    key={'addPicture'}
                    style={{
                      height: (onTablet ? 27.5 : 35) * factor,
                      flexDirection: 'row'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Bold',
                        fontSize: 17.5 * factor,
                        textAlign: 'center'
                      }}
                    >
                      Add a profile picture
                    </Text>
                  </View>
                  <View style={{ height: 10 * factor }} />
                  <View
                    key={'profilePicture'}
                    style={{
                      height: '22%',
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'center'
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                      onPress={() => this.chooseImage()}
                      style={[
                        styles.centerContent,
                        {
                          height: height * 0.19125,
                          width: height * 0.19125,
                          borderRadius: 200 * factor,
                          backgroundColor: '#fb1b2f'
                        }
                      ]}
                    >
                      {this.state.showImage && (
                        <FastImage
                          style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            borderRadius: 200 * factor,
                            zIndex: 5
                          }}
                          source={{
                            uri: this.state.imageURI
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      )}
                      {this.state.showImage && (
                        <TouchableOpacity
                          onPress={() => this.clearImage()}
                          style={[
                            styles.centerContent,
                            {
                              position: 'absolute',
                              height: '22.5%',
                              width: '22.5%',
                              right: '4%',
                              top: '4%',
                              backgroundColor: '#0090d3',
                              borderRadius: 200 * factor,
                              zIndex: 5
                            }
                          ]}
                        >
                          <X fill={'white'} height={'50%'} width={'50%'} />
                        </TouchableOpacity>
                      )}
                      <AntIcon
                        name={'plus'}
                        size={55 * factor}
                        color={'white'}
                      />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ height: 10 * factor }} />
                  <View
                    key={'appearsOnProfile'}
                    style={{
                      width: width,
                      paddingLeft: 20 * factor
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        fontSize: 13 * factor,
                        textAlign: 'center'
                      }}
                    >
                      This appears on your Pianote profile and comments.
                    </Text>
                  </View>
                  <View style={{ height: 40 * factor }} />
                  <View
                    key={'next'}
                    style={{
                      height: '6%',
                      width: '40%',
                      borderRadius: 50 * factor,
                      borderColor: '#fb1b2f',
                      backgroundColor:
                        this.state.imageURI.length == 0
                          ? 'transparent'
                          : '#fb1b2f',
                      borderWidth: 1
                    }}
                  >
                    <TouchableOpacity
                      underlayColor={'transparent'}
                      onPress={() => {
                        this.myScroll.scrollTo({
                          x: width * 2,
                          y: 0,
                          animated: true
                        });
                        this.setState({
                          page: 3,
                          canScroll: true
                        });
                      }}
                      style={[
                        styles.centerContent,
                        {
                          height: '100%',
                          width: '100%',
                          flexDirection: 'row'
                        }
                      ]}
                    >
                      <Text
                        style={{
                          fontFamily: 'RobotoCondensed-Bold',
                          fontSize: 18 * factor,
                          color:
                            this.state.imageURI.length == 0
                              ? '#fb1b2f'
                              : 'white'
                        }}
                      >
                        NEXT
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.5 }} />
                  <View
                    style={{
                      height: '3.5%',
                      flexDirection: 'row'
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <View style={{ justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View
                          style={{
                            height: 10 * factor,
                            width: 10 * factor,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 1 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        />
                        <View
                          style={{
                            width: 10 * factor
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factor,
                            width: 10 * factor,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 2 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        />
                        <View
                          style={{
                            width: 10 * factor
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factor,
                            width: 10 * factor,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 3 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        />
                        <View
                          style={{
                            width: 10 * factor
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factor,
                            width: 10 * factor,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 4 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ height: 30 * factor }} />
                  <View
                    key={'skip'}
                    style={{
                      width: width,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.createAccount();
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Bold',
                          fontSize: 20 * factor,
                          color: '#fb1b2f'
                        }}
                      >
                        SKIP
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Modal
                isVisible={this.state.showProfileImage}
                style={[
                  styles.centerContent,
                  {
                    margin: 0,
                    flex: 1
                  }
                ]}
                animation={'slideInUp'}
                animationInTiming={350}
                animationOutTiming={350}
                coverScreen={true}
                hasBackdrop={true}
              >
                <ProfileImage
                  hideProfileImage={() => {
                    this.setState({
                      showProfileImage: false
                    });
                  }}
                />
              </Modal>
              <Modal
                isVisible={this.state.showDisplayName}
                style={[
                  styles.centerContent,
                  {
                    margin: 0,
                    height: '100%',
                    width: '100%'
                  }
                ]}
                animation={'slideInUp'}
                animationInTiming={350}
                animationOutTiming={350}
                coverScreen={true}
                hasBackdrop={true}
              >
                <DisplayName
                  hideDisplayName={() => {
                    this.setState({
                      showDisplayName: false
                    });
                  }}
                />
              </Modal>
            </View>
            <View
              key={'pianote1'}
              style={{
                height: height,
                width: width,
                zIndex: 2
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  textAlign: 'center',
                  fontSize: 24 * factor
                }}
              >
                Here's what is included{'\n'}in the Pianote App!
              </Text>
              <View
                style={{
                  height: '4%',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factor
                }}
              />
              <View
                key={'learningPathLine'}
                style={{
                  height: '15%',
                  width: '100%',
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factor
                }}
              >
                <View style={{ flex: 0.35 }}>
                  <View style={{ flex: 1 }} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        flexDirection: 'row'
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }} />
                    <View
                      style={[
                        styles.centerContent,
                        {
                          width: onTablet
                            ? width * 0.1 * factor
                            : width * 0.2 * factor,
                          height: onTablet
                            ? width * 0.1 * factor
                            : width * 0.2 * factor,
                          borderRadius: 100 * factor,
                          backgroundColor: '#fb1b2f'
                        }
                      ]}
                    >
                      <LearningPaths
                        height={
                          onTablet
                            ? width * 0.06 * factor
                            : width * 0.125 * factor
                        }
                        width={
                          onTablet
                            ? width * 0.06 * factor
                            : width * 0.125 * factor
                        }
                        fill={'white'}
                      />
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                <View
                  style={{
                    flex: 0.65
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 22 * factor,
                    }}
                  >
                    Learning Path
                  </Text>
                  <View style={{ height: 5 * factor }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 18 * factor
                    }}
                  >
                    Guided lessons covering{'\n'}every topic along the way.
                  </Text>
                  <View style={{ flex: 1 }} />
                </View>
              </View>
              <View
                key={'coursesLine'}
                style={{
                  height: '15%',
                  width: width,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factor
                }}
              >
                <View style={{ flex: 0.35 }}>
                  <View style={{ flex: 1 }} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        flexDirection: 'row'
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }} />
                    <View
                      style={[
                        styles.centerContent,
                        {
                          width: onTablet
                            ? width * 0.1 * factor
                            : width * 0.2 * factor,
                          height: onTablet
                            ? width * 0.1 * factor
                            : width * 0.2 * factor,
                          borderRadius: 100 * factor,
                          backgroundColor: '#fb1b2f'
                        }
                      ]}
                    >
                      <Courses
                        height={
                          onTablet
                            ? width * 0.06 * factor
                            : width * 0.125 * factor
                        }
                        width={
                          onTablet
                            ? width * 0.06 * factor
                            : width * 0.125 * factor
                        }
                        fill={'white'}
                      />
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                <View
                  style={{
                    flex: 0.65
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 22 * factor,
                    }}
                  >
                    Courses
                  </Text>
                  <View style={{ height: 5 }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 18 * factor
                    }}
                  >
                    Series of short lessons{'\n'}based on a single topic.
                  </Text>
                  <View style={{ flex: 1 }} />
                </View>
              </View>
              <View
                key={'songsLine'}
                style={{
                  height: '15%',
                  width: width,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factor
                }}
              >
                <View style={{ flex: 0.35 }}>
                  <View style={{ flex: 1 }} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        flexDirection: 'row'
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }} />
                    <View
                      style={[
                        styles.centerContent,
                        {
                          width: onTablet
                            ? width * 0.1 * factor
                            : width * 0.2 * factor,
                          height: onTablet
                            ? width * 0.1 * factor
                            : width * 0.2 * factor,
                          borderRadius: 100 * factor,
                          backgroundColor: '#fb1b2f'
                        }
                      ]}
                    >
                      <Songs
                        height={
                          onTablet
                            ? width * 0.06 * factor
                            : width * 0.125 * factor
                        }
                        width={
                          onTablet
                            ? width * 0.06 * factor
                            : width * 0.125 * factor
                        }
                        fill={'white'}
                      />
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                <View
                  style={{
                    flex: 0.65
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 22 * factor,
                    }}
                  >
                    Songs
                  </Text>
                  <View style={{ height: 5 }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 18 * factor
                    }}
                  >
                    Famous songs with note-{'\n'}for-note transcriptions.
                  </Text>
                  <View style={{ flex: 1 }} />
                </View>
              </View>
              <View
                key={'supportLine'}
                style={{
                  height: '15%',
                  width: width,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factor
                }}
              >
                <View style={{ flex: 0.35 }}>
                  <View style={{ flex: 1 }} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        flexDirection: 'row'
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }} />
                    <View
                      style={[
                        styles.centerContent,
                        {
                          width: onTablet
                            ? width * 0.1 * factor
                            : width * 0.2 * factor,
                          height: onTablet
                            ? width * 0.1 * factor
                            : width * 0.2 * factor,
                          borderRadius: 100 * factor,
                          backgroundColor: '#fb1b2f'
                        }
                      ]}
                    >
                      <Support
                        height={
                          onTablet
                            ? width * 0.065 * factor
                            : width * 0.135 * factor
                        }
                        width={
                          onTablet
                            ? width * 0.065 * factor
                            : width * 0.135 * factor
                        }
                        fill={'white'}
                      />
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                <View
                  style={{
                    flex: 0.65
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 20 * factor,
                      fontWeight: Platform.OS == 'ios' ? '600' : 'bold'
                    }}
                  >
                    Support
                  </Text>
                  <View style={{ height: 5 * factor }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 18 * factor
                    }}
                  >
                    Get personal support{'\n'}from real piano teachers.
                  </Text>
                  <View style={{ flex: 1 }} />
                </View>
              </View>
              <View style={{ height: '5%' }} />
              <View
                key={'dots'}
                style={{
                  height: '3.5%',
                  flexDirection: 'row'
                }}
              >
                <View style={{ flex: 1 }} />
                <View style={{ justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        height: 10 * factor,
                        width: 10 * factor,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 1 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    />
                    <View
                      style={{
                        width: 10 * factor
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factor,
                        width: 10 * factor,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 2 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    />
                    <View
                      style={{
                        width: 10 * factor
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factor,
                        width: 10 * factor,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 3 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    />
                    <View
                      style={{
                        width: 10 * factor
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factor,
                        width: 10 * factor,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 4 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ height: 30 * factor }} />
              <View
                key={'skip'}
                style={{
                  width: width,
                  alignItems: 'center'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.createAccount();
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 20 * factor,
                      color: '#fb1b2f'
                    }}
                  >
                    SKIP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              key={'pianote1'}
              style={{
                height: height,
                width: width,
                zIndex: 2
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  textAlign: 'center',
                  fontSize: 25 * factor
                }}
              >
                You should start with{'\n'}The Pianote Method!
              </Text>
              <View
                style={{
                  height: '4%',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75
                }}
              />
              <View
                style={[
                  styles.centerContent,
                  {
                    height: height * 0.575,
                    width: width,
                    alignSelf: 'stretch'
                  }
                ]}
              >
                <View style={{ height: 20 * factor }} />
                <View style={[styles.centerContent, { flexDirection: 'row' }]}>
                  <View style={{ flex: 1 }} />
                  <FastImage
                    style={{
                      height: '13.5%',
                      width: '65%',
                      borderRadius: 10,
                      alignSelf: 'stretch'
                    }}
                    source={require('Pianote2/src/assets/img/imgs/pianote-method-logo.png')}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <View style={{ flex: 1 }} />
                </View>
                <View style={{ height: 10 }} />
                <View style={{ flexDirection: 'row' }}>
                  <FastImage
                    style={{
                      height: (onTablet ? 0.275 : 0.225) * height,
                      width: width * 0.85,
                      borderRadius: 10,
                      alignSelf: 'stretch'
                    }}
                    source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <View style={{ height: 15 * factor }} />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontWeight: '700',
                    fontSize: 18 * factor,
                    textAlign: 'center'
                  }}
                >
                  Welcome To{'\n'}The Keyboard
                </Text>
                <View style={{ height: 10 * factor }} />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 14 * factor,
                    color: 'grey',
                    textAlign: 'center'
                  }}
                >
                  Level 1 / Lesson 1 / Lisa Witt
                </Text>
              </View>
              <View style={{ height: '3%' }} />
              <View
                key={'dots'}
                style={{
                  height: '3.5%',
                  flexDirection: 'row'
                }}
              >
                <View style={{ flex: 1 }} />
                <View style={{ justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        height: 10 * factor,
                        width: 10 * factor,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 1 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    />
                    <View
                      style={{
                        width: 10 * factor
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factor,
                        width: 10 * factor,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 2 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    />
                    <View
                      style={{
                        width: 10 * factor
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factor,
                        width: 10 * factor,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 3 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    />
                    <View
                      style={{
                        width: 10 * factor
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factor,
                        width: 10 * factor,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 4 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ height: 15 * factor }} />
              <View
                key={'skip'}
                style={{
                  width: width,
                  height: '6.25%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderRadius: 30 * factor
                }}
              >
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  onPress={() => {
                    this.createAccount();
                  }}
                  style={[
                    styles.centerContent,
                    {
                      width: '85%',
                      height: '100%',
                      borderRadius: 30 * factor,
                      backgroundColor: '#fb1b2f'
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: 'RobotoCondensed-Bold',
                      fontSize: 18 * factor,
                      color: 'white'
                    }}
                  >
                    GET STARTED
                  </Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </ScrollView>
        </View>
        <Loading
          ref={ref => {
            this.loadingRef = ref;
          }}
        />
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15 * factor,
    margin: 20 * factor,
    height: 200,
    width: '80%'
  }
});
