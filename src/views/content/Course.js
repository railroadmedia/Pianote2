/**
 * Course
 */
import React from 'react';
import {View, Text, ScrollView, Platform} from 'react-native';
import {ContentModel} from '@musora/models';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import {
    getNewContent,
    getStartedContent,
    getAllContent,
} from '../../services/GetContent';
import {NetworkContext} from '../../context/NetworkProvider';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};

export default class Course extends React.Component {
    static navigationOptions = {header: null};
    static contextType = NetworkContext;
    constructor(props) {
        super(props);
        this.state = {
            progressCourses: [],
            newCourses: [],

            allCourses: [],
            currentSort: '-published_on',
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

            isLoadingNew: true, // new course
            isLoadingProgress: true, // progress course
            started: false, // if started lesson
        };
    }

    componentDidMount = async () => {
        this.getProgressCourses();
        this.getNewCourses();
        this.getAllCourses();
    };

    getAllCourses = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        let response = await getAllContent(
            'course',
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
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('instructor').fields[0]
                        .value,
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    type: newContent[i].post.type,
                    description: newContent[i]
                        .getData('description')
                        .replace(/(<([^>]+)>)/g, '')
                        .replace(/&nbsp;/g, '')
                        .replace(/&amp;/g, '&')
                        .replace(/&#039;/g, "'")
                        .replace(/&quot;/g, '"')
                        .replace(/&gt;/g, '>')
                        .replace(/&lt;/g, '<'),
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

        this.setState({
            allCourses: [...this.state.allCourses, ...items],
            outVideos:
                items.length == 0 || response.data.length < 20 ? true : false,
            isLoadingAll: false,
            filtering: false,
            isPaging: false,
            page: this.state.page + 1,
        });
    };

    getProgressCourses = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        let response = await getStartedContent('course');
        const newContent = response.data.map(data => {
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
                        .replace(/(<([^>]+)>)/g, '')
                        .replace(/&nbsp;/g, '')
                        .replace(/&amp;/g, '&')
                        .replace(/&#039;/g, "'")
                        .replace(/&quot;/g, '"')
                        .replace(/&gt;/g, '>')
                        .replace(/&lt;/g, '<'),
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
            progressCourses: [...this.state.progressCourses, ...items],
            isLoadingProgress: false,
            started: this.state.progressCourses > 0 || items > 0 ? true : false,
        });
    };

    getNewCourses = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        let response = await getNewContent('course');
        const newContent = response.data.map(data => {
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
                        .replace(/(<([^>]+)>)/g, '')
                        .replace(/&nbsp;/g, '')
                        .replace(/&amp;/g, '&')
                        .replace(/&#039;/g, "'")
                        .replace(/&quot;/g, '"')
                        .replace(/&gt;/g, '>')
                        .replace(/&lt;/g, '<'),
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

        this.setState({
            newCourses: [...this.state.newCourses, ...items],
            isLoadingNew: false,
        });
    };

    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'COURSES',
            onGoBack: filters => {
                this.setState({
                    allCourses: [],
                    filters:
                        filters.instructors.length == 0 &&
                        filters.level.length == 0 &&
                        filters.progress.length == 0 &&
                        filters.topics.length == 0
                            ? null
                            : filters,
                }),
                    this.getAllCourses(),
                    this.forceUpdate();
            },
        });
    };

    getDuration = newContent => {
        var data = 0;
        try {
            for (i in newContent.post.current_lesson.fields) {
                if (newContent.post.current_lesson.fields[i].key == 'video') {
                    var data =
                        newContent.post.current_lesson.fields[i].value.fields;
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

    changeSort = async currentSort => {
        await this.setState({
            currentSort,
            outVideos: false,
            isPaging: true,
            allCourses: [],
            page: 1,
        });

        await this.getAllCourses();
    };

    getVideos = async () => {
        // change page before getting more lessons if paging
        if (!this.state.outVideos) {
            await this.setState({page: this.state.page + 1});
            this.getAllCourses();
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
                await this.getAllCourses();
        }
    };

    filterResults = async () => {
        // function to be sent to filters page
        await this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'COURSES',
            onGoBack: filters => this.changeFilters(filters),
        });
    };

    changeFilters = async filters => {
        // after leaving filter page. set filters here
        await this.setState({
            allCourses: [],
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

        this.getAllCourses();
        this.forceUpdate();
    };

    render() {
        return (
            <View style={styles.container}>
                <View
                    key={'container'}
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <View
                        key={'contentContainer'}
                        style={{
                            height: fullHeight,
                            alignSelf: 'stretch',
                        }}
                    >
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
                                parentPage={'COURSES'}
                            />
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior={'never'}
                            style={{
                                flex: 1,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <View
                                key={'header'}
                                style={{
                                    height: fullHeight * 0.1,
                                    backgroundColor: colors.thirdBackground,
                                }}
                            />
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
                            <View style={{height: 25 * factorVertical}} />
                            <Text
                                style={{
                                    paddingLeft: 12 * factorHorizontal,
                                    fontSize: 30 * factorRatio,
                                    color: 'white',
                                    fontFamily: 'OpenSans-ExtraBold',
                                }}
                            >
                                Courses
                            </Text>
                            <View style={{height: 15 * factorVertical}} />
                            {this.state.started && (
                                <View
                                    key={'continueCourses'}
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
                                                    parent: 'Courses',
                                                },
                                            )
                                        }
                                        showArtist={true}
                                        items={this.state.progressCourses}
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
                                key={'newCourses'}
                                style={{
                                    minHeight: fullHeight * 0.225,
                                    paddingLeft: fullWidth * 0.035,
                                    backgroundColor: colors.mainBackground,
                                }}
                            >
                                <HorizontalVideoList
                                    Title={'NEW COURSES'}
                                    seeAll={() =>
                                        this.props.navigation.navigate(
                                            'SEEALL',
                                            {
                                                title: 'New Courses',
                                                parent: 'Courses',
                                            },
                                        )
                                    }
                                    showArtist={true}
                                    isLoading={this.state.isLoadingNew}
                                    items={this.state.newCourses}
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
                            <VerticalVideoList
                                items={this.state.allCourses}
                                isLoading={this.state.isLoadingAll}
                                title={'COURSES'}
                                type={'COURSES'}
                                isPaging={this.state.isPaging}
                                showFilter={true}
                                showType={true}
                                showArtist={true}
                                showLength={false}
                                showSort={true}
                                filters={this.state.filters}
                                imageRadius={5 * factorRatio}
                                containerBorderWidth={0}
                                currentSort={this.state.currentSort}
                                changeSort={sort => this.changeSort(sort)}
                                filterResults={() => this.filterResults()}
                                containerWidth={fullWidth}
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
                                outVideos={this.state.outVideos}
                                getVideos={() => this.getVideos()}
                                navigator={row =>
                                    this.props.navigation.navigate(
                                        'PATHOVERVIEW',
                                        {
                                            data: row,
                                        },
                                    )
                                }
                            />
                            <View style={{height: fullHeight * 0.025}} />
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}
