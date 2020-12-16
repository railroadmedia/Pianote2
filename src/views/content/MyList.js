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
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { bindActionCreators } from 'redux';
import { ContentModel } from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import NavigationMenu from '../../components/NavigationMenu';
import VerticalVideoList from '../../components/VerticalVideoList';

import { getMyListContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

import { cacheAndWriteMyList } from '../../redux/MyListCacheActions';
import { ActivityIndicator } from 'react-native';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class MyList extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let { myListCache } = props;
    this.state = {
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      isLoadingAll: true,
      isPaging: false,
      filtering: false,
      filters: {
        displayTopics: [],
        topics: [],
        level: [],
        progress: [],
        instructors: []
      },
      showModalMenu: false,
      refreshing: false,
      ...this.initialValidData(myListCache, false, true)
    };
  }

  componentDidMount() {
    this.getMyList();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () =>
        !this.firstTimeFocused ? (this.firstTimeFocused = true) : this.refresh()
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  getMyList = async loadMore => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let response = await getMyListContent(
      this.state.page,
      this.state.filters,
      ''
    );
    this.props.cacheAndWriteMyList(response);
    this.setState(this.initialValidData(response, loadMore));
  };

  initialValidData = (content, loadMore, fromCache) => {
    try {
      const newContent = content.data.map(data => {
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
      return {
        allLessons: loadMore ? this.state?.allLessons?.concat(items) : items,
        outVideos: items.length == 0 || content.data.length < 20 ? true : false,
        page: this.state?.page + 1 || 1,
        isLoadingAll: false,
        filtering: false,
        isPaging: false,
        refreshing: fromCache
      };
    } catch (e) {
      return {};
    }
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

  filterResults = async () => {
    // function to be sent to filters page
    await this.props.navigation.navigate('FILTERS', {
      filters: this.state.filters,
      type: 'MYLIST',
      onGoBack: filters => this.changeFilters(filters)
    });
  };

  changeFilters = async filters => {
    // after leaving filter page. set filters here
    this.setState(
      {
        outVideos: false,
        page: 1,
        filters:
          filters.instructors.length == 0 &&
          filters.level.length == 0 &&
          filters.progress.length == 0 &&
          filters.topics.length == 0
            ? {
                displayTopics: [],
                level: [],
                topics: [],
                progress: [],
                instructors: []
              }
            : filters
      },
      () => this.getMyList()
    );
  };

  refresh = () =>
    this.setState(
      { refreshing: true, page: 1, outVideos: false },
      this.getMyList
    );

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
        <NavMenuHeaders currentPage={'MYLIST'} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          style={{ flex: 1 }}
          onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
          refreshControl={
            <RefreshControl
              tintColor={'transparent'}
              colors={[colors.pianoteRed]}
              onRefresh={() => this.refresh()}
              refreshing={isiOS ? false : this.state.refreshing}
            />
          }
        >
          {isiOS && this.state.refreshing && (
            <ActivityIndicator
              size='large'
              style={{ padding: 10 }}
              color={colors.pianoteRed}
            />
          )}
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
            filterResults={() => this.filterResults()} // apply from filters page
            removeItem={contentID => {
              this.removeFromMyList(contentID);
            }}
            outVideos={this.state.outVideos} // if paging and out of videos
            imageWidth={fullWidth * 0.26} // image width
          />
        </ScrollView>

        <NavigationBar currentPage={'MyList'} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ myListCache: state.myListCache });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteMyList }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyList);
