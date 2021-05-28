import React from 'react';
import { Text, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import Icon from '../assets/icons';

const sortComments = [
  { title: 'Most Liked', option: 'Popular' },
  { title: 'My Comments', option: 'Mine' },
  { title: 'Newest First', option: 'Newest' },
  { title: 'Oldest First', option: 'Oldest' }
];
const sortVideos = [
  { title: 'Newest First', option: 'newest' },
  { title: 'Oldest First', option: 'oldest' }
];

export default class Sort extends React.Component {
  render = () => {
    return (
      <Modal
        visible={true}
        transparent={true}
        style={{ margin: 0, flex: 1 }}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={false}
        backdropColor={'white'}
        backdropOpacity={0.79}
        onBackButtonPress={this.props.hideSort}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,.5)'
          }}
          onPress={this.props.hideSort}
        >
          <SafeAreaView
            style={{
              width: '100%',
              backgroundColor: this.props.isMethod
                ? 'black'
                : colors.mainBackground
            }}
          >
            {(this.props.type === 'comments' ? sortComments : sortVideos).map(
              (sortOption, index) => (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    borderBottomColor: this.props.isMethod
                      ? colors.pianoteGrey
                      : '#445f73',
                    borderBottomWidth: 0.5,
                    alignItems: 'center',
                    backgroundColor: this.props.isMethod
                      ? 'black'
                      : colors.mainBackground
                  }}
                  onPress={() => {
                    this.props.hideSort();
                    this.props.changeSort(sortOption.option);
                  }}
                >
                  <Icon.Entypo
                    name={'check'}
                    size={onTablet ? 24 : 18}
                    color={
                      this.props.currentSort === sortOption.option
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
                        this.props.currentSort === sortOption.option
                          ? 'white'
                          : this.props.isMethod
                          ? colors.pianoteGrey
                          : colors.secondBackground
                    }}
                  >
                    {sortOption.title}
                  </Text>
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity
              onPress={() => this.props.hideSort()}
              style={{
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: this.props.isMethod
                  ? 'black'
                  : colors.mainBackground
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
        </TouchableOpacity>
      </Modal>
    );
  };
}
