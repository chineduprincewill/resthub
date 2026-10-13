import axios from "axios";
const API_BASE = import.meta.env.VITE_BASE_URL || "https://api.example.com";

export const fetchForms = async (token, setForms, setError, setLoading) => {
    setLoading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/fetch-forms`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setForms(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setLoading(false);
    }
};

export const fetchActiveForms = async (token, setForms, setError, setLoading) => {
    setLoading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.get(`${API_BASE}/active-forms`, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setForms(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setLoading(false);
    }
};

export const updateForm = async (token, data, setSuccess, setError, setSaving) => {
    setSaving(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-form`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setSaving(false);
    }
};


export const fetchFormfields = async (token, data, setSuccess, setError, setLoading) => {
    setLoading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/form-fields`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setLoading(false);
    }
};

export const fetchFormFieldCategories = async (token, data, setCategories, setError, setLoading) => {
    setLoading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/fetch-categories`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setCategories(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setLoading(false);
    }
};

export const addFormfieldGrouping = async (token, data, setSuccess, setError, setAdding) => {
    setAdding(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/add-category`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setAdding(false);
    }
};

export const updateFormField = async (token, data, setSuccess, setError, setAdding) => {
    setAdding(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-formfield`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setAdding(false);
    }
};

export const assignFormToUser = async (token, data, setSuccess, setError, setAssigning) => {
    setAssigning(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/assign-form`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setAssigning(false);
    }
};

export const fetchFormAssignments = async (token, data, setAssignments, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/form-assignments`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setAssignments(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};


export const removeUserAssignment = async (token, data, setSuccess, setError, setRemoving) => {
    setRemoving(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/remove-assignment`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setRemoving(false);
    }
};


export const updateFormUid = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-uid`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setUpdating(false);
    }
};


export const updateFormdata = async (token, data, setSuccess, setError, setUpdating) => {
    setUpdating(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/update-formdata`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setUpdating(false);
    }
};


export const fetchFormdata = async (token, data, setFormdata, setError, setFetching) => {
    setFetching(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/fetch-formdata`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        console.log(response.data);
        setFormdata(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setFetching(false);
    }
};

export const removeFormdata = async (token, data, setSuccess, setError, setDeleting) => {
    setDeleting(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/remove-formdata`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setSuccess(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setDeleting(false);
    }
};

export const getDependentFieldOptions = async (token, data, setD_options, setError, setLoading) => {
    setLoading(true);
    try {
        if (!token || typeof token !== "string") {
            throw new Error("missing_token");
        }
        const response = await axios.post(`${API_BASE}/dependent-options`, data, {
            headers: {
                Accept: "application/json",
                // Remove Content-Type for GET — may trigger preflight unnecessarily
                Authorization: `Bearer ${token.trim()}`,
            },
            // withCredentials: true, // uncomment if the backend expects cookies
        });
        //console.log(response.data);
        setD_options(response.data);
    } catch (err) {
        if (err.message === "missing_token") {
            setError("Authorization token not provided");
        } else if (!err?.response) {
            setError("No response from server");
        } else {
            // Prefer server message, normalize to string
            const msg =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data) ||
            `Request failed (${err.response.status})`;
            console.log("Server response:", err.response);
            setError(msg);
        }
    } finally {
        setLoading(false);
    }
};
