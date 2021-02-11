/**
 * StudentFocusShow
 */
import React from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import Filters from '../../components/FIlters.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import { SafeAreaView } from 'react-navigation';

import { NetworkContext } from '../../context/NetworkProvider';

import NavigationBar from '../../components/NavigationBar';
import VerticalVideoList from '../../components/VerticalVideoList';

import { getAllContent, getStudentFocusTypes } from '../../services/GetContent';

import { cacheAndWritePodcasts } from '../../redux/PodcastsCacheActions';
import { cacheAndWriteQuickTips } from '../../redux/QuickTipsCacheActions';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class StudentFocusShow extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrl: props.navigation.state.params.thumbnailUrl,
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      refreshing: false,
      filtersAvailable: null,
      showFilters: false,
      isLoadingAll: true, // all lessons
      isPaging: false, // scrolling more
      filtering: false, // filtering
      filters: {
        displayTopics: [],
        topics: [],
        content_type: [],
        level: [],
        progress: [],
        instructors: []
      },
      ...this.initialValidData(
        props.navigation.state.params.type == 'quick-tips'
          ? props.quickTipsCache
          : props.podcastsCache,
        true
      )
    };
  }

  componentDidMount() {
    this.getData();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () =>
        !this.firstTimeFocused ? (this.firstTimeFocused = true) : this.refresh()
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  getData = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      getStudentFocusTypes(),
      getAllContent(
        this.props.navigation.state.params.type,
        this.state.currentSort,
        this.state.page,
        this.state.filters
      )
    ]);
    this.props[
      this.props.navigation.state.params.type == 'quick-tips'
        ? 'cacheAndWriteQuickTips'
        : 'cacheAndWritePodcasts'
    ]({
      all: content[1],
      thumbnail: content[0]
    });
    this.setState(
      this.initialValidData({
        all: content[1],
        thumbnail: content[0]
      })
    );
  };

  initialValidData = (content, fromCache) => {
    try {
      const newContent = content.all.data.map(data => {
        return new ContentModel(data);
      });

      let items = [];
      for (let i in newContent) {
        items.push({
          title: newContent[i].getField('title'),
          artist: this.getArtist(newContent[i]),
          thumbnail: newContent[i].getData('thumbnail_url'),
          publishedOn:
            newContent[i].publishedOn.slice(0, 10) +
            'T' +
            newContent[i].publishedOn.slice(11, 16),
          type: newContent[i].post.type,
          id: newContent[i].id,
          isAddedToList: newContent[i].isAddedToList,
          isStarted: newContent[i].isStarted,
          isCompleted: newContent[i].isCompleted,
          progress_percent: newContent[i].post.progress_percent
        });
      }

      return {
        filtersAvailable: content.all.meta.filterOptions,
        thumbnailUrl:
          content.thumbnail[this.props.navigation.state.params.type]
            .thumbnailUrl,
        allLessons: items,
        outVideos:
          items.length == 0 || content.all.data.length < 20 ? true : false,
        page: this.state?.page + 1 || 1,
        isLoadingAll: false,
        refreshing: fromCache,
        filtering: false,
        isPaging: false
      };
    } catch (e) {
      return {};
    }
  };

  async getStudentFocus() {
    let studentFocus = await getStudentFocusTypes();
    this.setState({
      thumbnailUrl:
        studentFocus[this.props.navigation.state.params.type].thumbnailUrl
    });
  }

  getAllLessons = async isLoadingMore => {
    this.setState({ filtering: true });
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await getAllContent(
      this.props.navigation.state.params.type,
      this.state.currentSort,
      this.state.page,
      this.state.filters
    );
    const newContent = await response.data.map(data => {
      return new ContentModel(data);
    });

    let items = [];
    for (let i in newContent) {
      items.push({
        title: newContent[i].getField('title'),
        artist: this.getArtist(newContent[i]),
        thumbnail: newContent[i].getData('thumbnail_url'),
        publishedOn:
          newContent[i].publishedOn.slice(0, 10) +
          'T' +
          newContent[i].publishedOn.slice(11, 16),
        type: newContent[i].post.type,
        id: newContent[i].id,
        isAddedToList: newContent[i].isAddedToList,
        isStarted: newContent[i].isStarted,
        isCompleted: newContent[i].isCompleted,
        progress_percent: newContent[i].post.progress_percent
      });
    }
    console.log('response', response);
    this.setState(state => ({
      filtersAvailable: response.meta.filterOptions,
      allLessons: isLoadingMore ? state.allLessons.concat(items) : items,
      outVideos: items.length == 0 || response.data.length < 20 ? true : false,
      page: this.state.page + 1,
      isLoadingAll: false,
      refreshing: false,
      filtering: false,
      isPaging: false
    }));
  };

  changeSort = async currentSort => {
    this.setState(
      {
        currentSort,
        outVideos: false,
        isPaging: false,
        allLessons: [],
        page: 1
      },
      () => this.getAllLessons()
    );
  };

  getVideos = async () => {
    // change page before getting more lessons if paging
    if (!this.state.outVideos) {
      this.setState({ page: this.state.page + 1 }, () =>
        this.getAllLessons(true)
      );
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

  handleScroll = async event => {
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
        () => this.getAllLessons(true)
      );
    }
  };

  refresh = () => {
    this.setState({ refreshing: true, page: 1, outVideos: false }, () =>
      this.getAllLessons()
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
        <StatusBar
          backgroundColor={colors.mainBackground}
          barStyle={'light-content'}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          style={{ flex: 1, backgroundColor: colors.mainBackground }}
          onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
          refreshControl={
            <RefreshControl
              tint={'transparent'}
              colors={[colors.secondBackground]}
              onRefresh={() => this.refresh()}
              refreshing={isiOS ? false : this.state.refreshing}
            />
          }
          style={{ flex: 1 }}
        >
          {isiOS && this.state.refreshing && (
            <ActivityIndicator
              size='small'
              style={{ padding: 10 }}
              color={colors.secondBackground}
            />
          )}
          <View key={'imageContainer'} style={{ width: '100%' }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                padding: 15
                // position: 'absolute',
                // top: 0
              }}
            >
              <Back
                width={(onTablet ? 17.5 : 25) * factorRatio}
                height={(onTablet ? 17.5 : 25) * factorRatio}
                fill={'white'}
              />
            </TouchableOpacity>

            <View
              key={'bootcampImage'}
              style={{
                paddingHorizontal: '20%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FastImage
                style={{
                  width: '80%',
                  maxWidth: 400,
                  maxHeight: 400,
                  aspectRatio: 1,
                  borderRadius: 10 * factorRatio,
                  borderColor: colors.thirdBackground,
                  borderWidth: 5
                }}
                source={{ uri: this.state.thumbnailUrl }}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </View>
          </View>
          <View style={{ height: 25 * factorVertical }} />
          <VerticalVideoList
            items={this.state.allLessons}
            title={'EPISODES'}
            isPaging={this.state.isPaging}
            isLoading={this.state.isLoadingAll}
            type={'STUDENTFOCUSSHOW'}
            showType={true}
            showArtist={true}
            showLength={false}
            showFilter={
              this.props.navigation.state.params.type == 'quick-tips'
                ? true
                : false
            }
            showSort={
              this.props.navigation.state.params.type == 'quick-tips'
                ? true
                : false
            }
            filters={this.state.filters}
            currentSort={this.state.currentSort}
            changeSort={sort => this.changeSort(sort)}
            filterResults={() => this.setState({ showFilters: true })} // apply from filters page
            imageWidth={onTablet ? fullWidth * 0.225 : fullWidth * 0.3}
            outVideos={this.state.outVideos}
            getVideos={() => this.getVideos()}
          />
        </ScrollView>
        {this.state.showFilters && (
          <Modal
            isVisible={this.state.showFilters}
            style={[
              styles.centerContent,
              {
                margin: 0,
                height: '100%',
                width: '100%'
              }
            ]}
            animation={'slideInUp'}
            animationInTiming={10}
            animationOutTiming={10}
            coverScreen={true}
            hasBackdrop={true}
          >
            <Filters
              hideFilters={() => this.setState({ showFilters: false })}
              filtersAvailable={this.state.filtersAvailable}
              filters={this.state.filters}
              filtering={this.state.filtering}
              type={'Quick Tips'}
              reset={filters => {
                this.setState(
                  {
                    allLessons: [],
                    filters,
                    page: 1
                  },
                  () => this.getAllLessons()
                );
              }}
              filterVideos={filters => {
                this.setState(
                  {
                    allLessons: [],
                    outVideos: false,
                    page: 1,
                    filters
                  },
                  () => this.getAllLessons()
                );
              }}
            />
          </Modal>
        )}
        <NavigationBar currentPage={'NONE'} />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  podcastsCache: state.podcastsCache,
  quickTipsCache: state.quickTipsCache
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { cacheAndWriteQuickTips, cacheAndWritePodcasts },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StudentFocusShow);
