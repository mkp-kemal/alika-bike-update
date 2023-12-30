import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { baseURLAPI } from "../store";

export function Basket() {
    const navigate = useNavigate();
    const idUser = localStorage.getItem("@userID");
    const [isLoading, setIsloading] = useState(true);

    // TOAST GAGAL
    const showToastError = (msg) => {
        toast.error(msg, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    // MENAMPILKAN PRODUCTS PADA TABLE BASKET
    const [dataProducts, setDataProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState('');
    const [totalRow, setTotalRow] = useState('');
    const [stockMessageRunsOut, setStockMessageRunsOut] = useState('');
    const getDataProducts = () => {
        axios.get(baseURLAPI("detail_basket.php/") + idUser)
            // axios.get("https://alikabike.000webhostapp.com/detail_basket.php/" + idUser)
            .then((response) => {
                setDataProducts(response.data[0].rowproductdata);
                setTotalAmount(response.data[0].totalAmount);
                setTotalRow(response.data[0].totalRows);
                // setStockMessageRunsOut(response.data[0].deletedRows[0]);
                // console.log(response.data[0].deletedRows[0]);
                // showToastError(response.data[0].deletedRows[0]);
                // console.log(response.data[0].deletedRows[0].length);
                // Periksa apakah response.data[0] dan response.data[0].deletedRows[0] ada
                if (response.data[0] && response.data[0].deletedRows && response.data[0].deletedRows[0]) {
                    if (response.data[0].deletedRows[0].length > 0) {
                        showToastError(response.data[0].deletedRows[0]);
                    }
                } else {

                }

                setTimeout(() => {
                    setIsloading(false);
                }, 1000);
            }).catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        getDataProducts();

    }, []);

    // HITUNG POTONGAN DISKON
    const hitungHargaSetelahDiskon = (hargaAsal, persentaseDiskon) => {
        const potonganDiskon = (hargaAsal * persentaseDiskon) / 100;
        return hargaAsal - potonganDiskon;
    };

    // handle button tambah
    const increment = (qty, stock, code_products, price, discount) => {
        let countIncrement = 1;
        if (parseInt(qty) < stock) {
            countIncrement = parseInt(qty) + 1;
            let priceAfterDiscount = hitungHargaSetelahDiskon(price, discount);
            const formData = new FormData();
            formData.append('id_user', idUser);
            formData.append('code_products', code_products);
            formData.append('price', priceAfterDiscount);
            formData.append('qty', countIncrement);
            console.log(priceAfterDiscount);
            axios.post(baseURLAPI("detail_basket.php"), formData)
                // axios.post("https://alikabike.000webhostapp.com/detail_basket.php", formData)
                .then((response) => {
                    getDataProducts();
                }).catch((error) => {
                    console.log(error);
                });
        }
    };
    // handle button kurang
    const decrement = (qty, code_products, price, discount) => {
        let countDecrement = 1;
        if (parseInt(qty) > 1) {
            countDecrement = parseInt(qty) - 1;
            let priceAfterDiscount = hitungHargaSetelahDiskon(price, discount);
            const formData = new FormData();
            formData.append('id_user', idUser);
            formData.append('code_products', code_products);
            formData.append('price', priceAfterDiscount);
            formData.append('qty', countDecrement);
            axios.post(baseURLAPI("detail_basket.php"), formData)
                // axios.post("https://alikabike.000webhostapp.com/detail_basket.php", formData)
                .then((response) => {
                    getDataProducts();
                }).catch((error) => {
                    console.log(error);
                });
        }
    };

    // HAPUS PRODUCTS BASKET
    const getDeleteProducts = async (id_basket) => {
        const response = await axios.post(baseURLAPI(`delete_basket.php?id_basket=${id_basket}`));
        if (response.data.success) {
            getDataProducts();
        }
    }

    //FORMAT RUPIAH
    const formatRupiah = (amount) => {
        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });

        return formatter.format(amount);
    };

    // TO DETAIL PRODUCT
    const toDetailProduct = (idProduct) => {
        localStorage.setItem('idProduct', idProduct);
        navigate('/product');
    }


    return (
        <div className="outBody">
            <div className="body">
                <div className="header">
                    <ToastContainer />

                    {/* NAVBAR */}
                    <nav className="navbar text-center" style={{ position: 'fixed', padding: '15px' }}>
                        <div style={{ cursor: 'pointer' }} onClick={() => { window.history.back() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292" /></svg>
                        </div>
                        <a class="navbar-brand" style={{ fontSize: '15px' }}><b>Keranjang</b></a>
                    </nav>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', marginTop: '50%', color: 'var(--cyan)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle></svg>
                        </div>
                    ) : (
                        <div>
                            {/* IS KERANJANG KOSONG */}
                            {totalRow <= 0 || totalRow == null ? (
                                <div className="" style={{ marginTop: '100px', textAlign: 'center', alignContent: 'center', alignItems: 'center', }}>
                                    <h3 className="text-secondary">Keranjang Masih Kosong</h3>
                                    <div className="text-secondary mb-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m17 10l-2-6m-8 6l.75-2.252m1.001-3.002L9 4m3 4h7a2 2 0 0 1 1.977 2.304C20.535 12.82 20.221 14.742 20 16m-1.01 3.003a2.997 2.997 0 0 1-2.234.997H7.244a3 3 0 0 1-2.965-2.544l-1.255-7.152A2 2 0 0 1 5.001 8H8" /><path d="M12 12a2 2 0 1 0 2 2M3 3l18 18" /></g></svg>
                                    </div>
                                    <button className="btn btn-info" onClick={() => { navigate('/') }}><h3 className="mt-2">Beranda</h3></button>
                                </div>
                            ) : (
                                <div>
                                    {/* DETAIL PESANAN */}
                                    <div className="body-products" style={{ marginTop: '80px', marginBottom: '100px' }}>
                                        <div style={{ width: '100%', textAlign: 'left', padding: '15px' }}>
                                            <div className="text-start d-flex justify-content-between">
                                                <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                                                    Detail Pesanan
                                                </p>
                                            </div>
                                            {dataProducts.map((item) => (
                                                <div style={{ borderRadius: '10px', boxShadow: '2px 2px 5px  gray', padding: '10px', marginTop: '10px' }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ margin: 'auto' }}>
                                                            <img src={item.image} width={80} style={{ cursor: 'pointer' }} alt="img" onClick={() => { toDetailProduct(item.code_products) }} />
                                                        </div>
                                                        <div style={{ marginLeft: '5px' }}>
                                                            <p style={{ fontSize: '12px', color: 'gray' }}>
                                                                {item.name_products}
                                                            </p>
                                                            {item.discount >= 1 ? (
                                                                <p className="card-text" style={{ fontSize: '10px', color: 'rgb(255, 96, 96)', fontFamily: 'inherit' }}><button className="btn btn-info btn-sm" style={{ fontSize: '10px', marginRight: '5px' }}>{item.discount}%</button><s>{formatRupiah(item.price)}</s></p>
                                                            ) : (null)}
                                                            <p className="card-text" style={{ fontSize: '13px', color: 'black', fontFamily: 'inherit', marginTop: '-8px' }}><b>{formatRupiah(hitungHargaSetelahDiskon(item.price, item.discount))}</b></p>
                                                            <div className="text-start d-flex justify-content-between" style={{ display: 'flex', alignItems: 'center' }}>
                                                                <button className="btn btn-sm btn-danger" style={{ fontSize: '12px', fontFamily: 'inherit' }} onClick={() => { getDeleteProducts(item.id_basket) }}><b>Hapus</b></button>
                                                                <div style={{ fontSize: '15px' }}>
                                                                    <button onClick={() => { decrement(item.qty, item.code_products, item.price, item.discount) }} className="btn btn-light btn-sm text-dark">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10 20a10 10 0 1 1 0-20a10 10 0 0 1 0 20zm5-11H5v2h10V9z" /></svg>                                                                    </button>
                                                                    <span className="text-dark" style={{ marginLeft: '10px', marginRight: '10px' }}>{item.qty}</span>
                                                                    <button onClick={() => increment(item.qty, item.stock, item.code_products, item.price, item.discount)} className="btn btn-light btn-sm text-dark">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="currentColor" /><g fill="#fff"><path d="M21 14h6v20h-6z" /><path d="M14 21h20v6H14z" /></g></svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* BOTTOM NAVIGATION */}
                                    <footer class="bottom-nav navbar-light" style={{ padding: '0px', boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.30)', zIndex: '15', background: 'white', width: '100%', maxWidth: '450px' }}>
                                        <div className="in-body-category" style={{ padding: '12px' }}>
                                            <div className="text-start d-flex justify-content-between" style={{ display: 'flex', alignItems: 'center' }}>
                                                <p className="card-text" style={{ fontSize: '12px', color: 'black', fontFamily: 'inherit', marginTop: '15px' }}><b>Total: <span style={{ fontSize: '16px', color: 'red' }}>{formatRupiah(totalAmount)}</span> </b></p>
                                                <div className="bg-danger" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '200px', height: '40px', textAlign: 'center', borderRadius: '10px' }} onClick={() => { navigate('/checkout') }}>
                                                    <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }} >Checkout</p>
                                                </div>
                                            </div>
                                        </div>
                                    </footer>
                                </div>
                            )}
                        </div>
                    )}



                </div>
            </div>
        </div>
    )
}