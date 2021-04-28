/* 
Required fields:
    * appColor
    * id (message/post id)
    * onEdit
    * onDelete
*/
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-navigation';

import {
  NetworkContext,
  reportMessage,
  deleteMessage
} from '../services/forum.service';

import { moderate, info } from '../assets/svgs';

export default class Moderate extends React.Component {
  state = { optionsVisible: false, deleteVisible: false, reportVisible: false };

  constructor(props) {
    super(props);
    Moderate.contextType = NetworkContext;
  }

  get connection() {
    if (this.context.isConnected) return true;
    this.context.showNoConnectionAlert();
  }

  onReport = () =>
    this.close(() => {
      if (!this.connection) return;
      reportMessage(this.props.id);
      this.setState({ optionsVisible: true, reportVisible: true }, () =>
        setTimeout(this.close, 2000)
      );
    });

  onDelete = () =>
    this.close(() => {
      if (!this.connection) return;
      deleteMessage(this.props.id);
      this.setState({ optionsVisible: true, deleteVisible: true });
    });

  onEdit = () => {
    this.close();
    if (!this.connection) return;
    this.props.onEdit();
  };

  delete = () => {
    this.close();
    if (!this.connection) return;
    this.props.onDelete();
  };

  open = () => {
    if (!this.connection) return;
    this.setState({ optionsVisible: true });
  };

  close = callback =>
    this.setState(
      { optionsVisible: false, deleteVisible: false, reportVisible: false },
      callback
    );

  render() {
    let { optionsVisible, deleteVisible, reportVisible } = this.state;
    let { appColor } = this.props;
    return (
      <>
        <TouchableOpacity style={{ padding: 10 }} onPress={this.open}>
          {moderate({ width: 15, fill: appColor })}
        </TouchableOpacity>
        <Modal
          animationType={'slide'}
          onRequestClose={() => this.close()}
          supportedOrientations={['portrait', 'landscape']}
          transparent={true}
          visible={optionsVisible}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.optionsContainer}
            onPress={() => this.close()}
          >
            {reportVisible ? (
              <SafeAreaView
                style={styles.reportContainer}
                forceInset={{ top: 'never', bottom: 'always' }}
              >
                {info({ width: 20, height: 20, fill: '#0BBE76' })}
                <Text style={styles.reportText}>
                  This post has been reported{`\n`}
                  <Text style={{ fontFamily: 'OpenSans' }}>
                    Our team is currently looking into this issue
                  </Text>
                </Text>
              </SafeAreaView>
            ) : (
              <SafeAreaView
                style={styles.options}
                forceInset={{ top: 'never', bottom: 'always' }}
              >
                <View style={styles.pill} />
                {deleteVisible ? (
                  <>
                    <Text style={styles.confirmDeleteText}>
                      Are you sure you want to delete this post?
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.confirmationBtn,
                        { backgroundColor: appColor }
                      ]}
                      onPress={this.delete}
                    >
                      <Text style={styles.confirmationBtnText}>CONFIRM</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  ['Report', 'Delete', 'Edit'].map(o => (
                    <TouchableOpacity key={o} onPress={this[`on${o}`]}>
                      <Text style={styles.optionText}>{o}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </SafeAreaView>
            )}
          </TouchableOpacity>
        </Modal>
      </>
    );
  }
}
let styles = StyleSheet.create({
  optionsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  options: {
    backgroundColor: '#081825',
    padding: 20,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20
  },
  pill: {
    width: '20%',
    height: 2,
    backgroundColor: 'white',
    borderRadius: 1,
    alignSelf: 'center'
  },
  optionText: {
    paddingVertical: 10,
    color: 'white',
    fontFamily: 'OpenSans'
  },
  confirmDeleteText: {
    paddingVertical: 20,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans'
  },
  confirmationBtn: {
    alignSelf: 'center',
    padding: 10,
    paddingHorizontal: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmationBtnText: {
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold'
  },
  reportContainer: {
    borderColor: '#0BBE76',
    borderTopWidth: 5,
    padding: 20,
    flexDirection: 'row',
    backgroundColor: '#081825'
  },
  reportText: {
    paddingLeft: 20,
    fontFamily: 'OpenSans-Bold',
    color: 'white'
  }
});
