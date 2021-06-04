import React from 'react';
import { StyleSheet, Text } from 'react-native';
import iframe from '@native-html/iframe-plugin';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';

export default class HTMLRenderer extends React.Component {
  render() {
    const {
      html,
      tagsStyles,
      classesStyles,
      olItemStyle,
      ulItemStyle
    } = this.props;
    let quoteIndex = 0;
    return (
      <HTML
        ignoredStyles={['font-family']}
        renderers={{ iframe }}
        WebView={WebView}
        source={{
          html: `<div>${html.replace(
            /<blockquote/g,
            () =>
              ++quoteIndex &&
              `<blockquote class="blockquote-${
                quoteIndex % 2 ? 'odd' : 'even'
              }"`
          )}</div>`
        }}
        tagsStyles={tagsStyles}
        classesStyles={classesStyles}
        listsPrefixesRenderers={{
          ol: (_, __, ___, passProps) => (
            <Text style={olItemStyle}>
              {passProps.index + 1}.{`  `}
            </Text>
          ),
          ul: () => <Text style={ulItemStyle}>·{`  `}</Text>
        }}
        renderersProps={{
          iframe: { scalesPageToFit: true }
        }}
      />
    );
  }
}
