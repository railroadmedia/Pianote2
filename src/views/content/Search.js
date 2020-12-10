/**
 * Search
 */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { ContentModel } from '@musora/models';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-navigation';

import NavigationBar from '../../components/NavigationBar';
import VerticalVideoList from '../../components/VerticalVideoList';
import { searchContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class Search extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      filterSize: new Animated.Value(fullHeight * 0.225),
      recentSearchResults: [],

      searchResults: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      isLoadingAll: false, // all lessons
      isPaging: false, // scrolling more
      filtering: false, // filtering
      filters: {
        types: [],
        displayTopics: [],
        topics: [],
        level: [],
        progress: [],
        instructors: []
      },

      searchEntered: false,
      showCancel: false,
      noResults: false,
      numSearchResults: null,
      searchTerm: ''
    };
  }

  async componentDidMount() {
    // get recent searches from memory
    let recentSearchResults = await AsyncStorage.getItem('recentSearches');
    if (recentSearchResults) {
      recentSearchResults = await JSON.parse(recentSearchResults);
      this.setState({ recentSearchResults });
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
            borderBottomWidth: 1.25 * factorRatio,
            borderBottomColor: colors.thirdBackground,
            borderTopWidth: 1.25 * factorRatio,
            borderTopColor: colors.thirdBackground
          }}
        >
          <TouchableOpacity
            onPress={() => this.clickSearchRecent(row[0])}
            style={{
              justifyContent: 'center',
              paddingLeft: 15
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 18 * factorRatio,
                fontWeight: '700',
                fontFamily: 'OpenSans-Regular',
                paddingVertical: 10
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
            justifyContent: 'center',
            paddingLeft: 15,
            borderTopWidth: 1 * factorRatio,
            borderTopColor: colors.secondBackground
          }}
        >
          <Text
            style={{
              fontSize: 18 * factorRatio,
              fontFamily: 'OpenSans-Regular',
              fontWeight: 'bold',
              color: 'white',
              padding: 10
            }}
          >
            No Recent Searches
          </Text>
        </View>
      );
    }
  }

  search = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let term = this.state.searchTerm;
    if (term.length > 0) {
      var isNewTerm = true;

      if (this.state.searchResults == 0) {
        this.setState({ isLoadingAll: true });
      }

      for (i in this.state.recentSearchResults) {
        if (this.state.recentSearchResults[i][0] == term) {
          isNewTerm = false;
        }
      }

      if (isNewTerm) {
        if (this.state.recentSearchResults.length > 7) {
          this.state.recentSearchResults.pop(
            this.state.recentSearchResults.length
          );
        }
        await this.state.recentSearchResults.unshift([term, Date.now()]);
        await AsyncStorage.setItem(
          'recentSearches',
          JSON.stringify(this.state.recentSearchResults)
        );
        this.setState({
          recentSearchResults: this.state.recentSearchResults
        });
      }

      let response = await searchContent(
        term,
        this.state.page,
        this.state.filters
      );

      if (response.data.length == 0) {
        this.setState({
          searchEntered: false,
          isLoadingAll: false,
          noResults: true,
          showCancel: true
        });
      } else {
        let newContent = await response.data.map(data => {
          return new ContentModel(data);
        });

        let items = [];
        for (let i in newContent) {
          items.push({
            title: newContent[i].getField('title'),
            artist: this.getArtist(newContent[i]),
            thumbnail: newContent[i].getData('thumbnail_url'),
            type: newContent[i].post.type,
            publishedOn:
              newContent[i].publishedOn.slice(0, 10) +
              'T' +
              newContent[i].publishedOn.slice(11, 16),
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
            mobile_app_url: newContent[i].post.mobile_app_url,
            lesson_count: newContent[i].post.lesson_count,
            currentLessonId: newContent[i].post?.song_part_id,
            like_count: newContent[i].post.like_count,
            duration: this.getDuration(newContent[i]),
            isLiked: newContent[i].post.is_liked_by_current_user,
            isAddedToList: newContent[i].isAddedToList,
            isStarted: newContent[i].isStarted,
            isCompleted: newContent[i].isCompleted,
            bundle_count: newContent[i].post.bundle_count,
            progress_percent: newContent[i].post.progress_percent
          });
        }

        this.setState({
          searchResults: [...this.state.searchResults, ...items],
          outVideos:
            items.length == 0 || response.data.length < 20 ? true : false,
          isLoadingAll: false,
          filtering: false,
          isPaging: false,
          searchEntered: true,
          noResults: false
        });
      }
    }
  };

  getArtist = newContent => {
    if (newContent.post.type == 'song') {
      if (typeof newContent.post.artist !== 'undefined') {
        return newContent.post.artist;
      } else {
        for (i in newContent.post.fields) {
          if (newContent.post.fields[i].key == 'artist') {
            return newContent.post.fields[i].value;
          }
        }
      }
    } else {
      if (newContent.getField('instructor') !== 'TBD') {
        return newContent.getField('instructor').fields[0].value;
      } else {
        return newContent.getField('instructor').name;
      }
    }
  };

  getDuration = newContent => {
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
    this.setState({ recentSearchResults: [] });
    await AsyncStorage.setItem(
      'recentSearches',
      JSON.stringify(this.state.recentSearchResults)
    );
  }

  clickSearchRecent = searchTerm => {
    this.setState(
      {
        searchTerm,
        showCancel: true,
        searchResults: []
      },
      () => this.search()
    );
  };

  getVideos = () => {
    // change page before getting more lessons if paging
    if (!this.state.outVideos) {
      this.setState({ page: this.state.page + 1 }, () => this.search());
    }
  };

  handleScroll = event => {
    if (
      isCloseToBottom(event) &&
      !this.state.isPaging &&
      !this.state.outVideos
    ) {
      this.setState(
        {
          page: this.state.page + 1,
          isPaging: true
        },
        () => this.search()
      );
    }
  };

  filterResults = async () => {
    // function to be sent to filters page
    await this.props.navigation.navigate('FILTERS', {
      filters: this.state.filters,
      type: 'SEARCH',
      onGoBack: filters => this.changeFilters(filters)
    });
  };

  changeFilters = filters => {
    // after leaving filter page. set filters here
    this.setState(
      {
        searchResults: [],
        outVideos: false,
        page: 1,
        filters:
          filters.type == 0 &&
          filters.instructors.length == 0 &&
          filters.level.length == 0 &&
          filters.progress.length == 0 &&
          filters.topics.length == 0
            ? {
                displayTopics: [],
                level: [],
                topics: [],
                progress: [],
                instructors: []
              }
            : filters
      },
      () => this.search()
    );
  };

  render() {
    return (
      <SafeAreaView
        forceInset={{
          bottom: 'never'
        }}
        style={{ flex: 1, backgroundColor: colors.mainBackground }}
      >
        <View style={{ backgroundColor: colors.thirdBackground }}>
          <Text
            style={{
              fontSize: 22 * factorRatio,
              color: 'white',
              fontFamily: 'OpenSans-Bold',
              paddingVertical: 15,
              alignSelf: 'center'
            }}
          >
            Search
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          contentInsetAdjustmentBehavior={'never'}
          onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
          style={{
            backgroundColor: colors.mainBackground,
            flex: 1
          }}
        >
          <View style={{ height: fullHeight * 0.05 }} />
          <View
            key={'searchBox'}
            style={{
              flexDirection: 'row',
              paddingLeft: 15
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: '#f3f6f6',
                borderRadius: 60 * factorHorizontal,
                flexDirection: 'row'
              }}
            >
              <View
                style={[styles.centerContent, { width: 40 * factorHorizontal }]}
              >
                <EvilIcons
                  name={'search'}
                  size={27.5 * factorRatio}
                  color={
                    this.props.currentPage == 'SEARCH' ? '#fb1b2f' : 'grey'
                  }
                />
              </View>
              <TextInput
                ref={searchTerm => {
                  this.searchTerm = searchTerm;
                }}
                placeholder={'Type your search...'}
                placeholderTextColor={'grey'}
                onChangeText={searchTerm => this.setState({ searchTerm })}
                onSubmitEditing={() => {
                  this.setState({
                    showCancel: true,
                    searchResults: []
                  }),
                    this.search(this.state.searchTerm);
                }}
                returnKeyType={'search'}
                style={{
                  flex: 0.9,
                  color: 'grey',
                  justifyContent: 'center',
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 16 * factorRatio
                }}
              />
            </View>
            <View
              style={[
                styles.centerContent,
                {
                  paddingRight:
                    this.state.showCancel || this.state.searchTerm.length > 0
                      ? 0
                      : 15
                }
              ]}
            >
              {(this.state.showCancel || this.state.searchTerm.length > 0) && (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingHorizontal: 5,
                    justifyContent: 'center'
                  }}
                  onPress={() => {
                    this.searchTerm.clear();
                    this.setState({
                      searchTerm: '',
                      searchResults: [],
                      searchEntered: false,
                      showCancel: false,
                      noResults: false,
                      isLoadingAll: false
                    });
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 12 * factorRatio,
                      color: '#fb1b2f',
                      fontFamily: 'OpenSans-Bold'
                    }}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{ height: fullHeight * 0.02 }} />
          <View
            key={'recentSearches'}
            style={[
              styles.centerContent,
              {
                flexDirection: 'row',
                justifyContent: 'space-between'
              }
            ]}
          >
            {(!this.state.searchEntered ||
              this.state.searchResults.length > 0) && (
              <Text
                style={{
                  paddingLeft: 15,
                  fontFamily: 'OpenSans-Bold',
                  fontSize: 18 * factorRatio,
                  color: colors.secondBackground
                }}
              >
                RECENT
              </Text>
            )}
            {(this.state.searchTerm.length > 0 ||
              !this.state.searchEntered ||
              this.state.searchResults.length > 0) && (
              <TouchableOpacity
                onPress={() => this.clearRecent()}
                style={[
                  styles.centerContent,
                  {
                    paddingRight: 15
                  }
                ]}
              >
                <Text
                  style={{
                    fontSize: 14 * factorRatio,
                    color: colors.pianoteRed,
                    textAlign: 'right',
                    fontFamily: 'OpenSans-Regular',
                    marginTop: 3 * factorVertical
                  }}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ height: fullHeight * 0.015 }} />
          <View style={{ flex: 1 }}>
            {!this.state.searchEntered &&
              !this.state.isLoadingAll &&
              !this.state.noResults && <View>{this.mapRecentResults()}</View>}
            {this.state.searchEntered &&
              !this.state.noResults &&
              !this.state.isLoadingAll && (
                <View>
                  <VerticalVideoList
                    items={this.state.searchResults}
                    isLoading={this.state.isLoadingAll}
                    title={`${
                      this.state.searchResults.length + ' '
                    }SEARCH RESULTS`}
                    showFilter={true}
                    isPaging={this.state.isPaging}
                    showType={true}
                    showArtist={true}
                    showSort={false}
                    showLength={false}
                    filters={this.state.filters}
                    imageRadius={5 * factorRatio}
                    containerBorderWidth={0}
                    containerWidth={fullWidth}
                    currentSort={this.state.currentSort}
                    changeSort={sort => this.changeSort(sort)}
                    filterResults={() => this.filterResults()}
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
                  />
                  <View
                    style={{
                      height: 10 * factorVertical
                    }}
                  />
                </View>
              )}
            {this.state.isLoadingAll && (
              <View
                style={[
                  styles.centerContent,
                  {
                    flex: 1,
                    marginTop: 15 * factorRatio
                  }
                ]}
              >
                <ActivityIndicator
                  size={onTablet ? 'large' : 'small'}
                  animating={true}
                  color={colors.secondBackground}
                />
              </View>
            )}
            {!this.state.isLoadingAll && this.state.noResults && (
              <View
                key={'noResults'}
                style={{
                  flex: 1,
                  borderTopWidth: 1 * factorRatio,
                  borderTopColor: colors.secondBackground
                }}
              >
                <Text
                  style={{
                    fontSize: 18 * factorRatio,
                    fontFamily: 'OpenSans-Bold',
                    color: 'white',
                    paddingLeft: 15
                  }}
                >
                  No Results
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <NavigationBar currentPage={'SEARCH'} />
      </SafeAreaView>
    );
  }
}
