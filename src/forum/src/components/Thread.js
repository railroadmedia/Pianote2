import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Post from '../commons/Post';
import { addReply, connection, getThread } from '../services/forum.service';

let styles;
export default class Thread extends React.Component {
  state = {
    thread: [],
    refreshing: false
  };
  constructor(props) {
    super(props);
    let { isDark, appColor } = props.route.params;

    styles = setStyles(isDark, appColor);
  }

  componentDidMount() {
    this.getThread();
  }

  async getThread() {
    if (connection(true)) {
      const { threadId } = this.props.route.params;
      let thread = await getThread(threadId);
      console.log(thread);
      this.setState({ thread, refreshing: false });
    }
  }

  refresh() {
    if (connection(true)) {
      this.setState({ refreshing: true }, () => this.getDiscussions());
    }
  }

  addDiscussion(discussion) {
    if (connection(true)) {
      addReply(discussion);
    }
  }

  render() {
    let {
      route: {
        params: { isDark, appColor }
      },
      navigation: { navigate }
    } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.container}
          data={this.state.thread.posts?.slice(0, 10)}
          keyboardShouldPersistTaps='handled'
          keyExtractor={post => post.id.toString()}
          initialNumToRender={1}
          maxToRenderPerBatch={10}
          refreshControl={
            <RefreshControl
              colors={[appColor]}
              tintColor={appColor}
              onRefresh={() => this.refresh()}
              refreshing={this.state.refreshing}
            />
          }
          ListHeaderComponent={() => (
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Follow</Text>
            </TouchableOpacity>
          )}
          renderItem={({ item, index }) => (
            <Post
              post={item}
              index={index + 1}
              appColor={appColor}
              isDark={isDark}
              onEdit={() => navigate('CRUD')}
              onDelete={() => {}}
              onReplies={() => {}}
            />
          )}
        />
      </SafeAreaView>
    );
  }
}
let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#00101D' : '#F7F9FC'
    },
    button: {
      alignSelf: 'center',
      paddingVertical: 5,
      paddingHorizontal: 30,
      borderColor: appColor,
      backgroundColor: isDark ? '#00101D' : '#F7F9FC',
      borderWidth: 2,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonText: {
      textAlign: 'center',
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: 15,
      color: appColor
    }
  });
