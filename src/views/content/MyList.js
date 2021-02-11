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
import { bindActionCreators } from 'redux';
import { ContentModel } from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import Filters from '../../components/FIlters.js';
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
    this.setState({ filtering: true });
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
    if (typeof loadMore == 'undefined' || typeof fromCache == 'undefined') {
      this.setState({
        filtersAvailable: {
          displayTopics: [],
          topics: [],
          content_type: [],
          level: [],
          progress: [],
          instructors: []
        },
        outVideos: true,
        page: 1,
        isLoadingAll: false,
        filtering: false,
        isPaging: false,
        refreshing: false
      });
    } else {
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
          filtersAvailable: content.meta.filterOptions,
          outVideos:
            items.length == 0 || content.data.length < 20 ? true : false,
          page: this.state?.page + 1 || 1,
          isLoadingAll: false,
          filtering: false,
          isPaging: false,
          refreshing: fromCache
        };
      } catch (e) {
        console.log('error: ', e);
        return {};
      }
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

  refresh = () => {
    this.setState({ refreshing: true, page: 1, outVideos: false }, () =>
      this.getMyList()
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <NavMenuHeaders currentPage={'MYLIST'} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          style={styles.mainContainer}
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
              size='small'
              style={{ padding: 10 }}
              color={colors.secondBackground}
            />
          )}
          <Text style={styles.contentPageHeader}>My List</Text>
          <TouchableOpacity
            style={[
              styles.tabRightContainer,
              {
                borderBottomWidth: 0,
                marginTop: 20 * factorVertical
              }
            ]}
            onPress={() => {
              this.props.navigation.navigate('SEEALL', {
                title: 'In Progress',
                parent: 'My List'
              });
            }}
          >
            <Text style={styles.tabRightContainerText}>In Progress</Text>
            <EntypoIcon
              name={'chevron-thin-right'}
              size={22.5 * factorRatio}
              color={colors.secondBackground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabRightContainer,
              { marginBottom: 10 * factorVertical }
            ]}
            onPress={() => {
              this.props.navigation.navigate('SEEALL', {
                title: 'Completed',
                parent: 'My List'
              });
            }}
          >
            <Text style={styles.tabRightContainerText}>Completed</Text>
            <EntypoIcon
              name={'chevron-thin-right'}
              size={22.5 * factorRatio}
              color={colors.secondBackground}
            />
          </TouchableOpacity>
          <VerticalVideoList
            title={'ADDED TO MY LIST'}
            type={'MYLIST'}
            items={this.state.allLessons}
            isLoading={this.state.isLoadingAll}
            isPaging={this.state.isPaging}
            showFilter={true}
            showType={false}
            showArtist={true}
            showLength={false}
            showSort={false}
            filters={this.state.filters}
            filterResults={() => this.setState({ showFilters: true })}
            removeItem={contentID => this.removeFromMyList(contentID)}
            outVideos={this.state.outVideos}
            imageWidth={onTablet ? fullWidth * 0.225 : fullWidth * 0.3}
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
            animationInTiming={1}
            animationOutTiming={1}
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
                    page: 1
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
        )}
        <NavigationBar currentPage={'MyList'} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ myListCache: state.myListCache });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteMyList }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyList);
