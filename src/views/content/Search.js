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
import {searchContent} from '@musora/services';
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
            filterClicked: false,
            LearningPath: false,
            Courses: false,
            Songs: false,
            StudentFocus: false,
            showFilters: false,
        };
    }

    async componentDidMount() {
        // get recent searches from memory
        recentSearchResults = await AsyncStorage.getItem('recentSearches');
        recentSearchResults = await JSON.parse(recentSearchResults);
        if (recentSearchResults !== null) {
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
                        onPress={() => {}}
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
        // if not in search histry
        // add term to user's recent searches in local storage
        // if list is 8+ items take oldest one off
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

            await this.state.recentSearchResults.unshift([term, Date.now()]);

            await AsyncStorage.setItem(
                'recentSearches',
                JSON.stringify(this.state.recentSearchResults),
            );

            await this.setState({
                recentSearchResults: this.state.recentSearchResults,
                searchEntered: true,
            });
        }

        const {response, error} = await searchContent({
            brand: 'pianote',
            limit: '25',
            page: 1,
            sort: '-created_on',
            statuses: ['published'],
            included_types: ['song', 'course'],
            statuses: ['published'],
            sort: '-score',
            term,
        });

        console.log(response, error);

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
                    xp: newContent[i].getField('xp'),
                    id: newContent[i].id,
                    likeCount: newContent[i].likeCount,
                });
            }
        }

        this.setState({
            searchResults: [...this.state.searchResults, ...items],
        });
    };

    async clearRecent() {
        await this.setState({recentSearchResults: []});
        await AsyncStorage.setItem(
            'recentSearches',
            JSON.stringify(this.state.recentSearchResults),
        );
    }

    render() {
        return (
            <View styles={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => Keyboard.dismiss()}
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
                            <View style={{height: fullHeight * 0.05}} />
                            <View
                                key={'searchBox'}
                                style={{
                                    height:
                                        Platform.OS == 'android'
                                            ? fullHeight * 0.075
                                            : fullHeight * 0.06,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 0.05}} />
                                <View
                                    style={{
                                        flex:
                                            this.state.searchTerm.length > 0
                                                ? 0.75
                                                : 0.9,
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
                                            this.search(this.state.searchTerm)
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
                                            flex:
                                                this.state.searchTerm.length > 0
                                                    ? 0.2
                                                    : 0.05,
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
                                                    fontSize: 12 * factorRatio,
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
                            <View style={{height: fullHeight * 0.04}} />
                            <View
                                key={'recentSearches'}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: fullHeight * 0.04,
                                        flexDirection: 'row',
                                    },
                                ]}
                            >
                                {!this.state.searchEntered && (
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
                                {!this.state.searchEntered && (
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
                                            onPress={() => this.clearRecent()}
                                            style={[
                                                styles.centerContent,
                                                {
                                                    flexDirection: 'row',
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 14 * factorRatio,
                                                    color: colors.pianoteRed,
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
                                {this.state.searchEntered && (
                                    <Text
                                        style={{
                                            flex: 0.65,
                                            paddingLeft: fullWidth * 0.05,
                                            fontWeight: 'bold',
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 18 * factorRatio,
                                            color: 'white',
                                        }}
                                    >
                                        {this.state.numSearchResults} SEARCH
                                        RESULT
                                        {this.state.numSearchResults == 1
                                            ? ''
                                            : 'S'}
                                    </Text>
                                )}
                                {this.state.searchEntered && (
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 0.35,
                                                flexDirection: 'row',
                                                paddingRight: fullWidth * 0.05,
                                            },
                                        ]}
                                    >
                                        <View style={{flex: 1}} />
                                    </View>
                                )}
                            </View>
                            <View style={{height: fullHeight * 0.015}} />
                            <ScrollView style={{flex: 0.73}}>
                                {!this.state.searchEntered && (
                                    <View>{this.mapRecentResults()}</View>
                                )}
                            </ScrollView>
                        </View>
                        <NavigationBar currentPage={'SEARCH'} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}
