/**
 * SinglePack
 */
import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import packsService from '../../services/packs.service';
import {ActivityIndicator} from 'react-native';
import {
    likeContent,
    unlikeContent,
    addToMyList,
    removeFromMyList,
    resetProgress,
} from 'Pianote2/src/services/UserActions.js';

export default class SinglePack extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            isDisplayingLessons: true,
            videos: [],
            url: this.props.navigation.state.params.url,
            isAddedToList: false,
            description: '',
            thumbnail: '',
            logo: '',
            xp: 0,
            isLiked: false,
            likeCount: 0,
            isStarted: false,
            isCompleted: false,
            nextLessonUrl: '',
            isLoadingAll: true,
        };
    }

    componentDidMount = () => {
        this.getBundle();
    };

    getBundle = async () => {
        // get bundles
        const response = await packsService.getPack(this.state.url);
        const newContent = new ContentModel(response);
        const lessons = newContent.post.lessons.map(rl => {
            return new ContentModel(rl);
        });
        // if more than one bundle then display bundles otherwise show videos
        if (newContent.post.bundle_count > 1)
            this.setState({isDisplayingLessons: false});
        items = [];
        try {
            for (i in lessons) {
                items.push({
                    title: lessons[i].getField('title'),
                    thumbnail: lessons[i].getData('thumbnail_url'),
                    id: lessons[i].id,
                    duration: lessons[i].length_in_seconds || 0,
                    isAddedToList: lessons[i].isAddedToList,
                    isStarted: lessons[i].isStarted,
                    isCompleted: lessons[i].isCompleted,
                    progress_percent: lessons[i].post.progress_percent,
                    mobile_app_url: lessons[i].post.mobile_app_url,
                });
            }
        } catch (error) {
            console.log(error);
        }

        this.setState({
            id: newContent.id,
            isAddedToList: newContent.isAddedToList,
            thumbnail: newContent.post.thumbnail_url,
            logo: newContent.post.pack_logo,
            description: newContent.getData('description'),
            isStarted: newContent.isStarted,
            isCompleted: newContent.isCompleted,
            xp: newContent.xp,
            isLiked: newContent.post.is_liked_by_current_user,
            likeCount: parseInt(newContent.likeCount),
            videos: [...this.state.videos, ...items],
            nextLessonUrl: newContent.post.next_lesson_mobile_app_url,
            isLoadingAll: false,
        });
    };

    async resetProgress() {
        await resetProgress(this.state.id);
        this.setState({isLoadingAll: true}, () => this.getBundle());
    }

    like = () => {
        if (this.state.isLiked) {
            unlikeContent(this.state.id);
        } else {
            likeContent(this.state.id);
        }
        this.setState({
            isLiked: !this.state.isLiked,
            likeCount: this.state.isLiked
                ? this.state.likeCount - 1
                : this.state.likeCount + 1,
        });
    };

    toggleMyList = () => {
        if (this.state.isAddedToList) {
            removeFromMyList(this.state.id);
        } else {
            addToMyList(this.state.id);
        }
        this.setState({
            isAddedToList: !this.state.isAddedToList,
        });
    };

    navigate = row => {
        if (this.state.isDisplayingLessons) {
            this.props.navigation.navigate('VIDEOPLAYER', {
                url: row.mobile_app_url,
            });
        } else {
            this.props.navigation.push('SINGLEPACK', {
                url: row.mobile_app_url,
            });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                {!this.state.isLoadingAll ? (
                    <ScrollView
                        style={{backgroundColor: colors.mainBackground}}
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                    >
                        <View
                            style={{
                                height: isNotch
                                    ? fullHeight * 0.05
                                    : fullHeight * 0.03,
                            }}
                        />
                        <View
                            key={'imageContainer'}
                            style={{
                                height: fullHeight * 0.5,
                                zIndex: 3,
                                elevation: 3,
                            }}
                        >
                            <View
                                key={'goBackIcon'}
                                style={[
                                    styles.centerContent,
                                    {
                                        position: 'absolute',
                                        left: 7.5 * factorHorizontal,
                                        top: isNotch
                                            ? 10 * factorVertical
                                            : 10 * factorVertical,
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
                            <GradientFeature
                                color={'blue'}
                                opacity={1}
                                height={'100%'}
                                borderRadius={0}
                            />
                            <FastImage
                                style={{flex: 1}}
                                source={{uri: this.state.thumbnail}}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View
                                key={'logo'}
                                style={{
                                    position: 'absolute',
                                    bottom:
                                        30 * factorRatio +
                                        (onTablet
                                            ? fullHeight * 0.065
                                            : fullHeight * 0.053),
                                    left: 0,
                                    width: fullWidth,
                                    zIndex: 10,
                                    elevation: 10,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 1}} />
                                <FastImage
                                    style={{
                                        height: 100 * factorRatio,
                                        width: '80%',
                                    }}
                                    source={{uri: this.state.logo}}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                <View style={{flex: 1}} />
                            </View>
                            <View
                                key={'buttons'}
                                style={{
                                    position: 'absolute',
                                    bottom: 10 * factorRatio,
                                    left: 0,
                                    width: fullWidth,
                                    zIndex: 10,
                                    elevation: 10,
                                }}
                            >
                                <View
                                    key={'buttonRow'}
                                    style={{flexDirection: 'row'}}
                                >
                                    <View
                                        key={'plusButton'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 1,
                                            },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.toggleMyList();
                                            }}
                                            style={{
                                                alignItems: 'center',
                                                flex: 1,
                                            }}
                                        >
                                            <AntIcon
                                                name={
                                                    this.state.isAddedToList
                                                        ? 'close'
                                                        : 'plus'
                                                }
                                                size={30 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                        </TouchableOpacity>

                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans',
                                                color: 'white',
                                                marginTop: 3 * factorRatio,
                                                fontSize: 12 * factorRatio,
                                            }}
                                        >
                                            {this.state.isAddedToList
                                                ? 'Added'
                                                : 'My List'}
                                        </Text>
                                    </View>
                                    <View
                                        key={'start'}
                                        style={{width: fullWidth * 0.5}}
                                    >
                                        <View style={{flex: 1}} />
                                        {this.state.isCompleted ? (
                                            <ResetIcon
                                                pxFromTop={0}
                                                pxFromLeft={0}
                                                buttonWidth={fullWidth * 0.5}
                                                buttonHeight={
                                                    onTablet
                                                        ? fullHeight * 0.065
                                                        : fullHeight * 0.053
                                                }
                                                pressed={() =>
                                                    this.setState({
                                                        showRestartCourse: true,
                                                    })
                                                }
                                            />
                                        ) : !this.state.isStarted ? (
                                            <StartIcon
                                                pxFromTop={0}
                                                pxFromLeft={0}
                                                buttonWidth={fullWidth * 0.5}
                                                buttonHeight={
                                                    onTablet
                                                        ? fullHeight * 0.065
                                                        : fullHeight * 0.053
                                                }
                                                pressed={() => {
                                                    this.props.navigation.navigate(
                                                        'VIDEOPLAYER',
                                                        {
                                                            url: this.state
                                                                .nextLessonUrl,
                                                        },
                                                    );
                                                }}
                                            />
                                        ) : (
                                            this.state.isStarted && (
                                                <ContinueIcon
                                                    pxFromTop={0}
                                                    pxFromLeft={0}
                                                    buttonWidth={
                                                        fullWidth * 0.5
                                                    }
                                                    buttonHeight={
                                                        onTablet
                                                            ? fullHeight * 0.065
                                                            : fullHeight * 0.053
                                                    }
                                                    pressed={() =>
                                                        this.props.navigation.navigate(
                                                            'VIDEOPLAYER',
                                                            {
                                                                url: this.state
                                                                    .nextLessonUrl,
                                                            },
                                                        )
                                                    }
                                                />
                                            )
                                        )}
                                        <View style={{flex: 1}} />
                                    </View>
                                    <View
                                        key={'infoButton'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 1,
                                            },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    showInfo: !this.state
                                                        .showInfo,
                                                });
                                            }}
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
                                                    fontFamily: 'OpenSans',
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
                        </View>
                        {this.state.showInfo && (
                            <View
                                key={'info'}
                                style={{
                                    width: fullWidth,
                                    backgroundColor: colors.mainBackground,
                                    paddingLeft: fullWidth * 0.05,
                                    paddingRight: fullWidth * 0.05,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        marginTop: 5 * factorVertical,
                                        fontSize: 15 * factorRatio,
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                >
                                    {this.state.description}
                                </Text>
                                <View key={'containStats'}>
                                    <View
                                        style={{
                                            height: 10 * factorVertical,
                                        }}
                                    />
                                    <View
                                        key={'stats'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 0.22,
                                                flexDirection: 'row',
                                            },
                                        ]}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                alignSelf: 'stretch',
                                            }}
                                        >
                                            <Text>LESSONS</Text>
                                        </View>
                                    </View>
                                    <View style={{width: 15 * factorRatio}} />
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {width: 70 * factorRatio},
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                width: 15 * factorRatio,
                                            }}
                                        />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {width: 70 * factorRatio},
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: '700',
                                                    fontSize: 17 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {this.state.xp}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                XP
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignSelf: 'stretch',
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            height: 15 * factorVertical,
                                        }}
                                    />
                                    <View
                                        style={{
                                            flex: 1,
                                            alignSelf: 'stretch',
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={[
                                            styles.centerContent,
                                            {width: 70 * factorRatio},
                                        ]}
                                    >
                                        <View style={{flex: 1}} />
                                        <MaterialIcon
                                            name={'arrow-collapse-down'}
                                            size={27.5 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <TouchableOpacity
                                            onPress={() => this.like()}
                                            style={[
                                                styles.centerContent,
                                                {width: 70 * factorRatio},
                                            ]}
                                        >
                                            <View style={{flex: 1}} />
                                            <AntIcon
                                                name={
                                                    this.state.isLiked
                                                        ? 'like1'
                                                        : 'like2'
                                                }
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {this.state.likeCount}
                                            </Text>
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                                width: 15 * factorRatio,
                                            }}
                                        />
                                        <TouchableOpacity
                                            style={[
                                                styles.centerContent,
                                                {width: 70 * factorRatio},
                                            ]}
                                        >
                                            <View style={{flex: 1}} />
                                            <MaterialIcon
                                                name={'arrow-collapse-down'}
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                Download
                                            </Text>
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                                width: 15 * factorRatio,
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
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <View style={{flex: 1}} />
                                            <MaterialIcon
                                                name={'replay'}
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                Restart
                                            </Text>
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignSelf: 'stretch',
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            height: 30 * factorVertical,
                                        }}
                                    />
                                </View>
                            </View>
                        )}
                        <View style={{height: 5 * factorVertical}} />
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
                                items={this.state.videos}
                                title={'Packs'} // title for see all page
                                type={'PACK'} // the type of content on page
                                isLoading={this.state.isLoadingAll}
                                showFilter={false} //
                                showType={false} // show course / song by artist name
                                showArtist={
                                    this.state.isDisplayingLessons
                                        ? false
                                        : true
                                } // show artist name
                                showLength={
                                    this.state.isDisplayingLessons
                                        ? true
                                        : false
                                }
                                showLines={!this.state.isDisplayingLessons}
                                imageRadius={5 * factorRatio} // radius of image shown
                                containerBorderWidth={0} // border of box
                                containerWidth={fullWidth} // width of list
                                containerHeight={
                                    onTablet
                                        ? fullHeight * 0.15
                                        : Platform.OS == 'android'
                                        ? fullHeight * 0.115
                                        : fullHeight * 0.095
                                } // height per row
                                imageHeight={
                                    onTablet
                                        ? fullHeight * 0.12
                                        : Platform.OS == 'android'
                                        ? fullHeight * 0.095
                                        : fullHeight * 0.0825
                                } // image height
                                imageWidth={fullWidth * 0.26} // image width
                                outVideos={this.state.outVideos} // if paging and out of videos
                                navigator={row => this.navigate(row)}
                            />
                        </View>
                        <View style={{height: 15 * factorVertical}} />
                    </ScrollView>
                ) : (
                    <View
                        style={[
                            styles.centerContent,
                            {
                                height: fullHeight * 0.4,
                                width: '100%',
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

                <NavigationBar currentPage={'SINGLEPACK'} />
                <Modal
                    key={'navMenu'}
                    isVisible={this.state.showModalMenu}
                    style={{
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={false}
                >
                    <NavigationMenu
                        onClose={e => {
                            this.setState({showModalMenu: e}),
                                this.forceUpdate();
                        }}
                        parentPage={this.state.parentPage}
                        menu={this.state.menu}
                    />
                </Modal>
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
                        hideRestartCourse={() => {
                            this.setState({
                                showRestartCourse: false,
                            });
                        }}
                        type='pack'
                        onRestart={() => this.resetProgress()}
                    />
                </Modal>
            </View>
        );
    }
}
