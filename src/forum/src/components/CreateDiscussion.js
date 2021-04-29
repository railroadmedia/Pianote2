import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import ExpandableView from '../commons/ExpandableView';
import MediaPicker from '../commons/MediaPicker';
import forumService from '../services/forum.service';

export default class CreateDiscussion extends React.Component {
  state = {
    title: '',
    category: 'Choose a category',
    description: '',
    showMediaPicker: false,
    selectedMediaType: ''
  };
  constructor(props) {
    super(props);
    let { isDark, appColor } = props.route.params;
    CreateDiscussion.contextType = forumService.NetworkContext;

    styles = setStyles(isDark, appColor);
  }

  componentDidUpdate(prev) {}

  render() {
    const { isDark, appColor } = this.props.route.params;
    let { title, category, description, selectedMediaType } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
          <TextInput
            autoCapitalize={'sentences'}
            autoCorrect={false}
            spellCheck={true}
            style={styles.textInput}
            placeholder='Title'
            placeholderTextColor={isDark ? '#FFFFFF' : '#00101D'}
            value={title}
            onChangeText={title => this.setState({ title })}
          />
          <ExpandableView
            iconColor={isDark ? '#FFFFFF' : '#00101D'}
            ref={r => (this.expSkill = r)}
            title={category}
            titleStyle={styles.titleStyle}
            dropStyle={styles.dropStyle}
          >
            <View style={styles.childrenContainer}>
              {['General', 'Question'].map((l, i) => (
                <TouchableOpacity
                  key={l}
                  style={styles.dropItem}
                  onPress={() => {
                    this.expSkill.toggleView();
                    this.setState({ category: l });
                  }}
                >
                  <Text style={styles.dropItemText}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ExpandableView>
          {selectedMediaType === '' ? (
            <TouchableOpacity
              style={[
                styles.textInput,
                { minHeight: 200, textAlignVertical: 'top', paddingTop: 15 }
              ]}
              onPress={() => this.setState({ showMediaPicker: true })}
            >
              <Text style={{ color: '#FFFFFF', fontFamily: 'OpenSans' }}>
                Description
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              multiline={true}
              autoCapitalize={'sentences'}
              autoCorrect={false}
              spellCheck={true}
              onLayout={e => this.descriptionInput.focus()}
              autoFocus={true}
              style={[
                styles.textInput,
                { minHeight: 200, textAlignVertical: 'top', paddingTop: 15 }
              ]}
              ref={r => {
                this.descriptionInput = r;
              }}
              placeholder='Description'
              placeholderTextColor={isDark ? '#FFFFFF' : '#00101D'}
              value={description}
              onChangeText={description => this.setState({ description })}
            />
          )}
          <TouchableOpacity
            style={[
              styles.btn,
              description === '' ||
              title === '' ||
              category === 'Choose a category'
                ? { backgroundColor: '#404951' }
                : { backgroundColor: appColor }
            ]}
            disabled={
              description === '' ||
              title === '' ||
              category === 'Choose a category'
            }
          >
            <Text
              style={[
                styles.btnText,
                description === '' ||
                title === '' ||
                category === 'Choose a category'
                  ? { color: '#1C262F' }
                  : { color: '#FFFFFF' }
              ]}
            >
              CREATE A DISCUSSION
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {this.state.showMediaPicker && (
          <MediaPicker
            isDark={isDark}
            onClose={() => this.setState({ showMediaPicker: false })}
            selectMediaType={selectedMediaType =>
              this.setState({ selectedMediaType, showMediaPicker: false }, () =>
                setTimeout(() => {
                  this.descriptionInput.focus();
                }, 100)
              )
            }
          />
        )}
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
    textInput: {
      color: isDark ? '#FFFFFF' : '#00101D',
      backgroundColor: 'rgba(0, 32, 57, 0.75)',
      fontSize: 12,
      fontFamily: 'OpenSans',
      padding: 10,
      paddingLeft: 15,
      margin: 15,
      borderRadius: 20
    },
    dropStyle: {
      borderRadius: 50,
      backgroundColor: 'rgba(0, 32, 57, 0.75)',
      margin: 15
    },
    dropItem: {
      padding: 10,
      fontSize: 12,
      fontFamily: 'OpenSans'
    },
    dropItemText: {
      textAlign: 'center',
      alignSelf: 'center',
      color: isDark ? '#FFFFFF' : '#00101D'
    },
    titleStyle: {
      color: isDark ? '#FFFFFF' : '#00101D',
      fontSize: 12,
      fontFamily: 'OpenSans'
    },
    childrenContainer: {
      borderRadius: 20,
      marginHorizontal: 15,
      backgroundColor: 'rgba(0, 32, 57, 0.75)'
    },
    btn: {
      alignSelf: 'center',
      paddingVertical: 5,
      paddingHorizontal: 30,
      backgroundColor: appColor,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 15
    },
    btnText: {
      textAlign: 'center',
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: 15,
      color: '#FFFFFF',
      paddingHorizontal: 15,
      paddingVertical: 5
    }
  });
