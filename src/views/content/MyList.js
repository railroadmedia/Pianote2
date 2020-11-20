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
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
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
      isPaging: false,
      filtering: false,
      filters: {
        displayTopics: [],
        topics: [],
        level: [],
        progress: [],
        instructors: []
      },
      showModalMenu: false
    };
  }

  componentDidMount() {
    this.getMyList();
  }

  getMyList = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    console.log(this.state.filters);
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
    this.setState({
      allLessons: [...this.state.allLessons, ...items],
      outVideos: items.length == 0 || response.data.length < 20 ? true : false,
      page: this.state.page + 1,
      isLoadingAll: false,
      filtering: false,
      isPaging: false
    });
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
      this.setState({ isPaging: true }, () => this.getMyList());
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
        allLessons: [],
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

  refresh = () => {
    this.setState(
      { isLoadingAll: true, allLessons: [], page: 1, outVideos: false },
      () => this.getMyList()
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: fullHeight * 0.1,
            width: fullWidth,
            position: 'absolute',
            zIndex: 2,
            elevation: 2,
            alignSelf: 'stretch'
          }}
        >
          <NavMenuHeaders currentPage={'MYLIST'} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
          refreshControl={
            <RefreshControl
              colors={[colors.pianoteRed]}
              refreshing={this.state.isLoadingAll}
              onRefresh={() => this.refresh()}
            />
          }
          style={{
            flex: 1,
            backgroundColor: colors.mainBackground
          }}
        >
          <View
            key={'header'}
            style={{
              height: fullHeight * 0.1,
              backgroundColor: colors.thirdBackground
            }}
          />
          <View
            key={'backgroundColoring'}
            style={{
              backgroundColor: colors.thirdBackground,
              position: 'absolute',
              height: fullHeight,
              top: -fullHeight,
              left: 0,
              right: 0,
              zIndex: 10,
              elevation: 10
            }}
          ></View>
          <View style={{ height: 30 * factorVertical }} />
          <Text
            style={{
              paddingLeft: 12 * factorHorizontal,
              fontSize: 30 * factorRatio,
              color: 'white',
              fontFamily: 'OpenSans-ExtraBold',
              fontStyle: 'normal'
            }}
          >
            My List
          </Text>
          <View style={{ height: 30 * factorVertical }} />
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('SEEALL', {
                title: 'In Progress',
                parent: 'My List'
              });
            }}
            style={{
              height: fullHeight * 0.075,
              width: fullWidth,
              borderTopWidth: 0.25 * factorRatio,
              borderTopColor: colors.secondBackground,
              borderBottomWidth: 0.25 * factorRatio,
              borderBottomColor: colors.secondBackground,
              flexDirection: 'row'
            }}
          >
            <View>
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  paddingLeft: 12 * factorHorizontal,
                  fontSize: 20 * factorRatio,
                  marginBottom: 5 * factorVertical,
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontFamily: 'RobotoCondensed-Bold',
                  color: colors.secondBackground
                }}
              >
                In Progress
              </Text>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ flex: 1 }} />
            <View
              style={{
                paddingRight: 12 * factorHorizontal
              }}
            >
              <View style={{ flex: 1 }} />
              <EntypoIcon
                name={'chevron-thin-right'}
                size={22.5 * factorRatio}
                color={colors.secondBackground}
              />
              <View style={{ flex: 1 }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('SEEALL', {
                title: 'Completed',
                parent: 'My List'
              });
            }}
            style={{
              height: fullHeight * 0.075,
              width: fullWidth,
              borderBottomWidth: 0.25 * factorRatio,
              borderBottomColor: colors.secondBackground,
              flexDirection: 'row'
            }}
          >
            <View>
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  paddingLeft: 12 * factorHorizontal,
                  fontSize: 20 * factorRatio,
                  marginBottom: 5 * factorVertical,
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontFamily: 'RobotoCondensed-Bold',
                  color: colors.secondBackground
                }}
              >
                Completed
              </Text>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ flex: 1 }} />
            <View style={{ paddingRight: 12 * factorHorizontal }}>
              <View style={{ flex: 1 }} />
              <EntypoIcon
                name={'chevron-thin-right'}
                size={22.5 * factorRatio}
                color={colors.secondBackground}
              />
              <View style={{ flex: 1 }} />
            </View>
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

        <NavigationBar currentPage={'MyList'} />
        <Modal
          key={'navMenu'}
          isVisible={this.state.showModalMenu}
          style={{
            margin: 0,
            height: fullHeight,
            width: fullWidth
          }}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
        >
          <NavigationMenu
            onClose={e => this.setState({ showModalMenu: e })}
            menu={this.state.menu}
            parentPage={this.state.parentPage}
          />
        </Modal>
      </View>
    );
  }
}
