/**
 * PROPS: isDark, appColor, action, type, posts, title, discussionId, threadId
 * action: can be 'create', 'edit' => used to display header title and button
 * type: can be 'thread', 'post' => used to display header type on header and on delete button and to display title input besides description field
 * posts: use posts[0] for editing a post's text or use it like posts for reply and multiquote displaying
 * title: thread title that can be edited
 * discussionId: for thread creation
 * threadId: for thread update
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RichEditor,
  RichToolbar,
  actions
} from 'react-native-pell-rich-editor';

import { InsertLinkModal } from '../commons/InsertLinkModal';
import HTMLRenderer from '../commons/HTMLRenderer';

import {
  connection,
  createPost,
  createThread,
  deletePost,
  deleteThread,
  editPost,
  updateThread
} from '../services/forum.service';

let styles;

class CRUD extends React.Component {
  state = { loading: false };

  constructor(props) {
    super(props);
    let { isDark, appColor } = props.route.params;
    styles = setStyles(isDark, appColor);
  }

  changeHTML = html => (this.richHTML = html);

  onInsertLink = type => this.linkModal?.toggle(type);

  onLinkDone = (title, url, type) => {
    if (url) {
      if (type === 'Link') {
        this.richText?.insertLink(title, url);
      } else if (type === 'Image') {
        this.richText?.insertImage(url);
      } else {
        if (url.includes('<iframe')) this.richText?.insertHTML(url);
        else if (url.includes('youtube.com'))
          this.richText?.insertHTML(
            `<p><iframe src="https://www.youtube.com/embed/${url.slice(
              url.indexOf('watch?v=') + 8,
              url.length
            )}" width="560" height="314" allowfullscreen="allowfullscreen"></iframe></p>`
          );
        else if (url.includes('vimeo.com'))
          this.richText?.insertHTML(
            `<p><iframe src="https://player.vimeo.com/video/${url.slice(
              url.indexOf('.com/') + 5,
              url.length
            )}" width="425" height="350" allowfullscreen="allowfullscreen"></iframe></p>`
          );
        else
          this.richText?.insertHTML(
            `<video controls="controls" width="300" height="150"><source src=${url} /></video>`
          );
      }
    }
  };

  save = async () => {
    if (!connection(true)) return;
    Keyboard.dismiss();
    this.richText?.blurContentEditor();
    this.setState({ loading: true });
    const {
      action,
      type,
      discussionId,
      threadId,
      postId
    } = this.props.route.params;
    if (type === 'thread') {
      if (action === 'create') {
        await createThread(this.title, this.richHTML, discussionId);
      } else {
        await updateThread(threadId, { title: this.title });
      }
    } else {
      if (action === 'create') {
        await createPost({ content: this.richHTML, thread_id: threadId });
      } else if (action === 'edit') {
        await editPost(postId, this.richHTML);
      } else {
        await createPost({
          content: this.richHTML,
          thread_id: threadId,
          parent_ids: parentIds
        });
      }
    }
    this.props.navigation.goBack();
  };

  onDelete = async () => {
    if (!connection(true)) return;
    Keyboard.dismiss();
    this.setState({ loading: true });
    const { type, threadId, postId } = this.props.route.params;
    if (type === 'thread') {
      await deleteThread(threadId);
      this.props.navigation.goBack();
      this.props.navigation.goBack();
    } else {
      await deletePost(postId);
    }
  };

  render() {
    let { loading } = this.state;
    const {
      route: {
        params: { isDark, appColor, action, type, quotes }
      },
      post,
      thread
    } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.cancelBtn}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {action === 'create'
              ? quotes?.length === 1
                ? 'Reply'
                : quotes?.length > 1
                ? 'MultiQuote'
                : `Create ${type}`
              : `Edit ${type}`}
          </Text>
          <TouchableOpacity onPress={this.save} disabled={loading}>
            <Text style={styles.actionBtn}>
              {action === 'create'
                ? quotes?.length
                  ? 'Reply'
                  : 'Create'
                : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1, margin: 15 }}
            keyboardShouldPersistTaps='handled'
            contentInsetAdjustmentBehavior='never'
          >
            {quotes?.map((post, index) => (
              <View style={styles.quoteContainer}>
                <HTMLRenderer
                  key={index}
                  html={`<b>${post.author.display_name}</b>:<br>${post.content}`}
                  customStyle={{ color: isDark ? '#FFFFFF' : '#00101D' }}
                />
              </View>
            ))}
            {type === 'thread' && (
              <TextInput
                style={styles.titleInput}
                placeholderTextColor={isDark ? '#445F74' : '#00101D'}
                placeholder='Title'
                defaultValue={thread?.title || ''}
                onChangeText={txt => (this.title = txt)}
              />
            )}
            {!(type === 'thread' && action === 'edit') && (
              <View style={{ borderRadius: 6, overflow: 'hidden' }}>
                <RichToolbar
                  getEditor={() => this.richText}
                  style={styles.richBar}
                  flatContainerStyle={styles.flatStyle}
                  selectedIconTint={'#2095F2'}
                  disabledIconTint={'#bfbfbf'}
                  onPressAddImage={() => this.onInsertLink('Image')}
                  onInsertLink={() => this.onInsertLink('Link')}
                  insertVideo={() => this.onInsertLink('Video')}
                  actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.insertImage,
                    actions.insertVideo
                  ]}
                />
                <RichEditor
                  editorStyle={styles.editorStyle}
                  ref={r => (this.richText = r)}
                  style={styles.richTextEditor}
                  placeholder={'Write something'}
                  initialContentHTML={action === 'edit' ? post?.content : null}
                  onChange={this.changeHTML}
                />
              </View>
            )}
          </ScrollView>
          {action === 'edit' && (
            <TouchableOpacity style={styles.deleteBtn} onPress={this.onDelete}>
              <Text style={styles.deleteBtnText}>DELETE {type}</Text>
            </TouchableOpacity>
          )}
          {loading && (
            <ActivityIndicator
              size='large'
              color={isDark ? 'white' : 'black'}
              animating={true}
              style={{
                backgroundColor: 'rgba(0,0,0,.5)',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
              }}
            />
          )}
        </View>
        <InsertLinkModal
          appColor={appColor}
          isDark={isDark}
          onClose={this.onLinkDone}
          ref={ref => (this.linkModal = ref)}
        />
      </SafeAreaView>
    );
  }
}

let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 10
    },
    cancelBtn: {
      fontFamily: 'OpenSans',
      fontSize: 14,
      color: isDark ? '#445F74' : '#00101D'
    },
    actionBtn: {
      fontFamily: 'OpenSans',
      fontSize: 14,
      color: appColor
    },
    headerTitle: {
      textTransform: 'capitalize',
      fontFamily: 'OpenSans-Bold',
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#000000'
    },
    quoteContainer: {
      backgroundColor: isDark ? '#002039' : '#E1E6EB',
      marginBottom: 10,
      borderRadius: 6,
      padding: 10
    },
    container: {
      flex: 1,
      backgroundColor: isDark ? '#00101D' : '#F7F9FC'
    },
    richTextEditor: {
      minHeight: 300
    },
    richBar: {
      backgroundColor: '#001424',
      borderColor: isDark ? '#002039' : '#E1E6EB',
      borderWidth: 4
    },
    flatStyle: {
      paddingHorizontal: 12
    },
    editorStyle: {
      backgroundColor: isDark ? '#002039' : '#E1E6EB',
      color: '#ffffff'
    },
    replyEditor: {
      marginBottom: 15,
      backgroundColor: isDark ? '#002039' : '#E1E6EB'
    },
    deleteBtn: {
      backgroundColor: appColor,
      borderRadius: 99,
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 20,
      paddingHorizontal: 80,
      marginBottom: 50
    },
    deleteBtnText: {
      textAlign: 'center',
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: 15,
      color: '#FFFFFF',
      textTransform: 'uppercase'
    },
    titleInput: {
      marginBottom: 15,
      backgroundColor: isDark ? '#002039' : '#E1E6EB',
      borderRadius: 5,
      color: '#FFFFFF',
      padding: 15,
      paddingHorizontal: 10
    }
  });
const mapStateToProps = (
  { threads },
  {
    route: {
      params: { threadId, postId }
    }
  }
) => ({
  post: threads.posts?.[postId],
  thread:
    threads.discussions?.[threadId] ||
    threads.all?.[threadId] ||
    threads.followed?.[threadId]
});
export default connect(mapStateToProps)(CRUD);
