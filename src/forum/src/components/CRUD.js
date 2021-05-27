/**
 * PROPS: isDark, appColor, action, type, posts, title, discussionId, threadId, onDone
 * action: can be 'create', 'edit', 'reply', 'multiQuote' => used to display header title and button
 * type: can be 'thread', 'post' => used to display header type on header and on delete button and to display title input besides description field
 * posts: use posts[0] for editing a post's text or use it like posts for reply and multiquote displaying
 * title: thread title that can be edited
 * discussionId: for thread creation
 * threadId: for thread update
 * onDone: function to call after crud action is done
 */

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
  RichEditor,
  RichToolbar,
  actions
} from 'react-native-pell-rich-editor';
import { InsertLinkModal } from '../commons/InsertLinkModal';
import {
  connection,
  createPost,
  createThread,
  deletePost,
  deleteThread,
  editPost,
  updateThread
} from '../services/forum.service';
import HTMLRenderer from '../commons/HTMLRenderer';

let styles;

export default class CRUD extends React.Component {
  richText = React.createRef();

  constructor(props) {
    super(props);
    let { isDark, appColor, title } = props.route.params;
    this.state = {
      title
    };
    styles = setStyles(isDark, appColor);
  }

  handleChange(html) {
    this.richHTML = html;
  }

  onInsertLink = type => this.linkModal?.toggle(type);

  onLinkDone = (title, url, type) => {
    if (url) {
      if (type === 'Link') {
        this.richText?.current.insertLink(title, url);
      } else if (type === 'Image') {
        this.richText.current?.insertImage(url);
      } else {
        this.richText.current?.insertVideo(url);
      }
    }
  };

  save = async () => {
    if (!connection()) return;

    const {
      action,
      type,
      discussionId,
      threadId,
      postId,
      onDone
    } = this.props.route.params;

    let html = await this.richText.current?.getContentHtml();
    if (type === 'thread') {
      if (action === 'create') {
        await createThread(this.state.title, html, discussionId);
      } else {
        await updateThread(threadId, { title: this.state.title });
      }
    } else {
      if (action === 'create') {
        await createPost({ content: html, thread_id: threadId });
      } else if (action === 'edit') {
        await editPost(postId, html);
      } else {
        await createPost({
          content: html,
          thread_id: threadId,
          parent_ids: parentIds
        });
      }
    }
    this.props.navigation.goBack();
    onDone?.();
  };

  onDelete = async () => {
    if (!connection()) return;
    const { type, threadId, postId, onDone } = this.props.route.params;

    if (type === 'thread') {
      await deleteThread(threadId);
      this.props.navigation.goBack();
      this.props.navigation.goBack();
    } else {
      await deletePost(postId);
    }

    onDone?.();
  };

  render() {
    const { isDark, appColor, action, type, posts } = this.props.route.params;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.cancelBtn}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {action === 'create'
              ? `Create ${type}`
              : action === 'edit'
              ? `Edit ${type}`
              : action === 'reply'
              ? 'Reply'
              : 'MultiQuote'}
          </Text>
          <TouchableOpacity onPress={() => this.save()}>
            <Text style={styles.actionBtn}>
              {action === 'create'
                ? 'Create'
                : action === 'edit'
                ? 'Save'
                : 'Reply'}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ flex: 1, margin: 15 }}
          keyboardShouldPersistTaps='handled'
          contentInsetAdjustmentBehavior='never'
        >
          {action === 'reply' || action === 'multiQuote'
            ? posts?.map((post, index) => (
                <HTMLRenderer
                  key={index}
                  html={post}
                  customStyle={{ color: isDark ? '#FFFFFF' : '#00101D' }}
                />
              ))
            : null}
          {type === 'thread' && (
            <TextInput
              style={styles.titleInput}
              placeholderTextColor={isDark ? '#445F74' : '#00101D'}
              placeholder='Title'
              value={this.state.title}
              onChangeText={title => this.setState({ title })}
            />
          )}
          {!(type === 'thread' && action === 'edit') && (
            <>
              <RichToolbar
                style={styles.richBar}
                flatContainerStyle={styles.flatStyle}
                editor={this.richText}
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
                ref={this.richText}
                style={action !== 'edit' ? styles.richTextEditor : null}
                placeholder={'Write something'}
                initialContentHTML={action === 'edit' ? posts?.[0] : null}
                onChange={html => (this.richHTML = html)}
              />
            </>
          )}
        </ScrollView>
        {action === 'edit' && (
          <TouchableOpacity style={styles.deleteBtn} onPress={this.onDelete}>
            <Text style={styles.deleteBtnText}>
              DELETE {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        )}
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
      paddingVertical: 7
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
      fontFamily: 'OpenSans-Bold',
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#000000'
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
      borderColor: '#002039',
      borderWidth: 4
    },
    flatStyle: {
      paddingHorizontal: 12
    },
    editorStyle: {
      backgroundColor: '#002039',
      color: '#ffffff'
    },
    replyEditor: {
      marginBottom: 15,
      backgroundColor: '#002039'
    },
    deleteBtn: {
      backgroundColor: appColor,
      borderRadius: 25,
      minHeight: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20
    },
    deleteBtnText: {
      textAlign: 'center',
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: 15,
      color: '#FFFFFF'
    },
    titleInput: {
      marginBottom: 15,
      backgroundColor: '#002039',
      borderRadius: 5,
      color: '#FFFFFF'
    }
  });
