import React from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from 'react-native';

import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';

import {
  getStartedContent,
  getAllContent,
  getCache,
  setCache
} from '../../services/GetContent';

import { NetworkContext } from '../../context/NetworkProvider';

import {
  navigate,
  refreshOnFocusListener,
  currentScene
} from '../../../AppNavigator';

export default class Catalogue extends React.Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props);
    console.log(currentScene());
    console.log(getCache());
    this.state = {
      loading: true,
      loadingMore: false,
      refreshing: true
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  get beRoute() {
    switch (currentScene()) {
      case 'SONGCATALOG':
        return 'song';
      case 'STUDENTFOCUSSHOW':
        return 'song';
    }
  }

  getContent() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    // let content = await Promise.all([
    //   getAllContent(
    //     'song',
    //     this.state.currentSort,
    //     this.state.page,
    //     this.filterQuery
    //   ),
    //   getStartedContent('song')
    // ]);
    // console.log(content);
  }

  render() {
    return (
      <>
        <NavMenuHeaders
          isMethod={true}
          currentPage={'HOME'}
          parentPage={'HOME'}
        />
        <View style={{ flex: 1 }}></View>
        <NavigationBar currentPage={''} />
      </>
    );
  }
}
