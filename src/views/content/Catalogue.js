import React from 'react';
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import Filters_V2 from '../../components/Filters_V2';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';

import { getContent } from '../../services/catalogue.service';

import { Contexts } from '../../context/CombinedContexts';

import {
  navigate,
  refreshOnFocusListener,
  currentScene
} from '../../../AppNavigator';

let styles;

export default class Catalogue extends React.Component {
  page = 1;
  scene = currentScene();
  data = { method: {}, inProgress: [], all: [] };
  static contextType = Contexts;

  constructor(props) {
    super(props);
    styles = setStyles(props.theme === 'light');
    this.state = {
      loading: true,
      loadingMore: false,
      refreshing: true,
      isLandscape: false
    };
  }

  componentDidMount() {
    getContent({
      scene: this.scene,
      page: this.page,
      filters: this.filterRef?.filterQuery,
      sort: this.sort?.sortQuery
    }).then(data => {
      this.metaFilters = data[1].meta.filterOptions;
      console.log(this.metaFilters);
      this.data = {
        method: data[0] || {},
        all: data[1].data || [],
        inProgress: data[2].data || []
      };
      console.log(this.data);
      this.setState({ loading: false, refreshing: false });
    });
  }

  componentWillUnmount() {}

  renderFLItem = ({ item }) => (
    <Card data={item} type={onTablet ? '' : 'row'} onNavigate={navigate} />
  );

  filter = () => {};

  renderFLHeader = () => {
    let {
      method: {
        id: methodId,
        completed,
        started,
        banner_button_url,
        banner_background_image
      },
      inProgress
    } = this.data;
    let { refreshing } = this.state;
    return (
      <>
        {this.scene === 'HOME' && !!methodId && (
          <ImageBackground
            resizeMode={'cover'}
            style={{
              width: '100%',
              aspectRatio: onTablet ? (this.context.isLandscape ? 2.5 : 1.8) : 1
            }}
            source={{
              uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:good,c_fill,g_face/${banner_background_image}`
            }}
          >
            <LinearGradient
              colors={[
                'transparent',
                'transparent',
                'rgba(80, 15, 25, 0.4)',
                'rgba(80, 15, 25, 0.98)'
              ]}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <Image
                style={{ height: '20%', aspectRatio: 801 / 286 }}
                source={require('../../assets/img/imgs/pianote-method.png')}
                resizeMode={'contain'}
              />
              <View style={styles.headerBtnsContainer}>
                {[
                  {
                    text: completed ? 'RESET' : started ? 'CONTINUE' : 'START',
                    icon: completed ? 'replay' : 'play',
                    action: () =>
                      completed
                        ? ''
                        : navigate('VIDEOPLAYER', { url: banner_button_url })
                  },
                  {
                    text: 'MORE INFO',
                    icon: 'arrow-right',
                    moreInfo: true,
                    action: () =>
                      navigate('METHOD', {
                        methodIsStarted: started,
                        methodIsCompleted: completed
                      })
                  }
                ].map(to => (
                  <TouchableOpacity
                    key={to.text}
                    onPress={to.action}
                    style={[
                      styles.headerBtns,
                      {
                        backgroundColor: to.moreInfo ? '' : '#fb1b2f',
                        padding: to.moreInfo ? 3 : 5,
                        borderWidth: to.moreInfo ? 2 : 0
                      }
                    ]}
                  >
                    <Icon name={to.icon} size={30} color={'white'} />
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'RobotoCondensed-Bold'
                      }}
                    >
                      {to.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </ImageBackground>
        )}
        {!!inProgress?.length && (
          <>
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                paddingBottom: 0,
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'RobotoCondensed-Bold',
                  color: 'white'
                }}
              >
                IN PROGRESS
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigate('SEEALL', { title: 'Continue', parent: this.scene })
                }
              >
                <Text style={{ fontSize: 14, color: '#fb1b2f' }}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              windowSize={10}
              data={inProgress}
              horizontal={true}
              initialNumToRender={1}
              maxToRenderPerBatch={10}
              onEndReachedThreshold={0.01}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{
                width: `${(onTablet ? 33 : 80) * inProgress?.length}%`
              }}
              renderItem={({ item, index }) => (
                <View style={{ width: `${100 / inProgress?.length}%` }}>
                  <View
                    style={{
                      width: `${100 * inProgress?.length}%`,
                      paddingRight: index === inProgress?.length - 1 ? 10 : 0
                    }}
                  >
                    <Card data={item} type={'compact'} onNavigate={navigate} />
                  </View>
                </View>
              )}
              keyExtractor={({ id }) => id.toString()}
            />
          </>
        )}
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            paddingBottom: 0,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'RobotoCondensed-Bold',
              color: 'white'
            }}
          >
            ALL LESSONS
          </Text>
          <Filters_V2
            disabled={refreshing}
            onApply={this.filter}
            meta={this.metaFilters}
            reference={r => (this.filterRef = r)}
          />
        </View>
      </>
    );
  };

  loadMore = () => {};

  refresh = () => {};

  render() {
    let { scene, data } = this;
    let { loading, loadingMore, refreshing } = this.state;
    let backgroundColor = scene === 'HOME' ? 'black' : '#00101d';
    return (
      <>
        <NavMenuHeaders
          isMethod={scene === 'HOME'}
          currentPage={scene}
          parentPage={scene}
        />
        {loading ? (
          <ActivityIndicator
            size='large'
            style={{ backgroundColor, flex: 1 }}
            color={'#6e777a'}
          />
        ) : (
          <FlatList
            windowSize={10}
            data={data.all}
            style={{ flex: 1, backgroundColor }}
            initialNumToRender={1}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.01}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps='handled'
            ListHeaderComponent={this.renderFLHeader}
            renderItem={this.renderFLItem}
            onEndReached={this.loadMore}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={<Text style={{}}>No Content</Text>}
            ListFooterComponent={
              <ActivityIndicator
                size='small'
                color={'#6e777a'}
                animating={loadingMore}
                style={{ padding: 15 }}
              />
            }
            refreshControl={
              <RefreshControl
                colors={['#6e777a']}
                tintColor={'#6e777a'}
                onRefresh={this.refresh}
                refreshing={refreshing}
              />
            }
          />
        )}
        <NavigationBar currentPage={''} />
      </>
    );
  }
}
let setStyles = isLight =>
  StyleSheet.create({
    headerBtnsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 600,
      marginBottom: '5%'
    },
    headerBtns: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: '40%',
      justifyContent: 'center',
      borderRadius: 99,
      margin: 10,
      marginLeft: 0,
      borderColor: 'white'
    }
  });
