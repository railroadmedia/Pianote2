/**
 * HorizontalVideoList
 */
import React from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    StyleSheet,
    TouchableOpacity, 
    TouchableHighlight 
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import TheFourPillars from '../modals/TheFourPillars';
import Icon from 'react-native-vector-icons/AntDesign';

class HorizontalVideoList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.showFooter = this.showFooter.bind(this)
        this.state = {
            showCourse: false,
        }
    }


    showFooter() {
        if(this.props.items.length == 0) {
            return (
                <View 
                    style={[
                        styles.centerContent, {
                        height: '100%',
                    }]}
                >
                    <View style={{flex: 1}}></View>
                    <ActivityIndicator 
                        size={'small'}
                        color={'grey'}
                    />
                    <View style={{flex: 1}}></View>
                </View>
            )
        } else {
            return (
                <View style={{height: 10*factorHorizontal}}></View>
            )
        }
    }


    render = () => {
        return (
            <View style={styles.container}>
                <View style={[styles.centerContent, {flex: 1}]}>
                    <View key={'container'}
                        style={[
                            localStyles.itemContainer, {
                            height: '17.5%',
                            width: fullWidth-20*factorHorizontal,
                        }]}
                    >
                        <View key={'inProgressText'}
                            style={{
                                flex: 1, 
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20*factorRatio,
                                    marginTop: 7.5*factorRatio,
                                    textAlign: 'left', 
                                    fontWeight: '700', 
                                    fontFamily: 'RobotoCondensed-Regular',
                                }}
                            >
                                {this.props.Title}
                            </Text>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity key={'seeAll'}
                                style={{flex: 1}}
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        this.props.seeAllRoute,
                                        {firstPage: this.props.items}
                                    )
                                }}
                            >
                                <Text 
                                    style={{
                                        textAlign: 'right',
                                        fontSize: 14.5*factorRatio,
                                        marginRight: 7.5*factorRatio,
                                        fontWeight: '300',
                                        marginTop: 10*factorRatio,
                                        color: 'red',
                                    }}
                                >
                                    See All
                                </Text>
                            </TouchableOpacity>
                            <View style={{flex: 0.1}}/>
                        </View>
                        {((this.props.Description === '') ? false : true) && (
                        <View key={'description'}
                            style={{flex: 0.5}}
                        >
                            <Text style={[
                                localStyles.description, {
                                fontSize: 16*factorRatio,
                                fontFamily: 'RobotoCondensed-Regular',
                            }]}>
                                {this.props.Description}
                            </Text>
                        </View>
                        )}
                    </View>
                    {(this.props.Description === '' ? false : true) && (
                    <View style={{height: '0.75%'}}/>
                    )}
                    <FlatList
                        data={this.props.items}
                        extraData={this.state}
                        horizontal={true}
                        ListFooterComponent={this.showFooter}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) =>
                        <View>
                            <TouchableHighlight 
                                underlayColor={'transparent'}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <View style={[
                                    localStyles.imageContainer, {
                                    width: this.props.itemWidth,
                                    height: this.props.itemHeight,
                                    marginRight: 10*factorHorizontal,
                                    borderRadius: 7.5*factorRatio,
                                    backgroundColor: '#ececec',
                                }]}>
                                    <TouchableOpacity
                                        onLongPress={() => {
                                            this.setState({
                                                showCourse:  true
                                            })
                                        }}
                                        delayLongPress={350}
                                        onPress={() => {
                                            this.props.navigation.navigate('ASSIGNMENTS')
                                        }}
                                        style={{
                                            flex: 1, 
                                            alignSelf: 'stretch'
                                        }}
                                    >
                                        <FastImage 
                                            style={{flex: 1, borderRadius: 7.5*factorRatio}}
                                            source={{uri: item.thumbnail}}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />        
                                    </TouchableOpacity>
                                </View>
                            </TouchableHighlight>
                            <View style={{height: 10*factorVertical}}/>
                            <View 
                                style={{
                                    width: this.props.itemWidth,
                                    height: 80*factorVertical,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 0.8}}>
                                    <Text 
                                        numberOfLines={2} 
                                        style={{
                                            fontSize: 18*factorRatio,
                                            marginTop: 7.5*factorRatio,
                                            textAlign: 'left', 
                                            fontWeight: '700',
                                            fontFamily: 'Roboto',
                                        }}
                                    >
                                        {item.title}
                                    </Text>
                                    <View style={{height: 3*factorRatio}}/>
                                    {this.props.showArtist && (
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            textAlign: 'left',
                                            fontFamily: 'Roboto',
                                            fontWeight: '300',
                                            color: 'grey',
                                            fontSize: 13*factorRatio,
                                        }}
                                    >
                                        Song / Ed Sheeran
                                    </Text>
                                    )}
                                </View>
                                <View style={{flex: 0.2, flexDirection: 'row'}}>
                                    <View style={{flex: 1}}/>
                                    {this.props.showArtist && (
                                    <TouchableOpacity
                                        onPress={() => {}}
                                    >
                                        <Icon
                                            name={'plus'}
                                            size={30*factorRatio}
                                            color={'#b8b8b8'}
                                        />
                                    </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    }/>
                    <Modal key={'modal'}
                        isVisible={this.state.showCourse}
                        style={[
                            styles.centerContent, {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        }]}
                        animation={'slideInUp'}
                        animationInTiming={250}
                        animationOutTiming={250}
                        coverScreen={true}
                        hasBackdrop={false}
                        backdropColor={'white'}
                        backdropOpacity={0.79}
                    >
                        <TheFourPillars
                            hideTheFourPillars={() => {
                                this.setState({
                                    showCourse: false
                                })
                            }}
                        />
                    </Modal>       
                </View>
            </View>
        )
    }
}

const localStyles = StyleSheet.create({
    description: {
        textAlign:'left', 
        fontWeight:'500', 
        color:'#979797', 
        fontFamily:'avenir next',
    },
    styleTitle: {
        textAlign:'left', 
        fontWeight:'bold', 
        fontFamily:'avenir next',
    },
    itemContainer: {
        alignSelf:'stretch', 
        justifyContent:'center', 
        alignContent:'center', 
    },
});

export default withNavigation(HorizontalVideoList);