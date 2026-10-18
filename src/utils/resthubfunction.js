import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL || "https://api.example.com";

export const getSamplesForDashboard = async ( token, setSamples, setError, setFetching ) => {

    setFetching(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/get-sample-for-dashboard`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setSamples(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setFetching(false);
}

export const getIndividualDashboardReport = async ( token, data, setReport, setError, setRunning ) => {

    setRunning(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/get-individual-dashboard-report`, 
            data, 
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setReport(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setRunning(false);
}

export const loadAddSampleFormElements = async (token, data, setFormfields, setError, setFetching) => {
    setFetching(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/add-sample-form`, 
            data,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setFormfields(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setFetching(false);
}

export const getStateListFromGeoZone = async (data, setGeostates, setError, setListing) => {
    setListing(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/get-geo-states`, 
            data,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json'
                }
            }
        );    
        console.log(response.data);
        setGeostates(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setListing(false);
}

export const fetchOptions = async (token, api, setComboOptions, setError, setFetching) => {
    setFetching(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/${api}`, 
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                }
            }
        );    
        //console.log(response.data);
        setComboOptions(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setFetching(false);
}

export const submitAddSamplePayload = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/submit-sample`, 
            data,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setSuccess(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setSubmitting(false);
}

export const fetchForms = async (token, setForms, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/fetch-forms`, 
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setForms(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}

export const fetchFormfields = async (token, data, setFormfields, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/form-fields`, 
            data,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setFormfields(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}

export const fetchAddSampleColumns = async (token, setHeaders, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/add-sample-columns`, 
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setHeaders(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}

export const fetchOrgAddSampleRecords = async (token, aetRecords, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/org-add-sample-records`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        aetRecords(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}

export const shipSample = async (token, data, setSuccess, setError, setShipping) => {
    setShipping(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/ship-sample`,
            data,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setSuccess(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setShipping(false);
}


export const updateStatus = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/update-field-status`,
            data,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setSuccess(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setUpdating(false);
}


export const receivedRequests = async (token, setReceived, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/received-requests`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setReceived(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}


export const sentRequests = async (token, setSent, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/sent-requests`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setSent(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}


export const createRequest = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/create-request`,
            data,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setSuccess(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setSubmitting(false);
}


export const closeRequest = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/close-request`,
            data,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setSuccess(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setSubmitting(false);
}

export const dashboardStatistics = async (token, setStatistics, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/dashboard-statistics`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setStatistics(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}


export const changeRequestApproval = async (token, data, setSuccess, setError, setSubmitting) => {
    setSubmitting(true);
    try{
        //console.log(token)
        const response  = await axios.post(`${API_BASE}/change-request-approval`,
            data,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setSuccess(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setSubmitting(false);
}

export const populationLocationCategoryChart = async (token, setData, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/population-category-chart`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setData(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}

export const populationHivstatusChart = async (token, setData, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/population-hivstatus-chart`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setData(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}

export const populationSexChart = async (token, setData, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/population-sex-chart`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setData(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}


export const populationAgeChart = async (token, setData, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/population-age-chart`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setData(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}

export const populationStateChart = async (token, setData, setError, setIsLoading) => {
    setIsLoading(true);
    try{
        //console.log(token)
        const response  = await axios.get(`${API_BASE}/population-state-chart`,
            {
                headers: { 
                    'Accept' : 'application/json', 
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}` 
                }
            }
        );    
        //console.log(response.data);
        setData(response.data);
    }
    catch (err) {
        if (!err?.response) {
            setError('No Response from Server');
        } else {
            console.log(err.response.data);
            setError(err.response.data);
        }
    }

    setIsLoading(false);
}

