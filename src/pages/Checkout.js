import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { Rupiah } from "../components/Rupiah";
import { baseURLAPI } from "../store";


export function Checkout() {
    const navigate = useNavigate();
    const idUser = localStorage.getItem("@userID");
    const [isLoading, setIsloading] = useState(true);


    const toAddAddress = () => {
        navigate('/add-address')
    }

    // MENAMPILKAN PRODUCTS PADA TABLE BASKET
    const [dataProducts, setDataProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState('');
    const [totalRow, setTotalRow] = useState(0);
    const getDataProducts = () => {
        axios.get(baseURLAPI("detail_basket.php/") + idUser)
            // axios.get("https://alikabike.000webhostapp.com/detail_basket.php/" + idUser)
            .then((response) => {
                setTotalRow(response.data[0].totalRows);
                if (response.data[0].totalRows <= 0) {
                    navigate('/');
                } else {
                    setDataProducts(response.data[0].rowproductdata);
                    setTotalAmount(response.data[0].totalAmount);
                }
            }).catch((error) => {
                console.log(error);
            });
    }
    // MENAMPILKAN ADDRESS
    const [totalRowAddress, setTotalRowAddress] = useState(0);
    const [dataAddress, setDataAddress] = useState([]);
    const getDataAddress = () => {
        axios.get(baseURLAPI("address.php/") + idUser)
            // axios.get("https://alikabike.000webhostapp.com/address.php/" + idUser)
            .then((response) => {
                setTotalRowAddress(response.data.total_rows);
                setDataAddress(response.data.data[0]);
            }).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getDataProducts();
    }, []);

    useEffect(() => {
        // if (totalRow === null ) {
        //     navigate('/');
        // } else {
        getDataAddress();
        setTimeout(() => {
            setIsloading(false);
        }, 1000);
        // }
    }, []);

    // TOAST INFO
    const showToastInfo = (msg) => {
        toast.info(msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    // HITUNG POTONGAN DISKON
    const hitungHargaSetelahDiskon = (hargaAsal, persentaseDiskon) => {
        const potonganDiskon = (hargaAsal * persentaseDiskon) / 100;
        return hargaAsal - potonganDiskon;
    };

    let final_total = parseInt(totalAmount);

    // HANDLE  BAYAR SEKARANG
    const handlePayNow = async () => {
        const shortUUID = uuidv4();
        const id_transaction = shortUUID.substr(0, 13);
        const formData = new FormData();
        formData.append('id_user', idUser);
        formData.append('id_transaction', id_transaction);
        // Buat array baru untuk menyimpan code_products
        const codeProductsArray = dataProducts.map((item) => item.code_products);
        const codeProductsString = codeProductsArray.join(',');
        // console.log(codeProductsString);
        formData.append('code_products', codeProductsString);
        const qtyArray = dataProducts.map((item) => item.qty);
        const qtyString = qtyArray.join(',');
        formData.append('qty', qtyString);
        formData.append('amount', final_total);
        formData.append('order_name', dataAddress.name);
        formData.append('whatsapp', dataAddress.whatsapp);
        formData.append('order_address', dataAddress.location);
        formData.append('note', '');
        formData.append('status', 'Pending');
        formData.append('is_pay', 'No');
        formData.append('pay_now', 'No');
        formData.append('payment', '-');
        // DATE
        const current = new Date();
        const monthNames = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const day = current.getDate();
        const month = monthNames[current.getMonth()];
        const year = current.getFullYear();
        const hours = current.getHours();
        const minutes = current.getMinutes();
        const seconds = current.getSeconds();
        const formattedDate = `${day} ${month} ${year} pukul ${hours}.${minutes}.${seconds}`;
        const date = formattedDate;
        formData.append('at_created', date);
        // Tambah 2 jam
        const tanggalObjek = new Date(current); // Salin objek tanggal asli
        tanggalObjek.setHours(tanggalObjek.getHours() + 2);
        const expPayDate = tanggalObjek.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        formData.append('exp_payment', expPayDate);
        try {
            const response = await axios.post(baseURLAPI("orders.php"), formData);
            if (response.data.success) {
                navigate('/pay?payment=' + id_transaction)
            }
        } catch (error) {
            console.error(error);
        }
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
                        <a class="navbar-brand" style={{ fontSize: '15px' }}><b>Checkout</b></a>
                    </nav>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', marginTop: '50%', color: 'var(--cyan)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle></svg>
                        </div>
                    ) : (
                        <>
                            {/* TAMBAH ALAMAT */}
                            <div className="body-products" style={{ marginTop: '50px' }}>
                                <div style={{ width: '100%', textAlign: 'left', padding: '15px' }}>
                                    <div className="text-start d-flex justify-content-between">
                                        <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                                            Alamat Pengiriman
                                        </p>
                                    </div>

                                    {totalRowAddress == 0 || totalRowAddress == null ? (
                                        <div className="in-body-category" style={{ display: 'flex', padding: '12px', justifyContent: 'center' }}>
                                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '300px', height: '40px', textAlign: 'center', borderRadius: '10px', border: '1px solid green', marginRight: '5px' }} onClick={toAddAddress}>
                                                <p style={{ fontSize: '15px', color: 'green', margin: 'auto' }}>+ Alamat Pengiriman</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ borderRadius: '10px', boxShadow: '2px 2px 5px  gray', padding: '10px', marginTop: '5px' }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: '100%' }}>
                                                    <div className="d-flex justify-content-between">
                                                        <p style={{ fontSize: '12px', color: 'gray' }}>
                                                            {dataAddress.name}
                                                        </p>
                                                        <div className="text-success d-flex flex-row-reverse" >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4l4.25 4.25ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z" /></svg>
                                                        </div>
                                                    </div>
                                                    <p className="card-text" style={{ fontSize: '11px', color: 'black', fontFamily: 'inherit', marginTop: '-5px' }}><b>{dataAddress.location}({dataAddress.landmark})</b></p>
                                                    <p className="card-text text-info" style={{ cursor: 'pointer', fontSize: '11px', fontFamily: 'inherit', marginTop: '0px' }} onClick={() => { navigate('/edit-address') }}><b>Ubah Alamat</b></p>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </div>
                            </div>

                            {/* DETAIL PESANAN */}
                            <div className="body-products">
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
                                                    <img src={item.image} width={80} alt="img" />
                                                </div>
                                                <div style={{ marginLeft: '5px' }}>
                                                    <p style={{ fontSize: '12px', color: 'gray' }}>
                                                        {item.name_products}
                                                    </p>
                                                    {item.discount >= 1 ? (
                                                        <p className="card-text" style={{ fontSize: '10px', color: 'rgb(255, 96, 96)', fontFamily: 'inherit' }}><button className="btn btn-info btn-sm" style={{ fontSize: '10px', marginRight: '5px' }}>{item.discount}%</button><s>{Rupiah(item.price)}</s></p>
                                                    ) : (null)}
                                                    <div className="text-start d-flex justify-content-between" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <p className="card-text" style={{ fontSize: '13px', color: 'black', fontFamily: 'inherit', marginTop: '-5px' }}><b>{Rupiah(hitungHargaSetelahDiskon(item.price, item.discount))}</b></p>
                                                        <p className="card-text" style={{ fontSize: '13px', color: 'gray', fontFamily: 'inherit', marginTop: '-5px' }}>{item.qty} Barang</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* METODE PENGIRIMAN */}
                            <div className="body-products" >
                                <div style={{ width: '100%', textAlign: 'left', padding: '15px' }}>
                                    <div className="text-start d-flex justify-content-between">
                                        <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                                            Metode Pengiriman
                                        </p>
                                    </div>
                                    <div className="text-primary d-flex" >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z" /></svg>
                                        <p style={{ fontSize: '13px', color: 'gray', marginLeft: '5px' }}>
                                            Pengiriman langsung dari toko
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* DETAIL PEMBAYARAN */}
                            <div className="body-products-last">
                                <div style={{ width: '100%', textAlign: 'left', padding: '15px' }}>
                                    <div className="text-start d-flex justify-content-between">
                                        <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                                            Detail Pembayaran
                                        </p>
                                    </div>
                                    <div style={{fontSize: '15px'}}>
                                        <div class="d-flex justify-content-between text-dark" style={{ width: '100%' }}>
                                            <div class="p-2 text-secondary"><small><b>Subtotal</b></small></div>
                                            <div class="p-2"><small><b>{Rupiah(totalAmount)}</b></small></div>
                                        </div>
                                        <div class="d-flex justify-content-between text-dark" style={{ width: '100%' }}>
                                            <div class="p-2 text-secondary"><small><b>Ongkir</b></small></div>
                                            <div class="p-2 text-danger" style={{ fontSize: '14px' }}><small><i>*akan muncul setelah setelah klik <span className="text-info">"Bayar Sekarang"</span></i></small></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MODAL KLIK BAYAR SEKARANG */}
                            <div class="modal fade" id="payNowCheckout" tabindex="-1" role="dialog" aria-labelledby="payNowCheckoutLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document" style={{padding: '10px'}}>
                                    <div class="modal-content" style={{fontSize: '15px'}}>
                                        <div class="modal-header">
                                            <h2 class="modal-title" id="payNowCheckoutLabel">Peringatan !!</h2>
                                            <button type="button" style={{fontSize: '25px', marginRight: '10px'}} class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body text-danger" style={{ fontWeight: 'bold' }}>
                                            Apakah data dan alamat mu sudah benar?
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" style={{fontSize: '15px'}} class="btn btn-primary" data-dismiss="modal">Belum</button>
                                            <button type="button" style={{fontSize: '15px'}} class="btn btn-danger" data-dismiss="modal" onClick={handlePayNow}>Lanjut Bayar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM NAVIGATION */}
                            <footer class="bottom-nav navbar-light" style={{ padding: '0px', boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.30)', zIndex: '15', background: 'white', width: '100%', maxWidth: '450px' }}>
                                <div className="in-body-category" style={{ padding: '12px' }}>
                                    <div className="text-start d-flex justify-content-between" style={{ display: 'flex', alignItems: 'center' }}>
                                        <p className="card-text" style={{ fontSize: '12px', color: 'black', fontFamily: 'inherit', marginTop: '15px' }}><b>Total: <span style={{ fontSize: '16px', color: 'red' }}>{Rupiah(final_total)}</span> </b></p>
                                        {totalRowAddress == 0 || totalRowAddress == null ? (
                                            <div className="bg-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '200px', height: '40px', textAlign: 'center', borderRadius: '10px' }} onClick={() => showToastInfo("Masukan Alamat dan Pilih Metode Pembayaran")}>
                                                <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }}>Bayar Sekarang</p>
                                            </div>
                                        ) : (
                                            <div className="bg-danger" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '200px', height: '40px', textAlign: 'center', borderRadius: '10px' }} data-toggle="modal" data-target="#payNowCheckout">
                                                <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }}>Bayar Sekarang</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </footer>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}