import React from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Modal
} from 'react-native';
import { search as searchSvg } from '../assets/svgs';
import { search } from '../services/forum.service';

import AccessLevelAvatar from './AccessLevelAvatar';
import SearchCard from './SearchCard';

let styles;

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props;
    styles = setStyles(isDark);
    this.state = {
      loadingMore: false,
      loading: false,
      refreshing: false,
      showSearchResults: false
    };
  }

  componentDidMount = () => {};

  toggleSearchResults = async text => {
    console.log(text);
    /* code for results fetching and modal toggle goes here */
    search(text).then(searchResult => {
      console.log('result: ', searchResult);
      this.searchResults = searchResult.results;
    });
  };

  renderFLItem = ({ item }) => (
    <SearchCard
      item={item}
      isDark={this.props.isDark}
      appColor={this.props.appColor}
    />
  );

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  render() {
    let { isDark, appColor } = this.props;
    let { showSearchResults, loading, refreshing } = this.state;
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
          style={styles.searchInput}
          autoCapitalize={'none'}
          autoCorrect={false}
          spellCheck={false}
          placeholder={'Search...'}
          placeholderTextColor={isDark ? '#445F74' : '#97AABE'}
          returnKeyType={'search'}
          onSubmitEditing={({ nativeEvent: { text } }) =>
            this.toggleSearchResults(text)
          }
        />
        {showSearchResults && (
          <Modal
            animationType={'fade'}
            onRequestClose={this.toggleSearchResults}
            supportedOrientations={['portrait', 'landscape']}
            visible={showSearchResults}
            transparent={true}
          >
            <FlatList
              windowSize={10}
              data={this.searchResults}
              style={styles.fList}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps='handled'
              renderItem={this.renderFLItem}
              keyExtractor={item => item.toString()}
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
            />
          </Modal>
        )}
      </View>
    );
  }
}

let setStyles = isDark =>
  StyleSheet.create({
    bottomTOpacitySafeArea: {
      position: 'absolute',
      bottom: 0,
      alignSelf: 'flex-end'
    },
    modalContainer: {
      backgroundColor: '#00101d',
      flex: 1
    },
    headerText: {
      fontFamily: 'OpenSans-ExtraBold',
      fontSize: 20,
      color: isDark ? 'white' : 'black'
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 15,
      marginTop: 30,
      marginBottom: 30,
      flex: 1
    },
    searchIcon: {
      position: 'absolute',
      left: 15,
      zIndex: 2
    },
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
    }
  });
