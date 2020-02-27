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
} from 'react-native';
import { ContentModel } from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { searchContent, getContent } from '@musora/services';
import Student from 'Pianote2/src/assets/img/svgs/student.svg';
import Songs from 'Pianote2/src/assets/img/svgs/headphones.svg';
import AsyncStorage from '@react-native-community/async-storage';
import Graduation from 'Pianote2/src/assets/img/svgs/courses.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import LearningPaths from 'Pianote2/src/assets/img/svgs/learningPaths.svg';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import FilterIcon from 'Pianote2/src/assets/img/svgs/filters-expanded-arrow.svg';


export default class Search extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            filterSize: new Animated.Value(fullHeight*0.225),
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

        }
    }  


    async componentDidMount() {
        // get recent searches from memory
        recentSearchResults = await AsyncStorage.getItem('recentSearches')
        recentSearchResults = await JSON.parse(recentSearchResults)
        if(recentSearchResults !== null) {
            await this.setState({recentSearchResults})
        }
    }


    mapRecentResults() {
        if(this.state.recentSearchResults.length > 0 &&
            typeof(this.state.recentSearchResults) !== null) {
            return this.state.recentSearchResults.map((row, id) => (
                <View key={id}
                    style={{
                        height: fullHeight*0.065,
                        borderBottomWidth: 1*factorRatio,
                        borderBottomColor: '#ececec',
                        borderTopWidth: 1*factorRatio,
                        borderTopColor: '#ececec',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {}}
                        style={{
                            justifyContent: 'center',
                            paddingLeft: fullWidth*0.05,
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <Text 
                            style={{
                                color: '#fb1b2f',
                                fontSize: 18*factorRatio,
                                fontWeight: '500',
                                fontFamily: 'Roboto',
                            }}
                        >
                            {row[0]}
                        </Text>
                    </TouchableOpacity>
                </View>
                )
            )
        } else {
            return (
                <View key={'noResults'}
                    style={{
                        height: fullHeight*0.07,
                        borderTopWidth: 1*factorRatio,
                        borderTopColor: '#ececec',
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            paddingLeft: fullWidth*0.05,
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <Text 
                            style={{
                                fontSize: 20*factorRatio,
                                fontWeight: '500',
                                fontFamily: 'Roboto',
                            }}
                        >
                            No Recent Searches
                        </Text>
                    </View>
                </View>
            )
        }
    }


    search = async (term) => {
        // add term to user's recent searches in local storage
        // if list is 8+ items take oldest one off
        if(this.state.recentSearchResults.length > 7) {
            this.state.recentSearchResults.pop(this.state.recentSearchResults.length)
        }

        await this.state.recentSearchResults.unshift([term, Date.now()])
        
        await AsyncStorage.setItem(
            'recentSearches', JSON.stringify(this.state.recentSearchResults)
        )

        await this.setState({
            recentSearchResults: this.state.recentSearchResults,
            searchEntered: true,
        })

        const { response, error } = await searchContent({
            term: this.state.searchTerm,
            statuses: ['published'],
            included_types: ['song'],
            page: '1',
            brand: 'pianote',
            limit: '20',
            sort: '-created_on',
        });

        console.log('Search Error: ', error)
        console.log('Search Response: ', response)

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data)
        })

        searchResults = []
        for(i in newContent) {
            searchResults.push({
                title: newContent[i].getField('title'),
                artist: newContent[i].getField('artist'),
                thumbnail: newContent[i].getData('thumbnail_url'),
                duration: newContent[i].getData('length'),
            })
        }

        await this.setState({searchResults})
    }


    async clearRecent() {
        await this.setState({recentSearchResults: []})
        await AsyncStorage.setItem(
            'recentSearches', JSON.stringify(this.state.recentSearchResults)
        )
    }


    render() {
        return (
            <View styles={styles.container}>
                <TouchableWithoutFeedback 
                    onPress={() => Keyboard.dismiss()}
                    style={{height: fullHeight, alignSelf: 'stretch'}}
                >
                    <View>
                        <View style={{height: fullHeight*0.90625}}>
                            <View style={{height: fullHeight*0.055}}/>
                            <View key={'searchBox'}
                                style={{
                                    height: fullHeight*0.05, 
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 0.05}}/>
                                <View 
                                    style={{
                                        flex: (this.state.searchTerm.length > 0) ? 0.75 : 0.9,
                                        backgroundColor: '#f3f6f6',
                                        borderRadius: 60*factorHorizontal,
                                        flexDirection: 'row',
                                        paddingLeft: fullWidth*0.02,
                                    }}
                                >
                                    <View style={[styles.centerContent, {width: 40*factorHorizontal}]}>
                                        <EvilIcons
                                            name={'search'}
                                            size={27.5*factorRatio}
                                            color={(this.props.currentPage == 'SEARCH') ? '#fb1b2f':'grey'}
                                        />
                                    </View>
                                    <TextInput
                                        ref={(searchTerm) => { this.searchTerm = searchTerm }}
                                        placeholder={'Search'}
                                        placeholderTextColor={'grey'}
                                        onChangeText={(searchTerm) => this.setState({searchTerm})}
                                        onSubmitEditing={() => this.search(this.state.searchTerm)}
                                        returnKeyType={'search'}
                                        style={{
                                            flex: 0.9,
                                            color: 'grey',
                                            justifyContent: 'center',
                                            fontFamily: 'Roboto',
                                            fontSize: 20*factorRatio,
                                        }}
                                    />
                                </View>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        flex: (this.state.searchTerm.length > 0) ? 0.2 : 0.05,
                                    }]}
                                >
                                    {(this.state.searchTerm.length > 0) && (
                                    <TouchableOpacity
                                        style={[styles.centerContent, {flex: 1}]}
                                        onPress={() => {
                                            this.searchTerm.clear(),
                                            this.setState({
                                                searchTerm: '',
                                                searchResults: [],
                                                searchEntered: false,
                                                showFilters: false,
                                            })
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={{
                                                flex: 1,
                                                textAlign: 'center',
                                                fontSize: 14*factorRatio,
                                                fontWeight: 'bold',
                                                color: '#fb1b2f',
                                                fontFamily: 'Roboto',
                                                zIndex: 3,
                                            }}
                                        >
                                            CANCEL
                                        </Text>
                                        <View style={{flex: 1}}/>
                                    </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            <View style={{height: fullHeight*0.04}}/>
                            <View key={'recentSearches'}
                                style={[
                                    styles.centerContent, {
                                    height: fullHeight*0.04,
                                    flexDirection: 'row',
                                }]}
                            >
                                {!this.state.searchEntered && (
                                <Text
                                    style={{
                                        flex: 0.65,
                                        paddingLeft: fullWidth*0.05,
                                        fontWeight: 'bold',
                                        fontFamily: 'Roboto',
                                        fontSize: 20*factorRatio,
                                    }}
                                >
                                    RECENT SEARCHES
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
                                        paddingRight: fullWidth*0.05,
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        onPress={() => this.clearRecent()}
                                        style={[styles.centerContent, {
                                            flexDirection: 'row'
                                        }]}
                                    >
                                        <View style={{marginTop: 3.5*factorRatio}}>
                                            <EntypoIcon 
                                                name={'cross'}
                                                size={18*factorRatio}
                                                color={'grey'}
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: 12*factorRatio,
                                                color: 'grey',
                                                textAlign: 'right',
                                                fontFamily: 'Roboto',
                                                marginTop: 3*factorVertical,
                                            }}
                                        >
                                            CLEAR RECENT
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                )}
                                {this.state.searchEntered && (
                                <Text
                                    style={{
                                        flex: 0.65,
                                        paddingLeft: fullWidth*0.05,
                                        fontWeight: 'bold',
                                        fontFamily: 'Roboto',
                                        fontSize: 20*factorRatio,
                                    }}
                                >
                                    {this.state.numSearchResults} SEARCH RESULT{(this.state.numSearchResults == 1) ? '':'S'}
                                </Text>
                                )}
                                {this.state.searchEntered && (
                                <View
                                    style={[
                                        styles.centerContent, {
                                        flex: 0.35,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth*0.05,
                                    }]}
                                >
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                showFilters: !this.state.showFilters
                                            })
                                        }}
                                        style={[
                                            styles.centerContent, {
                                            flexDirection: 'row',
                                            height: 37.5*factorRatio,
                                            width: 37.5*factorRatio,
                                            borderRadius: 200,
                                            backgroundColor: (
                                                this.state.showFilters
                                            ) ?  'red' : 'white',
                                            transform: [{ rotate: '90deg'}],
                                        }]}
                                    >
                                        <IonIcon 
                                            size={22.5*factorRatio}
                                            name={'md-options'}
                                            color={(
                                                this.state.showFilters
                                            ) ? 'white' : '#c2c2c2'}
                                        />
                                    </TouchableOpacity>
                                </View>
                                )}
                            </View>
                            <View style={{height: fullHeight*0.015}}/>
                            {this.state.showFilters && (
                            <Animated.View key={'filterOptions'} 
                                style={{
                                    height: this.state.filterSize, 
                                    width: fullWidth,
                                    paddingTop: 2.5*factorRatio,
                                }}
                            >
                                <View key={'content'}
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <View key={'upper'}
                                        style={{
                                            flex: 0.5,
                                            flexDirection: 'row',
                                            alignSelf: 'stretch',
                                        }}
                                    >
                                        <View key={'level'}
                                            style={{flex: 1}}
                                        >
                                            <View 
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '100%',
                                                        width: '93%',
                                                        alignSelf: 'stretch',
                                                    }}
                                                >
                                                    <View style={{flex: 1}}/>
                                                    <View
                                                        style={{
                                                            height: '80%',
                                                            width: '100%',
                                                            borderRadius: 40*factorRatio,
                                                            alignSelf: 'stretch',
                                                            backgroundColor: (
                                                                (this.state.LearningPath) ? '#fb1b2f' : 'black'
                                                            ),
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({
                                                                    LearningPath: !this.state.LearningPath
                                                                })
                                                            }}
                                                            style={[
                                                                styles.centerContent, {
                                                                height: '100%',
                                                                width: '100%',
                                                                flexDirection: 'row',
                                                            }]}
                                                        >
                                                            <LearningPaths
                                                                height={15*factorRatio}
                                                                width={15*factorRatio}
                                                                fill={'white'}
                                                            />
                                                            <View style={{width: 5*factorHorizontal}}/>
                                                            <Text
                                                                style={{
                                                                    fontSize: 14*factorRatio,
                                                                    fontWeight: '800',
                                                                    color: 'white',
                                                                    fontFamily: 'RobotoCondensed-Regular',
                                                                }}
                                                            >
                                                                LEARNING PATHS
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{flex: 1}}/>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                        </View>
                                        <View key={'instructor'}
                                            style={{flex: 1}}
                                        >
                                            <View 
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '100%',
                                                        width: '93%',
                                                        alignSelf: 'stretch',
                                                    }}
                                                >
                                                    <View style={{flex: 1}}/>
                                                    <View
                                                        style={{
                                                            height: '80%',
                                                            width: '100%',
                                                            borderRadius: 35*factorRatio,
                                                            alignSelf: 'stretch',
                                                            backgroundColor: (
                                                                (this.state.Courses) ? '#fb1b2f' : 'black'
                                                            ),
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({
                                                                    Courses: !this.state.Courses
                                                                })
                                                            }}
                                                            style={[
                                                                styles.centerContent, {
                                                                height: '100%',
                                                                width: '100%',
                                                                flexDirection: 'row',
                                                            }]}
                                                        >
                                                            <Graduation
                                                                height={20*factorRatio}
                                                                width={20*factorRatio}
                                                                fill={'white'}
                                                            />
                                                            <View style={{width: 5*factorHorizontal}}/>
                                                            <Text
                                                                style={{
                                                                    fontSize: 14*factorRatio,
                                                                    fontWeight: '800',
                                                                    color: 'white',
                                                                    fontFamily: 'RobotoCondensed-Regular',
                                                                }}
                                                            >
                                                                COURSES
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{flex: 1}}/>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                        </View>
                                    </View>
                                    <View key={'lower'}
                                        style={{
                                            flex: 0.5,
                                            flexDirection: 'row',
                                            alignSelf: 'stretch',
                                        }}
                                    >
                                        <View key={'topic'}
                                            style={{flex: 1}}
                                        >
                                            <View 
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '100%',
                                                        width: '93%',
                                                        alignSelf: 'stretch',
                                                    }}
                                                >
                                                    <View style={{flex: 1}}/>
                                                    <View
                                                        style={{
                                                            height: '80%',
                                                            width: '100%',
                                                            borderRadius: 35*factorRatio,
                                                            alignSelf: 'stretch',
                                                            backgroundColor: (
                                                                (this.state.StudentFocus) ? '#fb1b2f' : 'black'
                                                            ),
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({
                                                                    StudentFocus: !this.state.StudentFocus
                                                                })
                                                            }}
                                                            style={[
                                                                styles.centerContent, {
                                                                height: '100%',
                                                                width: '100%',
                                                                flexDirection: 'row',
                                                            }]}
                                                        >
                                                            <Student
                                                                height={15*factorRatio}
                                                                width={15*factorRatio}
                                                                fill={'white'}
                                                            />
                                                            <View style={{width: 5*factorHorizontal}}/>
                                                            <Text
                                                                style={{
                                                                    fontSize: 14*factorRatio,
                                                                    fontWeight: '800',
                                                                    color: 'white',
                                                                    fontFamily: 'RobotoCondensed-Regular',
                                                                }}
                                                            >
                                                                STUDENT FOCUS
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{flex: 1}}/>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                        </View>
                                        <View key={'progress'}
                                            style={{flex: 1}}
                                        >
                                            <View 
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '100%',
                                                        width: '93%',
                                                        alignSelf: 'stretch',
                                                    }}
                                                >
                                                    <View style={{flex: 1}}/>
                                                    <View
                                                        style={{
                                                            height: '80%',
                                                            width: '100%',
                                                            borderRadius: 35*factorRatio,
                                                            alignSelf: 'stretch',
                                                            backgroundColor: (
                                                                (this.state.Songs) ? '#fb1b2f' : 'black'
                                                            ),
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.setState({
                                                                    Songs: !this.state.Songs
                                                                })
                                                            }}
                                                            style={[
                                                                styles.centerContent, {
                                                                height: '100%',
                                                                width: '100%',
                                                                flexDirection: 'row',
                                                            }]}
                                                        >
                                                            <Songs
                                                                height={17.5*factorRatio}
                                                                width={17.5*factorRatio}
                                                                fill={'white'}
                                                            />
                                                            <View style={{width: 5*factorHorizontal}}/>
                                                            <Text
                                                                style={{
                                                                    fontSize: 14*factorRatio,
                                                                    fontWeight: '800',
                                                                    color: 'white',
                                                                    fontFamily: 'RobotoCondensed-Regular',
                                                                }}
                                                            >
                                                                SONGS
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{flex: 1}}/>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View key={'clear'}
                                    style={{
                                        height: fullHeight*0.075,
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                Songs: false,
                                                StudentFocus: false,
                                                Courses: false,
                                                LearningPath: false,
                                            })
                                        }}
                                        style={[
                                            styles.centerContent, {
                                            flexDirection: 'row',
                                        }]}
                                    >
                                        <Text
                                            style={[
                                                styles.centerContent, {
                                                fontSize: 14*factorRatio,
                                                color: 'grey',
                                                marginRight: 0.5,
                                                textAlign: 'center',
                                                fontWeight: '700',
                                                fontFamily: 'Roboto',
                                            }]}
                                        >
                                            <Text
                                                style={[
                                                    styles.centerContent, {
                                                    fontSize: 14*factorRatio,
                                                    color: 'grey',
                                                    textAlign: 'right',
                                                    fontWeight: '700',
                                                    fontFamily: 'Roboto',
                                                }]}
                                            >
                                                x </Text>
                                            CLEAR FILTERS 
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>
                            </Animated.View>
                            )}
                            
                            <ScrollView style={{flex: 0.73}}>
                                {!this.state.searchEntered && (
                                <View>
                                    {this.mapRecentResults()}
                                </View>
                                )}
                                
                                {this.state.searchEntered && (
                                <VerticalVideoList
                                    fetchVideos={() => this.getContent()}
                                    items={this.state.searchResults}
                                    renderType={'Mapped'}
                                    outVideos={this.state.outVideos}
                                    containerWidth={fullWidth}
                                    containerHeight={(isTablet) ? fullHeight*0.15 : fullHeight*0.09}
                                    imageHeight={(isTablet) ? fullHeight*0.125 : fullHeight*0.07}
                                    imageWidth={fullWidth*0.26}
                                />
                                )}
                            </ScrollView>
                        </View>
                        <NavigationBar
                            currentPage={'SEARCH'}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}