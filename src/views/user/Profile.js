/**
 * Profile
 */
import React from 'react';
import { 
    View, 
    Text, 
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
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

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
                                    height: fullWidth*0.18,
                                    width: fullWidth*0.18,
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
                                    fontFamily: 'Roboto',
                                    fontSize: 16*factorRatio,
                                    fontWeight: '700',
                                }}
                            ><Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16*factorRatio,
                                    fontWeight: '700',
                                    color: '#fb1b2f',
                                }}
                            >{'NEW - '}</Text>Jordan Leibel<Text
                                    style={{
                                        fontFamily: 'Roboto',
                                        fontSize: 15*factorRatio,
                                        fontWeight: '400',
                                    }}
                                > replied to your comment.</Text>
                            </Text>
                            <View style={{height: 5*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 12*factorRatio,
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
                })
                this.forceUpdate()
            }
        })
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
                        height: fullHeight,
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
                                }}
                            >
                            </View>
                            <View key={'myProfile'}
                                style={[
                                    styles.centerContent, {
                                    height: fullHeight*0.12,
                                    backgroundColor: '#fb1b2f',
                                }]}
                            >
                                <View style={{flex: 0.66}}/>
                                    <View style={{flexDirection: 'row'}}>
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontWeight: '600',
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
                                <View style={{flex: 0.33}}/>
                            </View>
                            <View key={'profilePicture'}
                                style={[
                                    styles.centerContent, {
                                    backgroundColor: '#fb1b2f',
                                    height: fullHeight*0.325,
                                }]}
                            >
                                <View key={'rank'}
                                    style={{
                                        position: 'absolute',
                                        flexDirection: 'row',
                                        zIndex: 12,
                                        bottom: '7.25%',
                                        height: '5%',
                                        width: '100%',
                                        shadowOffset: { 
                                            width: 5*factorRatio, 
                                            height: 5*factorRatio 
                                        },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.1,
                                        elevation: 3,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <View 
                                        style={{
                                            flexDirection: 'row',
                                            height: fullHeight*0.085,
                                            width: '90%',
                                            borderRadius: 75*factorRatio,
                                            backgroundColor: 'white',
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <View style={[styles.centerContent, {flex: 10}]}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({showXpRank: true})
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto',
                                                        fontSize: 12.5*factorRatio,
                                                        fontWeight: '600',
                                                        textAlign: 'center',
                                                        color: '#fb1b2f',
                                                    }}
                                                >
                                                    XP
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: 'RobotoCondensed-Regular',
                                                        fontSize: 22.5*factorRatio,
                                                        fontWeight: '800',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    11,768
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex: 1}}/>
                                        <View style={[styles.centerContent, {flex: 10}]}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({showXpRank: true})
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: 'Roboto',
                                                        fontSize: 12.5*factorRatio,
                                                        fontWeight: '600',
                                                        textAlign: 'center',
                                                        color: '#fb1b2f',
                                                    }}
                                                >
                                                    RANK
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily: 'RobotoCondensed-Regular',
                                                        fontSize: 22.5*factorRatio,
                                                        fontWeight: '800',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    MAESTRO
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>
                                        <View style={{flex: 1}}/>
                                </View>
                                <View key={'imageProfile'}
                                    style={{
                                        borderRadius: 250,
                                        borderWidth: 2*factorRatio,
                                        borderColor: 'white',
                                        height: (isTablet) ? 112*factorRatio : 140*factorRatio,
                                        width: (isTablet) ? 112*factorRatio : 140*factorRatio,
                                    }}
                                >
                                    <View key={'camera'}
                                        style={{
                                            position: 'absolute',
                                            top: -11*factorRatio,
                                            right: -11*factorRatio,
                                            height: 32*factorRatio,
                                            width: 32*factorRatio,
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
                                                size={16*factorRatio}
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
                                                height: (isTablet) ? 100*factorRatio : 125*factorRatio,
                                                width: (isTablet) ? 100*factorRatio : 125*factorRatio,
                                                borderRadius: 250
                                            }}
                                            source={{uri: this.state.profileImage}}
                                            resizeMode={FastImage.resizeMode.stretch}
                                        />
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{flex: 0.2}}/>
                                <View key={'name'}
                                    style={[
                                        styles.centerContent, {
                                        alignSelf: 'stretch'
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 30*factorRatio,
                                            fontWeight: '700',
                                            textAlign: 'center',
                                            color: 'white',
                                        }}
                                    >
                                        Jared Falk
                                    </Text>
                                    <View style={{height: 10*factorVertical}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
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
                                style={{height: fullHeight*0.115}}
                            >
                                <View style={{height: '60%'}}/>
                                <View style={{flex: 0.5}}/>
                                <Text
                                    style={{
                                        paddingLeft: fullWidth*0.05,
                                        fontSize: 18*factorRatio,
                                        fontFamily: 'RobotoCondensed-Regular',
                                        fontWeight: '800',
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