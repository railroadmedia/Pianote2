/**
 * Profile
 */
import React from 'react';
import {
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator,
    FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import XpRank from 'Pianote2/src/modals/XpRank.js';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Chat from 'Pianote2/src/assets/img/svgs/chat.svg';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {getToken, getUserData} from 'Pianote2/src/services/UserDataAuth.js';
import Settings from 'Pianote2/src/assets/img/svgs/settings.svg';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import ReplyNotification from 'Pianote2/src/modals/ReplyNotification.js';

export default class Profile extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            profileImage: '',
            notifications: [],
            showXpRank: false,
            showReplyNotification: false,
            memberSince: '',
            isLoading: true,
        };
    }

    componentWillMount = async () => {
        let data = await AsyncStorage.multiGet([
            'totalXP',
            'rank',
            'profileURI',
            'displayName',
            'joined',
        ]);

        await this.setState({
            xp: data[0][1],
            rank: data[1][1],
            profileImage: data[2][1],
            username: data[3][1],
            memberSince: data[4][1],
            lessonsStarted: false,
        });
    };

    componentDidMount = async () => {
        const auth = await getToken();

        try {
            let response = await fetch(
                `https://app-staging.pianote.com/api/railnotifications/notifications`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    }
                },
            );
            var notifications = await response.json()

            for(i in notifications.data) {
                let timeCreated = notifications.data[i].created_at.slice(0,10)+'T'+notifications.data[i].created_at.slice(11)+'.000Z'                
                let dateNote = new Date(timeCreated).getTime()/1000
                let dateNow = new Date().getTime()/1000
                let timeDelta = dateNow - dateNote // in seconds 
                
                if(timeDelta < 3600) {
                    notifications.data[i].created_at = `${(timeDelta/60).toFixed(0)} minute${(timeDelta < 60*2 && timeDelta >= 60) ? '':'s'} ago`
                } else if(timeDelta < 86400) {
                    notifications.data[i].created_at = `${(timeDelta/3600).toFixed(0)} hour${(timeDelta < 3600*2) ? '':'s'} ago`
                } else if(timeDelta < 604800) {
                    notifications.data[i].created_at = `${(timeDelta/86400).toFixed(0)} day${(timeDelta < 86400*2) ? '':'s'} ago`
                } else {
                    notifications.data[i].created_at = `${(timeDelta/604800).toFixed(0)} week${(timeDelta < 604800*2) ? '':'s'} ago`
                } 
            }

            await this.setState({
                notifications: [
                    {
                        'created_at': "4 hours ago",
                        'data': {commentId: 1082},
                        'id': 1,
                        'read_on': null,
                        'recipient': {id: 155577, email: "kentonp@drumeo.com"},
                        'type': "lesson comment reply",
                        'updated_at': "2020-09-17 18:39:24",
                    },
                    {
                        'created_at': "4 hours ago",
                        'data': {commentId: 1092},
                        'id': 1,
                        'read_on': null,
                        'recipient': {id: 155577, email: "kentonp@drumeo.com"},
                        'type': "lesson comment reply",
                        'updated_at': "2020-09-17 18:39:24",
                    },
                    {
                        'created_at': "4 hours ago",
                        'data': {commentId: 10982},
                        'id': 1,
                        'read_on': null,
                        'recipient': {id: 155577, email: "kentonp@drumeo.com"},
                        'type': "lesson comment reply",
                        'updated_at': "2020-09-17 18:39:24",
                    },
                ] //notifications.data
            })
            
        } catch (error) {
            console.log('ERROR: ', error);
        }   

        this.setState({isLoading: false})
    };

    changeXP = (num) => {
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

    changeNotificationStatus = async () => {
        const auth = await getToken();

        var attributes = {}
            
        //notify_on_forum_post_like: this.state.notify_on_forum_post_like,
          //  notify_on_forum_post_reply: this.state.notify_on_forum_post_reply,
           // notify_on_lesson_comment_like: this.state.notify_on_lesson_comment_like,
           // notify_on_lesson_comment_reply: this.state.notify_on_lesson_comment_reply,
           // notify_weekly_update: this.state.notify_weekly_update,

        return
        try {
            let response = await fetch(
                `https://app-staging.pianote.com/usora/api/profile/update`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            type: 'user',
                            attributes,
                        },
                    }),
                },
            );

            console.log(await response.json());
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    removeNotification = async (data) => {
        let commentID = data.data.commentId

        for(i in this.state.notifications) {
            console.log(this.state.notifications[i].data.commentId, commentID, i)
            if(this.state.notifications[i].data.commentId == commentID) {
                await this.setState({
                    notifications: [...this.state.notifications.splice(0,i), ...this.state.notifications.splice(i+1)]
                })
            }
        }

        await this.forceUpdate()
        
        let auth = await getToken()
        
        try {
            let response = await fetch(
                `https://app-staging.pianote.com/api/railnotifications/notification/${commentID}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            console.log(commentID)
            console.log(await response.json());
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    render() {
        return (
            <View styles={{flex: 1, alignSelf: 'stretch'}}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                    }}
                >
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
                                            : fullHeight * 0.1,
                                    backgroundColor: colors.thirdBackground,
                                },
                            ]}
                        >
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
                                <View
                                    style={{
                                        position: 'absolute',
                                        right: 20 * factorHorizontal,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate(
                                                'SETTINGS',
                                            );
                                        }}
                                    >
                                        <Settings
                                            height={20 * factorRatio}
                                            width={20 * factorRatio}
                                            fill={colors.pianoteRed}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 20 * factorVertical}} />
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior={'never'}
                            style={{
                                flex: 1,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <View style={{height: 20 * factorVertical}} />
                            <View
                                key={'profilePicture'}
                                style={[
                                    styles.centerContent,
                                    {
                                        backgroundColor: colors.mainBackground,
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
                                                borderColor: colors.pianoteRed,
                                                borderWidth: 1.5 * factorRatio,
                                            },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate(
                                                    'PROFILESETTINGS',
                                                    {data: 'Profile Photo'},
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
                                                uri: this.state.profileImage,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    )}
                                </View>
                                <View style={{height: 10 * factorVertical}} />
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
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 30 * factorRatio,
                                            fontWeight:
                                                Platform.OS == 'ios'
                                                    ? '900'
                                                    : 'bold',
                                            textAlign: 'center',
                                            color: 'white',
                                        }}
                                    >
                                        {this.state.username}
                                    </Text>
                                    <View
                                        style={{height: 10 * factorVertical}}
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
                                        {this.state.memberSince.slice(0, 4)}
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
                                    borderBottomColor: colors.secondBackground,
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
                                            this.setState({showXpRank: true});
                                        }}
                                    >
                                        <View style={{flex: 1}} />
                                        <View>
                                            <Text
                                                style={{
                                                    color: colors.pianoteRed,
                                                    fontSize: 12 * factorRatio,
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                XP
                                            </Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontSize: 24 * factorRatio,
                                                    fontWeight:
                                                        Platform.OS == 'ios'
                                                            ? '800'
                                                            : 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {this.changeXP(this.state.xp)}
                                            </Text>
                                        </View>
                                        <View style={{flex: 1}} />
                                    </TouchableOpacity>
                                    <View style={{flex: 1}} />
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({showXpRank: true});
                                        }}
                                    >
                                        <View style={{flex: 1}} />
                                        <View>
                                            <Text
                                                style={{
                                                    color: colors.pianoteRed,
                                                    fontSize: 12 * factorRatio,
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                RANK
                                            </Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontSize: 24 * factorRatio,
                                                    fontWeight:
                                                        Platform.OS == 'ios'
                                                            ? '800'
                                                            : 'bold',
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
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight:
                                            Platform.OS == 'ios'
                                                ? '800'
                                                : 'bold',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    NOTIFICATIONS
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                            {(!this.state.isLoading && this.state.notifications.length > 0) && (
                                <FlatList
                                    data={this.state.notifications}
                                    keyExtractor={(item, index) => (index)}
                                    renderItem={({item, index}) => (
                                        <View
                                            style={{
                                                height: 90 * factorRatio,
                                                backgroundColor:
                                                    index % 2
                                                        ? colors.mainBackground
                                                        : colors.notificationColor,
                                                flexDirection: 'row',
                                            }}
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
                                                        <View
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    position: 'absolute',
                                                                    bottom: 0,
                                                                    right: 0,
                                                                    height: fullWidth * 0.075,
                                                                    width: fullWidth * 0.075,
                                                                    backgroundColor:
                                                                        index % 2 ? 'orange' : 'blue',
                                                                    borderRadius: 100 * factorRatio,
                                                                    zIndex: 5,
                                                                },
                                                            ]}
                                                        >
                                                            <Chat
                                                                height={fullWidth * 0.05}
                                                                width={fullWidth * 0.05}
                                                                fill={'white'}
                                                            />
                                                        </View>
                                                        <FastImage
                                                            style={{flex: 1, borderRadius: 100}}
                                                            source={{
                                                                uri:
                                                                    'https://facebook.github.io/react-native/img/tiny_logo.png',
                                                            }}
                                                            resizeMode={FastImage.resizeMode.stretch}
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
                                                            fontFamily: 'OpenSans-Regular',
                                                            fontSize: 15 * factorRatio,
                                                            fontWeight:
                                                                Platform.OS == 'ios' ? '700' : 'bold',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontFamily: 'OpenSans-Regular',
                                                                fontSize: 15 * factorRatio,
                                                                fontWeight:
                                                                    Platform.OS == 'ios'
                                                                        ? '700'
                                                                        : 'bold',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            {'NEW - '}
                                                        </Text>
                                                        {item.data.commentId}
                                                        <Text
                                                            style={{
                                                                fontFamily: 'OpenSans-Regular',
                                                                fontSize: 14 * factorRatio,
                                                                fontWeight: '400',
                                                            }}
                                                        >
                                                            {' '}
                                                            replied to your comment.
                                                        </Text>
                                                    </Text>
                                                    <View style={{height: 5 * factorVertical}} />
                                                    <Text
                                                        style={{
                                                            fontFamily: 'OpenSans-Regular',
                                                            fontSize: 13 * factorRatio,
                                                            fontWeight: '400',
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
                                                <View style={{flexDirection: 'row'}}>
                                                    <View style={{flex: 1}} />
                                                    <TouchableOpacity
                                                        onPress={() => {
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
                                        </View>
                                    )}
                                />
                            )}
                            {(!this.state.isLoading && this.state.notifications.length == 0) && (
                            <View>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 15 * factorRatio,
                                        fontWeight:
                                            Platform.OS == 'ios'
                                                ? '900'
                                                : 'bold',
                                        textAlign: 'left',
                                        paddingLeft: fullWidth * 0.05,
                                        color: 'white',
                                    }}
                                >
                                    No New Notifications...
                                </Text>
                            </View>
                            )}
                            {this.state.isLoading && (
                            <View
                                style={[
                                    styles.centerContent,
                                    {
                                        height: fullHeight * 0.215,
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
                            )}
                        </ScrollView>
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
                            removeNotification={(data) => {
                                this.setState({showReplyNotification: false}),
                                this.removeNotification(data)
                            }}
                            hideReplyNotification={() => {
                                this.setState({showReplyNotification: false});
                            }}
                            data={this.state.clickedNotification}
                        />
                    </Modal>
                    <NavigationBar currentPage={'PROFILE'} />
                </View>
            </View>
        );
    }
}
