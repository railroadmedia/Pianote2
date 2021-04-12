/**
 * SongCatalog
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import { getStartedContent, getAllContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

import { cacheAndWriteSongs } from '../../redux/SongsCacheActions';
import { navigate, refreshOnFocusListener } from '../../../AppNavigator';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class SongCatalog extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let { songsCache } = props;
    this.state = {
      progressSongs: [],
      allSongs: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      isPaging: false,
      filtering: false,
      started: true,
      refreshing: true,
      refreshControl: false,
      ...this.initialValidData(songsCache, true)
    };
  }

  componentDidMount() {
    let deepFilters = decodeURIComponent(this.props.route?.params?.url).split(
      '?'
    )[1];
    this.filterQuery = deepFilters && `&${deepFilters}`;
    this.getContent();
    this.refreshOnFocusListener = refreshOnFocusListener.call(this);
  }

  componentWillUnmount() {
    this.refreshOnFocusListener?.();
  }

  async getContent() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      getAllContent(
        'song',
        this.state.currentSort,
        this.state.page,
        this.filterQuery
      ),
      getStartedContent('song', 1)
    ]);

    this.metaFilters = content?.[0]?.meta?.filterOptions;
    this.props.cacheAndWriteSongs({
      all: content[0],
      inProgress: content[1]
    });
    this.setState(
      this.initialValidData({
        all: content[0],
        inProgress: content[1]
      })
    );
  }

  initialValidData = (content, fromCache) => {
    try {
      let allVideos = content.all.data;

      let inprogressVideos = content.inProgress.data;
      return {
        allSongs: allVideos,
        outVideos:
          allVideos.length == 0 || content.all.data.length < 10 ? true : false,
        filtering: false,
        isPaging: false,
        progressSongs: inprogressVideos,
        started: inprogressVideos.length !== 0,
        refreshing: false,
        refreshControl: fromCache
      };
    } catch (e) {
      return {};
    }
  };

  getAllSongs = async loadMore => {
    this.setState({ filtering: true });
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await getAllContent(
      'song',
      this.state.currentSort,
      this.state.page,
      this.filterQuery
    );
    this.metaFilters = response?.meta?.filterOptions;

    this.setState(state => ({
      allSongs: loadMore ? state.allSongs.concat(response.data) : response.data,
      outVideos:
        response.data.length == 0 || response.data.length < 10 ? true : false,
      filtering: false,
      refreshControl: false,
      isPaging: false,
      refreshing: false
    }));
  };

  changeSort = currentSort => {
    this.setState(
      {
        allSongs: [],
        currentSort,
        outVideos: false,
        isPaging: false,
        page: 1
      },
      () => this.getAllSongs()
    );
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
        () => this.getAllSongs(true)
      );
    }
  };

  refresh() {
    this.setState(
      {
        refreshControl: true,
        page: 1
      },
      () => this.getContent()
    );
  }

  getSquareHeight = () => {
    if (onTablet) {
      return 125;
    } else {
      if (Platform.OS == 'android') {
        return height * 0.1375;
      } else {
        return height * 0.115;
      }
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'SONGS'} />
        {!this.state.refreshing ? (
          <ScrollView
            style={styles.mainContainer}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            scrollEventThrottle={400}
            onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
            refreshControl={
              <RefreshControl
                tintColor={'transparent'}
                colors={[colors.pianoteRed]}
                refreshing={isiOS ? false : this.state.refreshControl}
                onRefresh={() => this.refresh()}
              />
            }
          >
            {isiOS && this.state.refreshControl && (
              <ActivityIndicator
                size='small'
                style={styles.ActivityIndicator}
                color={colors.secondBackground}
              />
            )}
            <Text style={styles.contentPageHeader}>Songs</Text>
            {this.state.started && (
              <View style={styles.mainContainer}>
                <HorizontalVideoList
                  hideFilterButton={true}
                  Title={'CONTINUE'}
                  seeAll={() =>
                    navigate('SEEALL', {
                      title: 'Continue',
                      parent: 'Songs'
                    })
                  }
                  isSquare={true}
                  items={this.state.progressSongs}
                />
                <View style={{ height: 5 }} />
              </View>
            )}
            <VerticalVideoList
              items={this.state.allSongs}
              isLoading={false}
              title={'ALL SONGS'}
              type={'SONGS'}
              showFilter={true}
              showType={false}
              showArtist={true}
              showLength={false}
              showSort={true}
              isPaging={this.state.isPaging}
              filters={this.metaFilters}
              imageRadius={5}
              containerBorderWidth={0}
              containerWidth={width}
              currentSort={this.state.currentSort}
              changeSort={sort => this.changeSort(sort)} // change sort and reload videos
              outVideos={this.state.outVideos} // if paging and out of videos
              isSquare={true}
              containerHeight={this.getSquareHeight()} // height per row
              imageHeight={this.getSquareHeight()} // image height
              imageWidth={this.getSquareHeight()} // image height
              applyFilters={filters =>
                new Promise(res =>
                  this.setState(
                    {
                      allSongs: [],
                      outVideos: false,
                      page: 1
                    },
                    () => {
                      this.filterQuery = filters;
                      this.getAllSongs().then(res);
                    }
                  )
                )
              }
            />
          </ScrollView>
        ) : (
          <ActivityIndicator
            size='large'
            style={{ flex: 1 }}
            color={colors.secondBackground}
          />
        )}
        <NavigationBar currentPage={''} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ songsCache: state.songsCache });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteSongs }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SongCatalog);
