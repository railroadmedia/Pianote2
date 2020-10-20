/**
 * MyList
 */
import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import {getMyListContent} from '../../services/GetContent';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};

export default class MyList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            allLessons: [],
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
            showModalMenu: false,
        };
    }

    componentDidMount = async () => {
        this.getMyList();
    };

    getMyList = async () => {
        let response = await getMyListContent(
            this.state.page,
            this.state.filters,
            '',
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
    };

    removeFromMyList = async contentID => {
        for (i in this.state.allLessons) {
            // remove if ID matches
            if (this.state.allLessons[i].id == contentID) {
                this.state.allLessons.splice(i, 1);
            }
        }
        await this.setState({allLessons: this.state.allLessons});
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
            this.getMyList();
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
                await this.getMyList();
        }
    };

    filterResults = async () => {
        // function to be sent to filters page
        console.log(this.state.filters);
        await this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'MYLIST',
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

        this.getMyList();
        this.forceUpdate();
    };

    render() {
        return (
            <View styles={styles.container}>
                <View
                    key={'contentContainer'}
                    style={{
                        height: fullHeight * 0.90625 - navHeight,
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
                        <NavMenuHeaders currentPage={'MYLIST'} />
                    </View>
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
                        ></View>
                        <View style={{height: 30 * factorVertical}} />
                        <Text
                            style={{
                                paddingLeft: 12 * factorHorizontal,
                                fontSize: 30 * factorRatio,
                                color: 'white',
                                fontFamily: 'OpenSans-ExtraBold',
                                fontStyle: 'normal',
                            }}
                        >
                            My List
                        </Text>
                        <View style={{height: 30 * factorVertical}} />
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('SEEALL', {
                                    title: 'In Progress',
                                    parent: 'My List',
                                });
                            }}
                            style={{
                                height: fullHeight * 0.075,
                                width: fullWidth,
                                borderTopWidth: 0.25 * factorRatio,
                                borderTopColor: colors.secondBackground,
                                borderBottomWidth: 0.25 * factorRatio,
                                borderBottomColor: colors.secondBackground,
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <View style={{flex: 1}} />
                                <Text
                                    style={{
                                        paddingLeft: 12 * factorHorizontal,
                                        fontSize: 20 * factorRatio,
                                        marginBottom: 5 * factorVertical,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        fontFamily: 'RobotoCondensed-Bold',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    In Progress
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{flex: 1}} />
                            <View
                                style={{
                                    paddingRight: 12 * factorHorizontal,
                                }}
                            >
                                <View style={{flex: 1}} />
                                <EntypoIcon
                                    name={'chevron-thin-right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                                <View style={{flex: 1}} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('SEEALL', {
                                    title: 'Completed',
                                    parent: 'My List',
                                });
                            }}
                            style={{
                                height: fullHeight * 0.075,
                                width: fullWidth,
                                borderBottomWidth: 0.25 * factorRatio,
                                borderBottomColor: colors.secondBackground,
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <View style={{flex: 1}} />
                                <Text
                                    style={{
                                        paddingLeft: 12 * factorHorizontal,
                                        fontSize: 20 * factorRatio,
                                        marginBottom: 5 * factorVertical,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        fontFamily: 'RobotoCondensed-Bold',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Completed
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{flex: 1}} />
                            <View style={{paddingRight: 12 * factorHorizontal}}>
                                <View style={{flex: 1}} />
                                <EntypoIcon
                                    name={'chevron-thin-right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                                <View style={{flex: 1}} />
                            </View>
                        </TouchableOpacity>
                        <View style={{height: 15 * factorVertical}} />
                        <VerticalVideoList
                            items={this.state.allLessons}
                            isLoading={this.state.isLoadingAll}
                            title={'ADDED TO MY LIST'}
                            isPaging={this.state.isPaging}
                            type={'MYLIST'} // the type of content on page
                            showFilter={true} // shows filters button
                            showType={false} // show course / song by artist name
                            showArtist={true} // show artist name
                            showLength={false} // duration of song
                            showSort={false}
                            filters={this.state.filters} // show filter list
                            filterResults={() => this.filterResults()} // apply from filters page
                            outVideos={this.state.outVideos}
                            removeItem={contentID => {
                                this.removeFromMyList(contentID);
                            }}
                            outVideos={this.state.outVideos} // if paging and out of videos
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
                            navigator={row =>
                                this.props.navigation.navigate('VIDEOPLAYER', {
                                    id: row.id,
                                })
                            }
                        />
                    </ScrollView>
                </View>
                <NavigationBar currentPage={'MyList'} />
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
