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
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import DisplayName from '../../modals/DisplayName.js';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {getToken} from 'Pianote2/src/services/UserDataAuth.js';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: 'PROFILE'})],
});

export default class ProfileSettings extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showDisplayName: false,
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
        };
    }

    componentDidMount = async () => {
        let imageURI = await AsyncStorage.getItem('profileURI');
        await this.setState({
            imageURI: imageURI == null ? '' : imageURI,
            currentlyView:
                this.props.navigation.state.params.data == 'Profile Photo'
                    ? 'Profile Photo'
                    : 'Profile Settings',
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
        const email = await AsyncStorage.getItem('email');

        const {response, error} = await userForgotPassword({email});

        console.log('RESET PASSWORD LINK: ', response, error);
        await this.setState({showChangePassword: true});
    };

    changePassword2 = async () => {
        return;
        return commonService.tryCall(
            `${commonService.rootUrl}/api/change-password`,
            'PUT',
            null,
            null,
            {
                pass1: this.state.newPassword,
                user_login: email,
                rp_key: this.state.passwordKey,
            },
        );
    };

    changeName = async () => {
        // check if display name available
        let response = await fetch(
            `${commonService.rootUrl}/usora/is-display-name-unique?display_name=${this.state.displayName}`,
        );
        response = await response.json();

        if (response.unique) {
            const auth = await getToken();
            let nameResponse = await fetch(
                `${commonService.rootUrl}/api/profile/update`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        display_name: this.state.displayName,
                    }),
                },
            );

            nameResponse = await nameResponse.json();

            console.log(nameResponse);

            await AsyncStorage.setItem('displayName', this.state.displayName);

            this.props.navigation.dispatch(resetAction);
        } else {
            this.setState({showDisplayName: true});
        }
    };

    changeImage = async () => {
        const data = new FormData();
        const auth = await getToken();

        data.append('target', this.state.imageName);
        data.append('file', {
            name: this.state.imageName,
            type: this.state.imageType,
            uri:
                Platform.OS == 'ios'
                    ? this.state.imageURI.replace('file://', '')
                    : this.state.imageURI,
        });

        try {
            if (this.state.imageURI !== '') {
                let avatarResponse = await fetch(
                    `${commonService.rootUrl}/api/avatar/upload`,
                    {
                        method: 'POST',
                        headers: {Authorization: `Bearer ${auth.token}`},
                        body: data,
                    },
                );

                let url = await avatarResponse.json();
                console.log(url.data[0].url);
            }

            let profileResponse = await fetch(
                `${commonService.rootUrl}/api/profile/update`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        file: url == '' ? url : url.data[0].url,
                    }),
                },
            );

            console.log(await profileResponse.json());

            await AsyncStorage.setItem(
                'profileURI',
                url == '' ? url : url.data[0].url,
            );

            this.props.navigation.dispatch(resetAction);
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
                    path: 'images',
                },
            },
            response => {
                console.log(response);
                if (response.didCancel) {
                } else if (response.error) {
                } else {
                    this.setState({
                        imageURI: response.uri,
                        imageType: response.type,
                        imageName: response.fileName || 'avatar',
                    });
                    this.forceUpdate();
                }
            },
        );
    };

    render() {
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    flex: 1,
                    backgroundColor: colors.mainBackground,
                }}
                keyboardShouldPersistTaps='handled'
            >
                <View key={'contentContainer'} style={{flex: 1}}>
                    <View
                        key={'buffer'}
                        style={{
                            height: isNotch ? 15 * factorVertical : 0,
                        }}
                    ></View>
                    <View
                        key={'myProfileSettings'}
                        style={[
                            styles.centerContent,
                            {height: 40 * factorRatio},
                        ]}
                    >
                        {this.state.currentlyView !== 'Profile Settings' && (
                            <View
                                key={'save'}
                                style={[
                                    styles.centerContent,
                                    {
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0 * factorRatio,
                                        height: 50 * factorRatio,
                                        width: 50 * factorRatio,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.save();
                                    }}
                                    style={[
                                        styles.centerContent,
                                        {
                                            height: '100%',
                                            width: '100%',
                                        },
                                    ]}
                                >
                                    <View
                                        style={{height: 5 * factorVertical}}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 12 * factorRatio,
                                            fontWeight:
                                                Platform.OS == 'android'
                                                    ? 'bold'
                                                    : '700',
                                            color: 'red',
                                        }}
                                    >
                                        SAVE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <View
                            key={'goback'}
                            style={[
                                styles.centerContent,
                                {
                                    position: 'absolute',
                                    left: 0,
                                    bottom: 0 * factorRatio,
                                    height: 50 * factorRatio,
                                    width: 50 * factorRatio,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.state.currentlyView ==
                                    'Profile Settings'
                                        ? this.props.navigation.goBack()
                                        : this.setState({
                                              currentlyView: 'Profile Settings',
                                          });
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '100%',
                                    },
                                ]}
                            >
                                <EntypoIcon
                                    name={'chevron-thin-left'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 0.66}} />
                        <Text
                            style={{
                                fontSize: 22 * factorRatio,
                                fontWeight: 'bold',
                                fontFamily: 'OpenSans-Regular',
                                color: colors.secondBackground,
                            }}
                        >
                            {this.state.currentlyView}
                        </Text>
                        <View style={{flex: 0.33}} />
                    </View>
                    <View
                        key={'scrollview'}
                        style={{
                            flex: 0.95,
                        }}
                    >
                        {this.state.currentlyView == 'Profile Settings' && (
                            <ScrollView style={{flex: 1}}>
                                <TouchableOpacity
                                    key={'profileProfileSettings'}
                                    onPress={() =>
                                        this.setState({
                                            currentlyView: 'Display Name',
                                        })
                                    }
                                    style={[
                                        styles.centerContent,
                                        {
                                            height: 50 * factorRatio,
                                            width: fullWidth,
                                            borderBottomColor:
                                                colors.secondBackground,
                                            borderBottomWidth: 1 * factorRatio,
                                            borderTopWidth: 1 * factorRatio,
                                            borderTopColor:
                                                colors.secondBackground,
                                            flexDirection: 'row',
                                            paddingRight: fullWidth * 0.025,
                                        },
                                    ]}
                                >
                                    <View
                                        style={{
                                            width: 20 * factorHorizontal,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 18 * factorRatio,
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        Display Name
                                    </Text>
                                    <View style={{flex: 1}} />
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
                                            currentlyView: 'Profile Photo',
                                        });
                                    }}
                                    style={[
                                        styles.centerContent,
                                        {
                                            height: 50 * factorRatio,
                                            width: fullWidth,
                                            borderBottomColor:
                                                colors.secondBackground,
                                            borderBottomWidth: 1 * factorRatio,
                                            flexDirection: 'row',
                                            paddingRight: fullWidth * 0.025,
                                        },
                                    ]}
                                >
                                    <View
                                        style={{
                                            width: 20 * factorHorizontal,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 18 * factorRatio,
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        Profile Photo
                                    </Text>
                                    <View style={{flex: 1}} />
                                    <AntIcon
                                        name={'right'}
                                        size={22.5 * factorRatio}
                                        color={colors.secondBackground}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                        {this.state.currentlyView == 'Display Name' && (
                            <View style={{width: fullWidth}}>
                                <TextInput
                                    ref={txt => {
                                        this.txt = txt;
                                    }}
                                    placeholder={'Display Name'}
                                    value={this.state.displayName}
                                    placeholderTextColor={
                                        colors.secondBackground
                                    }
                                    onChangeText={displayName =>
                                        this.setState({displayName})
                                    }
                                    onSubmitEditing={() => {}}
                                    returnKeyType={'go'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        height:
                                            Platform.OS == 'android'
                                                ? fullHeight * 0.07
                                                : fullHeight * 0.06,
                                        paddingLeft: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                />
                                <View style={{height: 10 * factorRatio}} />
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16 * factorRatio,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    This is the name that will appear on your
                                    comments and forum posts.
                                </Text>
                            </View>
                        )}
                        {this.state.currentlyView == 'Profile Photo' && (
                            <View
                                style={{
                                    height: fullHeight,
                                    width: fullWidth,
                                }}
                            >
                                <View style={{height: 50 * factorVertical}} />
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 1}} />
                                    <View
                                        key={'imageCircle'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                height: fullWidth * 0.65,
                                                width: fullWidth * 0.65,
                                                borderRadius: 200 * factorRatio,
                                                backgroundColor:
                                                    colors.secondBackground,
                                            },
                                        ]}
                                    >
                                        {this.state.imageURI !== '' && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.setState({
                                                        imageURI: '',
                                                        imageType: '',
                                                        imageName: '',
                                                    })
                                                }
                                                style={[
                                                    styles.centerContent,
                                                    {
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        height:
                                                            35 * factorRatio,
                                                        width: 35 * factorRatio,
                                                        borderRadius: 200,
                                                        borderColor:
                                                            colors.secondBackground,
                                                        borderWidth: 2,
                                                        zIndex: 5,
                                                    },
                                                ]}
                                            >
                                                <EntypoIcon
                                                    name={'cross'}
                                                    size={25 * factorRatio}
                                                    color={
                                                        colors.secondBackground
                                                    }
                                                />
                                            </TouchableOpacity>
                                        )}
                                        {this.state.imageURI !== '' && (
                                            <FastImage
                                                style={{
                                                    height: '100%',
                                                    width: '100%',
                                                    borderRadius:
                                                        200 * factorRatio,
                                                }}
                                                source={{
                                                    uri: this.state.imageURI,
                                                }}
                                                resizeMode={
                                                    FastImage.resizeMode.cover
                                                }
                                            />
                                        )}
                                        {this.state.imageURI == '' && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.chooseImage()
                                                }
                                                style={[
                                                    styles.centerContent,
                                                    {
                                                        height: '100%',
                                                        width: '100%',
                                                    },
                                                ]}
                                            >
                                                <AntIcon
                                                    name={'plus'}
                                                    size={65 * factorRatio}
                                                    color={'white'}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{height: 35 * factorRatio}} />
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 15 * factorRatio,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    This is the image that will appear with your
                                    comments and forum posts.
                                </Text>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 215 * factorVertical,
                                        width: fullWidth,
                                        flexDirection: 'row',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <TouchableOpacity
                                        onPress={() => this.changeImage()}
                                        style={[
                                            styles.centerContent,
                                            {
                                                height: fullWidth * 0.2,
                                                width: fullWidth * 0.2,
                                                borderRadius: 200 * factorRatio,
                                                borderColor:
                                                    colors.secondBackground,
                                                borderWidth: 2 * factorRatio,
                                            },
                                        ]}
                                    >
                                        <IonIcon
                                            size={50 * factorRatio}
                                            name={'ios-camera'}
                                            color={colors.secondBackground}
                                        />
                                    </TouchableOpacity>
                                    <View style={{flex: 1}} />
                                </View>
                            </View>
                        )}
                        {this.state.currentlyView == 'Password' && (
                            <View style={{width: fullWidth}}>
                                <TextInput
                                    ref={txt => {
                                        this.password = txt;
                                    }}
                                    placeholder={'Current Password'}
                                    value={this.state.password}
                                    placeholderTextColor={
                                        colors.secondBackground
                                    }
                                    onChangeText={password =>
                                        this.setState({password})
                                    }
                                    onSubmitEditing={() => {}}
                                    returnKeyType={'go'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        height:
                                            Platform.OS == 'android'
                                                ? fullHeight * 0.07
                                                : fullHeight * 0.06,
                                        paddingLeft: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                />
                                <TextInput
                                    ref={txt => {
                                        this.newPassword = txt;
                                    }}
                                    placeholder={'New Password'}
                                    value={this.state.newPassword}
                                    placeholderTextColor={
                                        colors.secondBackground
                                    }
                                    onChangeText={newPassword =>
                                        this.setState({newPassword})
                                    }
                                    onSubmitEditing={() => {}}
                                    returnKeyType={'go'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        height:
                                            Platform.OS == 'android'
                                                ? fullHeight * 0.07
                                                : fullHeight * 0.06,
                                        paddingLeft: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                        color: colors.secondBackground,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                    }}
                                />
                                <TextInput
                                    ref={txt => {
                                        this.retypeNewPassword = txt;
                                    }}
                                    placeholder={'Re-Type New Password'}
                                    value={this.state.retypeNewPassword}
                                    placeholderTextColor={
                                        colors.secondBackground
                                    }
                                    onChangeText={retypeNewPassword => {
                                        this.setState({retypeNewPassword});
                                    }}
                                    onSubmitEditing={() => {}}
                                    returnKeyType={'go'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        height:
                                            Platform.OS == 'android'
                                                ? fullHeight * 0.07
                                                : fullHeight * 0.06,
                                        paddingLeft: fullWidth * 0.045,
                                        width: fullWidth,
                                        color: colors.secondBackground,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                    }}
                                />
                            </View>
                        )}
                    </View>
                </View>

                {this.state.currentlyView == 'Profile Settings' && (
                    <NavigationBar currentPage={'PROFILE'} />
                )}

                {this.state.currentlyView !== 'Profile Settings' && (
                    <View style={{height: fullHeight * 0.09375}} />
                )}

                <Modal
                    isVisible={this.state.showDisplayName}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
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
                                showDisplayName: false,
                            });
                        }}
                    />
                </Modal>
            </KeyboardAwareScrollView>
        );
    }
}
