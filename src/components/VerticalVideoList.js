/**
 * VerticalVideoList
*/
import React from 'react';
import { 
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    FlatList, 
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import TheFourPillars from '../modals/TheFourPillars';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';

class VerticalVideoList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showCourse: false,
        }
    }


    showFooter() {
        if(this.props.outVideos == false) {
            return (
                <View
                    style={[
                        styles.centerContent, {
                        marginTop: 15*factorRatio,
                        height: 35*factorVertical
                    }]}
                >
                    <ActivityIndicator
                        size={(isTablet) ? 'large' : 'small'}
                        color={'grey'}
                    />
                </View>
            )
        } else {
            return (
                <View style={{height:20*factorVertical}}/>
            )
        }
    }


    renderFlatlist = () => {
        return (
            <FlatList
                data={this.props.items}
                extraData={this.props}
                style={{width: fullWidth}}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => this.showFooter()}
                onEndReached={() => this.props.fetchVideos()}
                renderItem={(row) => (
                <View key={row.index}
                    style={{
                        height: this.props.containerHeight,
                        width: this.props.containerWidth,
                        paddingLeft: 10*factorHorizontal,
                        flexDirection:'row',
                        borderTopColor: '#ececec',
                        borderTopWidth: 1.5,
                    }}
                >
                    <TouchableOpacity 
                        onPress={() => {
                            this.props.navigation.navigate('VIDEOPLAYER')
                        }}
                        style={{justifyContent: 'center'}}
                        underlayColor={'transparent'}    
                    >
                        <View
                            style={{
                                width: this.props.imageWidth,
                                height: this.props.imageHeight,
                                borderRadius: this.props.imageRadius,
                            }}
                        >
                            <View
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    width: this.props.imageWidth,
                                    height: this.props.imageHeight,
                                    borderRadius: this.props.imageRadius,
                                    top: 0,
                                    left: 0,
                                    zIndex: 4,
                                    opacity: 0.3,
                                    backgroundColor: (row.item.progress == 'check') ? 
                                        '#ff3333':'transparent',
                                }]}
                            >
                            </View>
                            <View
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    width: this.props.imageWidth,
                                    height: this.props.imageHeight,
                                    borderRadius: this.props.imageRadius,
                                    top: 0,
                                    left: 0,
                                    zIndex: 4,
                                }]}
                            >
                                {(row.item.progress == 'check') && (
                                <ApprovedTeacher
                                    height={50*factorRatio}
                                    width={50*factorRatio}
                                    fill={'white'}
                                />
                                )}
                                {(row.item.progress == 'progress') && (
                                <Progress
                                    height={37.5*factorRatio}
                                    width={37.5*factorRatio}
                                    fill={'white'}
                                />
                                )}
                            </View>
                            <FastImage
                                style={{
                                    flex: 1, 
                                    borderRadius: 10*factorRatio,
                                    backgroundColor: '#ececec',
                                    alignSelf: 'center',
                                }}
                                source={{uri: row.item.thumbnail}}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={{width: 10*factorHorizontal}}/>
                    <View style={{flex: 1.5, justifyContent: 'center'}}>
                        <Text
                            style={{
                                fontSize: 15*factorRatio,
                                textAlign: 'left',
                                fontWeight: 'bold',
                            }}
                        >
                            {row.item.title}
                        </Text>
                        <View style={{height: 2*factorVertical}}/>
                        <Text
                            numberOfLines={2}
                            style={{
                                fontSize: 12*factorRatio,
                                color: '#9b9b9b',
                                textAlign: 'left',
                                fontWeight: '500',
                            }}
                        >
                            2 mins
                            {/* {this.props.items[index].artist} */}
                        </Text>
                    </View>
                    <View style={{flex: 0.5}}>
                        <TouchableOpacity 
                            onPress={() => {}}
                            style={[styles.centerContent, {flex: 1}]}
                        >
                            <AntIcon
                                name={'plus'} 
                                size={30*factorRatio} 
                                color={'#c2c2c2'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                )}
            />
        )
    }


    renderMappedList = () => {
        return this.props.items.map((row, index) => {
            return (
                <View key={index}>
                    {(index > 0 || this.props.showNextVideo == false) && (
                    <View
                        style={{
                            height: this.props.containerHeight,
                            width: this.props.containerWidth,
                            borderTopWidth: this.props.containerBorderWidth,
                            paddingLeft: 10*factorHorizontal,
                            flexDirection:'row',
                            borderTopColor: '#ececec',
                        }}
                    >
                        <TouchableOpacity 
                            onPress={() => {
                                this.setState({
                                    showCourse: true,
                                })
                            }}
                            style={{justifyContent: 'center'}}
                            underlayColor={'transparent'}    
                        >
                            <View
                                style={{
                                    width: this.props.imageWidth,
                                    height: this.props.imageHeight,
                                    borderRadius: this.props.imageRadius,
                                }}
                            >
                                <View
                                    style={[
                                        styles.centerContent, {
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                        zIndex: 4,
                                        opacity: 0.3,
                                        top: 0,
                                        left: 0,
                                        position: 'absolute',
                                        backgroundColor: (row.progress == 'check' || 
                                            row.progress == 'progress') ? '#ff3333':'transparent',
                                    }]}
                                >
                                </View>
                                <View
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                        zIndex: 4,
                                        opacity: 1,
                                        backgroundColor: 'transparent',
                                    }]}
                                >
                                    {(row.progress == 'check' || row.progress == 'progress') && (
                                    <ApprovedTeacher
                                        height={50}
                                        width={50*factorRatio}
                                        fill={'white'}
                                    />
                                    )}
                                </View>
                                
                                {this.props.showLines && (
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        top: -3.5*factorVertical,
                                        height: 5*factorVertical,
                                        left: 0,
                                        zIndex: 9,
                                        width: '100%',
                                        position: 'absolute',
                                    }]}
                                >
                                    <View 
                                        style={{
                                            backgroundColor: 'red',
                                            width: '95%',
                                            height: '100%',
                                            borderRadius: 20,
                                        }}
                                    >
                                    </View>
                                </View>
                                )}
                                {this.props.showLines && (
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        top: -7.5*factorVertical,
                                        left: 0,
                                        width: '100%',
                                        height: 7.5*factorVertical,
                                        zIndex: 8,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            backgroundColor: 'pink',
                                            width: '90%',
                                            height: '100%',
                                            borderRadius: 20,
                                        }}
                                    />
                                </View>
                                )}
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        zIndex: 10, 
                                        borderRadius: this.props.imageRadius
                                    }}
                                    source={{uri: row.thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{width: 10*factorHorizontal}}/>
                        <View style={{flex: 1.5, justifyContent: 'center'}}>
                            <Text
                                style={{
                                    fontSize: 15*factorRatio,
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontFamily: 'Roboto',
                                }}
                            >
                                {row.title}
                            </Text>
                            <View style={{height: 2*factorVertical}}/>
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontSize: 12*factorRatio,
                                    color: '#9b9b9b',
                                    textAlign: 'left',
                                    fontWeight: '500',
                                    fontFamily: 'Roboto',
                                }}
                            >
                                2 mins
                                {/* {this.props.items[index].artist} */}
                            </Text>
                        </View>
                        <View style={{flex: 0.5}}>
                            {(this.props.showPlus == null) && (
                            <TouchableOpacity 
                                onPress={() => {}}
                                style={[styles.centerContent, {flex: 1}]}
                            >
                                <AntIcon
                                    name={'plus'} 
                                    size={30*factorRatio} 
                                    color={'#c2c2c2'}
                                />
                            </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    )}
                    {(index == 0 && this.props.showNextVideo == true) && (
                    <View
                        style={{
                            height: (this.props.showNextVideo && index == 0) ? this.props.containerHeight : 
                                this.props.containerHeight + 50*factorVertical,
                            width: this.props.containerWidth,
                            flexDirection:'row',
                            paddingLeft: 10*factorHorizontal,
                            backgroundColor: '#FFF1F2',
                        }}
                    >
                        <View 
                            style={{
                                position: 'absolute',
                                top: 22.5*factorVertical, 
                                left: 10*factorHorizontal,
                                width: fullWidth*0.5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12*factorRatio,
                                    fontWeight: '700',
                                }}
                                numberOfLines={1}
                            >
                                YOUR NEXT LESSONS
                            </Text>
                        </View>
                        <View 
                            style={{
                                position: 'absolute',
                                top: 25*factorVertical, 
                                right: 15*factorHorizontal,
                                width: fullWidth*0.2,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12*factorRatio,
                                    fontWeight: '300',
                                    color: 'red',
                                    textAlign: 'right',
                                }}
                                numberOfLines={1}
                            >
                                LESSON 7
                            </Text>
                        </View>              
                        <TouchableOpacity 
                            onPress={() => {}}
                            style={{justifyContent: 'center'}}
                            underlayColor={'transparent'}    
                        >
                            <View style={{flex: 2}}/>
                            <View
                                style={{
                                    width: this.props.imageWidth,
                                    height: this.props.imageHeight,
                                    borderRadius: this.props.imageRadius,
                                    borderColor: '#ececec',
                                    borderWidth: this.props.containerBorderWidth,
                                }}
                            >
                                <View
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                        zIndex: 4,
                                        opacity: 0.3,
                                        backgroundColor: (row.progress == 'check' || 
                                            row.progress == 'progress') ? '#ff3333':'transparent',
                                    }]}
                                >
                                </View>
                                <View
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                        zIndex: 4,
                                        opacity: 1,
                                        backgroundColor: 'transparent',
                                    }]}
                                >
                                    {(row.progress == 'check' || row.progress == 'progress') && (
                                    <ApprovedTeacher
                                        height={50}
                                        width={50*factorRatio}
                                        fill={'white'}
                                    />
                                    )}
                                </View>
                                <FastImage
                                    style={{flex: 1, borderRadius: this.props.imageRadius}}
                                    source={{uri: row.thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                            <View style={{flex: 1}}/>
                        </TouchableOpacity>
                        <View style={{width: 10*factorHorizontal}}/>
                        <View style={{flex: 1.5, justifyContent: 'center'}}>
                            <View style={{flex: 1.66}}/>
                            <View style={{flex: 1}}>
                                <Text
                                    style={{
                                        fontSize: 15*factorRatio,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {row.title}
                                </Text>
                                <View style={{height: 2*factorVertical}}/>
                                <Text
                                numberOfLines={2}
                                style={{
                                    fontSize: 12*factorRatio,
                                    color: '#9b9b9b',
                                    textAlign: 'left',
                                    fontWeight: '500',
                                }}
                            >
                                2 mins
                                {/* {this.props.items[index].artist} */}
                            </Text>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 0.5}}>
                            <View style={{flex: 1.66}}/>
                            <View style={{flex: 1}}>
                                {(this.props.showPlus == null) && (
                                <TouchableOpacity
                                    onPress={() => {}}
                                    style={[styles.centerContent, {flex: 1}]}
                                >
                                    <AntIcon
                                        name={'plus'} 
                                        size={30*factorRatio} 
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                )}
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                    )}
                </View>
            )
        })
    }

    
    render = () => {
        return (
            <View style={styles.container}>
                <View style={[styles.centerContent, {flex: 1}]}>
                    {
                        (this.props.renderType == 'FlatList') ? 
                        this.renderFlatlist() : this.renderMappedList()
                    }
                </View>
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
        )
    }
}

export default withNavigation(VerticalVideoList);