import React from 'react';
import { Text, TextInput, Button, View, Alert, Clipboard } from 'react-native';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import groupStyles from '../styles/groupStyles';
import loginregisterStyles from '../styles/loginregister';
import ValidationComponent from '../components/ValidationComponent';
import { postJoinGroup } from '../network/group';

export default class JoinGroupScreen extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = this.getClearedState();
    }

    updateState(obj, callback) {
        if (!this._ismounted) return;
        this.setState(obj, callback);
    }

    getClearedState() {
        return { invitecode: '' , paste:false};
    }

    async joinGroup() {
        this.updateState({paste: <Text></Text>})
        if (!this.validateForm()) return;

        let response = await postJoinGroup(this.state.invitecode, true);
        
        if (response !== false) {
            Alert.alert(
                'Group joined',
                'You succesfully joined ' + response.name + '.'
            );
            this.updateState(this.getClearedState());
            this.props.navigation.navigate('Group', { id: response.id });
        }
    }

    validateForm() {
        if (!this.validate({
            invitecode: { name: 'Invite code', required: true, invitecode: true },
        })) {
            return false;
        }
        return true;
    }

    async pasteFromClipboard() {
        const invitecode = await Clipboard.getString();
        if(invitecode.length < 100){
            this.updateState({ invitecode });
        }else{
            this.updateState({
                paste: <Text style={{...loginregisterStyles.inputError, marginBottom: 5, marginLeft: 3}}>Join group code is too long to paste</Text>
            })
        }
    }

    render() {
        return (
            <AuthenticatedComponent setMounted={val => { this._ismounted = val; }} navigate={this.props.navigation.navigate}>
                <View style={{ flex: 1, padding: 20 }} >
                    <Text style={{ marginBottom: 5 }}>Enter an invite code to join a group:</Text>
                    {this.isFieldInError('invitecode') && <Text style={{...loginregisterStyles.inputError, marginBottom: 5, marginLeft: 3}}>{this.getErrorsInField('invitecode')[0]}</Text>}
                    {this.state.paste}
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <TextInput
                            maxLength={100}
                            style={[groupStyles.inputField, {marginBottom: -10, marginTop: -2, marginRight: 10, flex: 1}]}
                            placeholder="Invite code"
                            value={this.state.invitecode}
                            onChangeText={invitecode => this.updateState({ invitecode })}
                        />
                        <Button
                            title="Paste"
                            onPress={() => this.pasteFromClipboard()}
                        />
                    </View>
                    <Button
                        title="Join group"
                        onPress={() => this.joinGroup()}
                    />
                </View>
            </AuthenticatedComponent>
        );
    }
}