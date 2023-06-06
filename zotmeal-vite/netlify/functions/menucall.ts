import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import fetch from 'node-fetch';
const fetch = require('node-fetch')

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  let location_id = event.queryStringParameters.location
  if (location_id == 'brandywine'){
    location_id = '3314'
  }
  else{
    location_id = '3056'
  }
  const meal = event.queryStringParameters.meal_id
  let meal_to_period = { 'breakfast': 49, 'lunch': 106, 'dinner': 107, 'brunch': 2651 };
  let meal_id = meal_to_period[meal]
  const date = event.queryStringParameters.date

  let apicallurl = 'https://uci.campusdish.com/api/menu/GetMenus?locationId=${location_id}&periodId=${meal_id}&date=${date}'

  const response = await fetch(apicallurl)

  const {data, errors} = await response.json()

  if (response.ok){
    if ('Menu' in data){
      return data['Menu']
    }
    else{
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Error no menu in data" }),
      };
    };
  }
  else{
    const error = new Error(errors?.map(e => e.message).join('\n') ?? 'unknown')
    return Promise.reject(error)
  }
}


export { handler };
