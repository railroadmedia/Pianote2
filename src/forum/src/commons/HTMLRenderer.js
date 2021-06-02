import React from 'react';
import { StyleSheet, Text } from 'react-native';
import iframe from '@native-html/iframe-plugin';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';

export default class HTMLRenderer extends React.Component {
  render() {
    const { html, customStyle } = this.props;
    return (
      <HTML
        ignoredStyles={['font-family']}
        renderers={{ iframe }}
        WebView={WebView}
        source={{ html: `<div>${html}</div>` }}
        tagsStyles={{
          div: customStyle,
          blockquote: styles.blockquote
        }}
        listsPrefixesRenderers={{
          ol: (_, __, ___, passProps) => (
            <Text style={customStyle}>
              {passProps.index + 1}.{`  `}
            </Text>
          ),
          ul: (_, __, ___, ____) => (
            <Text style={{ fontWeight: '900', ...customStyle }}>·{`  `}</Text>
          )
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
