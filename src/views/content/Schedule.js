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
  StyleSheet,
} from 'react-native';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import AntIcon from 'react-native-vector-icons/AntDesign';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import { SafeAreaView } from 'react-navigation';
import NavigationBar from '../../components/NavigationBar.js';
import { getScheduleContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class Schedule extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      title: props.route.params.title,
      parent: props.route.params.parent,
      items: [], 
      month: '',
    };
  }

  async componentDidMount() {
    let response = await getScheduleContent();
    this.setState({ items: response })
  }

  timeVariables = time => {
    let date = new Date(time+' UTC').getTime()
    let localDate = new Date(date)
    let amPM = 'AM';

    if(this.state.month == '') {
      this.setState({
        month: localDate.getMonth()
      })
    }

    if (localDate.getHours() > 11) {
      amPM = 'PM';
    }

    return {
      minutes: localDate.getMinutes(),
      hours: (localDate.getHours() > 12) ? localDate.getHours() - 12 : localDate.getHours(),
      day: localDate.getDay(),
      date: localDate.getDate(),
      month: localDate.getMonth(),
      amPM
    }
  }

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
                  textAlign: 'center',
                  fontSize: onTablet ? 20 : 12
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
                    height: 80, 
                  }}
                >
                  <View
                    style={[
                      styles.centerContent, {
                      width: '26%',
                      aspectRatio: 16 / 9,
                      backgroundColor: 'black',
                      borderRadius: 10, 
                      marginRight: 10,
                    }]}
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
                      {day[this.timeVariables(item.live_event_start_time).day]} {this.timeVariables(item.live_event_start_time).date}
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
                      {this.timeVariables(item.live_event_start_time).hours}
                      :
                      {(this.timeVariables(item.live_event_start_time).minutes) == 0 ? '00' : this.timeVariables(item.live_event_start_time).minutes}
                      {' ' + (this.timeVariables(item.live_event_start_time).amPM)}
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
                      styles.centerContent, { 
                      flexDirection: 'row',
                    }]}
                  >
                    {!item.is_added_to_primary_playlist ? (
                      <TouchableOpacity
                        onPress={() =>
                          this.addToMyList(this.state.liveLesson[0]?.id)
                        }
                      >
                        <AntIcon
                          name={'plus'}
                          size={sizing.myListButtonSize}
                          color={colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          this.removeFromMyList(
                            this.state.liveLesson[0]?.id
                          )
                        }
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
                        this.addToCalendarLessonTitle = this.state.liveLesson[0].title;
                        this.addToCalendatLessonPublishDate = this.state.liveLesson[0].live_event_start_time;
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
        <NavigationBar currentPage={'SCHEDULE'} />
      </SafeAreaView>
    );
  }
}


const localStyles = StyleSheet.create({
  title: {
    fontSize: DeviceInfo.isTablet() ? 20 : 16,
    fontFamily: 'RobotoCondensed-Bold',
    paddingVertical: 5
  },
  seeAllText: {
    textAlign: 'right',
    fontSize: DeviceInfo.isTablet() ? 16 : 12,
    color: '#fb1b2f',
    paddingRight: 10
  },
  titleContain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  progressItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  imageIOS: {
    width: '100%',
    borderRadius: 7.5
  },
  videoTitle: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  videoTitleText: {
    fontSize: DeviceInfo.isTablet() ? 16 : 14,
    fontFamily: 'OpenSans-Bold',
    color: 'white'
  },
  typeContainer: {
    flexDirection: 'row'
  }
});
