import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    console.log(html);
  };

  render() {
    const { isDark, appColor } = this.props.route.params;

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ margin: 10 }}>
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
            style={styles.richTextEditor}
            placeholder={'Write something'}
            // initialContentHTML={initHTML}
            onChange={html => (this.richHTML = html)}
          />
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
    }
  });
