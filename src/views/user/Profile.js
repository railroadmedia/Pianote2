/**
 * Profile
 */
import React from 'react';
import { 
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import XpRank from 'Pianote2/src/modals/XpRank.js';
import ImagePicker from 'react-native-image-picker';
import Chat from 'Pianote2/src/assets/img/svgs/chat.svg';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import Settings from 'Pianote2/src/assets/img/svgs/settings.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import ReplyNotification from 'Pianote2/src/modals/ReplyNotification.js';

export default class Profile extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            profileImage: '',
            notifications: [1,2,3,4,5],
            showXpRank: false,
            showReplyNotification: false,
        }
    }


    componentDidMount = async () => {
        profileImage = await AsyncStorage.getItem('profileURI')
        await this.setState({profileImage})
    }


    renderNotifications() {
        return this.state.notifications.map((data, index) => {
            return (
                <View
                    style={{
                        height: 90*factorRatio,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                    }}
                >
                    <View
                        style={{
                            flex: 0.275,
                            flexDirection: 'row',
                        }}
                    >
                        <View style={{flex: 1}}/>
                        <View>
                            <View style={{flex: 1}}/>
                            <View
                                style={{
                                    height: fullWidth*0.175,
                                    width: fullWidth*0.175,
                                    borderRadius: 150*factorRatio,
                                    backgroundColor: '#ececec',
                                }}
                            >
                                <View
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        height: fullWidth*0.075,
                                        width: fullWidth*0.075,
                                        backgroundColor: (
                                            (index % 2) ? 'orange' : 'blue' 
                                        ),
                                        borderRadius: 100*factorRatio,
                                        zIndex: 5,
                                    }]}
                                >
                                    <Chat
                                        height={fullWidth*0.05}
                                        width={fullWidth*0.05}
                                        fill={'white'}
                                    />
                                </View>
                                <FastImage
                                    style={{flex: 1, borderRadius: 100}}
                                    source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 1}}/>
                    </View>
                    <View style={{flex: 0.675}}>
                        <View style={{flex: 1}}>
                            <View style={{flex: 1}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 15*factorRatio,
                                    fontWeight: (Platform.OS == 'ios') ? '700' : 'bold',
                                }}
                            ><Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 15*factorRatio,
                                    fontWeight: (Platform.OS == 'ios') ? '700' : 'bold',
                                    color: '#fb1b2f',
                                }}
                            >{'NEW - '}</Text>Jordan Leibel<Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 14*factorRatio,
                                        fontWeight: '400',
                                    }}
                                > replied to your comment.</Text>
                            </Text>
                            <View style={{height: 5*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 13*factorRatio,
                                    fontWeight: '400',
                                    color: 'grey',
                                }}
                            >
                                Yesterday at 12:19 PM
                            </Text>  
                            <View style={{flex: 1}}/>
                        </View>                          
                    </View>
                    <View>
                        <View style={{flex: 1}}/>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({showReplyNotification: true})
                                }}
                                style={{
                                    height: 35*factorRatio,
                                    justifyContent: 'center',
                                }}
                            >
                                <EntypoIcon        
                                    size={20*factorRatio}
                                    name={'dots-three-horizontal'}
                                />
                            </TouchableOpacity>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 1}}/>
                    </View>
                </View>
            )
        })
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
                AsyncStorage.setItem('profileImage', response.data)
                AsyncStorage.setItem('profileURI', response.uri)
                this.setState({
                    imageURI: response.uri,
                    showImage: true,
                    profileImage: response.uri,
                })
            }
        })
        await this.forceUpdate()
    }


    clearImage = async () => {
        await AsyncStorage.setItem('profileImage', '')
        await this.setState({
            imageURI: '', 
            showImage: false,
        })
        await this.forceUpdate()
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
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior={'never'}
                            style={{flex: 1, backgroundColor: 'white'}}
                        >
                            <View key={'backgroundColoring'}
                                style={{
                                    backgroundColor: '#fb1b2f',
                                    position: 'absolute',
                                    height: fullHeight,
                                    top: -fullHeight,
                                    left: 0,
                                    right: 0,
                                    zIndex: 10,
                                    elevation: 10,
                                }}
                            />
                            <View key={'myProfile'}
                                style={[
                                    styles.centerContent, {
                                    height: (isNotch) ? fullHeight*0.12 : fullHeight*0.1,
                                    backgroundColor: '#fb1b2f',
                                    elevation: 0,
                                }]}
                            >
                                <View style={{flex: 0.5}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 1}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontWeight: (Platform.OS == 'ios') ? '600' : 'bold',
                                            fontSize: 18*factorRatio,
                                            color: 'white',
                                        }}
                                    >
                                        My Profile
                                    </Text>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <View style={{flex: 0.8}}/>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('SETTINGS')
                                            }}
                                        >
                                            <Settings
                                                height={20*factorRatio}
                                                width={20*factorRatio}
                                                fill={'white'}
                                            />
                                        </TouchableOpacity>
                                        <View style={{flex: 0.2}}/>
                                    </View>
                                </View>
                                <View style={{flex: 0.25}}/>
                            </View>
                            <View key={'profilePicture'}
                                style={[
                                    styles.centerContent, {
                                        backgroundColor: '#fb1b2f',
                                    height: (isNotch) ? fullHeight*0.35 : fullHeight*0.375,
                                }]}
                            >
                                <View key={'rank'}
                                    style={{
                                        position: 'absolute',
                                        flexDirection: 'row',
                                        bottom: '7.25%',
                                        height: '5%',
                                        width: '100%',
                                        shadowOffset: { 
                                            width: 5*factorRatio, 
                                            height: 5*factorRatio 
                                        },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.1,
                                        zIndex: 5,
                                        elevation: 5,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            height: fullHeight*0.0875,
                                            width: '90%',
                                            borderRadius: 75*factorRatio,
                                            backgroundColor: 'white',
                                            elevation: 5,
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <TouchableOpacity
                                            style={[styles.centerContent, {flex: 10}]}
                                            onPress={() => {
                                                this.setState({showXpRank: true})
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 12.5*factorRatio,
                                                    fontWeight: (Platform.OS == 'ios') ? '600' : 'bold',
                                                    textAlign: 'center',
                                                    color: '#fb1b2f',
                                                }}
                                            >
                                                XP
                                            </Text>
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 22.5*factorRatio,
                                                    fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                11,768
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={{flex: 1}}/>
                                        <TouchableOpacity
                                            style={[styles.centerContent, {flex: 10}]}
                                            onPress={() => {
                                                this.setState({showXpRank: true})
                                            }}
                                        >
                                            <View
                                                style={{
                                                    heiight: '100%',
                                                    width: '100%'
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        fontSize: 12.5*factorRatio,
                                                        fontWeight: (Platform.OS == 'ios') ? '600' : 'bold',
                                                        textAlign: 'center',
                                                        color: '#fb1b2f',
                                                    }}
                                                >
                                                    RANK
                                                </Text>
                                                <Text
                                                style={{
                                                    fontFamily: 'OpenSans-Regular',
                                                    fontSize: 22.5*factorRatio,
                                                    fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                MAESTRO
                                            </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View key={'imageProfile'}
                                    style={{
                                        borderRadius: 250,
                                        borderWidth: 2*factorRatio,
                                        borderColor: 'white',
                                        height: (onTablet) ? 112*factorRatio : 140*factorRatio,
                                        width: (onTablet) ? 112*factorRatio : 140*factorRatio,
                                    }}
                                >
                                    <View key={'camera'}
                                        style={{
                                            position: 'absolute',
                                            top: -11*factorVertical,
                                            right: -11*factorVertical,
                                            height: 32*factorVertical,
                                            width: 32*factorVertical,
                                            borderRadius: 100,
                                            borderWidth: 2,
                                            borderColor: 'white',
                                            zIndex: 13,
                                        }}
                                    >         
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.chooseImage()
                                            }}
                                            style={[
                                                styles.centerContent, {
                                                height: '100%',
                                                width: '100%',
                                            }]}
                                        >
                                            <EntypoIcon
                                                size={(onTablet) ? 14*factorRatio : 16*factorRatio}
                                                color={'white'}
                                                name={'camera'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1}}/>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flex: 1}}/>
                                        <FastImage
                                            style={{
                                                height: (onTablet) ? 100*factorRatio : 125*factorRatio,
                                                width: (onTablet) ? 100*factorRatio : 125*factorRatio,
                                                borderRadius: 250
                                            }}
                                            source={{uri: this.state.profileImage}}
                                            resizeMode={FastImage.resizeMode.stretch}
                                        />
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{height: 10*factorVertical}}/>
                                <View key={'name'}
                                    style={[
                                        styles.centerContent, {
                                        alignSelf: 'stretch'
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 30*factorRatio,
                                            fontWeight: (Platform.OS == 'ios') ? '700' : 'bold',
                                            textAlign: 'center',
                                            color: 'white',
                                        }}
                                    >
                                        Jared Falk
                                    </Text>
                                    <View style={{height: 10*factorVertical}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 14*factorRatio,
                                            fontWeight: '400',
                                            textAlign: 'center',
                                            color: 'white',
                                        }}
                                    >
                                        @drummer_jared
                                    </Text>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>   
                            <View key={'notifications'}
                                style={{
                                    height: fullHeight*0.115,
                                    elevation: 1,
                                }}
                            >
                                <View style={{height: '60%'}}/>
                                <View style={{flex: 0.5}}/>
                                <Text
                                    style={{
                                        paddingLeft: fullWidth*0.05,
                                        fontSize: 18*factorRatio,
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                        color: '#9b9b9b',
                                    }}
                                >
                                    NOTIFICATIONS
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            {this.renderNotifications()}
                        </ScrollView>
                    </View>
                    <Modal key={'XpRank'}
                        isVisible={this.state.showXpRank}
                        style={[
                            styles.centerContent, {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        }]}
                        animation={'slideInUp'}
                        animationInTiming={250}
                        animationOutTiming={250}
                        coverScreen={false}
                        hasBackdrop={false}
                    >
                        <XpRank
                            hideXpRank={() => {
                                this.setState({showXpRank: false})
                            }}
                        />
                    </Modal>
                    <Modal key={'replyNotification'}
                        isVisible={this.state.showReplyNotification}
                        style={[
                            styles.centerContent, {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        }]}
                        animation={'slideInUp'}
                        backdropOpacity={0.6}
                        animationInTiming={250}
                        animationOutTiming={250}
                        coverScreen={false}
                        hasBackdrop={true}
                    >
                        <ReplyNotification
                            hideReplyNotification={() => {
                                this.setState({showReplyNotification: false})
                            }}
                        />
                    </Modal>                    
                    <NavigationBar
                        currentPage={'PROFILE'}
                    />
                </View>
            </View>
        )
    }
}