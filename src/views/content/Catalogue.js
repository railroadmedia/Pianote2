import React from 'react';
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  ImageBackground
} from 'react-native';

import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import Card from '../../components/Card';

import { getContent } from '../../services/catalogue.service';

import { Contexts } from '../../context/CombinedContexts';

import {
  navigate,
  refreshOnFocusListener,
  currentScene
} from '../../../AppNavigator';

export default class Catalogue extends React.Component {
  page = 1;
  scene = currentScene();
  static contextType = Contexts;

  constructor(props) {
    super(props);
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
      filters: this.filters?.filterQuery,
      sort: this.sort?.sortQuery
    }).then(data => {
      this.data = {
        method: data[0],
        all: data[1].data,
        inProgress: data[2].data
      };
      console.log(this.data);
      this.setState({ loading: false, refreshing: false });
    });
  }

  componentWillUnmount() {}

  renderFLItem = ({ item }) => (
    <Card data={item} type={onTablet ? '' : 'row'} onNavigate={navigate} />
  );

  renderFLHeader = () =>
    this.scene === 'HOME' ? (
      <ImageBackground
        resizeMode={'cover'}
        style={{
          width: '100%',
          aspectRatio: onTablet ? (this.context.isLandscape ? 2.5 : 1.8) : 1,
          justifyContent: 'flex-end'
        }}
        source={require('Pianote2/src/assets/img/imgs/lisamethod.png')}
      ></ImageBackground>
    ) : (
      <></>
    );

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
            style={{
              backgroundColor,
              flex: 1
            }}
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
