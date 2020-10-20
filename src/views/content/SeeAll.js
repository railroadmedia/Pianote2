/**
 * SeeAll
 */
import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {ContentModel} from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import {seeAllContent, getMyListContent} from '../../services/GetContent';

// correlates to filters
const typeDict = {
    'My List': 'MYLIST',
    Packs: 'PACKS',
    Lessons: 'LESSONS',
    'Student Focus': 'STUDENTFOCUS',
    Songs: 'SONGS',
    Courses: 'COURSES',
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};

export default class SeeAll extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.navigation.state.params.title, // In Progress, Completed, Continue
            parent: this.props.navigation.state.params.parent, // My List, Packs, Student Focus, Foundations, Courses
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

    async componentDidMount() {
        this.getAllLessons();
    }

    async getAllLessons() {
        let response = null;

        if (this.state.parent == 'My List') {
            // use my list API call when navigating to see all from my list
            response = await getMyListContent(
                this.state.page,
                this.state.filters,
                this.state.title == 'In Progress' ? 'started' : 'completed',
            );
        } else if (this.state.parent == 'Lessons') {
            // lessons continue and new
            if (this.state.title.slice(0, 3) == 'New') {
                response = await seeAllContent(
                    'lessons',
                    'new',
                    this.state.page,
                    this.state.filters,
                );
            } else {
                response = await seeAllContent(
                    'lessons',
                    'continue',
                    this.state.page,
                    this.state.filters,
                );
            }
        } else if (this.state.parent == 'Courses') {
            // courses new courses
            response = await seeAllContent(
                'courses',
                'new',
                this.state.page,
                this.state.filters,
            );
        }

        const newContent = await response.data.map(data => {
            return new ContentModel(data);
        });

        items = [];
        for (i in newContent) {
            if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                items.push({
                    title: newContent[i].getField('title'),
                    artist:
                        newContent[i].post.type == 'song'
                            ? newContent[i].post.artist
                            : newContent[i].getField('instructor') !== 'TBD'
                            ? newContent[i].getField('instructor').fields[0]
                                  .value
                            : newContent[i].getField('instructor').name,
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
                    like_count: newContent[i].post.like_count,
                    duration: i,
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
            allLessons: [...this.state.allLessons, ...items],
            outVideos:
                items.length == 0 || response.data.length < 20 ? true : false,
            page: this.state.page + 1,
            isLoadingAll: false,
            filtering: false,
            isPaging: false,
        });
    }

    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: typeDict[this.state.parent],
            onGoBack: filters => {
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
        // function to be sent to filters page
        await this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'SEEALL',
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
                                        fullHeight * 0.1 +
                                        (isNotch ? 10 * factorVertical : 0),
                                    backgroundColor: colors.thirdBackground,
                                },
                            ]}
                        >
                            <View style={{flex: 1}} />
                            <View
                                style={[
                                    styles.centerContent,
                                    {
                                        flexDirection: 'row',
                                        backgroundColor: colors.thirdBackground,
                                    },
                                ]}
                            >
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 0.1}} />
                                    <View>
                                        <View style={{flex: 1}} />
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.props.navigation.goBack()
                                            }
                                            style={{
                                                paddingLeft: 10 * factorRatio,
                                                paddingRight: 10 * factorRatio,
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
                                        color: 'white',
                                        fontFamily: 'OpenSans-Bold',
                                    }}
                                >
                                    {this.state.parent}
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{height: 20 * factorVertical}} />
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior={'never'}
                            style={{
                                flex: 0.9,
                                backgroundColor: colors.mainBackground,
                            }}
                            onScroll={({nativeEvent}) =>
                                this.handleScroll(nativeEvent)
                            }
                        >
                            <View style={{height: 15 * factorVertical}} />
                            <VerticalVideoList
                                items={this.state.allLessons}
                                isLoading={this.state.isLoadingAll}
                                isPaging={this.state.isPaging}
                                title={this.state.title} // title for see all page
                                type={typeDict[this.state.parent]} // the type of content on page
                                showType={false}
                                showArtist={true}
                                showSort={false}
                                showLength={false}
                                showFilter={true}
                                hideFilterButton={
                                    this.state.parent == 'Lessons'
                                        ? false
                                        : true
                                } // only show filter button on lessons
                                showLargeTitle={true}
                                filters={this.state.filters} // show filter list
                                imageRadius={5 * factorRatio} // radius of image shown
                                containerBorderWidth={0} // border of box
                                containerWidth={fullWidth} // width of list
                                currentSort={this.state.currentSort}
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
                                //getVideos={() => this.getContent()} // for paging
                                navigator={row =>
                                    this.props.navigation.navigate(
                                        'VIDEOPLAYER',
                                        {id: row.id},
                                    )
                                }
                            />
                        </ScrollView>
                    </View>
                    <NavigationBar currentPage={'SEEALL'} />
                </View>
            </View>
        );
    }
}
