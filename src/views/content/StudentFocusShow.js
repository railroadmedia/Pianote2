import React from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FastImage from 'react-native-fast-image';
import Back from '../../assets/img/svgs/back.svg';
import { SafeAreaView } from 'react-navigation';
import { NetworkContext } from '../../context/NetworkProvider';
import NavigationBar from '../../components/NavigationBar';
import VerticalVideoList from '../../components/VerticalVideoList';
import { getAllContent, getStudentFocusTypes } from '../../services/GetContent';
import { cacheAndWritePodcasts } from '../../redux/PodcastsCacheActions';
import { cacheAndWriteQuickTips } from '../../redux/QuickTipsCacheActions';
import { goBack, refreshOnFocusListener } from '../../../AppNavigator';

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

class StudentFocusShow extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      thumbnailUrl: props.route?.params?.thumbnailUrl,
      allLessons: [],
      refreshing: false,
      isLoadingAll: true,
      isPaging: false,
      filtering: false,
      page: 1,
      currentSort: 'newest',
      ...this.initialValidData(
        props.route?.params?.type === 'quick-tips'
          ? props.quickTipsCache
          : props.podcastsCache,
        true
      )
    };
  }

  componentDidMount() {
    this.getData();
    this.refreshOnFocusListener = refreshOnFocusListener.call(this);
  }

  componentWillUnmount = () => this.refreshOnFocusListener?.();

  getData = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      getStudentFocusTypes(),
      getAllContent(
        this.props.route?.params?.type,
        this.state.currentSort,
        this.state.page,
        this.filterQuery
      )
    ]);
    this.metaFilters = content?.[1]?.meta?.filterOptions;
    this.props[
      this.props.route?.params?.type === 'quick-tips'
        ? 'cacheAndWriteQuickTips'
        : 'cacheAndWritePodcasts'
    ]({
      all: content[1],
      thumbnail: content[0]
    });
    this.setState(
      this.initialValidData({
        all: content[1],
        thumbnail: content[0]
      })
    );
  };

  initialValidData = (content, fromCache) => {
    try {
      const newContent = content.all.data;

      return {
        thumbnailUrl:
          content.thumbnail[this.props.route?.params?.type]?.thumbnailUrl,
        allLessons: newContent,
        page: 1,
        isLoadingAll: false,
        refreshing: fromCache,
        filtering: false,
        isPaging: false
      };
    } catch (e) {
      return {};
    }
  };

  async getStudentFocus() {
    let studentFocus = await getStudentFocusTypes();
    this.setState({
      thumbnailUrl: studentFocus[this.props.route?.params?.type].thumbnailUrl
    });
  }

  getAllLessons = async isLoadingMore => {
    this.setState({ filtering: true });
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let response = await getAllContent(
      this.props.route?.params?.type,
      this.state.currentSort,
      this.state.page,
      this.filterQuery
    );
    this.metaFilters = response?.meta?.filterOptions;
    const newContent = response.data;

    this.setState(state => ({
      allLessons: isLoadingMore
        ? state.allLessons.concat(newContent)
        : newContent,
      isLoadingAll: false,
      refreshing: false,
      filtering: false,
      isPaging: false
    }));
  };

  handleScroll = event => {
    if (isCloseToBottom(event) && !this.state.isPaging) {
      this.setState({ page: this.state.page + 1, isPaging: true }, () =>
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
        style={{ flex: 1, backgroundColor: colors.mainBackground }}
      >
        <StatusBar
          backgroundColor={colors.mainBackground}
          barStyle={'light-content'}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          style={{ flex: 1, backgroundColor: colors.mainBackground }}
          onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
          refreshControl={
            <RefreshControl
              tint={'transparent'}
              colors={[colors.secondBackground]}
              onRefresh={() =>
                this.setState({ refreshing: true, page: 1 }, () =>
                  this.getAllLessons()
                )
              }
              refreshing={isiOS ? false : this.state.refreshing}
            />
          }
          style={{ flex: 1 }}
        >
          {isiOS && this.state.refreshing && (
            <ActivityIndicator
              size='small'
              style={{ padding: 10 }}
              color={colors.secondBackground}
            />
          )}
          <View key={'imageContainer'} style={{ width: '100%' }}>
            <TouchableOpacity
              onPress={() => goBack()}
              style={{
                padding: 15
              }}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
              />
            </TouchableOpacity>

            <View
              key={'bootcampImage'}
              style={{
                paddingHorizontal: '20%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 25
              }}
            >
              <FastImage
                style={{
                  width: '80%',
                  maxWidth: 400,
                  maxHeight: 400,
                  aspectRatio: 1,
                  borderRadius: 10,
                  borderColor: colors.thirdBackground,
                  borderWidth: 5
                }}
                source={{ uri: this.state.thumbnailUrl }}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </View>
          </View>
          <VerticalVideoList
            items={this.state.allLessons}
            title={'EPISODES'}
            isPaging={this.state.isPaging}
            isLoading={this.state.isLoadingAll}
            type={'STUDENTFOCUSSHOW'}
            showType={true}
            showArtist={true}
            showLength={false}
            showFilter={
              this.props.route?.params?.type === 'quick-tips' ? true : false
            }
            showSort={
              this.props.route?.params?.type === 'quick-tips' ? true : false
            }
            filters={this.metaFilters}
            currentSort={this.state.currentSort}
            changeSort={sort =>
              this.setState(
                {
                  currentSort: sort,
                  isPaging: false,
                  allLessons: [],
                  page: 1
                },
                () => this.getAllLessons()
              )
            }
            imageWidth={(onTablet ? 0.225 : 0.3) * width}
            applyFilters={filters =>
              new Promise(res =>
                this.setState({ allLessons: [], page: 1, filters }, () => {
                  this.filterQuery = filters;
                  this.getAllLessons().then(res);
                })
              )
            }
          />
        </ScrollView>
        <NavigationBar currentPage={'NONE'} />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  podcastsCache: state.podcastsCache,
  quickTipsCache: state.quickTipsCache
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { cacheAndWriteQuickTips, cacheAndWritePodcasts },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(StudentFocusShow);
