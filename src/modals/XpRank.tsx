import React, { FunctionComponent, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal
} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { onTablet } from '../../AppStyle';

const ranks = [
  0,
  100,
  250,
  500,
  1000,
  2500,
  10000,
  25000,
  100000,
  250000,
  500000,
  1000000,
  1500000,
  2000000,
  2500000,
  3000000,
  4000000,
  5000000,
  7500000,
  100000000
];

interface XpRankProps {
  xp: number;
  rank: string;
  hideXpRank: () => void;
}

const XpRank: FunctionComponent<XpRankProps> = ({ xp, rank, hideXpRank }) => {
  const nextRank = useMemo(() => {
    return ranks.find(r => xp < r) || 100000000;
  }, [xp]);

  const rankProgress = useMemo(() => {
    return (xp / nextRank) * 100;
  }, [xp, nextRank]);

  return (
    <Modal
      transparent={true}
      visible={true}
      style={{ margin: 0, flex: 1 }}
      animationType={'slide'}
      onRequestClose={() => hideXpRank()}
    >
      <TouchableOpacity
        style={[localStyles.centerContent, { margin: 0, flex: 1 }]}
        activeOpacity={1}
        onPress={() => hideXpRank()}
      >
        <View style={[localStyles.container, localStyles.centerContent]}>
          <Text style={[localStyles.modalHeaderText, localStyles.title]}>
            Your XP Rank
          </Text>
          <Text style={[localStyles.modalBodyText, localStyles.description]}>
            You earn XP by completing lessons,{'\n'}
            commenting on videos and more!
          </Text>
          <ProgressCircle
            percent={rankProgress}
            radius={(onTablet ? 0.2 : 0.27) * Dimensions.get('window').width}
            borderWidth={5}
            shadowColor={'pink'}
            color={'red'}
            bgColor={'white'}
          >
            <Text style={localStyles.XPtext}>{xp}</Text>
            <Text style={localStyles.rankText}>{rank}</Text>
          </ProgressCircle>
          <Text style={[localStyles.modalBodyText, localStyles.nextRank]}>
            Next rank: {nextRank}
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default XpRank;

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  container: {
    borderRadius: 15,
    backgroundColor: 'white',
    marginHorizontal: '10%',
    elevation: 10
  },
  title: {
    paddingHorizontal: 30,
    marginTop: 15
  },
  description: {
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: onTablet ? 18 : 14
  },
  ProgressCircleContainer: {
    transform: [{ rotate: '315deg' }]
  },
  XPtext: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 34 : 26
  },
  rankText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 24 : 18
  },
  nextRank: {
    color: 'grey',
    paddingHorizontal: 40,
    marginVertical: 10,
    fontSize: onTablet ? 18 : 14
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 24 : 18
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: onTablet ? 16 : 12
  }
});
