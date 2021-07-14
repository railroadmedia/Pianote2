import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const onTablet = DeviceInfo.isTablet();
const isiOS = Platform.OS === 'ios';

const mainBackground = '#00101d';
const secondBackground = '#445f73';
const thirdBackground = '#081826';
const notificationColor = '#002038';
const pianoteRed = '#fb1b2f';
const pianoteGrey = '#6e777a';

const descriptionText = onTablet ? 16 : 12;
const infoButtonSize = onTablet ? 22.5 : 17.5;
const myListButtonSize = onTablet ? 28 : 22;
const titleViewLesson = onTablet ? 24 : 18;
const videoTitleText = onTablet ? 16 : 14;
const verticalListTitleSmall = onTablet ? 18 : 14;

export {
  onTablet,
  isiOS,
  mainBackground,
  secondBackground,
  thirdBackground,
  notificationColor,
  pianoteRed,
  pianoteGrey,
  descriptionText,
  infoButtonSize,
  myListButtonSize,
  titleViewLesson,
  videoTitleText,
  verticalListTitleSmall
};
