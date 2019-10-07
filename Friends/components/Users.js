//used to fetch user details from Agrismart Users API
export const getUserInfo = () => {
    const URL = `https://c3.timesmart.co.nz/ird_pf_testing/index.php?ct=api&api=users&act=ping`;
    return fetch(URL)
            .then((res) => res.json());
}
