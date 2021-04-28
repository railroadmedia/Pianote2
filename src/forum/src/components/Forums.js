import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import ForumsCard from '../commons/ForumsCard';

import { getFollowed, getTopics, connection } from '../services/forum.service';

import { pencil } from '../assets/svgs';

let styles;
export default class Forums extends React.Component {
  followedPage = 1;
  topicsPage = 1;
  followed = [];
  topics = [];

  state = {
    followedLoadingMore: false,
    topicsLoadingMore: false,
    tab: 0,
    loading: true,
    createDiscussionHeight: 0,
    followedRefreshing: false,
    topicsRefreshing: false
  };

  constructor(props) {
    super(props);
    let { isDark, NetworkContext } = props.route.params;
    styles = setStyles(isDark);
  }

  componentDidMount() {
    Promise.all([getTopics(), getFollowed()]).then(([topics, followed]) => {
      this.topics = topics;
      this.followed = followed;
      this.setState({ loading: false });
    });
  }

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  renderFLItem = ({ item }) => (
    <ForumsCard
      onNavigate={() =>
        this.navigate(this.state.tab ? 'Discussion' : 'Topic', {
          title: item.title,
          isDark: this.props.route.params.isDark,
          appColor: this.props.route.params.appColor
        })
      }
      isDark={this.props.route.params.isDark}
      data={item}
    />
  );

  loadMore = () => {
    if (!connection()) return;
    let { tab } = this.state;
    let fORt = tab ? 'followed' : 'topics';
    this.setState({ [`${fORt}LoadingMore`]: true }, () =>
      (tab ? getFollowed : getTopics)(++this[`${fORt}Page`]).then(r => {
        this[fORt].push(...r);
        this.setState({ [`${fORt}LoadingMore`]: false });
      })
    );
  };

  refresh = () => {
    if (!connection()) return;
    let { tab } = this.state;
    let fORt = tab ? 'followed' : 'topics';
    this.setState({ [`${fORt}Refreshing`]: true }, () =>
      (tab ? getFollowed : getTopics)((this[`${fORt}Page`] = 1)).then(r => {
        this[fORt] = r;
        this.setState({ [`${fORt}Refreshing`]: false });
      })
    );
  };

  render() {
    let {
      followedLoadingMore,
      topicsLoadingMore,
      tab,
      loading,
      createDiscussionHeight,
      topicsRefreshing,
      followedRefreshing
    } = this.state;
    let { isDark, appColor, BottomNavigator } = this.props.route.params;
    return (
      <>
        <View style={styles.headerContainer}>
          {['Topics', 'Followed'].map((t, i) => (
            <TouchableOpacity
              key={t}
              onPress={() => this.setState({ tab: i })}
              style={[
                styles.headerTOpacity,
                tab === i ? { borderColor: appColor } : {}
              ]}
            >
              <Text
                style={[
                  styles.headerText,
                  tab === i ? { color: isDark ? 'white' : 'black' } : {}
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {loading ? (
          <ActivityIndicator
            size='large'
            color={isDark ? 'white' : 'black'}
            animating={true}
            style={styles.loading}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              key={tab}
              windowSize={10}
              data={this[tab ? 'followed' : 'topics']}
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
                <Text style={styles.emptyList}>
                  {tab ? 'You are not following any threads. ' : 'No topics'}
                </Text>
              }
              ListFooterComponent={
                <ActivityIndicator
                  size='small'
                  color={isDark ? 'white' : 'black'}
                  animating={tab ? followedLoadingMore : topicsLoadingMore}
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
                  refreshing={tab ? followedRefreshing : topicsRefreshing}
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
          </View>
        )}
        <BottomNavigator />
      </>
    );
  }
}
let setStyles = isDark =>
  StyleSheet.create({
    headerContainer: {
      paddingHorizontal: 15,
      flexDirection: 'row',
      backgroundColor: isDark ? '#00101D' : 'white'
    },
    headerTOpacity: {
      paddingVertical: 15,
      marginRight: 15,
      borderBottomWidth: 2,
      borderColor: isDark ? '#00101D' : 'white'
    },
    headerText: {
      fontFamily: 'OpenSans',
      fontSize: 20,
      fontWeight: '700',
      color: '#445F74'
    },
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
