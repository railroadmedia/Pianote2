/**
 * SongCatalog
 */
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';
import {getStartedContent, getAllContent} from '../../services/GetContent';
import {NetworkContext} from '../../context/NetworkProvider';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};

export default class SongCatalog extends React.Component {
    static navigationOptions = {header: null};
    static contextType = NetworkContext;
    constructor(props) {
        super(props);
        this.state = {
            progressSongs: [],

            allSongs: [],
            currentSort: 'newest',
            page: 1,
            outVideos: false,
            isLoadingAll: true,
            isPaging: false,
            filtering: false,
            filters: {
                displayTopics: [],
                topics: [],
                level: [],
                progress: [],
                instructors: [],
            },
            started: true,
            isLoadingProgress: true,
        };
    }

    componentDidMount = async () => {
        this.getProgressSongs();
        this.getAllSongs();
    };

    getAllSongs = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        let response = await getAllContent(
            'song',
            this.state.currentSort,
            this.state.page,
            this.state.filters,
        );
        const newContent = await response.data.map(data => {
            return new ContentModel(data);
        });
        console.log(newContent);
        items = [];
        for (i in newContent) {
            if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('artist'),
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
                    id: newContent[i].post.current_lesson?.id,
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
            allSongs: [...this.state.allSongs, ...items],
            outVideos:
                items.length == 0 || response.data.length < 20 ? true : false,
            filtering: false,
            isPaging: false,
            isLoadingAll: false,
        });
    };

    getProgressSongs = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        let response = await getStartedContent('song');
        const newContent = response.data.map(data => {
            return new ContentModel(data);
        });

        items = [];
        for (i in newContent) {
            if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].post.artist,
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
                    id: newContent[i].post.current_lesson.id,
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

        this.setState({
            progressSongs: [...this.state.progressSongs, ...items],
            started:
                items.length == 0 && this.state.progressSongs.length == 0
                    ? false
                    : true,
            isLoadingProgress: false,
        });
    };

    getDuration = async newContent => {
        if (newContent.post.fields[0].key == 'video') {
            return newContent.post.fields[0].value.fields[1].value;
        } else if (newContent.post.fields[1].key == 'video') {
            return newContent.post.fields[1].value.fields[1].value;
        } else if (newContent.post.fields[2].key == 'video') {
            return newContent.post.fields[2].value.fields[1].value;
        }
    };

    changeSort = async currentSort => {
        await this.setState({
            allSongs: [],
            currentSort,
            outVideos: false,
            isPaging: false,
            page: 1,
        });

        await this.getAllSongs();
    };

    getVideos = async () => {
        if (!this.state.outVideos) {
            await this.setState({page: this.state.page + 1});
            this.getAllSongs();
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
            });

            await this.getAllSongs();
        }
    };

    filterResults = async () => {
        await this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'SONGS',
            onGoBack: filters => this.changeFilters(filters),
        });
    };

    changeFilters = async filters => {
        // after leaving filter page. set filters here
        await this.setState({
            allSongs: [],
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

        this.getAllSongs();
        this.forceUpdate();
    };

    render() {
        return (
            <View style={styles.container}>
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
                        parentPage={'SONGS'}
                    />
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior={'never'}
                    scrollEventThrottle={400}
                    onScroll={({nativeEvent}) => this.handleScroll(nativeEvent)}
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
                        Songs
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
                                isLoading={this.state.isLoadingProgress}
                                seeAll={() =>
                                    this.props.navigation.navigate('SEEALL', {
                                        title: 'Continue',
                                        parent: 'Songs',
                                    })
                                }
                                hideSeeAll={true}
                                showArtist={true}
                                items={this.state.progressSongs}
                                itemWidth={
                                    isNotch
                                        ? fullHeight * 0.175
                                        : fullHeight * 0.2
                                }
                                itemHeight={
                                    isNotch
                                        ? fullHeight * 0.175
                                        : fullHeight * 0.2
                                }
                            />
                        </View>
                    )}
                    <VerticalVideoList
                        items={this.state.allSongs}
                        isLoading={this.state.isLoadingAll}
                        title={'ALL SONGS'} // title for see all page
                        type={'SONGS'} // the type of content on page
                        showFilter={true}
                        showType={false} // show course / song by artist name
                        showArtist={true} // show artist name
                        showLength={false}
                        showSort={true}
                        isPaging={this.state.isPaging}
                        filters={this.state.filters} // show filter list
                        imageRadius={5 * factorRatio} // radius of image shown
                        containerBorderWidth={0} // border of box
                        containerWidth={fullWidth} // width of list
                        currentSort={this.state.currentSort}
                        changeSort={sort => this.changeSort(sort)} // change sort and reload videos
                        outVideos={this.state.outVideos} // if paging and out of videos
                        filterResults={() => this.filterResults()} // apply from filters page
                        containerHeight={
                            onTablet
                                ? fullHeight * 0.15
                                : Platform.OS == 'android'
                                ? fullHeight * 0.1375
                                : fullHeight * 0.1
                        } // height per row
                        imageHeight={
                            onTablet
                                ? fullHeight * 0.12
                                : Platform.OS == 'android'
                                ? fullHeight * 0.125
                                : fullHeight * 0.09
                        } // image height
                        imageWidth={
                            onTablet
                                ? fullHeight * 0.12
                                : Platform.OS == 'android'
                                ? fullHeight * 0.125
                                : fullHeight * 0.09
                        } // image height
                        navigator={row => {
                            console.log('song', row);

                            this.props.navigation.navigate('VIDEOPLAYER', {
                                id: row.id,
                            });
                        }}
                    />
                </ScrollView>

                <NavigationBar currentPage={''} />
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
                        onClose={e => this.setState({showModalMenu: e})}
                        menu={this.state.menu}
                        parentPage={this.state.parentPage}
                    />
                </Modal>
            </View>
        );
    }
}
