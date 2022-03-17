import React from 'react';

import { 
        View, 
        Text,
        TextInput,
        StyleSheet,
        Slider,
        Alert,
        TouchableOpacity } from 'react-native';

export default class FilterView extends React.Component {
    state = {
      minRangeVal: this.props.initialFilterParam.minDistance,
      maxRangeVal: this.props.initialFilterParam.maxDistance,
      lowLimit: 0, //this.props.initialFilterParam.lowLimit,
      highLimit: 100, // this.props.initialFilterParam.highLimit,
      strFilterName: this.props.initialFilterParam.queryString,
      aryCategory: this.props.initialFilterParam.aryCategory,
      categories: this.props.initialFilterParam.categories,
      showCategorySection: true,
    }

    constructor (props) {
      super(props);
    }

    _showConfirmCloseDialog() {
      Alert.alert(
        //title
        '',
        //body
        'Do you want to close this filter?',
        [
          {text: 'Yes', onPress: () => this._handleTapOutsideRegion() },
          {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
        ],
        { cancelable: false }
      );
    }

    _closeFilterPressed() {
      if ((this.state.categories.length !== 0) || (this.state.strFilterName !== '')) {
        this._showConfirmCloseDialog();
      }
      else {
        this._handleTapOutsideRegion();
      }
    }

    _handleChangeText = (text) => {
      if (this.props.onChangeText) {
        this.props.onChangeText(text);
      }

      this.setState({strFilterName: text});
      this._handleFilterValueChange(text);
    }

    _handleTouchEnd = () => {      
      this._handleFilterValueChange();
    }

    _handleTapOutsideRegion() {
      if (this.props.onTapOutSide) {
        this.props.onTapOutSide();
      }
    }

    _handleFilterValueChange(newText = null) {
      const filterData = {
        queryString: (newText === null) ? this.state.strFilterName : newText,
        minDistance: this.state.minRangeVal,
        maxDistance: this.state.maxRangeVal,
        lowLimit: this.state.lowLimit,
        highLimit: this.state.highLimit,
        aryCategory: this.state.aryCategory,
        categories: this.state.categories,
      };
      
      if (this.props.onValueChange) {
        this.props.onValueChange(filterData)
      }
    }

    _clearFilterData() {
      this.refs.textInput.setNativeProps({text: ''});

      if (this.props.hideCategorySection) {
        // this.setState({
        //   minRangeVal:  this.state.lowLimit,
        //   maxRangeVal:  this.state.highLimit,
        // });  
      }
      else {
        this.setState({
          // minRangeVal:  this.state.lowLimit,
          // maxRangeVal:  this.state.highLimit,
          categories:  []
        });
      }
      
      if (this.props.onValueChange) {
        const filterData = {
          queryString: "",
          minDistance:  this.state.minRangeVal,
          maxDistance: this.state.maxRangeVal,
          lowLimit: this.state.lowLimit,
          highLimit: this.state.highLimit,
        };

        if (!this.props.hideCategorySection) {
          filterData.aryCategory = this.state.aryCategory;
          filterData.categories = [];
        }

        this.props.onValueChange(filterData)
      }
    }

    _categoryClicked(categoryIndex) {
      let newCatgories = this.state.categories;
      let indexOfItem = newCatgories.indexOf(this.state.aryCategory[categoryIndex]);
      if (indexOfItem !== -1) {
        newCatgories.splice(indexOfItem, 1);
      }
      else {
        newCatgories.push(this.state.aryCategory[categoryIndex]);
      }
      newCatgories.sort();
      this.setState({categories: newCatgories}, () => { this._handleFilterValueChange() });
    }

    _renderCategoryRows() {
      const categoryRowViews = [];      
      for (let i=0; i<this.state.aryCategory.length; i++) {
        categoryRowViews.push(
          <TouchableOpacity
            key={'category' + i}
            onPress={() => this._categoryClicked(i) }
          >
            <View style={{flexDirection: 'row', width: '100%', paddingVertical: 5}}>                      
              <View style={[
                  {width: 10, height: 10, marginLeft: 5, borderColor: '#A2A2A4', borderWidth: 1, alignSelf: 'flex-end', marginBottom: 3},
                  (this.state.categories.includes(this.state.aryCategory[i])) ? {backgroundColor: '#000000AA'} : {}
                ]}>
              </View>
              <Text style = {{fontSize: 13, color: '#5E5E5E', marginLeft: 13, alignContent: 'center', textAlign: 'left', flex: 1}}>
                {this.state.aryCategory[i]}
              </Text>
            </View>
          </TouchableOpacity>
        );        
      }

      return categoryRowViews;
    }

    _sliderValuechange(value) {
      this.setState({maxRangeVal: parseInt(value)});
    }

    _sliderValuechanged(value) {
      this.setState({maxRangeVal: parseInt(value)}, () => { this._handleFilterValueChange() });
    }

    render () {
      return(
        <View 
            style={[StyleSheet.absoluteFill, {backgroundColor: '#00000000'}]}>
            <TouchableOpacity
              style={{position: 'absolute', width: '100%', height: '100%'}}
              onPress={() => {
                this._handleTapOutsideRegion()
              }}
            >
            </TouchableOpacity>
            <View style={[((this.props.styles !== undefined) && (this.props.styles.positionOffset !== undefined)) ? this.props.styles.positionOffset : {right: 0, top: 70}, {position: 'absolute', backgroundColor: '#FFFFFF', borderWidth: 1, borderRadius: 8, borderColor: '#E8E9E97A', width: 250}]}>
              <View style={{paddingLeft: 22, paddingRight: 16, paddingBottom: 30}}>
                <View style={{width: '100%', height: 39, paddingBottom: 6, flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 13, fontWeight: '600', color: '#5E5E5E', flex: 1}}> Filter by name </Text>
                  <TouchableOpacity
                    style={{paddingHorizontal: 8, paddingTop: 10}}
                    onPress={() => this._clearFilterData() }
                  >
                    <Text style={{fontSize: 13, color: '#5E5E5E'}}> Clear </Text>
                  </TouchableOpacity>
                </View>

                <TextInput 
                  ref="textInput"
                  placeholder={this.props.placeholder}
                  style={{width: '100%', height: 38, paddingVertical: 2, backgroundColor: '#E8E9E97A', borderRadius: 4}}
                  onChangeText={this._handleChangeText}
                  value={this.state.strFilterName}
                />

                {(!this.props.hideCategorySection) && (
                  <View>
                    <Text style={{fontSize: 13, fontWeight: '600', marginTop: 18, color: '#5E5E5E', flex: 1}}> Categories </Text>
                    {this._renderCategoryRows()}                    
                  </View>
                )}

                {(!this.props.hideSlider) && (
                  <View>
                    <Text style={{fontSize: 13, fontWeight: '600', marginTop: 18, color: '#5E5E5E', flex: 1}}> Distance </Text>
                    <View style={{width: '100%', marginTop: 5}}>
                      <Slider
                        ref='distanceSlider'
                        style={{width: '100%', height: 40}}
                        step={ 1 }
                        minimumValue={ 0 }
                        maximumValue={ this.state.highLimit }
                        minimumTrackTintColor="#A2A2A418"
                        maximumTrackTintColor="#0193DD"                        
                        onValueChange={this._sliderValuechange.bind(this)}                        
                        onSlidingComplete={this._sliderValuechanged.bind(this)}
                        value={this.state.maxRangeVal}
                      />
                      
                    </View>
                    <Text style={{fontSize: 12, marginTop: 4, color: '#5E5E5E', flex: 1}}> {'' + this.state.minRangeVal + '~' + this.state.maxRangeVal} miles </Text>
                  </View>
                )}
                <View style={{width: '100%', marginTop: 10, alignItems: 'center'}}>                  
                  <TouchableOpacity
                    style={{paddingHorizontal: 8, paddingTop: 10}}
                    onPress={() => this._closeFilterPressed() }
                  >
                    <Text style={{fontSize: 13, color: '#5E5E5E'}}> Close </Text>
                  </TouchableOpacity>
                </View>
              </View>
          </View>          
        </View>        
      );
    }
}