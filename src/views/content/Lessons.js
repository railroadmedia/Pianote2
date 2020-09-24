/**
 * Lessons
 */
import React from 'react';
import {ContentModel} from '@musora/models';
import {getContent} from '@musora/services';
import FastImage from 'react-native-fast-image';
import {View, Text, ScrollView, Platform} from 'react-native';
import Modal from 'react-native-modal';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import MoreInfoIcon from 'Pianote2/src/components/MoreInfoIcon.js';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import firebase from 'react-native-firebase';
import foundationsService from '../../services/foundations.service';
import ResetIcon from '../../components/ResetIcon';
import {resetProgress} from 'Pianote2/src/services/UserActions.js';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};

export default class Lessons extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            progressLessons: [],
            newLessons: [],
            allLessons: [],
            currentLesson: [],
            foundationIsStarted: false, // for showing start icon or continue
            foundationIsCompleted: false,
            foundationNextLesson: null,
            showRestartCourse: false,
            page: 0,
            showModalMenu: false, // show navigation menu
            lessonsStarted: true, // for showing continue lessons
            profileImage: '',
            xp: '', // user's XP
            rank: '', // user's level
            isLoadingNew: true, // new lessons
            isLoadingAll: true, // all lessons
            isLoadingProgress: true,
            isPaging: false, // scrolling more
            filtering: false,
            filters: null,
            currentSort: 'Relevance',
        };
    }

    componentWillMount = async () => {
        let data = await AsyncStorage.multiGet([
            'totalXP',
            'rank',
            'profileURI',
        ]);

        await this.setState({
            xp: data[0][1],
            rank: data[1][1],
            profileImage: data[2][1],
            lessonsStarted: false,
        });

        this.getFoundations();
    };

    componentDidMount = async () => {
        this.initializeFirebase();
        this.getProgressLessons();
        this.getNewLessons();
        this.getAllLessons();
    };

    initializeFirebase = async () => {
        await firebase.messaging().requestPermission();
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            const fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // userService.updateUserDetails(null, null, null, fcmToken);
            }
        }
        if (Platform.OS === 'ios') {
            this.removeNotificationListener = firebase
                .notifications()
                .onNotification(notification => {
                    firebase
                        .notifications()
                        .displayNotification(
                            new firebase.notifications.Notification()
                                .setNotificationId(notification._notificationId)
                                .setTitle(notification._title)
                                .setBody(notification._body)
                                .setData(notification._data),
                        );
                });
        } else {
            this.removeNotificationListener = firebase
                .notifications()
                .onNotification(notification => {
                    // Build a channel
                    const channel = new firebase.notifications.Android.Channel(
                        'pianote-channel',
                        'Pianote Channel',
                        firebase.notifications.Android.Importance.Max,
                    ).setDescription('Pianote notification channel');
                    // Create the channel
                    firebase.notifications().android.createChannel(channel);
                    notification.android.setChannelId(channel.channelId);
                    notification.android.setSmallIcon('notifications_logo');
                    notification.android.setLargeIcon(
                        notification._data?.image,
                    );
                    notification.android.setColor(colors.pianoteRed);
                    notification.android.setAutoCancel(true);
                    firebase.notifications().displayNotification(notification);
                });
        }
    };

    getFoundations = async () => {
        let response = await foundationsService.getFoundation(
            'foundations-2019',
        );
        response = new ContentModel(response.data[0]);
        this.setState({
            foundationIsStarted: response.isStarted,
            foundationIsCompleted: response.isCompleted,
            foundationNextLesson: response.post.next_lesson,
        });
    };

    getNewLessons = async () => {
        try {
            const {response, error} = await getContent({
                brand: 'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                //required_user_states: ['started'],
                included_types: ['course'],
            });

            const newContent = response.data.data.map(data => {
                return new ContentModel(data);
            });

            items = [];
            for (i in newContent) {
                if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('instructor').fields[0]
                            .value,
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        type: newContent[i].post.type,
                        description: newContent[i]
                            .getData('description')
                            .replace(/(<([^>]+)>)/gi, ''),
                        xp: newContent[i].post.xp,
                        id: newContent[i].id,
                        like_count: newContent[i].post.like_count,
                        duration: this.getDuration(newContent[i]),
                        isLiked: newContent[i].isLiked,
                        isAddedToList: newContent[i].isAddedToList,
                        isStarted: newContent[i].isStarted,
                        isCompleted: newContent[i].isCompleted,
                        bundle_count: newContent[i].post.bundle_count,
                        progress_percent: newContent[i].post.progress_percent,
                    });
                }
            }

            await this.setState({
                newLessons: [...this.state.newLessons, ...items],
                isLoadingNew: false,
            });
        } catch (error) {
            console.log('new lesson error: ', error);
        }
    };

    getAllLessons = async () => {
        try {
            await this.setState({
                //isLoadingAll: true,
                page: this.state.page + 1,
            });

            // see if importing filters
            try {
                var filters = this.state.filters;
                var filterLevel = false;
                var filterInstructor = false;
                var filterProgress = false;
                var filterTopic = false;
                if (
                    filters.instructors.length !== 0 ||
                    filters.level.length !== 0 ||
                    filters.progress.length !== 0 ||
                    filters.topics.length !== 0
                ) {
                    // if has a filter then send filters to vertical list
                    if (filters.level.length !== 0) {
                        filterLevel = true;
                    }
                    if (filters.instructors.length !== 0) {
                        filterInstructor = true;
                    }
                    if (filters.progress.length !== 0) {
                        filterProgress = true;
                    }
                    if (filters.topics.length !== 0) {
                        filterTopic = true;
                    }
                    this.setState({filters});
                }
            } catch (error) {
                var filters = null;
            }

            const {response, error} = await getContent({
                brand: 'pianote',
                limit: '20',
                page: this.state.page,
                sort: 'published_on', // -published_on //  'newest', ‘oldest’, ‘popularity’, ‘trending’ and ‘relevance’.
                statuses: ['published'],
                included_types: ['course'],
                required_user_states: [],
            });

            const newContent = await response.data.data.map(data => {
                return new ContentModel(data);
            });

            items = [];
            for (i in newContent) {
                if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('instructor').fields[0]
                            .value,
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        type: newContent[i].post.type,
                        description: newContent[i]
                            .getData('description')
                            .replace(/(<([^>]+)>)/gi, ''),
                        xp: newContent[i].post.xp,
                        id: newContent[i].id,
                        like_count: newContent[i].post.like_count,
                        duration: this.getDuration(newContent[i]),
                        isLiked: newContent[i].isLiked,
                        isAddedToList: newContent[i].isAddedToList,
                        isStarted: newContent[i].isStarted,
                        isCompleted: newContent[i].isCompleted,
                        bundle_count: newContent[i].post.bundle_count,
                        progress_percent: newContent[i].post.progress_percent,
                    });
                }
            }

            console.log(items);

            await this.setState({
                allLessons: [...this.state.allLessons, ...items],
                filtering: false,
                isLoadingAll: false,
                isPaging: false,
            });
        } catch (error) {
            console.log('all lessons', error);
        }
    };

    getProgressLessons = async () => {
        try {
            const {response, error} = await getContent({
                brand: 'pianote',
                limit: '15',
                page: 1,
                sort: '-created_on',
                statuses: ['published'],
                required_user_states: ['started'],
                included_types: ['course'],
            });

            console.log(response, error);

            const newContent = response.data.data.map(data => {
                return new ContentModel(data);
            });

            items = [];
            for (i in newContent) {
                if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('instructor').fields[0]
                            .value,
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        type: newContent[i].post.type,
                        description: newContent[i]
                            .getData('description')
                            .replace(/(<([^>]+)>)/gi, ''),
                        xp: newContent[i].post.xp,
                        id: newContent[i].id,
                        like_count: newContent[0].post.like_count,
                        duration: this.getDuration(newContent[i]),
                        isLiked: newContent[i].isLiked,
                        isAddedToList: newContent[i].isAddedToList,
                        isStarted: newContent[i].isStarted,
                        isCompleted: newContent[i].isCompleted,
                        bundle_count: newContent[i].post.bundle_count,
                        progress_percent: newContent[i].post.progress_percent,
                    });
                }
            }

            console.log('progress lessons: ', response, error);

            await this.setState({
                progressLessons: [...this.state.progressLessons, ...items],
                lessonsStarted: items.length > 0 ? true : false,
                isLoadingProgress: false,
            });
        } catch (error) {
            console.log('error progress: ', error);
        }
    };

    onRestartFoundation = async () => {
        resetProgress(this.state.id);
        this.setState({
            foundationIsStarted: false,
            foundationIsCompleted: false,
        });
    };

    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'LESSONS',
            onGoBack: filters => {
                console.log('filters: ', filters);
                this.setState({
                    allLessons: [],
                    filters:
                        filters.instructors.length == 0 &&
                        filters.level.length == 0 &&
                        filters.progress.length == 0 &&
                        filters.topics.length == 0
                            ? null
                            : filters,
                }),
                    this.getAllLessons(),
                    this.forceUpdate();
            },
        });
    };

    getDurationFoundations = newContent =>
        newContent.post.current_lesson.fields
            .find(f => f.key === 'video')
            ?.value.fields.find(f => f.key === 'length_in_seconds')?.value;

    getDuration = newContent => {
        newContent.post.fields.find(f => f.key === 'video')?.length_in_seconds;
    };

    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight * 0.1,
                        width: fullWidth,
                        position: 'absolute',
                        zIndex: 2,
                        elevation: 2,
                        alignSelf: 'stretch',
                    }}
                >
                    <NavMenuHeaders
                        currentPage={'LESSONS'}
                        parentPage={'LESSONS'}
                    />
                </View>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                        zIndex: 1,
                        elevation: 1,
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{
                            flex: 1,
                            backgroundColor: colors.mainBackground,
                        }}
                        onScroll={({nativeEvent}) => {
                            if (
                                isCloseToBottom(nativeEvent) &&
                                this.state.isPaging == false
                            ) {
                                this.setState({isPaging: true}),
                                    this.getAllLessons();
                            }
                        }}
                        scrollEventThrottle={400}
                    >
                        <View
                            key={'backgroundColoring'}
                            style={{
                                backgroundColor: colors.thirdBackground,
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                                elevation: 10,
                            }}
                        />
                        <View
                            key={'header'}
                            style={{
                                height: fullHeight * 0.1,
                                backgroundColor: colors.thirdBackground,
                            }}
                        />
                        <View
                            key={'image'}
                            style={[
                                styles.centerContent,
                                {
                                    height: fullHeight * 0.32,
                                },
                            ]}
                        >
                            <GradientFeature
                                color={'blue'}
                                opacity={1}
                                height={'100%'}
                                borderRadius={0}
                            />
                            <FastImage
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    backgroundColor: colors.mainBackground,
                                }}
                                source={require('Pianote2/src/assets/img/imgs/foundations-background-image.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View
                                key={'pianoteSVG'}
                                style={{
                                    position: 'absolute',
                                    height: '100%',
                                    width: fullWidth,
                                    zIndex: 2,
                                    elevation: 2,
                                }}
                            >
                                <View style={{flex: 0.4}} />
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 1}} />
                                    <Pianote
                                        height={fullHeight * 0.03}
                                        width={fullWidth * 0.35}
                                        fill={'white'}
                                    />
                                    <View style={{flex: 1}} />
                                </View>
                                <Text
                                    key={'foundations'}
                                    style={{
                                        fontSize: 60 * factorRatio,
                                        fontWeight: '700',
                                        color: 'white',
                                        fontFamily: 'RobotoCondensed-Regular',
                                        transform: [{scaleX: 0.7}],
                                        textAlign: 'center',
                                    }}
                                >
                                    FOUNDATIONS
                                </Text>
                                <View style={{flex: 0.6}} />

                                {this.state.foundationIsCompleted ? (
                                    <ResetIcon
                                        pxFromTop={
                                            onTablet
                                                ? fullHeight * 0.32 * 0.725
                                                : fullHeight * 0.305 * 0.725
                                        }
                                        buttonHeight={
                                            onTablet
                                                ? fullHeight * 0.06
                                                : Platform.OS == 'ios'
                                                ? fullHeight * 0.05
                                                : fullHeight * 0.055
                                        }
                                        pxFromLeft={fullWidth * 0.065}
                                        buttonWidth={fullWidth * 0.42}
                                        pressed={() =>
                                            this.setState({
                                                showRestartCourse: true,
                                            })
                                        }
                                    />
                                ) : !this.state.foundationIsStarted ? (
                                    <StartIcon
                                        pxFromTop={
                                            onTablet
                                                ? fullHeight * 0.32 * 0.725
                                                : fullHeight * 0.305 * 0.725
                                        }
                                        buttonHeight={
                                            onTablet
                                                ? fullHeight * 0.06
                                                : Platform.OS == 'ios'
                                                ? fullHeight * 0.05
                                                : fullHeight * 0.055
                                        }
                                        pxFromLeft={fullWidth * 0.065}
                                        buttonWidth={fullWidth * 0.42}
                                        pressed={() =>
                                            this.props.navigation.navigate(
                                                'VIDEOPLAYER',
                                                {
                                                    url: this.state
                                                        .foundationNextLesson
                                                        .mobile_app_url,
                                                },
                                            )
                                        }
                                    />
                                ) : (
                                    <ContinueIcon
                                        pxFromTop={
                                            onTablet
                                                ? fullHeight * 0.32 * 0.725
                                                : fullHeight * 0.305 * 0.725
                                        }
                                        buttonHeight={
                                            onTablet
                                                ? fullHeight * 0.06
                                                : Platform.OS == 'ios'
                                                ? fullHeight * 0.05
                                                : fullHeight * 0.055
                                        }
                                        pxFromLeft={fullWidth * 0.065}
                                        buttonWidth={fullWidth * 0.42}
                                        pressed={() =>
                                            this.props.navigation.navigate(
                                                'VIDEOPLAYER',
                                                {
                                                    url: this.state
                                                        .foundationNextLesson
                                                        .mobile_app_url,
                                                },
                                            )
                                        }
                                    />
                                )}
                                <MoreInfoIcon
                                    pxFromTop={
                                        onTablet
                                            ? fullHeight * 0.32 * 0.725
                                            : fullHeight * 0.305 * 0.725
                                    }
                                    buttonHeight={
                                        onTablet
                                            ? fullHeight * 0.06
                                            : Platform.OS == 'ios'
                                            ? fullHeight * 0.05
                                            : fullHeight * 0.055
                                    }
                                    pxFromRight={fullWidth * 0.065}
                                    buttonWidth={fullWidth * 0.42}
                                    pressed={() => {
                                        this.props.navigation.navigate(
                                            'FOUNDATIONS',
                                        );
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            key={'profile'}
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
                                key={'profile-picture'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignSelf: 'stretch',
                                    },
                                ]}
                            >
                                <View style={{flex: 1}} />
                                <View>
                                    <View style={{flex: 1}} />
                                    <View
                                        style={{
                                            height: fullHeight * 0.075,
                                            width: fullHeight * 0.075,
                                            borderRadius: 100,
                                            backgroundColor:
                                                colors.secondBackground,
                                            alignSelf: 'stretch',
                                            borderWidth: 3 * factorRatio,
                                            borderColor:
                                                colors.secondBackground,
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                alignSelf: 'center',
                                            }}
                                        >
                                            <FastImage
                                                style={{
                                                    flex: 1,
                                                    borderRadius: 100,
                                                    backgroundColor:
                                                        colors.secondBackground,
                                                }}
                                                source={
                                                    require('Pianote2/src/assets/img/imgs/lisa-witt.jpg')
                                                    //    {uri: this.state.profileImage}
                                                }
                                                resizeMode={
                                                    FastImage.resizeMode.cover
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{flex: 1}} />
                            </View>
                            <View
                                key={'XP-rank'}
                                style={{
                                    flex: 3,
                                    flexDirection: 'row',
                                    alignSelf: 'stretch',
                                }}
                            >
                                <View
                                    style={{
                                        flex:
                                            this.state.profileImage !== null &&
                                            this.state.profileImage?.length > 0
                                                ? 0.5
                                                : 0.5,
                                    }}
                                />
                                <View>
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
                                            {this.state.xp?.length > 4
                                                ? (Number(this.state.xp) / 1000)
                                                      .toFixed(1)
                                                      .toString() + 'k'
                                                : this.state.xp?.toString()}
                                        </Text>
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{flex: 1}} />
                                <View>
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
                                </View>
                                <View style={{flex: 1}} />
                            </View>
                        </View>
                        <View>
                            {this.state.lessonsStarted && (
                                <View
                                    key={'progressCourses'}
                                    style={{
                                        minHeight: fullHeight * 0.225,
                                        paddingLeft: fullWidth * 0.035,
                                        backgroundColor: colors.mainBackground,
                                    }}
                                >
                                    <HorizontalVideoList
                                        Title={'CONTINUE'}
                                        seeAll={() =>
                                            this.props.navigation.navigate(
                                                'SEEALL',
                                                {
                                                    title: 'Continue',
                                                    parent: 'Lessons',
                                                },
                                            )
                                        }
                                        showArtist={true}
                                        showType={true}
                                        items={this.state.progressLessons}
                                        isLoading={this.state.isLoadingProgress}
                                        itemWidth={
                                            isNotch
                                                ? fullWidth * 0.6
                                                : onTablet
                                                ? fullWidth * 0.425
                                                : fullWidth * 0.55
                                        }
                                        itemHeight={
                                            isNotch
                                                ? fullHeight * 0.155
                                                : fullHeight * 0.175
                                        }
                                    />
                                </View>
                            )}
                            <View
                                key={'newLessons'}
                                style={{
                                    minHeight: fullHeight * 0.225,
                                    paddingLeft: fullWidth * 0.035,
                                    backgroundColor: colors.mainBackground,
                                }}
                            >
                                <HorizontalVideoList
                                    Title={'NEW LESSONS'}
                                    seeAll={() =>
                                        this.props.navigation.navigate(
                                            'SEEALL',
                                            {
                                                title: 'New Lessons',
                                                parent: 'Lessons',
                                            },
                                        )
                                    }
                                    showArtist={true}
                                    showType={true}
                                    isLoading={this.state.isLoadingNew}
                                    items={this.state.newLessons}
                                    itemWidth={
                                        isNotch
                                            ? fullWidth * 0.6
                                            : onTablet
                                            ? fullWidth * 0.425
                                            : fullWidth * 0.55
                                    }
                                    itemHeight={
                                        isNotch
                                            ? fullHeight * 0.155
                                            : fullHeight * 0.175
                                    }
                                />
                            </View>
                            <View style={{height: 5 * factorRatio}} />
                            {!this.state.filtering && (
                                <VerticalVideoList
                                    items={this.state.allLessons}
                                    isLoading={this.state.isLoadingAll}
                                    title={'ALL LESSONS'} // title for see all page
                                    type={'LESSONS'} // the type of content on page
                                    showFilter={true} //
                                    showType={true} // show course / song by artist name
                                    showArtist={true} // show artist name
                                    showSort={true}
                                    showLength={false}
                                    filters={this.state.filters} // show filter list
                                    imageRadius={5 * factorRatio} // radius of image shown
                                    containerBorderWidth={0} // border of box
                                    containerWidth={fullWidth} // width of list
                                    currentSort={this.state.currentSort} // relevance sort
                                    changeSort={sort => {
                                        this.setState({
                                            currentSort: sort,
                                            allLessons: [],
                                        }),
                                            this.getAllLessons();
                                    }} // change sort and reload videos
                                    filterResults={() => this.filterResults()} // apply from filters page
                                    containerHeight={
                                        onTablet
                                            ? fullHeight * 0.15
                                            : Platform.OS == 'android'
                                            ? fullHeight * 0.115
                                            : fullHeight * 0.0925
                                    } // height per row
                                    imageHeight={
                                        onTablet
                                            ? fullHeight * 0.12
                                            : Platform.OS == 'android'
                                            ? fullHeight * 0.09
                                            : fullHeight * 0.0825
                                    } // image height
                                    imageWidth={fullWidth * 0.26} // image width
                                    outVideos={this.state.outVideos} // if paging and out of videos
                                    getVideos={() => this.getAllLessons()} // for paging
                                    navigator={row =>
                                        row.duration === undefined
                                            ? this.props.navigation.navigate(
                                                  'PATHOVERVIEW',
                                                  {
                                                      data: row,
                                                  },
                                              )
                                            : this.props.navigation.navigate(
                                                  'VIDEOPLAYER',
                                                  {
                                                      id: row.id,
                                                  },
                                              )
                                    }
                                />
                            )}
                        </View>
                    </ScrollView>
                    <Modal
                        key={'restartCourse'}
                        isVisible={this.state.showRestartCourse}
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
                        <RestartCourse
                            hideRestartCourse={() =>
                                this.setState({
                                    showRestartCourse: false,
                                })
                            }
                            type='foundation'
                            onRestart={() => this.onRestartFoundation()}
                        />
                    </Modal>
                    <NavigationBar currentPage={'LESSONS'} />
                </View>
            </View>
        );
    }
}
