/**
 * Search
 */
import React from 'react';
import { 
    View, 
    Text,
    Keyboard,
    TextInput, 
    TouchableWithoutFeedback, 
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { ContentModel } from '@musora/models';
import Icon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { searchContent, getContent } from '@musora/services';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class Search extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            recentSearchResults: [], 
            searchResults: [],
            searchEntered: false,
            outVideos: false,
            numSearchResults: null,
            searchTerm: '',
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
        if(
            this.state.recentSearchResults.length > 0 &&
            typeof(this.state.recentSearchResults) !== null
        ) {
            return this.state.recentSearchResults.map((row, id) => (
                <View key={id}
                    style={{
                        height: fullHeight*0.065,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ececec',
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
                        borderTopWidth: 1,
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
                            <View style={{flex: 0.075}}></View>
                            <View style={{flex: 0.065, flexDirection: 'row'}}>
                                <View style={{flex: 0.05}}></View>
                                <View 
                                    style={{
                                        flex: (this.state.searchTerm.length > 0) ? 0.75 : 0.9,
                                        backgroundColor: '#f3f6f6',
                                        borderRadius: 7.5*factorHorizontal,
                                        flexDirection: 'row',
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
                                            })
                                        }}
                                    >
                                        <View style={{flex: 1}}></View>
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
                                        <View style={{flex: 1}}></View>
                                    </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            <View style={{flex: 0.04}}></View>
                            <View key={'recentSearches'}
                                style={[
                                    styles.centerContent, {
                                    flex: 0.07, 
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
                                    <View style={{flex: 1}}></View>

                                    <TouchableOpacity
                                        onPress={() => this.clearRecent()}
                                        style={[styles.centerContent, {
                                            flexDirection: 'row'
                                        }]}
                                    >
                                        <View style={{marginTop: 3.5*factorRatio}}>
                                            <Icon 
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
                                    <View style={{flex: 1}}></View>
                                    <TouchableOpacity
                                        onPress={() => {}}
                                        style={[
                                            styles.centerContent, {
                                            flexDirection: 'row',
                                            transform: [{ rotate: '90deg'}],
                                        }]}
                                    >
                                        <IonIcon 
                                            size={25*factorRatio}
                                            name={'md-options'}
                                            color={'#c2c2c2'}
                                        />
                                    </TouchableOpacity>
                                </View>
                                )}
                            </View>
                            <View style={{flex: 0.02}}></View>
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