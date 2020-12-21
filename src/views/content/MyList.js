/**
 * MyList
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { ContentModel } from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import Filters from '../../components/FIlters.js';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import { getMyListContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class MyList extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      isLoadingAll: true,
      filtersAvailable: null,
      showFilters: false,
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
      refreshing: false
    };
  }

  componentDidMount() {
    this.getMyList();
  }

  getMyList = async loadMore => {
    this.setState({filtering: true})
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let response = await getMyListContent(
      this.state.page,
      this.state.filters,
      ''
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
        id: newContent[i].id,
        mobile_app_url: newContent[i].post.mobile_app_url,
        lesson_count: newContent[i].post.lesson_count,
        currentLessonId: newContent[i].post?.song_part_id,
        like_count: newContent[i].post.like_count,
        duration: i,
        isLiked: newContent[i].post.is_liked_by_current_user,
        isAddedToList: newContent[i].isAddedToList,
        isStarted: newContent[i].isStarted,
        isCompleted: newContent[i].isCompleted,
        bundle_count: newContent[i].post.bundle_count,
        progress_percent: newContent[i].post.progress_percent
      });
    }

    this.setState(state => ({
      filtersAvailable: response.meta.filterOptions,
      allLessons: loadMore ? state.allLessons.concat(items) : items,
      outVideos: items.length == 0 || response.data.length < 20 ? true : false,
      page: this.state.page + 1,
      isLoadingAll: false,
      filtering: false,
      isPaging: false,
      refreshing: false
    }));
  };

  removeFromMyList = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    for (i in this.state.allLessons) {
      // remove if ID matches
      if (this.state.allLessons[i].id == contentID) {
        this.state.allLessons.splice(i, 1);
      }
    }
    this.setState({ allLessons: this.state.allLessons });
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
      this.setState({ isPaging: true }, () => this.getMyList(true));
    }
  };

  refresh = () => {
    this.setState({ refreshing: true, page: 1, outVideos: false }, () =>
      this.getMyList()
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
        <NavMenuHeaders currentPage={'MYLIST'} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
          refreshControl={
            <RefreshControl
              colors={[colors.pianoteRed]}
              refreshing={this.state.refreshing}
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
              paddingLeft: 12 * factorHorizontal,
              fontSize: 30 * factorRatio,
              color: 'white',
              fontFamily: 'OpenSans-ExtraBold',
              fontStyle: 'normal',
              paddingBottom: 30 * factorVertical
            }}
          >
            My List
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('SEEALL', {
                title: 'In Progress',
                parent: 'My List'
              });
            }}
            style={{
              width: '100%',
              borderTopWidth: 0.25 * factorRatio,
              borderTopColor: colors.secondBackground,
              borderBottomWidth: 0.25 * factorRatio,
              borderBottomColor: colors.secondBackground,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                paddingLeft: 12 * factorHorizontal,
                fontSize: 20 * factorRatio,
                marginBottom: 5 * factorVertical,
                textAlign: 'left',
                fontWeight: 'bold',
                fontFamily: 'RobotoCondensed-Bold',
                color: colors.secondBackground,
                paddingVertical: 10
              }}
            >
              In Progress
            </Text>

            <EntypoIcon
              name={'chevron-thin-right'}
              size={22.5 * factorRatio}
              color={colors.secondBackground}
              style={{
                paddingRight: 12 * factorHorizontal
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('SEEALL', {
                title: 'Completed',
                parent: 'My List'
              });
            }}
            style={{
              width: '100%',
              borderBottomWidth: 0.25 * factorRatio,
              borderBottomColor: colors.secondBackground,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                paddingLeft: 12 * factorHorizontal,
                fontSize: 20 * factorRatio,
                marginBottom: 5 * factorVertical,
                textAlign: 'left',
                fontWeight: 'bold',
                fontFamily: 'RobotoCondensed-Bold',
                color: colors.secondBackground,
                paddingVertical: 10
              }}
            >
              Completed
            </Text>

            <EntypoIcon
              name={'chevron-thin-right'}
              size={22.5 * factorRatio}
              color={colors.secondBackground}
              style={{ paddingRight: 12 * factorHorizontal }}
            />
          </TouchableOpacity>
          <View style={{ height: 15 * factorVertical }} />
          <VerticalVideoList
            items={this.state.allLessons}
            isLoading={this.state.isLoadingAll}
            title={'ADDED TO MY LIST'}
            isPaging={this.state.isPaging}
            type={'MYLIST'} // the type of content on page
            showFilter={true} // shows filters button
            showType={false} // show course / song by artist name
            showArtist={true} // show artist name
            showLength={false} // duration of song
            showSort={false}
            filters={this.state.filters} // show filter list
            filterResults={() => this.setState({ showFilters: true })} // apply from filters page
            removeItem={contentID => {
              this.removeFromMyList(contentID);
            }}
            outVideos={this.state.outVideos} // if paging and out of videos
            imageRadius={5 * factorRatio} // radius of image shown
            containerBorderWidth={0} // border of box
            containerWidth={fullWidth} // width of list
            containerHeight={
              onTablet
                ? fullHeight * 0.15
                : Platform.OS == 'android'
                ? fullHeight * 0.115
                : fullHeight * 0.095
            } // height per row
            imageHeight={
              onTablet
                ? fullHeight * 0.12
                : Platform.OS == 'android'
                ? fullHeight * 0.095
                : fullHeight * 0.0825
            } // image height
            imageWidth={fullWidth * 0.26} // image width
          />
        </ScrollView>
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
            type={'My List'}
            reset={filters => {
              this.setState(
                {
                  allLessons: [],
                  filters,
                  page: 1,
                },
                () => this.getMyList()
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
                () => this.getMyList()
              );
            }}
          />
        </Modal>
        <NavigationBar currentPage={'MyList'} />
      </View>
    );
  }
}
