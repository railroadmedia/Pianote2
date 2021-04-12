/**
 * Schedule
 */
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet
} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import AddToCalendar from '../../modals/AddToCalendar';
import { addToMyList, removeFromMyList } from '../../services/UserActions';
import AntIcon from 'react-native-vector-icons/AntDesign';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import { SafeAreaView } from 'react-navigation';
import NavigationBar from '../../components/NavigationBar.js';
import { getScheduleContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export default class Schedule extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      title: props.route.params.title,
      parent: props.route.params.parent,
      items: [],
      month: '',
      addToCalendarModal: false
    };
  }

  async componentDidMount() {
    let response = await getScheduleContent();
    this.setState({ items: response });
  }

  timeVariables = time => {
    let date = new Date(time + ' UTC').getTime();
    let localDate = new Date(date);
    let amPM = 'AM';

    if (this.state.month == '') {
      this.setState({
        month: localDate.getMonth()
      });
    }

    if (localDate.getHours() > 11) {
      amPM = 'PM';
    }

    return {
      minutes: localDate.getMinutes(),
      hours:
        localDate.getHours() > 12
          ? localDate.getHours() - 12
          : localDate.getHours(),
      day: localDate.getDay(),
      date: localDate.getDate(),
      month: localDate.getMonth(),
      amPM
    };
  };

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';

    for (let i = 0; i < word.length; i++) {
      if (word[i] !== 'and') {
        word[i] = word[i][0].toUpperCase() + word[i].substr(1);
      }
    }

    for (i in word) {
      string = string + word[i] + ' ';
    }

    return string;
  };

  addEventToCalendar = () => {
    const eventConfig = {
      title: this.addToCalendarLessonTitle,
      startDate: new Date(this.addToCalendatLessonPublishDate),
      endDate: new Date(this.addToCalendatLessonPublishDate)
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        this.addToCalendarLessonTitle = '';
        this.addToCalendatLessonPublishDate = '';
        this.setState({ addToCalendarModal: false });
      })
      .catch(e => {});
  };

  addToMyList = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    this.state.items.find(
      item => item.id == contentID
    ).is_added_to_primary_playlist = true;

    this.setState({ items: this.state.items });

    addToMyList(contentID);
  };

  removeFromMyList = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    this.state.items.find(
      item => item.id == contentID
    ).is_added_to_primary_playlist = false;

    this.setState({ items: this.state.items });

    removeFromMyList(contentID);
  };

  render() {
    return (
      <SafeAreaView
        forceInset={{
          bottom: 'never',
          top: 'never'
        }}
        style={styles.mainContainer}
      >
        <NavMenuHeaders
          currentPage={'LESSONS'}
          parentPage={this.state.parent}
        />
        <StatusBar
          backgroundColor={colors.thirdBackground}
          barStyle={'light-content'}
        />
        <Text style={styles.contentPageHeader}>{this.state.title}</Text>
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.items}
            extraData={this.state}
            keyExtractor={item => item.id.toString()}
            style={styles.mainContainer}
            ListHeaderComponent={() => (
              <Text
                style={{
                  paddingLeft: 10,
                  paddingTop: 10,
                  color: colors.secondBackground,
                  fontSize: onTablet ? 14 : 12
                }}
              >
                {month[this.state.month]}
              </Text>
            )}
            ListEmptyComponent={() => (
              <Text
                style={{
                  padding: 10,
                  color: 'white',
                  textAlign: 'left',
                  fontSize: onTablet ? 16 : 14
                }}
              >
                Sorry, there are no upcoming events!
              </Text>
            )}
            renderItem={({ item }) => {
              let type = item.lesson ? 'lesson' : 'overview';
              return (
                <TouchableOpacity
                  onPress={() => this.navigate(item)}
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    height: 80
                  }}
                >
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: '26%',
                        aspectRatio: 16 / 9,
                        backgroundColor: 'black',
                        borderRadius: 10,
                        marginRight: 10
                      }
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: sizing.descriptionText,
                        color: 'white',
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Bold',
                        textAlign: 'center'
                      }}
                    >
                      {day[this.timeVariables(item.live_event_start_time).day]}{' '}
                      {this.timeVariables(item.live_event_start_time).date}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: sizing.descriptionText,
                        color: 'white',
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Regular',
                        textAlign: 'center'
                      }}
                    >
                      {this.timeVariables(item.live_event_start_time).hours}:
                      {this.timeVariables(item.live_event_start_time).minutes ==
                      0
                        ? '00'
                        : this.timeVariables(item.live_event_start_time)
                            .minutes}
                      {' ' +
                        this.timeVariables(item.live_event_start_time).amPM}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontSize: sizing.videoTitleText,
                        marginBottom: 2,
                        color: 'white',
                        fontFamily: 'OpenSans-Bold'
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: sizing.descriptionText,
                        color: colors.secondBackground,
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Regular'
                      }}
                    >
                      {this.changeType(item.type)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.centerContent,
                      {
                        flexDirection: 'row'
                      }
                    ]}
                  >
                    {!item.is_added_to_primary_playlist ? (
                      <TouchableOpacity
                        onPress={() => this.addToMyList(item.id)}
                      >
                        <AntIcon
                          name={'plus'}
                          size={sizing.myListButtonSize}
                          color={colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.removeFromMyList(item.id)}
                      >
                        <AntIcon
                          name={'close'}
                          size={sizing.myListButtonSize}
                          color={colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={{ marginLeft: 10 }}
                      onPress={() => {
                        this.addToCalendarLessonTitle = item.title;
                        this.addToCalendatLessonPublishDate =
                          item.live_event_start_time;
                        this.setState({ addToCalendarModal: true });
                      }}
                    >
                      <FontIcon
                        size={sizing.infoButtonSize}
                        name={'calendar-plus'}
                        color={colors.pianoteRed}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <Modal
          isVisible={this.state.addToCalendarModal}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <AddToCalendar
            hideAddToCalendar={() =>
              this.setState({ addToCalendarModal: false })
            }
            addEventToCalendar={() => {
              this.addEventToCalendar();
            }}
          />
        </Modal>
        <NavigationBar currentPage={'SCHEDULE'} />
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({});
