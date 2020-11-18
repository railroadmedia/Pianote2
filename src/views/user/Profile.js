/**
 * Profile
 */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

import Chat from 'Pianote2/src/assets/img/svgs/chat.svg';
import Settings from 'Pianote2/src/assets/img/svgs/settings.svg';

import XpRank from '../../modals/XpRank.js';
import {getUserData} from '../../services/UserDataAuth.js';
import NavigationBar from '../../components/NavigationBar.js';
import ReplyNotification from '../../modals/ReplyNotification.js';
import commonService from '../../services/common.service';
import {NetworkContext} from '../../context/NetworkProvider';
import {
    getnotifications,
    removeNotification,
} from '../../services/notification.service';

const messageDict = {
    'lesson comment reply': [
        'replied to your comment.',
        true,
        'orange',
        'comment reply notifications',
    ], // notify_on_lesson_comment_reply: this.state.notify_on_lesson_comment_reply,
    'lesson comment liked': [
        'liked your comment.',
        true,
        'blue',
        'comment like notifications',
    ], // notify_on_forum_post_like: this.state.notify_on_forum_post_like,
    'forum post reply': [
        'replied to your forum post.',
        true,
        'orange',
        'forum post reply notifications',
    ], // notify_on_forum_post_reply: this.state.notify_on_forum_post_reply,
    'forum post liked': [
        'liked your forum post.',
        true,
        'blue',
        'forum post like notifications',
    ], // notify_on_lesson_comment_like: this.state.notify_on_lesson_comment_like,
    'forum post in followed thread': [
        'post in followed thread.',
        false,
        'orange',
        'forum post reply notifications',
    ],
    'new content releases': [
        '',
        false,
        'red',
        'new content release notifications',
    ], // notify_weekly_update: this.state.notify_weekly_update,
};

export default class Profile extends React.Component {
    static navigationOptions = {header: null};
    static contextType = NetworkContext;
    page = 1;
    constructor(props) {
        super(props);
        this.state = {
            profileImage: '',
            xp: '',
            notifications: [],
            showXpRank: false,
            showReplyNotification: false,
            memberSince: '',
            isLoading: true,
            animateLoadMore: false,
            clickedNotificationStatus: false,
            notify_on_forum_followed_thread_reply: false,
            notify_on_forum_post_like: false,
            notify_on_forum_post_reply: false,
            notify_on_lesson_comment_like: false,
            notify_on_lesson_comment_reply: false,
            notify_weekly_update: false,
        };
    }

    UNSAFE_componentWillMount = async () => {
        let data = await AsyncStorage.multiGet([
            'totalXP',
            'rank',
            'profileURI',
            'displayName',
            'joined',
        ]);

        let xp = await this.changeXP(data[0][1]);

        this.setState({
            xp,
            rank: data[1][1],
            profileImage: data[2][1],
            username: data[3][1],
            memberSince: data[4][1],
        });
    };

    async componentDidMount() {
        let userData = await getUserData();
        this.setState({
            notifications_summary_frequency_minutes:
                userData.notifications_summary_frequency_minutes,
            notify_on_forum_followed_thread_reply:
                userData.notify_on_forum_followed_thread_reply,
            notify_on_forum_post_like: userData.notify_on_forum_post_like,
            notify_on_forum_post_reply: userData.notify_on_forum_post_reply,
            notify_on_lesson_comment_like:
                userData.notify_on_lesson_comment_like,
            notify_on_lesson_comment_reply:
                userData.notify_on_lesson_comment_reply,
            notify_weekly_update: userData.notify_weekly_update,
        });
        this.getNotifications(false);
    }

    async getNotifications(loadMore) {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }

        if (loadMore) this.page++;
        else this.page = 1;
        let notifications = await getnotifications(this.page);
        for (i in notifications.data) {
            let timeCreated =
                notifications.data[i].created_at?.slice(0, 10) +
                'T' +
                notifications.data[i].created_at?.slice(11) +
                '.000Z';
            let dateNote = new Date(timeCreated).getTime() / 1000;
            let dateNow = new Date().getTime() / 1000;
            let timeDelta = dateNow - dateNote; // in seconds

            if (timeDelta < 3600) {
                notifications.data[i].created_at = `${(timeDelta / 60).toFixed(
                    0,
                )} minute${
                    timeDelta < 60 * 2 && timeDelta >= 60 ? '' : 's'
                } ago`;
            } else if (timeDelta < 86400) {
                notifications.data[i].created_at = `${(
                    timeDelta / 3600
                ).toFixed(0)} hour${timeDelta < 3600 * 2 ? '' : 's'} ago`;
            } else if (timeDelta < 604800) {
                notifications.data[i].created_at = `${(
                    timeDelta / 86400
                ).toFixed(0)} day${timeDelta < 86400 * 2 ? '' : 's'} ago`;
            } else {
                notifications.data[i].created_at = `${(
                    timeDelta / 604800
                ).toFixed(0)} week${timeDelta < 604800 * 2 ? '' : 's'} ago`;
            }
        }

        this.setState(state => ({
            notifications: loadMore
                ? state.notifications.concat(notifications.data)
                : notifications.data,
            isLoading: false,
        }));
    }

    changeXP = async num => {
        if (num !== '') {
            num = Number(num);
            if (num < 10000) {
                num = num.toString();
                return num;
            } else {
                num = (num / 1000).toFixed(1).toString();
                num = num + 'k';
                return num;
            }
        }
    };

    removeNotification = async notificationId => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        this.setState(state => ({
            notifications: state.notifications.filter(
                c => c.id !== notificationId,
            ),
        }));
        removeNotification(notificationId);
    };

    checkNotificationTypeStatus = async item => {
        let type = messageDict[item.type][0];
        if (type == 'replied to your comment.') {
            this.setState({
                clickedNotificationStatus: this.state
                    .notify_on_lesson_comment_reply,
            });
        } else if (type == 'liked your comment.') {
            this.setState({
                clickedNotificationStatus: this.state
                    .notify_on_lesson_comment_like,
            });
        } else if (type == 'replied to your forum post.') {
            this.setState({
                clickedNotificationStatus: this.state
                    .notify_on_forum_post_reply,
            });
        } else if (type == 'liked your forum post.') {
            this.setState({
                clickedNotificationStatus: this.state.notify_on_forum_post_like,
            });
        } else if (type == 'post in followed thread.') {
            this.setState({
                clickedNotificationStatus: this.state
                    .notify_on_forum_followed_thread_reply,
            });
        } else if (type == '') {
            this.setState({
                clickedNotificationStatus: this.state.notify_weekly_update,
            });
        }
    };

    turnOfffNotifications = async data => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        this.setState(data);
        try {
            let response = await commonService.tryCall(
                `${commonService.rootUrl}/usora/api/profile/update`,
                'PATCH',
                {
                    data: {
                        type: 'user',
                        attributes: data,
                    },
                },
            );

            console.log(response);
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    openNotification = notification => {
        console.log(notification);
        if (notification.type === 'new content releases') {
            this.props.navigation.navigate('VIDEOPLAYER', {
                url: notification.content.mobile_app_url,
            });
        } else if (
            notification.type === 'lesson comment reply' ||
            notification.type === 'lesson comment liked'
        ) {
            this.props.navigation.navigate('VIDEOPLAYER', {
                comment: notification.comment,
                url: notification.content.mobile_app_url,
            });
        } else {
            console.log('LINKING URL: ', notification.url)
            Linking.openURL(notification.url);
        }
    };

    loadMoreNotifications = () => {
        this.setState({animateLoadMore: true}, () => {
            this.getNotifications(true);
        });
    };

    render() {
        return (
            <View style={{flex: 1, backgroundColor: colors.mainBackground}}>
                <View key={'contentContainer'} style={{flex: 1}}>
                    <View
                        style={[
                            styles.centerContent,
                            {
                                height:
                                    Platform.OS == 'android'
                                        ? fullHeight * 0.1
                                        : isNotch
                                        ? fullHeight * 0.12
                                        : fullHeight * 0.1 + 10,
                                backgroundColor: colors.thirdBackground,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('SETTINGS');
                            }}
                            style={{
                                position: 'absolute',
                                zIndex: 10,
                                elevation: 10,
                                right: 20 * factorRatio,
                                bottom: 20 * factorRatio,
                            }}
                        >
                            <Settings
                                height={25 * factorRatio}
                                width={25 * factorRatio}
                                fill={colors.pianoteRed}
                            />
                        </TouchableOpacity>
                        <View style={{flex: 1}} />
                        <View
                            style={[
                                styles.centerContent,
                                {
                                    backgroundColor: colors.thirdBackground,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    fontSize: 22 * factorRatio,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontFamily: 'OpenSans-Regular',
                                }}
                            >
                                My Profile
                            </Text>
                        </View>
                        <View style={{height: 20 * factorVertical}} />
                    </View>
                    <View style={{height: 10}} />
                    <FlatList
                        style={{
                            flex: 1,
                            backgroundColor: colors.mainBackground,
                        }}
                        data={this.state.notifications}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={this.loadMoreNotifications}
                        onEndReachedThreshold={0.01}
                        ListHeaderComponent={() => (
                            <>
                                <View style={{height: 20 * factorVertical}} />
                                <View
                                    key={'profilePicture'}
                                    style={[
                                        styles.centerContent,
                                        {
                                            backgroundColor:
                                                colors.mainBackground,
                                        },
                                    ]}
                                >
                                    <View
                                        key={'imageProfile'}
                                        style={{
                                            borderRadius: 250,
                                            borderWidth: 2 * factorRatio,
                                            borderColor: colors.pianoteRed,
                                            height: onTablet
                                                ? 112 * factorRatio
                                                : 140 * factorRatio,
                                            width: onTablet
                                                ? 112 * factorRatio
                                                : 140 * factorRatio,
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    position: 'absolute',
                                                    zIndex: 10,
                                                    elevation: 10,
                                                    top: -12.5 * factorRatio,
                                                    right: -12.5 * factorRatio,
                                                    height: 35 * factorRatio,
                                                    width: 35 * factorRatio,
                                                    borderRadius: 100,
                                                    borderColor:
                                                        colors.pianoteRed,
                                                    borderWidth:
                                                        1.5 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.props.navigation.navigate(
                                                        'PROFILESETTINGS',
                                                        {
                                                            data:
                                                                'Profile Photo',
                                                        },
                                                    );
                                                }}
                                                style={[
                                                    styles.centerContent,
                                                    {
                                                        height: '100%',
                                                        width: '100%',
                                                    },
                                                ]}
                                            >
                                                <IonIcon
                                                    size={25 * factorRatio}
                                                    name={'ios-camera'}
                                                    color={colors.pianoteRed}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {this.state.profileImage == '' && (
                                            <View
                                                style={[
                                                    styles.centerContent,
                                                    {
                                                        height: '100%',
                                                        width: '100%',
                                                        alignSelf: 'stretch',
                                                    },
                                                ]}
                                            >
                                                <AntIcon
                                                    name={'user'}
                                                    color={colors.pianoteRed}
                                                    size={85 * factorRatio}
                                                />
                                            </View>
                                        )}
                                        {this.state.profileImage !== '' && (
                                            <FastImage
                                                style={{
                                                    height: '100%',
                                                    width: '100%',
                                                    borderRadius: 250,
                                                    backgroundColor:
                                                        colors.secondBackground,
                                                }}
                                                source={{
                                                    uri: this.state
                                                        .profileImage,
                                                }}
                                                resizeMode={
                                                    FastImage.resizeMode.cover
                                                }
                                            />
                                        )}
                                    </View>
                                    <View
                                        style={{
                                            height: 10 * factorVertical,
                                        }}
                                    />
                                    <View
                                        key={'name'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                alignSelf: 'stretch',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontFamily:
                                                    'OpenSans-ExtraBold',
                                                fontSize: 30 * factorRatio,
                                                textAlign: 'center',
                                                color: 'white',
                                            }}
                                        >
                                            {this.state.username}
                                        </Text>
                                        <View
                                            style={{
                                                height: 10 * factorVertical,
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 14 * factorRatio,
                                                textAlign: 'center',
                                                color: colors.secondBackground,
                                            }}
                                        >
                                            MEMBER SINCE{' '}
                                            {this.state.memberSince?.slice(
                                                0,
                                                4,
                                            )}
                                        </Text>
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{height: 20 * factorVertical}} />
                                <View
                                    key={'rank'}
                                    style={{
                                        borderTopColor: colors.secondBackground,
                                        borderTopWidth: 0.25,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 0.25,
                                        height: fullHeight * 0.1,
                                        paddingTop: 10 * factorVertical,
                                        paddingBottom: 10 * factorVertical,
                                        backgroundColor: colors.mainBackground,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 3,
                                            flexDirection: 'row',
                                            alignSelf: 'stretch',
                                        }}
                                    >
                                        <View style={{flex: 1}} />
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    showXpRank: true,
                                                });
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            <View>
                                                <Text
                                                    style={{
                                                        color:
                                                            colors.pianoteRed,
                                                        fontSize:
                                                            12 * factorRatio,
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    XP
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: 'white',
                                                        fontSize:
                                                            24 * factorRatio,
                                                        fontFamily:
                                                            'OpenSans-ExtraBold',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {this.state.xp}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1}} />
                                        </TouchableOpacity>
                                        <View style={{flex: 1}} />
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    showXpRank: true,
                                                });
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            <View>
                                                <Text
                                                    style={{
                                                        color:
                                                            colors.pianoteRed,
                                                        fontSize:
                                                            12 * factorRatio,
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    RANK
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: 'white',
                                                        fontSize:
                                                            24 * factorRatio,
                                                        fontFamily:
                                                            'OpenSans-ExtraBold',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {this.state.rank}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1}} />
                                        </TouchableOpacity>
                                        <View style={{flex: 1}} />
                                    </View>
                                </View>
                                <View
                                    key={'notifications'}
                                    style={{
                                        paddingTop: 25 * factorVertical,
                                        paddingBottom: 15 * factorVertical,
                                        elevation: 1,
                                    }}
                                >
                                    <View style={{flex: 0.5}} />
                                    <Text
                                        style={{
                                            paddingLeft: fullWidth * 0.05,
                                            fontSize: 18 * factorRatio,
                                            fontFamily: 'OpenSans-ExtraBold',
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        NOTIFICATIONS
                                    </Text>
                                    <View style={{flex: 1}} />
                                </View>
                            </>
                        )}
                        ListEmptyComponent={() =>
                            this.state.isLoading ? (
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            flex: 1,
                                            marginTop: 15 * factorRatio,
                                        },
                                    ]}
                                >
                                    <ActivityIndicator
                                        size={onTablet ? 'large' : 'small'}
                                        animating={true}
                                        color={colors.secondBackground}
                                    />
                                </View>
                            ) : (
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-ExtraBold',
                                        fontSize: 15 * factorRatio,
                                        textAlign: 'left',
                                        paddingLeft: fullWidth * 0.05,
                                        color: 'white',
                                    }}
                                >
                                    No New Notifications...
                                </Text>
                            )
                        }
                        ListFooterComponent={() => (
                            <ActivityIndicator
                                style={{marginTop: 10, marginBottom: 10}}
                                size='small'
                                color={colors.pianoteRed}
                                animating={this.state.animateLoadMore}
                                hidesWhenStopped={true}
                            />
                        )}
                        renderItem={({item, index}) => (
                            <TouchableOpacity
                                style={{
                                    height: 90 * factorRatio,
                                    backgroundColor:
                                        index % 2
                                            ? colors.mainBackground
                                            : colors.notificationColor,
                                    flexDirection: 'row',
                                }}
                                onPress={() => this.openNotification(item)}
                            >
                                <View
                                    style={{
                                        flex: 0.275,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View>
                                        <View style={{flex: 1}} />
                                        <View
                                            style={{
                                                height: fullWidth * 0.175,
                                                width: fullWidth * 0.175,
                                                borderRadius: 150 * factorRatio,
                                                backgroundColor: '#ececec',
                                            }}
                                        >
                                            {messageDict[item.type][2] ==
                                                'red' && (
                                                <View
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            position:
                                                                'absolute',
                                                            bottom: 0,
                                                            right: 0,
                                                            height:
                                                                fullWidth *
                                                                0.075,
                                                            width:
                                                                fullWidth *
                                                                0.075,
                                                            backgroundColor:
                                                                'red',
                                                            borderRadius:
                                                                100 *
                                                                factorRatio,
                                                            zIndex: 5,
                                                        },
                                                    ]}
                                                >
                                                    <FontAwesome
                                                        size={fullWidth * 0.045}
                                                        color={'white'}
                                                        name={'video-camera'}
                                                    />
                                                </View>
                                            )}
                                            {messageDict[item.type][2] ==
                                                'orange' && (
                                                <View
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            position:
                                                                'absolute',
                                                            bottom: 0,
                                                            right: 0,
                                                            height:
                                                                fullWidth *
                                                                0.075,
                                                            width:
                                                                fullWidth *
                                                                0.075,
                                                            backgroundColor:
                                                                'orange',
                                                            borderRadius:
                                                                100 *
                                                                factorRatio,
                                                            zIndex: 5,
                                                        },
                                                    ]}
                                                >
                                                    <Chat
                                                        height={
                                                            fullWidth * 0.05
                                                        }
                                                        width={fullWidth * 0.05}
                                                        fill={'white'}
                                                    />
                                                </View>
                                            )}
                                            {messageDict[item.type][2] ==
                                                'blue' && (
                                                <View
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            position:
                                                                'absolute',
                                                            bottom: 0,
                                                            right: 0,
                                                            height:
                                                                fullWidth *
                                                                0.075,
                                                            width:
                                                                fullWidth *
                                                                0.075,
                                                            backgroundColor:
                                                                'blue',
                                                            borderRadius:
                                                                100 *
                                                                factorRatio,
                                                            zIndex: 5,
                                                        },
                                                    ]}
                                                >
                                                    <AntIcon
                                                        size={fullWidth * 0.045}
                                                        color={'white'}
                                                        name={'like1'}
                                                    />
                                                </View>
                                            )}
                                            <FastImage
                                                style={{
                                                    flex: 1,
                                                    borderRadius: 100,
                                                }}
                                                source={{
                                                    uri:
                                                        item.type ==
                                                        'new content releases'
                                                            ? item.content
                                                                  .thumbnail_url
                                                            : item.sender
                                                                  ?.profile_image_url,
                                                }}
                                                resizeMode={
                                                    FastImage.resizeMode.stretch
                                                }
                                            />
                                        </View>
                                        <View style={{flex: 1}} />
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{flex: 0.675}}>
                                    <View style={{flex: 1}}>
                                        <View style={{flex: 1}} />
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Bold',
                                                fontSize: 15 * factorRatio,
                                                color: 'white',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        'OpenSans-ExtraBold',
                                                    fontSize: 15 * factorRatio,
                                                    color: 'white',
                                                }}
                                            >
                                                {messageDict[item.type][1]
                                                    ? ''
                                                    : 'NEW - '}
                                            </Text>
                                            {item.type == 'new content releases'
                                                ? item.content.display_name
                                                : item.sender?.display_name}
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    fontSize: 14 * factorRatio,
                                                }}
                                            >
                                                {' '}
                                                {messageDict[item.type][0]}
                                            </Text>
                                        </Text>
                                        <View
                                            style={{
                                                height: 5 * factorVertical,
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 13 * factorRatio,
                                                color: colors.secondBackground,
                                            }}
                                        >
                                            {item.created_at}
                                        </Text>
                                        <View style={{flex: 1}} />
                                    </View>
                                </View>
                                <View>
                                    <View style={{flex: 1}} />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 1}} />
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.checkNotificationTypeStatus(
                                                    item,
                                                );
                                                this.setState({
                                                    showReplyNotification: true,
                                                    clickedNotification: item,
                                                });
                                            }}
                                            style={{
                                                height: 35 * factorRatio,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <EntypoIcon
                                                size={20 * factorRatio}
                                                name={'dots-three-horizontal'}
                                                color={colors.secondBackground}
                                            />
                                        </TouchableOpacity>
                                        <View style={{flex: 1}} />
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <Modal
                    key={'XpRank'}
                    isVisible={this.state.showXpRank}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <XpRank
                        hideXpRank={() => {
                            this.setState({showXpRank: false});
                        }}
                        xp={this.state.xp}
                        rank={this.state.rank}
                    />
                </Modal>
                <Modal
                    key={'replyNotification'}
                    isVisible={this.state.showReplyNotification}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <ReplyNotification
                        removeNotification={data => {
                            this.setState({showReplyNotification: false}),
                                this.removeNotification(data.id);
                        }}
                        turnOfffNotifications={data => {
                            this.setState({showReplyNotification: false}),
                                this.turnOfffNotifications(data);
                        }}
                        hideReplyNotification={() => {
                            this.setState({showReplyNotification: false});
                        }}
                        data={this.state.clickedNotification}
                        notificationStatus={
                            this.state.clickedNotificationStatus
                        }
                    />
                </Modal>
                <NavigationBar currentPage={'PROFILE'} />
            </View>
        );
    }
}
