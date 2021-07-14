import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  StyleSheet
} from 'react-native';
import Icon from '../../assets/icons';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-navigation';
import NavigationBar from '../../components/NavigationBar';
import VerticalVideoList from '../../components/VerticalVideoList';
import { searchContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const onTablet = global.onTablet;
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
      isLoadingAll: false,
      isPaging: false,
      filtering: false,
      searchEntered: false,
      showCancel: false,
      noResults: false,
      numSearchResults: null,
      page: 1,
      currentSort: 'newest',
      searchTerm: ''
    };
    const url = props.route?.params?.url;
    if (url && url.includes('term=')) {
      let searchedText = url.split('term=')[1];
      searchedText = searchedText.split('+').join(' ');
      this.state.searchTerm = searchedText;
      this.search();
    }
  }

  async componentDidMount() {
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
            onPress={() =>
              this.setState(
                {
                  searchTerm: row[0],
                  showCancel: true,
                  searchResults: []
                },
                () => this.search()
              )
            }
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
            paddingLeft: 10,
            borderTopWidth: 0.5,
            borderTopColor: colors.secondBackground
          }}
        >
          <Text
            style={{
              fontSize: onTablet ? 20 : 14,
              fontFamily: 'OpenSans-Bold',
              color: 'white',
              paddingTop: 10
            }}
          >
            No Recent Searches
          </Text>
        </View>
      );
    }
  }

  search = async () => {
    if (this.context && !this.context.isConnected)
      return this.context.showNoConnectionAlert();

    this.setState({ filtering: true });

    let term = this.state.searchTerm;
    if (term.length > 0) {
      var isNewTerm = true;

      if (this.state.searchResults === 0) {
        this.setState({ isLoadingAll: true });
      }

      for (i in this.state.recentSearchResults) {
        if (this.state.recentSearchResults[i][0] === term) {
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
      if (response.data.length === 0) {
        this.setState({
          searchEntered: false,
          isLoadingAll: false,
          noResults: true,
          showCancel: true
        });
      } else {
        this.metaFilters = response?.meta?.filterOptions;
        let newContent = response.data;

        this.setState({
          searchResults: [...this.state.searchResults, ...newContent],
          isLoadingAll: false,
          filtering: false,
          isPaging: false,
          searchEntered: true,
          noResults: false
        });
      }
    }
  };

  async clearRecent() {
    await this.setState({ recentSearchResults: [] });
    await AsyncStorage.setItem(
      'recentSearches',
      JSON.stringify(this.state.recentSearchResults)
    );
  }

  handleScroll = event => {
    if (isCloseToBottom(event) && !this.state.isPaging) {
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
                paddingLeft: 10
              }}
            >
              <View style={styles.searchBox}>
                <View
                  style={[styles.centerContent, { width: onTablet ? 60 : 40 }]}
                >
                  <Icon.EvilIcons
                    name={'search'}
                    size={onTablet ? 35 : 25}
                    color={
                      this.props.currentPage === 'SEARCH'
                        ? colors.pianoteRed
                        : 'grey'
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
                    paddingVertical: 10,
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
                        : 10
                  }
                ]}
              >
                {(this.state.showCancel ||
                  this.state.searchTerm.length > 0) && (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
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
                        color: colors.pianoteRed,
                        fontFamily: 'OpenSans-Bold'
                      }}
                    >
                      CANCEL
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {this.state.searchResults.length === 0 && (
              <View style={[styles.centerContent, styles.recentSearches]}>
                {(!this.state.searchEntered ||
                  this.state.searchResults.length > 0) && (
                  <Text
                    style={{
                      paddingLeft: 10,
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
                    style={[styles.centerContent, { paddingRight: 10 }]}
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
                !this.state.noResults &&
                this.mapRecentResults()}
              {this.state.searchEntered &&
                !this.state.noResults &&
                !this.state.isLoadingAll && (
                  <View
                    style={{
                      paddingVertical: 10
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
                      applyFilters={filters =>
                        new Promise(res =>
                          this.setState({ searchResults: [], page: 1 }, () => {
                            this.filterQuery = filters;
                            this.search().then(res);
                          })
                        )
                      }
                    />
                  </View>
                )}
              {this.state.isLoadingAll && (
                <View
                  style={[styles.centerContent, { flex: 1, marginTop: 10 }]}
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
                      paddingLeft: 10
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

const styles = StyleSheet.create({
  modalContainer: {
    // simple container for modals
    margin: 0,
    flex: 1
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#f3f6f6',
    borderRadius: 100,
    flexDirection: 'row'
  },
  recentSearches: {
    marginTop: '2%',
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  mainContainer: {
    backgroundColor: '#00101d',
    flex: 1
  },
  packsContainer: {
    flex: 1,
    backgroundColor: '#081826'
  },
  childHeaderText: {
    fontSize: onTablet ? 28 : 20,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold',
    alignSelf: 'center',
    textAlign: 'center'
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#081826',
    padding: 10
  },
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
});
