import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import Icon from '../../assets/icons.js';
import Back from '../../assets/img/svgs/back.svg';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-navigation';
import DisplayName from '../../modals/DisplayName.js';
import ProfileImage from '../../modals/ProfileImage.js';
import NavigationBar from '../../components/NavigationBar.js';
import commonService from '../../services/common.service.js';
import { NetworkContext } from '../../context/NetworkProvider.js';
import Loading from '../../components/Loading.js';
import { goBack, reset } from '../../../AppNavigator.js';
import { isNameUnique, avatarUpload } from '../../services/UserDataAuth.js';

const isTablet = global.onTablet;

export default class ProfileSettings extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showDisplayName: false,
      showProfileImage: false,
      isLoading: false,
      currentlyView: 'Profile Settings',
      displayName: '',
      email: '',
      imageURI: '',
      imageType: '',
      imageName: '',
      imagePath: ''
    };
  }

  componentDidMount = async () => {
    let imageURI = await AsyncStorage.getItem('profileURI');
    this.setState({
      imageURI: imageURI || '',
      currentlyView:
        this.props.route?.params?.data == 'Profile Photo'
          ? 'Profile Photo'
          : 'Profile Settings'
    });
  };

  async save() {
    this.setState({ isLoading: true });
    this.loadingRef?.toggleLoading(true);
    if (this.state.currentlyView == 'Display Name') {
      await this.changeName();
    } else if (this.state.currentlyView == 'Profile Photo') {
      await this.changeImage();
    }
    this.loadingRef?.toggleLoading(false);
    this.setState({ isLoading: false });
  }

  changeName = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    // check if display name available
    let response = await isNameUnique(this.state.displayName);

    if (response.unique) {
      let nameResponse = await commonService.tryCall(
        `${commonService.rootUrl}/musora-api/profile/update`,
        'POST',
        {
          display_name: this.state.displayName
        }
      );
      await AsyncStorage.setItem('displayName', this.state.displayName);
      reset('PROFILE');
    } else {
      this.setState({ showDisplayName: true });
    }
  };

  changeImage = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    const data = new FormData();
    data.append('file', {
      name: this.state.imageName,
      type: this.state.imageType,
      uri: this.state.imageURI
    });
    data.append('target', this.state.imageName);
    if (this.state.imageURI !== '') {
      let response = await avatarUpload(data);
      if (response.status == 413) {
        this.setState({ showProfileImage: true });
        return;
      }
      let url = await response.json();
      if (url.data[0].url) {
        await commonService.tryCall(
          `${commonService.rootUrl}/musora-api/profile/update`,
          'POST',
          { file: url == '' ? url : url.data[0].url }
        );
        await AsyncStorage.setItem(
          'profileURI',
          url == '' ? url : url.data[0].url
        );
        reset('PROFILE');
      }
    }
  };

  chooseImage = async () => {
    await ImagePicker.showImagePicker(
      {
        tintColor: '#147efb',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        },
        maxWidth: 1000
      },
      response => {
        if (!response.didCancel && !response.error) {
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
      <>
        <SafeAreaView style={styles.mainContainer}>
          <StatusBar
            backgroundColor={colors.mainBackground}
            barStyle={'light-content'}
          />
          <View style={[localStyles.myProfileSettings]}>
            <View style={{ flex: 1 }} />
            <Text
              style={[
                styles.childHeaderText,
                { color: colors.secondBackground }
              ]}
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
                <Text style={localStyles.save}>SAVE</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>

          {this.state.currentlyView == 'Profile Settings' && (
            <ScrollView style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.centerContent, localStyles.displayContainer]}
                onPress={() =>
                  this.setState({
                    currentlyView: 'Display Name'
                  })
                }
              >
                <Text style={localStyles.settingsText}>Display Name</Text>
                <Icon.AntDesign
                  name={'right'}
                  size={onTablet ? 30 : 20}
                  color={colors.secondBackground}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.centerContent, localStyles.profilePhoto]}
                onPress={() => {
                  this.setState({
                    currentlyView: 'Profile Photo'
                  });
                }}
              >
                <Text style={localStyles.settingsText}>Profile Photo</Text>
                <Icon.AntDesign
                  name={'right'}
                  size={onTablet ? 30 : 20}
                  color={colors.secondBackground}
                />
              </TouchableOpacity>
            </ScrollView>
          )}
          {this.state.currentlyView == 'Display Name' && (
            <ScrollView style={styles.mainContainer}>
              <TextInput
                autoCapitalize={'none'}
                ref={txt => {
                  this.txt = txt;
                }}
                placeholder={'Display Name'}
                value={this.state.displayName}
                placeholderTextColor={colors.secondBackground}
                onChangeText={displayName => this.setState({ displayName })}
                onSubmitEditing={() => {}}
                returnKeyType={'go'}
                style={[
                  styles.centerContent,
                  localStyles.displayContainer,
                  localStyles.textInput
                ]}
              />
              <Text style={localStyles.text}>
                This is the name that will appear on your comments and forum
                posts.
              </Text>
            </ScrollView>
          )}
          {this.state.currentlyView == 'Profile Photo' && (
            <ScrollView style={{ flex: 1 }}>
              <View style={[localStyles.scrollContainer, styles.centerContent]}>
                {this.state.imageURI !== '' && (
                  <View style={{ flex: 1 }}>
                    <FastImage
                      style={localStyles.image}
                      source={{ uri: this.state.imageURI }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <TouchableOpacity
                      style={{
                        ...localStyles.crossContainer,
                        right: -(onTablet ? 22.5 : 15)
                      }}
                      onPress={() =>
                        this.setState({
                          imageURI: '',
                          imageType: '',
                          imageName: ''
                        })
                      }
                    >
                      <Icon.Entypo
                        name={'cross'}
                        size={onTablet ? 30 : 22.5}
                        color={colors.secondBackground}
                        style={{
                          width: onTablet ? 30 : 22.5,
                          height: onTablet ? 30 : 22.5
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {this.state.imageURI == '' && (
                  <TouchableOpacity
                    onPress={() => this.chooseImage()}
                    style={styles.centerContent}
                  >
                    <Icon.AntDesign
                      name={'plus'}
                      size={onTablet ? 80 : 65}
                      color={'white'}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={localStyles.imageText}>
                This is the image that will appear with your comments and forum
                posts.
              </Text>

              <TouchableOpacity
                onPress={() => this.chooseImage()}
                style={[styles.centerContent, localStyles.imageContainer]}
              >
                <Icon.Ionicons
                  size={onTablet ? 50 : 35}
                  name={'ios-camera'}
                  color={colors.secondBackground}
                  style={{ padding: 10 }}
                />
              </TouchableOpacity>
            </ScrollView>
          )}

          {this.state.currentlyView == 'Profile Settings' && (
            <NavigationBar currentPage={'PROFILE'} pad={true} />
          )}
          <DisplayName
            onBackButtonPress={() =>
              this.setState({
                showDisplayName: false
              })
            }
            isVisible={this.state.showDisplayName}
            hideDisplayName={() => {
              this.setState({
                showDisplayName: false
              });
            }}
          />
          <ProfileImage
            isVisible={this.state.showProfileImage}
            onBackButtonPress={() => this.setState({ showProfileImage: false })}
            hideProfileImage={() => {
              this.setState({
                showProfileImage: false
              });
            }}
          />
        </SafeAreaView>
        <Loading ref={ref => (this.loadingRef = ref)} />
        <SafeAreaView style={{ position: 'absolute', zIndex: 3 }}>
          <TouchableOpacity
            onPress={() => {
              this.state.isLoading
                ? null
                : this.state.currentlyView == 'Profile Settings'
                ? goBack()
                : this.setState({ currentlyView: 'Profile Settings' });
            }}
            style={{ padding: 10 }}
          >
            <Back
              width={backButtonSize}
              height={backButtonSize}
              fill={colors.secondBackground}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }
}

const localStyles = StyleSheet.create({
  settingsText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 20 : 16,
    color: '#445f73'
  },
  myProfileSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  save: {
    fontSize: isTablet ? 20 : 14,
    fontFamily: 'OpenSans-Bold',
    color: '#fb1b2f',
    textAlign: 'right',
    alignSelf: 'flex-end'
  },
  displayContainer: {
    height: isTablet ? 70 : 50,
    width: '100%',
    borderBottomColor: '#445f73',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: '#445f73',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
  profilePhoto: {
    height: isTablet ? 70 : 50,
    width: '100%',
    borderBottomColor: '#445f73',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between'
  },
  textInput: {
    fontFamily: 'OpenSans-Regular',
    paddingHorizontal: 10,
    width: '100%',
    fontSize: isTablet ? 20 : 16,
    color: '#445f73'
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 18 : 14,
    paddingVertical: '2%',
    paddingHorizontal: 10,
    color: '#445f73'
  },
  scrollContainer: {
    alignSelf: 'center',
    marginTop: 10
  },
  image: {
    width: isTablet ? 200 : 150,
    aspectRatio: 1,
    borderRadius: 200,
    marginTop: 25
  },
  crossContainer: {
    position: 'absolute',
    padding: 5,
    borderColor: '#445f73',
    borderWidth: 2,
    borderRadius: 100
  },
  imageText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 18 : 14,
    paddingVertical: 30,
    paddingHorizontal: 20,
    color: '#445f73',
    textAlign: 'center'
  },
  imageContainer: {
    alignSelf: 'center',
    height: isTablet ? 90 : 70,
    width: isTablet ? 90 : 70,
    borderRadius: 500,
    borderColor: '#445f73',
    borderWidth: 2
  }
});
