/**
 * ProfileSettings
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import {
  NavigationActions,
  SafeAreaView,
  StackActions
} from 'react-navigation';
import DisplayName from '../../modals/DisplayName.js';
import ProfileImage from '../../modals/ProfileImage.js';
import NavigationBar from '../../components/NavigationBar.js';
import commonService from '../../services/common.service.js';
import { NetworkContext } from '../../context/NetworkProvider.js';

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'PROFILE' })]
});

export default class ProfileSettings extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showDisplayName: false,
      showProfileImage: false,
      currentlyView: 'Profile Settings',
      displayName: '',
      currentPassword: '',
      newPassword: '',
      retypeNewPassword: '',
      email: '',
      imageURI: '',
      imageType: '',
      imageName: '',
      passwordKey: '',
      imagePath: ''
    };
  }

  componentDidMount = async () => {
    let imageURI = await AsyncStorage.getItem('profileURI');
    this.setState({
      imageURI: imageURI || '',
      currentlyView:
        this.props.navigation.state.params?.data == 'Profile Photo'
          ? 'Profile Photo'
          : 'Profile Settings'
    });
  };

  save() {
    if (this.state.currentlyView == 'Display Name') {
      this.changeName();
    } else if (this.state.currentlyView == 'Profile Photo') {
      this.changeImage();
    } else if (this.state.currentlyView == 'Password') {
      this.changePassword();
    }
  }

  changePassword = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    const email = await AsyncStorage.getItem('email');

    const { response, error } = await userForgotPassword({ email });

    this.setState({ showChangePassword: true });
  };

  changeName = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    // check if display name available
    let response = await fetch(
      `${commonService.rootUrl}/usora/is-display-name-unique?display_name=${this.state.displayName}`
    );
    response = await response.json();

    if (response.unique) {
      let nameResponse = await commonService.tryCall(
        `${commonService.rootUrl}/api/profile/update`,
        'POST',
        {
          display_name: this.state.displayName
        }
      );

      console.log(nameResponse);

      await AsyncStorage.setItem('displayName', this.state.displayName);

      this.props.navigation.dispatch(resetAction);
    } else {
      this.setState({ showDisplayName: true });
    }
  };

  changeImage = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    const data = new FormData();

    data.append('file', {
      name: this.state.imageName,
      type: this.state.imageType,
      uri: this.state.imageURI
    });
    data.append('target', this.state.imageName);

    console.log(data);

    try {
      if (this.state.imageURI !== '') {
        let response = await fetch(
          `${commonService.rootUrl}/api/avatar/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: data
          }
        );
        console.log('URL: ', response);
        if (response.status == 413) {
          this.setState({ showProfileImage: true });
          return;
        }
        let url = await response.json();

        if (url.data[0].url) {
          await commonService.tryCall(
            `${commonService.rootUrl}/api/profile/update`,
            'POST',
            { file: url == '' ? url : url.data[0].url }
          );
          await AsyncStorage.setItem(
            'profileURI',
            url == '' ? url : url.data[0].url
          );
          this.props.navigation.dispatch(resetAction);
        }
      }
    } catch (error) {
      console.log('ERROR UPLOADING IMAGE: ', error);
    }
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
          this.setState({
            imageURI: response.uri,
            imageType: response.type,
            imageName: response.fileName || 'avatar',
            imagePath: response.path
          });
        }
      }
    );
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.mainBackground
        }}
      >
        <View
          key={'myProfileSettings'}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.state.currentlyView == 'Profile Settings'
                ? this.props.navigation.goBack()
                : this.setState({
                    currentlyView: 'Profile Settings'
                  });
            }}
            style={{ flex: 1 }}
          >
            <EntypoIcon
              name={'chevron-thin-left'}
              size={22.5 * factorRatio}
              color={colors.secondBackground}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 22 * factorRatio,
              fontFamily: 'OpenSans-Bold',
              color: colors.secondBackground,
              textAlign: 'center',
              alignSelf: 'center'
            }}
          >
            {this.state.currentlyView}
          </Text>
          {this.state.currentlyView !== 'Profile Settings' ? (
            <TouchableOpacity
              onPress={() => {
                this.save();
              }}
              style={{ flex: 1 }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  color: 'red',
                  textAlign: 'right',
                  alignSelf: 'flex-end'
                }}
              >
                SAVE
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>

        {this.state.currentlyView == 'Profile Settings' && (
          <ScrollView style={{ flex: 1 }}>
            <TouchableOpacity
              key={'profileProfileSettings'}
              onPress={() =>
                this.setState({
                  currentlyView: 'Display Name'
                })
              }
              style={[
                styles.centerContent,
                {
                  height: 50 * factorRatio,
                  width: '100%',
                  borderBottomColor: colors.secondBackground,
                  borderBottomWidth: 1 * factorRatio,
                  borderTopWidth: 1 * factorRatio,
                  borderTopColor: colors.secondBackground,
                  flexDirection: 'row',
                  paddingRight: 15
                }
              ]}
            >
              <View
                style={{
                  width: 20 * factorHorizontal
                }}
              />
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 18 * factorRatio,
                  color: colors.secondBackground
                }}
              >
                Display Name
              </Text>
              <View style={{ flex: 1 }} />
              <AntIcon
                name={'right'}
                size={22.5 * factorRatio}
                color={colors.secondBackground}
              />
            </TouchableOpacity>
            <TouchableOpacity
              key={'notificationProfileSettings'}
              onPress={() => {
                this.setState({
                  currentlyView: 'Profile Photo'
                });
              }}
              style={[
                styles.centerContent,
                {
                  height: 50 * factorRatio,
                  width: '100%',
                  borderBottomColor: colors.secondBackground,
                  borderBottomWidth: 1 * factorRatio,
                  flexDirection: 'row',
                  paddingRight: 15
                }
              ]}
            >
              <View
                style={{
                  width: 20 * factorHorizontal
                }}
              />
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 18 * factorRatio,
                  color: colors.secondBackground
                }}
              >
                Profile Photo
              </Text>
              <View style={{ flex: 1 }} />
              <AntIcon
                name={'right'}
                size={22.5 * factorRatio}
                color={colors.secondBackground}
              />
            </TouchableOpacity>
          </ScrollView>
        )}
        {this.state.currentlyView == 'Display Name' && (
          <ScrollView style={{ flex: 1 }}>
            <TextInput
              ref={txt => {
                this.txt = txt;
              }}
              placeholder={'Display Name'}
              value={this.state.displayName}
              placeholderTextColor={colors.secondBackground}
              onChangeText={displayName => this.setState({ displayName })}
              onSubmitEditing={() => {}}
              returnKeyType={'go'}
              style={{
                fontFamily: 'OpenSans-Regular',
                paddingLeft: 15,
                width: '100%',
                justifyContent: 'center',
                fontSize: 18 * factorRatio,
                borderBottomColor: colors.secondBackground,
                borderBottomWidth: 1 * factorRatio,
                color: colors.secondBackground
              }}
            />
            <View style={{ height: 10 * factorRatio }} />
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 16 * factorRatio,
                paddingLeft: 15,
                paddingRight: 15,
                color: colors.secondBackground
              }}
            >
              This is the name that will appear on your comments and forum
              posts.
            </Text>
          </ScrollView>
        )}
        {this.state.currentlyView == 'Profile Photo' && (
          <ScrollView style={{ flex: 1 }}>
            <View
              key={'imageCircle'}
              style={{
                alignSelf: 'center',
                marginTop: 10,
                width: 25 * factorRatio + 200 * factorRatio
              }}
            >
              {this.state.imageURI !== '' && (
                <>
                  <FastImage
                    style={{
                      width: 200 * factorRatio,
                      aspectRatio: 1,
                      borderRadius: 200
                    }}
                    source={{
                      uri: this.state.imageURI
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        imageURI: '',
                        imageType: '',
                        imageName: ''
                      })
                    }
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'flex-end',
                      position: 'absolute',
                      minHeight: 40,
                      minWidth: 40,
                      top: 0,
                      borderRadius: 100,
                      borderColor: colors.secondBackground,
                      borderWidth: 2
                    }}
                  >
                    <EntypoIcon
                      name={'cross'}
                      size={25 * factorRatio}
                      color={colors.secondBackground}
                    />
                  </TouchableOpacity>
                </>
              )}

              {this.state.imageURI == '' && (
                <TouchableOpacity
                  onPress={() => this.chooseImage()}
                  style={{ alignSelf: 'center' }}
                >
                  <AntIcon
                    name={'plus'}
                    size={65 * factorRatio}
                    color={'white'}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 15 * factorRatio,
                padding: 15,
                color: colors.secondBackground,
                textAlign: 'center'
              }}
            >
              This is the image that will appear with your comments and forum
              posts.
            </Text>

            <TouchableOpacity
              onPress={() => this.chooseImage()}
              style={{
                alignSelf: 'center',
                borderRadius: 200 * factorRatio,
                borderColor: colors.secondBackground,
                borderWidth: 2 * factorRatio
              }}
            >
              <IonIcon
                size={50 * factorRatio}
                name={'ios-camera'}
                color={colors.secondBackground}
                style={{ padding: 10 * factorRatio }}
              />
            </TouchableOpacity>
          </ScrollView>
        )}
        {this.state.currentlyView == 'Password' && (
          <View style={{ width: '100%' }}>
            <TextInput
              ref={txt => {
                this.password = txt;
              }}
              placeholder={'Current Password'}
              value={this.state.password}
              placeholderTextColor={colors.secondBackground}
              onChangeText={password => this.setState({ password })}
              onSubmitEditing={() => {}}
              returnKeyType={'go'}
              style={{
                fontFamily: 'OpenSans-Regular',
                paddingLeft: 15,
                width: '100%',
                justifyContent: 'center',
                fontSize: 18 * factorRatio,
                borderBottomColor: colors.secondBackground,
                borderBottomWidth: 1 * factorRatio,
                color: colors.secondBackground
              }}
            />
            <TextInput
              ref={txt => {
                this.newPassword = txt;
              }}
              placeholder={'New Password'}
              value={this.state.newPassword}
              placeholderTextColor={colors.secondBackground}
              onChangeText={newPassword => this.setState({ newPassword })}
              onSubmitEditing={() => {}}
              returnKeyType={'go'}
              style={{
                fontFamily: 'OpenSans-Regular',
                paddingLeft: 15,
                width: '100%',
                justifyContent: 'center',
                fontSize: 18 * factorRatio,
                color: colors.secondBackground,
                borderBottomColor: colors.secondBackground,
                borderBottomWidth: 1 * factorRatio
              }}
            />
            <TextInput
              ref={txt => {
                this.retypeNewPassword = txt;
              }}
              placeholder={'Re-Type New Password'}
              value={this.state.retypeNewPassword}
              placeholderTextColor={colors.secondBackground}
              onChangeText={retypeNewPassword => {
                this.setState({ retypeNewPassword });
              }}
              onSubmitEditing={() => {}}
              returnKeyType={'go'}
              style={{
                fontFamily: 'OpenSans-Regular',
                paddingLeft: 15,
                width: '100%',
                color: colors.secondBackground,
                justifyContent: 'center',
                fontSize: 18 * factorRatio,
                borderBottomColor: colors.secondBackground,
                borderBottomWidth: 1 * factorRatio
              }}
            />
          </View>
        )}

        {this.state.currentlyView == 'Profile Settings' && (
          <NavigationBar currentPage={'PROFILE'} />
        )}

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
        <Modal
          isVisible={this.state.showProfileImage}
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
          <ProfileImage
            hideProfileImage={() => {
              this.setState({
                showProfileImage: false
              });
            }}
          />
        </Modal>
      </SafeAreaView>
    );
  }
}
