import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  StyleSheet
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Download_V2 } from 'RNDownload';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

import {
  addToMyList,
  likeContent,
  removeFromMyList,
  unlikeContent,
  getDownloadableContent
} from './services/cards.service';
import commonService from './services/common.service';

import { toggleMyList, toggleLike } from './redux/CardsActions';

import { like, likeOn, addToCalendar, x, plus } from './img/svgs';

class Card extends React.Component {
  constructor(props) {
    super(props);
    Card.contextType = commonService.Contexts;
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
    this.props.toggleMyList?.(this.props.data);
  };

  navigate = () => this.props.onNavigate?.(this.props.data);

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
    let { id, is_liked_by_current_user } = this.props.data;
    is_liked_by_current_user ? unlikeContent(id) : likeContent(id);
    this.props.toggleLike?.(this.props.data);
  };

  get imageUrl() {
    let { thumbnail_url, thumbnailUrl, published_on } = this.props.data;
    if (!thumbnail_url) thumbnail_url = thumbnailUrl;
    if (
      thumbnail_url?.includes('var/mobile') ||
      thumbnail_url?.includes('data/user')
    )
      return thumbnail_url;
    if (thumbnail_url?.includes('http')) {
      return `https://cdn.musora.com/image/fetch/w_350,ar_${
        this.props.mode.match(/^(squareCompact|squareRow|show)$/) ? '1' : '16:9'
      },fl_lossy,q_auto:eco,c_fill,g_face${
        new Date(published_on) > new Date() ? ',e_grayscale' : ''
      }/${thumbnail_url}`;
    }
    return 'https://dmmior4id2ysr.cloudfront.net/assets/images/pianote_fallback_thumb.jpg';
  }

  render() {
    let {
      props: { data, mode },
      state: { detailsModalVisible, calendarModalVisible }
    } = this;
    return (
      <>
        <TouchableOpacity
          disabled={new Date(data.published_on) > new Date()}
          onLongPress={this.toggleDetails}
          onPress={this.navigate}
          style={{
            flexDirection: mode.match(/^(row|squareRow)$/) ? 'row' : 'column',
            padding: 10,
            paddingBottom: 0,
            paddingRight: 0,
            alignItems: 'center'
          }}
        >
          <Image
            style={{
              aspectRatio: mode.match(/^(squareRow|squareCompact|show)$/)
                ? 1
                : 16 / 9,
              borderRadius: 7.5,
              width: mode.match(/^(row|squareRow)$/) ? '30%' : '100%'
            }}
            resizeMode='cover'
            source={{ uri: this.imageUrl }}
          />
          {mode !== 'show' && (
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View
                style={{
                  paddingHorizontal: mode.match(/^(row|squareRow)$/) ? 10 : 0,
                  flex: 1
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={styles.title}
                >
                  {data.title}
                </Text>
                <Text numberOfLines={1} style={styles.subTitle}>
                  {data.type}
                  {data.artist?.replace(/(.{0})/, '$1 / ')}
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  padding: 10,
                  paddingRight: mode.match(/^(row|squareRow)$/) ? 10 : 0
                }}
                onPress={
                  this[
                    new Date(data.published_on) > new Date()
                      ? 'toggleAddToCalendar'
                      : 'toggleMyList'
                  ]
                }
              >
                {(new Date(data.published_on) > new Date()
                  ? addToCalendar
                  : data.is_added_to_primary_playlist
                  ? x
                  : plus)({
                  height: 25,
                  width: 25,
                  fill: '#fb1b2f'
                })}
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
        {mode !== 'show' && (
          <>
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
                style={styles.modal}
              >
                <View style={styles.detailsModalContainer}>
                  <Image
                    style={{
                      aspectRatio: mode.match(
                        /^(squareRow|squareCompact|show)$/
                      )
                        ? 1
                        : 16 / 9,
                      borderRadius: 10,
                      width: '100%'
                    }}
                    resizeMode='cover'
                    source={{ uri: this.imageUrl }}
                  />
                  <Text style={styles.modalTitle}>{data.title}</Text>
                  <Text style={styles.modalSubTitle}>
                    {data.type}
                    {data.artist?.replace(/(.{0})/, '$1 / ')}
                  </Text>
                  <Text style={styles.modalDescription}>
                    {data.description}
                  </Text>
                  <View style={styles.modalDetailsContainer}>
                    <Text style={styles.lessonCount}>
                      {data.lesson_count}
                      {`\n`}
                      <Text
                        style={{ fontSize: 14, fontFamily: 'OpenSans-Regular' }}
                      >
                        LESSONS
                      </Text>
                    </Text>
                    <Text style={styles.xp}>
                      {data.xp}
                      {`\n`}
                      <Text
                        style={{ fontSize: 14, fontFamily: 'OpenSans-Regular' }}
                      >
                        XP
                      </Text>
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', padding: 10 }}>
                    <TouchableOpacity
                      style={{ alignItems: 'center', flex: 1 }}
                      onPress={this.toggleLike}
                    >
                      {(data.is_liked_by_current_user ? likeOn : like)({
                        height: 25,
                        width: 25,
                        fill: 'black'
                      })}
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
                      {(new Date(data.published_on) > new Date()
                        ? addToCalendar
                        : data.is_added_to_primary_playlist
                        ? x
                        : plus)({
                        height: 25,
                        width: 25,
                        fill: 'black'
                      })}
                      <Text>My List</Text>
                    </TouchableOpacity>
                    <Download_V2
                      entity={{
                        id: data.id,
                        content: getDownloadableContent
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
                style={styles.modal}
              >
                <View style={styles.calendarModalContainer}>
                  <Text style={styles.calendarModalTitle}>Add To Calendar</Text>
                  <Text style={styles.calendarModalMsg}>
                    Add this lesson to your calendar to{'\n'} be notified when
                    it's available
                  </Text>
                  {addToCalendar({
                    height: 25,
                    width: 25,
                    fill: '#fb1b2f'
                  })}
                  <TouchableOpacity
                    onPress={this.addToCalendar}
                    style={styles.calendarModalBtn}
                  >
                    <Text style={styles.calendarModalBtnText}>
                      CONFIRM ADDITION
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        )}
      </>
    );
  }
}
let styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
    color: 'white',
    flexDirection: 'column'
  },
  subTitle: {
    textTransform: 'capitalize',
    fontFamily: 'OpenSans-Regular',
    color: '#445f73',
    fontSize: 16
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  detailsModalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    width: '80%',
    maxWidth: 400
  },
  modalTitle: {
    fontFamily: 'OpenSans-Bold',
    paddingVertical: 5,
    fontSize: 20,
    textAlign: 'center'
  },
  modalSubTitle: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    fontSize: 14,
    color: 'grey',
    textTransform: 'capitalize'
  },
  modalDescription: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    textAlign: 'center'
  },
  modalDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10
  },
  lessonCount: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    textAlign: 'center'
  },
  xp: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    textAlign: 'center'
  },
  calendarModalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    padding: 10
  },
  calendarModalTitle: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: 20
  },
  calendarModalMsg: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    padding: 10
  },
  calendarModalBtn: {
    backgroundColor: '#fb1b2f',
    padding: 10,
    borderRadius: 99
  },
  calendarModalBtnText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 14
  }
});
const mapStateToProps = ({ cards }, props) => {
  return { data: cards?.[props.data.id] || props.data };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleMyList, toggleLike }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Card);
