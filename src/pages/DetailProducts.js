import { useEffect, useState } from "react";
import PlusMinusButton from "../components/PlusMinusButton";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURLAPI } from "../store";


export function DetailProducts() {
    // const { id } = useParams();
    const id = localStorage.getItem("idProduct")
    const idUser = localStorage.getItem("@userID");
    const navigate = useNavigate();
    const [isLoading, setIsloading] = useState(true);

    // MENAMPILKAN SEMUA DATA
    const [data, setData] = useState('');
    const getData = async () => {
        axios.get(baseURLAPI("get_products.php/") + id)
            // axios.get("https://alikabike.000webhostapp.com/get_products.php/" + id)
            .then((response) => {
                setData(response.data)
            }).catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        getData();
        setTimeout(() => {
            setIsloading(false);
        }, 1000);
    }, []);

    // FORMAT DESKRIPSI PRODUK NEW LINE
    function DescriptionProduct({ text }) {
        if (text === undefined) {
            // Jika 'text' undefined, tampilkan pesan atau ambil tindakan yang sesuai
            return <p>Deskripsi produk tidak tersedia.</p>;
        }
        return (
            <div style={{ fontSize: '14px', color: 'gray' }}>
                {text.split('.').map((item, key) => (
                    <p style={{ marginTop: '-15px' }} key={key}>{item}</p>
                ))}
            </div>
        );
    }

    // TOAST SUKSES
    const showToastSuccess = (msg) => {
        toast.success(msg, {
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

    // VISIBILITY COMPONENT
    const [isDescriptionProductVisible, setDescriptionProductVisible] = useState(true);
    const toggleDescriptionProductVisibility = () => {
        setDescriptionProductVisible(!isDescriptionProductVisible);
    };

    const [isBuyVisible, setBuyVisible] = useState(true);
    const toggleBuyVisibility = () => {
        setBuyVisible(!isBuyVisible);
    };

    // HITUNG POTONGAN DISKON
    const hitungHargaSetelahDiskon = (hargaAsal, persentaseDiskon) => {
        const potonganDiskon = (hargaAsal * persentaseDiskon) / 100;
        return hargaAsal - potonganDiskon;
    };

    //FORMAT RUPIAH
    const formatRupiah = (amount) => {
        const formatter = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });

        return formatter.format(amount);
    };

    // TAMBAH JUMLAH PESANAN PADA BELI SEKARANG
    const [count, setCount] = useState(1);
    const increment = () => {
        if (count < data.stock) {
            setCount(count + 1);
        } else {
            showToastError(`Yaah stocknya tinggal ${data.stock}`)
        }
    };
    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    // TOTAL QTY SAAT PADA BASKET KE INT
    const [totalQty, setTotalQty] = useState('');
    const getDataProducts = () => {
        axios.get(baseURLAPI("get_qty.php/") + idUser + '/' + id)
            // axios.get("https://alikabike.000webhostapp.com/get_qty.php/" + idUser + '/' + id)
            .then((response) => {
                setTotalQty(response.data.qty);
            }).catch((error) => {
                console.log(error);
            });
    }

    // HITUNG JUMLAH PRODUK DALAM BASKET KE INT
    let [totalBasket, setTotalBasket] = useState('');
    const getTotalBasket = async () => {
        const id_user = localStorage.getItem('@userID');
        axios.get(baseURLAPI("basket.php/") + id_user)
            // axios.get("https://alikabike.000webhostapp.com/basket.php/" + id_user)
            .then((response) => {
                setTotalBasket(response.data.total_produk)
            }).catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        getTotalBasket();
        getDataProducts();
    }, []);

    // KLIK MASUKAN KERANJANG & DATE
    let total = count * hitungHargaSetelahDiskon(data.price, data.discount);
    const handleBasket = async () => {
        const storedUserID = localStorage.getItem('@userID');
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

        if (!storedUserID) {
            const id_user = uuidv4();
            localStorage.setItem('@userID', id_user);
            const formData = new FormData();
            formData.append('id_user', id_user);
            formData.append('code_products', data.code_products);
            formData.append('qty', 1);
            formData.append('amount', total);
            formData.append('basket_date', date);
            formData.append('payNow', 'No');
            const response = await axios.post(baseURLAPI("basket.php"), formData);
            // const response = await axios.post("https://alikabike.000webhostapp.com/basket.php", formData);
            if (response.data.success) {
                getTotalBasket();
                showToastSuccess('Produk Berhasil Ditambah')
            }
        } else {
            // JIKA QTY MELEBIHI STOK
            if (parseInt(totalQty) >= data.stock) {
                showToastError('Produk dalam keranjang melebihi stock')
                console.log(totalQty);
            } else {
                const formData = new FormData();
                formData.append('id_user', storedUserID);
                formData.append('code_products', data.code_products);
                formData.append('qty', 1);
                formData.append('amount', total);
                formData.append('basket_date', date);
                formData.append('payNow', 'No');

                const response = await axios.post(baseURLAPI("basket.php"), formData);
                // const response = await axios.post("https://alikabike.000webhostapp.com/basket.php", formData);
                if (response.data.success) {
                    getTotalBasket();
                    getDataProducts();
                    showToastSuccess('Produk Berhasil Ditambah')
                }

            }

        }
    }

    const handlePayNow = async () => {
        const storedUserID = localStorage.getItem('@userID');
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

        if (!storedUserID) {
            const id_user = uuidv4();
            localStorage.setItem('@userID', id_user);
            // const formData = new FormData();
            // formData.append('id_user', id_user);
            // formData.append('code_products', data.code_products);
            // formData.append('qty', 1);
            // formData.append('amount', total);
            // formData.append('basket_date', date);
            // formData.append('payNow', 'Yes');
            const productData = {
                code: data.code_products,
                count: count,
                total: total,
            };

            localStorage.setItem('@product', JSON.stringify(productData));
            // if (data.code_products) {
            //     navigate('/buy');
            // }
        } else {
            // // JIKA QTY MELEBIHI STOK
            // if (parseInt(totalQty) >= data.stock) {
            //     showToastError('Produk dalam keranjang melebihi stock')
            //     console.log(totalQty);
            // } else {
            // const formData = new FormData();
            // formData.append('id_user', storedUserID);
            // formData.append('code_products', data.code_products);
            // formData.append('qty', count);
            // formData.append('amount', total);
            // formData.append('basket_date', date);
            // formData.append('payNow', 'Yes');

            const productData = {
                code: data.code_products,
                name_products: data.name_products,
                count: count,
                discount: data.discount,
                image: data.image,
                price: data.price,
                total: total,
            };

            localStorage.setItem('@product', JSON.stringify(productData));

            if (data.code_products) {
                navigate('/buy');
            }
        }
    }

    return (
        <div className="outBody">
            <div className="body">
                <div className="header">
                    <ToastContainer />
                    {/* NAVBAR */}
                    <nav className="navbar" style={{ position: 'fixed' }}>
                        <div style={{ cursor: 'pointer' }} onClick={() => { window.history.back() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292" /></svg>

                        </div>
                        <ul className="nav-icon">
                            <li style={{ cursor: 'pointer' }}>
                                <a>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 1a2 2 0 0 0-1.98 2.284A7.003 7.003 0 0 0 5 10v8H4a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2h-1v-8a7.003 7.003 0 0 0-5.02-6.716A2 2 0 0 0 12 1Zm2 21a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1Z" clip-rule="evenodd" /></svg>
                                </a>
                            </li>
                            <li style={{ cursor: 'pointer' }} onClick={() => { navigate('/cart') }}>
                                <a>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" /><path fill="currentColor" d="M10.464 3.282a2 2 0 0 1 2.964-.12l.108.12L17.468 8h2.985a1.49 1.49 0 0 1 1.484 1.655l-.092.766l-.1.74l-.082.554l-.095.595l-.108.625l-.122.648l-.136.661c-.072.333-.149.667-.232.998a21.018 21.018 0 0 1-.832 2.584l-.221.54l-.214.488l-.202.434l-.094.194l-.249.49c-.32.61-.924.97-1.563 1.022l-.16.006H6.555a1.929 1.929 0 0 1-1.71-1.008l-.232-.45l-.18-.37a20.09 20.09 0 0 1-.095-.205l-.2-.449a21.536 21.536 0 0 1-1.108-3.276a32.366 32.366 0 0 1-.156-.654l-.142-.648l-.127-.634l-.112-.613l-.1-.587l-.087-.554l-.074-.513l-.09-.683l-.066-.556a39.802 39.802 0 0 1-.017-.153a1.488 1.488 0 0 1 1.348-1.64L3.543 8h2.989l3.932-4.718Zm-.503 9.44a1 1 0 0 0-1.96.326l.013.116l.5 3l.025.114a1 1 0 0 0 1.96-.326l-.013-.116l-.5-3l-.025-.114Zm5.203-.708a1 1 0 0 0-1.125.708l-.025.114l-.5 3a1 1 0 0 0 1.947.442l.025-.114l.5-3a1 1 0 0 0-.822-1.15ZM12 4.562L9.135 8h5.73L12 4.562Z" /></g></svg>
                                </a>
                                {totalBasket == 0 || totalBasket == null ? (
                                    null
                                ) : (
                                    <span class="badge badge-danger" style={{ marginTop: '-100px' }}>{totalBasket}</span>
                                )}
                            </li>
                        </ul>
                    </nav>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', marginTop: '50%', color: 'var(--cyan)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle></svg>
                        </div>
                    ) : (
                        <>
                            {/* CROUSEL */}
                            <div id="other" className="carousel slide carousel-fade" data-ride="carousel" style={{ marginTop: '70px' }}>
                                <ol className="carousel-indicators">
                                    <li data-target="#other" data-slide-to="0" className="active"></li>
                                    <li data-target="#other" data-slide-to="1"></li>
                                    <li data-target="#other" data-slide-to="2"></li>
                                </ol>
                                <div className="carousel-inner">
                                    <div className="carousel-item active" style={{ cursor: 'pointer' }} data-toggle="modal" data-target="#detailImage">
                                        <img className="d-block mx-auto" src={data.image} alt="slide" width={200} />
                                    </div>
                                </div>
                                <a className="carousel-control-prev bg-primary" href="#other" role="button" data-slide="prev" style={{ width: '30px' }}>
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="sr-only" >Previous</span>
                                </a>
                                <a className="carousel-control-next bg-primary" href="#other" role="button" data-slide="next" style={{ width: '30px' }}>
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>

                            {/* DETAIL IMAGE FROM CROUSEL */}
                            <div class="modal fade" id="detailImage" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <img id="detail_image" className="d-block mx-auto" src={data.image} alt="slide" width={400} />
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DETAIL PRODUCT */}
                            <div className="body-products">
                                <div style={{ width: '100%', textAlign: 'left', padding: '15px' }}>
                                    {data.stock <= 0 ? (
                                        <p className="text-danger"><b>Stock Habis!!!</b></p>
                                    ) : (
                                        <p className="text-success"><b>Tersedia di Toko</b></p>
                                    )}
                                    {data.discount == 0 || data.discount == null ? (
                                        null
                                    ) : (
                                        <p className="card-text" style={{ fontSize: '10px', color: 'rgb(255, 96, 96)', fontFamily: 'inherit' }}><button className="btn btn-info btn-sm" style={{ fontSize: '10px', marginRight: '5px' }}>{data.discount}%</button><s>{formatRupiah(data.price)}</s></p>
                                    )}
                                    <p className="card-text" style={{ fontSize: '15px', color: 'black', fontFamily: 'inherit', marginTop: '-10px' }}><b>{formatRupiah(hitungHargaSetelahDiskon(data.price, data.discount))}</b></p>
                                    <p style={{ fontSize: '16px', color: 'gray', marginTop: '-15px' }}>
                                        {data.name_products}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'rgba(128, 128, 128, 0.537)', marginTop: '-15px' }}>
                                        SKU: {data.code_products}
                                    </p>
                                    {/* <p style={{ fontSize: '11px', color: 'rgba(128, 128, 128, 0.537)', marginTop: '-15px', marginBottom: '0px' }}>
                                Belum ada ulasan
                            </p> */}
                                </div>
                            </div>

                            {/* DESKRIPSI PRODUCT */}
                            <div className="body-products-last">
                                <div style={{ width: '100%', textAlign: 'left', padding: '15px' }}>

                                    <div className="text-start d-flex justify-content-between">
                                        <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                                            Deskripsi Produk
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'blue', cursor: 'pointer' }} onClick={toggleDescriptionProductVisibility}>
                                            {isDescriptionProductVisible ? (
                                                'Sembunyikan Deskripsi'
                                            ) : (
                                                'Tampilkan Deskripsi'
                                            )}
                                        </p>
                                    </div>
                                    {!isDescriptionProductVisible ? (
                                        null
                                    ) : (
                                        data === undefined ? (
                                            null
                                        ) : (
                                            <DescriptionProduct
                                                text={data.description}
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* BOTTOM NAVIGATION */}
                            {data.stock <= 0 ? (
                                <footer class="bottom-nav navbar-light" style={{ padding: '0px', boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.30)', zIndex: '15', background: 'white', width: '100%', maxWidth: '450px' }}>
                                    <div className="in-body-category" style={{ display: 'flex', padding: '12px' }}>
                                        <div style={{ cursor: 'pointer', width: '200px', height: '40px', textAlign: 'center' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1FAF38" /><stop offset="100%" stop-color="#60D669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#F9F9F9" /><stop offset="100%" stop-color="#FFF" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416Zm40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513l10.706-39.082Z" /><path fill="#FFF" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" /></svg>
                                            <p style={{ fontSize: '9px', color: 'black', fontWeight: 'bold' }}>Chat Sekarang</p>
                                        </div>
                                        <div style={{ cursor: 'pointer', width: '200px', height: '40px', textAlign: 'center', color: 'red' }} onClick={() => showToastError(`Stok ${data.code_products} sedang habis saat ini`)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><g fill="currentColor"><path d="M27.707 6.293a1 1 0 0 1 0 1.414L25.414 10l2.293 2.293a1 1 0 0 1-1.414 1.414L24 11.414l-2.293 2.293a1 1 0 1 1-1.414-1.415L22.586 10l-2.293-2.293a1 1 0 1 1 1.415-1.414L24 8.586l2.293-2.293a1 1 0 0 1 1.414 0Zm-8.509 26.435A3.5 3.5 0 0 0 23 31.64v10.383L11 37.5v-7.504l8.198 2.732Z" /><path fill-rule="evenodd" d="m37 37.5l-12 4.523V31.64a3.5 3.5 0 0 0 3.802 1.088L37 29.996V37.5Zm-3.684-2.051a1 1 0 0 0-.632-1.898l-4.5 1.5a1 1 0 0 0 .632 1.898l4.5-1.5Zm-8.989-20.394a1 1 0 0 0-.654 0l-12.998 4.5l-.023.007a.996.996 0 0 0-.442.325l-3.99 4.988a1 1 0 0 0 .464 1.574l13.5 4.5a1 1 0 0 0 1.135-.376L24 26.743l2.68 3.83a1 1 0 0 0 1.136.376l13.5-4.5a1 1 0 0 0 .465-1.574l-3.99-4.988a.995.995 0 0 0-.466-.333l-12.998-4.499ZM24 23.942l9.943-3.442L24 17.058L14.057 20.5L24 23.942Z" clip-rule="evenodd" /></g></svg>
                                            <p style={{ fontSize: '10px', fontWeight: 'bold' }}>Stok Habis</p>
                                        </div>
                                    </div>
                                </footer>
                            ) : (
                                <footer class="bottom-nav navbar-light" style={{ padding: '0px', boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.30)', zIndex: '15', background: 'white', width: '100%', maxWidth: '450px' }}>
                                    <div className="in-body-category" style={{ display: 'flex', padding: '12px' }}>
                                        <div style={{ cursor: 'pointer', width: '200px', height: '40px', textAlign: 'center' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1FAF38" /><stop offset="100%" stop-color="#60D669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#F9F9F9" /><stop offset="100%" stop-color="#FFF" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416Zm40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513l10.706-39.082Z" /><path fill="#FFF" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" /></svg>
                                            <p style={{ fontSize: '9px', color: 'black', fontWeight: 'bold' }}>Chat Sekarang</p>
                                        </div>
                                        <div style={{ cursor: 'pointer', width: '200px', height: '40px', textAlign: 'center' }} onClick={handleBasket}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M4.383 5L6.93.757L6.07.243L3.217 5H.703A.703.703 0 0 0 0 5.703v.439c0 2.944.685 5.847 2.002 8.48a.685.685 0 0 0 .612.378h9.772c.26 0 .496-.146.612-.379A18.96 18.96 0 0 0 15 6.141v-.438A.703.703 0 0 0 14.297 5h-2.514L8.93.243l-.86.514L10.617 5H4.383ZM7 12v-2H5V9h2V7h1v2h2v1H8v2H7Z" clip-rule="evenodd" /></svg>
                                            <p style={{ fontSize: '9px', color: 'black', fontWeight: 'bold' }}>Masukan Keranjang</p>
                                        </div>
                                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '200px', height: '40px', textAlign: 'center', backgroundColor: 'green', borderRadius: '10px' }} onClick={toggleBuyVisibility}>
                                            <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }}>Beli Sekarang</p>
                                        </div>
                                    </div>
                                </footer>
                            )}

                            {/* PILIH BELI LANGSUNG */}
                            {isBuyVisible ? (null) : (
                                <footer class="basket-bottom navbar-light" style={{ boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.30)', zIndex: '15', background: 'white', width: '100%', maxWidth: '450px' }}>
                                    <div style={{ color: 'rgba(128, 128, 128, 0.537)', textAlign: 'center' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M1 10a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1Z" clip-rule="evenodd" /></svg>
                                    </div>
                                    <p><b>Beli Langsung</b></p>
                                    <div style={{ display: 'flex' }}>
                                        <img src={data.image} width={70} style={{ marginRight: '10px' }} />
                                        <div>
                                            <p style={{ fontSize: '13px', color: 'gray', marginTop: '-15px' }}>
                                                {data.name_products}
                                            </p>
                                            <p className="card-text" style={{ fontSize: '10px', color: 'rgb(255, 96, 96)', fontFamily: 'inherit', marginTop: '-10px' }}><button className="btn btn-info btn-sm" style={{ fontSize: '10px', marginRight: '5px' }}>{data.discount}%</button><s>{formatRupiah(data.price)}</s></p>
                                            <p className="card-text" style={{ fontSize: '13px', color: 'black', fontFamily: 'inherit', marginTop: '-10px' }}><b>{formatRupiah(hitungHargaSetelahDiskon(data.price, data.discount))}</b></p>
                                        </div>
                                    </div>
                                    <div className="text-start d-flex justify-content-between" style={{ display: 'flex', alignItems: 'center' }}>
                                        <p className="card-text" style={{ fontSize: '12px', color: 'black', fontFamily: 'inherit', marginTop: '15px' }}><b>Jumlah Pembelian: </b></p>
                                        {/* <PlusMinusButton /> */}
                                        <div style={{ marginLeft: '-50px' }}>
                                            <button onClick={decrement} className="btn btn-light btn-sm text-dark">
                                                <AiOutlineMinus className="text-sm text-md" />
                                            </button>
                                            <span className="text-dark" style={{ marginLeft: '10px', marginRight: '10px' }}>{count}</span>
                                            <button onClick={increment} className="btn btn-light btn-sm text-dark">
                                                <AiOutlinePlus className="text-sm text-md" />
                                            </button>
                                        </div>
                                        <p className="card-text" style={{ fontSize: '15px', color: 'green', fontFamily: 'inherit' }}><b>Total: {formatRupiah(total)}</b></p>
                                    </div>
                                    <div>
                                        <div className="in-body-category" style={{ display: 'flex', padding: '12px' }}>
                                            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '200px', height: '40px', textAlign: 'center', borderRadius: '10px', border: '1px solid blue', marginRight: '5px' }} onClick={() => { setBuyVisible(!isBuyVisible) }}>
                                                <p style={{ fontSize: '15px', color: 'blue', margin: 'auto' }}>Batal</p>
                                            </div>
                                            <div className="bg-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '200px', height: '40px', textAlign: 'center', borderRadius: '10px' }} onClick={handlePayNow}>
                                                <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }}>Beli</p>
                                            </div>
                                        </div>
                                    </div>
                                </footer>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}