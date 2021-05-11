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

import { Contexts } from '../context/CombinedContexts';

import { toggleMyList, toggleLike } from '../redux/CardsActions';

class Card extends React.Component {
  static contextType = Contexts;

  constructor(props) {
    super(props);
    this.state = {
      detailsModalVisible: false,
      calendarModalVisible: false
    };
  }

  addToCalendar = () => {
    this.setState({ calendarModalVisible: false });
    let { title, published_on } = this.props.data;
    AddCalendarEvent.presentEventCreatingDialog({
      endDate: new Date(published_on),
      startDate: new Date(published_on),
      title: title
    }).catch(e => {});
  };

  toggleMyList = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let { id, is_added_to_primary_playlist } = this.props.data;
    is_added_to_primary_playlist ? removeFromMyList(id) : addToMyList(id);
    this.props.toggleMyList?.();
  };

  navigate = () => this.props.onNavigate?.();

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
    let { id, isLiked } = this.props.data;
    isLiked ? unlikeContent(id) : likeContent(id);
    this.props.toggleLike?.();
  };

  get imageUrl() {
    let { thumbnail_url, published_on } = this.props.data;
    if (
      thumbnail_url?.includes('var/mobile') ||
      thumbnail_url?.includes('data/user')
    )
      return thumbnail_url;
    if (thumbnail_url?.includes('http')) {
      return `https://cdn.musora.com/image/fetch/w_350,ar_${
        this.props.type === 'squareRow' ? '1' : '16:9'
      },fl_lossy,q_auto:eco,c_fill,g_face${
        new Date(published_on) > new Date() ? ',e_grayscale' : ''
      }/${thumbnail_url}`;
    }
    return 'https://dmmior4id2ysr.cloudfront.net/assets/images/pianote_fallback_thumb.jpg';
  }

  render() {
    let {
      props: { data, type },
      state: { detailsModalVisible, calendarModalVisible }
    } = this;
    return (
      <>
        <TouchableOpacity
          disabled={new Date(data.published_on) > new Date()}
          onLongPress={this.toggleDetails}
          onPress={this.navigate}
          style={{
            flexDirection: type.match(/^(row|squareRow)$/) ? 'row' : 'column',
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
              width: type.match(/^(row|squareRow)$/) ? '30%' : '100%'
            }}
            resizeMode='cover'
            source={{ uri: this.imageUrl }}
          />
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View
              style={{
                paddingHorizontal: type.match(/^(row|squareRow)$/) ? 10 : 0,
                flex: 1
              }}
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
                {data.title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  textTransform: 'capitalize',
                  fontFamily: 'OpenSans-Regular',
                  color: colors.secondBackground,
                  fontSize: onTablet ? 18 : 14
                }}
              >
                {data.type}
                {data.artist?.replace(/(.{0})/, '$1 / ')}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                padding: 10,
                paddingRight: type.match(/^(row|squareRow)$/) ? 10 : 0
              }}
              onPress={
                this[
                  new Date(data.published_on) > new Date()
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
                  new Date(data.published_on) > new Date()
                    ? 'calendar'
                    : data.is_added_to_primary_playlist
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
                source={{ uri: this.imageUrl }}
              />
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  paddingVertical: 5,
                  fontSize: onTablet ? 24 : 18,
                  textAlign: 'center'
                }}
              >
                {data.title}
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
                {data.type}
                {data.artist?.replace(/(.{0})/, '$1 / ')}
              </Text>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: onTablet ? 16 : 12,
                  textAlign: 'center'
                }}
              >
                {data.description}
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
                  {data.lesson_count}
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
                  {data.xp}
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
                    name={data.isLiked ? 'like1' : 'like2'}
                  />
                  <Text>{data.like_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignItems: 'center', flex: 1 }}
                  onPress={
                    this[
                      new Date(data.published_on) > new Date()
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
                      new Date(data.published_on) > new Date()
                        ? 'calendar'
                        : data.is_added_to_primary_playlist
                        ? 'close'
                        : 'plus'
                    }
                  />
                  <Text>My List</Text>
                </TouchableOpacity>
                <Download_V2
                  entity={{
                    id: data.id,
                    content: contentService.getContent
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
  return { data: { ...props.data, ...cards?.[props.id] } };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleMyList, toggleLike }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Card);
