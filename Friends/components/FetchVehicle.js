//used to fetch vehicle details from carjam API

export const getRegoInfo = (regno) => {
    const URL = `https://www.carjam.co.nz/api/car/?key=288881FEB865BC0967EC43CD8DF986C580E3E93B&f=json&plate=${regno}`;
    return fetch(URL)
            .then((res) => res.json());
}