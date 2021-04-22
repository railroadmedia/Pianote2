import React from 'react';
import { View, Image, TextInput, StyleSheet, Dimensions } from 'react-native';

const fallbackProfilePicUri =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png';
const windowWidth = Dimensions.get('window').width;
const maxFontMultiplier =
  windowWidth < 375 ? 1 : windowWidth < 1024 ? 1.35 : 1.8;
let styles;
export default class CommentInput extends React.PureComponent {
  state = {
    commentText: ''
  };

  constructor(props) {
    super(props);
    let { isDark } = props;

    styles = setStyles(isDark);
  }

  render() {
    const { avatarUrl, isDark, onSubmit } = this.props;
    return (
      <View style={styles.container}>
        <Image
          style={styles.userImage}
          source={{ uri: avatarUrl || fallbackProfilePicUri }}
        />
        <TextInput
          maxFontSizeMultiplier={maxFontMultiplier}
          autoCapitalize={'sentences'}
          autoCorrect={false}
          spellCheck={true}
          returnKeyType={'go'}
          style={styles.textInput}
          ref={r => (this.input = r)}
          placeholder='Add reply...'
          placeholderTextColor={isDark ? '#FFFFFF' : '#00101D'}
          value={this.state.commentText}
          onChangeText={commentText => this.setState({ commentText })}
          onSubmitEditing={() => {
            onSubmit(this.state.commentText);
            this.setState({ commentText: '' });
          }}
        />
      </View>
    );
  }
}

const setStyles = isDark =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#00101D' : '#F7F9FC',
      flexDirection: 'row',
      padding: 10
    },
    userImage: {
      backgroundColor: 'transparent',
      height: 38,
      aspectRatio: 1,
      borderRadius: 18,
      alignSelf: 'center',
      marginHorizontal: 10
    },
    textInput: {
      color: isDark ? '#FFFFFF' : '#00101D',
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      fontSize: 12,
      fontFamily: 'OpenSans',
      flex: 1,
      maxHeight: 300,
      padding: 10
    }
  });
