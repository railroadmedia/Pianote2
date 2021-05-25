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
import { bindActionCreators } from 'redux';
import FastImage from 'react-native-fast-image';
import {
  getStartedContent,
  getStudentFocusTypes
} from '../../services/GetContent';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import { NetworkContext } from '../../context/NetworkProvider';
import { cacheAndWriteStudentFocus } from '../../redux/StudentFocusCacheActions';
import { navigate, refreshOnFocusListener } from '../../../AppNavigator';

class StudentFocusCatalog extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let { studentFocusCache } = props;
    this.state = {
      progressStudentFocus: [],
      studentFocus: [],
      refreshing: true,
      refreshControl: false,
      ...this.initialValidData(studentFocusCache, true)
    };
  }

  componentDidMount() {
    this.getData();
    this.refreshOnFocusListener = refreshOnFocusListener.call(this);
  }

  componentWillUnmount = () => this.refreshOnFocusListener?.();

  async getData() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      getStartedContent(
        'quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=podcast',
        1
      ),
      getStudentFocusTypes()
    ]);
    this.props.cacheAndWriteStudentFocus({
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
      const newContent = content.inProgress.data;
      let shows = content.types;
      shows = Object.keys(shows).map(key => {
        shows[key].type = key;
        return shows[key];
      });
      return {
        progressStudentFocus: newContent,
        studentFocus: shows,
        refreshing: false,
        refreshControl: fromCache
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
          paddingLeft: index % 2 === 0 ? 10 : '1%',
          paddingRight: index % 2 === 0 ? '1%' : 10
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

  render() {
    return (
      <View style={styles.mainContainer}>
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'STUDENT FOCUS'} />
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
                onRefresh={() =>
                  this.setState({ refreshControl: true }, () => this.getData())
                }
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
                {!!this.state.progressStudentFocus.length && (
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
const mapStateToProps = state => ({
  studentFocusCache: state.studentFocusCache
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteStudentFocus }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentFocusCatalog);
