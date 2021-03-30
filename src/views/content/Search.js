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
  Dimensions,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { ContentModel } from '@musora/models';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-navigation';
import NavigationBar from '../../components/NavigationBar';
import VerticalVideoList from '../../components/VerticalVideoList';
import { searchContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class Search extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      recentSearchResults: [],

      searchResults: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      isLoadingAll: false, // all lessons
      isPaging: false, // scrolling more
      filtering: false, // filtering
      searchEntered: false,
      showCancel: false,
      noResults: false,
      numSearchResults: null,
      searchTerm: ''
    };
    const url = props.route?.params?.url;
    if (url && url.includes('term=')) {
      let searchedText = url.substring(url.indexOf('term=') + 5, url.length);
      searchedText = searchedText.split('+').join(' ');
      this.state.searchTerm = searchedText;
      this.search();
    }
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
            borderBottomWidth: 0,
            borderTopWidth: 1.25,
            borderBottomColor: colors.thirdBackground,
            borderTopColor: colors.thirdBackground
          }}
        >
          <TouchableOpacity
            onPress={() => this.clickSearchRecent(row[0])}
            style={{
              justifyContent: 'center',
              paddingLeft: 10
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: onTablet ? 20 : 14,
                fontFamily: 'OpenSans-Bold',
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
          style={{
            justifyContent: 'center',
            paddingLeft: paddingInset,
            borderTopWidth: 0.5,
            borderTopColor: colors.secondBackground
          }}
        >
          <Text
            style={{
              fontSize: onTablet ? 20 : 14,
              fontFamily: 'OpenSans-Regular',
              fontWeight: 'bold',
              color: 'white',
              paddingTop: paddingInset
            }}
          >
            No Recent Searches
          </Text>
        </View>
      );
    }
  }

  search = async () => {
    if (this.context && !this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    this.setState({ filtering: true });

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
        this.filterQuery
      );
      if (response.data.length == 0) {
        this.setState({
          searchEntered: false,
          isLoadingAll: false,
          noResults: true,
          showCancel: true
        });
      } else {
        this.metaFilters = response?.meta?.filterOptions;
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
      try {
        if (newContent.getField('instructor') !== 'TBD') {
          return newContent.getField('instructor').fields[0].value;
        } else {
          return newContent.getField('instructor').name;
        }
      } catch (error) {
        return '';
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
    } catch (error) {}
  };

  async clearRecent() {
    await this.setState({ recentSearchResults: [] });
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

  render() {
    return (
      <SafeAreaView
        forceInset={{ bottom: 'never' }}
        style={styles.packsContainer}
      >
        <StatusBar
          backgroundColor={colors.thirdBackground}
          barStyle={'light-content'}
        />
        <View style={styles.packsContainer}>
          <View style={[styles.childHeader, styles.centerContent]}>
            <Text style={styles.childHeaderText}>Search</Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            contentInsetAdjustmentBehavior={'never'}
            onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
            style={styles.mainContainer}
          >
            <View
              style={{
                marginTop: onTablet ? '3%' : '4%',
                flexDirection: 'row',
                paddingLeft: paddingInset
              }}
            >
              <View style={styles.searchBox}>
                <View
                  style={[styles.centerContent, { width: onTablet ? 60 : 40 }]}
                >
                  <EvilIcons
                    name={'search'}
                    size={onTablet ? 35 : 25}
                    color={
                      this.props.currentPage == 'SEARCH' ? '#fb1b2f' : 'grey'
                    }
                  />
                </View>
                <TextInput
                  ref={searchTerm => (this.searchTerm = searchTerm)}
                  placeholder={'Type your search...'}
                  placeholderTextColor={'grey'}
                  onChangeText={searchTerm => this.setState({ searchTerm })}
                  returnKeyType={'search'}
                  style={{
                    flex: 0.9,
                    color: 'grey',
                    paddingVertical: paddingInset,
                    justifyContent: 'center',
                    fontFamily: 'OpenSans-Regular',
                    fontSize: onTablet ? 20 : 16
                  }}
                  onSubmitEditing={() => {
                    this.setState({
                      showCancel: true,
                      searchResults: []
                    }),
                      this.search(this.state.searchTerm);
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
                        : paddingInset
                  }
                ]}
              >
                {(this.state.showCancel ||
                  this.state.searchTerm.length > 0) && (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingHorizontal: paddingInset,
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
                        fontSize: onTablet ? 16 : 12,
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
            {this.state.searchResults.length == 0 && (
              <View style={[styles.centerContent, styles.recentSearches]}>
                {(!this.state.searchEntered ||
                  this.state.searchResults.length > 0) && (
                  <Text
                    style={{
                      paddingLeft: paddingInset,
                      fontFamily: 'OpenSans-Bold',
                      fontSize: onTablet ? 22 : 16,
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
                        paddingRight: paddingInset
                      }
                    ]}
                  >
                    {!this.state.filtering && (
                      <Text
                        style={{
                          fontSize: onTablet ? 18 : 14,
                          color: colors.pianoteRed,
                          textAlign: 'right',
                          fontFamily: 'OpenSans-Regular'
                        }}
                      >
                        Clear
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View style={{ flex: 1, marginBottom: '2%' }}>
              {!this.state.searchEntered &&
                !this.state.isLoadingAll &&
                !this.state.noResults && <View>{this.mapRecentResults()}</View>}
              {this.state.searchEntered &&
                !this.state.noResults &&
                !this.state.isLoadingAll && (
                  <View
                    style={{
                      paddingVertical: paddingInset
                    }}
                  >
                    <VerticalVideoList
                      items={this.state.searchResults}
                      isLoading={this.state.isLoadingAll}
                      title={`${
                        this.state.searchResults.length + ' '
                      }SEARCH RESULTS`}
                      showFilter={false}
                      isPaging={this.state.isPaging}
                      showType={true}
                      showArtist={true}
                      showSort={false}
                      showLength={false}
                      filters={this.metaFilters}
                      currentSort={this.state.currentSort}
                      changeSort={sort => this.changeSort(sort)}
                      imageWidth={(onTablet ? 0.225 : 0.3) * width}
                      outVideos={this.state.outVideos} // if paging and out of videos
                      applyFilters={filters =>
                        new Promise(res =>
                          this.setState(
                            {
                              searchResults: [],
                              outVideos: false,
                              page: 1
                            },
                            () => {
                              this.filterQuery = filters;
                              this.search().then(res);
                            }
                          )
                        )
                      }
                    />
                  </View>
                )}
              {this.state.isLoadingAll && (
                <View
                  style={[
                    styles.centerContent,
                    {
                      flex: 1,
                      marginTop: paddingInset
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
                    borderTopWidth: 1,
                    borderTopColor: colors.secondBackground
                  }}
                >
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: onTablet ? 20 : 16,
                      fontFamily: 'OpenSans-Bold',
                      color: 'white',
                      paddingLeft: paddingInset
                    }}
                  >
                    No Results
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        <NavigationBar currentPage={'SEARCH'} />
      </SafeAreaView>
    );
  }
}
