import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { baseURLAPI, dataBicycle } from "../store";
import TruncateText from "../components/TruncateText";
import { Rupiah } from "../components/Rupiah";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import $ from "jquery";
import { useNavigate } from "react-router-dom";

export function HomeAdmin() {
    const navigate = useNavigate();
    // ALL PRODUCTS WITH LOGIC KATEGORI
    // const { bicycle } = useRecoilValue(dataBicycle);
    // const [posts, setPosts] = useRecoilState(dataBicycle)
    const [bicycle, setBicycle] = useState([]);

    const getDataProducts = () => {
        axios.get(baseURLAPI('bicycle.php/'))
            .then((response) => {
                setBicycle(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getDataProducts();
    }, []);

    // INPUT FORMAT PRICE
    const [addProductsPrice, setAddProductsPrice] = useState('');
    const [addProductsPriceNormal, setAddProductsPriceNormal] = useState();
    const handleAddProductsPrice = (event) => {
        const newValue = event.target.value.replace(/\D/g, '');
        setAddProductsPriceNormal(newValue);
        const formattedValue = Rupiah(newValue);
        setAddProductsPrice(formattedValue);
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

    // ADD PRODUCTS
    const [formAddProducts, setFormAddProducts] = useState({
        code: '',
        name_products: '',
        brand: '',
        description: '',
        url_img: '',
        price: '',
        stock: '',
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormAddProducts({ ...formAddProducts, [name]: value });
    };

    // UPDATE PRODUCTS
    const [formUpdateProducts, setFormUpdateProducts] = useState({
        code: '',
        name_products: '',
        brand: '',
        description: '',
        url_img: '',
        price: '',
        category: '',
        stock: '',
        discount: '',
    });
    const handleDetailProductsPrice = (event) => {
        const newValue = event.target.value.replace(/\D/g, '');
        const formattedValue = Rupiah(newValue);
        setFormUpdateProducts({ ...formUpdateProducts, price: formattedValue });
    };
    const handleInputChangeDetail = (e) => {
        const { name, value } = e.target;
        setFormUpdateProducts({ ...formUpdateProducts, [name]: value });
    };

    // ADD PRODUCTS DAN DETAIL PRODUCTS (UBAH)
    const hanldeFormAddProducts = (isChange) => {
        if (isChange) {
            const category = localStorage.getItem('@addProducts');
            const formDataPost = new FormData();
            formDataPost.append('isChange', isChange);
            formDataPost.append('id_products', selectedProducts.id_products);
            formDataPost.append('code_products', formUpdateProducts.code);
            formDataPost.append('brand_name', formUpdateProducts.brand);
            formDataPost.append('name_products', formUpdateProducts.name_products);
            formDataPost.append('description', formUpdateProducts.description);
            formDataPost.append('image', formUpdateProducts.url_img);
            formDataPost.append('stock', formUpdateProducts.stock);
            formDataPost.append('category', selectedProducts.category);
            formDataPost.append('discount', formUpdateProducts.discount);
            formDataPost.append('price', convertToInteger(formUpdateProducts.price));
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
            formDataPost.append('at_update', date);
            axios.post(baseURLAPI("admin/add_products.php"), formDataPost)
                .then((response) => {
                    if (response.data.success) {
                        showToastSuccess("Produk diubah");
                        setTimeout(() => {
                            getDataProducts()
                        }, 1000);
                    } else if (response.data.error) {
                        showToastError("Code Produk tidak boleh sama");
                    }
                }).catch((error) => {
                    console.log(error);
                });
        } else {
            const category = localStorage.getItem('@addProducts');
            const formDataPost = new FormData();
            formDataPost.append('isChange', isChange);
            formDataPost.append('code_products', formAddProducts.code);
            formDataPost.append('brand_name', formAddProducts.brand);
            formDataPost.append('name_products', formAddProducts.name_products);
            formDataPost.append('description', formAddProducts.description);
            formDataPost.append('image', formAddProducts.url_img);
            formDataPost.append('stock', formAddProducts.stock);
            formDataPost.append('category', category);
            formDataPost.append('price', addProductsPriceNormal);
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
            formDataPost.append('at_created', date);
            axios.post(baseURLAPI("admin/add_products.php"), formDataPost)
                .then((response) => {
                    if (response.data.success) {
                        showToastSuccess("Produk tersimpan");
                        setTimeout(() => {
                            getDataProducts()
                        }, 2000);
                    }
                }).catch((error) => {
                    console.log(error);
                });
        }
    }

    // SET CATEGORY PADA MODAL
    let x = null;
    const handleCategory = (categoryProducts) => {
        localStorage.setItem('@addProducts', categoryProducts);
        let category = localStorage.getItem('@addProducts');
        x = category
        document.getElementById('categoryValue').innerText = x;
    }

    // LOGIC 'BARU SAJA' 'KEMARIN' DATE
    function formatRelativeDateWithoutTime(dateString) {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        // Parsing teks menjadi objek Date
        const dateParts = dateString.split('pukul')[0].trim().split(' ');
        const day = parseInt(dateParts[0], 10);
        const monthIndex = months.indexOf(dateParts[1]);
        const year = parseInt(dateParts[2], 10);
        const date = new Date(year, monthIndex, day);

        // Mendapatkan tanggal saat ini
        const today = new Date();

        // Menghitung perbedaan dalam milidetik
        const timeDiff = today.getTime() - date.getTime();
        const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

        if (diffDays === 0) {
            return 'Baru saja';
        } else if (diffDays === 1) {
            return 'Kemarin';
        } else {
            // Mengembalikan format tanggal
            const formattedDate = `${day} ${months[monthIndex]} ${year}`;
            // console.log(timeDiff);
            return formattedDate;
        }
    }

    //HISTORY PRODUCT
    const [selectedProducts, setSelectedProducts] = useState(null);
    const handleProductsClick = (transaction) => {
        setSelectedProducts(transaction);
        setFormUpdateProducts({
            code: transaction.code_products,
            name_products: transaction.name_products,
            brand: transaction.brand_name,
            description: transaction.description,
            url_img: transaction.image,
            price: Rupiah(transaction.price),
            stock: transaction.stock,
            discount: transaction.discount,
        });
        $("#productsDetailModal");
    };

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

                    <li class="nav-item active">
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

                    <li class="nav-item">
                        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages"
                            aria-expanded="true" aria-controls="collapsePages">
                            <i class="fas fa-fw fa-folder"></i>
                            <span>Pages</span>
                        </a>
                        <div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                            <div class="bg-white py-2 collapse-inner rounded">
                                <h6 class="collapse-header">Tampilan Produk:</h6>
                                <a class="collapse-item" onClick={() => { navigate('/admin/order') }}>Order</a>
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
                                <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
                                <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                                    class="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
                            </div>

                            <div class="row">

                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-success shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                        Monthly Income</div>
                                                    <div class="h5 mb-0 font-weight-bold text-gray-800">Rp 400.000.000</div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-danger shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                                        Monthly Expenses</div>
                                                    <div class="h5 mb-0 font-weight-bold text-gray-800">Rp 400.000.000</div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-info shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Tasks
                                                    </div>
                                                    <div class="row no-gutters align-items-center">
                                                        <div class="col-auto">
                                                            <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">50%</div>
                                                        </div>
                                                        <div class="col">
                                                            <div class="progress progress-sm mr-2">
                                                                <div class="progress-bar bg-info" role="progressbar"
                                                                    style={{ width: '50%' }}
                                                                    aria-valuenow="50"
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                                <div class="col-xl-3 col-md-6 mb-4">
                                    <div class="card border-left-warning shadow h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                        Validating Requests</div>
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
                                            <h6 class="m-0 font-weight-bold text-primary">Products</h6>
                                            <div class="dropdown no-arrow">
                                                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                    aria-labelledby="dropdownMenuLink">
                                                    <div class="dropdown-header">Dropdown Header:</div>
                                                    <a class="dropdown-item" href="#">+ Kategori</a>
                                                    {/* <a class="dropdown-item" href="#">Another action</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a class="dropdown-item" href="#">Something else here</a> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body" style={{ overflowX: 'auto' }}>
                                            {bicycle.map((item) => {
                                                return (
                                                    <>
                                                        <p>
                                                            <b>{item.name_category}</b>
                                                            <a style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleCategory(item.name_category)} title="Tambah Products" data-toggle="modal" data-target="#addProducts">
                                                                <i class="fas fa-plus fa-sm fa-fw text-success"></i>
                                                            </a>
                                                        </p>
                                                        <table class="table table-hover" style={{ minWidth: '800px', marginTop: '-10px', marginBottom: '50px' }}>
                                                            <thead>
                                                                <tr className="bg-secondary text-white">
                                                                    <th scope="col">No</th>
                                                                    <th scope="col">Image</th>
                                                                    <th scope="col">Code</th>
                                                                    <th scope="col">Name</th>
                                                                    <th scope="col">Stock</th>
                                                                    <th scope="col">Diskon</th>
                                                                    <th scope="col">Price</th>
                                                                    <th scope="col">Dibuat</th>
                                                                    <th scope="col">Diubah</th>
                                                                </tr>
                                                            </thead>
                                                            {item.produk.map((items, indexs) => (
                                                                <tbody>
                                                                    <tr data-toggle="modal" data-target="#detailsProducts" key={indexs} onClick={() => handleProductsClick(items)} className={items.stock <= 0 ? 'bg-danger text-white' : items.stock <= 2 ? 'bg-warning text-white' : ''}>
                                                                        <th scope="row">{indexs + 1}</th>
                                                                        <img src={items.image} width={50} />
                                                                        <td>{items.code_products}</td>
                                                                        <td>{TruncateText(items.name_products)}</td>
                                                                        <td><b>{items.stock <= 0 ? "Habis" : items.stock}</b></td>
                                                                        <td><b>{items.discount}</b></td>
                                                                        <td>{Rupiah(items.price)}</td>
                                                                        <td>{formatRelativeDateWithoutTime(items.at_created)}</td>
                                                                        <td>{items.at_update}</td>
                                                                    </tr>
                                                                </tbody>
                                                            ))}
                                                        </table>
                                                    </>
                                                )
                                            })}
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

            {/* MODAL ADD PRODUCTS */}
            <div class="modal fade" id="addProducts" tabindex="-1" aria-labelledby="addProductsLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addProductsLabel">Tambah Produk (<b><span id="categoryValue"></span></b>)</h5>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="mb-1">
                                    <label for="code" class="col-form-label">Kode:</label>
                                    <input type="text" name="code" class="form-control" id="code" onChange={handleInputChange} />
                                </div>
                                <div class="mb-1">
                                    <label for="name-products" class="col-form-label">Nama:</label>
                                    <input type="text" name="name_products" class="form-control" id="name-products" onChange={handleInputChange} />
                                </div>
                                <div class="mb-1">
                                    <label for="brand" class="col-form-label">Brand:</label>
                                    <input type="text" name="brand" class="form-control" id="brand" onChange={handleInputChange} />
                                </div>
                                <div class="mb-1">
                                    <label for="description" class="col-form-label">Deskripsi:</label>
                                    <textarea class="form-control" name="description" id="description" onChange={handleInputChange}></textarea>
                                </div>
                                <div class="mb-1">
                                    <label for="url-img" class="col-form-label">Url Gambar:</label>
                                    <input type="text" name="url_img" class="form-control" id="url-img" onChange={handleInputChange} />
                                </div>
                                <div class="row">
                                    <div class="col-sm-9">
                                        <div class="row">
                                            <div className="col-8 col-sm-6">
                                                <div className="mb-1">
                                                    <label htmlFor="price-products" className="col-form-label">Harga:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="price-products"
                                                        value={addProductsPrice}
                                                        onChange={handleAddProductsPrice}
                                                    />
                                                </div>
                                            </div>

                                            <div class="col-4 col-sm-6">
                                                <div class="mb-1">
                                                    <label for="stock" class="col-form-label">Stok:</label>
                                                    <input type="number" name="stock" class="form-control" id="stock" onChange={handleInputChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" type="button" data-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => hanldeFormAddProducts(0)}>Simpan</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DETAIL PRODUCTS */}
            {selectedProducts && (
                <div class="modal fade" id="detailsProducts" tabindex="-1" aria-labelledby="detailsProductsLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="detailsProductsLabel">Detail Produk</h5>
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>                        </div>
                            <div class="modal-body">
                                <form>
                                    <div class="mb-1">
                                        <label for="code" class="col-form-label">ID Produk:</label>
                                        <input type="text" name="code" class="form-control" id="code" value={selectedProducts.id_products} readOnly />
                                    </div>
                                    <div class="mb-1">
                                        <label for="code" class="col-form-label">Kode:</label>
                                        <input type="text" name="code" class="form-control" id="code" value={formUpdateProducts.code} onChange={handleInputChangeDetail} />
                                    </div>
                                    <div class="mb-1">
                                        <label for="name-products" class="col-form-label">Nama:</label>
                                        <textarea class="form-control" name="name_products" id="name-products" value={formUpdateProducts.name_products} onChange={handleInputChangeDetail}></textarea>
                                    </div>
                                    <div class="mb-1">
                                        <label for="brand" class="col-form-label">Brand:</label>
                                        <input type="text" name="brand" class="form-control" id="brand" value={formUpdateProducts.brand} onChange={handleInputChangeDetail} />
                                    </div>
                                    <div class="mb-1">
                                        <label for="description" class="col-form-label">Deskripsi:</label>
                                        <textarea class="form-control" name="description" id="description" value={formUpdateProducts.description} onChange={handleInputChangeDetail}></textarea>
                                    </div>
                                    <div class="mb-1">
                                        <label for="url-img" class="col-form-label">Url Gambar:</label>
                                        <input type="text" name="url_img" class="form-control" id="url-img" value={formUpdateProducts.url_img} onChange={handleInputChangeDetail} />
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <div class="row">
                                                <div className="col-8 col-sm-6">
                                                    <div className="mb-1">
                                                        <label htmlFor="price-products" className="col-form-label">Harga:</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="price-products"
                                                            name="price"
                                                            // value={addProductsPrice}
                                                            value={formUpdateProducts.price}
                                                            onChange={handleDetailProductsPrice}
                                                        />
                                                    </div>
                                                </div>

                                                <div class="col-2 col-sm-3">
                                                    <div class="mb-1">
                                                        <label for="stock" class="col-form-label">Stok:</label>
                                                        <input type="number" name="stock" class="form-control" id="stock" value={formUpdateProducts.stock} onChange={handleInputChangeDetail} />
                                                    </div>
                                                </div>

                                                <div class="col-2 col-sm-3">
                                                    <div class="mb-1">
                                                        <label for="discount" class="col-form-label">Discount(%):</label>
                                                        <input type="number" name="discount" class="form-control" id="discount" value={formUpdateProducts.discount} onChange={handleInputChangeDetail} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-secondary" type="button" data-dismiss="modal">Batal</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => hanldeFormAddProducts(1)}>Ubah</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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