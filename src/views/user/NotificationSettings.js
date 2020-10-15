/**
 * NotificationSettings
 */
import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {getToken} from 'Pianote2/src/services/UserDataAuth.js';
import AsyncStorage from '@react-native-community/async-storage';
import CustomSwitch from 'Pianote2/src/components/CustomSwitch.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import commonService from '../../services/common.service';

export default class NotificationSettings extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            weeklyCommunityUpdatesClicked: null,
            commentRepliesClicked: null,
            commentLikesClicked: null,
            forumPostRepliesClicked: null,
            forumPostLikesClicked: null,
            frequency: null,
        };
    }

    componentWillMount = async () => {
        // get notification status
        let notificationData = await AsyncStorage.multiGet([
            'weeklyCommunityUpdatesClicked',
            'commentRepliesClicked',
            'commentLikesClicked',
            'forumPostRepliesClicked',
            'forumPostLikesClicked',
            'notifications_summary_frequency_minutes',
        ]);

        await this.setState({
            weeklyCommunityUpdatesClicked: Boolean(notificationData[0][1]),
            commentRepliesClicked: Boolean(notificationData[1][1]),
            commentLikesClicked: Boolean(notificationData[2][1]),
            forumPostRepliesClicked: Boolean(notificationData[3][1]),
            forumPostLikesClicked: Boolean(notificationData[4][1]),
            frequency: notificationData[5][1],
        });

        await this.setState({isLoading: false});
        this.forceUpdate();
    };

    componentDidMount = async () => {
        await this.setState({
            weeklyCommunityUpdatesClicked: userData.notify_weekly_update,
            commentRepliesClicked: userData.notify_on_lesson_comment_reply,
            commentLikesClicked: userData.notify_on_lesson_comment_like,
            forumPostRepliesClicked: userData.notify_on_forum_post_reply,
            forumPostLikesClicked: userData.notify_on_forum_post_like,
            frequency: userData.notify_weekly_update,
        });

        this.forceUpdate();
    };

    changeNotificationStatus = async () => {
        const auth = await getToken();

        try {
            let response = await fetch(
                `${commonService.rootUrl}/api/profile/update`,
                {
                    method: 'POST',
                    headers: {Authorization: `Bearer ${auth.token}`},
                    data: {
                        notify_weekly_update: this.state
                            .weeklyCommunityUpdatesClicked,
                        notify_on_lesson_comment_reply: this.state
                            .commentRepliesClicked,
                        notify_on_lesson_comment_like: this.state
                            .commentLikesClicked,
                        notify_on_forum_post_reply: this.state
                            .forumPostRepliesClicked,
                        notify_on_forum_post_like: this.state
                            .forumPostLikesClicked,
                        notify_weekly_update: this.state.frequency,
                    },
                },
            );
            console.log(await response.json());
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        return (
            <View styles={{flex: 1, alignSelf: 'stretch'}}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                        backgroundColor: colors.mainBackground,
                    }}
                >
                    <View key={'contentContainer'} style={{flex: 1}}>
                        <View
                            key={'buffer'}
                            style={{
                                height: isNotch ? 15 * factorVertical : 0,
                            }}
                        ></View>
                        <View
                            key={'header'}
                            style={[
                                styles.centerContent,
                                {
                                    flex: 0.1,
                                },
                            ]}
                        >
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
                                                  currentlyView:
                                                      'Profile Settings',
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
                                    fontFamily: 'OpenSans',
                                    color: colors.secondBackground,
                                }}
                            >
                                Notification Settings
                            </Text>
                            <View style={{flex: 0.33}} />
                        </View>
                        {this.state.isLoading && (
                            <View style={{flex: 0.95}}>
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            height: fullHeight * 0.415,
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
                            </View>
                        )}
                        {!this.state.isLoading && (
                            <View style={{flex: 0.95}}>
                                <View
                                    key={'notifcationTypes'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans',
                                            fontSize: 16 * factorRatio,
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        Notification Types
                                    </Text>
                                </View>
                                <View
                                    key={'weeklyCommunityUpdates'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View style={{flexDirection: 'row'}}>
                                        <View>
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans',
                                                    fontSize: 16 * factorRatio,
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                Weekly community updates
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View style={{flex: 1}} />
                                        <CustomSwitch
                                            isClicked={
                                                this.state
                                                    .weeklyCommunityUpdatesClicked
                                            }
                                            clicked={bool => {
                                                this.changeNotificationStatus(),
                                                    this.setState({
                                                        weeklyCommunityUpdatesClicked: bool,
                                                    });
                                            }}
                                        />
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    key={'commentReplies'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View style={{flexDirection: 'row'}}>
                                        <View>
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans',
                                                    fontSize: 16 * factorRatio,
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                Comment replies
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View style={{flex: 1}} />
                                        <CustomSwitch
                                            isClicked={
                                                this.state.commentRepliesClicked
                                            }
                                            clicked={() => {
                                                this.changeNotificationStatus(),
                                                    this.setState({
                                                        commentRepliesClicked: this
                                                            .state
                                                            .commentRepliesClicked,
                                                    });
                                            }}
                                        />
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    key={'commentLikes'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View style={{flexDirection: 'row'}}>
                                        <View>
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans',
                                                    fontSize: 16 * factorRatio,
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                Comment likes
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View style={{flex: 1}} />
                                        <CustomSwitch
                                            isClicked={
                                                this.state.commentLikesClicked
                                            }
                                            clicked={() => {
                                                this.changeNotificationStatus(),
                                                    this.setState({
                                                        commentLikesClicked: this
                                                            .state
                                                            .commentLikesClicked,
                                                    });
                                            }}
                                        />
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    key={'forumPostReplies'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View style={{flexDirection: 'row'}}>
                                        <View>
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans',
                                                    fontSize: 16 * factorRatio,
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                Forum post replies
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View style={{flex: 1}} />
                                        <CustomSwitch
                                            isClicked={
                                                this.state
                                                    .forumPostRepliesClicked
                                            }
                                            clicked={() => {
                                                this.changeNotificationStatus(),
                                                    this.setState({
                                                        forumPostRepliesClicked: this
                                                            .state
                                                            .forumPostRepliesClicked,
                                                    });
                                            }}
                                        />
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    key={'forumPostLikes'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View style={{flexDirection: 'row'}}>
                                        <View>
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans',
                                                    fontSize: 16 * factorRatio,
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                Forum post likes
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View style={{flex: 1}} />
                                        <CustomSwitch
                                            isClicked={
                                                this.state.forumPostLikesClicked
                                            }
                                            clicked={() => {
                                                this.changeNotificationStatus(),
                                                    this.setState({
                                                        forumPostLikesClicked: this
                                                            .state
                                                            .forumPostLikesClicked,
                                                    });
                                            }}
                                        />
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    key={'border'}
                                    style={{
                                        height: 25 * factorVertical,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                    }}
                                />
                                <View style={{height: 15 * factorVertical}} />
                                <View
                                    key={'emailNotificationFrequency'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans',
                                            fontSize: 16 * factorRatio,
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        Email Notification Frequency
                                    </Text>
                                </View>
                                <View
                                    key={'immediate'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View style={{flexDirection: 'row'}}>
                                        <View>
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans',
                                                    fontSize: 16 * factorRatio,
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                Immediate
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View style={{flex: 1}} />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    height: fullHeight * 0.0375,
                                                    width: fullHeight * 0.0375,
                                                    backgroundColor:
                                                        this.state.frequency ==
                                                        'Immediate'
                                                            ? '#fb1b2f'
                                                            : colors.secondBackground,
                                                    borderRadius: 100,
                                                },
                                            ]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.changeNotificationStatus(),
                                                        this.setState({
                                                            frequency:
                                                                'Immediate',
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
                                                {this.state.frequency ==
                                                    'Immediate' && (
                                                    <FontIcon
                                                        name={'check'}
                                                        size={20 * factorRatio}
                                                        color={'white'}
                                                    />
                                                )}
                                                {this.state.frequency !==
                                                    'Immediate' && (
                                                    <EntypoIcon
                                                        name={'cross'}
                                                        size={
                                                            22.5 * factorRatio
                                                        }
                                                        color={'white'}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    key={'OncePerDay'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View style={{flexDirection: 'row'}}>
                                        <View>
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans',
                                                    fontSize: 16 * factorRatio,
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                Once per day
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View style={{flex: 1}} />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    height: fullHeight * 0.0375,
                                                    width: fullHeight * 0.0375,
                                                    backgroundColor:
                                                        this.state.frequency ==
                                                        'OncePerDay'
                                                            ? '#fb1b2f'
                                                            : colors.secondBackground,
                                                    borderRadius: 100,
                                                },
                                            ]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.changeNotificationStatus(),
                                                        this.setState({
                                                            frequency:
                                                                'OncePerDay',
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
                                                {this.state.frequency ==
                                                    'OncePerDay' && (
                                                    <FontIcon
                                                        name={'check'}
                                                        size={20 * factorRatio}
                                                        color={'white'}
                                                    />
                                                )}
                                                {this.state.frequency !==
                                                    'OncePerDay' && (
                                                    <EntypoIcon
                                                        name={'cross'}
                                                        size={
                                                            22.5 * factorRatio
                                                        }
                                                        color={'white'}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    key={'never'}
                                    style={{
                                        height: fullHeight * 0.065,
                                        paddingLeft: fullWidth * 0.045,
                                        paddingRight: fullWidth * 0.045,
                                        width: fullWidth,
                                        justifyContent: 'center',
                                        fontSize: 18 * factorRatio,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View style={{flexDirection: 'row'}}>
                                        <View>
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontFamily: 'OpenSans',
                                                    fontSize: 16 * factorRatio,
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                Never
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View style={{flex: 1}} />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    height: fullHeight * 0.0375,
                                                    width: fullHeight * 0.0375,
                                                    backgroundColor:
                                                        this.state.frequency ==
                                                        null
                                                            ? '#fb1b2f'
                                                            : colors.secondBackground,
                                                    borderRadius: 100,
                                                },
                                            ]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.changeNotificationStatus(),
                                                        this.setState({
                                                            frequency: null,
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
                                                {this.state.frequency ==
                                                    null && (
                                                    <FontIcon
                                                        name={'check'}
                                                        size={20 * factorRatio}
                                                        color={'white'}
                                                    />
                                                )}
                                                {this.state.frequency !==
                                                    null && (
                                                    <EntypoIcon
                                                        name={'cross'}
                                                        size={
                                                            22.5 * factorRatio
                                                        }
                                                        color={'white'}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                            </View>
                        )}
                    </View>
                    <NavigationBar currentPage={'PROFILE'} />
                </View>
            </View>
        );
    }
}
