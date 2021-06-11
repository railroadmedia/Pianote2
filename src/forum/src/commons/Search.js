import React from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { connect, batch } from 'react-redux';
import { bindActionCreators } from 'redux';

import Pagination from './Pagination';
import SearchCard from './SearchCard';

import { search, connection } from '../services/forum.service';

import { setSearchThreads } from '../redux/ThreadActions';

import { search as searchSvg, arrowLeft } from '../assets/svgs';

let styles;
class Search extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props;
    styles = setStyles(isDark);
    this.state = {
      loadingMore: false,
      loading: true,
      refreshing: false,
      showSearchResults: false
    };
  }

  renderFLItem = ({ item }) => (
    <SearchCard
      onNavigate={() => {
        this.closeModal();
        this.props.navigation.navigate('Thread', {
          threadId: item.thread_id,
          title: item.thread.title,
          postId: item.id
        });
      }}
      item={item}
      isDark={this.props.isDark}
      appColor={this.props.appColor}
    />
  );

  renderSearchInput = () => {
    let { isDark } = this.props;
    return (
      <View style={styles.inputContainer}>
        <View style={styles.searchIcon}>
          {searchSvg({
            height: 15,
            width: 15,
            fill: isDark ? '#445F74' : '#97AABE'
          })}
        </View>
        <TextInput
          ref={r => (this.textInputRef = r)}
          style={styles.searchInput}
          autoCapitalize={'none'}
          autoCorrect={false}
          spellCheck={false}
          placeholder={'Search...'}
          placeholderTextColor={isDark ? '#445F74' : '#97AABE'}
          returnKeyType={'search'}
          onSubmitEditing={({ nativeEvent: { text } }) => {
            this.textInputRef.clear();
            if (connection(true) && text)
              this.setState({ showSearchResults: true, loading: true }, () =>
                this.searchPosts(text)
              );
          }}
        />
      </View>
    );
  };

  changePage = page => {
    if (!connection(true)) return;
    this.page = page;
    this.setState({ loadingMore: true }, this.searchPosts);
  };

  searchPosts = (text = this.searchText) =>
    search(text, this.page).then(searchResult => {
      this.searchResults = searchResult.results;
      this.searchText = text;
      this.searchTotal = searchResult.total_results;
      this.flatListRef?.scrollToOffset({ offset: 0, animated: false });
      batch(() => {
        this.props.setSearchThreads(searchResult.results.map(r => r.thread));
        this.setState({
          loading: false,
          loadingMore: false,
          refreshing: false
        });
      });
    });

  closeModal = () =>
    this.setState({ showSearchResults: false }, () =>
      ['page', 'searchResults', 'searchText', 'searchTotal'].map(
        item => delete this[item]
      )
    );

  refresh = () => {
    if (!connection()) return;
    this.setState({ refreshing: true }, this.searchPosts);
  };

  render() {
    let { isDark, appColor } = this.props;
    let { showSearchResults, loading, refreshing, loadingMore } = this.state;
    return (
      <>
        {this.renderSearchInput()}
        {showSearchResults && (
          <Modal
            animationType={'fade'}
            onRequestClose={this.closeModal}
            supportedOrientations={['portrait', 'landscape']}
            visible={showSearchResults}
            transparent={false}
            style={{ backgroundColor: 'red' }}
          >
            <SafeAreaView style={styles.safeArea}>
              <TouchableOpacity
                style={styles.navHeader}
                onPress={this.closeModal}
              >
                {arrowLeft({ height: 20, fill: isDark ? 'white' : 'black' })}
                <Text style={styles.navHeaderTitle}>All Forums</Text>
              </TouchableOpacity>
              {loading ? (
                <ActivityIndicator
                  size='large'
                  color={appColor}
                  animating={loading}
                  style={{ flex: 1 }}
                />
              ) : (
                <FlatList
                  windowSize={10}
                  data={this.searchResults}
                  style={styles.fList}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  removeClippedSubviews={true}
                  keyboardShouldPersistTaps='handled'
                  renderItem={this.renderFLItem}
                  keyExtractor={item => item.id.toString()}
                  ref={r => (this.flatListRef = r)}
                  refreshControl={
                    <RefreshControl
                      colors={[appColor]}
                      tintColor={appColor}
                      onRefresh={this.refresh}
                      refreshing={refreshing}
                    />
                  }
                  ListEmptyComponent={
                    <Text style={styles.emptyList}>No Results</Text>
                  }
                  ListHeaderComponent={
                    <>
                      {this.renderSearchInput()}
                      {this.searchText && (
                        <Text style={styles.resultText}>
                          Showing results for{' '}
                          <Text style={{ fontFamily: 'OpenSans-BoldItalic' }}>
                            "{this.searchText}"
                          </Text>{' '}
                          in All Forums
                        </Text>
                      )}
                    </>
                  }
                  ListFooterComponent={
                    !!this.searchTotal && (
                      <View style={styles.footerContainer}>
                        <Pagination
                          active={this.page}
                          isDark={isDark}
                          appColor={appColor}
                          length={this.searchTotal}
                          onChangePage={this.changePage}
                        />
                        <ActivityIndicator
                          size='small'
                          color={appColor}
                          animating={loadingMore}
                          style={{ padding: 15 }}
                        />
                      </View>
                    )
                  }
                />
              )}
            </SafeAreaView>
          </Modal>
        )}
      </>
    );
  }
}

let setStyles = isDark =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: isDark ? '#00101D' : 'white' },
    navHeader: {
      paddingHorizontal: 15,
      paddingVertical: 20,
      justifyContent: 'center'
    },
    navHeaderTitle: {
      fontFamily: 'OpenSans',
      fontSize: 20,
      fontWeight: '900',
      color: isDark ? 'white' : 'black',
      textAlign: 'center',
      position: 'absolute',
      alignSelf: 'center'
    },
    headerText: {
      fontFamily: 'OpenSans-ExtraBold',
      fontSize: 20,
      color: isDark ? 'white' : 'black'
    },
    resultText: {
      fontFamily: 'OpenSans-Italic',
      color: isDark ? 'white' : 'black',
      padding: 15
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 15,
      marginTop: 30
    },
    searchIcon: { position: 'absolute', left: 15, zIndex: 2 },
    searchInput: {
      color: '#000000',
      fontSize: 12,
      fontFamily: 'OpenSans',
      flex: 1,
      height: 35,
      borderRadius: 25,
      paddingLeft: 40,
      color: isDark ? '#445F74' : '#97AABE',
      backgroundColor: isDark ? '#F7F9FC' : '#E1E6EB'
    },
    emptyList: {
      color: isDark ? '#445F74' : 'black',
      fontFamily: 'OpenSans',
      padding: 15
    },
    footerContainer: {
      borderTopWidth: 1,
      borderColor: '#445F74',
      marginHorizontal: 15,
      marginBottom: 10
    }
  });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setSearchThreads }, dispatch);
export default connect(
  null,
  mapDispatchToProps
)(props => <Search {...props} navigation={useNavigation()} />);
