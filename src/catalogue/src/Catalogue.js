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

import Card from './Card';
import Filters from './Filters';
import Sort from './Sort';

import commonService from './services/common.service';
import { getContent, getAll, cache } from './services/catalogue.service';

import { arrowLeft, play, reset, arrowRight } from './img/svgs';

let styles;

export default class Catalogue extends React.Component {
  page = 1;
  scene = this.props.route.name;
  flatListCols = onTablet ? 3 : this.scene === 'STUDENTFOCUS' ? 2 : 1;

  constructor(props) {
    super(props);
    Catalogue.contextType = commonService.Contexts;
    styles = setStyles(props.theme === 'light');
    this.data = cache[this.scene] || { method: {}, inProgress: [], all: [] };
    this.state = {
      loading: !cache[this.scene],
      loadingMore: false,
      refreshing: true,
      filtering: false,
      sorting: false,
      errorVisible: false
    };
  }

  componentDidMount() {
    let reFocused = false;
    this.refreshOnFocusListener = this.props.navigation?.addListener(
      'focus',
      () => (reFocused ? this.refresh?.() : (reFocused = true))
    );
    // refreshPromise is necessary for loadMore()
    // wait for refresh() to finish then proceed with loadMore()
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
    let options = {
      scene: this.scene,
      showType: this.props.route.params?.showType
    };
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
    // navigation is executed in NavigationContainer
    switch (path) {
      case 'methodLesson':
        return this.props.onNavigateToMethodLesson(next_lesson);
      case 'method':
        return this.props.onNavigateToMethod(started, completed);
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
    // preventLoadingMore is necessary to prevent multiple instances of loadMore()
    if (this.preventLoadingMore) return;
    this.preventLoadingMore = true;
    this.setState({ loadingMore: true });
    if (this.refreshPromise) await this.refreshPromise;
    this.setData('loadMore', { loadingMore: false }).then(
      () => delete this.preventLoadingMore
    );
  };

  refresh = () => {
    // abort everything on refresh
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
      all,
      studentFocus
    } = this.data;
    let { refreshing, filtering, sorting, loadingMore } = this.state;
    let filterAndSortDisabled =
      refreshing || filtering || sorting || loadingMore;
    return (
      <>
        {this.scene.match(/^(SHOW)$/) && (
          <>
            <TouchableOpacity
              style={{ padding: 20, paddingHorizontal: 10 }}
              onPress={this.props.navigation.goBack}
            >
              {arrowLeft({ height: 25, fill: 'white' })}
            </TouchableOpacity>
            <Image
              style={styles.showBannerImage}
              source={{
                uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:good,c_fill,g_face/${
                  studentFocus[all[0].type].thumbnailUrl
                }`
              }}
              resizeMode={'contain'}
            />
          </>
        )}
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
                    icon: completed ? reset : play,
                    action:
                      !completed && (() => this.navigateTo('methodLesson'))
                  },
                  {
                    text: 'MORE INFO',
                    icon: arrowRight,
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
                    {to.icon({ height: 20, width: 20, fill: 'white' })}
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
                onPress={() => this.props.navigation.navigate('SEEALL')}
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
            <Filters
              disabled={filterAndSortDisabled}
              onApply={this.filter}
              meta={this.metaFilters}
              ref={r => (this.filterRef = r)}
            />
          </View>
        )}
        {(filtering || sorting) && (
          <LinearGradient
            colors={['rgba(80, 15, 25, 0.98)', 'transparent']}
            style={{ position: 'absolute', width: '100%' }}
          >
            <ActivityIndicator size='large' color={'#6e777a'} />
          </LinearGradient>
        )}
      </>
    );
  };

  render() {
    let { scene, data } = this;
    let { loading, loadingMore, refreshing, errorVisible } = this.state;
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
            data={data.all || Object.values(data.studentFocus || {})}
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
              <Text style={styles.noContentText}>No Content</Text>
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
            style={styles.errorModalBackground}
          >
            <View style={styles.errorModalTextContainer}>
              <Text style={styles.errorModalTitle}>
                Something went wrong...
              </Text>
              <Text style={styles.errorModalMsg}>
                Pianote is down, we are working on a fix and it should be back
                shortly, thank you for your patience.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.toggleError();
                  this.refresh();
                }}
                style={styles.errorModalBtn}
              >
                <Text style={styles.errorModalBtnText}>RELOAD</Text>
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
    },
    showBannerImage: {
      width: '50%',
      aspectRatio: 1,
      alignSelf: 'center',
      borderRadius: 10
    },
    noContentText: {
      textAlign: 'center',
      fontFamily: 'OpenSans-Bold',
      padding: 15,
      fontSize: 15,
      color: 'white'
    },
    errorModalBackground: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,.5)'
    },
    errorModalTextContainer: {
      padding: 10,
      paddingHorizontal: 50,
      borderRadius: 10,
      margin: 50,
      backgroundColor: 'white'
    },
    errorModalTitle: {
      fontFamily: 'OpenSans-Bold',
      textAlign: 'center',
      fontSize: 20
    },
    errorModalMsg: {
      textAlign: 'center',
      fontFamily: 'OpenSans-Regular',
      fontSize: 14
    },
    errorModalBtn: {
      marginTop: 10,
      borderRadius: 50,
      backgroundColor: '#fb1b2f'
    },
    errorModalBtnText: {
      textAlign: 'center',
      fontFamily: 'RobotoCondensed-Bold',
      padding: 15,
      fontSize: 15,
      color: 'white'
    }
  });
