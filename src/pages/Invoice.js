import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Rupiah } from "../components/Rupiah";
import { format, parse } from 'date-fns';
import { baseURLAPI } from "../store";


export function Invoice() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const payment = params.get("payment");
    const [isLoading, setIsloading] = useState(false);


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
            // enabled_payments: ["credit_card", "cimb_clicks",
            //     "bca_klikbca", "bca_klikpay", "bri_epay", "echannel", "permata_va",
            //     "bca_va", "bni_va", "bri_va", "cimb_va", "other_va", "gopay", "indomaret"
            // ],
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
        // console.log(payment_link.token);
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

    // useEffect(() => {
    //     getDataOrder();
    //     // getPaymentLink();
    //     if (shippingInt <= 0 || isPay === "Validating" || isPay === "pending" || order[0].status === "Pending" || order[0].status === "Dikirim") {
    //         const intervalId = setInterval(() => {
    //             getDataOrder();
    //         }, 8000);
    //         return () => {
    //             clearInterval(intervalId);
    //         };
    //     }
    // }, [shipping, isPay]);

    // HITUNG POTONGAN DISKON
    const hitungHargaSetelahDiskon = (hargaAsal, persentaseDiskon) => {
        const potonganDiskon = (hargaAsal * persentaseDiskon) / 100;
        return hargaAsal - potonganDiskon;
    };

    // KLIK SUDAH BAYAR
    const handleIsPay = async () => {
        // getPaymentLink();
    }
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
                            <nav className="navbar" style={{ position: 'fixed', padding: '12px' }}>
                                <div>
                                    <a className="navbar-brand" style={{ fontSize: '13px', fontWeight: 'bold' }}>ALIKA BIKE</a>
                                    <h5>Jl. Mancagahar Kec. Cikelet Kab. Garut</h5>
                                </div>
                                <div style={{ cursor: 'pointer' }} onClick={() => { window.history.back() }}>
                                    <a className="navbar-brand" style={{ fontSize: '13px' }}>INVOICE</a>
                                </div>
                            </nav>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}



