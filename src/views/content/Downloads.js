/**
 * Downloads
 */
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import { Download_V2, offlineContent } from 'RNDownload';
import IconFeather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-navigation';
import { NetworkContext } from '../../context/NetworkProvider';
import { ContentModel } from '@musora/models';
import { navigate } from '../../../AppNavigator';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class Downloads extends React.Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      items: Object.values(offlineContent)
    };
  }

  componentDidMount() {
    this.dldEventListener =
      this.dldEventListener ||
      Download_V2.addEventListener(this.percentageListener);
  }

  componentWillUnmount() {
    this.dldEventListener?.remove();
  }

  percentageListener = p => {
    let items = Object.values(offlineContent);
    if (this.state.items.length !== items.length)
      this.setState(({ edit }) => ({
        items,
        edit: items.length ? edit : false
      }));
  };

  onDone = () => {
    this.setState({ items: Object.values(offlineContent) });
  };

  navigate = item => {
    if (item.overview) {
      item = new ContentModel(item.overview);
      return navigate('PATHOVERVIEW', {
        data: {
          isLiked: item.post.is_liked_by_current_user,
          id: item.post.id,
          thumbnail: item.getData('thumbnail_url'),
          title: item.getField('title'),
          artist: item.getField('instructor').fields[0].value,
          xp: item.post.xp,
          total_xp: item.post.total_xp,
          description: item.getData('description'),
          like_count: item.post.like_count,
          isAddedToList: item.post.is_added_to_primary_playlist,
          next_lesson: new ContentModel(item.post.next_lesson),
          started: item.post.started,
          completed: item.post.completed,
          difficulty: item.getField('difficulty')
        },
        items: item.post.lessons
          .map(l => new ContentModel(l))
          .map(l => ({
            title: l.getField('title'),
            artist: l.getField('instructor')?.fields?.[0]?.value,
            thumbnail: l.getData('thumbnail_url'),
            type: l.post.type,
            description: l.getData('description'),
            xp: l.post.xp,
            id: l.post.id,
            like_count: l.post.like_count,
            duration: l.post.fields
              ?.find(f => f.key === 'video')
              ?.value?.fields?.find(f => f.key === 'length_in_seconds')?.value,
            isLiked: l.post.is_liked_by_current_user,
            isAddedToList: l.post.is_added_to_primary_playlist,
            isStarted: l.post.started,
            isCompleted: l.post.completed,
            bundle_count: l.post.bundle_count,
            progress_percent: l.post.progress_percent
          }))
      });
    } else if (item?.lesson.type === 'learning-path-lesson') {
      navigate('VIDEOPLAYER', {
        url: item.lesson.mobile_app_url
      });
    } else {
      navigate('VIDEOPLAYER', {
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
                  padding: paddingInset * 1.5,
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
                    padding: paddingInset,
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                    borderColor: 'lightgrey'
                  }}
                >
                  <View
                    style={{
                      width: onTablet ? '22.5%' : '26%',
                      marginRight: paddingInset
                    }}
                  >
                    <FastImage
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 2,
                        aspectRatio: 16 / 9
                      }}
                      source={{
                        uri: item[type]?.data?.find(
                          d => d.key === 'thumbnail_url'
                        )?.value
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
                      style={{
                        fontSize: sizing.videoTitleText,
                        marginBottom: 2,
                        color: 'white',
                        fontFamily: 'OpenSans-Bold'
                      }}
                    >
                      {item[type]?.fields?.find(f => f.key === 'title')?.value}
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
                      <IconFeather
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
