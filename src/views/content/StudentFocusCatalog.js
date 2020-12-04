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
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { bindActionCreators } from 'redux';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';

import {
  getStartedContent,
  getStudentFocusTypes
} from '../../services/GetContent';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import NavigationMenu from '../../components/NavigationMenu';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import { NetworkContext } from '../../context/NetworkProvider';

import { cacheStudentFocus } from '../../redux/StudentFocusCacheActions';

class StudentFocusCatalog extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let { studentFocusCache } = props;
    this.state = {
      progressStudentFocus: [], // videos
      studentFocus: [],
      refreshing: true,
      refreshControl: false,
      started: true,
      ...this.initialValidData(studentFocusCache, true)
    };
  }

  componentDidMount() {
    this.getData();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () =>
        !this.firstTimeFocused ? (this.firstTimeFocused = true) : this.refresh()
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  async getData() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      getStartedContent(
        'quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=podcast'
      ),
      getStudentFocusTypes()
    ]);
    this.props.cacheStudentFocus({
      types: content[1],
      inProgress: content[0]
    });
    this.setState(
      this.initialValidData({
        types: content[1],
        inProgress: content[0]
      })
    );
  }

  initialValidData = (content, fromCache) => {
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
        refreshControl: fromCache,
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
          this.props.navigation.navigate('STUDENTFOCUSSHOW', {
            type: item.type,
            thumbnailUrl: item.thumbnailUrl
          });
        }}
        style={{
          flex:
            this.state.studentFocus.length % 2 === 1 &&
            this.state.studentFocus.length - 1 === index
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
      <View
        style={[styles.container, { backgroundColor: colors.mainBackground }]}
      >
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'STUDENT FOCUS'} />
        {!this.state.refreshing ? (
          <FlatList
            style={{
              flex: 1,
              backgroundColor: colors.mainBackground,
              paddingHorizontal: 10
            }}
            numColumns={2}
            removeClippedSubviews={true}
            keyExtractor={item => item.name}
            data={this.state.studentFocus}
            keyboardShouldPersistTaps='handled'
            refreshControl={
              <RefreshControl
                colors={[colors.pianoteRed]}
                refreshing={this.state.refreshControl}
                onRefresh={() => this.refresh()}
              />
            }
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
                      isLoading={false}
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
        ) : (
          <ActivityIndicator
            size='large'
            style={{ flex: 1 }}
            color={colors.secondBackground}
          />
        )}
        <NavigationBar currentPage={''} />
        <Modal
          key={'navMenu'}
          isVisible={this.state.showModalMenu}
          style={{
            margin: 0,
            height: '100%',
            width: '100%'
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
const mapStateToProps = state => ({
  studentFocusCache: state.studentFocusCache
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheStudentFocus }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentFocusCatalog);
