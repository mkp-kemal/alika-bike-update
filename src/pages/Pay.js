import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Rupiah } from "../components/Rupiah";
import { format, parse } from 'date-fns';
import { baseURLAPI } from "../store";

export function Pay() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const payment = params.get("payment");
    const [isLoading, setIsloading] = useState(true);


    //TRUNCATE TEXT
    function truncateText(text) {
        if (text.length > 19) {
            return text.slice(0, 19) + "xxx-xxx-xxx";
        }
        return text;
    }
    function truncateText2(text) {
        if (text.length > 30) {
            return text.slice(0, 30) + "...";
        }
        return text;
    }

    // MENAMPILKAN ORDER
    const [order, setOrder] = useState([]);
    const [shipping, setShipping] = useState(0);
    const [typePayment, setTypePayment] = useState(0);
    const [expPayment, setExpPayment] = useState("");
    const [status, setStatus] = useState('');
    const [isPay, setIsPay] = useState('');
    const getDataOrder = async () => {
        // setIsloading(true);
        axios.get(baseURLAPI("orders.php/") + payment)
            // axios.get("https://alikabike.000webhostapp.com/orders.php/" + payment)
            .then((response) => {
                setOrder(response.data);
                setShipping(response.data[0].shipping);
                setTypePayment(response.data[0].payment);
                setExpPayment(response.data[0].exp_payment);
                setStatus(response.data[0].status);
                setIsPay(response.data[0].is_pay);
                setIsloading(false);
            }).catch((error) => {
                console.log(error);
            });
    }

    let shippingInt = parseInt(shipping);
    const [paymentUrl, setPaymentUrl] = useState("");
    const getPaymentLink = async () => {
        const secret = process.env.REACT_APP_SECRET
        // console.log(secret);
        const encodeSecret = btoa(secret);
        const basicAuth = `Basic ${encodeSecret}`

        let total = parseInt(order[0].amount) + shippingInt
        let totalPrice = hitungHargaSetelahDiskon(parseInt(order[0].price), parseInt(order[0].discount))
        // console.log(totalPrice);

        let data = {
            item_details: [
                {
                    id: order[0].id_transaction,
                    name: truncateText2(order[0].name_products),
                    price: total,
                    quantity: 1
                }
            ],
            transaction_details: {
                order_id: order[0].id_transaction,
                gross_amount: total
            },

            customer_details: {
                first_name: order[0].order_name,
                // last_name: MIDTRANSER,
                // email: "test@midtrans.com",
                // phone: dataAddress.whatsapp
                billing_address: {
                    address: order[0].order_address,
                },
            },
            enabled_payments: ["credit_card", "cimb_clicks",
                "bca_klikbca", "bca_klikpay", "bri_epay", "echannel", "permata_va",
                "bca_va", "bni_va", "bri_va", "cimb_va", "other_va", "gopay", "indomaret"
            ],
            // shipping_address: {
            //     address: order[0].order_address,
            // }
        }

        const response = await fetch(`${process.env.REACT_APP_API}/v1/payment-links`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": basicAuth
            },
            body: JSON.stringify(data)
        })

        const payment_link = await response.json()
        console.log(payment_link.token);
        // console.log(payment_link);
        if (payment_link.payment_url) {
            // setPaymentUrl(payment_link.payment_url)
            setIsloading(true);
            const formData = new FormData();
            formData.append('id_transaction', order[0].id_transaction);
            formData.append('is_pay', 'Validating');
            formData.append('payment', payment_link.payment_url);
            // console.log("ini " + payment_link.payment_url);
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
            formData.append('at_update', date);

            try {
                const response = await axios.post(baseURLAPI("orders.php"), formData);
                if (response.data.success) {
                    getDataOrder();
                    window.open(payment_link.payment_url, '_blank');

                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        getDataOrder();
        // getPaymentLink();
        if (shippingInt <= 0 || isPay === "Validating") {
            const intervalId = setInterval(() => {
                getDataOrder();
            }, 5000);
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [shipping, isPay]);

    // HITUNG POTONGAN DISKON
    const hitungHargaSetelahDiskon = (hargaAsal, persentaseDiskon) => {
        const potonganDiskon = (hargaAsal * persentaseDiskon) / 100;
        return hargaAsal - potonganDiskon;
    };

    // KLIK SUDAH BAYAR
    const handleIsPay = async () => {
        getPaymentLink();
        // const formData = new FormData();
        // formData.append('id_transaction', order[0].id_transaction);
        // formData.append('is_pay', 'Validating');
        // if (paymentUrl) {
        //     formData.append('payment', paymentUrl);
        //     console.log("ini " + paymentUrl);
        // }
        // DATE
        // const current = new Date();
        // const monthNames = [
        //     "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        //     "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        // ];
        // const day = current.getDate();
        // const month = monthNames[current.getMonth()];
        // const year = current.getFullYear();
        // const hours = current.getHours();
        // const minutes = current.getMinutes();
        // const seconds = current.getSeconds();
        // const formattedDate = `${day} ${month} ${year} pukul ${hours}.${minutes}.${seconds}`;
        // const date = formattedDate;
        // formData.append('at_update', date);

        // try {
        //     const response = await axios.post(baseURLAPI("orders.php"), formData);
        //     if (response.data.success) {
        //         getDataOrder();
        //     }
        // } catch (error) {
        //     console.error(error);
        // }
    }

    // KONVERSI TGL
    function convertDateFormat(inputDate) {
        const parts = inputDate.split(' pukul ');
        // console.log(parts);
        if (parts.length === 2) {
            const datePart = parts[0];
            const timePart = parts[1].replace(/\./g, ':');

            // Konversi bulan ke angka
            const months = [
                "Januari", "Februari", "Maret", "April",
                "Mei", "Juni", "Juli", "Agustus",
                "September", "Oktober", "November", "Desember"
            ];
            const monthIndex = months.findIndex(month => datePart.includes(month));
            const month = (monthIndex + 1).toString().padStart(2, '0');

            // Mengonversi ke format yang sesuai dengan JavaScript
            const formattedDate = `2023-${month}-${datePart.substr(0, 2)}T${timePart}`;

            return formattedDate;
        } else {
            console.error("Format tanggal tidak valid.");
            return null; // Mengembalikan null untuk menunjukkan kesalahan
        }
    }

    //EXPIRED DATE STATUS GAGAL
    // let formattedDate2 = null;
    // const inputDate = expPayment;
    // if (inputDate) {
    //     const formattedDate = convertDateFormat(inputDate);
    //     formattedDate2 = formattedDate;
    //     // console.log("aman");
    // } else {
    //     console.log("expired_date tidak memiliki nilai yang valid");
    // }
    // const postExpDate = async () => {
    //     const formData = new FormData();
    //     formData.append('id_transaction', order[0].id_transaction);
    //     formData.append('status', order[0].status);
    //     formData.append('is_pay', 'expired');
    //     formData.append('note', 'Pesanan expired setelah 2 jam');
    //     try {
    //         const response = await axios.post(baseURLAPI("orders.php"), formData);
    //         if (response.data.success) {
    //             // userRowdata();
    //         }
    //     } catch (error) {
    //         console.error("Terjadi kesalahan:", error);
    //     }
    // }
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (status === 'Pending') {
    //             const now = format(new Date(), "yyyy-M-d'T'HH:mm:ss");
    //             // console.log((now));
    //             // console.log(formattedDate2);

    //             if (now > formattedDate2) {
    //                 // postExpDate();
    //                 console.log(formattedDate2);
    //             }
    //         } else {
    //             clearInterval(interval);
    //         }
    //     }, 4000);
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div className="outBody">
            <div className="body">
                <div className="header">
                    {isLoading ? (
                        <div style={{ textAlign: 'center', marginTop: '50%', color: 'var(--cyan)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle></svg>
                        </div>
                    ) : (
                        <>
                            {/* NAVBAR */}
                            <nav className="navbar text-center" style={{ position: 'fixed', padding: '12px' }}>
                                <div style={{ cursor: 'pointer' }} onClick={() => { window.history.back() }}>
                                </div>
                                <a class="navbar-brand" style={{ fontSize: '13px' }}><b>{shippingInt <= 0 ? "Menunggu Konfirmasi Admin" : order[0].is_pay === 'settlement' ? "Rincian Transaksi" : order[0].is_pay === 'Validating' ? "Menunggu Pembayaran" : order[0].is_pay === 'Failed' ? "Pesananmu Gagal !!!" : "Silahkan Membayar Sesuai Total Pembayaran"}</b></a>
                            </nav>

                            {order.length > 0 ? (
                                shippingInt <= 0 || shippingInt == null ? (
                                    <div style={{ textAlign: 'center', marginTop: '50%', color: 'var(--cyan)' }}>
                                        <p>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle></svg>
                                        </p>
                                        <p style={{ fontSize: '15px', marginTop: '-50px' }}>Mohon tunggu, admin sedang mempersiapkan pesanan</p>
                                        {order.length > 0 ? (
                                            <p style={{ fontSize: '13px', marginTop: '0px' }}>
                                                ID: {order[0].id_transaction}
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: '13px', marginTop: '0px' }}>ID: -</p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* DETAIL PESANAN */}
                                        <div className="body-products" style={{ marginTop: '10%' }}>
                                            <div style={{ width: '100%', textAlign: 'left', padding: '15px' }}>
                                                <div className="text-start d-flex justify-content-between">
                                                    <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                                                        Detail Pesanan
                                                    </p>
                                                </div>
                                                {order.map((item) => (
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

                                        {/* DETAIL PEMBAYARAN ++*/}
                                        <div className={order[0].status === "Gagal" ||order[0].status === "Sukses" ? 'body-products' : 'body-products'}  >
                                            <div style={{ width: '100%', textAlign: 'left', padding: '15px', fontSize: '15px' }}>
                                                <div className="d-flex justify-content-between text-dark" style={{ width: '100%' }}>
                                                    <div className="p-2 text-secondary"><small><b><p style={{ color: 'black', fontWeight: 'bold' }}>
                                                        Detail Pembayaran</p></b></small>
                                                    </div>
                                                    {order[0].is_pay === "settlement" && (
                                                        <div className="text-success">
                                                            <span className="text-success" style={{ fontWeight: 'bold' }}>Lunas </span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10 17l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9m-6-8L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4Z" /></svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div class="d-flex justify-content-between text-dark" style={{ width: '100%', marginTop: '-10px' }}>
                                                    <div class="p-2 text-secondary"><small><b>Tanggal</b></small></div>
                                                    <div class="p-2 text-dark" style={{ fontSize: '14px' }}><b>{order[0].at_created}</b></div>
                                                </div>
                                                <div class="d-flex justify-content-between text-dark" style={{ width: '100%', marginTop: '-10px' }}>
                                                    <div class="p-2 text-secondary"><small><b>ID Transaksi</b></small></div>
                                                    <div class="p-2 text-dark" style={{ fontSize: '14px' }}><b>{order[0].id_transaction}</b></div>
                                                </div>
                                                <div class="d-flex justify-content-between text-dark" style={{ width: '100%', marginTop: '-10px' }}>
                                                    <div class="p-2 text-secondary"><small><b>Subtotal</b></small></div>
                                                    <div class="p-2 text-dark" style={{ fontSize: '14px' }}><b>{Rupiah(order[0].amount)}</b></div>
                                                </div>
                                                <div class="d-flex justify-content-between text-dark" style={{ width: '100%', marginTop: '-10px' }}>
                                                </div>
                                                <div class="d-flex justify-content-between text-dark" style={{ width: '100%', marginTop: '0px' }}>
                                                    <div class="p-2 text-secondary"><small><b>Ongkir</b></small></div>
                                                    <div class="p-2 text-dark" style={{ fontSize: '14px' }}><b>{Rupiah(shippingInt)}</b></div>
                                                </div>
                                                <div class="d-flex justify-content-between text-dark" style={{ width: '100%', marginTop: '0px' }}>
                                                    <div class="p-2 text-secondary"><small><b>Total Pembayaran</b></small></div>
                                                    <div class="p-2 text-success" style={{ fontSize: '16px' }}><b>{Rupiah(parseInt(order[0].amount) + shippingInt)}</b></div>
                                                </div>
                                                {order[0].is_pay !== "settlement" || order[0].is_pay !== "Failed" && (
                                                    <div className="text-start mt-4" style={{ borderRadius: '5px', padding: '0px 15px', paddingTop: '15px', paddingBottom: '1px', background: 'rgb(235, 235, 235)', color: 'black' }}>
                                                        <p style={{ fontSize: '13px' }}><b>Info</b>: <br /><i>Rasakan pembayaran yang mudah, aman dan cepat, klik tombol "Bayar" untuk melakukan pembayaran</i></p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>


                                        {/* STATUS PESANAN */}
                                        {order[0].is_pay === "Failed" && (
                                            <div className="body-products-last"  >
                                                <div style={{ width: '100%', textAlign: 'left', padding: '15px' }}>
                                                    <div className="text-start d-flex justify-content-between">
                                                        <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                                                            Status Pesanan
                                                        </p>
                                                    </div>
                                                    <div style={{ alignItems: 'center', fontSize: '15px' }} className="d-flex justify-content-between">
                                                        <div class="p-2 text-dark"><b>{order[0].at_created}</b></div>
                                                        <small className={`${order[0].status === "Pending" || order[0].status === "Dikirim" ? "text-info" : order[0].status === "Gagal" ? "text-danger" : "text-success"}`} style={{ fontWeight: 'bold' }}>{order[0].status}</small>
                                                    </div>
                                                    {order[0].note === "" ? (
                                                        null
                                                    ) : (
                                                        <div className="text-start" style={{ borderRadius: '5px', padding: '0px 15px', paddingTop: '15px', paddingBottom: '1px', background: 'rgb(235, 235, 235)', color: 'black' }}>
                                                            <p style={{ fontSize: '13px' }}><b>Info</b>: <br /><i className="text-danger">{order[0].note}</i></p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* MODAL KLIK BAYAR SEKARANG */}
                                        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog" role="document" style={{fontSize: '15px'}}>
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h2 class="modal-title" id="exampleModalLabel">Peringatan !!</h2>
                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true" style={{fontSize: '15px'}}>&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body text-danger" style={{ fontWeight: 'bold' }}>
                                                        Lanjut bayar pesanan?
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" style={{fontSize: '15px'}} class="btn btn-primary" data-dismiss="modal">Belum</button>
                                                        <button type="button" style={{fontSize: '15px'}} class="btn btn-danger" data-dismiss="modal" onClick={handleIsPay}>Lanjut</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* BOTTOM NAVIGATION */}
                                        {order[0].is_pay !== "settlement" && (
                                            <footer class="bottom-nav navbar-light" style={{ padding: '0px', boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.30)', zIndex: '15', background: 'white', width: '100%', maxWidth: '450px' }}>
                                                <div className="in-body-category" style={{ padding: '12px' }}>
                                                    <div className="text-start d-flex justify-content-between" style={{ display: 'flex', alignItems: 'center' }}>
                                                        {order[0].is_pay === "Validating" || order[0].is_pay === "pending" ? (
                                                            <div className="bg-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '40px', textAlign: 'center', borderRadius: '10px', cursor: 'pointer' }} onClick={() => window.open(order[0].payment, '_blank')} >
                                                                <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }} >Selesaikan Pembayaran</p>
                                                            </div>
                                                        ) : order[0].is_pay === "settlement" || order[0].is_pay === "Failed" ? (
                                                            null
                                                        ) : (
                                                            <div className="bg-danger" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '40px', textAlign: 'center', borderRadius: '10px', cursor: 'pointer' }} data-toggle="modal" data-target="#exampleModal" >
                                                                <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }} >Bayar</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </footer>
                                        )}

                                        {/* CETAK STRUK */}
                                        {order[0].status === "Sukses" && (
                                            <footer class="bottom-nav navbar-light" style={{ padding: '0px', boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.30)', zIndex: '15', background: 'white', width: '100%', maxWidth: '450px' }}>
                                                <div className="in-body-category" style={{ padding: '12px' }}>
                                                    <div className="text-start d-flex justify-content-between" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div className="bg-success" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '40px', textAlign: 'center', borderRadius: '10px', cursor: 'pointer' }} onClick={() => window.open(order[0].payment, '_blank')} >
                                                            <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }} >Cetak Struk</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </footer>
                                        )}
                                    </>
                                )
                            ) : (
                                <p style={{ fontSize: '13px', marginTop: '0px' }}>ID: -</p>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}



