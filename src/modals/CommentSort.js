/**
 * CommentSort
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { withNavigation } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const sortOptions = [
  { title: 'Most Liked', option: 'Popular' },
  { title: 'My Comments', option: 'Mine' },
  { title: 'Newest First', option: 'Newest' },
  { title: 'Oldest First', option: 'Oldest' }
];
class CommentSort extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      currentSort: this.props.currentSort // Mine | Popular | Newest | Oldest
    };
  }

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.container}
            onPress={() => this.props.hideCommentSort()}
          />
        </View>
        <View style={localStyles.commentContainer}>
          {sortOptions.map((sortOption, index) => (
            <TouchableOpacity
              key={index}
              style={localStyles.sortCommentContainer}
              onPress={() => {
                this.props.hideCommentSort();
                this.props.changeSort(sortOption.option);
              }}
            >
              <EntypoIcon
                name={'check'}
                size={20 * factorRatio}
                color={
                  this.state.currentSort == sortOption.option
                    ? 'white'
                    : colors.mainBackground
                }
              />
              <Text
                style={[
                  localStyles.sortText,
                  {
                    color:
                      this.state.currentSort == sortOption.option
                        ? 'white'
                        : colors.secondBackground
                  }
                ]}
              >
                {sortOption.title}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={localStyles.cancelContainer}
            onPress={() => this.props.hideCommentSort()}
          >
            <EntypoIcon
              name={'cross'}
              size={25 * factorRatio}
              color={'white'}
            />
            <Text style={localStyles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  commentContainer: {
    width: '100%',
    backgroundColor: '#00101d'
  },
  sortCommentContainer: {
    paddingLeft: 15,
    flexDirection: 'row',
    borderBottomColor: '#445f73',
    borderBottomWidth:
      (0.25 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    alignItems: 'center'
  },
  sortText: {
    padding: 15,
    fontSize:
      (16 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontFamily: 'OpenSans-Regular'
  },
  cancelContainer: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cancel: {
    fontSize:
      (16 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontFamily: 'OpenSans-Regular',
    color: 'white',
    padding: 15
  }
});

export default withNavigation(CommentSort);
