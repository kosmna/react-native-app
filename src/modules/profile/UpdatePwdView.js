import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Keyboard,
  Platform,
  LayoutAnimation,
  TouchableOpacity,
  Image,
} from 'react-native';

import { fonts } from '../../styles';
import { TextInput, Button } from '../../components';
import Toast from 'react-native-simple-toast';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChangePassword } from '../backend/authentication';

export default class UpdatePwdScreen extends React.Component {
    static navigationOptions = {
        title: 'Update Password'
    };

    state = {
        isKeyboardVisible: false,
        currentPwd: '',
        newPwd: '',
        confPwd: ''
    };

    _changePassword() {
        ChangePassword(this.props.userInfo.partner_referral_code, this.props.userInfo.partner_email, this.state.currentPwd, this.state.newPwd).then(result => {
            if (result === null) {
                Toast.show('Password update failed');
            }
            else if (result.success) {
                Toast.show('Password updated successfully');
                var userInfo = this.props.userInfo;
                userInfo.partner_password = this.state.newPwd;
                this.setState({currentPwd: '', newPwd: '', confPwd: ''});
                this.props.ProfileUpdate(userInfo);
            }
            else {
                Toast.show('Password update failed');
            }
        }) 
    }

    onChangePwd() {        
        if (this.props.userInfo == null) {
            console.log('Please login first');
            return;
        }

        if (this.state.currentPwd == '') {
            Toast.show('Please enter current password');
            return;
        }

        if (this.state.newPwd == '') {
            Toast.show('Please enter new password');
            return;
        }

        if ((this.state.confPwd != this.state.newPwd)) {
            Toast.show('Please confirm password');
            return
        }
        
        console.log('curAAAPWD = ', this.props.userInfo.partner_password);
        if ((this.props.userInfo.partner_password != this.state.currentPwd)) {
            Toast.show('current password doesn\'t match');
            return
        }

        this._changePassword();
    }

    render() {
        return(
            <View style={[{ flexDirection: 'column', paddingLeft: 20, paddingRight: 20, marginTop: 30, width: '100%' }]}>
                <TextInput
                        placeholder="Current Password"
                        placeholderTextColor="#949494"
                        secureTextEntry
                        style={[styles.textInput, {}]}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(currentPwd) => this.setState({currentPwd})}
                        value={this.state.currentPwd}
                        />

                    <TextInput
                        placeholder="New Password"
                        placeholderTextColor="#949494"
                        secureTextEntry
                        style={[styles.textInput, {}]}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(newPwd) => this.setState({newPwd})}
                        value={this.state.newPwd}
                        />

                    <TextInput
                        placeholder="Confirm New Password"
                        placeholderTextColor="#949494"
                        secureTextEntry
                        style={[styles.textInput, {}]}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={(confPwd) => this.setState({confPwd})}
                        value={this.state.confPwd}
                        />

                    <View style={{marginTop: 43, height: 58, width: '100%'}}>
                        <Button
                            bgColor="#0093dd"
                            textColor="#FFFFFF"
                            secondary
                            rounded
                            style={{ alignSelf: 'stretch', marginBottom: 10, width: '100%' }}
                            caption={ 'Update Password' }
                            onPress={() => this.onChangePwd()
                            }
                        />
                    </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({    
  textInput: {
    alignSelf: 'stretch',
    marginTop: 30,
    borderBottomColor: "#707070", 
    borderBottomWidth: 1, 
    color: '#000000'
  },  
});
