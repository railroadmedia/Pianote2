/**
 * Course
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import { getContent } from '@musora/services';
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class Course extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            showModalMenu: false, // show navigation menu
            showInfo: false,
            started: false, // if started lesson
            outVideos: false, // if no more videos
            page: 1, // page of content
            progress: 0.52,
        }
    }


    componentDidMount() {
        this.getContent()
    }


    async getContent() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand:'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['song'],
            });

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                if(i > 0) {
                    if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                        items.push({
                            title: newContent[i].getField('title'),
                            artist: newContent[i].getField('artist'),
                            thumbnail: newContent[i].getData('thumbnail_url'),
                            progress: (i < 7 && i > 1) ? 'check' : ((i == 7) ? 'progress':'none'),
                        })
                    }
                }
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
                outVideos: (items.length == 0) ? true : false
            })

            console.log(this.state.items, ' - results')
        }
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'container'}
                    style={{
                        height: fullHeight - navHeight, 
                        alignSelf: 'stretch',
                    }}
                >
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight,
                        alignSelf: 'stretch'
                    }}
                >
                    <View
                        style={{
                            height: fullHeight*0.1,
                            width: fullWidth,
                            position: 'absolute',
                            zIndex: 2, 
                            elevation: 2,
                            alignSelf: 'stretch', 
                        }}
                    >
                        <NavMenuHeaders
                            currentPage={'LESSONS'}
                        />
                    </View>
                    
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: colors.mainBackground,}}
                    >
                        <View key={'header'}
                            style={{
                                height: fullHeight*0.1,
                                backgroundColor: colors.thirdBackground,
                            }}
                        />
                        <View key={'backgroundColoring'}
                            style={{
                                backgroundColor: colors.thirdBackground,
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                                elevation: 10,
                            }}
                        >
                        </View>
                        <View style={{height: 20*factorVertical}}/>
                        <Text
                            style={{
                                paddingLeft: 12*factorHorizontal,
                                fontSize: 30*factorRatio,
                                color: 'white',
                                fontFamily: 'OpenSans-Regular',
                                fontWeight: (Platform.OS == 'ios') ? '900' : 'bold',
                            }}
                        >
                            Courses
                        </Text>
                        <View style={{height: 15*factorVertical}}/>
                        <View key={'continueCourses'}
                            style={{
                                minHeight: fullHeight*0.225,
                                paddingLeft: fullWidth*0.035,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'CONTINUE'}
                                Description={''}
                                seeAll={() => {
                                    this.props.navigation.navigate('SEEALL', {title: 'CONTINUE'})
                                }}
                                showArtist={true}
                                items={this.state.items}
                                forceSquareThumbs={false}
                                itemWidth={isNotch ? fullWidth*0.575 : (onTablet ? 
                                    fullWidth*0.425 : fullWidth*0.55)
                                }
                                itemHeight={isNotch ? fullHeight*0.15 : fullHeight*0.175}
                            />
                        </View>
                        <View key={'newCourses'}
                            style={{
                                minHeight: fullHeight*0.225,
                                paddingLeft: fullWidth*0.035,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'NEW COURSES'}
                                Description={''}
                                seeAll={() => {
                                    this.props.navigation.navigate('SEEALL', {title: 'CONTINUE'})
                                }}
                                showArtist={true}
                                items={this.state.items}
                                forceSquareThumbs={false}
                                itemWidth={isNotch ? fullWidth*0.6 : (onTablet ? 
                                    fullWidth*0.425 : fullWidth*0.55)
                                }
                                itemHeight={isNotch ? fullHeight*0.155 : fullHeight*0.175}
                            />
                        </View>
                        
                        <View style={{height: 15*factorVertical}}/>
                        <VerticalVideoList
                            title={'COURSES'}
                            outVideos={this.state.outVideos}
                            //getVideos={() => this.getContent()}
                            renderType={'Mapped'}
                            items={this.state.items}
                            showFilter={true}
                            imageRadius={5*factorRatio}
                            containerBorderWidth={0}
                            containerWidth={fullWidth}
                            containerHeight={(onTablet) ? fullHeight*0.15 : (
                                Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.0925
                            }
                            imageHeight={(onTablet) ? fullHeight*0.12 : (
                                Platform.OS == 'android') ? fullHeight*0.085 :fullHeight*0.065
                            }
                            imageWidth={fullWidth*0.26}
                        />                    
                    </ScrollView>
                </View>                
                <Modal key={'restartCourse'}
                        isVisible={this.state.showRestartCourse}
                        style={[
                            styles.centerContent, {
                            height: fullHeight,
                            width: fullWidth,
                            elevation: 5,
                            margin: 0,
                        }]}
                        animation={'slideInUp'}
                        animationInTiming={350}
                        animationOutTiming={350}
                        coverScreen={false}
                        hasBackdrop={false}
                    >
                        <RestartCourse
                            hideRestartCourse={() => {
                                this.setState({
                                    showRestartCourse: false
                                })
                            }}
                        />
                    </Modal>
                </View>
            </View>
        )
    }
}