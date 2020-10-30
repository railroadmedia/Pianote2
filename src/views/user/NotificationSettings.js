/**
 * NotificationSettings
 */
import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {getUserData} from 'Pianote2/src/services/UserDataAuth.js';
import CustomSwitch from 'Pianote2/src/components/CustomSwitch.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import commonService from '../../services/common.service';
import {NetworkContext} from '../../context/NetworkProvider';

export default class NotificationSettings extends React.Component {
    static navigationOptions = {header: null};
    static contextType = NetworkContext;
    constructor(props) {
        super(props);
        this.state = {
            notifications_summary_frequency_minutes: 0,
            notify_on_forum_followed_thread_reply: false,
            notify_on_forum_post_like: false,
            notify_on_forum_post_reply: false,
            notify_on_lesson_comment_like: false,
            notify_on_lesson_comment_reply: false,
            notify_weekly_update: false,
            isLoading: true,
        };
    }

    UNSAFE_componentWillMount = async () => {
        let userData = await getUserData();

        await this.setState({
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
            isLoading: false,
        });
        this.forceUpdate();
    };

    changeNotificationStatus = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        try {
            const body = {
                data: {
                    type: 'user',
                    attributes: {
                        notifications_summary_frequency_minutes: this.state
                            .notifications_summary_frequency_minutes,
                        notify_on_forum_post_like: this.state
                            .notify_on_forum_post_like,
                        notify_on_forum_post_reply: this.state
                            .notify_on_forum_post_reply,
                        notify_on_lesson_comment_like: this.state
                            .notify_on_lesson_comment_like,
                        notify_on_lesson_comment_reply: this.state
                            .notify_on_lesson_comment_reply,
                        notify_weekly_update: this.state.notify_weekly_update,
                    },
                },
            };
            let response = await commonService.tryCall(
                `${commonService.rootUrl}/api/profile/update`,
                'PATCH',
                body,
            );
            console.log(response);
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
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
                                        fontFamily: 'OpenSans-Regular',
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
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16 * factorRatio,
                                                color: colors.secondBackground,
                                            }}
                                        >
                                            Weekly community updates
                                        </Text>
                                        <View style={{flex: 1}} />
                                    </View>
                                    <View style={{flex: 1}} />
                                    <CustomSwitch
                                        isClicked={
                                            this.state.notify_weekly_update
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
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16 * factorRatio,
                                                color: colors.secondBackground,
                                            }}
                                        >
                                            Comment replies
                                        </Text>
                                        <View style={{flex: 1}} />
                                    </View>
                                    <View style={{flex: 1}} />
                                    <CustomSwitch
                                        isClicked={
                                            this.state
                                                .notify_on_lesson_comment_reply
                                        }
                                        clicked={bool => {
                                            this.changeNotificationStatus(),
                                                this.setState({
                                                    notify_on_lesson_comment_reply: bool,
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
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16 * factorRatio,
                                                color: colors.secondBackground,
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
                                        clicked={bool => {
                                            this.changeNotificationStatus(),
                                                this.setState({
                                                    notify_on_lesson_comment_like: bool,
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
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16 * factorRatio,
                                                color: colors.secondBackground,
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
                                                .notify_on_forum_post_reply
                                        }
                                        clicked={() => {
                                            this.changeNotificationStatus(),
                                                this.setState({
                                                    notify_on_forum_post_reply: bool,
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
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16 * factorRatio,
                                                color: colors.secondBackground,
                                            }}
                                        >
                                            Forum post likes
                                        </Text>
                                        <View style={{flex: 1}} />
                                    </View>
                                    <View style={{flex: 1}} />
                                    <CustomSwitch
                                        isClicked={
                                            this.state.notify_on_forum_post_like
                                        }
                                        clicked={bool => {
                                            this.changeNotificationStatus(),
                                                this.setState({
                                                    notify_on_forum_post_like: bool,
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
                                    borderBottomColor: colors.secondBackground,
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
                                        fontFamily: 'OpenSans-Regular',
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
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16 * factorRatio,
                                                color: colors.secondBackground,
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
                                                    this.state
                                                        .notifications_summary_frequency_minutes ==
                                                    1
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
                                                        notifications_summary_frequency_minutes: 1,
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
                                            {this.state
                                                .notifications_summary_frequency_minutes ==
                                                1 && (
                                                <FontIcon
                                                    name={'check'}
                                                    size={20 * factorRatio}
                                                    color={'white'}
                                                />
                                            )}
                                            {this.state
                                                .notifications_summary_frequency_minutes !==
                                                1 && (
                                                <EntypoIcon
                                                    name={'cross'}
                                                    size={22.5 * factorRatio}
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
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16 * factorRatio,
                                                color: colors.secondBackground,
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
                                                    this.state
                                                        .notifications_summary_frequency_minutes ==
                                                    1440
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
                                                        notifications_summary_frequency_minutes: 1440,
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
                                            {this.state
                                                .notifications_summary_frequency_minutes ==
                                                1440 && (
                                                <FontIcon
                                                    name={'check'}
                                                    size={20 * factorRatio}
                                                    color={'white'}
                                                />
                                            )}
                                            {this.state
                                                .notifications_summary_frequency_minutes !==
                                                1440 && (
                                                <EntypoIcon
                                                    name={'cross'}
                                                    size={22.5 * factorRatio}
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
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16 * factorRatio,
                                                color: colors.secondBackground,
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
                                                    this.state
                                                        .notifications_summary_frequency_minutes ==
                                                        0 ||
                                                    this.state
                                                        .notifications_summary_frequency_minutes ==
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
                                                        notifications_summary_frequency_minutes: 0,
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
                                            {(this.state
                                                .notifications_summary_frequency_minutes ==
                                                0 ||
                                                this.state
                                                    .notifications_summary_frequency_minutes ==
                                                    null) && (
                                                <FontIcon
                                                    name={'check'}
                                                    size={20 * factorRatio}
                                                    color={'white'}
                                                />
                                            )}
                                            {this.state
                                                .notifications_summary_frequency_minutes !==
                                                0 &&
                                                this.state
                                                    .notifications_summary_frequency_minutes !==
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
        );
    }
}
