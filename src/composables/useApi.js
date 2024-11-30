import axios from "axios";

const backend_url = 'https://ticket4u-backend-service-1015935499035.asia-southeast1.run.app'
//const backend_url = 'http://localhost:8000'

export const useApi = (apiUrl = backend_url) => {
  const instance = axios.create({
    baseURL: apiUrl,
  });

  return instance;
};

export const useAuthApi = (apiUrl = backend_url)=>{
  const instance = axios.create({
      baseURL: apiUrl,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
  })
  return instance
}

export const useLoginApi = (apiUrl = backend_url)=>{
  const instance = axios.create({
      baseURL: apiUrl,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
  })
  return instance
}

const api = useApi();

export const getMovies = () => api.get('/movies/all');

export const getTheaters = () => api.get('/cinemas/all');
export const getShowdates = (movieId) => api.get(`/movies/${movieId}/showings`);