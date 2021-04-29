import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl
} from 'react-native';

import ForumsCard from '../commons/ForumsCard';

import { getTopic, connection } from '../services/forum.service';

import { pencil } from '../assets/svgs';

let styles;
export default class Topic extends React.Component {
  page = 1;
  discussions = [];

  state = {
    loading: true,
    loadingMore: false,
    createDiscussionHeight: 0,
    refreshing: false
  };

  constructor(props) {
    super(props);
    let { isDark, NetworkContext } = props.route.params;
    styles = setStyles(isDark);
  }

  componentDidMount() {
    getTopic().then(discussions => {
      this.discussions = discussions;
      this.setState({ loading: false });
    });
  }

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  renderFLItem = ({ item }) => (
    <ForumsCard
      onNavigate={() => this.navigate('Discussion', { title: item.title })}
      isDark={this.props.route.params.isDark}
      data={item}
    />
  );

  loadMore = () => {
    if (!connection()) return;
    this.setState({ loadingMore: true }, () =>
      getTopic(++this.page).then(discussions => {
        this.discussions.push(...discussions);
        this.setState({ loadingMore: false });
      })
    );
  };

  refresh = () => {
    if (!connection()) return;
    this.setState({ refreshing: true }, () =>
      getTopic((this.page = 1)).then(discussions => {
        this.discussions = discussions;
        this.setState({ refreshing: false });
      })
    );
  };

  render() {
    let {
      loading,
      loadingMore,
      createDiscussionHeight,
      refreshing
    } = this.state;
    let { isDark, appColor } = this.props.route.params;
    return loading ? (
      <ActivityIndicator
        size='large'
        color={isDark ? 'white' : 'black'}
        animating={true}
        style={styles.loading}
      />
    ) : (
      <>
        <FlatList
          windowSize={10}
          data={this.discussions}
          style={styles.fList}
          initialNumToRender={1}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.01}
          removeClippedSubviews={true}
          keyboardShouldPersistTaps='handled'
          renderItem={this.renderFLItem}
          onEndReached={this.loadMore}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyList}>There are no threads</Text>
          }
          ListFooterComponent={
            <ActivityIndicator
              size='small'
              color={isDark ? 'white' : 'black'}
              animating={loadingMore}
              style={{
                padding: 15,
                marginBottom: createDiscussionHeight
              }}
            />
          }
          refreshControl={
            <RefreshControl
              colors={[isDark ? 'white' : 'black']}
              tintColor={isDark ? 'white' : 'black'}
              onRefresh={this.refresh}
              refreshing={refreshing}
            />
          }
        />
        <TouchableOpacity
          onLayout={({ nativeEvent: { layout } }) =>
            this.setState({ createDiscussionHeight: layout.height + 15 })
          }
          onPress={() => this.navigate('CreateDiscussion')}
          style={{ ...styles.bottomTOpacity, backgroundColor: appColor }}
        >
          {pencil({ height: 10, fill: 'white' })}
          <Text style={styles.bottomText}>CREATE A DISCUSSION</Text>
        </TouchableOpacity>
      </>
    );
  }
}

let setStyles = isDark =>
  StyleSheet.create({
    fList: {
      flex: 1,
      backgroundColor: isDark ? '#00101D' : 'white'
    },
    loading: {
      flex: 1,
      backgroundColor: isDark ? '#00101D' : 'white',
      alignItems: 'center'
    },
    emptyList: {
      color: isDark ? '#445F74' : 'black',
      fontFamily: 'OpenSans',
      padding: 15
    },
    bottomTOpacity: {
      padding: 15,
      width: '70%',
      maxWidth: 300,
      position: 'absolute',
      borderRadius: 99,
      bottom: 15,
      alignSelf: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    bottomText: {
      fontFamily: 'RobotoCondensed-Regular',
      color: 'white',
      fontWeight: '700',
      fontSize: 18,
      marginLeft: 10
    }
  });
