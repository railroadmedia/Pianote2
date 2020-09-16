/**
 * CreateAccount3
 */
import React from 'react';
import {
  View,
  Text,
  Animated,
  Keyboard,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import X from 'Pianote2/src/assets/img/svgs/X.svg';
import ImagePicker from 'react-native-image-picker';
import DisplayName from '../../modals/DisplayName.js';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Courses from 'Pianote2/src/assets/img/svgs/courses.svg';
import Support from 'Pianote2/src/assets/img/svgs/support.svg';
import Songs from 'Pianote2/src/assets/img/svgs/headphones.svg';
import { NavigationActions, StackActions } from 'react-navigation';
import LearningPaths from 'Pianote2/src/assets/img/svgs/learningPaths.svg';

var showListener =
  Platform.OS == 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
var hideListener =
  Platform.OS == 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
var data = new FormData();

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'LOADPAGE' })]
});

export default class CreateAccount3 extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pianoteYdelta: new Animated.Value(0.01),
      showDisplayName: false,
      showImage: false,
      canScroll: false,
      displayNameValid: false,
      displayName: '',
      imageURI: '',
      plan: this.props.navigation.state.params.plan,
      email: this.props.navigation.state.params.email,
      password: this.props.navigation.state.params.password
    };
  }

  componentDidMount = async () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      showListener,
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      hideListener,
      this._keyboardDidHide
    );
  };

  componentWillUnmount = async () => {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  _keyboardDidShow = async () => {
    if (Platform.OS == 'ios') {
      Animated.timing(this.state.pianoteYdelta, {
        toValue: fullHeight * 0.15,
        duration: 250
      }).start();
    } else {
      Animated.timing(this.state.pianoteYdelta, {
        toValue: fullHeight * 0.225,
        duration: 250
      }).start();
    }
  };

  _keyboardDidHide = async () => {
    Animated.timing(this.state.pianoteYdelta, {
      toValue: 0.01,
      duration: 250
    }).start();
  };

  changeColor = async number => {
    let index = number.nativeEvent.contentOffset.x / fullWidth;
    if (index == 0) {
      await this.setState({ page: 1 });
    } else if (index == 1) {
      await this.setState({ page: 2, canScroll: false });
    } else if (index == 2) {
      await this.setState({ page: 3, canScroll: true });
    } else if (index == 3) {
      await this.setState({ page: 4 });
    }
    await this.forceUpdate();
  };

  typingDisplayName = async displayName => {
    await this.setState({ displayName });
    await this.forceUpdate();
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
          data.append('target', response.fileName || 'avatar');
          data.append('file', {
            name: response.fileName || 'avatar',
            type: response.type,
            uri:
              Platform.OS == 'ios'
                ? response.uri.replace('file://', '')
                : response.uri
          });

          this.setState({
            response,
            imageURI: response.uri,
            showImage: true
          });

          this.forceUpdate();
        }
      }
    );
  };

  clearImage = async () => {
    data = new FormData();
    await this.setState({
      imageURI: '',
      showImage: false,
      response: null
    });
    await this.forceUpdate();
  };

  setName = async () => {
    if (this.state.displayName.length > 0) {
      // check if valid
      let response = await fetch(
        `http://app-staging.pianote.com/usora/is-display-name-unique?display_name=${this.state.displayName}`
      );
      response = await response.json();
      if (response.unique) {
        this.myScroll.scrollTo({
          x: fullWidth,
          y: 0,
          animated: true
        });
        this.setState({
          page: 2,
          displayNameValid: true
        });
        this.forceUpdate();
      } else {
        this.setState({ showDisplayName: true });
      }
    }
  };

  goHome = async () => {
    // if display name already validated or no name enter
    if (this.state.displayNameValid || this.state.displayName == '') {
      await this.createAccount();
    } else {
      // validate name
      await this.setName();
      // create account
      await this.createAccount();
    }
  };

  createAccount = async () => {
    const auth = await getToken();

    // if there is profile image upload it
    if (data !== null) {
      let avatarResponse = await fetch(
        `http://app-staging.pianote.com/api/avatar/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${auth.token}` },
          body: data
        }
      );

      const url = await avatarResponse.json();
    }

    // take image url and update profile
    let profileResponse = await fetch(
      `http://app-staging.pianote.com/api/profile/update`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` },
        data: {
          file: data !== null ? url : '',
          display_name: this.state.displayName
        }
      }
    );

    profileResponse = await profileResponse.json();

    console.log('PROFILE RESPONSE: ', profileResponse);

    // send to loadpage to update asyncstorage with new data
    await this.props.navigation.dispatch(resetAction);
  };

  render() {
    return (
      <View
        style={[
          styles.centerContent,
          {
            height: fullHeight
          }
        ]}
      >
        <ScrollView
          horizontal={true}
          ref={ref => {
            this.myScroll = ref;
          }}
          pagingEnabled={true}
          scrollEnabled={this.state.canScroll}
          onMomentumScrollEnd={e => this.changeColor(e)}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View key={'displayName'}>
            <View
              styles={[
                styles.centerContent,
                {
                  height: fullHeight,
                  width: fullWidth,
                  alignSelf: 'stretch'
                }
              ]}
            >
              <View
                style={{
                  height: isNotch ? fullHeight * 0.05 : fullHeight * 0.03
                }}
              />
              <View
                key={'CreateAccount'}
                style={[
                  styles.centerContent,
                  {
                    height: fullHeight * 0.05,
                    width: fullWidth,
                    zIndex: 10,
                    elevation: 10,
                    flexDirection: 'row'
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={{
                    paddingLeft: 12.5 * factorHorizontal,
                    height: '100%',
                    width: '100%',
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  {false && (
                    <EntypoIcon
                      name={'chevron-thin-left'}
                      size={22.5 * factorRatio}
                      color={'black'}
                    />
                  )}
                </TouchableOpacity>

                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 24 * factorRatio,
                    fontWeight: Platform.OS == 'ios' ? '600' : 'bold'
                  }}
                >
                  Create Account
                </Text>
                <View style={{ flex: 1 }} />
              </View>
              <Animated.View
                key={'items'}
                style={{
                  position: 'relative',
                  bottom: this.state.pianoteYdelta,
                  height: fullHeight * 0.9,
                  width: fullWidth,
                  zIndex: 3
                }}
              >
                <View
                  key={'container'}
                  style={{
                    height: fullHeight,
                    width: fullWidth,
                    alignItems: 'center'
                  }}
                >
                  <View style={{ flex: 0.45 }} />
                  <View
                    key={'displayname'}
                    style={{
                      height: 35 * factorVertical,
                      marginBottom: 2 * factorVertical,
                      flexDirection: 'row',
                      paddingLeft: 20 * factorHorizontal
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans',
                        fontSize: 20 * factorRatio,
                        fontWeight: Platform.OS == 'ios' ? '600' : 'bold',
                        textAlign: 'left'
                      }}
                    >
                      Add a display name
                    </Text>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View
                    key={'input'}
                    style={{
                      height: fullHeight * 0.07,
                      width: fullWidth * 0.9,
                      borderRadius: 50 * factorRatio,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      paddingLeft: 20 * factorHorizontal,
                      flexDirection: 'row',
                      borderWidth: 1 * factorRatio,
                      borderRadius: 50 * factorRatio,
                      borderColor: '#c2c2c2'
                    }}
                  >
                    <TextInput
                      autoCorrect={false}
                      placeholderTextColor={'grey'}
                      returnKeyType={'go'}
                      placeholder={'Display name'}
                      keyboardType={'email-address'}
                      onChangeText={displayName => {
                        this.typingDisplayName(displayName);
                      }}
                      style={{
                        fontFamily: 'OpenSans',
                        fontSize: 18 * factorRatio,
                        flex: 1
                      }}
                    />
                  </View>
                  <View style={{ height: 10 * factorVertical }} />
                  <View
                    key={'appearsOnProfile'}
                    style={{
                      width: fullWidth,
                      paddingLeft: 20 * factorHorizontal
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans',
                        fontSize: 13 * factorRatio,
                        textAlign: 'left'
                      }}
                    >
                      This appears on your Pianote profile and comments.
                    </Text>
                  </View>
                  <View style={{ height: 40 * factorVertical }} />
                  <View
                    key={'next'}
                    style={{
                      height: fullHeight * 0.06,
                      width: fullWidth * 0.4,
                      borderRadius: 50 * factorRatio,
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
                          fontSize: 18 * factorRatio,
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
                  <View style={{ height: 30 * factorVertical }} />
                  <View
                    key={'dots'}
                    style={{
                      height: fullHeight * 0.035,
                      flexDirection: 'row'
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <View style={{ justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View
                          style={{
                            height: 10 * factorRatio,
                            width: 10 * factorRatio,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 1 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        ></View>
                        <View
                          style={{
                            width: 7.5 * factorHorizontal
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factorRatio,
                            width: 10 * factorRatio,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 2 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        ></View>
                        <View
                          style={{
                            width: 7.5 * factorHorizontal
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factorRatio,
                            width: 10 * factorRatio,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 3 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        ></View>
                        <View
                          style={{
                            width: 7.5 * factorHorizontal
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factorRatio,
                            width: 10 * factorRatio,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 4 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        ></View>
                      </View>
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ height: 30 * factorVertical }} />
                  <View
                    key={'skip'}
                    style={{
                      width: fullWidth,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.crea();
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 20 * factorRatio,
                          fontWeight: '700',
                          color: '#fb1b2f'
                        }}
                      >
                        SKIP
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
              <Modal
                key={'checkUserTakenModal'}
                isVisible={this.state.showDisplayName}
                style={[
                  styles.centerContent,
                  {
                    margin: 0,
                    height: fullHeight,
                    width: fullWidth
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
          </View>
          <View key={'profilePic'}>
            <View
              styles={[
                styles.centerContent,
                {
                  height: fullHeight,
                  width: fullWidth,
                  alignSelf: 'stretch'
                }
              ]}
            >
              <View
                style={{
                  height: isNotch ? fullHeight * 0.05 : fullHeight * 0.03
                }}
              />
              <View
                key={'CreateAccount2'}
                style={[
                  styles.centerContent,
                  {
                    height: fullHeight * 0.05,
                    width: fullWidth,

                    zIndex: 5,
                    elevation: 5,
                    flexDirection: 'row'
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    console.log('HELLO'),
                      this.myScroll.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true
                      });
                  }}
                  style={{
                    paddingLeft: 12.5 * factorHorizontal,
                    flex: 1
                  }}
                >
                  <EntypoIcon
                    name={'chevron-thin-left'}
                    size={22.5 * factorRatio}
                    color={'black'}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 24 * factorRatio,
                    fontWeight: Platform.OS == 'ios' ? '600' : 'bold'
                  }}
                >
                  Create Account
                </Text>
                <View style={{ flex: 1 }} />
              </View>
              <View
                key={'items'}
                style={{
                  bottom: 0,
                  height: fullHeight * 0.9,
                  width: fullWidth,
                  zIndex: 3,
                  elevation: 3
                }}
              >
                <View
                  key={'container'}
                  style={{
                    height: fullHeight - navHeight,
                    width: fullWidth,
                    alignItems: 'center'
                  }}
                >
                  <View style={{ flex: 0.2 }} />
                  <View
                    key={'addPicture'}
                    style={{
                      height: 35 * factorVertical,
                      flexDirection: 'row'
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans',
                        fontSize: 17.5 * factorRatio,
                        fontWeight: '700',
                        textAlign: 'center'
                      }}
                    >
                      Add a profile picture
                    </Text>
                  </View>
                  <View style={{ height: 10 * factorVertical }} />
                  <View
                    key={'profilePicture'}
                    style={{
                      height: fullHeight * 0.22,
                      width: fullWidth,
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
                          height: fullHeight * 0.19125,
                          width: fullHeight * 0.19125,
                          borderRadius: 200 * factorRatio,
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
                            borderRadius: 200 * factorRatio,
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
                              borderRadius: 200 * factorRatio,
                              zIndex: 5
                            }
                          ]}
                        >
                          <X fill={'white'} height={'50%'} width={'50%'} />
                        </TouchableOpacity>
                      )}
                      <AntIcon
                        name={'plus'}
                        size={55 * factorRatio}
                        color={'white'}
                      />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ height: 10 * factorVertical }} />
                  <View
                    key={'appearsOnProfile'}
                    style={{
                      width: fullWidth,
                      paddingLeft: 20 * factorHorizontal
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'OpenSans',
                        fontSize: 13 * factorRatio,
                        textAlign: 'center'
                      }}
                    >
                      This appears on your Pianote profile and comments.
                    </Text>
                  </View>
                  <View style={{ height: 40 * factorVertical }} />
                  <View
                    key={'next'}
                    style={{
                      height: fullHeight * 0.06,
                      width: fullWidth * 0.4,
                      borderRadius: 50 * factorRatio,
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
                          x: fullWidth * 2,
                          y: 0,
                          animated: true
                        }),
                          this.setState({
                            page: 3,
                            canScroll: true
                          }),
                          this.forceUpdate();
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
                          fontSize: 18 * factorRatio,
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
                    key={'dots'}
                    style={{
                      height: fullHeight * 0.035,
                      flexDirection: 'row'
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <View style={{ justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View
                          style={{
                            height: 10 * factorRatio,
                            width: 10 * factorRatio,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 1 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        ></View>
                        <View
                          style={{
                            width: 7.5 * factorHorizontal
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factorRatio,
                            width: 10 * factorRatio,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 2 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        ></View>
                        <View
                          style={{
                            width: 7.5 * factorHorizontal
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factorRatio,
                            width: 10 * factorRatio,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 3 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        ></View>
                        <View
                          style={{
                            width: 7.5 * factorHorizontal
                          }}
                        />
                        <View
                          style={{
                            height: 10 * factorRatio,
                            width: 10 * factorRatio,
                            borderRadius: 100,
                            backgroundColor:
                              this.state.page == 4 ? '#fb1b2f' : 'transparent',
                            borderWidth: 1,
                            borderColor: '#fb1b2f'
                          }}
                        ></View>
                      </View>
                    </View>
                    <View style={{ flex: 1 }} />
                  </View>
                  <View style={{ height: 30 * factorVertical }} />
                  <View
                    key={'skip'}
                    style={{
                      width: fullWidth,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.crea();
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'OpenSans',
                          fontSize: 20 * factorRatio,
                          fontWeight: '700',
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
                isVisible={this.state.showDisplayName}
                style={[
                  styles.centerContent,
                  {
                    margin: 0,
                    height: fullHeight,
                    width: fullWidth
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
          </View>
          <View key={'overview'}>
            <View
              key={'pianote1'}
              style={{
                height: fullHeight,
                width: fullWidth,
                zIndex: 2
              }}
            >
              <View style={{ height: isNotch ? '7%' : '5%' }} />
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  textAlign: 'center',
                  fontSize: 24 * factorRatio,
                  fontWeight: Platform.OS == 'ios' ? '600' : 'bold'
                }}
              >
                Here's what is included{'\n'}in the Pianote App!
              </Text>
              <View
                style={{
                  height: '4%',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factorRatio
                }}
              />
              <View
                key={'learningPathLine'}
                style={{
                  height: fullHeight * 0.15,
                  width: fullWidth,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factorRatio
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
                            ? fullWidth * 0.1 * factorRatio
                            : fullWidth * 0.2 * factorRatio,
                          height: onTablet
                            ? fullWidth * 0.1 * factorRatio
                            : fullWidth * 0.2 * factorRatio,
                          borderRadius: 100 * factorRatio,
                          backgroundColor: '#fb1b2f'
                        }
                      ]}
                    >
                      <LearningPaths
                        height={
                          onTablet
                            ? fullWidth * 0.06 * factorRatio
                            : fullWidth * 0.125 * factorRatio
                        }
                        width={
                          onTablet
                            ? fullWidth * 0.06 * factorRatio
                            : fullWidth * 0.125 * factorRatio
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
                      fontFamily: 'OpenSans',
                      fontSize: 22 * factorRatio,
                      fontWeight: Platform.OS == 'ios' ? '600' : 'bold'
                    }}
                  >
                    Learning Path
                  </Text>
                  <View style={{ height: 5 * factorVertical }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio
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
                  height: fullHeight * 0.15,
                  width: fullWidth,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factorRatio
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
                            ? fullWidth * 0.1 * factorRatio
                            : fullWidth * 0.2 * factorRatio,
                          height: onTablet
                            ? fullWidth * 0.1 * factorRatio
                            : fullWidth * 0.2 * factorRatio,
                          borderRadius: 100 * factorRatio,
                          backgroundColor: '#fb1b2f'
                        }
                      ]}
                    >
                      <Courses
                        height={
                          onTablet
                            ? fullWidth * 0.06 * factorRatio
                            : fullWidth * 0.125 * factorRatio
                        }
                        width={
                          onTablet
                            ? fullWidth * 0.06 * factorRatio
                            : fullWidth * 0.125 * factorRatio
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
                      fontFamily: 'OpenSans',
                      fontSize: 22 * factorRatio,
                      fontWeight: Platform.OS == 'ios' ? '600' : 'bold'
                    }}
                  >
                    Courses
                  </Text>
                  <View style={{ height: 5 * factorVertical }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio
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
                  height: fullHeight * 0.15,
                  width: fullWidth,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factorRatio
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
                            ? fullWidth * 0.1 * factorRatio
                            : fullWidth * 0.2 * factorRatio,
                          height: onTablet
                            ? fullWidth * 0.1 * factorRatio
                            : fullWidth * 0.2 * factorRatio,
                          borderRadius: 100 * factorRatio,
                          backgroundColor: '#fb1b2f'
                        }
                      ]}
                    >
                      <Songs
                        height={
                          onTablet
                            ? fullWidth * 0.06 * factorRatio
                            : fullWidth * 0.125 * factorRatio
                        }
                        width={
                          onTablet
                            ? fullWidth * 0.06 * factorRatio
                            : fullWidth * 0.125 * factorRatio
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
                      fontFamily: 'OpenSans',
                      fontSize: 22 * factorRatio,
                      fontWeight: Platform.OS == 'ios' ? '600' : 'bold'
                    }}
                  >
                    Songs
                  </Text>
                  <View style={{ height: 5 * factorVertical }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio
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
                  height: fullHeight * 0.15,
                  width: fullWidth,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factorRatio
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
                            ? fullWidth * 0.1 * factorRatio
                            : fullWidth * 0.2 * factorRatio,
                          height: onTablet
                            ? fullWidth * 0.1 * factorRatio
                            : fullWidth * 0.2 * factorRatio,
                          borderRadius: 100 * factorRatio,
                          backgroundColor: '#fb1b2f'
                        }
                      ]}
                    >
                      <Support
                        height={
                          onTablet
                            ? fullWidth * 0.065 * factorRatio
                            : fullWidth * 0.135 * factorRatio
                        }
                        width={
                          onTablet
                            ? fullWidth * 0.065 * factorRatio
                            : fullWidth * 0.135 * factorRatio
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
                      fontFamily: 'OpenSans',
                      fontSize: 20 * factorRatio,
                      fontWeight: Platform.OS == 'ios' ? '600' : 'bold'
                    }}
                  >
                    Support
                  </Text>
                  <View style={{ height: 5 * factorVertical }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 18 * factorRatio
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
                  height: fullHeight * 0.035,
                  flexDirection: 'row'
                }}
              >
                <View style={{ flex: 1 }} />
                <View style={{ justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        height: 10 * factorRatio,
                        width: 10 * factorRatio,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 1 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    ></View>
                    <View
                      style={{
                        width: 7.5 * factorHorizontal
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factorRatio,
                        width: 10 * factorRatio,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 2 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    ></View>
                    <View
                      style={{
                        width: 7.5 * factorHorizontal
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factorRatio,
                        width: 10 * factorRatio,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 3 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    ></View>
                    <View
                      style={{
                        width: 7.5 * factorHorizontal
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factorRatio,
                        width: 10 * factorRatio,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 4 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    ></View>
                  </View>
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ height: 30 * factorVertical }} />
              <View
                key={'skip'}
                style={{
                  width: fullWidth,
                  alignItems: 'center'
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.crea();
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 20 * factorRatio,
                      fontWeight: '700',
                      color: '#fb1b2f'
                    }}
                  >
                    SKIP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View key={'foundations'} style={styles.centerContent}>
            <View
              key={'pianote1'}
              style={{
                height: fullHeight,
                width: fullWidth,
                zIndex: 2
              }}
            >
              <View style={{ height: isNotch ? '7%' : '5%' }} />
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  textAlign: 'center',
                  fontSize: 25 * factorRatio,
                  fontWeight: '700'
                }}
              >
                You should start with{'\n'}The Pianote Foundations!
              </Text>
              <View
                style={{
                  height: '4%',
                  borderBottomColor: '#dbdbdb',
                  borderBottomWidth: 0.75 * factorRatio
                }}
              />
              <View
                style={[
                  styles.centerContent,
                  {
                    height: fullHeight * 0.575,
                    width: fullWidth,
                    alignSelf: 'stretch'
                  }
                ]}
              >
                <View style={{ height: 20 * factorVertical }} />
                <View style={[styles.centerContent, { flexDirection: 'row' }]}>
                  <View style={{ flex: 1 }} />
                  <FastImage
                    style={{
                      height: fullHeight * 0.14,
                      width: fullWidth * 0.7,
                      borderRadius: 10 * factorRatio,
                      alignSelf: 'stretch'
                    }}
                    source={require('Pianote2/src/assets/img/imgs/foundations-logo.png')}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <View style={{ flex: 1 }} />
                </View>
                <View style={{ height: 10 * factorVertical }} />
                <View style={{ flexDirection: 'row' }}>
                  <FastImage
                    style={{
                      height: onTablet
                        ? fullHeight * 0.275
                        : fullHeight * 0.225,
                      width: fullWidth * 0.85,
                      borderRadius: 10 * factorRatio,
                      alignSelf: 'stretch'
                    }}
                    source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <View style={{ height: 15 * factorVertical }} />
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontWeight: '700',
                    fontSize: 18 * factorRatio,
                    textAlign: 'center'
                  }}
                >
                  Welcome To{'\n'}The Keyboard
                </Text>
                <View style={{ height: 10 * factorVertical }} />
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 14 * factorRatio,
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
                  height: fullHeight * 0.035,
                  flexDirection: 'row'
                }}
              >
                <View style={{ flex: 1 }} />
                <View style={{ justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        height: 10 * factorRatio,
                        width: 10 * factorRatio,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 1 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    ></View>
                    <View
                      style={{
                        width: 7.5 * factorHorizontal
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factorRatio,
                        width: 10 * factorRatio,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 2 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    ></View>
                    <View
                      style={{
                        width: 7.5 * factorHorizontal
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factorRatio,
                        width: 10 * factorRatio,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 3 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    ></View>
                    <View
                      style={{
                        width: 7.5 * factorHorizontal
                      }}
                    />
                    <View
                      style={{
                        height: 10 * factorRatio,
                        width: 10 * factorRatio,
                        borderRadius: 100,
                        backgroundColor:
                          this.state.page == 4 ? '#fb1b2f' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#fb1b2f'
                      }}
                    ></View>
                  </View>
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ height: 20 * factorVertical }} />
              <View
                key={'skip'}
                style={{
                  width: fullWidth,
                  height: '6.25%',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderRadius: 30 * factorRatio
                }}
              >
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  onPress={() => {
                    this.crea();
                  }}
                  style={[
                    styles.centerContent,
                    {
                      width: '85%',
                      height: '100%',
                      borderRadius: 30 * factorRatio,
                      backgroundColor: '#fb1b2f'
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: 'RobotoCondensed-Bold',
                      fontSize: 18 * factorRatio,
                      color: 'white'
                    }}
                  >
                    GET STARTED
                  </Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
