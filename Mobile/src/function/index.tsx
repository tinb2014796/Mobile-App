export const handleResponse = (response: any) => {
    try {
        if (typeof response !== 'string') {
            console.error('Invalid response type:', typeof response);
            return null;
        }
        const cleanJsonString = response.replace(/^[^[{]*([\[{])/,'$1').replace(/([\]}])[^}\]]*$/,'$1');
        const data = JSON.parse(cleanJsonString);
        return data;
    } catch (error) {
        console.error('Error parsing response:', error);
        return null;
    }
}

export const handleToken = (token: string) => {
    return token.split('|')[1];
}
