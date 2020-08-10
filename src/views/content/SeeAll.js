/**
 * SeeAll
 */
import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {getContent} from '@musora/services';
import {ContentModel} from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

// correlates to filters
const typeDict = {
    'My List': 'MYLIST',
    Packs: 'PACKS',
    Lessons: 'LESSONS',
    'Student Focus': 'STUDENTFOCUS',
    Songs: 'SONGS',
};

export default class SeeAll extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.navigation.state.params.title, // In Progress, Completed, Continue
            parent: this.props.navigation.state.params.parent, // My List, Packs, Student Focus, Foundations, Courses
            outVideos: false, // if no more videos to load
            allLessons: [], // videos loaded
            currentSort: 'Relevance',
            filtering: false,
            filters: null,
            page: 0, // current page
            filterClicked: false,
            isLoadingAll: true,
        };
    }

    async componentDidMount() {
        this.getAllLessons();
    }

    async getAllLessons() {
        const {response, error} = await getContent({
            brand: 'pianote',
            limit: '15',
            page: this.state.page,
            sort: '-created_on',
            statuses: ['published'],
            included_types: ['course'],
        });

        const newContent = response.data.data.map((data) => {
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
            allLessons: [...this.state.allLessons, ...items],
            page: this.state.page + 1,
            isLoadingAll: false,
        });
    }

    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: typeDict[this.state.parent],
            onGoBack: (filters) => {
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

    getDuration = (newContent) => {
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
                                        fontWeight: 'bold',
                                        color: 'white',
                                        fontFamily: 'OpenSans-Regular',
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
                        >
                            <View style={{height: 15 * factorVertical}} />
                            <VerticalVideoList
                                items={this.state.allLessons}
                                isLoading={this.state.isLoadingAll}
                                title={this.state.title} // title for see all page
                                type={typeDict[this.state.parent]} // the type of content on page
                                showFilter={true}
                                showType={false}
                                showArtist={false}
                                showSort={false}
                                showLength={true}
                                showLargeTitle={true}
                                filters={this.state.filters} // show filter list
                                imageRadius={5 * factorRatio} // radius of image shown
                                containerBorderWidth={0} // border of box
                                containerWidth={fullWidth} // width of list
                                currentSort={this.state.currentSort} // relevance sort
                                changeSort={(sort) => {
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
                                navigator={(row) =>
                                    this.props.navigation.navigate(
                                        'VIDEOPLAYER',
                                        {data: row},
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
