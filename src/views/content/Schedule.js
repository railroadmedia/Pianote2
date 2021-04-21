import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import AddToCalendar from '../../modals/AddToCalendar';
import {addToMyList, removeFromMyList} from '../../services/UserActions';
import AntIcon from 'react-native-vector-icons/AntDesign';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import {SafeAreaView} from 'react-navigation';
import NavigationBar from '../../components/NavigationBar.js';
import {getScheduleContent} from '../../services/GetContent';
import {NetworkContext} from '../../context/NetworkProvider';

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
  'December',
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
      addToCalendarModal: false,
      isLoading: true,
    };
  }

  componentDidMount = async () => {
    let response = await getScheduleContent();

    for (i in response) {
      let time = response[i].live_event_start_time
        ? response[i].live_event_start_time
        : response[i].published_on;
      let date = new Date(time + ' UTC').getTime();
      let d = new Date(date);
      let amPM = 'AM';

      if (this.state.month == '' && d instanceof Date && !isNaN(d.valueOf())) {
        this.setState({month: d.getMonth()});
      }
      if (d.getHours() > 11) {
        amPM = 'PM';
      }

      response[i].timeData = {
        minutes: d.getMinutes(),
        hours: d.getHours() > 12 ? d.getHours() - 12 : d.getHours(),
        day: d.getDay(),
        date: d.getDate(),
        month: d.getMonth(),
        amPM,
      };
    }

    this.setState({items: response, isLoading: false});
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
      endDate: new Date(this.addToCalendatLessonPublishDate),
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        this.addToCalendarLessonTitle = '';
        this.addToCalendatLessonPublishDate = '';
        this.setState({addToCalendarModal: false});
      })
      .catch(e => {});
  };

  addToMyList = contentID => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    for (i in this.state.items) {
      if (this.state.items[i].id == contentID) {
        let items = Object.assign([], this.state.items);
        items[i].is_added_to_primary_playlist = true;
        this.setState({items});
      }
    }
    addToMyList(contentID);
  };

  removeFromMyList = contentID => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    for (i in this.state.items) {
      if (this.state.items[i].id == contentID) {
        let items = Object.assign([], this.state.items);
        items[i].is_added_to_primary_playlist = false;
        this.setState({items});
      }
    }
    removeFromMyList(contentID);
  };

  render() {
    return (
      <SafeAreaView
        style={styles.mainContainer}
        forceInset={{
          bottom: 'never',
          top: 'never',
        }}
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
                fontSize: onTablet ? 14 : 12,
              }}
            >
              {month[this.state.month]}
            </Text>
          )}
          ListEmptyComponent={() =>
            this.state.isLoading ? (
              <ActivityIndicator
                size={'small'}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                color={colors.secondBackground}
              />
            ) : (
              <Text
                style={{
                  padding: 10,
                  color: 'white',
                  textAlign: 'left',
                  fontSize: onTablet ? 16 : 14,
                }}
              >
                Sorry, there are no upcoming events!
              </Text>
            )
          }
          renderItem={({item}) => {
            let type = item.lesson ? 'lesson' : 'overview';
            return (
              <TouchableOpacity
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  height: 80,
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
                      marginRight: 10,
                    },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: sizing.descriptionText,
                      color: 'white',
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Bold',
                      textAlign: 'center',
                    }}
                  >
                    {day[item.timeData.day]} {item.timeData.date}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: sizing.descriptionText,
                      color: 'white',
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Regular',
                      textAlign: 'center',
                    }}
                  >
                    {item.timeData.hours}:
                    {item.timeData.minutes == 0 ? '00' : item.timeData.minutes}
                    {' ' + item.timeData.amPM}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: sizing.videoTitleText,
                      marginBottom: 2,
                      color: 'white',
                      fontFamily: 'OpenSans-Bold',
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
                      fontFamily: 'OpenSans-Regular',
                    }}
                  >
                    {this.changeType(item.type)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.centerContent,
                    {
                      paddingLeft: 20,
                      flexDirection: 'row',
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() =>
                      !item.is_added_to_primary_playlist
                        ? this.addToMyList(item.id)
                        : this.removeFromMyList(item.id)
                    }
                  >
                    <AntIcon
                      name={
                        !item.is_added_to_primary_playlist ? 'plus' : 'close'
                      }
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() => {
                      this.addToCalendarLessonTitle = item.title;
                      this.addToCalendatLessonPublishDate =
                        item.live_event_start_time;
                      this.setState({addToCalendarModal: true});
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
            hideAddToCalendar={() => this.setState({addToCalendarModal: false})}
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
