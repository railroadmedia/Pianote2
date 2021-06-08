import React from 'react';
import { Text, View } from 'react-native';
import iframe from '@native-html/iframe-plugin';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import { expandQuote } from '../assets/svgs';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class HTMLRenderer extends React.Component {
  state = { expanderVisible: false, maxQuoteHeight: undefined };

  render() {
    const {
      html,
      tagsStyles,
      classesStyles,
      olItemStyle,
      ulItemStyle,
      appColor
    } = this.props;
    let { expanderVisible, maxQuoteHeight } = this.state;
    return (
      <HTML
        key={`${expanderVisible}${maxQuoteHeight}`}
        ignoredStyles={['font-family']}
        WebView={WebView}
        source={{
          html: `<div>${evenOddQuoteClassification(
            html
              .replace(
                '<blockquote',
                '<shadow><blockquote class="blockquote-first"'
              )
              .replace(
                /(.*)<\/blockquote>(.*)$/,
                '$1</blockquote></shadow><expander></expander>$2'
              )
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
          iframe: {
            scalesPageToFit: true,
            webViewProps: {
              // containerStyle: { width: 300 }
            }
          }
        }}
        renderers={{
          shadow: (_, children, __, { key }) => (
            <View style={classesStyles.shadow} key={key}>
              {children}
            </View>
          ),
          blockquote: (htmlAttribs, children, _, { key }) => {
            let { class: className } = htmlAttribs;
            return className?.includes('blockquote') ? (
              <View
                key={key}
                onLayout={({
                  nativeEvent: {
                    layout: { height }
                  }
                }) => {
                  if (
                    className.includes('first') &&
                    height > 150 &&
                    !expanderVisible
                  )
                    this.setState({
                      expanderVisible: true,
                      maxQuoteHeight: 150
                    });
                }}
                style={[
                  {
                    padding: 10,
                    borderRadius: 5,
                    maxHeight: maxQuoteHeight,
                    overflow: 'hidden'
                  },
                  classesStyles[
                    className.includes('odd')
                      ? 'blockquote-odd'
                      : 'blockquote-even'
                  ]
                ]}
              >
                {children}
              </View>
            ) : (
              children
            );
          },
          expander: () =>
            expanderVisible ? (
              <TouchableOpacity
                onPress={() =>
                  this.setState(({ maxQuoteHeight }) => ({
                    maxQuoteHeight: maxQuoteHeight === 150 ? undefined : 150
                  }))
                }
                containerStyle={{
                  padding: 20,
                  paddingTop: 10,
                  alignSelf: 'flex-end',
                  paddingRight: maxQuoteHeight === 150 ? 0 : 20,
                  paddingLeft: maxQuoteHeight === 150 ? 20 : 0,
                  transform: [
                    {
                      rotate: `${maxQuoteHeight === 150 ? 0 : 180}deg`
                    }
                  ]
                }}
              >
                {expandQuote({ height: 15, width: 15, fill: appColor })}
              </TouchableOpacity>
            ) : null,
          iframe
        }}
      />
    );
  }
}

const evenOddQuoteClassification = html => {
  let i = 1;
  return html
    .split('<blockquote')
    .map(blockquote => {
      if (blockquote.includes('blockquote') && !blockquote.includes('class'))
        blockquote += ' class=""';
      blockquote = blockquote.replace(
        'class="',
        `class="${++i % 2 ? 'odd ' : 'even '}`
      );
      for (
        let j = 0;
        j < (blockquote.match(/<\/blockquote/g) || []).length;
        j++
      ) {
        i--;
      }
      return blockquote;
    })
    .join('<blockquote');
};
