import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { dataInfo, dataProductsBicycleDiscount, dataProductsDiscount, dataProductsSparePart } from "../store";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import TruncateText from "../components/TruncateText";
import { Rupiah } from "../components/Rupiah";


export function Home() {
    const navigate = useNavigate();
    const [isLoading, setIsloading] = useState(true);


    //MENAMPILKAN INFO
    const { info } = useRecoilValue(dataInfo);

    //MENAMPILKAN PRODUK DISKON
    const { productsDiscount } = useRecoilValue(dataProductsDiscount);

    //MENAMPILKAN SEPEDA DISKON
    const { productsBicycleDiscount } = useRecoilValue(dataProductsBicycleDiscount)

    //MENAMPILKAN PRODUK DISKON
    const { productsSparePart } = useRecoilValue(dataProductsSparePart)

    useEffect(() => {
        setTimeout(() => {
            setIsloading(false);
        }, 1000);
    }, []);

    // HITUNG POTONGAN DISKON
    const hitungHargaSetelahDiskon = (hargaAsal, persentaseDiskon) => {
        const potonganDiskon = (hargaAsal * persentaseDiskon) / 100;
        return hargaAsal - potonganDiskon;
    };

    //GET DATA DETAIL PRODUCT
    const toDetailProduct = (idProduct) => {
        localStorage.setItem('idProduct', idProduct);
        navigate('/product');
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
                            <Navbar />

                            {/* LAYANAN KATEGORI */}
                            <div className="container">
                                <div className="body-category">
                                    <div className="in-body-category">
                                        <div className="category">
                                            <div className="category-nav">
                                                <div className="category-link-nav">
                                                    <a href="#">
                                                        <span class="badge badge-danger" style={{ marginTop: '-100px', fontSize: '10px' }}>soon</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><path fill="#EF6C00" d="m37.4 24.6l-11.6-2.2l-3.9-11.2l-3.8 1.3L22 23.6l-7.8 9l3 2.6l7.8-9l11.6 2.2l.8-3.8z" /><g fill="#FF9800"><path d="M24 19c-2.8 0-5 2.2-5 5s2.2 5 5 5s5-2.2 5-5s-2.2-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2z" /><path d="M40.7 27c.2-1 .3-2 .3-3s-.1-2-.3-3l3.3-2.4c.4-.3.6-.9.3-1.4L40 9.8c-.3-.5-.8-.7-1.3-.4L35 11c-1.5-1.3-3.3-2.3-5.2-3l-.4-4.1c-.1-.5-.5-.9-1-.9h-8.6c-.5 0-1 .4-1 .9L18.2 8c-1.9.7-3.7 1.7-5.2 3L9.3 9.3c-.5-.2-1.1 0-1.3.5l-4.3 7.4c-.3.5-.1 1.1.3 1.4L7.3 21c-.2 1-.3 2-.3 3s.1 2 .3 3L4 29.4c-.4.3-.6.9-.3 1.4L8 38.2c.3.5.8.7 1.3.4L13 37c1.5 1.3 3.3 2.3 5.2 3l.4 4.1c.1.5.5.9 1 .9h8.6c.5 0 1-.4 1-.9l.4-4.1c1.9-.7 3.7-1.7 5.2-3l3.7 1.7c.5.2 1.1 0 1.3-.4l4.3-7.4c.3-.5.1-1.1-.3-1.4L40.7 27zM24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11s11 4.9 11 11s-4.9 11-11 11z" /></g></svg>
                                                        <p style={{ fontSize: '9px' }}>Layanan Bengkel</p>
                                                    </a>
                                                    <a href="#">
                                                        <span class="badge badge-danger" style={{ marginTop: '-100px', fontSize: '10px' }}>soon</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32"><defs><radialGradient id="vscodeIconsFolderTypeServicesOpened0" cx="20.365" cy="6.269" r="2.721" gradientTransform="matrix(-.148 .989 1.059 .158 11.812 -5.692)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#bedcdc" /><stop offset=".5" stopColor="#8e9e9e" stopOpacity=".74" /><stop offset="1" stopColor="#404f5c" stopOpacity=".84" /></radialGradient><radialGradient id="vscodeIconsFolderTypeServicesOpened1" cx="6.566" cy="14.644" r="3.9" gradientTransform="matrix(-.148 .989 1.059 .158 9.451 15.181)" href="#vscodeIconsFolderTypeServicesOpened0" /></defs><path fill="#7bbedb" d="M27.4 5.5h-9.2l-2.1 4.2H4.3v4H.5l3.8 12.8h25.2v-21Zm-7.2 2.1h7.1v2.1h-8.1Zm5.5 6.1H6.6v-1.9h20.8v7.626Z" /><path fill="silver" d="m13.886 12.006l-1.803 1.803l-.901-1.803l.901-.901l1.803.901zm2.886-.094h-2.551L14.859 10h1.274l.639 1.912zm2.105 1.974l-1.803-1.803l1.803-.901l.902.901l-.902 1.803zm.094 2.886v-2.551l1.912.638v1.274l-1.912.639zm-1.974 2.105l1.803-1.803l.901 1.803l-.901.902l-1.803-.902zm-2.885.094h2.55l-.637 1.912H14.75l-.638-1.912zm-2.106-1.974l1.803 1.803l-1.803.901l-.901-.901l.901-1.803zm-.094-2.885v2.55L10 16.025V14.75l1.912-.638z" /><path fill="silver" d="M11.663 15.442a3.778 3.778 0 1 1 1.107 2.672a3.778 3.778 0 0 1-1.107-2.672Zm3.779 1.425a1.425 1.425 0 1 0-1.008-.418a1.425 1.425 0 0 0 1.008.418Z" /><path fill="#a9a9a9" d="M15.5 18.939a3.5 3.5 0 1 0-3.555-3.439a3.5 3.5 0 0 0 3.555 3.439Zm-.113-6.457a2.96 2.96 0 1 1-2.907 3.012a2.961 2.961 0 0 1 2.91-3.012Z" /><path fill="url(#vscodeIconsFolderTypeServicesOpened0)" d="M15.489 18.162a2.721 2.721 0 1 0-2.767-2.673a2.72 2.72 0 0 0 2.767 2.673Zm-.075-4.275a1.555 1.555 0 1 1-1.528 1.583a1.555 1.555 0 0 1 1.528-1.583Z" /><path fill="#a9a9a9" d="M15.47 17a1.555 1.555 0 1 0-1.583-1.526A1.555 1.555 0 0 0 15.47 17Zm-.051-2.87a1.316 1.316 0 1 1-1.292 1.339a1.316 1.316 0 0 1 1.292-1.337Z" /><path fill="silver" d="m27.572 19.763l-1.706-.947l1.098-1.176l1.024.568l-.416 1.555zm1.636 2.356l-1.005-1.672l1.539-.47l.603 1.004l-1.137 1.138zm.238 2.859l-.034-1.951l1.568.363l.02 1.17l-1.554.418zm-1.223 2.594l.946-1.706l1.176 1.098l-.567 1.024l-1.555-.416zm-2.357 1.636l1.673-1.005l.469 1.539l-1.003.603l-1.139-1.137zm-2.859.238l1.952-.034l-.363 1.568l-1.171.02l-.418-1.554zm-2.594-1.223l1.706.946l-1.098 1.176l-1.024-.567l.416-1.555zm-1.636-2.357l1.005 1.673l-1.539.469l-.603-1.003l1.137-1.139zm-.238-2.859l.034 1.952l-1.567-.363l-.021-1.171l1.554-.418zm1.224-2.594l-.947 1.706l-1.176-1.098l.568-1.024l1.555.416zm2.356-1.636l-1.672 1.005l-.47-1.539l1.004-.603l1.138 1.137zm2.859-.238l-1.951.034l.363-1.567l1.17-.021l.418 1.554z" /><path fill="silver" d="M23.9 18.372a5.626 5.626 0 1 1-3.946 1.716a5.625 5.625 0 0 1 3.946-1.716Zm-2.017 5.658a2.112 2.112 0 1 0 .592-1.5a2.11 2.11 0 0 0-.592 1.5Z" /><path fill="#a9a9a9" d="M24.081 29.045a5.053 5.053 0 1 0-5.14-4.964a5.054 5.054 0 0 0 5.14 4.964Zm-.163-9.327a4.275 4.275 0 1 1-4.2 4.35a4.275 4.275 0 0 1 4.2-4.35Z" /><path fill="url(#vscodeIconsFolderTypeServicesOpened1)" d="M24.061 27.893a3.9 3.9 0 1 0-3.967-3.832a3.9 3.9 0 0 0 3.967 3.832Zm-.105-6.027a2.128 2.128 0 1 1-2.09 2.164a2.127 2.127 0 0 1 2.089-2.164Z" /><path fill="#a9a9a9" d="M24.033 26.324a2.331 2.331 0 1 0-2.372-2.291a2.331 2.331 0 0 0 2.372 2.291Zm-.075-4.3a1.973 1.973 0 1 1-1.938 2.007a1.972 1.972 0 0 1 1.938-2.007Z" /></svg>
                                                        <p style={{ fontSize: '9px' }}>Home Service</p>
                                                    </a>
                                                    <a href="#">
                                                        <span class="badge badge-danger" style={{ marginTop: '-100px', fontSize: '10px' }}>soon</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 128 128"><path fill="#78a3ad" d="M103.65 73.56L92.1 79.15l-3.5-2.08l3.46-1.61s2.87-1.42 5.5-3.84c.74-.67 1.45-1.41 2.08-2.24c.51-.66.98-1.51 1.39-2.47c1.18-2.81 1.73-6.69.56-10.48c-1.69-5.46-5.88-9.75-11.94-10.58c-.4-.06-.78-.14-1.2-.17c-.29-.02-.56-.03-.85-.03c-.25 0-.5.03-.75.04c-1.02.05-1.99.18-2.89.36c-2.87.59-4.93 1.64-4.93 1.64l-4.82 2.02l-.07-2.29L85.4 38.9l3.33-2.52l.88-.67L91.43 37l16.9 11.89V71.3l-1.07.52l-3.61 1.74zM19.7 111.7c-1.09-.63-1.92-1.7-2.58-2.74L8.85 95.14l.01-.01l-.22-.47c-1.03-1.86-1.52-3.97-1.24-6.07c.01-.08.12-.48.23-.96c.08-.33.16-.7.23-1.04l5.23-17.89l.25-.86c.18-.37.36-.71.55-.96c.25-.34.6-.52 1-.63c.02-.01.05-.02.08-.03c.34-.07.71-.07 1.08-.05l2.14.32L34 68.87l.08.02c.24.03.44.07.68.13c.86.24 1.73.49 2.54.87c.97.46 1.84 1.21 2.34 2.17c.12.23.27.44.39.67l9.62 17.63c.18.53.48 1.01.64 1.54c.19.65.26 1.38.24 2.05c-.04.95-.25 1.89-.54 2.8l-6.48 14.89c-.04.06-.07.12-.11.19c-.1.21-.16.43-.27.67c-.12.29-.35.59-.52.86c-.26.41-.64.66-1.04.86c-.76.37-1.69.46-2.53.45c-.08 0-.18.01-.26.01l-.12-.01l-15.13-1.9c-1.29-.25-2.7-.41-3.83-1.07z" /><path fill="#fff" d="m49.97 59.51l-10.31 4.6l-17.88-2.68L32.9 56.5z" /><path fill="#78a3ad" d="m74.4 55.64l6.77-2.84l.35-.16c.01 0 .48-.23 1.23-.5s1.79-.58 2.97-.77c.61-.1 1.23-.17 1.89-.17l.53.02c.15.01.27.05.42.06c5.21.53 7.15 4.89 7.75 6.79c.82 2.68.22 5.52-.59 7.15c-.15.31-.31.59-.47.8c-.41.53-.88 1.04-1.39 1.51c-.3.27-.6.53-.91.78c.08-.33.14-.67.19-1.01c.14-.94.16-1.91.08-2.88c-.18-1.97-.77-3.93-1.67-5.57c-.71-1.29-2.06-3.36-3.71-3.95c-.45-.16-.92-.24-1.41-.13c-.83.19-.82.97-.42 1.61c.41.66.78 1.35 1.12 2.06c.39.83.74 1.67 1.01 2.54c.21.65.36 1.31.48 1.97c.18.99.27 1.99.26 2.99c-.02.94-.12 1.88-.32 2.8c-.18.82-.43 1.64-.77 2.43c-.02.08-.07.14-.09.22l-2.67 1.25c0-.02.01-.03.02-.05c.54-1.49.69-3.15.55-4.79c-.09-1.05-.29-2.1-.61-3.1c-.28-.89-.64-1.75-1.07-2.53c-.09-.14-.18-.31-.27-.47c-.54-.92-1.32-2.03-2.27-2.79c-.77-.63-1.64-1.02-2.58-.81c-.84.19-.82.97-.42 1.61c.85 1.37 1.56 2.86 2.06 4.4c.02.07.05.13.08.19c.14.44.25.88.36 1.33c.51 2.26.51 4.58-.04 6.82c-.17.69-.38 1.38-.66 2.05c-.07.17-.16.34-.25.51l-.11.06l-2.54 1.18c.05-.11.1-.22.13-.34c.24-.64.38-1.31.48-1.99c.15-1.04.17-2.12.05-3.2c-.21-1.85-.8-3.68-1.64-5.23c-.38-.7-.96-1.62-1.66-2.42c-.8-.91-1.76-1.63-2.82-1.68c-.21-.01-.42-.02-.64.03c-.83.19-.82.97-.42 1.61c.43.7.82 1.42 1.17 2.17c.38.79.71 1.6.97 2.43c.39 1.23.62 2.48.7 3.73c.06 1.05.02 2.1-.14 3.14c-.16 1.07-.44 2.14-.86 3.18l-9.16-17.44l5.49-2.3l5.47-2.3zm-4.97 27.88l-11.16 5.11l-2.6 1.19l-11.76-21.55l1.7-.76l2.54-1.13l9.94-4.45l.24.45l9.58 18.24l1.28 2.45z" /><path fill="#fff" d="m104.89 30.12l14.14 11.11l-7.58 3.09l-15.81-11.13z" /><path fill="#2f2f2f" d="M127.05 41.04c0-.03 0-.06-.02-.09c0-.02-.02-.03-.03-.05c-.14-.3-.32-.57-.53-.8c-.03-.04-.08-.08-.12-.12c-.06-.05-.11-.12-.17-.17l-19.05-14.97c-.73-.57-1.7-.74-2.58-.45l-15.87 5.27h-.01c-.04.01-.06.03-.1.05c-.22.08-.43.19-.63.33c-.02.01-.04.02-.07.03L69.66 43.88c-.71.55-1.12 1.4-1.09 2.3l.19 5.84l-8.74 3.67c-.07-.02-.13-.05-.19-.06l-26.78-4.71c-.54-.09-1.1-.03-1.6.19l-19.79 8.75c-.09.04-.16.13-.25.18c-.97.2-1.79.92-2.09 1.93L.87 90.82c-.22.74-.12 1.54.27 2.2l13.85 23.18c.44.73 1.19 1.22 2.03 1.32l26.36 3.31l.33.02h.01c.25 0 .48-.04.72-.1c.07-.02.13-.05.21-.07c.08-.03.17-.05.24-.08l18.65-8.65c.6-.28 1.09-.78 1.37-1.4l10.87-24.61l.03-.1c.02-.05.03-.1.04-.14c.1-.3.16-.61.15-.93v-.03c-.01-.33-.1-.65-.22-.97c-.02-.03-.01-.06-.03-.1c-.01-.02-.02-.03-.03-.04c-.02-.03-.02-.06-.04-.09l-.19-.35l7.04-3.28l8.01 4.77c.43.26.92.39 1.42.39c.41 0 .83-.09 1.21-.28l19.12-9.26h.02l13.38-6.63c.95-.46 1.55-1.42 1.55-2.48V42c.01-.33-.07-.65-.19-.96zm-23.4 32.52L92.1 79.15l-3.5-2.08l3.46-1.61s2.87-1.42 5.5-3.84c.74-.67 1.45-1.41 2.08-2.24c.51-.66.98-1.51 1.39-2.47c1.18-2.81 1.73-6.69.56-10.48c-1.69-5.46-5.88-9.75-11.94-10.58c-.4-.06-.78-.14-1.2-.17c-.29-.02-.56-.03-.85-.03c-.25 0-.5.03-.75.04c-1.02.05-1.99.18-2.89.36c-2.87.59-4.93 1.64-4.93 1.64l-4.82 2.02l-.07-2.29L85.4 38.9l3.33-2.52l.88-.67L91.43 37l16.9 11.89V71.3l-1.07.52l-3.61 1.74zM19.7 111.7c-1.09-.63-1.92-1.7-2.58-2.74L8.85 95.14l.01-.01l-.22-.47c-1.03-1.86-1.52-3.97-1.24-6.07c.01-.08.12-.48.23-.96c.08-.33.16-.7.23-1.04l5.23-17.89l.25-.86c.18-.37.36-.71.55-.96c.25-.34.6-.52 1-.63c.02-.01.05-.02.08-.03c.34-.07.71-.07 1.08-.05l2.14.32L34 68.87l.08.02c.24.03.44.07.68.13c.86.24 1.73.49 2.54.87c.97.46 1.84 1.21 2.34 2.17c.12.23.27.44.39.67l9.62 17.63c.18.53.48 1.01.64 1.54c.19.65.26 1.38.24 2.05c-.04.95-.25 1.89-.54 2.8l-6.48 14.89c-.04.06-.07.12-.11.19c-.1.21-.16.43-.27.67c-.12.29-.35.59-.52.86c-.26.41-.64.66-1.04.86c-.76.37-1.69.46-2.53.45c-.08 0-.18.01-.26.01l-.12-.01l-15.13-1.9c-1.29-.25-2.7-.41-3.83-1.07zm30.27-52.19l-10.3 4.61l-17.89-2.69L32.9 56.5l17.07 3.01zm24.43-3.87l6.77-2.84l.35-.16c.01 0 .48-.23 1.23-.5s1.79-.58 2.97-.77c.61-.1 1.23-.17 1.89-.17l.53.02c.15.01.27.05.42.06c5.21.53 7.15 4.89 7.75 6.79c.82 2.68.22 5.52-.59 7.15c-.15.31-.31.59-.47.8c-.41.53-.88 1.04-1.39 1.51c-.3.27-.6.53-.91.78c.08-.33.14-.67.19-1.01c.14-.94.16-1.91.08-2.88c-.18-1.97-.77-3.93-1.67-5.57c-.71-1.29-2.06-3.36-3.71-3.95c-.45-.16-.92-.24-1.41-.13c-.83.19-.82.97-.42 1.61c.41.66.78 1.35 1.12 2.06c.39.83.74 1.67 1.01 2.54c.21.65.36 1.31.48 1.97c.18.99.27 1.99.26 2.99c-.02.94-.12 1.88-.32 2.8c-.18.82-.43 1.64-.77 2.43c-.02.08-.07.14-.09.22l-2.67 1.25c0-.02.01-.03.02-.05c.54-1.49.69-3.15.55-4.79c-.09-1.05-.29-2.1-.61-3.1c-.28-.89-.64-1.75-1.07-2.53c-.09-.14-.18-.31-.27-.47c-.54-.92-1.32-2.03-2.27-2.79c-.77-.63-1.64-1.02-2.58-.81c-.84.19-.82.97-.42 1.61c.85 1.37 1.56 2.86 2.06 4.4c.02.07.05.13.08.19c.14.44.25.88.36 1.33c.51 2.26.51 4.58-.04 6.82c-.17.69-.38 1.38-.66 2.05c-.07.17-.16.34-.25.51l-.11.06l-2.54 1.18c.05-.11.1-.22.13-.34c.24-.64.38-1.31.48-1.99c.15-1.04.17-2.12.05-3.2c-.21-1.85-.8-3.68-1.64-5.23c-.38-.7-.96-1.62-1.66-2.42c-.8-.91-1.76-1.63-2.82-1.68c-.21-.01-.42-.02-.64.03c-.83.19-.82.97-.42 1.61c.43.7.82 1.42 1.17 2.17c.38.79.71 1.6.97 2.43c.39 1.23.62 2.48.7 3.73c.06 1.05.02 2.1-.14 3.14c-.16 1.07-.44 2.14-.86 3.18l-9.16-17.44l5.49-2.3l5.47-2.3zm-4.97 27.88l-11.17 5.1l-2.6 1.19l-11.75-21.54l1.7-.76l2.55-1.14l9.94-4.45l.24.45l9.58 18.24l1.28 2.45l.23.46zm35.46-53.4l14.14 11.12l-7.57 3.08l-15.82-11.13l9.25-3.07z" /></svg>
                                                        <p style={{ fontSize: '9px' }}>Suku Cadang</p>
                                                    </a>
                                                    <a href="#">
                                                        <span class="badge badge-danger" style={{ marginTop: '-100px', fontSize: '10px' }}>soon</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 64 64"><g fill="#62727a"><path d="M27.5 51c0-3 2.3-5.5 5-5.5h.6l19 2c2 .3 3.4 1.7 3.4 3.5s-1.4 3.2-3.4 3.5l-19 2h-.6c-2.7 0-5-2.5-5-5.5m1 0c0 2.4 1.9 4.5 4 4.5h.5l19-2c1.3-.2 2.6-1 2.6-2.5s-1.3-2.3-2.6-2.5l-19-2h-.4c-2.2 0-4.1 2.1-4.1 4.5" /><path d="M40 51c0-6.6 5.4-12 12-12s12 5.4 12 12s-5.4 12-12 12s-12-5.4-12-12m2 0c0 5.5 4.5 10 10 10s10-4.5 10-10s-4.5-10-10-10s-10 4.5-10 10M0 51c0-6.6 5.4-12 12-12s12 5.4 12 12s-5.4 12-12 12S0 57.6 0 51m2 0c0 5.5 4.5 10 10 10s10-4.5 10-10s-4.5-10-10-10S2 45.5 2 51" /></g><path fill="#42ade2" d="M42 51c0-5.5 4.5-10 10-10s10 4.5 10 10s-4.5 10-10 10s-10-4.5-10-10m2 0c0 4.4 3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8M2 51c0-5.5 4.5-10 10-10s10 4.5 10 10s-4.5 10-10 10S2 56.5 2 51m2 0c0 4.4 3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8" /><path fill="#ff9d27" d="M61.3 41.7C53 33.7 39.4 39.4 39 51c0 1.3-2 1.3-2 0c.4-13.4 16.1-19.9 25.7-10.7c.9.9-.5 2.3-1.4 1.4m-58.6 0c8.3-8 21.9-2.3 22.3 9.3c0 1.3 2 1.3 2 0c-.4-13.4-16.1-19.9-25.7-10.7c-.9.9.5 2.3 1.4 1.4" /><path fill="#42ade2" d="M51 50c-.7-5.8-4.2-10.7-9.5-13.2c-1.2-.6-.1-2.3 1-1.7c6 2.9 9.7 8.4 10.5 14.9c.2 1.3-1.8 1.3-2 0" /><path fill="#b2c1c0" d="M15.5 22.1c2.2-1.5 5.2-2 7.8-2c1.3 0 1.3 2 0 2c-1.9 0-3.9.3-5.7 1.1l2.1 2.1c.2.2.4.6.3 1c-.5 1.3-1 2.7-1.5 4c-.4 1.2-2.4.7-1.9-.5c.4-1.2.9-2.3 1.3-3.5l-2.5-2.5c-.6-.6-.4-1.3.1-1.7" /><g fill="#42ade2"><path d="m35.046 50.698l6.008-18.025l1.897.632l-6.008 18.026z" /><path d="M12.6 51.8c4.8-4 3.5-11.2 3.1-12.8l2.4-7.9c3 .4 14.1 2.6 19.6 12.4l1.7-1C32.7 30.2 18.2 29 17.6 29l-.8-.1l-3.1 10l.1.3c0 .1 1.8 7.5-2.4 11l1.2 1.6" /></g><g fill="#62727a"><path d="M28 20.1h-4.5v2H28c.3 0 .5-.2.5-.5v-1c0-.3-.2-.5-.5-.5" /><circle cx="12" cy="51" r="1" /></g><path fill="#42ade2" d="M16.5 31.1c2.8 1.4 5 4 6.8 6.8c2.9 4.4 5.1 11.2 11.3 11.9h17.5c1.3 0 1.3 2 0 2H34.8c-10.1 0-11-14.3-18.2-18.6l-.1-2.1" /><circle cx="52" cy="51" r="2" fill="#62727a" /><path fill="#b2c1c0" d="m41.04 32.72l1.992-5.977l1.898.632l-1.993 5.977z" /><path fill="#62727a" d="M40.6 26.1c3.8 0 3.8-2.1 7.1-2.1c.8 0 2 1 2.2 1.8c.3.8-.8 2.4-1.3 3.1c-.7.9-1.7 1.4-2.6.9c-1.3-.8-2.6-1.7-6.1 0c-.8.4-2.1-.6-2-2.9c.1-.7 1.1-.8 2.7-.8M36 51.8h2.6c.5 0 1 .4 1 1s-.5 1-1 1H36c-.5 0-1-.4-1-1s.4-1 1-1" /><circle cx="33" cy="51" r="4" fill="#b2c1c0" /><path fill="#e8e8e8" d="M32.7 52c-1.7-.7-3.3-1.3-5-2c-1.2-.5-.7-2.4.5-1.9c1.7.7 3.3 1.3 5 2c1.2.4.7 2.3-.5 1.9" /><path fill="#62727a" d="M26.8 48h2.5c.6 0 1 .4 1 1s-.4 1-1 1h-2.5c-.6 0-1-.4-1-1s.4-1 1-1m-2.3-25.5c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5s.5.2.5.5v3" /></svg>
                                                        <p style={{ fontSize: '9px' }}>Beli Sepeda</p>
                                                    </a>
                                                    {/* <a href="">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                </a> */}
                                                </div>
                                            </div>
                                        </div>
                                        <hr style={{ marginTop: '-1px', border: 'none' }} />
                                    </div>
                                </div>
                            </div>

                            {/* CROUSEL */}
                            <div>
                                <Swiper
                                    effect={'coverflow'}
                                    grabCursor={true}
                                    centeredSlides={true}
                                    loop={true}
                                    slidesPerView={'auto'}
                                    coverflowEffect={{
                                        rotate: 0,
                                        stretch: 0,
                                        depth: 100,
                                        modifier: 2.5,
                                    }}
                                    pagination={{ el: '.swiper-pagination', clickable: true }}
                                    navigation={{
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                        clickable: true,
                                    }}
                                    modules={[EffectCoverflow, Pagination, Navigation]}
                                    className="swiper_container"
                                >
                                    {info.map((item) => (
                                        <SwiperSlide>
                                            <img src={item.image} alt="slide_image" />
                                        </SwiperSlide>
                                    ))}


                                    <div className="slider-controler">
                                        <div className="swiper-button-prev slider-arrow">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.29 8.71L9.7 11.3a.996.996 0 0 0 0 1.41l2.59 2.59c.63.63 1.71.18 1.71-.71V9.41c0-.89-1.08-1.33-1.71-.7z" /></svg>
                                        </div>
                                        <div className="swiper-button-next slider-arrow">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m11.71 15.29l2.59-2.59a.996.996 0 0 0 0-1.41L11.71 8.7c-.63-.62-1.71-.18-1.71.71v5.17c0 .9 1.08 1.34 1.71.71z" /></svg>                                        </div>
                                        {/* <div className="swiper-pagination"></div> */}
                                    </div>
                                </Swiper>
                            </div>

                            {/* BUTTON PROMO/TERBARU/TERLARIS */}
                            <div style={{ display: 'flex', paddingLeft: '10px', marginTop: '20px', marginBottom: '5px' }}>
                                <button type="button" className="btn btn-sm btn-outline-primary mr-2 activated " style={{ fontSize: '10px' }}>Promo</button>
                                {/* <button type="button" className="btn btn-sm btn-outline-primary mr-2" style={{ fontSize: '10px' }}>Terbaru</button>
                                <button type="button" className="btn btn-sm btn-outline-primary" style={{ fontSize: '10px' }}>Terlaris</button> */}
                            </div>

                            {/* PRODUK PROMO/TERBARU/TERLARIS */}
                            <div className="body-ptt">
                                <div className="scrollmenu">
                                    <div>
                                        {productsDiscount.map((item) => (
                                            <a onClick={() => { toDetailProduct(item.code_products) }}>
                                                <div className="card">
                                                    <div className="card-body">
                                                        {/* <h5 className="card-title">Special title treatment</h5> */}
                                                        {/* <small className="modernWay" style={{ fontSize: '12px', color: 'gray' }}>Pabrik Sepeda Motor Listrik Exotic Cooltech AX Garansi Pabrik</small> */}
                                                        <p><img src={item.image} width={100} /></p>
                                                        <div style={{ width: '150px', textAlign: 'left', marginLeft: '-10px', padding: '10px' }}>
                                                            <small style={{ fontSize: '12px', color: 'gray' }}>
                                                                {TruncateText(item.name_products, 35)}
                                                                {/* Pabrik Sepeda Motor Listrik Exotic Cooltech AX Garansi Pabrik */}
                                                            </small>
                                                            <p className="card-text" style={{ fontSize: '10px', color: 'rgb(255, 96, 96)', fontFamily: 'inherit' }}><button className="btn btn-info btn-sm" style={{ fontSize: '10px', marginRight: '5px' }}>{item.discount}%</button><s>{Rupiah(item.price)}</s></p>
                                                            <p className="card-text" style={{ fontSize: '15px', color: 'gray', fontFamily: 'inherit', marginTop: '-10px' }}><b>{Rupiah(hitungHargaSetelahDiskon(item.price, item.discount))}</b></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* PRODUK SEPEDA DISKON*/}
                            <div className="body-products-sepeda">
                                <div style={{ paddingTop: '10px', paddingLeft: '10px', marginBottom: '-25px' }}>
                                    <h3><b>Sepeda Diskon</b></h3>
                                </div>
                                <div className="scrollmenu">
                                    <div style={{ marginLeft: '150px' }}>
                                        <div>
                                            {productsBicycleDiscount.map((item) => (
                                                <a onClick={() => { toDetailProduct(item.code_products) }}>
                                                    <div className="card">
                                                        <div className="card-body">
                                                            {/* <h5 className="card-title">Special title treatment</h5> */}
                                                            {/* <small className="modernWay" style={{ fontSize: '12px', color: 'gray' }}>Pabrik Sepeda Motor Listrik Exotic Cooltech AX Garansi Pabrik</small> */}
                                                            <p><img src={item.image} width={100} /></p>
                                                            <div style={{ width: '150px', textAlign: 'left', marginLeft: '-10px', padding: '10px' }}>
                                                                <small style={{ fontSize: '12px', color: 'gray' }}>
                                                                    {/* {truncateText("Pabrik Sepeda Motor Listrik Exotic Cooltech AX Garansi Pabrik")} */}
                                                                    {TruncateText(item.name_products, 35)}
                                                                    {/* Pabrik Sepeda Motor Listrik Exotic Cooltech AX Garansi Pabrik */}
                                                                </small>
                                                                <p className="card-text" style={{ fontSize: '10px', color: 'rgb(255, 96, 96)', fontFamily: 'inherit' }}><button className="btn btn-info btn-sm" style={{ fontSize: '10px', marginRight: '5px' }}>{item.discount}%</button><s>{Rupiah(item.price)}</s></p>
                                                                <p className="card-text" style={{ fontSize: '15px', color: 'gray', fontFamily: 'inherit', marginTop: '-10px' }}><b>{Rupiah(hitungHargaSetelahDiskon(item.price, item.discount))}</b></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PRODUK SUKU CADANG */}
                            <div className="body-products-suku-cadang">
                                <div style={{ paddingTop: '10px', paddingLeft: '10px', marginBottom: '-25px' }}>
                                    <h3><b>Suku Cadang Motor</b></h3>
                                </div>
                                <div className="scrollmenu">
                                    <div style={{ marginLeft: '150px' }}>
                                        <div>
                                            {productsSparePart.map((item) => (
                                                <a onClick={() => { toDetailProduct(item.code_products) }}>
                                                    <div className="card">
                                                        <div className="card-body">
                                                            {/* <h5 className="card-title">Special title treatment</h5> */}
                                                            {/* <small className="modernWay" style={{ fontSize: '12px', color: 'gray' }}>Pabrik Sepeda Motor Listrik Exotic Cooltech AX Garansi Pabrik</small> */}
                                                            <p><img src={item.image} width={100} /></p>
                                                            <div style={{ width: '150px', textAlign: 'left', marginLeft: '-10px', padding: '10px' }}>
                                                                <small style={{ fontSize: '12px', color: 'gray' }}>
                                                                    {TruncateText(item.name_products, 35)}
                                                                </small>
                                                                {item.discount == 0 ? (
                                                                    <div>
                                                                        <p className="card-text" style={{ fontSize: '12px', color: 'rgb(255, 96, 96)', fontFamily: 'inherit', marginTop: '7px' }}>Harga</p>
                                                                        <p className="card-text" style={{ fontSize: '15px', color: 'gray', fontFamily: 'inherit', marginTop: '-15px' }}><b>{Rupiah(item.price)}</b></p>

                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <p className="card-text" style={{ fontSize: '10px', color: 'rgb(255, 96, 96)', fontFamily: 'inherit' }}><button className="btn btn-info btn-sm" style={{ fontSize: '10px', marginRight: '5px' }}>{item.discount}%</button><s>{Rupiah(item.price)}</s></p>
                                                                        <p className="card-text" style={{ fontSize: '15px', color: 'gray', fontFamily: 'inherit', marginTop: '-10px' }}><b>{Rupiah(hitungHargaSetelahDiskon(item.price, item.discount))}</b></p>

                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM NAVIGATION */}
                            <footer className="bottom-nav navbar-light" style={{ padding: '0px', boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.30)', zIndex: '15', background: 'white', width: '100%', maxWidth: '450px' }}>
                                <div className="in-body-category" style={{ backgroundColor: 'red' }}>
                                    <div className="bottom-nav">
                                        <div className="bottom-link-nav">
                                            <a href="/">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                            </a>
                                            <a href="https://wa.me/6285323666527" target="_blank">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stopColor="#1FAF38" /><stop offset="100%" stopColor="#60D669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stopColor="#F9F9F9" /><stop offset="100%" stopColor="#FFF" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416Zm40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513l10.706-39.082Z" /><path fill="#FFF" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" /></svg>
                                            </a>
                                            <a href="">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 3a3 3 0 1 0 6 0a3 3 0 1 0-6 0" /></svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}