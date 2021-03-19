import React from 'react';
import { View, TouchableOpacity, Text, Image, Modal } from 'react-native';

import { Download_V2 } from 'RNDownload';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import AntIcon from 'react-native-vector-icons/AntDesign';

import {
  addToMyList,
  likeContent,
  removeFromMyList,
  unlikeContent
} from '../services/UserActions';
import contentService from '../services/content.service';

import { NetworkContext } from '../context/NetworkProvider';

export class RowCard extends React.Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props);
    this.state = {
      detailsModalVisible: false,
      calendarModalVisible: false
    };
  }

  addToCalendar = () => {
    this.setState({ calendarModalVisible: false });
    let { title, publishedOn } = this.props.item;
    AddCalendarEvent.presentEventCreatingDialog({
      endDate: new Date(publishedOn),
      startDate: new Date(publishedOn),
      title: title
    }).catch(e => {});
  };

  toggleMyList = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let { id, isAddedToList } = this.props.item;
    isAddedToList ? removeFromMyList(id) : addToMyList(id);
    this.props.onToggleMyList?.(id);
  };

  navigate = () => this.props.onNavigate?.(this.props.item);

  toggleDetails = () =>
    this.setState(({ detailsModalVisible }) => ({
      detailsModalVisible: !detailsModalVisible
    }));

  toggleAddToCalendar = () =>
    this.setState({ detailsModalVisible: false }, () =>
      this.setState(({ calendarModalVisible }) => ({
        calendarModalVisible: !calendarModalVisible
      }))
    );

  toggleLike = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let { id, isLiked } = this.props.item;
    isLiked ? unlikeContent(id) : likeContent(id);
    this.props.onToggleLike?.(id);
  };

  render() {
    let {
      state: { detailsModalVisible, calendarModalVisible },
      props: { item, compact }
    } = this;
    return (
      <>
        <TouchableOpacity
          disabled={new Date(item.publishedOn) > new Date()}
          onLongPress={this.toggleDetails}
          onPress={this.navigate}
          style={{
            flexDirection: compact ? 'column' : 'row',
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
              width: compact ? '100%' : '30%'
            }}
            resizeMode='cover'
            source={{ uri: item.thumbnail }}
          />
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ paddingHorizontal: compact ? 0 : 10, flex: 1 }}>
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
              style={{ padding: 10, paddingRight: compact ? 0 : 10 }}
              onPress={
                this[
                  new Date(item.publishedOn) > new Date()
                    ? 'toggleAddToCalendar'
                    : 'toggleMyList'
                ]
              }
            >
              <AntIcon
                style={{
                  textAlign: 'center',
                  width: onTablet ? 28 : 22,
                  height: onTablet ? 28 : 22
                }}
                size={onTablet ? 28 : 22}
                name={
                  new Date(item.publishedOn) > new Date()
                    ? 'calendar'
                    : item.isAddedToList
                    ? 'close'
                    : 'plus'
                }
                color={colors.pianoteRed}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={detailsModalVisible}
          onRequestClose={this.toggleModal}
          supportedOrientations={['portrait', 'landscape']}
          animationType='fade'
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.toggleDetails}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,.5)'
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 5,
                width: onTablet ? '50%' : '80%'
              }}
            >
              <Image
                style={{
                  aspectRatio: 16 / 9,
                  borderRadius: 10,
                  width: '100%'
                }}
                resizeMode='cover'
                source={{ uri: item.thumbnail }}
              />
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  paddingVertical: 5,
                  fontSize: onTablet ? 24 : 18,
                  textAlign: 'center'
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  textAlign: 'center',
                  fontSize: onTablet ? 16 : 12,
                  color: 'grey',
                  textTransform: 'capitalize'
                }}
              >
                {item.type} / {item.artist}
              </Text>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: onTablet ? 16 : 12,
                  textAlign: 'center'
                }}
              >
                {item.description}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  padding: 10
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: onTablet ? 24 : 18,
                    textAlign: 'center'
                  }}
                >
                  {item.lesson_count}
                  {`\n`}
                  <Text
                    style={{
                      fontSize: onTablet ? 16 : 12,
                      fontFamily: 'OpenSans-Regular'
                    }}
                  >
                    LESSONS
                  </Text>
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: onTablet ? 24 : 18,
                    textAlign: 'center'
                  }}
                >
                  {item.xp}
                  {`\n`}
                  <Text
                    style={{
                      fontSize: onTablet ? 16 : 12,
                      fontFamily: 'OpenSans-Regular'
                    }}
                  >
                    XP
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 10
                }}
              >
                <TouchableOpacity
                  style={{ alignItems: 'center', flex: 1 }}
                  onPress={this.toggleLike}
                >
                  <AntIcon
                    style={{
                      textAlign: 'center',
                      width: onTablet ? 28 : 22,
                      height: onTablet ? 28 : 22
                    }}
                    size={onTablet ? 28 : 22}
                    name={item.isLiked ? 'like1' : 'like2'}
                  />
                  <Text>{item.like_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignItems: 'center', flex: 1 }}
                  onPress={
                    this[
                      new Date(item.publishedOn) > new Date()
                        ? 'toggleAddToCalendar'
                        : 'toggleMyList'
                    ]
                  }
                >
                  <AntIcon
                    style={{
                      textAlign: 'center',
                      width: onTablet ? 28 : 22,
                      height: onTablet ? 28 : 22
                    }}
                    size={onTablet ? 28 : 22}
                    name={
                      new Date(item.publishedOn) > new Date()
                        ? 'calendar'
                        : item.isAddedToList
                        ? 'close'
                        : 'plus'
                    }
                  />
                  <Text>My List</Text>
                </TouchableOpacity>
                <Download_V2
                  entity={{
                    id: item.id,
                    content: contentService.getContent(item.id, true)
                  }}
                  styles={{
                    iconSize: {
                      width: onTablet ? 28 : 22,
                      height: onTablet ? 28 : 22
                    },
                    activityIndicatorColor: colors.pianoteRed,
                    animatedProgressBackground: colors.pianoteRed,
                    touchable: { flex: 1 },
                    textStatus: {
                      color: 'black',
                      fontFamily: 'OpenSans-Regular'
                    },
                    alert: {
                      alertTextMessageFontFamily: 'OpenSans-Regular',
                      alertTouchableTextDeleteColor: 'white',
                      alertTextTitleColor: 'black',
                      alertTextMessageColor: 'black',
                      alertTextTitleFontFamily: 'OpenSans-Bold',
                      alertTouchableTextCancelColor: colors.pianoteRed,
                      alertTouchableDeleteBackground: colors.pianoteRed,
                      alertBackground: 'white',
                      alertTouchableTextDeleteFontFamily: 'OpenSans-Bold',
                      alertTouchableTextCancelFontFamily: 'OpenSans-Bold'
                    }
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal
          transparent={true}
          visible={calendarModalVisible}
          onRequestClose={this.toggleModal}
          supportedOrientations={['portrait', 'landscape']}
          animationType='fade'
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.toggleAddToCalendar}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,.5)'
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 15,
                alignItems: 'center',
                padding: 10
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  textAlign: 'center',
                  fontSize: onTablet ? 24 : 18
                }}
              >
                Add To Calendar
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'OpenSans-Regular',
                  fontSize: onTablet ? 16 : 12,
                  padding: 10
                }}
              >
                Add this lesson to your calendar to{'\n'} be notified when it's
                available
              </Text>
              <AntIcon
                style={{
                  textAlign: 'center',
                  width: onTablet ? 70 : 50,
                  height: onTablet ? 70 : 50
                }}
                size={onTablet ? 70 : 50}
                name={'calendar'}
                color={colors.pianoteRed}
              />
              <TouchableOpacity
                onPress={this.addToCalendar}
                style={{
                  backgroundColor: colors.pianoteRed,
                  padding: 10,
                  borderRadius: 99
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: onTablet ? 16 : 12
                  }}
                >
                  CONFIRM ADDITION
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }
}
