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
import { SafeAreaView } from 'react-navigation';
import NavigationBar from '../../components/NavigationBar.js';
import CustomModal from '../../modals/CustomModal';
import commonService from '../../services/common.service.js';
import { NetworkContext } from '../../context/NetworkProvider.js';
import Loading from '../../components/Loading.js';
import { goBack, reset } from '../../../AppNavigator.js';
import {
  isNameUnique,
  updateName,
  avatarUpload
} from '../../services/UserDataAuth.js';
import { connect } from 'react-redux';
import { setLoggedInUser } from '../../redux/UserActions.js';

const onTablet = global.onTablet;

class ProfileSettings extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
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

  componentDidMount() {
    this.setState({
      imageURI: this.props.user.profile_picture_url,
      currentlyView:
        this.props.route?.params?.data === 'Profile Photo'
          ? 'Profile Photo'
          : 'Profile Settings'
    });
  }

  async save() {
    this.setState({ isLoading: true });
    this.loadingRef?.toggleLoading(true);
    if (this.state.currentlyView === 'Display Name') {
      await this.changeName();
    } else if (this.state.currentlyView === 'Profile Photo') {
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
      await updateName(this.state.displayName);
      this.props.setLoggedInUser({
        ...this.props.user,
        display_name: this.state.displayName
      });
      reset('PROFILE');
    } else {
      this.alertDisplay?.toggle(
        'This display name is already in use.',
        'Please try again.'
      );
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
      if (response.status === 413) {
        this.alert?.toggle('Profile image is too large.', 'Please try again.');
        return;
      }
      let url = await response.json();
      if (url.data[0].url) {
        await commonService.tryCall({
          url: `${commonService.rootUrl}/musora-api/profile/update`,
          method: 'POST',
          body: { file: url === '' ? url : url.data[0].url }
        });
        this.props.setLoggedInUser({
          ...this.props.user,
          profile_picture_url: url.data[0].url
        });

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
        <SafeAreaView style={localStyles.mainContainer}>
          <StatusBar
            backgroundColor={colors.mainBackground}
            barStyle={'light-content'}
          />
          <View style={[localStyles.myProfileSettings]}>
            <View style={{ flex: 1 }} />
            <Text
              style={[
                localStyles.childHeaderText,
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

          {this.state.currentlyView === 'Profile Settings' && (
            <ScrollView style={{ flex: 1 }}>
              <TouchableOpacity
                style={[
                  localStyles.centerContent,
                  localStyles.displayContainer
                ]}
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
                style={[localStyles.centerContent, localStyles.profilePhoto]}
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
          {this.state.currentlyView === 'Display Name' && (
            <ScrollView style={localStyles.mainContainer}>
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
                  localStyles.centerContent,
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
          {this.state.currentlyView === 'Profile Photo' && (
            <ScrollView style={{ flex: 1 }}>
              <View
                style={[localStyles.scrollContainer, localStyles.centerContent]}
              >
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

                {this.state.imageURI === '' && (
                  <TouchableOpacity
                    onPress={() => this.chooseImage()}
                    style={localStyles.centerContent}
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
                style={[localStyles.centerContent, localStyles.imageContainer]}
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

          {this.state.currentlyView === 'Profile Settings' && (
            <NavigationBar currentPage={'PROFILE'} pad={true} />
          )}
          <CustomModal
            ref={r => (this.alertDisplay = r)}
            additionalBtn={
              <TouchableOpacity
                onPress={() => {
                  this.alert?.toggle();
                }}
                style={{
                  marginTop: 20,
                  borderRadius: 50,
                  backgroundColor: colors.pianoteRed
                }}
              >
                <Text
                  style={[
                    localStyles.modalButtonText,
                    {
                      padding: 10,
                      fontSize: 15,
                      color: '#ffffff'
                    }
                  ]}
                >
                  TRY AGAIN
                </Text>
              </TouchableOpacity>
            }
            onClose={() => {}}
          />
        </SafeAreaView>
        <Loading ref={ref => (this.loadingRef = ref)} />
        <CustomModal
          ref={r => (this.alert = r)}
          additionalBtn={
            <TouchableOpacity
              onPress={() => {
                this.alert?.toggle();
              }}
              style={{
                marginTop: 20,
                borderRadius: 50,
                backgroundColor: colors.pianoteRed
              }}
            >
              <Text
                style={[
                  localStyles.modalButtonText,
                  {
                    padding: 10,
                    fontSize: 15,
                    color: '#ffffff'
                  }
                ]}
              >
                TRY AGAIN
              </Text>
            </TouchableOpacity>
          }
          onClose={() => {}}
        />
        <SafeAreaView style={{ position: 'absolute', zIndex: 3 }}>
          <TouchableOpacity
            onPress={() => {
              this.state.isLoading
                ? null
                : this.state.currentlyView === 'Profile Settings'
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

const mapStateToProps = state => ({ user: state.userState.user });

const mapDispatchToProps = dispatch => ({
  setLoggedInUser: user => dispatch(setLoggedInUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);

const localStyles = StyleSheet.create({
  settingsText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 20 : 16,
    color: '#445f73'
  },
  myProfileSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  save: {
    fontSize: onTablet ? 20 : 14,
    fontFamily: 'OpenSans-Bold',
    color: '#fb1b2f',
    textAlign: 'right',
    alignSelf: 'flex-end'
  },
  displayContainer: {
    height: onTablet ? 70 : 50,
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
    height: onTablet ? 70 : 50,
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
    fontSize: onTablet ? 20 : 16,
    color: '#445f73'
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 18 : 14,
    paddingVertical: '2%',
    paddingHorizontal: 10,
    color: '#445f73'
  },
  scrollContainer: {
    alignSelf: 'center',
    marginTop: 10
  },
  image: {
    width: onTablet ? 200 : 150,
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
    fontSize: onTablet ? 18 : 14,
    paddingVertical: 30,
    paddingHorizontal: 20,
    color: '#445f73',
    textAlign: 'center'
  },
  imageContainer: {
    alignSelf: 'center',
    height: onTablet ? 90 : 70,
    width: onTablet ? 90 : 70,
    borderRadius: 500,
    borderColor: '#445f73',
    borderWidth: 2
  },
  mainContainer: {
    backgroundColor: '#00101d',
    flex: 1
  },
  gContainer: {
    flex: 1,
    alignSelf: 'stretch'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 24 : 18
  },
  modalCancelButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 12
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  childHeaderText: {
    // used on search, see all, downloads,
    fontSize: onTablet ? 28 : 20,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold',
    alignSelf: 'center',
    textAlign: 'center'
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  }
});
