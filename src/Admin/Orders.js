import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { baseURLAPI, dataBicycle, dataOrders, dataOrdersAtom } from "../store";
import TruncateText from "../components/TruncateText";
import { Rupiah } from "../components/Rupiah";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import $ from "jquery";

export function Orders() {
    // const { orders } = useRecoilValue(dataOrders);
    // const [dataOrderss, setDataOrders] = useRecoilState(dataOrdersAtom);
    const [dataOrderss, setDataOrders] = useState([]);
    useEffect(() => {
        getDataOrders();
        const intervalId = setInterval(() => {
            getDataOrders();
        }, 8000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);



    // INPUT FORMAT PRICE
    const [addProductsShipping, setAddProductsShipping] = useState('');
    const [addProductsShippingNormal, setAddProductsShippingNormal] = useState();
    const handleAddProductsShipping = (event) => {
        const newValue = event.target.value.replace(/\D/g, '');
        setAddProductsShippingNormal(newValue);
        const formattedValue = Rupiah(newValue);
        setAddProductsShipping(formattedValue);
    };

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

    // TOAST ERROR
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

    // CONVERT STRING TO INT
    function convertToInteger(currencyString) {
        const numericString = currencyString.replace(/[^\d]/g, '');
        const integerValue = parseInt(numericString, 10);
        return integerValue;
    }

    // CHAT USER 
    const handleChatUser = (orderName, whatsapp, idTransaction) => {
        const whatsappLink = `https://wa.me/${whatsapp}?text=Hallo ${orderName}, pesanan kamu dengan nomor pesanan ${idTransaction} sedang kami siapkan, mohon untuk menunggu`;
        window.open(whatsappLink, "_blank");
    }

    // LOCATION USER
    const handleLocationUser = (location) => {
        const locationOnMaps = `https://www.google.com/maps/dir//${location}`;
        window.open(locationOnMaps, "_blank");
    }

    //CONVERT PHONE NUMBER FROM 0 TO 62
    const convertPhoneNumber = (phoneNumber) => {
        if (phoneNumber && phoneNumber.startsWith('0')) {
            return '62' + phoneNumber.slice(1);
        }
        return phoneNumber;
    };

    //HISTORY PRODUCT
    const [selectedProducts, setSelectedProducts] = useState(null);
    const handleProductsClick = (transaction) => {
        setSelectedProducts(transaction);
        $("#productsDetailModal");
    };

    // const [dataOrdersReload, setDataOrdersReload] = useState([]);
    const getDataOrders = () => {
        axios.get(baseURLAPI('orders.php/'))
            .then((response) => {
                setDataOrders(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }

    // ATUR ONGKIR
    const [selectedShipping, setSelectedShipping] = useState(null);
    const handleShippingClick = (transaction) => {
        setSelectedShipping(transaction);
        $("#shippingConfirmation");
    };
    const handleShipping = (idTransaction) => {
        const formDataPost = new FormData();
        formDataPost.append('id_transaction', idTransaction);
        formDataPost.append('shipping', addProductsShippingNormal);
        formDataPost.append('is_confirm_pay', false);
        axios.post(baseURLAPI("admin/shipping.php"), formDataPost)
            .then((response) => {
                if (response.data.success) {
                    showToastSuccess("Ongkir ditambahkan");
                    setTimeout(() => {
                        // setDataOrders(orders);
                        getDataOrders();
                    }, 1000);
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    // GAGALKAN
    const [note, setNote] = useState('');
    const handleNote = (event) => {
        setNote(event.target.value);
    };
    const [selectedOrderFailed, setSelectedOrderFailed] = useState(null);
    const handleOrderFailedClick = (idTransaction) => {
        setSelectedOrderFailed(idTransaction);
        $("#orderFailed");
    };
    const handleOrderFailed = (note) => {
        const formDataPost = new FormData();
        formDataPost.append('id_transaction', selectedOrderFailed);
        formDataPost.append('note', note);
        formDataPost.append('is_success', false);
        axios.post(baseURLAPI("admin/status_order.php"), formDataPost)
            .then((response) => {
                if (response.data.success) {
                    showToastSuccess("Pesanan digagalkan");
                    setTimeout(() => {
                        getDataOrders();
                    }, 1000);
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    //SUKSESKAN
    const handleOrderSuccess = (idTransaction) => {
        const formDataPost = new FormData();
        formDataPost.append('id_transaction', idTransaction);
        formDataPost.append('is_success', true);
        axios.post(baseURLAPI("admin/status_order.php"), formDataPost)
            .then((response) => {
                if (response.data.success) {
                    showToastSuccess("Pesanan Sukses");
                    setTimeout(() => {
                        getDataOrders();
                    }, 1000);
                }
            }).catch((error) => {
                console.log(error);
            });
    };

    //KONFIRMASI PEMBAYARAN
    const handleIsPay = (listProducts) => {
        const idTransactionArray = listProducts.map(product => product.id_transaction);
        const codeProductsArray = listProducts.map(product => product.code_products);
        const qtyArray = listProducts.map(product => product.qty);
        const stockArray = listProducts.map(product => product.stock);

        const formDataPost = new FormData();
        formDataPost.append('id_transaction', idTransactionArray);
        formDataPost.append('is_confirm_pay', true);
        formDataPost.append('shipping', '');
        formDataPost.append('code_products', codeProductsArray);
        formDataPost.append('qty', qtyArray);
        formDataPost.append('stock', stockArray);
        // formDataPost.append('is_pay', 'Yes');
        // formDataPost.append('status', 'Proses');
        axios.post(baseURLAPI("admin/shipping.php"), formDataPost)
            .then((response) => {
                if (response.data.success) {
                    showToastSuccess("Pembayaran telah dikonfirmasi, silahkan kirim barang");
                    setTimeout(() => {
                        getDataOrders();
                    }, 1000);
                }
            }).catch((error) => {
                console.log(error);
            });
    };

    //INFO NOTE MODAL
    const [selectedInfoNote, setSelectedInfoNote] = useState(null);
    const handleInfoNote = (note) => {
        setSelectedInfoNote(note)
    }

    //KIRIM BARANG STATUS
    const handleSendNow = (idTransaction) => {
        const formDataPost = new FormData();
        formDataPost.append('id_transaction', idTransaction);
        formDataPost.append('is_confirm_pay', false);
        formDataPost.append('shipping', '');
        axios.post(baseURLAPI("admin/shipping.php"), formDataPost)
            .then((response) => {
                if (response.data.success) {
                    showToastSuccess("Barang proses pengiriman");
                    setTimeout(() => {
                        getDataOrders();
                    }, 1000);
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    return (
        <body id="page-top">
            <ToastContainer />

            {/* SIDEBAR */}
            <div id="wrapper">
                <ul style={{ backgroundImage: "url('../../assets/imgs/bg-navbar.png')" }} class="navbar-nav sidebar sidebar-dark accordion" id="accordionSidebar">
                    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                        <div class="sidebar-brand-icon rotate-n-15">
                            <i class="fas fa-laugh-wink"></i>
                        </div>
                        <div class="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
                    </a>

                    <hr class="sidebar-divider my-0" />

                    <li class="nav-item">
                        <a class="nav-link" href="/admin">
                            <i class="fas fa-fw fa-tachometer-alt"></i>
                            <span>Dashboard</span></a>
                    </li>

                    <hr class="sidebar-divider" />

                    <div class="sidebar-heading">
                        Interface
                    </div>

                    <li class="nav-item">
                        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
                            aria-expanded="true" aria-controls="collapseTwo">
                            <i class="fas fa-fw fa-cog"></i>
                            <span>Components</span>
                        </a>
                        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                            <div class="bg-white py-2 collapse-inner rounded">
                                <h6 class="collapse-header">Custom Components:</h6>
                                <a class="collapse-item" href="buttons.html">Buttons</a>
                                <a class="collapse-item" href="cards.html">Cards</a>
                            </div>
                        </div>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities"
                            aria-expanded="true" aria-controls="collapseUtilities">
                            <i class="fas fa-fw fa-wrench"></i>
                            <span>Utilities</span>
                        </a>
                        <div id="collapseUtilities" class="collapse" aria-labelledby="headingUtilities"
                            data-parent="#accordionSidebar">
                            <div class="bg-white py-2 collapse-inner rounded">
                                <h6 class="collapse-header">Custom Utilities:</h6>
                                <a class="collapse-item" href="utilities-color.html">Colors</a>
                                <a class="collapse-item" href="utilities-border.html">Borders</a>
                                <a class="collapse-item" href="utilities-animation.html">Animations</a>
                                <a class="collapse-item" href="utilities-other.html">Other</a>
                            </div>
                        </div>
                    </li>

                    <hr class="sidebar-divider" />

                    <div class="sidebar-heading">
                        Addons
                    </div>

                    <li class="nav-item active">
                        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages"
                            aria-expanded="true" aria-controls="collapsePages">
                            <i class="fas fa-fw fa-folder"></i>
                            <span>Pages</span>
                        </a>
                        <div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                            <div class="bg-white py-2 collapse-inner rounded">
                                <h6 class="collapse-header">Tampilan Produk:</h6>
                                <a class="collapse-item" href="login.html">Order</a>
                                <a class="collapse-item" href="register.html">Keranjang</a>
                                <div class="collapse-divider"></div>
                                <h6 class="collapse-header">Tampilan User:</h6>
                                <a class="collapse-item" href="404.html">Informasi User</a>
                            </div>
                        </div>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="charts.html">
                            <i class="fas fa-fw fa-chart-area"></i>
                            <span>Charts</span></a>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="tables.html">
                            <i class="fas fa-fw fa-table"></i>
                            <span>Tables</span></a>
                    </li>

                    <hr class="sidebar-divider d-none d-md-block" />

                    <div class="text-center d-none d-md-inline">
                        <button class="rounded-circle border-0" id="sidebarToggle"></button>
                    </div>

                </ul>

                <div id="content-wrapper" class="d-flex flex-column">
                    <div id="content">
                        {/* NAVBAR */}
                        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                                <i class="fa fa-bars"></i>
                            </button>

                            <form
                                class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                <div class="input-group">
                                    <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..."
                                        aria-label="Search" aria-describedby="basic-addon2" />
                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="button">
                                            <i class="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <ul class="navbar-nav ml-auto">

                                <li class="nav-item dropdown no-arrow d-sm-none">
                                    <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-search fa-fw"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                        aria-labelledby="searchDropdown">
                                        <form class="form-inline mr-auto w-100 navbar-search">
                                            <div class="input-group">
                                                <input type="text" class="form-control bg-light border-0 small"
                                                    placeholder="Search for..." aria-label="Search"
                                                    aria-describedby="basic-addon2" />
                                                <div class="input-group-append">
                                                    <button class="btn btn-primary" type="button">
                                                        <i class="fas fa-search fa-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </li>

                                <li class="nav-item dropdown no-arrow mx-1">
                                    <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-bell fa-fw"></i>
                                        <span class="badge badge-danger badge-counter">3+</span>
                                    </a>
                                    <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="alertsDropdown">
                                        <h6 class="dropdown-header">
                                            Alerts Center
                                        </h6>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="mr-3">
                                                <div class="icon-circle bg-primary">
                                                    <i class="fas fa-file-alt text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="small text-gray-500">December 12, 2019</div>
                                                <span class="font-weight-bold">A new monthly report is ready to download!</span>
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="mr-3">
                                                <div class="icon-circle bg-success">
                                                    <i class="fas fa-donate text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="small text-gray-500">December 7, 2019</div>
                                                $290.29 has been deposited into your account!
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="mr-3">
                                                <div class="icon-circle bg-warning">
                                                    <i class="fas fa-exclamation-triangle text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="small text-gray-500">December 2, 2019</div>
                                                Spending Alert: We've noticed unusually high spending for your account.
                                            </div>
                                        </a>
                                        <a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                                    </div>
                                </li>

                                <li class="nav-item dropdown no-arrow mx-1">
                                    <a class="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-envelope fa-fw"></i>
                                        <span class="badge badge-danger badge-counter">7</span>
                                    </a>
                                    <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="messagesDropdown">
                                        <h6 class="dropdown-header">
                                            Message Center
                                        </h6>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="dropdown-list-image mr-3">
                                                <img class="rounded-circle" src="img/undraw_profile_1.svg"
                                                    alt="..." />
                                                <div class="status-indicator bg-success"></div>
                                            </div>
                                            <div class="font-weight-bold">
                                                <div class="text-truncate">Hi there! I am wondering if you can help me with a
                                                    problem I've been having.</div>
                                                <div class="small text-gray-500">Emily Fowler · 58m</div>
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="dropdown-list-image mr-3">
                                                <img class="rounded-circle" src="img/undraw_profile_2.svg"
                                                    alt="..." />
                                                <div class="status-indicator"></div>
                                            </div>
                                            <div>
                                                <div class="text-truncate">I have the photos that you ordered last month, how
                                                    would you like them sent to you?</div>
                                                <div class="small text-gray-500">Jae Chun · 1d</div>
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="dropdown-list-image mr-3">
                                                <img class="rounded-circle" src="img/undraw_profile_3.svg"
                                                    alt="..." />
                                                <div class="status-indicator bg-warning"></div>
                                            </div>
                                            <div>
                                                <div class="text-truncate">Last month's report looks great, I am very happy with
                                                    the progress so far, keep up the good work!</div>
                                                <div class="small text-gray-500">Morgan Alvarez · 2d</div>
                                            </div>
                                        </a>
                                        <a class="dropdown-item d-flex align-items-center" href="#">
                                            <div class="dropdown-list-image mr-3">
                                                <img class="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                                                    alt="..." />
                                                <div class="status-indicator bg-success"></div>
                                            </div>
                                            <div>
                                                <div class="text-truncate">Am I a good boy? The reason I ask is because someone
                                                    told me that people say this to all dogs, even if they aren't good...</div>
                                                <div class="small text-gray-500">Chicken the Dog · 2w</div>
                                            </div>
                                        </a>
                                        <a class="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                                    </div>
                                </li>

                                <div class="topbar-divider d-none d-sm-block"></div>

                                <li class="nav-item dropdown no-arrow">
                                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span>
                                        <img class="img-profile rounded-circle"
                                            src="img/undraw_profile.svg" />
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="userDropdown">
                                        <a class="dropdown-item" href="#">
                                            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Profile
                                        </a>
                                        <a class="dropdown-item" href="#">
                                            <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Settings
                                        </a>
                                        <a class="dropdown-item" href="#">
                                            <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Activity Log
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Logout
                                        </a>
                                    </div>
                                </li>

                            </ul>

                        </nav>

                        <div class="container-fluid">
                            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 class="h3 mb-0 text-gray-800">Tampilan Order</h1>
                                <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                    class="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
                            </div>

                            <div class="row">
                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-warning shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                        Semua Orderan</div>
                                                    <div class="h5 mb-0 font-weight-bold text-gray-800">18</div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-comments fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-xl-12 col-lg-7">
                                    <div class="card shadow mb-4">
                                        <div
                                            class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 class="m-0 font-weight-bold text-primary">Orderan</h6>
                                            {/* <div class="dropdown no-arrow">
                                                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                    aria-labelledby="dropdownMenuLink">
                                                    <div class="dropdown-header">Dropdown Header:</div>
                                                    <a class="dropdown-item" href="#">+ Kategori</a>
                                                    <a class="dropdown-item" href="#">Another action</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a class="dropdown-item" href="#">Something else here</a>
                                                </div>
                                            </div> */}
                                        </div>
                                        <div class="card-body" style={{ overflowX: 'auto' }}>
                                            {dataOrderss && dataOrderss.length > 0 ? (
                                                dataOrderss.map((item, index) => (
                                                    <>
                                                        <p>
                                                            <div className="d-flex justify-content-between">
                                                                <b>
                                                                    #{index + 1} -
                                                                    {item.order_name} (<span className="text-info" style={{ cursor: 'pointer' }} onClick={() => handleChatUser(item.order_name, convertPhoneNumber(item.whatsapp), item.id_transaction)}>{item.whatsapp}</span>)
                                                                </b>
                                                                {item.is_pay === 'Failed' ? (
                                                                    <b className={`bg-danger text-white`} onClick={() => handleInfoNote(item.note)}
                                                                        data-toggle="modal"
                                                                        data-target="#infoNote"
                                                                        style={{ cursor: 'pointer', borderRadius: '10px', padding: '5px', fontSize: '12px' }}>{item.is_pay}
                                                                    </b>
                                                                ) : (
                                                                    <b
                                                                        className={
                                                                            item.is_pay === 'No' ? `bg-primary text-white` :
                                                                                item.is_pay === 'Validating' ? `bg-warning text-white` :
                                                                                    `bg-success text-white`
                                                                        }
                                                                        style={{ borderRadius: '10px', padding: '5px', fontSize: '12px' }}>{item.is_pay}
                                                                    </b>
                                                                )}
                                                            </div>
                                                        </p>
                                                        <div style={{ marginLeft: '23px' }}>
                                                            <p className="text-info" onClick={() => handleLocationUser(item.order_address + ' ' + item.landmark)} style={{ marginTop: '-20px', fontStyle: 'italic', cursor: 'pointer' }}>
                                                                {item.order_address} ({item.landmark})
                                                            </p>
                                                            <div className="d-flex justify-content-between">
                                                                <p>Tgl. Pesan: {item.at_created}</p>
                                                                <p>ID Transaksi: <a href={`http://localhost:3000/pay?payment=${item.id_transaction}`} target="_blank">{item.id_transaction}</a></p>
                                                            </div>
                                                            <p style={{ marginTop: '-15px' }}>Tgl. Bayar: {item.at_updated} <a href={item.payment} target="_blank">{item.payment}</a></p>
                                                            <p>Ongkir: {item.shipping <= 0 ? (
                                                                <b className="bg-success text-white" data-toggle="modal" data-target="#shippingConfirmation" onClick={() => handleShippingClick(item)}
                                                                    style={{ cursor: 'pointer', borderRadius: '10px', padding: '5px', fontSize: '12px' }}>Atur Ongkir
                                                                </b>
                                                            ) : (
                                                                Rupiah(item.shipping)
                                                            )}</p>
                                                            <p style={{ marginTop: '-15px' }}>Total: {Rupiah(item.amount)}</p>
                                                            <hr style={{ marginTop: '-15px' }}></hr>
                                                            <p className="text-danger" style={{ marginTop: '-15px', fontWeight: 'bold' }}>Total Keseluruhan: {Rupiah(parseInt(item.shipping) + parseInt(item.amount))}
                                                                {item.is_pay === 'Validating' ? (
                                                                    <>
                                                                        <button className="btn btn-primary btn-sm m-2" onClick={() => handleIsPay(item.list_orders)}>Konfirmasi Pembayaran</button>
                                                                        <button className="btn btn-danger btn-sm m-2" data-toggle="modal" data-target="#orderFailed" onClick={() => handleOrderFailedClick(item.id_transaction)}>Gagalkan Pesanan</button>
                                                                    </>
                                                                ) : item.is_pay === 'settlement' ? (
                                                                    <>
                                                                        {item.status === 'Pending' && (
                                                                            <button className="btn btn-primary btn-sm m-2" onClick={() => handleSendNow(item.id_transaction)}>Kirim Barang Sekarang</button>
                                                                        )}
                                                                        {item.status === 'Dikirim' && (
                                                                            <button className="btn btn-success btn-sm m-2" onClick={() => handleOrderSuccess(item.id_transaction)}>Sukseskan Pesanan</button>
                                                                        )}
                                                                        <button className="btn btn-danger btn-sm m-2" data-toggle="modal" data-target="#orderFailed" onClick={() => handleOrderFailedClick(item.id_transaction)}>Gagalkan Semua Pesanan</button>
                                                                    </>
                                                                ) : item.is_pay === 'No' ? (
                                                                    <>
                                                                        <button className="btn btn-danger btn-sm m-2" data-toggle="modal" data-target="#orderFailed" onClick={() => handleOrderFailedClick(item.id_transaction)}>Gagalkan Pesanan</button>
                                                                    </>
                                                                ) : null}
                                                            </p>
                                                        </div>
                                                        <table
                                                            className="table table-hover"
                                                            style={{ minWidth: '800px', marginTop: '-10px', marginBottom: '50px' }}
                                                        >
                                                            <thead>
                                                                <tr className="bg-secondary text-white">
                                                                    <th scope="col">No</th>
                                                                    <th scope="col">Image</th>
                                                                    <th scope="col">Code</th>
                                                                    <th scope="col">Harga Barang</th>
                                                                    <th scope="col">Qty</th>
                                                                    <th scope="col">Status</th>
                                                                </tr>
                                                            </thead>
                                                            {item.list_orders && item.list_orders.length > 0 ? (
                                                                <tbody>
                                                                    {item.list_orders.map((items, indexs) => (
                                                                        <tr
                                                                            data-toggle="modal"
                                                                            data-target="#detailsProducts"
                                                                            key={indexs}
                                                                            onClick={() => handleProductsClick(items)}
                                                                        >
                                                                            <th scope="row">{indexs + 1}</th>
                                                                            <img src={items.image} width={50} alt="Product" />
                                                                            <td>{items.code_products}</td>
                                                                            <td>{Rupiah(items.price)}</td>
                                                                            <td>{items.qty}</td>
                                                                            <td>{items.status}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>

                                                            ) : (
                                                                <tbody>
                                                                    {/* Render a message or placeholder when no products are available */}
                                                                    <tr>
                                                                        <td colSpan="9">No products available for this order.</td>
                                                                    </tr>
                                                                </tbody>
                                                            )}
                                                        </table>
                                                    </>
                                                ))
                                            ) : (
                                                <p>No orders available.</p>
                                            )}

                                        </div>
                                    </div>
                                </div>

                                {/* <div class="col-xl-4 col-lg-5">
                                    <div class="card shadow mb-4">
                                        <div
                                            class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 class="m-0 font-weight-bold text-primary">Revenue Sources</h6>
                                            <div class="dropdown no-arrow">
                                                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                    aria-labelledby="dropdownMenuLink">
                                                    <div class="dropdown-header">Dropdown Header:</div>
                                                    <a class="dropdown-item" href="#">Action</a>
                                                    <a class="dropdown-item" href="#">Another action</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a class="dropdown-item" href="#">Something else here</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div class="chart-pie pt-4 pb-2">
                                                <canvas id="myPieChart"></canvas>
                                            </div>
                                            <div class="mt-4 text-center small">
                                                <span class="mr-2">
                                                    <i class="fas fa-circle text-primary"></i> Direct
                                                </span>
                                                <span class="mr-2">
                                                    <i class="fas fa-circle text-success"></i> Social
                                                </span>
                                                <span class="mr-2">
                                                    <i class="fas fa-circle text-info"></i> Referral
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                            <div class="row">

                                <div class="col-lg-6 mb-4">

                                    <div class="card shadow mb-4">
                                        <div class="card-header py-3">
                                            <h6 class="m-0 font-weight-bold text-primary">Projects</h6>
                                        </div>
                                        <div class="card-body">
                                            <h4 class="small font-weight-bold">Server Migration <span
                                                class="float-right">20%</span></h4>
                                            <div class="progress mb-4">
                                                <div class="progress-bar bg-danger" role="progressbar" style={{ width: '20%' }}
                                                    aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <h4 class="small font-weight-bold">Sales Tracking <span
                                                class="float-right">40%</span></h4>
                                            <div class="progress mb-4">
                                                <div class="progress-bar bg-warning" role="progressbar" style={{ width: '40%' }}
                                                    aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <h4 class="small font-weight-bold">Customer Database <span
                                                class="float-right">60%</span></h4>
                                            <div class="progress mb-4">
                                                <div class="progress-bar" role="progressbar" style={{ width: '60%' }}
                                                    aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <h4 class="small font-weight-bold">Payout Details <span
                                                class="float-right">80%</span></h4>
                                            <div class="progress mb-4">
                                                <div class="progress-bar bg-info" role="progressbar" style={{ width: '80%' }}
                                                    aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <h4 class="small font-weight-bold">Account Setup <span
                                                class="float-right">Complete!</span></h4>
                                            <div class="progress">
                                                <div class="progress-bar bg-success" role="progressbar" style={{ width: '100%' }}
                                                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-lg-6 mb-4">
                                            <div class="card bg-primary text-white shadow">
                                                <div class="card-body">
                                                    Primary
                                                    <div class="text-white-50 small">#4e73df</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 mb-4">
                                            <div class="card bg-success text-white shadow">
                                                <div class="card-body">
                                                    Success
                                                    <div class="text-white-50 small">#1cc88a</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 mb-4">
                                            <div class="card bg-info text-white shadow">
                                                <div class="card-body">
                                                    Info
                                                    <div class="text-white-50 small">#36b9cc</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 mb-4">
                                            <div class="card bg-warning text-white shadow">
                                                <div class="card-body">
                                                    Warning
                                                    <div class="text-white-50 small">#f6c23e</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 mb-4">
                                            <div class="card bg-danger text-white shadow">
                                                <div class="card-body">
                                                    Danger
                                                    <div class="text-white-50 small">#e74a3b</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 mb-4">
                                            <div class="card bg-secondary text-white shadow">
                                                <div class="card-body">
                                                    Secondary
                                                    <div class="text-white-50 small">#858796</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 mb-4">
                                            <div class="card bg-light text-black shadow">
                                                <div class="card-body">
                                                    Light
                                                    <div class="text-black-50 small">#f8f9fc</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 mb-4">
                                            <div class="card bg-dark text-white shadow">
                                                <div class="card-body">
                                                    Dark
                                                    <div class="text-white-50 small">#5a5c69</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="col-lg-6 mb-4">

                                    <div class="card shadow mb-4">
                                        <div class="card-header py-3">
                                            <h6 class="m-0 font-weight-bold text-primary">Illustrations</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="text-center">
                                                <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style={{ width: '25rem' }}
                                                    src="img/undraw_posting_photo.svg" alt="..." />
                                            </div>
                                            <p>Add some quality, svg illustrations to your project courtesy of <a
                                                target="_blank" rel="nofollow" href="https://undraw.co/">unDraw</a>, a
                                                constantly updated collection of beautiful svg images that you can use
                                                completely free and without attribution!</p>
                                            <a target="_blank" rel="nofollow" href="https://undraw.co/">Browse Illustrations on
                                                unDraw &rarr;</a>
                                        </div>
                                    </div>

                                    <div class="card shadow mb-4">
                                        <div class="card-header py-3">
                                            <h6 class="m-0 font-weight-bold text-primary">Development Approach</h6>
                                        </div>
                                        <div class="card-body">
                                            <p>SB Admin 2 makes extensive use of Bootstrap 4 utility classes in order to reduce
                                                CSS bloat and poor page performance. Custom CSS classes are used to create
                                                custom components and custom utility classes.</p>
                                            <p class="mb-0">Before working with this theme, you should become familiar with the
                                                Bootstrap framework, especially the utility classes.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                    <footer class="sticky-footer bg-white">
                        <div class="container my-auto">
                            <div class="copyright text-center my-auto">
                                <span>Copyright &copy; Your Website 2021</span>
                            </div>
                        </div>
                    </footer>

                </div>

            </div>

            <a class="scroll-to-top rounded" href="#page-top">
                <i class="fas fa-angle-up"></i>
            </a>

            {/* MODAL LOGOUT */}
            <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <a class="btn btn-primary" href="login.html">Logout</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DETAIL ORDER */}
            {selectedProducts && (
                <div class="modal fade" id="detailsProducts" tabindex="-1" aria-labelledby="detailsProductsLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="detailsProductsLabel">Detail Produk ({selectedProducts.status})</h5>
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <img id="detail_image" className="d-block mx-auto" src={selectedProducts.image} alt="slide" width={400} />
                                <form>
                                    <div class="mb-1">
                                        <label for="code" class="col-form-label">Kode:</label>
                                        <input type="text" name="code" class="form-control" id="code" value={selectedProducts.code_products} readOnly />
                                    </div>
                                    <div class="mb-1">
                                        <label for="name-products" class="col-form-label">Nama:</label>
                                        <textarea class="form-control" name="name_products" id="name-products" value={selectedProducts.name_products} readOnly></textarea>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-9">
                                            <div class="row">
                                                <div className="col-8 col-sm-6">
                                                    <div className="mb-1">
                                                        <label htmlFor="price-products" className="col-form-label">Harga Barang:</label>
                                                        <input type="text" className="form-control" id="price-products" value={Rupiah(selectedProducts.price)} readOnly />
                                                    </div>
                                                </div>

                                                <div class="col-4 col-sm-6">
                                                    <div class="mb-1">
                                                        <label for="stock" class="col-form-label">Qty:</label>
                                                        <input type="number" name="stock" class="form-control" id="stock" value={selectedProducts.qty} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </form>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
                                {/* {selectedProducts.status === 'Dikirim' && (
                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Gagalkan Pesanan Ini</button>
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ATUR ONGKIR */}
            {selectedShipping && (
                <div class="modal fade" id="shippingConfirmation" tabindex="-1" aria-labelledby="shippingConfirmationLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="shippingConfirmationLabel">Atur Ongkir</h5>
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="mb-1">
                                        <label for="code" class="col-form-label">Ongkir:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="price-products"
                                            value={addProductsShipping}
                                            onChange={handleAddProductsShipping}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => handleShipping(selectedShipping.id_transaction)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL GAGALKAN */}
            {selectedOrderFailed && (
                <div class="modal fade" id="orderFailed" tabindex="-1" aria-labelledby="orderFailedLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="orderFailedLabel">Atur Pesan ke User</h5>
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="mb-1">
                                        <label for="code" class="col-form-label">Note:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="price-products"
                                            onChange={handleNote}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => handleOrderFailed(note)}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL INFO NOTE */}
            <div class="modal fade" id="infoNote" tabindex="-1" aria-labelledby="infoNoteLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="infoNoteLabel">Alasan Pesanan di Gagalkan</h5>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-1">
                                    <label for="code" class="col-form-label">Note:</label>
                                    <p className="text-danger"><b>{selectedInfoNote}</b></p>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">close</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* SCRIPT */}
            <script src="vendor/jquery/jquery.min.js"></script>
            <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
            <script src="vendor/jquery-easing/jquery.easing.min.js"></script>
            <script src="js/sb-admin-2.min.js"></script>
            <script src="vendor/chart.js/Chart.min.js"></script>
            <script src="js/demo/chart-area-demo.js"></script>
            <script src="js/demo/chart-pie-demo.js"></script>

        </body>
    )
}