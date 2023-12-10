import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURLAPI } from "../store";

export function AddAddress() {
    const idUser = localStorage.getItem("@userID");
    const navigate = useNavigate();
    const [isLoading, setIsloading] = useState(false);


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

    // TOAST UKSES
    const showToastSuccess = (msg) => {
        toast.success(msg, {
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

    const [isFormValid, setIsFormValid] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        phoneNumber: '',
        address: '',
        landmark: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        checkFormValidity();
    };

    const checkFormValidity = () => {
        for (const key in formData) {
            if (formData[key] === "" || formData[key] === null) {
                setIsFormValid(false);
                return;
            }
        }
        setIsFormValid(true);
    };

    let textError = "Lengkapi data dengan benar"
    const handleSaveAddress = () => {
        checkFormValidity();
        if (isFormValid === true) {
            const formDataPost = new FormData();
            formDataPost.append('id_user', idUser);
            formDataPost.append('name', formData.username);
            formDataPost.append('whatsapp', formData.phoneNumber);
            formDataPost.append('location', formData.address);
            formDataPost.append('landmark', formData.landmark);
            formDataPost.append('at_created', date);
            axios.post(baseURLAPI("address.php"), formDataPost)
                // axios.post("https://alikabike.000webhostapp.com/address.php", formDataPost)
                .then((response) => {
                    if (response.data.success) {
                        setIsloading(true);
                        showToastSuccess("Alamat tersimpan");
                        setTimeout(() => {
                            window.history.back()
                        }, 2000);
                    }
                }).catch((error) => {
                    console.log(error);
                });

        } else {
            showToastInfo("Cek apakah data sudah benar");
        }
    };


    return (
        <div className="outBody">
            <div className="body">
                <div className="header">
                    <ToastContainer />

                    {/* NAVBAR */}
                    <nav className="navbar text-center" style={{ position: 'fixed' }}>
                        <div style={{ cursor: 'pointer' }} onClick={() => { window.history.back() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292" /></svg>
                        </div>
                        <a class="navbar-brand" style={{ fontSize: '15px' }}><b>Tambah Alamat Pengiriman</b></a>
                    </nav>

                    {/* FORMS */}
                    <div className="body-products" style={{ marginTop: '60px' }}>
                        <div style={{ width: '100%', textAlign: 'left', padding: '15px' }}>
                            <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                                Data Penerima
                            </p>
                            <form>
                                <div className="address">
                                    <input
                                        type="text"
                                        name="username"
                                        required
                                        autoComplete="off"
                                        autoFocus
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="username">Nama Lengkap</label>
                                </div>
                                <div className="address" style={{ marginTop: '-20px' }}>
                                    <input
                                        type="number"
                                        name="phoneNumber"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="phoneNumber">No. WhatsApp (08xxx)</label>
                                </div>
                                <p style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                                    Alamat Penerima
                                </p>
                                <div className="address">
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="address">Jl... Kp... Desa... Kecamatan...</label>
                                </div>
                                <div className="address" style={{ marginTop: '-20px' }}>
                                    <input
                                        type="text"
                                        name="landmark"
                                        required
                                        value={formData.landmark}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="landmark">Patokan dekat apa..</label>
                                </div>
                            </form>
                            {isFormValid ? (null) : (
                                <p className="card-text text-danger" style={{ fontSize: '12px', fontFamily: 'inherit', marginTop: '15px' }}><i>*{textError}</i></p>

                            )}
                        </div>
                    </div>

                    {/* BOTTOM NAVIGATION */}
                    <footer class="bottom-nav navbar-light" style={{ padding: '0px', boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.30)', zIndex: '15', background: 'white', width: '100%', maxWidth: '450px' }}>
                        <div className="in-body-category" style={{ padding: '12px' }}>
                            <div className="text-start d-flex justify-content-between" style={{ display: 'flex', alignItems: 'center' }}>
                                <p className="card-text text-danger" style={{ fontSize: '12px', fontFamily: 'inherit', marginTop: '15px' }}><i>*alamatmu akan disimpan untuk sementara saja</i></p>
                                {isLoading ? (
                                    <div className="bg-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'right', justifyContent: 'centeright', width: '250px', height: '40px', textAlign: 'center', borderRadius: '10px', }}>
                                        <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><circle cx="4" cy="12" r="3" fill="currentColor"><animate id="svgSpinners3DotsFade0" fill="freeze" attributeName="opacity" begin="0;svgSpinners3DotsFade1.end-0.25s" dur="0.75s" values="1;.2" /></circle><circle cx="12" cy="12" r="3" fill="currentColor" opacity=".4"><animate fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.15s" dur="0.75s" values="1;.2" /></circle><circle cx="20" cy="12" r="3" fill="currentColor" opacity=".3"><animate id="svgSpinners3DotsFade1" fill="freeze" attributeName="opacity" begin="svgSpinners3DotsFade0.begin+0.3s" dur="0.75s" values="1;.2" /></circle></svg>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'right', justifyContent: 'centeright', width: '250px', height: '40px', textAlign: 'center', borderRadius: '10px', }} onClick={handleSaveAddress}>
                                        <p style={{ fontSize: '15px', color: 'white', margin: 'auto' }}>
                                            Simpan Alamat
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}