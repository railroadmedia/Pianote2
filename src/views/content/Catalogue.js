import React from 'react';
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Filters_V2 from '../../components/Filters_V2';
import Sort from '../../components/Sort';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';

import { getContent, getAll } from '../../services/catalogue.service';

import { Contexts } from '../../context/CombinedContexts';

import {
  navigate,
  refreshOnFocusListener,
  currentScene
} from '../../../AppNavigator';

let styles;

export default class Catalogue extends React.Component {
  page = 1;
  scene = currentScene();
  data = { method: {}, inProgress: [], all: [] };
  flatListCols = onTablet ? 3 : 1;
  static contextType = Contexts;

  constructor(props) {
    super(props);
    styles = setStyles(props.theme === 'light');
    this.state = {
      loading: true,
      loadingMore: false,
      refreshing: true,
      filtering: false,
      sorting: false
    };
  }

  componentDidMount() {
    this.refreshOnFocusListener = refreshOnFocusListener.call(this);
    this.refreshPromise = this.setData('refresh').then(
      () => delete this.refreshPromise
    );
  }

  componentWillUnmount() {
    this.refreshOnFocusListener?.();
  }

  getServiceOptions = action => {
    let options = { scene: this.scene };
    options.page = action === 'loadMore' ? ++this.page : (this.page = 1);
    if (action !== 'refresh') {
      options.filters = this.filterRef?.filterQuery;
      options.sort = this.sortRef?.sortQuery;
      options.signal = (this[`${action}Abort`] = new AbortController()).signal;
    }
    return options;
  };

  setData = (action, state = { loading: false, refreshing: false }) =>
    (action === 'refresh' ? getContent : getAll)(
      this.getServiceOptions(action)
    ).then(({ method, all, inProgress }) => {
      if (all.aborted) return;
      if (action === 'refresh') {
        if (this.filterRef) this.filterRef.appliedFilters = {};
        if (this.sortRef) this.sortRef.sortIndex = 0;
        this.data = { method, inProgress: inProgress.data };
      }
      if (action === 'loadMore') this.data.all?.push(...(all.data || []));
      else this.data.all = all.data;
      this.metaFilters = all?.meta?.filterOptions || this.metaFilters;
      this.setState(state);
    });

  filter = () =>
    new Promise(res => {
      this.setState({ filtering: true });
      this.setData('filter', { filtering: false }).then(res);
    });

  sort = () => {
    this.setState({ sorting: true });
    this.setData('sort', { sorting: false });
  };

  loadMore = async () => {
    if (this.preventLoadingMore) return;
    this.preventLoadingMore = true;
    this.setState({ loadingMore: true });
    if (this.refreshPromise) await this.refreshPromise;
    this.setData('loadMore', { loadingMore: false }).then(
      () => delete this.preventLoadingMore
    );
  };

  refresh = () => {
    this.filterAbort?.abort();
    this.loadMoreAbort?.abort();
    this.sortAbort?.abort();
    this.setState({
      refreshing: true,
      loadingMore: false,
      filtering: false,
      sorting: false
    });
    this.refreshPromise = this.setData('refresh').then(
      () => delete this.refreshPromise
    );
  };

  renderFLItem = ({ item, index }) => (
    <View
      style={{
        width: `${100 / this.flatListCols}%`,
        paddingRight: onTablet ? ((index + 1) % this.flatListCols ? 0 : 10) : 0
      }}
    >
      <Card
        data={item}
        type={onTablet ? 'compact' : 'row'}
        onNavigate={navigate}
      />
    </View>
  );

  renderFLHeader = () => {
    let {
      method: {
        id: methodId,
        completed,
        started,
        banner_button_url,
        banner_background_image
      } = {},
      inProgress
    } = this.data;
    let { refreshing, filtering, sorting, loadingMore } = this.state;
    let filterAndSortDisabled =
      refreshing || filtering || sorting || loadingMore;
    return (
      <>
        {this.scene === 'HOME' && !!methodId && (
          <ImageBackground
            resizeMode={'cover'}
            style={{
              width: '100%',
              aspectRatio: onTablet ? (this.context.isLandscape ? 2.5 : 1.8) : 1
            }}
            source={{
              uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:good,c_fill,g_face/${banner_background_image}`
            }}
          >
            <LinearGradient
              colors={[
                'transparent',
                'transparent',
                'rgba(80, 15, 25, 0.4)',
                'rgba(80, 15, 25, 0.98)'
              ]}
              style={styles.linearGradient}
            >
              <Image
                style={{ height: '20%', aspectRatio: 801 / 286 }}
                source={require('../../assets/img/imgs/pianote-method.png')}
                resizeMode={'contain'}
              />
              <View style={styles.headerBtnsContainer}>
                {[
                  {
                    text: completed ? 'RESET' : started ? 'CONTINUE' : 'START',
                    icon: completed ? 'replay' : 'play',
                    action: () =>
                      completed
                        ? ''
                        : navigate('VIDEOPLAYER', { url: banner_button_url })
                  },
                  {
                    text: 'MORE INFO',
                    icon: 'arrow-right',
                    moreInfo: true,
                    action: () =>
                      navigate('METHOD', {
                        methodIsStarted: started,
                        methodIsCompleted: completed
                      })
                  }
                ].map(to => (
                  <TouchableOpacity
                    key={to.text}
                    onPress={to.action}
                    style={[
                      styles.headerBtn,
                      {
                        backgroundColor: to.moreInfo ? '' : '#fb1b2f',
                        padding: to.moreInfo ? 7 : 9,
                        borderWidth: to.moreInfo ? 2 : 0
                      }
                    ]}
                  >
                    <Icon name={to.icon} size={30} color={'white'} />
                    <Text style={styles.headerBtnText}>{to.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </ImageBackground>
        )}
        {!!inProgress?.length && (
          <>
            <View style={styles.flSectionHeaderContainer}>
              <Text style={styles.flSectionHeaderText}>IN PROGRESS</Text>
              <TouchableOpacity
                onPress={() =>
                  navigate('SEEALL', { title: 'Continue', parent: this.scene })
                }
              >
                <Text style={{ fontSize: 14, color: '#fb1b2f' }}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              windowSize={10}
              data={inProgress}
              horizontal={true}
              initialNumToRender={1}
              maxToRenderPerBatch={10}
              onEndReachedThreshold={0.01}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{
                width: `${(onTablet ? 30 : 70) * inProgress?.length}%`
              }}
              renderItem={({ item, index }) => (
                <View style={{ width: `${100 / inProgress?.length}%` }}>
                  <View
                    style={{
                      width: `${100 * inProgress?.length}%`,
                      paddingRight: index === inProgress?.length - 1 ? 10 : 0
                    }}
                  >
                    <Card data={item} type={'compact'} onNavigate={navigate} />
                  </View>
                </View>
              )}
              keyExtractor={({ id }) => id.toString()}
            />
          </>
        )}
        <View style={styles.flSectionHeaderContainer}>
          <Text style={styles.flSectionHeaderText}>ALL LESSONS</Text>
          <Sort
            disabled={filterAndSortDisabled}
            onSort={this.sort}
            ref={r => (this.sortRef = r)}
          />
          <Filters_V2
            disabled={filterAndSortDisabled}
            onApply={this.filter}
            meta={this.metaFilters}
            ref={r => (this.filterRef = r)}
          />
        </View>
      </>
    );
  };

  render() {
    console.log('rr cat');
    let { scene, data } = this;
    let { loading, loadingMore, refreshing, filtering, sorting } = this.state;
    let backgroundColor = scene === 'HOME' ? 'black' : '#00101d';
    return (
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator
            size='large'
            style={{ backgroundColor, flex: 1 }}
            color={'#6e777a'}
          />
        ) : (
          <FlatList
            windowSize={10}
            data={data.all}
            style={{ flex: 1, backgroundColor }}
            initialNumToRender={1}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.01}
            removeClippedSubviews={true}
            numColumns={this.flatListCols}
            keyboardShouldPersistTaps='handled'
            ListHeaderComponent={this.renderFLHeader}
            renderItem={this.renderFLItem}
            onEndReached={this.loadMore}
            keyExtractor={({ id }) => id.toString()}
            ListEmptyComponent={<Text style={{}}>No Content</Text>}
            ListFooterComponent={
              <ActivityIndicator
                size='small'
                color={'#6e777a'}
                animating={loadingMore}
                style={{ padding: 15 }}
              />
            }
            refreshControl={
              <RefreshControl
                colors={['#6e777a']}
                tintColor={'#6e777a'}
                onRefresh={this.refresh}
                refreshing={refreshing}
              />
            }
          />
        )}
        {(filtering || sorting) && (
          <LinearGradient
            colors={['rgba(80, 15, 25, 0.98)', 'transparent']}
            style={{ position: 'absolute', width: '100%' }}
          >
            <ActivityIndicator size='large' style={{}} color={'#6e777a'} />
          </LinearGradient>
        )}
      </View>
    );
  }
}
let setStyles = isLight =>
  StyleSheet.create({
    headerBtnsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 600,
      marginBottom: '5%'
    },
    headerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '40%',
      justifyContent: 'center',
      borderRadius: 99,
      margin: 10,
      marginLeft: 0,
      borderColor: 'white'
    },
    headerBtnText: {
      color: 'white',
      fontFamily: 'RobotoCondensed-Bold'
    },
    linearGradient: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    flSectionHeaderContainer: {
      flexDirection: 'row',
      padding: 10,
      paddingBottom: 0,
      alignItems: 'center'
    },
    flSectionHeaderText: {
      fontSize: 18,
      flex: 1,
      fontFamily: 'RobotoCondensed-Bold',
      color: 'white'
    }
  });
