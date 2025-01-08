import axios from "axios";
//http://localhost:4005
//https://as-sumadre.onrender.com

export const authApi=axios.create({
    baseURL: "http://localhost:4005",   
});


authApi.interceptors.request.use((config) => {
	config.headers = {
		'x-token': localStorage.getItem('token'),
	};
	return config;
});

export default authApi;