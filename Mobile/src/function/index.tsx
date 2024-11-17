export const handleResponse = (response: any) => {
    try {
        // Handle 404 and other error status codes
        if (response?.status === 404) {
            console.error('404 Not Found');
            return null;
        }

        // If response is already parsed JSON, return it directly
        if (typeof response === 'object') {
            return response;
        }

        // Handle string responses
        if (typeof response === 'string') {
            // Remove any leading/trailing non-JSON characters
            const cleanJsonString = response.trim()
                .replace(/^[^[{]*([\[{])/,'$1') // Remove anything before first [ or {
                .replace(/([\]}])[^}\]]*$/,'$1'); // Remove anything after last ] or }

            try {
                return JSON.parse(cleanJsonString);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                return null;
            }
        }

        console.error('Invalid response type:', typeof response);
        return null;

    } catch (error) {
        console.error('Error handling response:', error);
        return null;
    }
}

export const handleToken = (token: string) => {
    return token.split('|')[1];
}
