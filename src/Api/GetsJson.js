
import 'whatwg-fetch'
const getsJson = (dispatch, api) => {
    dispatch({type:'FETCH_GET_REQUEST'})
  
    return fetch(api, {
      credentials: 'include',
      method: 'GET',
      'Cookie':'BAIDUID=7391262288AB2EF0784665635E42663D:FG=1; BIDUPSID=7391262288AB2EF0784665635E42663D; PSTM=1515992205; MCITY=-340%3A; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; Hm_lvt_4bad1df23f079e0d12bdbef5e65b072f=1521773463,1521776251; H_PS_PSSID=1440_25810_21101_22073; Hm_lpvt_4bad1df23f079e0d12bdbef5e65b072f=1521776253; PSINO=7',
      headers: {
        'Accept': '*/*',
        'Content-Type' : 'application/json',
        'origin':'moz-extension://235b90f4-c5df-eb40-800e-fc167917d5a1',
        'Cookie':'BAIDUID=7391262288AB2EF0784665635E42663D:FG=1; BIDUPSID=7391262288AB2EF0784665635E42663D; PSTM=1515992205; MCITY=-340%3A; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; Hm_lvt_4bad1df23f079e0d12bdbef5e65b072f=1521773463,1521776251; H_PS_PSSID=1440_25810_21101_22073; Hm_lpvt_4bad1df23f079e0d12bdbef5e65b072f=1521776253; PSINO=7'
      },
      mode: "cors",
      cache: "force-cache"
    }).then(response => response.json()).then(json => {
      console.log(json)
      return {type:'FETCH_GET_SUCCESS', response:json}
    }).catch(e => {
      return {type:'FETCH_GET_FAILURE', error:e}
    })
  }
  
  export default getsJson