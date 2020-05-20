/**
 * Taskbar for navigation
*/
import React from 'react';
import { 
    View, 
    TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';

class NavigationBar extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            profileImage: '',
            onHome: false,
            onSearch: false,
            onDownload: false,
            hasNotch: 0,
        }
    }

    componentDidMount = async () => {
        let profileImage = await AsyncStorage.getItem('profileURI')
        if(profileImage !== null) {
            await this.setState({profileImage})
        }
    }


    render = () => {
        return (
            <View key={'taskBarContainer'}
                style={{
                    backgroundColor: colors.mainBackground,
                    height: fullHeight*0.09375,
                    borderTopColor: '#ececec',
                    borderTopWidth: 2*factorRatio,
                }}
            >
                <View style={{flex: 1}}/>
                <View key={'icons'}
                    style={{
                        alignSelf: 'stretch',
                        flexDirection: 'row',
                        paddingRight: 10,
                        paddingLeft: 10,
                        justifyContent: 'space-around',
                        alignContent: 'space-around',
                    }}
                >
                    <TouchableOpacity key={'home'}
                        onPress={() => this.props.navigation.navigate('HOME')}
                    >
                        <SimpleLineIcon
                            name={'home'}
                            size={30*factorRatio}
                            color={(this.props.currentPage == 'HOME') ? '#fb1b2f' : 'grey'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity key={'search'}
                        onPress={() => this.props.navigation.navigate('SEARCH')}
                    >
                        <EvilIcons
                            name={'search'}
                            size={40*factorRatio}
                            color={(this.props.currentPage == 'SEARCH') ? '#fb1b2f' : 'grey'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity key={'download'}
                        onPress={() => this.props.navigation.navigate('DOWNLOADS')}
                    >
                        <MaterialIcon
                            name={'arrow-collapse-down'}
                            size={30*factorRatio}
                            color={(this.props.currentPage == 'DOWNLOAD') ? '#fb1b2f':'grey'}
                        />
                    </TouchableOpacity>                            
                    <TouchableOpacity key={'profile'}
                        onPress={() => this.props.navigation.navigate('PROFILE')}
                    >
                        <View 
                            style={{
                                width: 37.5*factorRatio,
                                height: 37.5*factorRatio,
                                borderRadius: 100,
                                borderWidth: 2.25*factorRatio,
                                borderColor: (this.props.currentPage == 'PROFILE') ? '#fb1b2f':'transparent',
                            }} 
                        >
                            <FastImage
                                style={{flex: 1, borderRadius: 100, backgroundColor: '#ececec'}}
                                source={{uri: this.state.profileImage}}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                        </View>
                        <View style={{height: 2*factorVertical}}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}/>
                <View style={{height: isNotch ? 15 : 0}}/>
            </View>
        )
    }
}

export default withNavigation(NavigationBar);