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
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ChangeEmail from '../../modals/ChangeEmail';
import ImagePicker from 'react-native-image-picker';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';

export default class ProfileSettings extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            currentlyView: 'Profile Settings',
            displayName: '',
            showChangeEmail: false,
            currentPassword: '',
            newPassword: '',
            retypeNewPassword: '',
            imageURI: '',
        }
    }


    componentDidMount = async () => {
        let imageURI = await AsyncStorage.getItem('profileURI')
        await this.setState({imageURI})
    }


    async chooseImage() {
        await ImagePicker.showImagePicker({
                tintColor: '#147efb',
                storageOptions: {
                skipBackup: true,
                path: 'images',
            }
        }, (response) => {
            if(response.didCancel) {
            } else if(response.error) {
            } else {
                this.setState({imageURI: response.uri})
                this.forceUpdate()
            }
        })
    }


    render() {
        return (
            <View styles={{flex: 1, alignSelf: 'stretch'}}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <View key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View key={'buffer'}
                            style={{
                                height: (isNotch) ? 15*factorVertical : 0,
                            }}
                        >
                        </View>
                        <View key={'myProfileSettings'}
                            style={[
                                styles.centerContent, {
                                flex: 0.1,
                            }]}
                        >
                            {(this.state.currentlyView !== 'Profile Settings') && (
                            <View key={'save'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    right: 0, 
                                    bottom: 0*factorRatio,
                                    height: 50*factorRatio,
                                    width: 50*factorRatio,
                                }]}
                            >
                                
                                <TouchableOpacity
                                    onPress={() => {}}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                    }]}
                                >
                                    <View style={{height: 5*factorVertical}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 12*factorRatio,
                                            fontWeight: (Platform.OS == 'android') ? 'bold' : '700',
                                            color: 'red',
                                        }}
                                    >
                                        SAVE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            )}
                            <View key={'goback'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 0, 
                                    bottom: 0*factorRatio,
                                    height: 50*factorRatio,
                                    width: 50*factorRatio,
                                }]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        (this.state.currentlyView == 'Profile Settings') ? 
                                            this.props.navigation.goBack() 
                                            :
                                            this.setState({currentlyView: 'Profile Settings'})
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                    }]}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={22.5*factorRatio}
                                        color={'black'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 0.66}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: (Platform.OS == 'android') ? 'bold' : '700',
                                    fontSize: 20*factorRatio,
                                }}
                            >
                                {this.state.currentlyView}
                            </Text>
                            <View style={{flex: 0.33}}/>
                        </View>
                        <View key={'scrollview'}
                            style={{
                                flex: 0.95,
                                borderTopWidth: 1.5*factorRatio,
                                borderTopColor: '#ececec',
                            }}
                        >
                            {(this.state.currentlyView == 'Profile Settings') && (
                            <ScrollView>
                                <TouchableOpacity key={'profileProfileSettings'}
                                    onPress={() => this.setState({
                                        currentlyView: 'Display Name',
                                    })}
                                    style={[styles.centerContent, {
                                        height: 50*factorRatio,
                                        width: fullWidth,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth*0.025,
                                    }]}
                                >
                                    <View style={{width: 20*factorHorizontal}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 18*factorRatio,
                                        }}
                                    >
                                        Display Name
                                    </Text>
                                    <View style={{flex: 1}}/>
                                    <AntIcon
                                        name={'right'}
                                        size={22.5*factorRatio}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity key={'notificationProfileSettings'}
                                    onPress={() => {
                                        this.setState({currentlyView: 'Profile Photo'})
                                    }}
                                    style={[styles.centerContent, {
                                        height: 50*factorRatio,
                                        width: fullWidth,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth*0.025,
                                    }]}
                                >
                                    <View style={{width: 20*factorHorizontal}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 18*factorRatio,
                                        }}
                                    >
                                        Profile Photo
                                    </Text>
                                    <View style={{flex: 1}}/>
                                    <AntIcon
                                        name={'right'}
                                        size={22.5*factorRatio}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity key={'paymentHistory'}
                                    onPress={() => this.setState({
                                        currentlyView: 'Password',
                                    })}
                                    style={[styles.centerContent, {
                                        height: 50*factorRatio,
                                        width: fullWidth,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth*0.025,
                                    }]}
                                >
                                    <View style={{width: 20*factorHorizontal}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 18*factorRatio,
                                        }}
                                    >
                                        Password
                                    </Text>
                                    <View style={{flex: 1}}/>
                                    <AntIcon
                                        name={'right'}
                                        size={22.5*factorRatio}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity key={'manageSubscriptions'}
                                    onPress={() => {
                                        this.setState({
                                            currentlyView: 'Email Address'
                                        })
                                    }}
                                    style={[styles.centerContent, {
                                        height: 50*factorRatio,
                                        width: fullWidth,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth*0.025,
                                    }]}
                                >
                                    <View style={{width: 20*factorHorizontal}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 18*factorRatio,
                                        }}
                                    >
                                        Email Address
                                    </Text>
                                    <View style={{flex: 1}}/>
                                    <AntIcon
                                        name={'right'}
                                        size={22.5*factorRatio}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                            )}
                            {(this.state.currentlyView == 'Display Name') && (
                            <View style={{width: fullWidth}}>
                                <TextInput
                                    ref={(txt) => { this.txt = txt }}
                                    placeholder={'Display Name'}
                                    value={this.state.displayName}
                                    placeholderTextColor={'grey'}
                                    onChangeText={(displayName) => this.setState({displayName})}
                                    onSubmitEditing={() => {}}
                                    returnKeyType={'go'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        height: (Platform.OS == 'android') ? fullHeight*0.07 : fullHeight*0.06,
                                        paddingLeft: fullWidth*0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18*factorRatio,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                    }}
                                />
                                <View style={{height: 10*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16*factorRatio,
                                        paddingLeft: fullWidth*0.045,
                                        paddingRight: fullWidth*0.045,
                                    }}
                                >
                                    This is the name that will appear on your comments and forum posts.
                                </Text>
                            </View>
                            )}
                            {(this.state.currentlyView == 'Profile Photo') && (
                            <View 
                                style={{
                                    height: fullHeight,
                                    width: fullWidth
                                }}
                            >
                                <View style={{height: 50*factorVertical}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 1}}/>
                                    <View key={'imageCircle'}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth* 0.65,
                                            width: fullWidth* 0.65,
                                            borderRadius: 200*factorRatio,
                                            backgroundColor: '#ececec',
                                        }]}
                                    >
                                        {(this.state.imageURI !== '') && (
                                        <TouchableOpacity 
                                            onPress={() => this.setState({imageURI: ''})}
                                            style={[
                                                styles.centerContent, {
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                height: 35*factorRatio,
                                                width: 35*factorRatio,
                                                borderRadius: 200,
                                                borderColor: 'black',
                                                borderWidth: 2,
                                                zIndex: 5,
                                            }]}
                                        >
                                            <EntypoIcon
                                                name={'cross'}
                                                size={25*factorRatio}
                                            />
                                        </TouchableOpacity>
                                        )}
                                        {(this.state.imageURI !== '') && (
                                        <FastImage
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                borderRadius: 200*factorRatio,
                                            }}
                                            source={{uri: this.state.imageURI}}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                        )}
                                        {(this.state.imageURI == '') && (
                                        <TouchableOpacity
                                            onPress={() => this.chooseImage()}
                                            style={[
                                                styles.centerContent, {
                                                height: '100%',
                                                width: '100%',
                                            }]}
                                        >
                                            <AntIcon
                                                name={'plus'}
                                                size={65*factorRatio}
                                                color={'white'}
                                            />
                                        </TouchableOpacity>
                                        )}
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{height: 35*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 15*factorRatio,
                                        paddingLeft: fullWidth*0.045,
                                        paddingRight: fullWidth*0.045,
                                    }}
                                >
                                    This is the image that will appear with your comments and forum posts.
                                </Text>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 215*factorVertical,
                                        width: fullWidth,
                                        flexDirection: 'row',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        onPress={() => this.chooseImage()}
                                        style={[
                                            styles.centerContent, {
                                            height: fullWidth*0.2,
                                            width: fullWidth*0.2,
                                            borderRadius: 200*factorRatio,
                                            borderColor: 'red',
                                            borderWidth: 2*factorRatio,
                                        }]}
                                    >
                                        <IonIcon
                                            size={50*factorRatio}
                                            name={'ios-camera'}
                                            color={'red'}
                                        />
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>
                            </View>
                            )}    
                            {(this.state.currentlyView == 'Password') && (
                            <View style={{width: fullWidth}}>
                                <TextInput
                                    ref={(txt) => { this.password = txt }}
                                    placeholder={'Current Password'}
                                    value={this.state.password}
                                    placeholderTextColor={'grey'}
                                    onChangeText={(password) => this.setState({password})}
                                    onSubmitEditing={() => {}}
                                    returnKeyType={'go'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        height: (Platform.OS == 'android') ? fullHeight*0.07 : fullHeight*0.06,
                                        paddingLeft: fullWidth*0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18*factorRatio,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                    }}
                                />
                                <TextInput
                                    ref={(txt) => { this.newPassword = txt }}
                                    placeholder={'New Password'}
                                    value={this.state.newPassword}
                                    placeholderTextColor={'grey'}
                                    onChangeText={(newPassword) => this.setState({newPassword})}
                                    onSubmitEditing={() => {}}
                                    returnKeyType={'go'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        height: (Platform.OS == 'android') ? fullHeight*0.07 : fullHeight*0.06,
                                        paddingLeft: fullWidth*0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18*factorRatio,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                    }}
                                />
                                <TextInput
                                    ref={(txt) => { this.retypeNewPassword = txt }}
                                    placeholder={'Re-Type New Password'}
                                    value={this.state.retypeNewPassword}
                                    placeholderTextColor={'grey'}
                                    onChangeText={(retypeNewPassword) => {
                                        this.setState({retypeNewPassword})
                                    }}
                                    onSubmitEditing={() => {}}
                                    returnKeyType={'go'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        height: (Platform.OS == 'android') ? fullHeight*0.07 : fullHeight*0.06,
                                        paddingLeft: fullWidth*0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18*factorRatio,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                    }}
                                />
                            </View>
                            )}
                            {(this.state.currentlyView == 'Email Address') && (
                            <View style={{width: fullWidth}}>
                                <TextInput
                                    ref={(txt) => { this.txt = txt }}
                                    placeholder={'Email Address'}
                                    value={this.state.email}
                                    placeholderTextColor={'grey'}
                                    onChangeText={(email) => this.setState({email})}
                                    onSubmitEditing={() => {}}
                                    returnKeyType={'go'}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        height: (Platform.OS == 'android') ? fullHeight*0.07 : fullHeight*0.06,
                                        paddingLeft: fullWidth*0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18*factorRatio,
                                        borderBottomColor: '#ececec',
                                        borderBottomWidth: 1.5*factorRatio,
                                    }}
                                />
                                <View style={{height: 30*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16*factorRatio,
                                        paddingLeft: fullWidth*0.045,
                                        paddingRight: fullWidth*0.045,
                                    }}
                                >
                                    This email address is what you will use to login to your account. You will be asked to confirm with your account password following this change.
                                </Text>
                            </View>
                            )}                            
                        </View>
                    </View>
                    
                    {this.state.showChangeEmail && (
                    <ChangeEmail
                        hideChangeEmail={() => {
                            this.setState({showChangeEmail: false})
                        }}
                    />
                    )}

                    {(this.state.currentlyView == 'Profile Settings') && (
                    <NavigationBar
                        currentPage={'PROFILE'}
                    />
                    )}

                    {(this.state.currentlyView !== 'Profile Settings') && (
                        <View style={{height: fullHeight*0.09375}}/>
                    )}
                </View>
            </View>
        )
    }
}