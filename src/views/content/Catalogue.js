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
  TouchableOpacity,
  Modal
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Filters_V2 from '../../components/Filters_V2';
import Sort from '../../components/Sort';

import { getContent, getAll } from '../../services/catalogue.service';

import { Contexts } from '../../context/CombinedContexts';

import { refreshOnFocusListener, currentScene } from '../../../AppNavigator';

let styles;

export default class Catalogue extends React.Component {
  page = 1;
  scene = currentScene();
  data = { method: {}, inProgress: [], all: [] };
  flatListCols = onTablet ? 3 : this.scene === 'STUDENTFOCUS' ? 2 : 1;
  static contextType = Contexts;

  constructor(props) {
    super(props);
    styles = setStyles(props.theme === 'light');
    this.state = {
      loading: true,
      loadingMore: false,
      refreshing: true,
      filtering: false,
      sorting: false,
      errorVisible: false
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

  connection = alert => {
    if (this.context.isConnected) return true;
    if (alert) this.context.showNoConnectionAlert();
  };

  toggleError = () =>
    this.setState(({ errorVisible }) => ({ errorVisible: !errorVisible }));

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
    ).then(({ method, all, inProgress, studentFocus }) => {
      try {
        if (all?.aborted) return;
        if (action === 'refresh') {
          if (this.filterRef) this.filterRef.appliedFilters = {};
          if (this.sortRef) this.sortRef.sortIndex = 0;
          this.data = { method, inProgress: inProgress?.data, studentFocus };
        }
        if (action === 'loadMore') this.data.all?.push(...(all.data || []));
        else this.data.all = all?.data;
        this.metaFilters = all?.meta?.filterOptions || this.metaFilters;
        this.setState(state);
      } catch (_) {
        this.toggleError();
      }
    });

  navigateTo = path => {
    if (!this.connection(true)) return;
    let { next_lesson, started, completed } = this.data.method;
    switch (path) {
      case 'methodLesson':
        return this.props.onNavigateToMethodLesson(next_lesson);
      case 'method':
        return this.props.onNavigateToMethod(started, completed);
      case 'seeAll':
        return this.props.onNavigateToSeeAll();
      default:
        return this.props.onNavigateToCard(path);
    }
  };

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
        mode={
          this.scene === 'STUDENTFOCUS'
            ? 'show'
            : this.scene === 'SONGS'
            ? 'squareRow'
            : onTablet
            ? 'compact'
            : 'row'
        }
        onNavigate={this.props.onNavigateToCard}
      />
    </View>
  );

  renderFLHeader = () => {
    let {
      method: {
        id: methodId,
        completed,
        started,
        banner_background_image
      } = {},
      inProgress,
      all
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
                    action:
                      !completed && (() => this.navigateTo('methodLesson'))
                  },
                  {
                    text: 'MORE INFO',
                    icon: 'arrow-right',
                    moreInfo: true,
                    action: () => this.navigateTo('method')
                  }
                ].map(to => (
                  <TouchableOpacity
                    key={to.text}
                    onPress={to.action || (() => {})}
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
              <TouchableOpacity onPress={() => this.navigateTo('seeAll')}>
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
                width: `${
                  (onTablet ? 30 : this.scene === 'SONGS' ? 40 : 70) *
                  inProgress?.length
                }%`
              }}
              renderItem={({ item, index }) => (
                <View style={{ width: `${100 / inProgress?.length}%` }}>
                  <View
                    style={{
                      width: `${100 * inProgress?.length}%`,
                      paddingRight: index === inProgress?.length - 1 ? 10 : 0
                    }}
                  >
                    <Card
                      data={item}
                      mode={
                        this.scene === 'SONGS' ? 'squareCompact' : 'compact'
                      }
                      onNavigate={this.navigateTo}
                    />
                  </View>
                </View>
              )}
              keyExtractor={({ id }) => id.toString()}
            />
          </>
        )}
        {!!all?.length && (
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
        )}
      </>
    );
  };

  render() {
    let { scene, data } = this;
    let {
      loading,
      loadingMore,
      refreshing,
      filtering,
      sorting,
      errorVisible
    } = this.state;
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
            data={data.all || Object.values(data.studentFocus)}
            style={{ flex: 1, backgroundColor }}
            initialNumToRender={1}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.01}
            removeClippedSubviews={true}
            numColumns={this.flatListCols}
            keyboardShouldPersistTaps='handled'
            ListHeaderComponent={this.renderFLHeader}
            renderItem={this.renderFLItem}
            onEndReached={this.scene !== 'STUDENTFOCUS' && this.loadMore}
            keyExtractor={({ id, name }) => (id || name).toString()}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'OpenSans-Bold',
                  padding: 15,
                  fontSize: 15,
                  color: 'white'
                }}
              >
                No Content
              </Text>
            }
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
        <Modal
          transparent={true}
          visible={errorVisible}
          onRequestClose={this.toggleError}
          supportedOrientations={['portrait', 'landscape']}
          animationType='fade'
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.toggleError}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,.5)'
            }}
          >
            <View
              style={{
                padding: 10,
                paddingHorizontal: 50,
                borderRadius: 10,
                margin: 50,
                backgroundColor: 'white'
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  textAlign: 'center',
                  fontSize: 20
                }}
              >
                Something went wrong...
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 14
                }}
              >
                Pianote is down, we are working on a fix and it should be back
                shortly, thank you for your patience.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.toggleError();
                  this.refresh();
                }}
                style={{
                  marginTop: 10,
                  borderRadius: 50,
                  backgroundColor: colors.pianoteRed
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'RobotoCondensed-Bold',
                    padding: 15,
                    fontSize: 15,
                    color: 'white'
                  }}
                >
                  RELOAD
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
