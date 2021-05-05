/**
 * StudentFocusCatalog
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';

import {
  getStartedContent,
  getStudentFocusTypes
} from '../../services/GetContent';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import { NetworkContext } from '../../context/NetworkProvider';

import { navigate, refreshOnFocusListener } from '../../../AppNavigator';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class StudentFocusCatalog extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      progressStudentFocus: [], // videos
      studentFocus: [],
      refreshing: true,
      refreshControl: false,
      started: true
    };
  }

  componentDidMount() {
    this.getData();
    this.refreshOnFocusListener = refreshOnFocusListener.call(this);
  }

  componentWillUnmount() {
    this.refreshOnFocusListener?.();
  }

  async getData() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      getStartedContent(
        'quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=podcast'
      ),
      getStudentFocusTypes()
    ]);
    this.setState(
      this.initialValidData({
        types: content[1],
        inProgress: content[0]
      })
    );
  }

  initialValidData = content => {
    try {
      const newContent = content.inProgress.data.map(data => {
        return new ContentModel(data);
      });
      let shows = content.types;
      shows = Object.keys(shows).map(key => {
        shows[key].type = key;
        return shows[key];
      });
      let items = [];
      for (let i in newContent) {
        items.push({
          title: newContent[i].getField('title'),
          artist: newContent[i].getField('instructor').fields[0].value,
          thumbnail: newContent[i].getData('thumbnail_url'),
          type: newContent[i].post.type,
          id: newContent[i].id,
          isAddedToList: newContent[i].isAddedToList,
          isStarted: newContent[i].isStarted,
          isCompleted: newContent[i].isCompleted,
          progress_percent: newContent[i].post.progress_percent
        });
      }
      return {
        progressStudentFocus: items,
        studentFocus: shows,
        refreshing: false,
        refreshControl: false,
        started: items.length !== 0
      };
    } catch (e) {
      return {};
    }
  };

  renderFlatListItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          navigate('STUDENTFOCUSSHOW', {
            type: item.type,
            thumbnailUrl: item.thumbnailUrl
          });
        }}
        style={{
          width: '50%',
          marginTop: '3%',
          paddingLeft: index % 2 == 0 ? 10 : '1%',
          paddingRight: index % 2 == 0 ? '1%' : 10
        }}
      >
        <FastImage
          style={{
            aspectRatio: 1,
            borderWidth: 0.3,
            borderColor: colors.pianoteRed,
            borderRadius: 10
          }}
          source={{ uri: item.thumbnailUrl }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  refresh() {
    this.setState({ refreshControl: true }, () => this.getData());
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <NavMenuHeaders currentPage={'HOME'} parentPage={'STUDENT FOCUS'} />
        {!this.state.refreshing ? (
          <FlatList
            style={styles.mainContainer}
            numColumns={2}
            removeClippedSubviews={true}
            keyExtractor={item => item.name}
            data={this.state.studentFocus}
            keyboardShouldPersistTaps='handled'
            refreshControl={
              <RefreshControl
                tintColor={'transparent'}
                colors={[colors.secondBackground]}
                onRefresh={() => this.refresh()}
                refreshing={isiOS ? false : this.state.refreshControl}
              />
            }
            ListHeaderComponent={() => (
              <>
                {isiOS && this.state.refreshControl && (
                  <ActivityIndicator
                    size='small'
                    style={styles.activityIndicator}
                    color={colors.secondBackground}
                  />
                )}
                <Text style={styles.contentPageHeader}>Student Focus</Text>
                {this.state.started && (
                  <View style={styles.mainContainer}>
                    <HorizontalVideoList
                      hideFilterButton={true}
                      Title={'CONTINUE'}
                      seeAll={() =>
                        navigate('SEEALL', {
                          title: 'Continue',
                          parent: 'Student Focus'
                        })
                      }
                      showType={true}
                      items={this.state.progressStudentFocus}
                    />
                  </View>
                )}
              </>
            )}
            renderItem={this.renderFlatListItem}
          />
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
