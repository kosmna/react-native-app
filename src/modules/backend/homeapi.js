
import axios from 'axios';
import queryString from 'query-string';
import {  Authentication, 
          BackendUrl, 
          BookAuthentication, 
          BookBackendUrl, 
          Header,
          GetDealsEndpoint, 
          GetHomeLinksEndpoint, 
          GetMerchantListEndpoint,
          GetPokeMerchantListEndpoint,
          PokeMerchantEndPoint,
          VipRedeemOfferEndpoint,
        } from './constants';

export function GetBngDeals(serviceType) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ "Authorization": BookAuthentication, 
          "service_type": serviceType });
      
      let result = null;
      axios.post(BookBackendUrl+GetDealsEndpoint, queryString.stringify(
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

export function GetBngPokeMerchantList(categoryId, zip, lat, lng, partnerId, refCode) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(
        {
          "Authorization": "Basic YWRtaW46S0EpQGwzNTU2", 
          "category_id" : categoryId, //categoryId
          "zip" : zip, 
          "latitude":lat, 
          "longitude":lng, 
          "partner_id" : partnerId, 
          "referral_code" : refCode
        }
      );
      
      let result = null;
      axios.post(BackendUrl+GetPokeMerchantListEndpoint, queryString.stringify(
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


export function GetHomeLinks(serviceType) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ "Authorization": BookAuthentication });
      
      let result = null;
      axios.post(BookBackendUrl+GetHomeLinksEndpoint, queryString.stringify(
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
        // console.log(error);
        
        reject('Error')
      })
      .then(() => {
        
      });  
    });
}

export function GetMerchantList(apiParams) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(
      {
          "Authorization": Authentication,
          "id" : (apiParams['id'] == undefined) ? 0 : apiParams['id'],
          "latitude": (apiParams['latitude'] == undefined) ? 38.4607396 : apiParams['latitude'], 
          "longitude": (apiParams['longitude'] == undefined) ? -122.7852973 : apiParams['longitude'], 
          "dest_id":(apiParams['dest_id'] == undefined) ? 0 : apiParams['dest_id'],
          "code" : (apiParams['code'] == undefined) ? "" : apiParams['code'], 
          "radius": (apiParams['radius'] == undefined) ? (10 * 1609) : apiParams['radius'] , 
          "retail_category_id": (apiParams['retail_category_id'] == undefined) ? "" : apiParams['retail_category_id'], 
          "retail_category_name": (apiParams['retail_category_name'] == undefined) ? "" : apiParams['retail_category_name'], 
          "business_type" : (apiParams['business_type'] == undefined) ? ["is_online", "is_brick_mortar"] : apiParams['business_type'] 
      });
      
      let result = null;
      axios.post(BackendUrl+GetMerchantListEndpoint, queryString.stringify(
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

export function VipReedomOffer(partnerId, refCode, offerKey) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ 
                  "Authorization": Authentication,
                  "partner_id" : partnerId,//164,
                  "referral_code" : refCode,//"BNG0000002" , 
                  "offer_key": offerKey,//9552805
                });
      // const data = JSON.stringify({ 
      //             "Authorization": Authentication,
      //             "partner_id" : 164,
      //             "referral_code" : "BNG0000002" , 
      //             "offer_key": 9552805
      //           });
                
      let result = null;
      axios.post(BackendUrl+VipRedeemOfferEndpoint, queryString.stringify(
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

export function PokeMerchant(partnerId, refCode, merchantID) {
    return new Promise((resolve, reject) => {      
      const data = JSON.stringify({ 
                  "Authorization": Authentication,
                  "partner_id" : partnerId,
                  "referral_code" : refCode,
                  "merchantid": merchantID
                });
      
      let result = null;
      axios.post(BackendUrl+PokeMerchantEndPoint, queryString.stringify(
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