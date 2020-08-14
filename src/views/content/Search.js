/**
 * Search
 */
import React from 'react';
import {
    View,
    Text,
    Keyboard,
    TextInput,
    Animated,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import {ContentModel} from '@musora/models';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class Search extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            filterSize: new Animated.Value(fullHeight * 0.225),
            recentSearchResults: [],
            searchResults: [],
            searchEntered: false,
            outVideos: false,
            numSearchResults: null,
            searchTerm: '',
            isLoading: false,
            currentSort: 'Relevance',
            filterClicked: false,
            showFilters: false,
            filters: null,
        };
    }

    async componentDidMount() {
        // get recent searches from memory
        recentSearchResults = await AsyncStorage.getItem('recentSearches');
        if (recentSearchResults !== null) {
            recentSearchResults = await JSON.parse(recentSearchResults);
            await this.setState({recentSearchResults});
        }
    }

    mapRecentResults() {
        if (
            this.state.recentSearchResults.length > 0 &&
            typeof this.state.recentSearchResults !== null
        ) {
            return this.state.recentSearchResults.map((row, id) => (
                <View
                    key={id}
                    style={{
                        height: fullHeight * 0.065,
                        borderBottomWidth: 1.25 * factorRatio,
                        borderBottomColor: colors.thirdBackground,
                        borderTopWidth: 1.25 * factorRatio,
                        borderTopColor: colors.thirdBackground,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.search(row[0]);
                        }}
                        style={{
                            justifyContent: 'center',
                            paddingLeft: fullWidth * 0.05,
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 18 * factorRatio,
                                fontWeight: '700',
                                fontFamily: 'OpenSans-Regular',
                            }}
                        >
                            {row[0]}
                        </Text>
                    </TouchableOpacity>
                </View>
            ));
        } else {
            return (
                <View
                    key={'noResults'}
                    style={{
                        height: fullHeight * 0.07,
                        borderTopWidth: 1 * factorRatio,
                        borderTopColor: colors.secondBackground,
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            paddingLeft: fullWidth * 0.05,
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18 * factorRatio,
                                fontFamily: 'OpenSans-Regular',
                                color: 'white',
                            }}
                        >
                            No Recent Searches
                        </Text>
                    </View>
                </View>
            );
        }
    }

    search = async (term) => {
        if (term.length > 0) {
            this.setState({
                items: [],
                isLoading: true,
            });

            var isNewTerm = true;

            for (i in this.state.recentSearchResults) {
                if (this.state.recentSearchResults[i][0] == term) {
                    isNewTerm = false;
                }
            }

            if (isNewTerm) {
                if (this.state.recentSearchResults.length > 7) {
                    this.state.recentSearchResults.pop(
                        this.state.recentSearchResults.length,
                    );
                }

                await this.state.recentSearchResults.unshift([
                    term,
                    Date.now(),
                ]);

                await AsyncStorage.setItem(
                    'recentSearches',
                    JSON.stringify(this.state.recentSearchResults),
                );

                await this.setState({
                    recentSearchResults: this.state.recentSearchResults,
                });
            }

            var url = `https://staging.pianote.com/railcontent/search?brand=pianote&limit=20&statuses[]=published&sort=-score&term=${term}&included_types[]=learning-path&included_types[]=unit&included_types[]=course&included_types[]=unit-part&included_types[]=course-part&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson&page=${1}`;
            var newContent = null;

            await fetch(url)
                .then((response) => response.json())
                .then((response) => {
                    if (response.length == 0) {
                        this.setState({searchEntered: false});
                    }
                    console.log('RESPONSE: ', response);
                    newContent = response.data.map((data) => {
                        return new ContentModel(data);
                    });
                })
                .catch((error) => {
                    console.log('API Error: ', error);
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
                searchEntered: true,
                isLoading: false,
                searchResults: [...this.state.searchResults, ...items],
            });
        }
    };

    getDuration = (newContent) => {
        var data = 0;
        try {
            for (i in newContent.fields) {
                if (newContent.fields[i].key == 'video') {
                    var data = newContent.fields[i].value.fields;
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

    async clearRecent() {
        await this.setState({recentSearchResults: []});
        await AsyncStorage.setItem(
            'recentSearches',
            JSON.stringify(this.state.recentSearchResults),
        );
    }

    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'LESSONS',
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
                    this.search(),
                    this.forceUpdate();
            },
        });
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
                    <View style={{backgroundColor: colors.mainBackground}}>
                        <View
                            style={{height: fullHeight * 0.90625 - navHeight}}
                        >
                            <View
                                style={[
                                    styles.centerContent,
                                    {
                                        height:
                                            Platform.OS == 'android'
                                                ? fullHeight * 0.1
                                                : isNotch
                                                ? fullHeight * 0.12
                                                : fullHeight * 0.1,
                                        backgroundColor: colors.thirdBackground,
                                    },
                                ]}
                            >
                                <View style={{flex: 1}} />
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            backgroundColor:
                                                colors.thirdBackground,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            fontSize: 22 * factorRatio,
                                            fontWeight: 'bold',
                                            color: 'white',
                                            fontFamily: 'OpenSans-Regular',
                                        }}
                                    >
                                        Search
                                    </Text>
                                </View>
                                <View style={{height: 20 * factorVertical}} />
                            </View>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{flexGrow: 1}}
                                contentInsetAdjustmentBehavior={'never'}
                                style={{
                                    backgroundColor: colors.mainBackground,
                                    flex: 1,
                                }}
                            >
                                <View style={{height: fullHeight * 0.05}} />
                                <View
                                    key={'searchBox'}
                                    style={{
                                        height:
                                            Platform.OS == 'android'
                                                ? fullHeight * 0.075
                                                : fullHeight * 0.06,
                                        flexDirection: 'row',
                                        paddingLeft: fullWidth * 0.035,
                                    }}
                                >
                                    <View
                                        style={{
                                            width:
                                                this.state.searchTerm.length >
                                                    0 ||
                                                this.state.searchResults
                                                    .length > 0
                                                    ? fullWidth * 0.765
                                                    : fullWidth * 0.93,
                                            backgroundColor: '#f3f6f6',
                                            borderRadius: 60 * factorHorizontal,
                                            flexDirection: 'row',
                                            paddingLeft: fullWidth * 0.02,
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {width: 40 * factorHorizontal},
                                            ]}
                                        >
                                            <EvilIcons
                                                name={'search'}
                                                size={27.5 * factorRatio}
                                                color={
                                                    this.props.currentPage ==
                                                    'SEARCH'
                                                        ? '#fb1b2f'
                                                        : 'grey'
                                                }
                                            />
                                        </View>
                                        <TextInput
                                            ref={(searchTerm) => {
                                                this.searchTerm = searchTerm;
                                            }}
                                            placeholder={'Type your search...'}
                                            placeholderTextColor={'grey'}
                                            onChangeText={(searchTerm) =>
                                                this.setState({searchTerm})
                                            }
                                            onSubmitEditing={() =>
                                                this.search(
                                                    this.state.searchTerm,
                                                )
                                            }
                                            returnKeyType={'search'}
                                            style={{
                                                flex: 0.9,
                                                color: 'grey',
                                                justifyContent: 'center',
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 16 * factorRatio,
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                width:
                                                    this.state.searchTerm
                                                        .length > 0
                                                        ? fullWidth * 0.2
                                                        : fullWidth * 0.035,
                                            },
                                        ]}
                                    >
                                        {this.state.searchTerm.length > 0 && (
                                            <TouchableOpacity
                                                style={[
                                                    styles.centerContent,
                                                    {flex: 1},
                                                ]}
                                                onPress={() => {
                                                    this.searchTerm.clear(),
                                                        this.setState({
                                                            searchTerm: '',
                                                            searchResults: [],
                                                            searchEntered: false,
                                                            showFilters: false,
                                                        });
                                                }}
                                            >
                                                <View style={{flex: 1}} />
                                                <Text
                                                    style={{
                                                        flex: 2,
                                                        textAlign: 'center',
                                                        fontSize:
                                                            12 * factorRatio,
                                                        fontWeight: 'bold',
                                                        color: '#fb1b2f',
                                                        fontFamily:
                                                            'OpenSans-Regular',
                                                        zIndex: 3,
                                                        elevation: 0,
                                                    }}
                                                >
                                                    CANCEL
                                                </Text>
                                                <View style={{flex: 1}} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                                <View style={{height: fullHeight * 0.02}} />
                                <View
                                    key={'recentSearches'}
                                    style={[
                                        styles.centerContent,
                                        {
                                            height:
                                                this.state.searchEntered ||
                                                this.state.searchResults
                                                    .length > 0
                                                    ? 0
                                                    : fullHeight * 0.04,
                                            flexDirection: 'row',
                                        },
                                    ]}
                                >
                                    {(!this.state.searchEntered ||
                                        this.state.searchResults.length >
                                            0) && (
                                        <Text
                                            style={{
                                                flex: 0.65,
                                                paddingLeft: fullWidth * 0.05,
                                                fontWeight: 'bold',
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 18 * factorRatio,
                                                color: colors.secondBackground,
                                            }}
                                        >
                                            RECENT
                                        </Text>
                                    )}
                                    {(this.state.searchTerm.length > 0 ||
                                        !this.state.searchEntered ||
                                        this.state.searchResults.length >
                                            0) && (
                                        <View
                                            style={{
                                                flex: 0.35,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignContent: 'center',
                                                alignItems: 'center',
                                                paddingRight: fullWidth * 0.05,
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.clearRecent()
                                                }
                                                style={[
                                                    styles.centerContent,
                                                    {
                                                        flexDirection: 'row',
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize:
                                                            14 * factorRatio,
                                                        color:
                                                            colors.pianoteRed,
                                                        textAlign: 'right',
                                                        fontFamily:
                                                            'OpenSans-Regular',
                                                        marginTop:
                                                            3 * factorVertical,
                                                    }}
                                                >
                                                    Clear
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                <View style={{height: fullHeight * 0.015}} />
                                <View style={{flex: 1}}>
                                    {!this.state.searchEntered && (
                                        <View>{this.mapRecentResults()}</View>
                                    )}
                                    {this.state.searchEntered &&
                                        !this.state.isLoading && (
                                            <View>
                                                <VerticalVideoList
                                                    items={
                                                        this.state.searchResults
                                                    }
                                                    isLoading={
                                                        this.state.isLoading
                                                    }
                                                    title={`${
                                                        this.state.searchResults
                                                            .length + ' '
                                                    }SEARCH RESULTS`}
                                                    showFilter={true}
                                                    showType={true}
                                                    showArtist={true}
                                                    showSort={true}
                                                    showLength={false}
                                                    filters={this.state.filters}
                                                    imageRadius={
                                                        5 * factorRatio
                                                    }
                                                    containerBorderWidth={0}
                                                    containerWidth={fullWidth}
                                                    currentSort={
                                                        this.state.currentSort
                                                    }
                                                    changeSort={(sort) => {
                                                        this.setState({
                                                            currentSort: sort,
                                                            allLessons: [],
                                                        }),
                                                            this.getAllLessons();
                                                    }}
                                                    filterResults={() =>
                                                        this.filterResults()
                                                    }
                                                    containerHeight={
                                                        onTablet
                                                            ? fullHeight * 0.15
                                                            : Platform.OS ==
                                                              'android'
                                                            ? fullHeight * 0.115
                                                            : fullHeight *
                                                              0.0925
                                                    } // height per row
                                                    imageHeight={
                                                        onTablet
                                                            ? fullHeight * 0.12
                                                            : Platform.OS ==
                                                              'android'
                                                            ? fullHeight * 0.09
                                                            : fullHeight *
                                                              0.0825
                                                    } // image height
                                                    imageWidth={
                                                        fullWidth * 0.26
                                                    } // image width
                                                    outVideos={
                                                        this.state.outVideos
                                                    } // if paging and out of videos
                                                    //getVideos={() => this.getContent()} // for paging
                                                    navigator={(row) =>
                                                        this.props.navigation.navigate(
                                                            'VIDEOPLAYER',
                                                            {data: row},
                                                        )
                                                    }
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorVertical,
                                                    }}
                                                />
                                            </View>
                                        )}
                                </View>
                            </ScrollView>
                        </View>
                        <NavigationBar currentPage={'SEARCH'} />
                    </View>
                </View>
            </View>
        );
    }
}
