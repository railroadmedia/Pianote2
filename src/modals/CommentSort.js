/**
 * CommentSort
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
        <View style={{ flex: 1, alignSelf: 'stretch' }}>
          <TouchableOpacity
            onPress={() => this.props.hideCommentSort()}
            style={{
              height: '100%',
              width: '100%',
              alignSelf: 'stretch'
            }}
          ></TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            backgroundColor: colors.mainBackground
          }}
        >
          {sortOptions.map((sortOption, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                this.props.hideCommentSort();
                this.props.changeSort(sortOption.option);
              }}
              style={{
                paddingLeft: 15,
                flexDirection: 'row',
                borderBottomColor: colors.secondBackground,
                borderBottomWidth: 0.25 * factorRatio,
                alignItems: 'center'
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
                style={{
                  padding: 15,
                  fontSize: 16 * factorRatio,
                  fontFamily: 'OpenSans-Regular',
                  color:
                    this.state.currentSort == sortOption.option
                      ? 'white'
                      : colors.secondBackground
                }}
              >
                {sortOption.title}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            key={'cancel'}
            onPress={() => {
              this.props.hideCommentSort();
            }}
            style={{
              paddingLeft: 15,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <EntypoIcon
              name={'cross'}
              size={25 * factorRatio}
              color={'white'}
            />

            <Text
              style={{
                fontSize: 16 * factorRatio,
                fontFamily: 'OpenSans-Regular',
                color: 'white',
                padding: 15
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}

export default withNavigation(CommentSort);
