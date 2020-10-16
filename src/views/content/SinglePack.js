/**
 * SinglePack
 */
import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {
    resetProgress,
    addToMyList,
    removeFromMyList,
    likeContent,
    unlikeContent,
} from 'Pianote2/src/services/UserActions.js';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import {getContentChildById} from '@musora/services';
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

export default class SinglePack extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            packData: null,
            isDisplayingLessons: true,
            videos: [],
            pack: this.props.navigation.state.params.data,
            isAddedToList: this.props.navigation.state.params.data
                .isAddedToList,
            bundleID: null,
            isLoadingAll: true,
            totalLength: 0,
        };
    }

    componentDidMount = async () => {
        await this.getBundle();
        for (i in this.state.videos) {
            this.state.totalLength =
                this.state.totalLength + Number(this.state.videos[i].duration);
        }
        this.state.totalLength = Math.floor(
            this.state.totalLength / 60,
        ).toString();

        this.setState({totalLength: this.state.totalLength});
    };

    getBundle = async () => {
        // get bundles
        const {response, error} = await getContentChildById({
            parentId: this.state.pack.id,
        });
        console.log('RESPONSE: ', response, error);

        const newContent = response.data.data.map(data => {
            return new ContentModel(data);
        });

        // if more than one bundle then display bundles otherwise show videos
        if (this.state.pack.bundle_count > 1) {
            this.setState({isDisplayingLessons: false});
            items = [];
            try {
                for (i in newContent) {
                    if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                        items.push({
                            title: newContent[i].getField('title'),
                            artist: this.getInstructor(newContent[i]),
                            thumbnail: newContent[i].getData('thumbnail_url'),
                            description: newContent[i].getData('description').replace(/(<([^>]+)>)/g, "").replace(/&nbsp;/g, '').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<'),
                            type: newContent[i].post.type,
                            xp: newContent[i].post.xp,
                            id: newContent[i].id,
                            duration: this.getDuration(newContent[i]),
                            like_count: newContent[i].post.like_count,
                            isLiked: newContent[i].isLiked,
                            isAddedToList: newContent[i].isAddedToList,
                            isStarted: newContent[i].isStarted,
                            isCompleted: newContent[i].isCompleted,
                            bundle_count: newContent[i].post.bundle_count,
                            progress_percent:
                                newContent[i].post.progress_percent,
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }

            this.setState({
                videos: [...this.state.videos, ...items],
                isLoadingAll: false,
            });
        } else {
            var bundleID =
                typeof this.state.pack.bundle_count == 'undefined'
                    ? this.state.pack.id
                    : newContent[0].id;
            await this.setState({bundleID});
            await this.getVideos();
        }
    };

    getDuration = newContent => {
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

    getInstructor = newContent => {
        var data = '';
        try {
            for (i in newContent.post.current_lesson.fields) {
                if (
                    newContent.post.current_lesson.fields[i].key == 'instructor'
                ) {
                    var data =
                        newContent.post.current_lesson.fields[i].value.fields;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].key == 'name') {
                            return data[i].value;
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    getVideos = async () => {
        const {response, error} = await getContentChildById({
            parentId: this.state.bundleID,
        });

        console.log('response get videos: ', response, error);

        const newContent = response.data.data.map(data => {
            return new ContentModel(data);
        });

        try {
            items = [];
            for (i in newContent) {
                if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('instructor').fields[0]
                            .value,
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        description: newContent[i].getData('description').replace(/(<([^>]+)>)/g, "").replace(/&nbsp;/g, '').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<'),
                        type: newContent[i].post.type,
                        xp: newContent[i].post.xp,
                        id: newContent[i].id,
                        duration: this.getDuration(newContent[i]),
                        like_count: newContent[i].post.like_count,
                        isLiked: newContent[i].isLiked,
                        isAddedToList: newContent[i].isAddedToList,
                        isStarted: newContent[i].isStarted,
                        isCompleted: newContent[i].isCompleted,
                        bundle_count: newContent[i].post.bundle_count,
                        progress_percent: newContent[i].post.progress_percent,
                    });
                }
            }

            this.setState({
                videos: [...this.state.videos, ...items],
                isLoadingAll: false,
            });
        } catch (error) {
            console.log('error: ', error);
        }
    };

    like = async () => {
        this.state.pack.like_count = this.state.pack.isLiked
            ? this.state.pack.like_count - 1
            : this.state.pack.like_count + 1;
        this.state.pack.isLiked = !this.state.pack.isLiked;

        if (this.state.pack.isLiked) {
            likeContent(this.state.pack.id);
        } else {
            unlikeContent(this.state.pack.id);
        }

        await this.setState({pack: this.state.pack});
    };

    addPackToMyList = async () => {
        this.state.pack.isAddedToList = !this.state.pack.isAddedToList;
        this.setState({pack: this.state.pack});

        if (this.state.pack.isAddedToList) {
            addToMyList(this.state.pack.id);
        } else {
            removeFromMyList(this.state.pack.id);
        }
    };

    navigate = row => {
        if (row.type == 'pack-bundle-lesson') {
            this.props.navigation.navigate('VIDEOPLAYER', {id: row.id});
        } else {
            this.props.navigation.push('SINGLEPACK', {
                data: row,
            });
        }
    };

    render() {
        return (
            <View styles={styles.container}>
                <View
                    key={'contentContainer'}
                    style={{
                        height: fullHeight * 0.90625 - navHeight,
                        width: fullWidth,
                        alignSelf: 'stretch',
                        zIndex: 3,
                        elevation: 3,
                    }}
                >
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
                                source={{uri: this.state.pack.thumbnail}}
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
                                    source={{uri: this.state.pack.logo}}
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
                                        {!this.state.pack.isAddedToList && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.addPackToMyList();
                                                }}
                                                style={{
                                                    alignItems: 'center',
                                                    flex: 1,
                                                }}
                                            >
                                                <AntIcon
                                                    name={'plus'}
                                                    size={30 * factorRatio}
                                                    color={colors.pianoteRed}
                                                />
                                            </TouchableOpacity>
                                        )}
                                        {this.state.pack.isAddedToList && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.addPackToMyList();
                                                }}
                                                style={{
                                                    alignItems: 'center',
                                                    flex: 1,
                                                }}
                                            >
                                                <AntIcon
                                                    name={'close'}
                                                    size={30 * factorRatio}
                                                    color={colors.pianoteRed}
                                                />
                                            </TouchableOpacity>
                                        )}
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                color: 'white',
                                                marginTop: 3 * factorRatio,
                                                fontSize: 12 * factorRatio,
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </View>
                                    <View
                                        key={'start'}
                                        style={{width: fullWidth * 0.5}}
                                    >
                                        <View style={{flex: 1}} />
                                        {!this.state.pack.isStarted && (
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
                                                            id: this.state
                                                                .videos[0].id,
                                                        },
                                                    );
                                                }}
                                            />
                                        )}
                                        {this.state.pack.isStarted && (
                                            <ContinueIcon
                                                pxFromTop={0}
                                                pxFromLeft={0}
                                                buttonWidth={fullWidth * 0.5}
                                                buttonHeight={
                                                    onTablet
                                                        ? fullHeight * 0.065
                                                        : fullHeight * 0.053
                                                }
                                                pressed={() => {}}
                                            />
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
                                        fontFamily: 'OpenSans-Regular',
                                        marginTop: 5 * factorVertical,
                                        fontSize: 15 * factorRatio,
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                >
                                    {this.state.pack.description}
                                </Text>
                                <View key={'containStats'}>
                                    <View
                                        style={{height: 10 * factorVertical}}
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
                                        />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: '700',
                                                    fontSize: 17 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {this.state.videos.length}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                LESSONS
                                            </Text>
                                        </View>
                                        <View
                                            style={{width: 15 * factorRatio}}
                                        />
                                        {this.state.isDisplayingLessons && (
                                            <View
                                                style={[
                                                    styles.centerContent,
                                                    {
                                                        width: 70 * factorRatio,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: '700',
                                                        fontSize:
                                                            17 * factorRatio,
                                                        textAlign: 'left',
                                                        color: 'white',
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            10 * factorVertical,
                                                    }}
                                                >
                                                    {this.state.totalLength}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize:
                                                            13 * factorRatio,
                                                        textAlign: 'left',
                                                        color: 'white',
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            10 * factorVertical,
                                                    }}
                                                >
                                                    MINS
                                                </Text>
                                            </View>
                                        )}
                                        <View
                                            style={{width: 15 * factorRatio}}
                                        />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: '700',
                                                    fontSize: 17 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {this.state.pack.xp}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans-Regular',
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
                                        style={{height: 15 * factorVertical}}
                                    />
                                    <View
                                        key={'buttons'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 0.25,
                                                flexDirection: 'row',
                                            },
                                        ]}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                alignSelf: 'stretch',
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.like();
                                            }}
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <View style={{flex: 1}} />
                                            <AntIcon
                                                name={
                                                    this.state.pack.isLiked
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
                                                    fontFamily: 'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {this.state.pack.like_count}
                                            </Text>
                                        </TouchableOpacity>
                                        <View
                                            style={{width: 15 * factorRatio}}
                                        />
                                        <TouchableOpacity
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
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
                                                    fontFamily: 'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                Download
                                            </Text>
                                        </TouchableOpacity>
                                        <View
                                            style={{width: 15 * factorRatio}}
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
                                                    fontFamily: 'OpenSans-Regular',
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
                                    </View>
                                    <View
                                        style={{height: 30 * factorVertical}}
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
                                //getVideos={() => this.getContent()} // for paging
                                navigator={row => this.navigate(row)}
                            />
                        </View>
                        <View style={{height: 15 * factorVertical}} />
                    </ScrollView>
                </View>
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
                        restartCourse={() => {
                            resetProgress(this.state.pack.id);
                        }}
                        hideRestartCourse={() => {
                            this.setState({
                                showRestartCourse: false,
                            });
                        }}
                        type='pack'
                        onRestart={() => {}}
                    />
                </Modal>
            </View>
        );
    }
}
