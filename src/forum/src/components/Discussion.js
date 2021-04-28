import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Comment from '../commons/Comment';
import CommentInput from '../commons/CommentInput';
import {
  NetworkContext,
  getDiscussions,
  addReply
} from '../services/forum.service';

let styles;
export default class Discussion extends React.Component {
  state = {
    discussions: [],
    refreshing: false
  };
  constructor(props) {
    super(props);
    let { isDark, appColor } = props.route.params;
    Discussion.contextType = NetworkContext();

    styles = setStyles(isDark, appColor);
  }

  componentDidMount() {
    this.getDiscussions();
  }

  get connection() {
    if (this.context.isConnected) return true;
    this.context.showNoConnectionAlert();
  }

  async getDiscussions() {
    if (!this.connection) return;

    let discussions = await getDiscussions();
    this.setState({ discussions, refreshing: false });
  }

  refresh() {
    if (!this.connection) return;

    this.setState({ refreshing: true }, () => this.getDiscussions());
  }

  addDiscussion(discussion) {
    if (!this.connection) return;

    addReply(discussion);
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
          data={this.state.discussions}
          keyboardShouldPersistTaps='handled'
          keyExtractor={like => like.id.toString()}
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
          renderItem={({ item }) => (
            <Comment
              showReplyIcon={true}
              comment={item}
              appColor={appColor}
              isDark={isDark}
              onEdit={() => navigate('Edit')}
              onDelete={() => {}}
              goToReplies={() =>
                navigate('Replies', { isDark, appColor, comment: item })
              }
            />
          )}
        />
        <CommentInput
          isDark={isDark}
          onSubmit={discussion => this.addDiscussion(discussion)}
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
