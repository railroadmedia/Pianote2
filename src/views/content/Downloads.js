import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet
} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavigationBar from '../../../src/components/NavigationBar.js';
import { Download_V2, offlineContent } from 'RNDownload';
import Icon from '../../assets/icons.js';
import { SafeAreaView } from 'react-navigation';
import { NetworkContext } from '../../context/NetworkProvider';
import { navigate } from '../../../AppNavigator';

const onTablet = global.onTablet;

export default class Downloads extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      items: Object.values(offlineContent)
    };
  }

  componentDidMount = () =>
    (this.dldEventListener =
      this.dldEventListener ||
      Download_V2.addEventListener(this.percentageListener));

  componentWillUnmount = () => this.dldEventListener?.remove();

  percentageListener = p => {
    let items = Object.values(offlineContent);
    if (this.state.items.length !== items.length)
      this.setState(({ edit }) => ({
        items,
        edit: items.length ? edit : false
      }));
  };

  onDone = () => this.setState({ items: Object.values(offlineContent) });

  navigate = item => {
    if (item.overview) {
      return navigate('PATHOVERVIEW', {
        data: {
          isLiked: item.is_liked_by_current_user,
          id: item.id,
          thumbnail: item.thumbnail_url,
          title: item.title,
          artist: item.instructor,
          xp: item.xp,
          total_xp: item.total_xp,
          description: item.description,
          like_count: item.like_count,
          isAddedToList: item.is_added_to_primary_playlist,
          next_lesson: item.next_lesson,
          started: item.started,
          completed: item.completed,
          difficulty: item.difficulty
        },
        items: item.lessons
      });
    } else if (item?.lesson.type === 'learning-path-lesson') {
      navigate('VIEWLESSON', {
        url: item.lesson.mobile_app_url
      });
    } else {
      navigate('VIEWLESSON', {
        id: item.id
      });
    }
  };

  render() {
    let { edit, items } = this.state;
    return (
      <SafeAreaView
        forceInset={{ bottom: 'never' }}
        style={styles.packsContainer}
      >
        <StatusBar
          backgroundColor={colors.thirdBackground}
          barStyle={'light-content'}
        />
        <View style={styles.packsContainer}>
          <View style={styles.childHeader}>
            <View style={{ flex: 1 }} />
            <Text style={styles.childHeaderText}>Downloads</Text>
            <TouchableOpacity
              onPress={() =>
                this.setState(({ edit }) => ({
                  edit: items.length ? !edit : false
                }))
              }
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-end'
              }}
            >
              <Text
                style={{
                  color: colors.pianoteRed,
                  fontFamily: 'OpenSans-Bold',
                  fontSize: onTablet ? 18 : 12
                }}
              >
                EDIT
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            keyboardShouldPersistTaps='handled'
            keyExtractor={item => item.id.toString()}
            style={styles.mainContainer}
            ListEmptyComponent={() => (
              <Text
                style={{
                  padding: 15,
                  color: 'white',
                  textAlign: 'center',
                  fontSize: onTablet ? 20 : 12
                }}
              >
                Any lessons you download will be available here.
              </Text>
            )}
            renderItem={({ item }) => {
              let type = item.lesson ? 'lesson' : 'overview';
              return (
                <TouchableOpacity
                  disabled={!!item.dlding.length}
                  onPress={() => this.navigate(item)}
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                    borderColor: 'lightgrey'
                  }}
                >
                  <View
                    style={{
                      width: onTablet ? '22.5%' : '26%',
                      aspectRatio: 16 / 9,
                      marginRight: 10
                    }}
                  >
                    <FastImage
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 2
                      }}
                      source={{
                        uri: item[type].thumbnail_url
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center'
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: sizing.videoTitleText,
                        marginBottom: 2,
                        color: 'white',
                        fontFamily: 'OpenSans-Bold'
                      }}
                    >
                      {item[type].title}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: sizing.descriptionText
                      }}
                    >
                      {item[type]?.type?.replace('-', ' ').replace('-', ' ')} |{' '}
                      {parseInt(item.sizeInBytes / 1024 / 1024)}MB
                    </Text>
                  </View>
                  {!!item.dlding.length && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255,255,255,.2)'
                      }}
                    />
                  )}
                  {!item.dlding.length && !edit ? (
                    <View style={{ justifyContent: 'center' }}>
                      <Icon.Feather
                        name={'chevron-right'}
                        size={onTablet ? 25 : 20}
                        color={'white'}
                      />
                    </View>
                  ) : (
                    <Download_V2
                      onDone={this.onDone}
                      entity={item}
                      styles={{
                        touchable: {
                          padding: 10,
                          paddingRight: 0,
                          alignSelf: 'center'
                        },
                        iconDownloadColor: colors.pianoteRed,
                        activityIndicatorColor: colors.pianoteRed,
                        animatedProgressBackground: colors.pianoteRed,
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
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <NavigationBar currentPage={'DOWNLOAD'} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#00101d',
    flex: 1
  },
  packsContainer: {
    flex: 1,
    backgroundColor: '#081826'
  },
  childHeaderText: {
    fontSize: onTablet ? 28 : 20,
    color: 'white',
    fontFamily: 'OpenSans-ExtraBold',
    alignSelf: 'center',
    textAlign: 'center'
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#081826',
    padding: 10
  },
  container: {
    flex: 1,
    alignSelf: 'stretch'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
});
