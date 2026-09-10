import SummaryApi from "../common";
import { toast } from 'react-toastify';

const addToCart = async (e, id) => {
    e?.stopPropagation();
    e?.preventDefault();

    try {
        const response = await fetch(SummaryApi.addToCartProduct.url, {
            method: SummaryApi.addToCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({ productId: id })
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData.message);
        }

        if (responseData.error) {
            toast.error(responseData.message);
            
            // User not logged in check
            if (response.status === 401 || responseData.message?.toLowerCase().includes("login")) {
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            }
        }

        return responseData;
    } catch (error) {
        toast.error("Something went wrong!");
    }
};

export default addToCart;