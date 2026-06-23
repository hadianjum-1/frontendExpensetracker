
import api from '../Services/api.service'

const Fetcher = async (url) => {
    try {
        const { data } = await api.get(url);
        return data;
    } catch (err) {
        throw err;
    }
};

export default Fetcher;
