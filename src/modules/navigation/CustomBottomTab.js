import React from 'react'
import { Keyboard } from 'react-native'
import { BottomTabBar } from "react-navigation"

export default class CustomBottomTab extends React.PureComponent {

    constructor(props) {
        super(props)

        this.keyboardWillShow = this.keyboardWillShow.bind(this)
        this.keyboardWillHide = this.keyboardWillHide.bind(this)

        this.state = {
            isVisible: true
        }
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove()
        this.keyboardWillHideSub.remove()
    }

    componentWillReceiveProps(props) {
        const newState = props.navigation.state
        const newRoute = newState.routes[newState.index]
        const newParams = newRoute.params

        let tabVisible = true

        if (newRoute.routes && newRoute.routes[newRoute.index].params && newRoute.routes[newRoute.index].params.tabVisible === false) {
            tabVisible = false
        }

        this.setState({ isVisible: tabVisible })
    }

    keyboardWillShow = event => {
        this.setState({
            isVisible: false
        })
    }

    keyboardWillHide = event => {
        this.setState({
            isVisible: true
        })
    }

    render() {
        return this.state.isVisible && <BottomTabBar {...this.props} />
    }
}