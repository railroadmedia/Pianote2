/**
 * MyList
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class MyList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModalMenu: false,
            outVideos: false, // if no more videos to load
            items: [], // videos loaded
            page: 0, // current page
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
            
            if(response.data.data.length == 0) {
                this.setState({outVideos: true})
            }

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('artist'),
                        thumbnail: newContent[i].getData('thumbnail_url'),
                    })
                }
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
            })

        }
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625 - navHeight,
                        alignSelf: 'stretch'
                    }}
                >
                    <NavMenuHeaders
                        currentPage={'MYLIST'}
                    />
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
                            My List
                        </Text>
                        <View style={{height: 30*factorVertical}}/>
                        <TouchableOpacity
                            style={{
                                height: fullHeight*0.075,
                                width: fullWidth,
                                borderTopWidth: 0.25*factorRatio,
                                borderTopColor: colors.secondBackground,
                                borderBottomWidth: 0.25*factorRatio,
                                borderBottomColor: colors.secondBackground,
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        paddingLeft: 12*factorHorizontal,
                                        fontSize: 18*factorRatio,
                                        marginBottom: 5*factorVertical,
                                        textAlign: 'left', 
                                        fontWeight: (Platform.OS == 'ios') ? '900' : 'bold', 
                                        fontFamily: 'OpenSans-Regular',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    In Progress
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{flex: 1}}/>
                            <View
                                style={{
                                    paddingRight: 12*factorHorizontal,
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <EntypoIcon
                                    name={'chevron-thin-right'}
                                    size={22.5*factorRatio}
                                    color={colors.secondBackground}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                height: fullHeight*0.075,
                                width: fullWidth,
                                borderBottomWidth: 0.25*factorRatio,
                                borderBottomColor: colors.secondBackground,
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        paddingLeft: 12*factorHorizontal,
                                        fontSize: 18*factorRatio,
                                        marginBottom: 5*factorVertical,
                                        textAlign: 'left', 
                                        fontWeight: (Platform.OS == 'ios') ? '900' : 'bold', 
                                        fontFamily: 'OpenSans-Regular',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Completed
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{flex: 1}}/>
                            <View style={{paddingRight: 12*factorHorizontal}}>
                                <View style={{flex: 1}}/>
                                <EntypoIcon
                                    name={'chevron-thin-right'}
                                    size={22.5*factorRatio}
                                    color={colors.secondBackground}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                        </TouchableOpacity>
                        <View style={{height: 15*factorVertical}}/>
                        <VerticalVideoList
                            title={'ADDED TO MY LIST'}
                            outVideos={this.state.outVideos}
                            //getVideos={() => this.getContent()}
                            renderType={'Mapped'}
                            items={this.state.items}
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
                <NavigationBar
                    currentPage={'MyList'}
                />
                <Modal key={'navMenu'}
                    isVisible={this.state.showModalMenu}
                    style={{
                        margin: 0, 
                        height: fullHeight,
                        width: fullWidth,
                    }}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={false}
                >
                    <NavigationMenu
                        onClose={(e) => this.setState({showModalMenu: e})}
                        menu={this.state.menu}
                        parentPage={this.state.parentPage}
                    />
                </Modal>
            </View>
        )
    }
}