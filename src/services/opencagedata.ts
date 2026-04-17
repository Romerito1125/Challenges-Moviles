const API_KEY = "692a281151fa2446582960863c7ef32f6";


export const getAddress =  async (lat: number, lng: number) => {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`);
    const data = await response.json();
    return data;
}