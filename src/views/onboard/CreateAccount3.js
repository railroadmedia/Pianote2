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
  StyleSheet,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-navigation';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import AntIcon from 'react-native-vector-icons/AntDesign';
import X from 'Pianote2/src/assets/img/svgs/X.svg';
import Back from '../../assets/img/svgs/back';
import Courses from 'Pianote2/src/assets/img/svgs/courses.svg';
import Support from 'Pianote2/src/assets/img/svgs/support.svg';
import Songs from 'Pianote2/src/assets/img/svgs/headphones.svg';
import LearningPaths from 'Pianote2/src/assets/img/svgs/learningPaths.svg';
import ProfileImage from '../../modals/ProfileImage.js';
import DisplayName from '../../modals/DisplayName.js';
import commonService from '../../services/common.service.js';
import {NetworkContext} from '../../context/NetworkProvider.js';
import Orientation from 'react-native-orientation-locker';
import Loading from '../../components/Loading';
import {reset} from '../../../AppNavigator';

var data = new FormData();

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;

export default class CreateAccount3 extends React.Component {
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
      pageNum: 0,
      displayName: '',
      imageURI: '',
      email: props.route?.params?.email,
      password: props.route?.params?.password,
    };
  }

  changePage = number => {
    let index = Math.round(number.nativeEvent.contentOffset.x / width);
    if (index == 0) {
      this.setState({page: 1});
    } else if (index == 1) {
      this.setState({page: 2, canScroll: false});
    } else if (index == 2) {
      this.setState({page: 3, canScroll: true});
    } else if (index == 3) {
      this.setState({page: 4});
    }
  };

  typingDisplayName = async displayName => {
    this.setState({displayName});
  };

  chooseImage = async () => {
    await ImagePicker.showImagePicker(
      {
        tintColor: '#147efb',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      response => {
        if (!response.didCancel && !response.error) {
          data.append('file', {
            name: response.fileName || 'avatar',
            type: response.type,
            uri: isiOS
              ? response.uri.replace('file://', '')
              : 'file://' + response.path,
          });
          data.append('target', response.fileName || 'avatar');
          this.setState({
            response,
            imageURI: response.uri,
            showImage: true,
          });
        }
      },
    );
  };

  clearImage = () => {
    data = new FormData();
    this.setState({
      imageURI: '',
      showImage: false,
      response: null,
    });
  };

  setName = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    if (this.state.displayName.length > 0) {
      Keyboard.dismiss();
      let response = await fetch(
        `${commonService.rootUrl}/usora/api/is-display-name-unique?display_name=${this.state.displayName}`,
      );
      response = await response.json();
      if (response.unique) {
        this.myScroll.scrollTo({
          x: width,
          y: 0,
          animated: true,
        });
        this.setState({
          page: 2,
        });
      } else {
        this.setState({showDisplayName: true});
      }
    }
  };

  createAccount = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    if (this.state.page === 1) {
      this.myScroll.scrollTo({
        x: width,
        y: 0,
        animated: true,
      });
      this.setState({page: 2, canScroll: false});
    } else if (this.state.page === 2) {
      this.myScroll.scrollTo({
        x: width * 2,
        y: 0,
        animated: true,
      });
      this.setState({
        page: 3,
        canScroll: true,
      });
    } else if (this.state.page === 3) {
      this.myScroll.scrollTo({
        x: width * 3,
        y: 0,
        animated: true,
      });
      this.setState({page: 4});
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
                headers: {Authorization: `Bearer ${token}`},
                body: data,
              },
            );

            // if image is too large
            if (response.status == 413) {
              this.setState({showProfileImage: true});
              return;
            }

            // get data back, put image URL & display name in user details
            url = await response.json();
            await commonService.tryCall(
              `${commonService.rootUrl}/api/profile/update`,
              'POST',
              {
                file: url?.data?.[0]?.url,
                display_name: this.state.displayName,
              },
            );

            // send to loadpage to update asyncstorage with new data
            reset('LOADPAGE');
          } catch (e) {}
        } else {
          await commonService.tryCall(
            `${commonService.rootUrl}/api/profile/update`,
            'POST',
            {
              file: url?.data?.[0]?.url,
              display_name: this.state.displayName,
            },
          );

          // send to loadpage to update asyncstorage with new data
          reset('LOADPAGE');
        }
        this.loadingRef?.toggleLoading();
      } catch (e) {
        this.loadingRef?.toggleLoading();
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          horizontal={true}
          ref={ref => {
            this.myScroll = ref;
          }}
          keyboardShouldPersistTaps="handled"
          pagingEnabled={true}
          scrollEnabled={this.state.canScroll}
          onMomentumScrollEnd={e => {
            this.setState({pageNum: e});
            this.changePage(e);
          }}
          contentContainerStyle={{flexGrow: 1}}
        >
          <View style={styles.centerContent}>
            <View style={[styles.centerContent, localStyles.container1]}>
              <TouchableOpacity
                onPress={() => this.changePage(this.state.pageNum - 1)}
                style={{
                  paddingLeft: 10,
                  flex: 1,
                }}
              />
              <Text
                style={[
                  styles.modalHeaderText,
                  {
                    fontSize: onTablet ? 36 : 24,
                    fontFamily: 'OpenSans-Bold',
                  },
                ]}
              >
                Create Account
              </Text>
            </View>
            <View
              style={{
                height: '90%',
                width: width,
                zIndex: 3,
              }}
            >
              <KeyboardAvoidingView
                behavior={isiOS ? 'height' : ''}
                style={{flex: 1, alignItems: 'center'}}
              >
                <View
                  style={{
                    marginBottom: 2,
                    flexDirection: 'row',
                    paddingLeft: 20,
                    marginTop: '45%',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: DeviceInfo.isTablet() ? 24 : 16,
                      textAlign: 'left',
                      paddingVertical: 10,
                    }}
                  >
                    Add a display name
                  </Text>
                  <View style={{flex: 1}} />
                </View>
                <View
                  style={{
                    height: '7%',
                    width: '95%',
                    borderRadius: 100,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    paddingLeft: onTablet ? 20 : 10,
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: '#c2c2c2',
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
                      fontSize: sizing.titleViewLesson,
                      flex: 1,
                    }}
                  />
                </View>
                <View
                  style={{
                    width: width,
                    paddingLeft: 20,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: sizing.descriptionText,
                      textAlign: 'left',
                    }}
                  >
                    This appears on your Pianote profile and comments.
                  </Text>
                </View>
                <View
                  style={{
                    height: '6%',
                    width: '40%',
                    marginTop: 50,
                    borderRadius: 100,
                    borderColor: '#fb1b2f',
                    backgroundColor:
                      this.state.displayName.length == 0
                        ? 'transparent'
                        : '#fb1b2f',
                    borderWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.setName()}
                    style={[
                      styles.centerContent,
                      {
                        height: '100%',
                        width: '100%',
                        flexDirection: 'row',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontFamily: 'RobotoCondensed-Bold',
                        fontSize: sizing.titleViewLesson,
                        color:
                          this.state.displayName.length == 0
                            ? '#fb1b2f'
                            : 'white',
                      }}
                    >
                      NEXT
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: '3.5%',
                    marginTop: 20,
                    marginBottom: 30,
                    flexDirection: 'row',
                  }}
                >
                  <View style={{justifyContent: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 100,
                          backgroundColor:
                            this.state.page == 1 ? '#fb1b2f' : 'transparent',
                          borderWidth: 1,
                          borderColor: '#fb1b2f',
                        }}
                      />
                      <View
                        style={{
                          width: 10,
                        }}
                      />
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 100,
                          backgroundColor:
                            this.state.page == 2 ? '#fb1b2f' : 'transparent',
                          borderWidth: 1,
                          borderColor: '#fb1b2f',
                        }}
                      />
                      <View
                        style={{
                          width: 10,
                        }}
                      />
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 100,
                          backgroundColor:
                            this.state.page == 3 ? '#fb1b2f' : 'transparent',
                          borderWidth: 1,
                          borderColor: '#fb1b2f',
                        }}
                      />
                      <View
                        style={{
                          width: 10,
                        }}
                      />
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 100,
                          backgroundColor:
                            this.state.page == 4 ? '#fb1b2f' : 'transparent',
                          borderWidth: 1,
                          borderColor: '#fb1b2f',
                        }}
                      />
                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
            <Modal
              isVisible={this.state.showDisplayName}
              style={[styles.centerContent, styles.modalContainer]}
              animation={'slideInUp'}
              animationInTiming={350}
              animationOutTiming={350}
              coverScreen={true}
              hasBackdrop={true}
            >
              <DisplayName
                hideDisplayName={() => {
                  this.setState({
                    showDisplayName: false,
                  });
                }}
              />
            </Modal>
          </View>
          <View style={styles.centerContent}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  this.myScroll.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                }}
                style={{
                  paddingLeft: 15,
                  flex: 1,
                  justifyContent: 'center',
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
                  {
                    fontSize: onTablet ? 36 : 24,
                    fontFamily: 'OpenSans-Bold',
                  },
                ]}
              >
                Create Account
              </Text>
              <View style={{flex: 1, paddingRight: 15}} />
            </View>
            <View
              style={{
                bottom: 0,
                height: '90%',
                width: width,
                zIndex: 3,
                elevation: 3,
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    marginTop: '20%',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: sizing.titleViewLesson,
                      textAlign: 'center',
                    }}
                  >
                    Add a profile picture
                  </Text>
                </View>
                <View
                  style={{
                    height: '22%',
                    width: '100%',
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.chooseImage()}
                    style={[
                      styles.centerContent,
                      {
                        height: height * 0.17125,
                        width: height * 0.17125,
                        borderRadius: 500,
                        backgroundColor: '#fb1b2f',
                      },
                    ]}
                  >
                    {this.state.showImage && (
                      <FastImage
                        style={{
                          position: 'absolute',
                          height: '100%',
                          width: '100%',
                          borderRadius: 500,
                          zIndex: 5,
                        }}
                        source={{
                          uri: this.state.imageURI,
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
                            borderRadius: 500,
                            zIndex: 5,
                          },
                        ]}
                      >
                        <X fill={'white'} height={'50%'} width={'50%'} />
                      </TouchableOpacity>
                    )}
                    <AntIcon
                      name={'plus'}
                      size={onTablet ? 70 : 50}
                      color={'white'}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: width,
                    paddingTop: 20,
                    paddingBottom: 40,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: sizing.descriptionText,
                      textAlign: 'center',
                    }}
                  >
                    This appears on your Pianote profile and comments.
                  </Text>
                </View>
                <View
                  style={{
                    height: '6%',
                    width: '40%',
                    borderRadius: 50,
                    borderColor: '#fb1b2f',
                    backgroundColor:
                      this.state.imageURI.length == 0
                        ? 'transparent'
                        : '#fb1b2f',
                    borderWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    underlayColor={'transparent'}
                    onPress={() => {
                      this.myScroll.scrollTo({
                        x: width * 2,
                        y: 0,
                        animated: true,
                      });
                      this.setState({
                        page: 3,
                        canScroll: true,
                      });
                    }}
                    style={[
                      styles.centerContent,
                      {
                        height: '100%',
                        width: '100%',
                        flexDirection: 'row',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontFamily: 'RobotoCondensed-Bold',
                        fontSize: sizing.titleViewLesson,
                        color:
                          this.state.imageURI.length == 0 ? '#fb1b2f' : 'white',
                      }}
                    >
                      NEXT
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    height: '3.5%',
                    marginTop: '50%',
                    flexDirection: 'row',
                    marginBottom: 30,
                  }}
                >
                  <View style={{justifyContent: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 100,
                          backgroundColor:
                            this.state.page == 1 ? '#fb1b2f' : 'transparent',
                          borderWidth: 1,
                          borderColor: '#fb1b2f',
                        }}
                      />
                      <View
                        style={{
                          width: 10,
                        }}
                      />
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 100,
                          backgroundColor:
                            this.state.page == 2 ? '#fb1b2f' : 'transparent',
                          borderWidth: 1,
                          borderColor: '#fb1b2f',
                        }}
                      />
                      <View
                        style={{
                          width: 10,
                        }}
                      />
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 100,
                          backgroundColor:
                            this.state.page == 3 ? '#fb1b2f' : 'transparent',
                          borderWidth: 1,
                          borderColor: '#fb1b2f',
                        }}
                      />
                      <View
                        style={{
                          width: 10,
                        }}
                      />
                      <View
                        style={{
                          height: 10,
                          width: 10,
                          borderRadius: 100,
                          backgroundColor:
                            this.state.page == 4 ? '#fb1b2f' : 'transparent',
                          borderWidth: 1,
                          borderColor: '#fb1b2f',
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: width,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity onPress={() => this.createAccount()}>
                    <Text
                      style={{
                        fontFamily: 'OpenSans-Bold',
                        fontSize: sizing.titleViewLesson,
                        color: '#fb1b2f',
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
              style={[styles.centerContent, styles.modalContainer]}
              animation={'slideInUp'}
              animationInTiming={350}
              animationOutTiming={350}
              coverScreen={true}
              hasBackdrop={true}
            >
              <ProfileImage
                hideProfileImage={() => {
                  this.setState({
                    showProfileImage: false,
                  });
                }}
              />
            </Modal>
            <Modal
              isVisible={this.state.showDisplayName}
              style={[styles.centerContent, styles.modalContainer]}
              animation={'slideInUp'}
              animationInTiming={350}
              animationOutTiming={350}
              coverScreen={true}
              hasBackdrop={true}
            >
              <DisplayName
                hideDisplayName={() => {
                  this.setState({
                    showDisplayName: false,
                  });
                }}
              />
            </Modal>
          </View>
          <View
            style={{
              height: height,
              width: width,
              zIndex: 2,
            }}
          >
            <Text
              style={{
                fontFamily: 'OpenSans-Bold',
                textAlign: 'center',
                fontSize: sizing.myListButtonSize,
              }}
            >
              Here's what is included{'\n'}in the Pianote App!
            </Text>
            <View
              style={{
                height: '4%',
                borderBottomColor: '#dbdbdb',
                borderBottomWidth: 0.75,
              }}
            />
            <View
              style={{
                height: '15%',
                width: '100%',
                alignSelf: 'stretch',
                flexDirection: 'row',
                borderBottomColor: '#dbdbdb',
                borderBottomWidth: 0.75,
              }}
            >
              <View style={{flex: 0.3}}>
                <View style={{flex: 1}} />
                <View
                  style={[
                    styles.centerContent,
                    {
                      flexDirection: 'row',
                    },
                  ]}
                >
                  <View style={{flex: 1}} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: width * 0.15,
                        height: width * 0.15,
                        padding: 30,
                        borderRadius: 200,
                        backgroundColor: '#fb1b2f',
                      },
                    ]}
                  >
                    <LearningPaths
                      height={width * 0.1}
                      width={200}
                      fill={'white'}
                    />
                  </View>
                  <View style={{flex: 1}} />
                </View>
                <View style={{flex: 1}} />
              </View>
              <View
                style={{
                  flex: 0.7,
                }}
              >
                <View style={{flex: 1}} />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: sizing.myListButtonSize,
                  }}
                >
                  Learning Path
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: onTablet ? 20 : 16,
                    marginTop: 5,
                  }}
                >
                  Guided lessons covering{'\n'}every topic along the way.
                </Text>
                <View style={{flex: 1}} />
              </View>
            </View>
            <View
              style={{
                height: '15%',
                width: width,
                alignSelf: 'stretch',
                flexDirection: 'row',
                borderBottomColor: '#dbdbdb',
                borderBottomWidth: 0.75,
              }}
            >
              <View style={{flex: 0.3}}>
                <View style={{flex: 1}} />
                <View
                  style={[
                    styles.centerContent,
                    {
                      flexDirection: 'row',
                    },
                  ]}
                >
                  <View style={{flex: 1}} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: width * 0.15,
                        height: width * 0.15,
                        borderRadius: 200,
                        backgroundColor: '#fb1b2f',
                      },
                    ]}
                  >
                    <Courses height={width * 0.07} width={200} fill={'white'} />
                  </View>
                  <View style={{flex: 1}} />
                </View>
                <View style={{flex: 1}} />
              </View>
              <View
                style={{
                  flex: 0.7,
                }}
              >
                <View style={{flex: 1}} />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: sizing.myListButtonSize,
                  }}
                >
                  Courses
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: onTablet ? 20 : 16,
                    marginTop: 5,
                  }}
                >
                  Series of short lessons{'\n'}based on a single topic.
                </Text>
                <View style={{flex: 1}} />
              </View>
            </View>
            <View
              style={{
                height: '15%',
                width: width,
                alignSelf: 'stretch',
                flexDirection: 'row',
                borderBottomColor: '#dbdbdb',
                borderBottomWidth: 0.75,
              }}
            >
              <View style={{flex: 0.3}}>
                <View style={{flex: 1}} />
                <View
                  style={[
                    styles.centerContent,
                    {
                      flexDirection: 'row',
                    },
                  ]}
                >
                  <View style={{flex: 1}} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: width * 0.15,
                        height: width * 0.15,
                        borderRadius: 200,
                        backgroundColor: '#fb1b2f',
                      },
                    ]}
                  >
                    <Songs height={width * 0.085} width={200} fill={'white'} />
                  </View>
                  <View style={{flex: 1}} />
                </View>
                <View style={{flex: 1}} />
              </View>
              <View
                style={{
                  flex: 0.7,
                }}
              >
                <View style={{flex: 1}} />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: sizing.myListButtonSize,
                  }}
                >
                  Songs
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    marginTop: 5,
                    fontSize: onTablet ? 20 : 16,
                  }}
                >
                  Famous songs with note-{'\n'}for-note transcriptions.
                </Text>
                <View style={{flex: 1}} />
              </View>
            </View>
            <View
              style={{
                height: '15%',
                width: width,
                alignSelf: 'stretch',
                flexDirection: 'row',
                borderBottomColor: '#dbdbdb',
                borderBottomWidth: 0.75,
              }}
            >
              <View style={{flex: 0.3}}>
                <View style={{flex: 1}} />
                <View
                  style={[
                    styles.centerContent,
                    {
                      flexDirection: 'row',
                    },
                  ]}
                >
                  <View style={{flex: 1}} />
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: width * 0.15,
                        height: width * 0.15,
                        borderRadius: 200,
                        backgroundColor: '#fb1b2f',
                      },
                    ]}
                  >
                    <Support height={width * 0.1} width={200} fill={'white'} />
                  </View>
                  <View style={{flex: 1}} />
                </View>
                <View style={{flex: 1}} />
              </View>
              <View
                style={{
                  flex: 0.7,
                }}
              >
                <View style={{flex: 1}} />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: sizing.myListButtonSize,
                  }}
                >
                  Support
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: onTablet ? 20 : 16,
                    marginTop: 5,
                  }}
                >
                  Get personal support{'\n'}from real piano teachers.
                </Text>
                <View style={{flex: 1}} />
              </View>
            </View>
            <View
              style={{
                height: '3.5%',
                marginTop: '5%',
                flexDirection: 'row',
              }}
            >
              <View style={{flex: 1}} />
              <View style={{justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 100,
                      backgroundColor:
                        this.state.page == 1 ? '#fb1b2f' : 'transparent',
                      borderWidth: 1,
                      borderColor: '#fb1b2f',
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                    }}
                  />
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 100,
                      backgroundColor:
                        this.state.page == 2 ? '#fb1b2f' : 'transparent',
                      borderWidth: 1,
                      borderColor: '#fb1b2f',
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                    }}
                  />
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 100,
                      backgroundColor:
                        this.state.page == 3 ? '#fb1b2f' : 'transparent',
                      borderWidth: 1,
                      borderColor: '#fb1b2f',
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                    }}
                  />
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 100,
                      backgroundColor:
                        this.state.page == 4 ? '#fb1b2f' : 'transparent',
                      borderWidth: 1,
                      borderColor: '#fb1b2f',
                    }}
                  />
                </View>
              </View>
              <View style={{flex: 1}} />
            </View>
            <View
              style={{
                width: width,
                alignItems: 'center',
                marginTop: 30,
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
                    fontSize: sizing.titleViewLesson,
                    color: '#fb1b2f',
                  }}
                >
                  SKIP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              height: height,
              width: width,
              zIndex: 2,
            }}
          >
            <Text
              style={{
                fontFamily: 'OpenSans-Bold',
                textAlign: 'center',
                fontSize: sizing.titleViewLesson,
                justifyContent: 'center',
              }}
            >
              You should start with{'\n'}The Pianote Method!
            </Text>
            <View
              style={{
                height: '4%',
                borderBottomColor: '#dbdbdb',
                borderBottomWidth: 0.75,
              }}
            />
            <View
              style={[
                styles.centerContent,
                {
                  height: '57%',
                  width: width,
                  alignSelf: 'stretch',
                },
              ]}
            >
              <View style={[styles.centerContent, {flexDirection: 'row'}]}>
                <View style={{flex: 1}} />
                <FastImage
                  style={{
                    height: '17%',
                    width: '65%',
                    borderRadius: 10,
                    alignSelf: 'stretch',
                  }}
                  source={require('Pianote2/src/assets/img/imgs/pianote-method-logo.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={{flex: 1}} />
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <FastImage
                  style={{
                    height: (onTablet ? 0.275 : 0.225) * height,
                    width: width * 0.85,
                    borderRadius: 10,
                    alignSelf: 'stretch',
                  }}
                  source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  paddingVertical: 15,
                  fontSize: sizing.titleViewLesson,
                  textAlign: 'center',
                }}
              >
                Welcome To{'\n'}The Keyboard
              </Text>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: sizing.descriptionText,
                  color: 'grey',
                  textAlign: 'center',
                }}
              >
                Level 1 / Lesson 1 / Lisa Witt
              </Text>
            </View>
            <View
              style={{
                height: '3.5%',
                marginTop: '3%',
                flexDirection: 'row',
              }}
            >
              <View style={{flex: 1}} />
              <View style={{justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 100,
                      backgroundColor:
                        this.state.page == 1 ? '#fb1b2f' : 'transparent',
                      borderWidth: 1,
                      borderColor: '#fb1b2f',
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                    }}
                  />
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 100,
                      backgroundColor:
                        this.state.page == 2 ? '#fb1b2f' : 'transparent',
                      borderWidth: 1,
                      borderColor: '#fb1b2f',
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                    }}
                  />
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 100,
                      backgroundColor:
                        this.state.page == 3 ? '#fb1b2f' : 'transparent',
                      borderWidth: 1,
                      borderColor: '#fb1b2f',
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                    }}
                  />
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 100,
                      backgroundColor:
                        this.state.page == 4 ? '#fb1b2f' : 'transparent',
                      borderWidth: 1,
                      borderColor: '#fb1b2f',
                    }}
                  />
                </View>
              </View>
              <View style={{flex: 1}} />
            </View>
            <View
              style={{
                width: width,
                height: '6.25%',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 15,
                borderRadius: 30,
              }}
            >
              <View style={{flex: 1}} />
              <TouchableOpacity
                onPress={() => {
                  this.createAccount();
                }}
                style={[
                  styles.centerContent,
                  {
                    width: '85%',
                    height: '100%',
                    borderRadius: 30,
                    backgroundColor: '#fb1b2f',
                  },
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: onTablet ? 16 : 12,
                    color: 'white',
                  }}
                >
                  GET STARTED
                </Text>
              </TouchableOpacity>
              <View style={{flex: 1}} />
            </View>
          </View>
        </ScrollView>
        <Loading ref={ref => (this.loadingRef = ref)} />
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20,
    height: 200,
    width: '80%',
  },
});
