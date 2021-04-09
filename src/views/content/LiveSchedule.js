/**
 * LiveSchedule
 */
import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { ContentModel } from '@musora/models';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import { SafeAreaView } from 'react-navigation';
import NavigationBar from '../../components/NavigationBar.js';
import {
  seeAllContent,
  getMyListContent,
  getAllContent,
  getStartedContent
} from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';
import { goBack } from '../../../AppNavigator.js';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

// correlates to filters
const typeDict = {
  'My List': 'MYLIST',
  Packs: 'PACKS',
  Lessons: 'LESSONS',
  'Student Focus': 'STUDENTFOCUS',
  Songs: 'SONGS',
  Courses: 'COURSES'
};

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class LiveSchedule extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    let deepFilters = decodeURIComponent(this.props.route?.params?.url).split(
      '?'
    )[1];
    this.filterQuery = deepFilters && `&${deepFilters}`;
    this.getAllLessons();
  }

  async getAllLessons(loadMore) {
    this.setState({ filtering: true });
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = null;
    if (this.state.parent === 'My List') {
      // use my list API call when navigating to see all from my list
      response = await getMyListContent(
        this.state.page,
        this.filterQuery,
        this.state.title == 'In Progress' ? 'started' : 'completed'
      );
    } else if (this.state.parent === 'Lessons') {
      // lessons continue and new
      if (this.state.title.slice(0, 3) == 'New') {
        response = await seeAllContent(
          'lessons',
          'new',
          this.state.page,
          this.filterQuery
        );
      } else if (this.state.title.includes('All')) {
        response = await getAllContent(
          '',
          'newest',
          this.state.page,
          this.filterQuery
        );
      } else {
        response = await seeAllContent(
          'lessons',
          'continue',
          this.state.page,
          this.filterQuery
        );
      }
    } else if (this.state.parent === 'Courses') {
      if (this.state.title === 'Continue') {
        response = await seeAllContent(
          'courses',
          'continue',
          this.state.page,
          this.filterQuery
        );
      } else {
        response = await getAllContent(
          'course',
          'newest',
          this.state.page,
          this.filterQuery
        );
      }
    } else if (this.state.parent === 'Songs') {
      if (this.state.title === 'Continue') {
        response = await seeAllContent(
          'song',
          'continue',
          this.state.page,
          this.filterQuery
        );
      } else {
        response = await getAllContent(
          'song',
          'newest',
          this.state.page,
          this.filterQuery
        );
      }
    } else if (this.state.parent === 'Student Focus') {
      response = await getStartedContent(
        'quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=podcast'
      );
    }
    this.metaFilters = response?.meta?.filterOptions;
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
        duration: i,
        like_count: newContent[i].post.like_count,
        mobile_app_url: newContent[i].post.mobile_app_url,
        lesson_count: newContent[i].post.lesson_count,
        currentLessonId: newContent[i].post?.song_part_id,
        isLiked: newContent[i].post.is_liked_by_current_user,
        isAddedToList: newContent[i].isAddedToList,
        isStarted: newContent[i].isStarted,
        isCompleted: newContent[i].isCompleted,
        bundle_count: newContent[i].post.bundle_count,
        progress_percent: newContent[i].post.progress_percent
      });
    }

    this.setState(state => ({
      allLessons: loadMore ? state.allLessons.concat(items) : items,
      outVideos: items.length == 0 || response.data.length < 20 ? true : false,
      page: this.state.page + 1,
      isLoadingAll: false,
      refreshing: false,
      filtering: false,
      isPaging: false
    }));
  }

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
      try {
        if (newContent.getField('instructor') !== 'TBD') {
          return newContent.getField('instructor').fields[0].value;
        } else {
          return newContent.getField('instructor').name;
        }
      } catch (error) {
        return '';
      }
    }
  };

  getVideos = () => {
    // change page before getting more lessons if paging
    if (!this.state.outVideos) {
      this.setState({ page: this.state.page + 1 }, () =>
        this.getAllLessons(true)
      );
    }
  };

  render() {
    return (
      <SafeAreaView
        forceInset={{
          bottom: 'never'
        }}
        style={styles.mainContainer}
      >
        <StatusBar
          backgroundColor={colors.thirdBackground}
          barStyle={'light-content'}
        />
        <View style={styles.childHeader}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => goBack()}>
            <Back
              width={backButtonSize}
              height={backButtonSize}
              fill={'white'}
            />
          </TouchableOpacity>
          <Text style={styles.childHeaderText}>Lessons</Text>
          <View style={{ flex: 1 }} />
        </View>
        <View style={{flex: 1}}>
            <Text 
                style={[
                    styles.contentPageHeader,
                    {
                        marginVertical: 10,
                    }
                ]}
            >
                Live Schedule
            </Text>
        </View>
        <NavigationBar currentPage={'LIVESCHEDULE'} />
      </SafeAreaView>
    );
  }
}
