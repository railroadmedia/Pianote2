import React from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Modal
} from 'react-native';
import { search as searchSvg } from '../assets/svgs';
import { search } from '../services/forum.service';
import Icon from '../../../assets/icons.js';
import Back from '../../../assets/img/svgs/back.svg';
import NavigationHeader from '../../src/commons/NavigationHeader';

export default class Search extends React.Component {
  state = { showSearchResults: false };
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

  componentDidMount = () => {};

  toggleSearchResults = async text => {
    /* code for results fetching and modal toggle goes here */
    let results = await search('piano thread');
    console.log('result: ', results);
    this.setState({ showSearchResults: true });
  };

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  render() {
    let { isDark } = this.props;
    let { loadingMore, showSearchResults, loading, refreshing } = this.state;
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
        <Modal
          animationType={'fade'}
          onRequestClose={this.toggleSearchResults}
          supportedOrientations={['portrait', 'landscape']}
          visible={showSearchResults}
        >
          <SafeAreaView style={styles.modalContainer} activeOpacity={1}>
            <NavigationHeader
              {...this.props}
              navigation={{
                goBack: () => this.setState({ showSearchResults: false })
              }}
              title={'All Forums'}
              route={{ name: 'Search', params: { isDark: true } }}
              onToggleSign={signShown => this.setState({ signShown })}
            />
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
                returnKeyType='search'
                onSubmitEditing={({ nativeEvent: { text } }) =>
                  this.toggleSearchResults(text)
                }
              />
              {/* 
              {loading ? (
                <ActivityIndicator
                  size='large'
                  color={appColor}
                  animating={true}
                  style={styles.loading}
                />
              ) : (
                <FlatList
                  windowSize={10}
                  data={this.followedThreads}
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
                    <Text style={styles.emptyList}>
                      You don't follow any threads
                    </Text>
                  }
                  ListFooterComponent={
                    <View
                      style={{
                        borderTopWidth: 1,
                        borderColor: '#445F74',
                        marginHorizontal: 15,
                        marginBottom: 10
                      }}
                    >
                      <Pagination
                        active={this.page}
                        isDark={isDark}
                        appColor={appColor}
                        length={this.followedThreadsTotal}
                        onChangePage={this.changePage}
                      />
                      <ActivityIndicator
                        size='small'
                        color={appColor}
                        animating={loadingMore}
                        style={{ padding: 15 }}
                      />
                    </View>
                  }
                  ListHeaderComponent={
                    <>
                      {this.discussions.map(item =>
                        this.renderDiscussion(item)
                      )}
                    </>
                  }
                />
              )}
               */}
            </View>
          </SafeAreaView>
        </Modal>
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
