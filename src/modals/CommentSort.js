import React from 'react';
import { Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from '../assets/icons';

const sortOptions = [
  { title: 'Most Liked', option: 'Popular' },
  { title: 'My Comments', option: 'Mine' },
  { title: 'Newest First', option: 'Newest' },
  { title: 'Oldest First', option: 'Oldest' }
];

export default class CommentSort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSort: this.props.currentSort // Mine | Popular | Newest | Oldest
    };
  }

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.props.hideCommentSort()}
        />

        <SafeAreaView
          style={{
            width: '100%',
            backgroundColor: '#00101d'
          }}
        >
          {sortOptions.map((sortOption, index) => (
            <TouchableOpacity
              style={{
                padding: 10,
                flexDirection: 'row',
                borderBottomColor: '#445f73',
                borderBottomWidth: 0.5,
                alignItems: 'center'
              }}
              onPress={() => {
                this.props.hideCommentSort();
                this.props.changeSort(sortOption.option);
              }}
            >
              <Icon.Entypo
                name={'check'}
                size={onTablet ? 24 : 18}
                color={
                  this.state.currentSort == sortOption.option
                    ? 'white'
                    : colors.mainBackground
                }
              />
              <Text
                style={{
                  padding: 10,
                  fontSize: onTablet ? 16 : 12,
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
            onPress={() => this.props.hideCommentSort()}
            style={{
              padding: 5,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Icon.Entypo
              name={'cross'}
              size={onTablet ? 30 : 25}
              color={'white'}
            />
            <Text
              style={{
                padding: 10,
                fontSize: onTablet ? 16 : 12,
                fontFamily: 'OpenSans-Regular',
                color: 'white'
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    );
  };
}
