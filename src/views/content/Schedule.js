import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import Icon from '../../assets/icons.js';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import AddToCalendar from '../../modals/AddToCalendar';
import { addToMyList, removeFromMyList } from '../../services/UserActions';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import { SafeAreaView } from 'react-navigation';
import NavigationBar from '../../components/NavigationBar.js';
import { getScheduleContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

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
      addToCalendarModal: false,
      isLoading: true
    };
  }

  componentDidMount = async () => {
    let items = await getScheduleContent();

    for (i in response) {
      let time = response[i].live_event_start_time
        ? response[i].live_event_start_time
        : response[i].published_on;
      let d = new Date(time + ' UTC');

      response[i].timeData = { month: d.getMonth() };
    }

    this.setState({ items, isLoading: false });
  };

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';
    for (i in word) string = string + word[i] + ' ';
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

  toggleMyList = contentID => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState(({ items }) => ({
      items: items.map(item => {
        if (item.id === contentID)
          if (item.isAddedToList) removeFromMyList(contentID);
          else addToMyList(contentID);
        return {
          ...item,
          isAddedToList:
            item.id === contentID ? !item.isAddedToList : item.isAddedToList
        };
      })
    }));
  };

  checkShouldRender = item => {
    for (i in this.state.items) {
      if (this.state.items[i].id == item.id) {
        if (Number(i) === 0) return true;
        else if (
          item.timeData.month !== this.state.items[Number(i) - 1].timeData.month
        ) {
          return true;
        } else return false;
      }
    }
  };

  render() {
    return (
      <SafeAreaView
        style={styles.mainContainer}
        forceInset={{
          bottom: 'never',
          top: 'never'
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
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.items}
            extraData={this.state}
            keyExtractor={item => item.id.toString()}
            style={styles.mainContainer}
            ListEmptyComponent={() =>
              this.state.isLoading ? (
                <ActivityIndicator
                  size={'small'}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  color={colors.secondBackground}
                />
              ) : (
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
              )
            }
            renderItem={({ item }) => {
              let type = item.lesson ? 'lesson' : 'overview';
              let date = new Date(
                `${item?.live_event_start_time || item?.published_on} UTC`
              );
              return (
                <>
                  {this.checkShouldRender(item) && (
                    <Text
                      style={{
                        padding: 10,
                        color: colors.secondBackground,
                        fontSize: onTablet ? 14 : 12
                      }}
                    >
                      {month[item.timeData.month]}
                    </Text>
                  )}
                  <TouchableOpacity
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
                        {date.toLocaleString([], { weekday: 'short' })}{' '}
                        {date.getDate()}
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
                        {date.toLocaleString([], {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
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
                          paddingLeft: 20,
                          flexDirection: 'row'
                        }
                      ]}
                    >
                      {!item.is_added_to_primary_playlist ? (
                        <TouchableOpacity
                          onPress={() => this.addToMyList(item.id)}
                        >
                          <Icon.AntDesign
                            name={'plus'}
                            size={sizing.myListButtonSize}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.removeFromMyList(item.id)}
                        >
                          <Icon.AntDesign
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
                        <Icon.FontAwesome5
                          size={sizing.infoButtonSize}
                          name={'calendar-plus'}
                          color={colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </View>
        <AddToCalendar
          isVisible={this.state.addToCalendarModal}
          hideAddToCalendar={() => this.setState({ addToCalendarModal: false })}
          addEventToCalendar={() => {
            this.addEventToCalendar();
          }}
        />
        <NavigationBar currentPage={'SCHEDULE'} />
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({});
