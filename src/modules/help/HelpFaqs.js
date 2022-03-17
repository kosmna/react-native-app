import React from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Faq from './Faq'
import { Text } from '../../components/StyledText'


FaqContainerView = ({ item }) => {
    return_data = []
    return_data = item.array_of_question_answer_dict.map((i, index) => {
        return (
            <Faq
                key={i.sequence}
                question={i.question}
                answer={i.answer}
            />
        )
    })
    return return_data
}

class CustomComponentFAQ extends React.Component {

    state = {
        should_heading_expand: false
    }

    componentWillReceiveProps() {
        this.props.navigation.setParams({ otherParam: 'Updated!' })
    }

    render() {
        return (
            <SafeAreaView>
                <TouchableOpacity
                    style={{ backgroundColor: 'white', marginHorizontal: wp(2), height: hp(4), flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(1) }}
                    onPress={() => {
                        this.setState({ should_heading_expand: !this.state.should_heading_expand })
                    }}>
                    <Text style={{ fontSize: wp(4), color: '#515151', fontWeight: 'bold', marginLeft: wp(2), marginTop: wp(2) }}>
                        {this.props.item.category_title}
                    </Text>
                    <Image
                        source={this.state.should_heading_expand ? require('../../../assets/images/help/up_arrow.png') : require('../../../assets/images/help/down_arrow.png')}
                        style={{ width: wp(3.5), height: wp(3.5), marginRight: wp(2.5) }}
                    />
                </TouchableOpacity>

                {this.state.should_heading_expand && (
                    <FaqContainerView
                        key={this.props.item.sequence}
                        item={this.props.item}
                    />
                )}
            </SafeAreaView>
        )
    }
}


export default class HelpFaqs extends React.Component {
    constructor(props) {
        super(props)
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'FAQs'),
        }
    };

    componentWillReceiveProps(nextProps) {
        const title = nextProps.title ? nextProps.title : 'Default Title'
        this.props.navigation.setParams({ title })
        this.setState({ title: title })
    }




    state = {
        heading_record_array: this.props.navigation.state.params.heading_record_array,
        title: this.props.navigation.state.params.title,
    }

    render() {
        const { navigation } = this.props
        const title = navigation.getParam('title', 'some default value')

        return (
            <ScrollView style={{ flex: 1, paddingVertical: hp(1) }}>
                {this.state.heading_record_array.map((item, index) => {
                    return (
                        <CustomComponentFAQ key={item.heading_category_id} item={item} />
                    )
                })}
            </ScrollView>
        )
    }
}