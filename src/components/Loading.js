import React from 'react'
import { ActivityIndicator, SafeAreaView } from 'react-native'

export default class Loading extends React.Component {

    // Insert the loading component under the outermost container of screen
    render() {
        return (
            <SafeAreaView style={{ display: 'flex', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(6, 86, 110, 0.1)', zIndex: 999 }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        )
    }

}
