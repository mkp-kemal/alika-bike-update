import axios from "axios";
import { atom, selector } from 'recoil'

const baseURLAPI = (url = '') => {
    url = url.replace(/^[/]/g, '');
    // const baseURL = 'http://localhost/alikabike/';
    const baseURL = 'https://alikabike.000webhostapp.com/';
    return baseURL + url;
}

const dataInfo = selector({
    key: 'data-info',
    get: async () => {
        let info = null;

        try {
            let { data } = await axios.get(baseURLAPI('info.php'))
            info = { info: data }
        } catch (e) {
            info = { info: e.message }
        }
        return info
    }
})

const dataProductsDiscount = selector({
    key: 'data-produts-discount',
    get: async () => {
        let productsDiscount = null;

        try {
            let { data } = await axios.get(baseURLAPI('discount_products.php'))
            productsDiscount = { productsDiscount: data }
        } catch (e) {
            productsDiscount = { productsDiscount: e.message }
        }
        return productsDiscount
    }
})

const dataProductsBicycleDiscount = selector({
    key: 'data-bicycle-discount',
    get: async () => {
        let productsBicycleDiscount = null;

        try {
            let { data } = await axios.get(baseURLAPI('discount_bicycle_products.php'))
            productsBicycleDiscount = { productsBicycleDiscount: data }
        } catch (e) {
            productsBicycleDiscount = { productsBicycleDiscount: e.message }
        }
        return productsBicycleDiscount
    }
})

const dataProductsSparePart = selector({
    key: 'data-spare-part',
    get: async () => {
        let productsSparePart = null;

        try {
            let { data } = await axios.get(baseURLAPI('spare_part_products.php'))
            productsSparePart = { productsSparePart: data }
        } catch (e) {
            productsSparePart = { productsSparePart: e.message }
        }
        return productsSparePart
    }
})

const dataTotalBasket = selector({
    key: 'data-total-basket',
    get: async () => {
        let totalBasket = null;
        const id_user = localStorage.getItem('@userID');

        try {
            let { data } = await axios.get(baseURLAPI('basket.php/') + id_user)
            totalBasket = { totalBasket: data.total_produk }
        } catch (e) {
            totalBasket = { totalBasket: e.message }
        }
        return totalBasket
    }
})

const dataBicycle = selector({
    key: 'data-bicycle',
    get: async () => {
        let bicycle = null;

        try {
            let { data } = await axios.get(baseURLAPI('bicycle.php/'))
            bicycle = { bicycle: data }
        } catch (e) {
            bicycle = { bicycle: e.message }
        }
        return bicycle
    }
})

export const dataOrdersAtom = atom({
    key: 'dataOrdersAtom',
    default: [],
});
const dataOrders = selector({
    key: 'data-orders',
    get: async () => {
        let orders = null;

        try {
            let { data } = await axios.get(baseURLAPI('orders.php/'))
            orders = { orders: data }
        } catch (e) {
            orders = { orders: e.message }
        }
        return orders
    }
})

export {
    baseURLAPI,
    dataInfo,
    dataProductsDiscount,
    dataProductsBicycleDiscount,
    dataProductsSparePart,
    dataTotalBasket,
    dataBicycle,
    dataOrders,
}