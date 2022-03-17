

import axios from 'axios';
import queryString from 'query-string';
import {  MiniSiteAuthentication, 
          Header,
          GetBngMerchantDetailsEndpoint, 
          GetBngMerchantDealsEndPoint, 
          GetBngMerchantRoomListEndPoint,
          GetBngMerchantHomeLinksEndPoint,
        } from './constants';

export function GetBngMerchantDetails(serviceType, merchant) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ "Authorization": MiniSiteAuthentication, 
          "service_type": serviceType, "prop_id": merchant.tpartner_code });
      
      let result = null;
      axios.post(merchant.tpartner_home_link+GetBngMerchantDetailsEndpoint, queryString.stringify(
        {    
          "data": data
        }), {
          headers: Header
      })
      .then(response => {
        if("data" in response)
        {
          const obj = response.data;
          result = obj;
          resolve(result);
        }
        else
        {
          
          reject('Error');
        }
      })
      .catch((error) => {
        console.log(error);
        
        reject('Error')
      })
      .then(() => {
        
      });  
    });
}

export function GetBngMerchantDeals(serviceType, merchant) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ "Authorization": MiniSiteAuthentication, 
          "service_type": serviceType, "prop_id": merchant.tpartner_code });
      
      let result = null;
      axios.post(merchant.tpartner_home_link+GetBngMerchantDealsEndPoint, queryString.stringify(
        {    
          "data": data
        }), {
          headers: Header
      })
      .then(response => {
        if("data" in response)
        {
          const obj = response.data;
          result = obj;
          resolve(result);
        }
        else
        {
          
          reject('Error');
        }
      })
      .catch((error) => {
        console.log(error);
        
        reject('Error')
      })
      .then(() => {
        
      });  
    });
}

export function GetBngMerchantRoomList(merchant) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": MiniSiteAuthentication, 
        "prop_id": merchant.tpartner_code });
    
    let result = null;
    axios.post(merchant.tpartner_home_link+GetBngMerchantRoomListEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      if("data" in response)
      {
        const obj = response.data;
        result = obj;
        resolve(result);
      }
      else
      {
        
        reject('Error');
      }
    })
    .catch((error) => {
      console.log(error);
      
      reject('Error')
    })
    .then(() => {
      
    });  
  });
}

export function GetBngMerchantHomeLinks(merchant) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": MiniSiteAuthentication, 
        "prop_id": merchant.tpartner_code });
    
    let result = null;
    axios.post(merchant.tpartner_home_link+GetBngMerchantHomeLinksEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      if("data" in response)
      {
        const obj = response.data;
        result = obj;
        resolve(result);
      }
      else
      {
        
        reject('Error');
      }
    })
    .catch((error) => {
      console.log(error);
      
      reject('Error')
    })
    .then(() => {
      
    });  
  });
}

