import axios from 'axios';
import queryString from 'query-string';
import {  TriposoAuthentication, 
          Header,
          TriposoBackendUrl,
          GetTriposoSearchLocationByKeyEndPoint, 
          GetTriposoLocationByIdEndPoint, 
          GetTriposoLocationByCountryEndPoint,
          GetTriposoPoiByLocationEndPoint,
          GetTriposoPoiByIdEndPoint,
          GetTriposoTagByLocationEndPoint,
          GetTriposoTourByLocationEndPoint,
          GetTriposoTourByIdEndPoint,
          GetTriposoCityWalkByLocationEndPoint,
        } from './constants';


export function GetTriposoSearchLocationByKey(partner_id, referral_code, keyword, page) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ "Authorization": TriposoAuthentication, 
          "partner_id": partner_id, "referral_code": referral_code, "keyword": keyword, "page": page });
      
      let result = null;

      axios.post(TriposoBackendUrl+GetTriposoSearchLocationByKeyEndPoint, queryString.stringify(
        {    
          "data": data
        }), {
          headers: Header
      })
      .then(response => {
        console.log('GetTriposoSearchLocationByKey Rep =', response);
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


export function GetTriposoLocationById(partner_id, referral_code, id) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": TriposoAuthentication, 
        "partner_id": partner_id, "referral_code": referral_code, "id": id });
    
    let result = null;
    axios.post(TriposoBackendUrl+GetTriposoLocationByIdEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      console.log('GetTriposoLocationById Rep =', response);
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


export function GetTriposoLocationByCountry(partner_id, referral_code, part_of, tag_labels, page) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": TriposoAuthentication, 
        "partner_id": partner_id, "referral_code": referral_code, "part_of": part_of,
        "tag_labels": tag_labels, "page": page
       });
    
    let result = null;
    axios.post(TriposoBackendUrl+GetTriposoLocationByCountryEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      console.log('GetTriposoLocationByCountry Rep =', response);
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


export function GetTriposoPoiByLocation(partner_id, referral_code, location_id, tag_labels, page) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": TriposoAuthentication, 
        "partner_id": partner_id, "referral_code": referral_code, "location_id": location_id,
        "tag_labels": tag_labels, "page": page
       });
    
    let result = null;
    axios.post(TriposoBackendUrl+GetTriposoPoiByLocationEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      console.log('GetTriposoPoiByLocation Rep =', response);
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


export function GetTriposoPoiById(partner_id, referral_code, id) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": TriposoAuthentication, 
        "partner_id": partner_id, "referral_code": referral_code, "id": id
       });
    
    let result = null;
    axios.post(TriposoBackendUrl+GetTriposoPoiByIdEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      console.log('GetTriposoPoiById Rep =', response);
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


export function GetTriposoTagByLocation(partner_id, referral_code, location_id, page) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": TriposoAuthentication, 
        "partner_id": partner_id, "referral_code": referral_code, "location_id": location_id,
        "page": page
       });
    
    let result = null;
    axios.post(TriposoBackendUrl+GetTriposoTagByLocationEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      console.log('GetTriposoTagByLocation Rep =', response);
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


export function GetTriposoTourByLocation(partner_id, referral_code, location_ids, tag_labels, page) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": TriposoAuthentication, 
        "partner_id": partner_id, "referral_code": referral_code, "location_ids": location_ids,
        "tag_labels": tag_labels, "page": page
       });
    
    let result = null;
    axios.post(TriposoBackendUrl+GetTriposoTourByLocationEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      console.log('GetTriposoTourByLocation Rep =', response);
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


export function GetTriposoTourById(partner_id, referral_code, id) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": TriposoAuthentication, 
        "partner_id": partner_id, "referral_code": referral_code, "id": id
       });
    
    let result = null;
    axios.post(TriposoBackendUrl+GetTriposoTourByIdEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      console.log('GetTriposoTourById Rep =', response);
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


export function GetTriposoCityWalkByLocation(partner_id, referral_code, location_id) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ "Authorization": TriposoAuthentication, 
        "partner_id": partner_id, "referral_code": referral_code, "location_id": location_id
       });
    
    let result = null;
    axios.post(TriposoBackendUrl+GetTriposoCityWalkByLocationEndPoint, queryString.stringify(
      {    
        "data": data
      }), {
        headers: Header
    })
    .then(response => {
      console.log('GetTriposoCityWalkByLocation Rep =', response);
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
