/**
 * AddToCalendar
 */
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

class AddToCalendar extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      password: ''
    };
  }

  render = () => {
    return (
      <View
        key={'container'}
        style={{
          height: fullHeight,
          width: fullWidth,
          backgroundColor: 'transparent'
        }}
      >
        <View
          key={'buffTop'}
          style={{
            height: '29%',
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.hideAddToCalendar()}
            style={{
              height: '100%',
              width: '100%'
            }}
          />
        </View>
        <View
          key={'content'}
          style={{
            height: '42%',
            width: '100%',
            flexDirection: 'row'
          }}
        >
          <View key={'buffLeft'} style={{ width: '7%' }}>
            <TouchableOpacity
              onPress={() => this.props.hideAddToCalendar()}
              style={{
                height: '100%',
                width: '100%'
              }}
            />
          </View>
          <View
            key={'content'}
            style={{
              height: '100%',
              width: '86%',
              backgroundColor: '#f7f7f7',
              paddingLeft: fullWidth * 0.05,
              paddingRight: fullWidth * 0.05,
              borderRadius: 15 * factorRatio
            }}
          >
            <View style={{ flex: 0.13 }} />
            <Text
              key={'emailTaken'}
              style={{
                fontFamily: 'OpenSans-Bold',
                fontSize: 21 * factorRatio,
                textAlign: 'center'
              }}
            >
              ADD TO CALENDAR
            </Text>
            <View style={{ flex: 0.075 }} />
            <View key={'enterPassword'}>
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 15 * factorRatio,
                  fontWeight: '300',
                  textAlign: 'center'
                }}
              >
                Add this lesson to your calendar to be notified when it's available
              </Text>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ flex: 0.075 }} />
            <View key={'buttons'} style={{ flex: 0.8 }}>
              <View style={{ height: '100%' }}>
                <View
                  key={'passwords'}
                  style={styles.centerContent}
                >
                    <FontIcon
                        size={60 * factorRatio}
                        name={'calendar-plus'}
                        color={colors.pianoteRed}
                        style={{ padding: 10 }}
                    />
                </View>
                <View style={{height: 5}}/>
                <View
                  style={[
                    styles.centerContent,
                    {
                      height: '30%'
                    }
                  ]}
                >
                  <View
                    style={{
                      height: '80%',
                      width: '90%',
                      borderRadius: 100 * factorRatio,
                      backgroundColor: '#fb1b2f'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.props.addEventToCalendar()
                      }}
                      style={{
                        height: '100%',
                        width: '100%'
                      }}
                    >
                      <View style={{ flex: 1 }} />
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          fontSize: 15 * factorRatio,
                          fontWeight: '700',
                          textAlign: 'center',
                          color: 'white'
                        }}
                      >
                        CONFIRM ADDITION
                      </Text>
                      <View style={{ flex: 1 }} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  onPress={() => {
                    this.props.hideAddToCalendar();
                  }}
                  style={[
                    styles.centerContent,
                    {
                      height: '35%',
                      width: '100%'
                    }
                  ]}
                >
                </View>
              </View>
            </View>
          </View>
          <View key={'buffRight'} style={{ width: '7%' }}>
            <TouchableOpacity
              onPress={() => this.props.hideAddToCalendar()}
              style={{
                height: '100%',
                width: '100%'
              }}
            />
          </View>
        </View>
        <View key={'buffBottom'} style={{ height: '29%' }}>
          <TouchableOpacity
            onPress={() => this.props.hideAddToCalendar()}
            style={{
              height: '100%',
              width: '100%'
            }}
          />
        </View>
      </View>
    );
  };
}

export default withNavigation(AddToCalendar);
