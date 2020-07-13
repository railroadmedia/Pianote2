/**
 * MyList
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class MyList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModalMenu: false,
            outVideos: false, // if no more videos to load
            items: [], // videos loaded
            page: 0, // current page
            filters: null,
            filtering: true,
        }
    }


    componentDidMount = async () => {
        await this.setState({filtering: true})
        await this.getContent()
        await this.setState({filtering: false})
    }


    getContent = async () => {
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
                        artist: newContent[i].getField('instructor').fields[0].value,
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        type: newContent[i].post.type,
                        description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                        xp: newContent[i].getField('xp'),
                        id: newContent[i].id,
                        likeCount: newContent[i].likeCount,
                    })
                }
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
            })

        }
    }


    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'LESSONS',
            onGoBack: (filters) => {
                this.setState({
                    items: [],
                    filters: (
                        filters.instructors.length == 0 && 
                        filters.level.length == 0 && 
                        filters.progress.length == 0 && 
                        filters.topics.length == 0
                    ) ? null : filters, 
                }),
                this.getContent(),
                this.forceUpdate()
            }
        })
    }


    removeFromMyList = async (contentID) => {
        for(i in this.state.items) {
            // remove if ID matches
            if(this.state.items[i].id == contentID) {
                this.state.items.splice(i, 1);
            }
        }
        await this.setState({items: this.state.items})
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
                            currentPage={'MYLIST'}
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
                            My List
                        </Text>
                        <View style={{height: 30*factorVertical}}/>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('SEEALL', {title: 'In Progress'})
                            }}
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
                                        fontSize: 20*factorRatio,
                                        marginBottom: 5*factorVertical,
                                        textAlign: 'left', 
                                        fontWeight: (Platform.OS == 'ios') ? '900' : 'bold', 
                                        fontFamily: 'RobotoCondensed-Bold',
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
                            onPress={() => {
                                this.props.navigation.navigate('SEEALL', {title: 'Completed'})
                            }}
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
                                        fontSize: 20*factorRatio,
                                        marginBottom: 5*factorVertical,
                                        textAlign: 'left', 
                                        fontWeight: (Platform.OS == 'ios') ? '900' : 'bold', 
                                        fontFamily: 'RobotoCondensed-Bold',
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
                        {!this.state.filtering && (
                        <VerticalVideoList
                            items={this.state.items}
                            title={'ADDED TO MY LIST'}
                            renderType={'Mapped'}
                            type={'MYLIST'} // the type of content on page
                            showFilter={true} // shows filters button
                            showType={false} // show course / song by artist name
                            showArtist={false} // show artist name
                            showLength={true} // duration of song
                            showSort={false}
                            filters={this.state.filters} // show filter list
                            filterResults={() => this.filterResults()} // apply from filters page
                            outVideos={this.state.outVideos}
                            removeItem={(contentID) => {
                                this.removeFromMyList(contentID)
                            }}
                            imageRadius={5*factorRatio} // radius of image shown
                            containerBorderWidth={0} // border of box
                            containerWidth={fullWidth} // width of list
                            containerHeight={(onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.095} // height per row
                            imageHeight={(onTablet) ? fullHeight*0.12 : (Platform.OS == 'android') ? fullHeight*0.095 : fullHeight*0.075} // image height
                            imageWidth={fullWidth*0.26} // image width
                        />
                        )}
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