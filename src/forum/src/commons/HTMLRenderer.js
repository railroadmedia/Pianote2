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
    let quoteIndex = 0;
    return (
      <HTML
        key={`${expanderVisible}${maxQuoteHeight}`}
        ignoredStyles={['font-family']}
        renderers={{ iframe }}
        WebView={WebView}
        source={{
          html: `<div>${html
            .replace(
              /<blockquote/g,
              () =>
                `${!quoteIndex ? '<shadow>' : ''}<blockquote class="${
                  !quoteIndex ? 'blockquote-first' : ''
                } blockquote-${++quoteIndex % 2 ? 'odd' : 'even'}"`
            )
            .replace(
              /(.*)<\/blockquote>(.*)$/,
              '$1</blockquote></shadow><expander></expander>$2'
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
        renderersProps={{ iframe: { scalesPageToFit: true } }}
        renderers={{
          shadow: (_, children) => (
            <View style={classesStyles.shadow}>{children}</View>
          ),
          blockquote: (htmlAttribs, children) => {
            let { class: className } = htmlAttribs;
            if (className?.includes('blockquote'))
              return (
                <View
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
                  padding: 10,
                  position: 'absolute',
                  alignSelf: 'flex-end',
                  top: 0,
                  right: 0
                }}
              >
                {expandQuote({ height: 15, width: 15, fill: appColor })}
              </TouchableOpacity>
            ) : null
        }}
      />
    );
  }
}
