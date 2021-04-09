/**
 * Schedule
 */
import React from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { ContentModel } from '@musora/models';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import { SafeAreaView } from 'react-navigation';
import NavigationBar from '../../components/NavigationBar.js';
import { getScheduleContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

export default class Schedule extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      title: props.route.params.title,
      parent: props.route.params.parent
    };
  }

  async componentDidMount() {
    let response = await getScheduleContent();
    console.log('response: ', response);
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
          bottom: 'never',
          top: 'never'
        }}
        style={styles.mainContainer}
      >
        <NavMenuHeaders
          currentPage={'LESSONS'}
          parentPage={this.state.parent}
        />
        <StatusBar
          backgroundColor={colors.thirdBackground}
          barStyle={'light-content'}
        />
        <Text style={styles.contentPageHeader}>{this.state.title}</Text>
        <View style={{ flex: 1 }}></View>
        <NavigationBar currentPage={'SCHEDULE'} />
      </SafeAreaView>
    );
  }
}
