import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Comment from '../commons/Comment';

export default class Topic extends React.Component {
  static contextType;
  constructor(props) {
    super(props);
    Topic.contextType = props.route.params.NetworkContext;
  }
  render() {
    let {
      route: {
        params: { isDark, BottomNavigator, appColor }
      },
      navigation: { navigate, goBack }
    } = this.props;
    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: isDark ? '#00101d' : 'white',
            padding: 15
          }}
        >
          <Comment
            showReplyIcon={true}
            comment={{
              id: 1234,
              is_liked: false,
              like_count: 1,
              user: {
                'fields.profile_picture_image_url':
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png',
                xp: 1000,
                display_name: 'Harold Pierce',
                xp_level: 'Master'
              },
              created_on: '2020/02/04 09:00',
              image: 'https://d1923uyy6spedc.cloudfront.net/9-4-0.png',
              video:
                'https://player.vimeo.com/external/535073657.sd.mp4?s=e87212d62e9076fcab98191fe6e42838fc395a49&profile_id=164&oauth2_token_id=1284792283',
              comment:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
            }}
            appColor={appColor}
            isDark={isDark}
            NetworkContext={Topic.contextType}
            onEdit={() => navigate('Edit')}
            onDelete={() => {}}
          />
          <TouchableOpacity
            style={{ padding: 50, backgroundColor: 'blue' }}
            onPress={() => navigate('CreateDiscussion')}
          />
          <TouchableOpacity
            style={{ padding: 50, backgroundColor: 'black' }}
            onPress={goBack}
          />
          <TouchableOpacity
            style={{ padding: 50, backgroundColor: 'green' }}
            onPress={() => navigate('Edit', { text: 'aa' })}
          />
        </View>
        {!!BottomNavigator && <BottomNavigator currentPage={'Forum'} />}
      </>
    );
  }
}
