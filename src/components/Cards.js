import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import { addToMyList, removeFromMyList } from '../services/UserActions';

export class RowCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddedToList: props.item.isAddedToList
    };
  }

  addToCalendar = () => {};

  toggleMyList = () =>
    this.setState(
      ({ isAddedToList }) => ({ isAddedToList: !isAddedToList }),
      () =>
        this.state.isAddedToList
          ? addToMyList(this.props.item.id)
          : removeFromMyList(this.props.item.id)
    );

  render() {
    let {
      state: { isAddedToList },
      props: { item }
    } = this;
    return (
      <View style={{ width: onTablet ? '33%' : '100%' }}>
        <TouchableOpacity
          style={{
            flexDirection: onTablet ? 'column' : 'row',
            padding: 10,
            paddingBottom: 0,
            paddingRight: 0,
            alignItems: 'center'
          }}
        >
          <Image
            style={{
              aspectRatio: 16 / 9,
              borderRadius: 7.5,
              width: onTablet ? '100%' : '30%'
            }}
            resizeMode='cover'
            source={{ uri: item.thumbnail }}
          />
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ paddingHorizontal: onTablet ? 0 : 10, flex: 1 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode='tail'
                style={{
                  fontSize: onTablet ? 16 : 14,
                  fontFamily: 'OpenSans-Bold',
                  color: 'white',
                  flexDirection: 'column'
                }}
              >
                {item.title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  color: colors.secondBackground,
                  fontSize: onTablet ? 18 : 14
                }}
              >
                {`Course / ${item.artist}`}
              </Text>
            </View>
            <TouchableOpacity
              style={{ padding: 10, paddingRight: onTablet ? 0 : 10 }}
              onPress={
                this[
                  new Date(item.publishedOn) > new Date()
                    ? 'addToCalendar'
                    : 'toggleMyList'
                ]
              }
            >
              <Icon
                style={{
                  width: onTablet ? 28 : 22,
                  height: onTablet ? 28 : 22
                }}
                size={onTablet ? 28 : 22}
                name={
                  new Date(item.publishedOn) > new Date()
                    ? 'calendar-plus'
                    : isAddedToList
                    ? 'times'
                    : 'plus'
                }
                color={colors.pianoteRed}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
