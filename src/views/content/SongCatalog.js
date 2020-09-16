/**
 * SongCatalog
 */
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class SongCatalog extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      allSongs: [], // videos loaded
      progressSongs: [],
      isLoadingProgress: true,
      outVideos: false, // if no more videos to load
      showChooseInstructors: false,
      showChooseYourLevel: false,
      page: 0, // current page
      isPaging: false,
      isLoadingAll: true,
      filtering: false,
      filters: null,
      currentSort: 'Relevance'
    };
  }

  componentDidMount = async () => {
    this.getProgressSongs();
    this.getAllSongs();
  };

  filterResults = async () => {
    this.props.navigation.navigate('FILTERS', {
      filters: this.state.filters,
      type: 'SONGS',
      onGoBack: filters => {
        this.setState({
          allSongs: [],
          filters:
            filters.instructors.length == 0 &&
            filters.level.length == 0 &&
            filters.progress.length == 0 &&
            filters.topics.length == 0
              ? null
              : filters
        }),
          this.getAllSongs(),
          this.forceUpdate();
      }
    });
  };

  getAllSongs = async () => {
    await this.setState({
      filtering: true,
      page: this.state.page + 1
    });

    // see if importing filters
    try {
      var filters = this.state.filters;
      if (
        filters.instructors.length !== 0 ||
        filters.level.length !== 0 ||
        filters.progress.length !== 0 ||
        filters.topics.length !== 0
      ) {
        // if has a filter then send filters to vertical list
        this.setState({ filters });
      } else {
        // if no filters selected then null
        var filters = null;
      }
    } catch (error) {
      var filters = null;
    }

    const { response, error } = await getContent({
      brand: 'pianote',
      limit: '20',
      page: this.state.page,
      sort: '-created_on',
      statuses: ['published'],
      included_types: ['song']
    });

    const newContent = await response.data.data.map(data => {
      return new ContentModel(data);
    });

    items = [];
    for (i in newContent) {
      if (newContent[i].getData('thumbnail_url') !== 'TBD') {
        items.push({
          title: newContent[i].getField('title'),
          artist: newContent[i].getField('instructor').fields[0].value,
          thumbnail: newContent[i].getData('thumbnail_url'),
          type: newContent[i].post.type,
          description: newContent[i]
            .getData('description')
            .replace(/(<([^>]+)>)/gi, ''),
          xp: newContent[i].post.xp,
          id: newContent[i].post.current_lesson.id,
          like_count: newContent[i].post.like_count,
          duration: this.getDuration(newContent[i]),
          isLiked: newContent[i].isLiked,
          isAddedToList: newContent[i].isAddedToList,
          isStarted: newContent[i].isStarted,
          isCompleted: newContent[i].isCompleted,
          bundle_count: newContent[i].post.bundle_count,
          progress_percent: newContent[i].post.progress_percent
        });
      }
    }

    await this.setState({
      allSongs: [...this.state.allSongs, ...items],
      filtering: false,
      isPaging: false,
      isLoadingAll: false
    });
  };

  getProgressSongs = async () => {
    const { response, error } = await getContent({
      brand: 'pianote',
      limit: '15',
      page: this.state.page,
      sort: '-created_on',
      statuses: ['published'],
      included_types: ['song']
    });

    const newContent = response.data.data.map(data => {
      return new ContentModel(data);
    });

    console.log(response);

    items = [];
    for (i in newContent) {
      if (newContent[i].getData('thumbnail_url') !== 'TBD') {
        items.push({
          title: newContent[i].getField('title'),
          artist: newContent[i].getField('instructor').fields[0].value,
          thumbnail: newContent[i].getData('thumbnail_url'),
          type: newContent[i].post.type,
          description: newContent[i]
            .getData('description')
            .replace(/(<([^>]+)>)/gi, ''),
          xp: newContent[i].post.xp,
          id: newContent[i].post.current_lesson.id,
          like_count: newContent[i].post.like_count,
          duration: this.getDuration(newContent[i]),
          isLiked: newContent[i].isLiked,
          isAddedToList: newContent[i].isAddedToList,
          isStarted: newContent[i].isStarted,
          isCompleted: newContent[i].isCompleted,
          bundle_count: newContent[i].post.bundle_count,
          progress_percent: newContent[i].post.progress_percent
        });
      }
    }

    this.setState({
      progressSongs: [...this.state.progressSongs, ...items],
      isLoadingProgress: false
    });
  };

  getDuration = async newContent => {
    if (newContent.post.fields[0].key == 'video') {
      return newContent.post.fields[0].value.fields[1].value;
    } else if (newContent.post.fields[1].key == 'video') {
      return newContent.post.fields[1].value.fields[1].value;
    } else if (newContent.post.fields[2].key == 'video') {
      return newContent.post.fields[2].value.fields[1].value;
    }
  };

  render() {
    return (
      <View styles={styles.container}>
        <View
          key={'contentContainer'}
          style={{
            height: fullHeight * 0.90625 - navHeight,
            alignSelf: 'stretch'
          }}
        >
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
            <NavMenuHeaders currentPage={'LESSONS'} parentPage={'SONGS'} />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            scrollEventThrottle={400}
            onScroll={({ nativeEvent }) => {
              if (
                isCloseToBottom(nativeEvent) &&
                this.state.isPaging == false
              ) {
                this.setState({ isPaging: true }), this.getAllSongs();
              }
            }}
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
            <View style={{ height: 20 * factorVertical }} />
            <Text
              style={{
                paddingLeft: 12 * factorHorizontal,
                fontSize: 30 * factorRatio,
                color: 'white',
                fontFamily: 'OpenSans',
                fontWeight: Platform.OS == 'ios' ? '900' : 'bold'
              }}
            >
              Songs
            </Text>
            <View style={{ height: 15 * factorVertical }} />
            <View
              key={'continueCourses'}
              style={{
                minHeight: fullHeight * 0.225,
                paddingLeft: fullWidth * 0.035,
                backgroundColor: colors.mainBackground
              }}
            >
              <HorizontalVideoList
                Title={'CONTINUE'}
                isLoading={this.state.isLoadingProgress}
                seeAll={() =>
                  this.props.navigation.navigate('SEEALL', {
                    title: 'Continue',
                    parent: 'Songs'
                  })
                }
                showArtist={true}
                items={this.state.progressSongs}
                itemWidth={isNotch ? fullHeight * 0.175 : fullHeight * 0.2}
                itemHeight={isNotch ? fullHeight * 0.175 : fullHeight * 0.2}
              />
            </View>
            <View style={{ height: 15 * factorVertical }} />
            <VerticalVideoList
              items={this.state.allSongs}
              isLoading={this.state.isLoadingAll}
              title={'ALL SONGS'} // title for see all page
              type={'SONGS'} // the type of content on page
              showFilter={true}
              showType={false} // show course / song by artist name
              showArtist={true} // show artist name
              showLength={false}
              showSort={true}
              filters={this.state.filters} // show filter list
              imageRadius={5 * factorRatio} // radius of image shown
              containerBorderWidth={0} // border of box
              containerWidth={fullWidth} // width of list
              currentSort={this.state.currentSort} // relevance sort
              changeSort={currentSort => {
                this.setState({
                  currentSort,
                  allSongs: []
                }),
                  this.getAllSongs();
              }} // change sort and reload videos
              filterResults={() => this.filterResults()} // apply from filters page
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
              navigator={row => {
                console.log('song', row);

                this.props.navigation.navigate('VIDEOPLAYER', {
                  id: row.id
                });
              }}
            />
          </ScrollView>
        </View>
        <NavigationBar currentPage={''} />
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
