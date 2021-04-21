import React from 'react';
import { StyleSheet, View } from 'react-native';

import DiscussionCard from '../commons/DiscussionCard';

let styles;
export default class Forums extends React.Component {
  constructor(props) {
    super(props);
    let { isDark, NetworkContext } = props.route.params;
    Forums.contextType = NetworkContext;
    styles = setStyles(isDark);
  }

  render() {
    return (
      <>
        <DiscussionCard
          data={{
            user: {
              avatarUrl:
                'https://d2vyvo0tyx8ig5.cloudfront.net/avatars/d1dfa3b0-28e5-4042-b6f4-b78c8063c663-1618221945-149628.jpg'
            }
          }}
        />
      </>
    );
  }
}
let setStyles = isDark => StyleSheet.create({});
