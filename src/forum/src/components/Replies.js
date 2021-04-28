import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions
} from 'react-native';

import { SafeAreaView } from 'react-navigation';

import Comment from '../commons/Comment';
import CommentInput from '../commons/CommentInput';
import { NetworkContext, addReply } from '../services/forum.service';

const windowWidth = Dimensions.get('window').width;
const maxFontMultiplier =
  windowWidth < 375 ? 1 : windowWidth < 1024 ? 1.35 : 1.8;
let styles;
export default class Replies extends React.Component {
  state = {
    replyText: '',
    comment: null
  };

  constructor(props) {
    super(props);
    const { isDark, comment } = props.route.params;
    styles = setStyles(isDark);
    Replies.contextType = NetworkContext;

    this.state.comment = comment;
  }

  get connection() {
    if (this.context.isConnected) return true;
    this.context.showNoConnectionAlert();
  }

  addReply = async replyText => {
    if (!this.connection) return;
    addReply(replyText);
  };

  render() {
    let { replyText, comment } = this.state;
    const { isDark, appColor } = this.props.route.params;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={isDark ? '#00101D' : '#F7F9FC'}
          barStyle={isDark ? 'dark-content' : 'light-content'}
        />

        {comment && (
          <ScrollView keyboardShouldPersistTaps='handled'>
            <Comment
              comment={comment}
              showReplyIcon={false}
              isDark={isDark}
              appColor={appColor}
              onEdit={() => navigate('Edit')}
              onDelete={() => {}}
            />

            <View style={styles.titleContainer}>
              <Text
                maxFontSizeMultiplier={maxFontMultiplier}
                style={styles.repliesNum}
              >
                {comment.replies?.length || 0}
                {comment.replies?.length > 1 ? ' Replies' : ' Reply'}
              </Text>
            </View>
            {comment.replies?.map(reply => (
              <Comment
                key={reply.id}
                comment={reply}
                showReplyIcon={false}
                isDark={isDark}
                appColor={appColor}
                onEdit={() => navigate('Edit')}
                onDelete={() => {}}
              />
            ))}
          </ScrollView>
        )}

        <CommentInput
          isDark={isDark}
          onSubmit={replyText => this.addReply(replyText)}
        />
      </SafeAreaView>
    );
  }
}

let setStyles = isDark =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#00101D' : '#F7F9FC'
    },
    headerTitle: {
      fontSize: 14,
      fontFamily: 'OpenSans-Bold',
      color: isDark ? '#EDEEEF' : '#00101D',
      alignSelf: 'center'
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderTopWidth: 1,
      height: 80
    },
    titleContainer: {
      height: 70,
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    textInput: {
      flex: 1,
      maxHeight: 150
    },
    leftAreaContainer: {
      height: 55,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 15
    },
    repliesNum: {
      fontSize: 24,
      fontFamily: 'OpenSans-Bold',
      marginLeft: 15,
      color: isDark ? '#EDEEEF' : '#00101D'
    }
  });
