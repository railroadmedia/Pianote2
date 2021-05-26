import React from 'react';
import { StyleSheet } from 'react-native';
import iframe from '@native-html/iframe-plugin';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';

export default class HTMLRenderer extends React.Component {
  render() {
    const { html, customStyle } = this.props;
    return (
      <HTML
        renderers={{ iframe }}
        WebView={WebView}
        source={{ html }}
        tagsStyles={{
          p: customStyle,
          blockquote: styles.blockquote
        }}
        renderersProps={{
          iframe: { scalesPageToFit: true }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  blockquote: {
    borderLeftWidth: 5,
    borderStyle: 'solid',
    borderLeftColor: '#dfe2e5',
    padding: 12,
    paddingBottom: 0,
    marginTop: 6,
    marginLeft: 6
  }
});
