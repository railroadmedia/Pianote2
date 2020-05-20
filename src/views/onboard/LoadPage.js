/**
 * LoadPage
 */
import React from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';

export default class LoadPage extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    componentDidMount = async () => {
        await SplashScreen.hide();

        // check if loggedIn
        let isLoggedIn = await AsyncStorage.getItem('loggedInStatus')
        if(isLoggedIn !== 'true') {
            setTimeout(() => this.props.navigation.navigate('LOGIN'), 1000)
        } else {
            setTimeout(() => this.props.navigation.navigate('LESSONS'), 1000)
        }
    }


    render() {
        return (
            <View 
                styles={[
                    styles.centerContent, {
                    flex: 1, 
                    alignSelf: 'stretch',
                }]}
            >

                <View key={'loadPage'}
                    style={[
                        styles.centerContent, {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: fullHeight,
                        width: fullWidth,
                        zIndex: 4,
                        elevation: (Platform.OS == 'android') ? 4 : 0,
                        backgroundColor: colors.mainBackground,
                    }]}
                >
                    <Pianote
                        height={90*factorRatio}
                        width={190*factorRatio}
                        fill={'#fb1b2f'}
                    />
                    <View style={{height: 60*factorVertical}}/>
                </View>
                
          
            </View>
        )
    }
}