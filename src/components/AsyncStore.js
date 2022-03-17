import React, { Component } from 'react';
import {  
  AsyncStorage
} from 'react-native';

export const SaveValueWithKey = async (key, val) => {
  try {
    await AsyncStorage.setItem('@BookNGoGoStore:' + key, val);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export const GetValueForKey = async (key) => {
  let savedValue = null;
  try {
    savedValue = await AsyncStorage.getItem('@BookNGoGoStore:' + key) || 'none';
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return savedValue;
}

export const SaveObjectWithKey = async (key, obj) => {
  try {
    await AsyncStorage.setItem('@BookNGoGoStore:' + key, JSON.stringify(obj));
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export const GetObjectForKey = async (key) => {
  try {
    let objString = await AsyncStorage.getItem('@BookNGoGoStore:' + key) || 'none';
    return JSON.parse(objString);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return null;
}

