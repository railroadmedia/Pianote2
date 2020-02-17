/* 
* GradientFeature
*/
import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';

const colorDict = {
    red: ['transparent', 'rgba(80, 15, 25, 0.4)', 'rgba(80, 15, 25, 0.98)'],
    black: ['transparent', 'rgba(20, 20, 20, 0.95)', 'rgba(15, 15, 15, 0.98)'],
    grey: ['transparent', 'rgba(23, 26, 26, 1)', 'rgba(23, 26, 26, 1)'],
    brown: ['rgba(65, 11, 17, 0)', 'rgba(65, 11, 17, 0.7)', 'rgba(65, 11, 17, 1)'],
    dark: ['rgba(23, 26, 26, 1)', 'rgba(23, 26, 26, 1)', 'rgba(23, 26, 26, 1)'],
}

class GradientFeature extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    
    render = () => {
        return (
            <View
                style={{
                    opacity: this.props.opacity,
                    height: this.props.height,
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                    zIndex: 2,
                    left: 0,
                }}
            >
                <LinearGradient colors={colorDict[this.props.color]} 
                    style={{
                        borderRadius: this.props.borderRadius,
                        height: '100%',
                        width: '100%',
                    }}
                >
                </LinearGradient>
            </View>
        )
    }
}

export default withNavigation(GradientFeature);