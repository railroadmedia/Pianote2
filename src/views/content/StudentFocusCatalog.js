/**
 * StudentFocusCatalog
 */
import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';

import { getStartedContent } from '../../services/GetContent';
import NavigationBar from '../../components/NavigationBar.js';
import NavMenuHeaders from '../../components/NavMenuHeaders.js';
import NavigationMenu from '../../components/NavigationMenu.js';
import HorizontalVideoList from '../../components/HorizontalVideoList.js';
import { NetworkContext } from '../../context/NetworkProvider';

const studentFocus = [
  {
    image: require('Pianote2/src/assets/img/imgs/questionAnswer.jpg'),
    type: 'Q&A'
  },
  {
    image: require('Pianote2/src/assets/img/imgs/bootcamps.jpg'),
    type: 'Bootcamps'
  },
  {
    image: require('Pianote2/src/assets/img/imgs/studentReview.jpg'),
    type: 'Student Review'
  }
];
export default class StudentFocusCatalog extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      progressStudentFocus: [], // videos
      isLoadingProgress: true,
      started: true
    };
  }

  componentDidMount = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await getStartedContent(
      'quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=podcast'
    );
    const newContent = await response.data.map(data => {
      return new ContentModel(data);
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

    this.setState({
      progressStudentFocus: [...this.state.progressStudentFocus, ...items],
      isLoadingProgress: false,
      started:
        response.data.length == 0 && this.state.progressStudentFocus.length == 0
          ? false
          : true
    });
  };

  renderFlatListItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.props.navigation.navigate('STUDENTFOCUSSHOW', {
            pack: item.type
          });
        }}
        style={{
          flex:
            studentFocus.length % 2 === 1 && studentFocus.length - 1 === index
              ? 0.5
              : 1,
          paddingRight: index % 2 === 0 ? 10 : 0,
          paddingTop: 10
        }}
      >
        <FastImage
          style={{
            aspectRatio: 1,
            borderRadius: 10 * factorRatio
          }}
          source={item.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'STUDENT FOCUS'} />

        <FlatList
          style={{
            flex: 1,
            backgroundColor: colors.mainBackground,
            paddingHorizontal: 10
          }}
          numColumns={2}
          removeClippedSubviews={true}
          keyExtractor={item => item.id}
          data={studentFocus}
          keyboardShouldPersistTaps='handled'
          ListHeaderComponent={() => (
            <>
              <Text
                style={{
                  paddingLeft: 12 * factorHorizontal,
                  paddingTop: 20 * factorVertical,
                  paddingBottom: 10 * factorVertical,
                  fontSize: 30 * factorRatio,
                  color: 'white',
                  justifyContent: 'flex-start',
                  fontFamily: 'OpenSans-ExtraBold'
                }}
              >
                Student Focus
              </Text>

              {this.state.started && (
                <View
                  key={'continueCourses'}
                  style={{
                    paddingLeft: fullWidth * 0.035,
                    backgroundColor: colors.mainBackground
                  }}
                >
                  <HorizontalVideoList
                    Title={'CONTINUE'}
                    seeAll={() =>
                      this.props.navigation.navigate('SEEALL', {
                        title: 'Continue',
                        parent: 'Student Focus'
                      })
                    }
                    hideSeeAll={true}
                    showArtist={true}
                    isLoading={this.state.isLoadingProgress}
                    showType={true}
                    items={this.state.progressStudentFocus}
                    itemWidth={
                      isNotch
                        ? fullWidth * 0.6
                        : onTablet
                        ? fullWidth * 0.425
                        : fullWidth * 0.55
                    }
                    itemHeight={
                      isNotch ? fullHeight * 0.155 : fullHeight * 0.175
                    }
                  />
                </View>
              )}
            </>
          )}
          renderItem={this.renderFlatListItem}
        />

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
