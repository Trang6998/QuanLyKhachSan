import Vue from 'vue';
import Router, { Route } from 'vue-router';
import DanhSachDatPhong from './components/DatPhong/DanhSachDatPhong.vue';
import DanhSachDichVu from './components/DichVu/DanhSachDichVu.vue';
import DanhSachHoaDon from './components/HoaDon/DanhSachHoaDon.vue';
import DanhSachKiemKe from './components/KiemKe/DanhSachKiemKe.vue';
import DanhSachKhachHang from './components/KhachHang/DanhSachKhachHang.vue';
import DanhSachLoaiPhong from './components/LoaiPhong/DanhSachLoaiPhong.vue';
import DanhSachNhanVien from './components/NhanVien/DanhSachNhanVien.vue';
import DanhSachPhieuNhapKho from './components/PhieuNhapKho/DanhSachPhieuNhapKho.vue';
import DanhSachPhong from './components/Phong/DanhSachPhong.vue';
import DanhSachVatDung from './components/VatDung/DanhSachVatDung.vue';

import ThemKhachDatPhong from './components/DatPhong/ThemKhachDatPhong.vue';
import ThemKhachDatDichVu from './components/DatDichVu/ThemKhachDatDichVu.vue';
import BaoCaoDoanhThu from './components/BaoCao/BaoCaoDoanhThu.vue'

import Login from './components/Login/Login.vue';
import store from './store/store';
import { HTTP } from './HTTPServices';



Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login,
        },
        {
            path: '/baocaodoanhthu',
            name: 'baocaodoanhthu',
            component: BaoCaoDoanhThu,
            beforeEnter: guardRoute
        },
        {
            path: '/baocaodichvu',
            name: 'baocaodichvu',
            component: BaoCaoDoanhThu,
            beforeEnter: guardRoute
        },
        {
            path: '/khachdatdichvu',
            name: 'themKhachDatDichVu',
            component: ThemKhachDatDichVu,
            beforeEnter: guardRoute
        },
        {
            path: '/khachdatphong',
            name: '/khachDatPhong',
            component: ThemKhachDatPhong,
            beforeEnter: guardRoute
        },
        {
            path: '/datphong',
            name: 'datPhong',
            component: DanhSachDatPhong,
            beforeEnter: guardRoute
        },
        
        {
            path: '/dichvu',
            name: 'dichVu',
            component: DanhSachDichVu,
            beforeEnter: guardRoute
        },
        
        {
            path: '/hoadon',
            name: 'hoaDon',
            component: DanhSachHoaDon,
            beforeEnter: guardRoute
        },
       
        {
            path: '/kiemke',
            name: 'kiemKe',
            component: DanhSachKiemKe,
            beforeEnter: guardRoute

        },
       
        {
            path: '/khachhang',
            name: 'khachHang',
            component: DanhSachKhachHang,
            beforeEnter: guardRoute

        },
        
        {
            path: '/loaiphong',
            name: 'loaiPhong',
            component: DanhSachLoaiPhong,
            beforeEnter: guardRoute
        },
        
        {
            path: '/nhanvien',
            name: 'nhanVien',
            component: DanhSachNhanVien,
            beforeEnter: guardRoute
        },
        
        {
            path: '/phieunhapkho',
            name: 'phieuNhapKho',
            component: DanhSachPhieuNhapKho,
            beforeEnter: guardRoute
        },
        
        {
            path: '/phong',
            name: 'phong',
            component: DanhSachPhong,
            beforeEnter: guardRoute
        },
       
        {
            path: '/vatdung',
            name: 'vatDung',
            component: DanhSachVatDung,
            beforeEnter: guardRoute
        },
       
    ],
});


function guardRoute(to: Route, from: Route, next: any): void {
    const isAuthenticated = store.state.user && store.state.user.AccessToken ? store.state.user.AccessToken.IsAuthenticated : false;
    if (!isAuthenticated) {
        next({
            path: '/login',
            query: {
                redirect: to.fullPath
            }
        });
    } else {
        HTTP.get('/auth/validate-token/')
            .then(response => {
                next();
            })
            .catch(e => {
                store.commit('CLEAR_ALL_DATA');
                next({
                    path: '/login',
                    query: {
                        redirect: to.fullPath
                    }
                });
            });
    }
}