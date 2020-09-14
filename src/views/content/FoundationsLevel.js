/**
 * FoundationsLevel
 */
import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import {getContentChildById} from '@musora/services';
import NextVideo from 'Pianote2/src/components/NextVideo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class FoundationsLevel extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            level: this.props.navigation.state.params.level,
            data: this.props.navigation.state.params.data,
            isLiked: this.props.navigation.state.params.data.isLiked,
            isStarted: this.props.navigation.state.params.data.isStarted,
            currentLessonIndex: this.props.navigation.state.params.data
                .current_lesson_index,
            nextLesson: null,
            showRestartCourse: false,
            isLoadingAll: true,
            isStarted: true,
            outVideos: false,
            showInfo: false,
            totalLength: 0,
        };
    }

    componentDidMount = async () => {
        this.getContent();
    };

    getContent = async () => {
        const {response, error} = await getContentChildById({
            parentId: this.state.data.id,
        });

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data);
        });

        try {
            items = [];
            for (i in newContent) {
                if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('instructors'),
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

            for (i in items) {
                this.state.totalLength =
                    this.state.totalLength + Number(items[i].duration);
            }

            this.state.totalLength = Math.floor(
                this.state.totalLength / 60,
            ).toString();

            this.setState({
                items: [...this.state.items, ...items],
                isLoadingAll: false,
                totalLength: this.state.totalLength,
            });
        } catch (error) {
            console.log(error);
        }
    };

    getDuration = (newContent) => {
        var data = 0;
        try {
            for (i in newContent.post.fields) {
                if (newContent.post.fields[i].key == 'video') {
                    var data = newContent.post.fields[i].value.fields;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].key == 'length_in_seconds') {
                            return data[i].value;
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    like = () => {
        // api call like
        this.state.data.like_count = this.state.isLiked
            ? this.state.data.like_count - 1
            : this.state.data.like_count + 1;

        this.setState({
            isLiked: !this.state.isLiked,
            data: this.state.data,
        });
    };

    addToMyList = () => {
        // api call here

        this.state.data.isAddedToList = !this.state.data.isAddedToList;

        this.setState({
            data: this.state.data,
        });
    };

    render() {
        return (
            <View styles={styles.container}>
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
                                    height: fullHeight * 0.33,
                                },
                            ]}
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
                                <View style={{flex: 0.7}} />
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
                                        fontSize: 30 * factorRatio,
                                        fontWeight: '700',
                                        color: 'white',
                                        fontFamily: 'RobotoCondensed-Regular',
                                        transform: [{scaleX: 0.7}],
                                        textAlign: 'center',
                                    }}
                                >
                                    FOUNDATIONS
                                </Text>
                                <View style={{flex: 0.15}} />
                                <Text
                                    key={'level'}
                                    style={{
                                        fontSize: 60 * factorRatio,
                                        fontWeight: 'bold',
                                        color: 'white',
                                        fontFamily: 'RobotoCondensed-Regular',
                                        textAlign: 'center',
                                    }}
                                >
                                    LEVEL {this.state.level}
                                </Text>
                                <View style={{flex: 0.3}} />
                                <View
                                    key={'startIcon'}
                                    style={{
                                        height: onTablet
                                            ? fullHeight * 0.065
                                            : fullHeight * 0.05,
                                    }}
                                >
                                    <View
                                        key={'mylist'}
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
                                            onPress={() => {
                                                this.addToMyList();
                                            }}
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                            }}
                                        >
                                            {!this.state.data.isAddedToList && (
                                                <AntIcon
                                                    name={'plus'}
                                                    size={27.5 * factorRatio}
                                                    color={colors.pianoteRed}
                                                />
                                            )}
                                            {this.state.data.isAddedToList && (
                                                <AntIcon
                                                    name={'close'}
                                                    size={27.5 * factorRatio}
                                                    color={colors.pianoteRed}
                                                />
                                            )}
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    color: 'white',
                                                    fontSize: 12 * factorRatio,
                                                }}
                                            >
                                                My List
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {!this.state.isStarted && (
                                        <ContinueIcon
                                            pxFromTop={0}
                                            buttonHeight={
                                                onTablet
                                                    ? fullHeight * 0.065
                                                    : fullHeight * 0.05
                                            }
                                            pxFromLeft={(fullWidth * 0.5) / 2}
                                            buttonWidth={fullWidth * 0.5}
                                            pressed={() => {
                                                this.props.navigation.navigate(
                                                    'PATHOVERVIEW',
                                                    {
                                                        data: this.state
                                                            .items[0],
                                                        items: this.state.items,
                                                        level: this.props
                                                            .navigation.state
                                                            .params.level,
                                                    },
                                                );
                                            }}
                                        />
                                    )}
                                    {this.state.isStarted && (
                                        <StartIcon
                                            pxFromTop={0}
                                            buttonHeight={
                                                onTablet
                                                    ? fullHeight * 0.065
                                                    : fullHeight * 0.05
                                            }
                                            pxFromLeft={(fullWidth * 0.5) / 2}
                                            buttonWidth={fullWidth * 0.5}
                                            pressed={() => {
                                                this.props.navigation.navigate(
                                                    'PATHOVERVIEW',
                                                    {
                                                        data: this.state
                                                            .items[0],
                                                        items: this.state.items,
                                                        level: this.props
                                                            .navigation.state
                                                            .params.level,
                                                    },
                                                );
                                            }}
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
                                                    fontFamily:
                                                        'OpenSans-Regular',
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
                                <View style={{height: 20 * factorVertical}} />
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
                                <View style={{height: 15 * factorVertical}} />
                                <TouchableOpacity onPress={() => {}} style={{}}>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 15 * factorRatio,
                                            color: colors.pianoteRed,
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <EntypoIcon
                                            name={'controller-play'}
                                            color={colors.pianoteRed}
                                            size={15 * factorRatio}
                                        />{' '}
                                        WATCH THE TRAILER
                                    </Text>
                                </TouchableOpacity>
                                <View style={{height: 20 * factorVertical}} />
                            </View>
                        )}
                        <VerticalVideoList
                            items={this.state.items}
                            isLoading={this.state.isLoadingAll}
                            showFilter={false} // shows filters button
                            showType={false} // show course / song by artist name
                            showArtist={false} // show artist name
                            showLength={false} // duration of song
                            showSort={false}
                            showLines={true}
                            imageRadius={5 * factorRatio} // radius of image shown
                            containerBorderWidth={0} // border of box
                            containerWidth={fullWidth} // width of list
                            containerHeight={
                                onTablet
                                    ? fullHeight * 0.15
                                    : Platform.OS == 'android'
                                    ? fullHeight * 0.115
                                    : fullHeight * 0.11
                            } // height per row
                            imageHeight={
                                onTablet
                                    ? fullHeight * 0.12
                                    : Platform.OS == 'android'
                                    ? fullHeight * 0.09
                                    : fullHeight * 0.0825
                            } // image height
                            imageWidth={fullWidth * 0.3} // image width
                            navigator={(row) => {
                                this.props.navigation.navigate('PATHOVERVIEW', {
                                    data: row,
                                    items: this.state.items,
                                    level: this.props.navigation.state.params
                                        .level,
                                });
                            }}
                        />
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
                            hideRestartCourse={() => {
                                this.setState({
                                    showRestartCourse: false,
                                });
                            }}
                            type="level"
                            onRestart={() => {}}
                        />
                    </Modal>
                    {this.state.currentLessonIndex + 1 !==
                        this.state.items.length && (
                        <View>
                            {!this.state.isLoadingAll && (
                                <NextVideo
                                    item={
                                        this.state.items[
                                            this.state.currentLessonIndex
                                        ]
                                    }
                                    currentCompletion={
                                        this.state.items[
                                            this.state.currentLessonIndex
                                        ].progress_percent
                                    }
                                />
                            )}
                        </View>
                    )}
                    <NavigationBar currentPage={''} />
                </View>
            </View>
        );
    }
}
