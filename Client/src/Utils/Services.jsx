export const baseUrl = `${import.meta.env.VITE_SOCKET_URL}/api`;

export const postRequest = async (url, body) => {
    const response = await fetch(url, {
        method:"POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok){
        let message;
        if(data?.message){
            message = data.message;
        }
        else {
            message = data;
        }
        return {error:true, message};
    }
    return data;
}

export const getRequest = async (url) => {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok){
        let message = "An error occured."
        if(data?.message){
            message = data.message;
        }
        return {error:true, message};
    }
    return data;
}