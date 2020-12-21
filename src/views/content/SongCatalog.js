/**
 * SongCatalog
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { ContentModel } from '@musora/models';
import Modal from 'react-native-modal';
import Filters from '../../components/FIlters.js';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import { getStartedContent, getAllContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class SongCatalog extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      progressSongs: [],
      allSongs: [],
      currentSort: 'newest',
      page: 1,
      filtersAvailable: null,
      showFilters: false,
      outVideos: false,
      isPaging: false,
      filtering: false,
      filters: {
        displayTopics: [],
        topics: [],
        content_type: [],
        level: [],
        progress: [],
        instructors: []
      },
      started: true,
      refreshing: true,
      refreshControl: false
    };
  }

  componentDidMount() {
    this.getContent();
  }

  async getContent() {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    let content = await Promise.all([
      getAllContent(
        'song',
        this.state.currentSort,
        this.state.page,
        this.state.filters
      ),
      getStartedContent('song')
    ]);

    let allVideos = this.setData(
      content[0].data.map(data => {
        return new ContentModel(data);
      })
    );

    let inprogressVideos = this.setData(
      content[1].data.map(data => {
        return new ContentModel(data);
      })
    );

    this.setState({
      allSongs: allVideos,
      filtersAvailable: content[0].meta.filterOptions,
      outVideos:
        allVideos.length == 0 || content[0].data.length < 20 ? true : false,
      filtering: false,
      isPaging: false,
      progressSongs: inprogressVideos,
      started: inprogressVideos.length !== 0,
      refreshing: false,
      refreshControl: false
    });
  }

  getAllSongs = async loadMore => {
    this.setState({filtering: true})
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await getAllContent(
      'song',
      this.state.currentSort,
      this.state.page,
      this.state.filters
    );

    const newContent = await response.data.map(data => {
      return new ContentModel(data);
    });

    let items = this.setData(newContent);

    this.setState(state => ({
      filtersAvailable: response.meta.filterOptions,
      allSongs: loadMore ? state.allSongs.concat(items) : items,
      outVideos: items.length == 0 || response.data.length < 20 ? true : false,
      filtering: false,
      refreshControl: false,
      isPaging: false,
      refreshing: false
    }));
  };

  setData(newContent) {
    let items = [];
    for (let i in newContent) {
      items.push({
        title: newContent[i].getField('title'),
        artist: newContent[i].getField('artist'),
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
        id: newContent[i].post.id,
        currentLessonId: newContent[i].post?.song_part_id,
        lesson_count: newContent[i].post.lesson_count,
        like_count: newContent[i].post.like_count,
        isLiked: newContent[i].post.is_liked_by_current_user,
        isAddedToList: newContent[i].isAddedToList,
        isStarted: newContent[i].isStarted,
        isCompleted: newContent[i].isCompleted,
        progress_percent: newContent[i].post.progress_percent
      });
    }
    return items;
  }

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

  getVideos = () => {
    if (!this.state.outVideos) {
      this.setState({ page: this.state.page + 1 }, () =>
        this.getAllSongs(true)
      );
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

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'SONGS'} />

        {!this.state.refreshing ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            scrollEventThrottle={400}
            onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
            refreshControl={
              <RefreshControl
                colors={[colors.pianoteRed]}
                refreshing={this.state.refreshControl}
                onRefresh={() => this.refresh()}
              />
            }
            style={{
              flex: 1,
              backgroundColor: colors.mainBackground
            }}
          >
            <Text
              style={{
                paddingLeft: 15,
                fontSize: 30 * factorRatio,
                color: 'white',
                fontFamily: 'OpenSans-ExtraBold'
              }}
            >
              Songs
            </Text>
            <View style={{height: 10*factorVertical}}/>
            {this.state.started && (
              <View
                key={'continueCourses'}
                style={{
                  backgroundColor: colors.mainBackground
                }}
              >
                <HorizontalVideoList
                  Title={'CONTINUE'}
                  seeAll={() =>
                    this.props.navigation.navigate('SEEALL', {
                      title: 'Continue',
                      parent: 'Songs'
                    })
                  }
                  hideSeeAll={true}
                  isSquare={true}
                  items={this.state.progressSongs}
                />
              </View>
            )}
            <VerticalVideoList
              items={this.state.allSongs}
              isLoading={false}
              title={'ALL SONGS'} // title for see all page
              type={'SONGS'} // the type of content on page
              showFilter={true}
              showType={false} // show course / song by artist name
              showArtist={true} // show artist name
              showLength={false}
              showSort={true}
              isPaging={this.state.isPaging}
              filters={this.state.filters} // show filter list
              imageRadius={5 * factorRatio} // radius of image shown
              containerBorderWidth={0} // border of box
              containerWidth={fullWidth} // width of list
              currentSort={this.state.currentSort}
              changeSort={sort => this.changeSort(sort)} // change sort and reload videos
              outVideos={this.state.outVideos} // if paging and out of videos
              filterResults={() => this.setState({ showFilters: true })} // apply from filters page
              containerHeight={
                onTablet
                  ? fullHeight * 0.15
                  : Platform.OS == 'android'
                  ? fullHeight * 0.1375
                  : fullHeight * 0.1
              } // height per row
              imageHeight={
                onTablet
                  ? fullHeight * 0.12
                  : Platform.OS == 'android'
                  ? fullHeight * 0.125
                  : fullHeight * 0.09
              } // image height
              imageWidth={
                onTablet
                  ? fullHeight * 0.12
                  : Platform.OS == 'android'
                  ? fullHeight * 0.125
                  : fullHeight * 0.09
              } // image height
            />
          </ScrollView>
        ) : (
          <ActivityIndicator
            size='large'
            style={{ flex: 1 }}
            color={colors.secondBackground}
          />
        )}
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
            type={'Songs'}
            reset={filters => {
              this.setState(
                {
                  allSongs: [],
                  filters,
                  page: 1,
                },
                () => this.getAllSongs()
              );
            }}
            filterVideos={filters => {
              this.setState(
                {
                  allSongs: [],
                  outVideos: false,
                  page: 1,
                  filters
                },
                () => this.getAllSongs()
              );
            }}
          />
        </Modal>

        <NavigationBar currentPage={''} />
      </View>
    );
  }
}
