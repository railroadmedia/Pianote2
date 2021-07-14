import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from '../../assets/icons';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import { getMyListContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';
import { cacheAndWriteMyList } from '../../redux/MyListCacheActions';
import { ActivityIndicator } from 'react-native';
import { navigate, refreshOnFocusListener } from '../../../AppNavigator';

const onTablet = global.onTablet;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class MyList extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let { myListCache } = props;
    this.state = {
      allLessons: [],
      page: 1,
      isLoadingAll: true,
      isPaging: false,
      refreshing: false,
      ...this.initialValidData(myListCache, false, true)
    };
  }

  componentDidMount() {
    this.getMyList();
    this.refreshOnFocusListener = refreshOnFocusListener.call(this);
  }

  componentWillUnmount = () => this.refreshOnFocusListener?.();

  getMyList = async loadMore => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let response = await getMyListContent(
      this.state.page,
      this.filterQuery,
      ''
    );
    this.metaFilters = response?.meta?.filterOptions;
    this.props.cacheAndWriteMyList(response);
    this.setState(this.initialValidData(response, loadMore));
  };

  initialValidData = (content, loadMore, fromCache) => {
    try {
      const newContent = content.data;
      return {
        allLessons: loadMore
          ? this.state?.allLessons?.concat(newContent)
          : newContent,
        page: this.state?.page + 1 || 1,
        isLoadingAll: false,
        isPaging: false,
        refreshing: fromCache
      };
    } catch (e) {
      return {};
    }
  };

  removeFromMyList = contentID => {
    let { myListCache } = this.props;
    this.props.cacheAndWriteMyList({
      ...myListCache,
      data: myListCache.data.filter(d => d.id !== contentID)
    });
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState({
      allLessons: this.state.allLessons.filter(al => al.id !== contentID)
    });
  };

  handleScroll = event => {
    if (isCloseToBottom(event) && !this.state.isPaging) {
      this.setState({ isPaging: true }, () => this.getMyList(true));
    }
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
              onRefresh={() =>
                this.setState({ refreshing: true, page: 1 }, () =>
                  this.getMyList()
                )
              }
              refreshing={isiOS ? false : this.state.refreshing}
            />
          }
        >
          {isiOS && this.state.refreshing && (
            <ActivityIndicator
              size='small'
              style={{ padding: 20 }}
              color={colors.secondBackground}
            />
          )}
          <Text style={[styles.contentPageHeader, { paddingLeft: 10 }]}>
            My List
          </Text>
          <TouchableOpacity
            style={[
              styles.tabRightContainer,
              {
                marginTop: 10
              }
            ]}
            onPress={() => {
              navigate('SEEALL', {
                title: 'In Progress',
                parent: 'My List'
              });
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                paddingVertical: 20,
                width: width * 0.26 + 10 / 2
              }}
            >
              <Text
                style={[
                  styles.tabRightContainerText,
                  {
                    position: 'absolute',
                    paddingLeft: 10,
                    width: width * 0.56 + 10 / 2
                  }
                ]}
              >
                In Progress
              </Text>
            </View>
            <View style={[styles.centerContent, { flex: 0.15 }]}>
              <Icon.Entypo
                name={'chevron-thin-right'}
                size={onTablet ? 30 : 20}
                color={colors.secondBackground}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabRightContainer}
            onPress={() => {
              navigate('SEEALL', {
                title: 'Completed',
                parent: 'My List'
              });
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                paddingVertical: 20,
                width: width * 0.26 + 10 / 2
              }}
            >
              <Text
                style={[
                  styles.tabRightContainerText,
                  {
                    position: 'absolute',
                    paddingLeft: 10,
                    width: width * 0.56 + 10 / 2
                  }
                ]}
              >
                Completed
              </Text>
            </View>
            <View style={[styles.centerContent, { flex: 0.15 }]}>
              <Icon.Entypo
                name={'chevron-thin-right'}
                s
                size={onTablet ? 30 : 20}
                color={colors.secondBackground}
              />
            </View>
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
            filters={this.metaFilters}
            applyFilters={filters =>
              new Promise(res =>
                this.setState({ allLessons: [], page: 1 }, () => {
                  this.filterQuery = filters;
                  this.getMyList().then(res);
                })
              )
            }
            removeItem={contentID => this.removeFromMyList(contentID)}
            imageWidth={(onTablet ? 0.225 : 0.3) * width}
          />
        </ScrollView>
        <NavigationBar currentPage={'MyList'} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'black',
    flex: 1
  },
  gradientContanier: {
    borderRadius: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  contentPageHeader: {
    paddingLeft: 10,
    fontSize: onTablet ? 34 : 26,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold'
  },
  mainContainer: {
    backgroundColor: '#00101d',
    flex: 1
  },
  tabRightContainer: {
    // container used for my list in progress & on settings
    width: '100%',
    borderTopWidth: 0.5,
    paddingVertical: 10,
    borderTopColor: '#445f73',
    borderBottomWidth: 0.5,
    borderBottomColor: '#445f73',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tabRightContainerText: {
    // container used for my list in progress & on settings
    paddingLeft: onTablet ? 10 : 5,
    fontSize: onTablet ? 24 : 20,
    textAlign: 'left',
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73'
  }
});

const mapStateToProps = state => ({ myListCache: state.myListCache });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteMyList }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyList);
