import React from 'react';
import { View, TouchableOpacity, Text, Image, Modal } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

import { toggleMyList, toggleLike } from '../redux/CardsActions';

class RowCard extends React.Component {
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
    let { title, publishedOn } = this.props;
    AddCalendarEvent.presentEventCreatingDialog({
      endDate: new Date(publishedOn),
      startDate: new Date(publishedOn),
      title: title
    }).catch(e => {});
  };

  toggleMyList = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let { id, isAddedToList } = this.props;
    isAddedToList ? removeFromMyList(id) : addToMyList(id);
    this.props.toggleMyList(this.props);
  };

  navigate = () => this.props.onNavigate?.(this.props);

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
    let { id, isLiked } = this.props;
    isLiked ? unlikeContent(id) : likeContent(id);
    this.props.toggleLike(this.props);
  };

  render() {
    let {
      props,
      state: { detailsModalVisible, calendarModalVisible }
    } = this;
    return (
      <>
        <TouchableOpacity
          disabled={new Date(props.publishedOn) > new Date()}
          onLongPress={this.toggleDetails}
          onPress={this.navigate}
          style={{
            flexDirection: props.compact ? 'column' : 'row',
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
              width: props.compact ? '100%' : '30%'
            }}
            resizeMode='cover'
            source={{ uri: props.thumbnail }}
          />
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View
              style={{ paddingHorizontal: props.compact ? 0 : 10, flex: 1 }}
            >
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
                {props.title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  color: colors.secondBackground,
                  fontSize: onTablet ? 18 : 14
                }}
              >
                {`Course / ${props.artist}`}
              </Text>
            </View>
            <TouchableOpacity
              style={{ padding: 10, paddingRight: props.compact ? 0 : 10 }}
              onPress={
                this[
                  new Date(props.publishedOn) > new Date()
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
                  new Date(props.publishedOn) > new Date()
                    ? 'calendar'
                    : props.isAddedToList
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
                source={{ uri: props.thumbnail }}
              />
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  paddingVertical: 5,
                  fontSize: onTablet ? 24 : 18,
                  textAlign: 'center'
                }}
              >
                {props.title}
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
                {props.type} / {props.artist}
              </Text>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: onTablet ? 16 : 12,
                  textAlign: 'center'
                }}
              >
                {props.description}
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
                  {props.lesson_count}
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
                  {props.xp}
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
                    name={props.isLiked ? 'like1' : 'like2'}
                  />
                  <Text>{props.like_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignItems: 'center', flex: 1 }}
                  onPress={
                    this[
                      new Date(props.publishedOn) > new Date()
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
                      new Date(props.publishedOn) > new Date()
                        ? 'calendar'
                        : props.isAddedToList
                        ? 'close'
                        : 'plus'
                    }
                  />
                  <Text>My List</Text>
                </TouchableOpacity>
                <Download_V2
                  entity={{
                    id: props.id,
                    content: contentService.getContent(props.id, true)
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

const mapStateToProps = ({ cards }, props) => {
  return { ...props, ...cards?.[props.id] };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleMyList, toggleLike }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RowCard);
