import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.pagesNo = Math.ceil(this.props.length / 10);
    this.state = { active: props.active || 1, showPagePicker: false };
  }

  get pages() {
    let { active } = this.state;
    let pages = Array.from({ length: this.pagesNo }, (_, i) => i + 1);
    if (active < 2) active = 2;
    if (active < this.pagesNo - 2)
      pages.splice(active + 1, pages.length - active - 2, '...');
    if (active > 3) pages.splice(1, active - 3, '...');
    pages.unshift('<');
    pages.push('>');
    return pages;
  }

  changePage = page => {
    if (page < 1 || page > this.pagesNo) return;
    this.setState(({ active }) => {
      let origActive = active;
      if (page === '<') {
        if (active > 1) --active;
      } else if (page === '>') {
        if (active < this.pagesNo) ++active;
      } else active = page;
      if (origActive !== active) {
        this.props.onChangePage(active);
        return { active };
      }
    });
  };

  togglePagePicker = () => {
    delete this.pagePickerText;
    this.setState(({ showPagePicker }) => ({
      showPagePicker: !showPagePicker
    }));
  };

  render() {
    let { active, showPagePicker } = this.state;
    let { appColor, isDark } = this.props;
    return (
      <View style={styles.container}>
        {this.pages.map((p, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => this.changePage(p)}
            onLongPress={this.togglePagePicker}
            disabled={p === '...'}
            style={{ padding: 7 }}
          >
            <Text
              style={{
                color: active === p ? appColor : isDark ? '#445F74' : 'black',
                fontWeight: active === p ? '700' : '400'
              }}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
        <Modal
          animationType={'slide'}
          onRequestClose={this.togglePagePicker}
          supportedOrientations={['portrait', 'landscape']}
          transparent={true}
          visible={showPagePicker}
        >
          <TouchableOpacity
            onPress={this.togglePagePicker}
            style={styles.pagePickerContainer}
          >
            <View>
              <TextInput
                autoFocus={true}
                style={styles.textInput}
                onChangeText={page => (this.pagePickerText = page)}
                placeholder='Type the page number...'
                placeholderTextColor={'grey'}
                keyboardType={'number-pad'}
                returnKeyType={'go'}
                keyboardAppearance={isDark ? 'dark' : 'light'}
              />
              <TouchableOpacity
                onPress={() => {
                  if (this.pagePickerText)
                    this.changePage(parseInt(this.pagePickerText));
                  this.togglePagePicker();
                }}
                style={{ backgroundColor: appColor, padding: 20 }}
              >
                <Text style={styles.goText}>GO</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
let styles = new StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'center'
  },
  pagePickerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    alignItems: 'center'
  },
  textInput: {
    marginTop: '5%',
    backgroundColor: 'white',
    padding: 20,
    minWidth: '30%',
    textAlign: 'center'
  },
  goText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'OpenSans-Bold'
  }
});
