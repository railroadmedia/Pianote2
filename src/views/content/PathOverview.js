/**
 * PathOverview
 */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native';
import {
    addToMyList,
    likeContent,
    removeFromMyList,
    resetProgress,
    unlikeContent,
} from '../../services/UserActions';
import Modal from 'react-native-modal';
import {Download_V2} from 'RNDownload';
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import StartIcon from '../../components/StartIcon';
import ContinueIcon from '../../components/ContinueIcon';
import ResetIcon from '../../components/ResetIcon';
import NavigationBar from '../../components/NavigationBar';
import VerticalVideoList from '../../components/VerticalVideoList';
import RestartCourse from '../../modals/RestartCourse';
import contentService from '../../services/content.service';
import {NetworkContext} from '../../context/NetworkProvider';
import {ContentModel} from '@musora/models';

let greaterWDim;
export default class PathOverview extends React.Component {
    static contextType = NetworkContext;
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params.data,
            items: this.props.navigation.state.params.items || [],
            isAddedToList: this.props.navigation.state.params.data
                .isAddedToList,
            showInfo: false,
            totalLength: 0,
            isLiked: false,
            likeCount: 0,
            started: false,
            completed: false,
            showRestartCourse: false,
            nextLesson: 0,
            isLoadingAll: true,
            difficulty: 0,
        };
        greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
    }

    componentDidMount() {
        if (!this.state.items.length && this.context.isConnected)
            this.getItems();
    }

    getItems = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        // let response = await contentService.getContent(this.state.data.id);
        contentService.getContent(this.state.data.id).then(r => {
            this.setState({
                likeCount: r.like_count,
                isLiked: r.is_liked_by_current_user,
                isAddedToList: r.is_added_to_primary_playlist,
                totalLength: r.length_in_seconds,
                started: r.started,
                completed: r.completed,
                nextLesson: r.next_lesson.id,
                difficulty: r.fields.find(f => f.key === 'difficulty').value,
                isLoadingAll: false,
                items:
                    r?.lessons?.map(l => {
                        l = new ContentModel(l);
                        let duration = new ContentModel(
                            l.getFieldMulti('video')[0],
                        )?.getField('length_in_seconds');
                        return {
                            title: l.getField('title'),
                            thumbnail: l.getData('thumbnail_url'),
                            type: l.type,
                            id: l.id,
                            mobile_app_url: l.post.mobile_app_url,
                            duration: duration < 60 ? 60 : duration,
                            isAddedToList: l.isAddedToList,
                            isStarted: l.isStarted,
                            isCompleted: l.isCompleted,
                            progress_percent: l.post.progress_percent,
                        };
                    }) || [],
            });
        });
    };

    addToMyList = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        this.setState({isAddedToList: !this.state.isAddedToList});
        let res;
        if (this.state.isAddedToList) {
            res = await removeFromMyList(this.state.data.id);
        } else {
            res = await addToMyList(this.state.data.id);
        }
    };

    toggleLike = () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        if (this.state.isLiked) {
            unlikeContent(this.state.data.id);
        } else {
            likeContent(this.state.data.id);
        }
        this.setState({
            isLiked: !this.state.isLiked,
            likeCount: this.state.isLiked
                ? this.state.likeCount - 1
                : this.state.likeCount + 1,
        });
    };

    onRestartCourse = () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        resetProgress(this.state.data.id);
        this.setState({
            started: false,
            completed: false,
            showRestartCourse: false,
        });
    };

    refresh = () => {
        this.setState({isLoadingAll: true}, () => {
            this.getItems();
        });
    };

    formatDifficulty() {
        const {difficulty} = this.state;
        try {
            let text = '';
            difficulty < 5
                ? (text = 'BEGINNER ' + difficulty)
                : difficulty < 8
                ? (text = 'INTERMEDIATE ' + difficulty)
                : (text = 'ADVANCED ' + difficulty);
            return text;
        } catch (e) {
            return '';
        }
    }

    render() {
        return (
            <View
                style={[
                    styles.container,
                    {backgroundColor: colors.mainBackground},
                ]}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior={'never'}
                    style={{
                        flex: 1,
                        backgroundColor: colors.mainBackground,
                    }}
                    refreshControl={
                        <RefreshControl
                            colors={[colors.pianoteRed]}
                            refreshing={this.state.isLoadingAll}
                            onRefresh={() => this.refresh()}
                        />
                    }
                >
                    <View
                        style={{
                            height: isNotch
                                ? fullHeight * 0.05
                                : fullHeight * 0.03,
                        }}
                    />
                    <View
                        key={'image'}
                        style={[
                            styles.centerContent,
                            {
                                height:
                                    fullHeight * 0.31 +
                                    (isNotch ? fullHeight * 0.035 : 0),
                            },
                        ]}
                    >
                        <FastImage
                            style={{
                                flex: 1,
                                alignSelf: 'stretch',
                                backgroundColor: colors.mainBackground,
                            }}
                            source={{
                                uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,w_${
                                    (greaterWDim >> 0) * 2
                                },ar_16:9,c_fill,g_face/${
                                    this.state.data.thumbnail
                                }`,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View
                            key={'goBackIcon'}
                            style={[
                                styles.centerContent,
                                {
                                    position: 'absolute',
                                    left: 10 * factorHorizontal,
                                    top: isNotch
                                        ? 55 * factorVertical -
                                          fullHeight * 0.05
                                        : 45 * factorVertical -
                                          fullHeight * 0.03,
                                    height: 35 * factorRatio,
                                    width: 35 * factorRatio,
                                    borderRadius: 100,
                                    zIndex: 5,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 100,
                                        backgroundColor: 'black',
                                        opacity: 0.4,
                                    },
                                ]}
                            >
                                <EntypoIcon
                                    name={'chevron-thin-left'}
                                    size={22.5 * factorRatio}
                                    color={'white'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: 100,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    },
                                ]}
                            >
                                <EntypoIcon
                                    name={'chevron-thin-left'}
                                    size={22.5 * factorRatio}
                                    color={'white'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View key={'title'}>
                        <View style={{height: 20 * factorVertical}} />
                        <View style={{flex: 1}}>
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontSize: 24 * factorRatio,
                                }}
                            >
                                {this.state.data.title}
                            </Text>
                            <View style={{height: 10 * factorVertical}} />
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    color: colors.secondBackground,
                                    textAlign: 'center',
                                    fontSize: 14 * factorRatio,
                                }}
                            >
                                {this.state.data.artist.toUpperCase()} |{' '}
                                {this.formatDifficulty()} | {this.state.data.xp}{' '}
                                XP
                            </Text>
                        </View>
                        <View style={{height: 20 * factorVertical}} />
                        <View
                            key={'thumb/Start/Info'}
                            style={{
                                height: onTablet
                                    ? fullHeight * 0.065
                                    : fullHeight * 0.053,
                            }}
                        >
                            <View
                                key={'thumbs'}
                                style={[
                                    styles.centerContent,
                                    {
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        width: fullWidth * 0.25,
                                        height: onTablet
                                            ? fullHeight * 0.065
                                            : fullHeight * 0.053,
                                        zIndex: 3,
                                        elevation: 3,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => this.addToMyList()}
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                    }}
                                >
                                    {!this.state.isAddedToList && (
                                        <AntIcon
                                            name={'plus'}
                                            size={27.5 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    )}
                                    {this.state.isAddedToList && (
                                        <AntIcon
                                            name={'close'}
                                            size={27.5 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    )}
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            color: 'white',
                                            fontSize: 12 * factorRatio,
                                        }}
                                    >
                                        My List
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {this.state.completed ? (
                                <ResetIcon
                                    pxFromTop={0}
                                    buttonHeight={
                                        onTablet
                                            ? fullHeight * 0.065
                                            : fullHeight * 0.053
                                    }
                                    pxFromLeft={(fullWidth * 0.5) / 2}
                                    buttonWidth={fullWidth * 0.5}
                                    pressed={() =>
                                        this.props.navigation.navigate(
                                            'VIDEOPLAYER',
                                            {
                                                id: this.state.data.id,
                                            },
                                        )
                                    }
                                />
                            ) : this.state.started ? (
                                <ContinueIcon
                                    pxFromTop={0}
                                    buttonHeight={
                                        onTablet
                                            ? fullHeight * 0.065
                                            : fullHeight * 0.053
                                    }
                                    pxFromLeft={(fullWidth * 0.5) / 2}
                                    buttonWidth={fullWidth * 0.5}
                                    pressed={() =>
                                        this.props.navigation.navigate(
                                            'VIDEOPLAYER',
                                            {
                                                id: this.state.nextLesson,
                                            },
                                        )
                                    }
                                />
                            ) : (
                                <StartIcon
                                    pxFromTop={0}
                                    buttonHeight={
                                        onTablet
                                            ? fullHeight * 0.065
                                            : fullHeight * 0.053
                                    }
                                    pxFromLeft={(fullWidth * 0.5) / 2}
                                    buttonWidth={fullWidth * 0.5}
                                    pressed={() =>
                                        this.props.navigation.navigate(
                                            'VIDEOPLAYER',
                                            {
                                                id: this.state.nextLesson,
                                            },
                                        )
                                    }
                                />
                            )}
                            <View
                                key={'info'}
                                style={[
                                    styles.centerContent,
                                    {
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        width: fullWidth * 0.25,
                                        height: onTablet
                                            ? fullHeight * 0.065
                                            : fullHeight * 0.053,
                                        zIndex: 3,
                                        elevation: 3,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            showInfo: !this.state.showInfo,
                                        })
                                    }
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                    }}
                                >
                                    <AntIcon
                                        name={
                                            this.state.showInfo
                                                ? 'infocirlce'
                                                : 'infocirlceo'
                                        }
                                        size={22 * factorRatio}
                                        color={colors.pianoteRed}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            color: 'white',
                                            marginTop: 3 * factorRatio,
                                            fontSize: 13 * factorRatio,
                                        }}
                                    >
                                        Info
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {this.state.showInfo && (
                        <View
                            key={'info'}
                            style={{
                                width: fullWidth,
                                paddingLeft: fullWidth * 0.05,
                                paddingRight: fullWidth * 0.05,
                            }}
                        >
                            <View style={{height: 20 * factorVertical}} />
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    marginTop: 5 * factorVertical,
                                    fontSize: 15 * factorRatio,
                                    color: 'white',
                                    textAlign: 'center',
                                }}
                            >
                                {this.state.data.description}
                            </Text>
                            <View key={'containStats'}>
                                <View style={{height: 10 * factorVertical}} />
                                <View
                                    key={'stats'}
                                    style={[
                                        styles.centerContent,
                                        {
                                            flexDirection: 'row',
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 1,
                                                alignItems: 'flex-end',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 17 * factorRatio,
                                                textAlign: 'center',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Bold',
                                                marginTop: 10 * factorVertical,
                                            }}
                                        >
                                            {this.state.items.length}
                                            {`\n`}
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                LESSONS
                                            </Text>
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 1,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 17 * factorRatio,
                                                color: 'white',
                                                fontFamily: 'OpenSans-Bold',
                                                marginTop: 10 * factorVertical,
                                            }}
                                        >
                                            {Math.floor(
                                                this.state.totalLength / 60,
                                            )}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13 * factorRatio,
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10 * factorVertical,
                                            }}
                                        >
                                            MINS
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 1,
                                                alignItems: 'flex-start',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 17 * factorRatio,
                                                textAlign: 'center',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Bold',
                                                marginTop: 10 * factorVertical,
                                            }}
                                        >
                                            {this.state.data.xp}
                                            {`\n`}
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                XP
                                            </Text>
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    key={'buttons'}
                                    style={[
                                        styles.centerContent,
                                        {
                                            flexDirection: 'row',
                                            marginTop: 15 * factorVertical,
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.toggleLike()}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 1,
                                                alignItems: 'flex-end',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 13 * factorRatio,
                                                textAlign: 'center',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10 * factorVertical,
                                            }}
                                        >
                                            <AntIcon
                                                name={
                                                    this.state.isLiked
                                                        ? 'like1'
                                                        : 'like2'
                                                }
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                            {`\n`}
                                            {this.state.likeCount}
                                        </Text>
                                    </TouchableOpacity>
                                    <Download_V2
                                        entity={{
                                            id: this.state.data.id,
                                            overview: contentService.getContent(
                                                this.state.data.id,
                                                true,
                                            ),
                                        }}
                                        styles={{
                                            touchable: {flex: 1},
                                            iconDownloadColor:
                                                colors.pianoteRed,
                                            activityIndicatorColor:
                                                colors.pianoteRed,
                                            animatedProgressBackground:
                                                colors.pianoteRed,
                                            textStatus: {
                                                color: '#ffffff',
                                                fontSize: 13 * factorRatio,
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10 * factorVertical,
                                            },
                                            alert: {
                                                alertTextMessageFontFamily:
                                                    'OpenSans-Regular',
                                                alertTouchableTextDeleteColor:
                                                    'white',
                                                alertTextTitleColor: 'black',
                                                alertTextMessageColor: 'black',
                                                alertTextTitleFontFamily:
                                                    'OpenSans-Bold',
                                                alertTouchableTextCancelColor:
                                                    colors.pianoteRed,
                                                alertTouchableDeleteBackground:
                                                    colors.pianoteRed,
                                                alertBackground: 'white',
                                                alertTouchableTextDeleteFontFamily:
                                                    'OpenSans-Bold',
                                                alertTouchableTextCancelFontFamily:
                                                    'OpenSans-Bold',
                                            },
                                        }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                showRestartCourse: true,
                                            });
                                        }}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 1,
                                                alignItems: 'flex-start',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 13 * factorRatio,
                                                textAlign: 'center',
                                                color: 'white',
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 10 * factorVertical,
                                            }}
                                        >
                                            <MaterialIcon
                                                name={'replay'}
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                            {`\n`}
                                            Restart
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{height: 30 * factorVertical}} />
                            </View>
                        </View>
                    )}
                    <View style={{height: 15 * factorVertical}} />
                    <View
                        key={'verticalVideoList'}
                        style={[
                            styles.centerContent,
                            {
                                minHeight: fullHeight * 0.29 * 0.90625,
                                justifyContent: 'space-around',
                                alignContent: 'space-around',
                                flexDirection: 'row',
                            },
                        ]}
                    >
                        <VerticalVideoList
                            items={this.state.items}
                            isLoading={false}
                            title={'Foundations'} // title for see all page
                            showFilter={false}
                            showType={false}
                            showArtist={false}
                            showLength={true}
                            showSort={false}
                            imageRadius={5 * factorRatio} // radius of image shown
                            containerBorderWidth={0} // border of box
                            containerWidth={fullWidth} // width of list
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
                            navigator={row =>
                                this.props.navigation.navigate('VIDEOPLAYER', {
                                    id: row.id,
                                    parentId: this.state.data.id,
                                })
                            }
                        />
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
                        restartCourse={() => {
                            resetProgress(this.state.data.id);
                        }}
                        hideRestartCourse={() => {
                            this.setState({
                                showRestartCourse: false,
                            });
                        }}
                        type='course'
                        onRestart={this.onRestartCourse}
                    />
                </Modal>
                <NavigationBar currentPage={'LessonsPathOverview'} />
            </View>
        );
    }
}
