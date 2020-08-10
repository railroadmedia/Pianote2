/**
 * StudentFocusShow
 */
import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import {getContent} from '@musora/services';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

const packDict = {
    Bootcamps: require('Pianote2/src/assets/img/imgs/bootcamps.jpg'),
    'Q&A': require('Pianote2/src/assets/img/imgs/questionAnswer.jpg'),
    'Quick Tips': require('Pianote2/src/assets/img/imgs/quickTips.jpg'),
    'Student Review': require('Pianote2/src/assets/img/imgs/studentReview.jpg'),
};

export default class StudentFocusShow extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoadingAll: true,
            showModalMenu: false, // show navigation menu
            showStarted: false,
            showRestartCourse: false,
            outVideos: false, // if no more videos
            page: 1, // page of content
            filters: null,
            currentSort: 'Relevance',
            pack: this.props.navigation.state.params.pack,
            title: this.props.navigation.state.params.pack,
        };
    }

    componentDidMount = async () => {
        this.getContent();
    };

    restartCourse = async () => {
        email = await AsyncStorage.getItem('email');
        contentID = 0;

        await fetch('http://18.218.118.227:5000/restartCourse', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                ID: contentID,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('response, addded to my list: ', response);
            })
            .catch((error) => {
                console.log('API Error: ', error);
            });
    };

    like = async (contentID) => {
        email = await AsyncStorage.getItem('email');
        contentID = 0;

        await fetch('http://18.218.118.227:5000/like', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                ID: contentID,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('response, liked: ', response);
            })
            .catch((error) => {
                console.log('API Error: ', error);
            });
    };

    addToMyList = async (contentID) => {
        email = await AsyncStorage.getItem('email');
        contentID = 0;

        await fetch('http://18.218.118.227:5000/addToMyList', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                ID: contentID,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('response, addded to my list: ', response);
            })
            .catch((error) => {
                console.log('API Error: ', error);
            });
    };

    async getContent() {
        // see if importing filters
        try {
            var filters = this.props.navigation.state.params.filters;
            if (
                filters.instructors.length !== 0 ||
                filters.level.length !== 0 ||
                filters.progress.length !== 0 ||
                filters.topics.length !== 0
            ) {
                // if has a filter then send filters to vertical list
                this.setState({filters});
            } else {
                // if no filters selected then null
                var filters = null;
            }
        } catch (error) {
            var filters = null;
        }

        const {response, error} = await getContent({
            brand: 'pianote',
            limit: '15',
            page: this.state.page,
            sort: '-created_on',
            statuses: ['published'],
            included_types: ['song'],
        });

        const newContent = await response.data.data.map((data) => {
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

        await this.setState({
            items: [...this.state.items, ...items],
            page: this.state.page + 1,
            isLoadingAll: false,
        });
    }

    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'STUDENTFOCUSSHOW',
            onGoBack: (filters) => {
                this.setState({
                    items: [],
                    filters:
                        filters.instructors.length == 0 &&
                        filters.level.length == 0 &&
                        filters.progress.length == 0 &&
                        filters.topics.length == 0
                            ? null
                            : filters,
                }),
                    this.getContent(),
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
                                            fontFamily: 'OpenSans-Regular',
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
                            items={this.state.items}
                            title={'EPISODES'}
                            isLoading={this.state.isLoadingAll}
                            type={'STUDENTFOCUSSHOW'} // the type of content on page
                            showFilter={true}
                            showType={true} // show course / song by artist name
                            showArtist={true} // show artist name
                            showLength={false}
                            showSort={true}
                            filters={this.state.filters} // show filter list
                            containerWidth={fullWidth}
                            imageRadius={5 * factorRatio}
                            containerBorderWidth={0} // border of box
                            currentSort={this.state.currentSort} // relevance sort
                            changeSort={(sort) => {
                                this.setState({
                                    currentSort: sort,
                                    items: [],
                                }),
                                    this.getContent();
                            }} // change sort and reload videos
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
                            //fetchVideos={() => this.getContent()}
                            navigator={(row) =>
                                this.props.navigation.navigate('VIDEOPLAYER', {
                                    data: row,
                                })
                            }
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
                                elevation: 5,
                            },
                        ]}
                        animation={'slideInUp'}
                        animationInTiming={350}
                        animationOutTiming={350}
                        coverScreen={false}
                        hasBackdrop={false}
                    >
                        <RestartCourse
                            hideRestartCourse={() => {
                                this.restartCourse(),
                                    this.setState({
                                        showRestartCourse: false,
                                    });
                            }}
                        />
                    </Modal>
                    <NavigationBar currentPage={'NONE'} />
                </View>
            </View>
        );
    }
}
