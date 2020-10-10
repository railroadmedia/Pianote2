/**
 * StudentFocusShow
 */
import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import {getAllContent} from '../../services/GetContent';

const packDict = {
    Bootcamps: require('Pianote2/src/assets/img/imgs/bootcamps.jpg'),
    'Q&A': require('Pianote2/src/assets/img/imgs/questionAnswer.jpg'),
    'Quick Tips': require('Pianote2/src/assets/img/imgs/quickTips.jpg'),
    'Student Review': require('Pianote2/src/assets/img/imgs/studentReview.jpg'),
};

const typeDict = {
    Bootcamps: 'boot-camps',
    'Q&A': 'question-and-answer',
    'Quick Tips': 'quick-tips',
    'Student Review': 'student-review',
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};

export default class StudentFocusShow extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            pack: this.props.navigation.state.params.pack,
            allLessons: [],
            currentSort: 'newest',
            page: 1,
            outVideos: false,
            isLoadingAll: true, // all lessons
            isPaging: false, // scrolling more
            filtering: false, // filtering
            filters: {
                displayTopics: [],
                topics: [],
                level: [],
                progress: [],
                instructors: [],
            },
        };
    }

    componentDidMount = async () => {
        this.getAllLessons();
    };

    getAllLessons = async () => {
        let response = await getAllContent(
            typeDict[this.state.pack],
            this.state.currentSort,
            this.state.page,
            this.state.filters,
        );
        const newContent = await response.data.map(data => {
            return new ContentModel(data);
        });

        items = [];
        for (i in newContent) {
            if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                console.log(
                    'INSTRUCTORL ',
                    newContent[i].getField('instructor'),
                );
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('instructor').name,
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    type: newContent[i].post.type,
                    description: newContent[i].getData('description').replace(/[&<>"']/g, function(m) { return mapRegex[m]; }),
                    xp: newContent[i].post.xp,
                    id: newContent[i].id,
                    like_count: newContent[i].likeCount,
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
            allLessons: [...this.state.allLessons, ...items],
            outVideos:
                items.length == 0 || response.data.length < 20 ? true : false,
            page: this.state.page + 1,
            isLoadingAll: false,
            filtering: false,
            isPaging: false,
        });
    };

    changeSort = async currentSort => {
        await this.setState({
            currentSort,
            outVideos: false,
            isPaging: true,
            allLessons: [],
            page: 1,
        });

        await this.getAllLessons();
    };

    getVideos = async () => {
        // change page before getting more lessons if paging
        if (!this.state.outVideos) {
            await this.setState({page: this.state.page + 1});
            this.getAllLessons();
        }
    };

    handleScroll = async event => {
        if (
            isCloseToBottom(event) &&
            !this.state.isPaging &&
            !this.state.outVideos
        ) {
            await this.setState({
                page: this.state.page + 1,
                isPaging: true,
            }),
                await this.getAllLessons();
        }
    };

    filterResults = async () => {
        await this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'STUDENTFOCUSSHOW',
            onGoBack: filters => this.changeFilters(filters),
        });
    };

    changeFilters = async filters => {
        // after leaving filter page. set filters here
        await this.setState({
            allLessons: [],
            outVideos: false,
            page: 1,
            filters:
                filters.instructors.length == 0 &&
                filters.level.length == 0 &&
                filters.progress.length == 0 &&
                filters.topics.length == 0
                    ? {
                          displayTopics: [],
                          level: [],
                          topics: [],
                          progress: [],
                          instructors: [],
                      }
                    : filters,
        });

        this.getAllLessons();
        this.forceUpdate();
    };

    getDuration = async newContent => {
        // iterator for get content call
        if (newContent.post.fields[0].key == 'video') {
            return newContent.post.fields[0].value.fields[1].value;
        } else if (newContent.post.fields[1].key == 'video') {
            return newContent.post.fields[1].value.fields[1].value;
        } else if (newContent.post.fields[2].key == 'video') {
            return newContent.post.fields[2].value.fields[1].value;
        }
    };

    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        onScroll={({nativeEvent}) =>
                            this.handleScroll(nativeEvent)
                        }
                        style={{
                            flex: 1,
                            backgroundColor: colors.mainBackground,
                        }}
                    >
                        <View
                            key={'backgroundColoring'}
                            style={{
                                backgroundColor: colors.mainBackground,
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                            }}
                        />
                        <View
                            key={'imageContainer'}
                            style={{
                                width: fullWidth,
                            }}
                        >
                            <View
                                key={'goBackIcon'}
                                style={[
                                    styles.centerContent,
                                    {
                                        height:
                                            Platform.OS == 'android'
                                                ? fullHeight * 0.1
                                                : isNotch
                                                ? fullHeight * 0.12
                                                : fullHeight * 0.055,
                                        width: fullWidth,
                                        position: 'absolute',
                                        top: 0,
                                        zIndex: 5,
                                    },
                                ]}
                            >
                                <View style={{flex: 1}} />
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            flexDirection: 'row',
                                        },
                                    ]}
                                >
                                    <View
                                        style={{flex: 1, flexDirection: 'row'}}
                                    >
                                        <View style={{flex: 0.1}} />
                                        <View>
                                            <View style={{flex: 1}} />
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.props.navigation.goBack()
                                                }
                                                style={{
                                                    paddingLeft:
                                                        10 * factorRatio,
                                                    paddingRight:
                                                        10 * factorRatio,
                                                }}
                                            >
                                                <EntypoIcon
                                                    name={'chevron-thin-left'}
                                                    size={25 * factorRatio}
                                                    color={'white'}
                                                />
                                            </TouchableOpacity>
                                            <View style={{flex: 1}} />
                                        </View>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 22 * factorRatio,
                                            fontWeight: 'bold',
                                            color: colors.mainBackground,
                                            fontFamily: 'OpenSans',
                                        }}
                                    >
                                        Filter Courses
                                    </Text>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{height: 20 * factorVertical}} />
                            </View>
                            <View
                                key={'bootcampImage'}
                                style={[
                                    styles.centerContent,
                                    {
                                        paddingTop: fullHeight * 0.1,
                                        width: fullWidth,
                                        zIndex: 2,
                                    },
                                ]}
                            >
                                <FastImage
                                    style={{
                                        height: onTablet
                                            ? fullWidth * 0.45
                                            : Platform.OS == 'ios'
                                            ? fullWidth * 0.625
                                            : fullWidth * 0.525,
                                        width: onTablet
                                            ? fullWidth * 0.45
                                            : Platform.OS == 'ios'
                                            ? fullWidth * 0.625
                                            : fullWidth * 0.525,
                                        zIndex: 2,
                                        borderRadius: 10 * factorRatio,
                                        borderColor: colors.thirdBackground,
                                        borderWidth: 5,
                                    }}
                                    source={packDict[this.state.pack]}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                            </View>
                        </View>
                        <View style={{height: 25 * factorVertical}} />
                        <VerticalVideoList
                            items={this.state.allLessons}
                            title={'EPISODES'}
                            isPaging={this.state.isPaging}
                            isLoading={this.state.isLoadingAll}
                            type={'STUDENTFOCUSSHOW'}
                            showType={true}
                            showArtist={true}
                            showLength={false}
                            showFilter={
                                this.state.pack == 'Quick Tips' ? true : false
                            }
                            showSort={
                                this.state.pack == 'Quick Tips' ? true : false
                            }
                            filters={this.state.filters}
                            containerWidth={fullWidth}
                            imageRadius={5 * factorRatio}
                            containerBorderWidth={0}
                            currentSort={this.state.currentSort}
                            changeSort={sort => this.changeSort(sort)}
                            filterResults={() => this.filterResults()}
                            containerHeight={
                                onTablet
                                    ? fullHeight * 0.15
                                    : Platform.OS == 'android'
                                    ? fullHeight * 0.115
                                    : fullHeight * 0.0925
                            }
                            imageHeight={
                                onTablet
                                    ? fullHeight * 0.125
                                    : Platform.OS == 'android'
                                    ? fullHeight * 0.0925
                                    : fullHeight * 0.0825
                            }
                            imageWidth={fullWidth * 0.26}
                            outVideos={this.state.outVideos}
                            getVideos={() => this.getVideos()}
                            navigator={row =>
                                this.props.navigation.navigate('VIDEOPLAYER', {
                                    data: row,
                                })
                            }
                        />
                    </ScrollView>
                    <NavigationBar currentPage={'NONE'} />
                </View>
            </View>
        );
    }
}
