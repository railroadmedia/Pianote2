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

export default class CRUD extends React.Component {
  richText = React.createRef();
  state = {};

  constructor(props) {
    super(props);
    let { isDark, appColor } = props.route.params;

    styles = setStyles(isDark, appColor);
  }

  handleChange(html) {
    this.richHTML = html;
  }

  onInsertLink = type => {
    this.linkModal?.toggle(type);
  };

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
    let html = await this.richText.current?.getContentHtml();
    this.props.route.params.onAction(this.title, html);
    this.props.navigation.goBack();
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
        <ScrollView style={{ flex: 1, margin: 15 }}>
          {action === 'reply' || action === 'multiQuote'
            ? posts.map((post, index) => (
                <RichEditor
                  key={index}
                  disabled={true}
                  editorStyle={styles.editorStyle}
                  style={styles.replyEditor}
                  initialContentHTML={post}
                />
              ))
            : null}
          {type === 'thread' && (
            <TextInput
              style={styles.titleInput}
              placeholderTextColor={isDark ? '#445F74' : '#00101D'}
              placeholder='Title'
              onChangeText={text => {
                this.title = text;
              }}
            />
          )}
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
            initialContentHTML={action === 'edit' ? posts[0] : null}
            onChange={html => (this.richHTML = html)}
          />
        </ScrollView>
        {action === 'edit' && (
          <TouchableOpacity style={styles.deleteBtn}>
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
