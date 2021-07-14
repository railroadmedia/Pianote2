import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIconsI from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIconsI from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeI from 'react-native-vector-icons/FontAwesome';
import FontAwesome5I from 'react-native-vector-icons/FontAwesome5';
import FoundationI from 'react-native-vector-icons/Foundation';
import EvilIconsI from 'react-native-vector-icons/EvilIcons';
import OcticonsI from 'react-native-vector-icons/Octicons';
import IoniconsI from 'react-native-vector-icons/Ionicons';
import AntDesignI from 'react-native-vector-icons/AntDesign';
import FeatherI from 'react-native-vector-icons/Feather';
import EntypoI from 'react-native-vector-icons/Entypo';
import ZocialI from 'react-native-vector-icons/Zocial';
import React from 'react';
import { IconProps } from 'react-native-vector-icons/Icon';

export const MaterialCommunityIcons = (props: IconProps) => (
  <MaterialCommunityIconsI {...props} />
);
const SimpleLineIcons = (props: IconProps) => <SimpleLineIconsI {...props} />;
const MaterialIcons = (props: IconProps) => <MaterialIconsI {...props} />;
const FontAwesome = (props: IconProps) => <FontAwesomeI {...props} />;
const FontAwesome5 = (props: IconProps) => <FontAwesome5I {...props} />;
const Foundation = (props: IconProps) => <FoundationI {...props} />;
const EvilIcons = (props: IconProps) => <EvilIconsI {...props} />;
const AntDesign = (props: IconProps) => <AntDesignI {...props} />;
const Ionicons = (props: IconProps) => <IoniconsI {...props} />;
const Octicons = (props: IconProps) => <OcticonsI {...props} />;
const Feather = (props: IconProps) => <FeatherI {...props} />;
const Entypo = (props: IconProps) => <EntypoI {...props} />;
const Zocial = (props: IconProps) => <ZocialI {...props} />;

export default {
  MaterialCommunityIcons,
  SimpleLineIcons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Foundation,
  AntDesign,
  EvilIcons,
  Ionicons,
  Octicons,
  Feather,
  Entypo,
  Zocial
};
