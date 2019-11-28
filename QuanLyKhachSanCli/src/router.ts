import Vue from 'vue';
import Router from 'vue-router';
import DanhSachBangGia from './components/BangGia/DanhSachBangGia.vue';
import ThemSuaBangGia from './components/BangGia/ThemSuaBangGia.vue';
import DanhSachBoPhan from './components/BoPhan/DanhSachBoPhan.vue';
import ThemSuaBoPhan from './components/BoPhan/ThemSuaBoPhan.vue';
import DanhSachChiTietKiemKe from './components/ChiTietKiemKe/DanhSachChiTietKiemKe.vue';
import ThemSuaChiTietKiemKe from './components/ChiTietKiemKe/ThemSuaChiTietKiemKe.vue';
import DanhSachChiTietPhieuNhap from './components/ChiTietPhieuNhap/DanhSachChiTietPhieuNhap.vue';
import ThemSuaChiTietPhieuNhap from './components/ChiTietPhieuNhap/ThemSuaChiTietPhieuNhap.vue';
import DanhSachDatDichVu from './components/DatDichVu/DanhSachDatDichVu.vue';
import ThemSuaDatDichVu from './components/DatDichVu/ThemSuaDatDichVu.vue';
import DanhSachDatPhong from './components/DatPhong/DanhSachDatPhong.vue';
import ThemSuaDatPhong from './components/DatPhong/ThemSuaDatPhong.vue';
import DanhSachDichVu from './components/DichVu/DanhSachDichVu.vue';
import ThemSuaDichVu from './components/DichVu/ThemSuaDichVu.vue';
import DanhSachHoaDon from './components/HoaDon/DanhSachHoaDon.vue';
import ThemSuaHoaDon from './components/HoaDon/ThemSuaHoaDon.vue';
import DanhSachKiemKe from './components/KiemKe/DanhSachKiemKe.vue';
import ThemSuaKiemKe from './components/KiemKe/ThemSuaKiemKe.vue';
import DanhSachKhachHang from './components/KhachHang/DanhSachKhachHang.vue';
import ThemSuaKhachHang from './components/KhachHang/ThemSuaKhachHang.vue';
import DanhSachLoaiPhong from './components/LoaiPhong/DanhSachLoaiPhong.vue';
import ThemSuaLoaiPhong from './components/LoaiPhong/ThemSuaLoaiPhong.vue';
import DanhSachNhanVien from './components/NhanVien/DanhSachNhanVien.vue';
import ThemSuaNhanVien from './components/NhanVien/ThemSuaNhanVien.vue';
import DanhSachPhieuNhapKho from './components/PhieuNhapKho/DanhSachPhieuNhapKho.vue';
import ThemSuaPhieuNhapKho from './components/PhieuNhapKho/ThemSuaPhieuNhapKho.vue';
import DanhSachPhong from './components/Phong/DanhSachPhong.vue';
import ThemSuaPhong from './components/Phong/ThemSuaPhong.vue';
import DanhSachThuePhong from './components/ThuePhong/DanhSachThuePhong.vue';
import ThemSuaThuePhong from './components/ThuePhong/ThemSuaThuePhong.vue';
import DanhSachVatDung from './components/VatDung/DanhSachVatDung.vue';
import ThemSuaVatDung from './components/VatDung/ThemSuaVatDung.vue';
import DanhSachVatDungPhong from './components/VatDungPhong/DanhSachVatDungPhong.vue';
import ThemSuaVatDungPhong from './components/VatDungPhong/ThemSuaVatDungPhong.vue';
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/banggia',
            name: 'bangGia',
            component: DanhSachBangGia,
        },
        {
            path: '/banggia/add',
            name: 'themBangGia',
            component: ThemSuaBangGia,
        },
        {
            path: '/banggia/:id',
            name: 'suaBangGia',
            component: ThemSuaBangGia,
        },
        {
            path: '/bophan',
            name: 'boPhan',
            component: DanhSachBoPhan,
        },
        {
            path: '/bophan/add',
            name: 'themBoPhan',
            component: ThemSuaBoPhan,
        },
        {
            path: '/bophan/:id',
            name: 'suaBoPhan',
            component: ThemSuaBoPhan,
        },
        {
            path: '/chitietkiemke',
            name: 'chiTietKiemKe',
            component: DanhSachChiTietKiemKe,
        },
        {
            path: '/chitietkiemke/add',
            name: 'themChiTietKiemKe',
            component: ThemSuaChiTietKiemKe,
        },
        {
            path: '/chitietkiemke/:id',
            name: 'suaChiTietKiemKe',
            component: ThemSuaChiTietKiemKe,
        },
        {
            path: '/chitietphieunhap',
            name: 'chiTietPhieuNhap',
            component: DanhSachChiTietPhieuNhap,
        },
        {
            path: '/chitietphieunhap/add',
            name: 'themChiTietPhieuNhap',
            component: ThemSuaChiTietPhieuNhap,
        },
        {
            path: '/chitietphieunhap/:id',
            name: 'suaChiTietPhieuNhap',
            component: ThemSuaChiTietPhieuNhap,
        },
        {
            path: '/datdichvu',
            name: 'datDichVu',
            component: DanhSachDatDichVu,
        },
        {
            path: '/datdichvu/add',
            name: 'themDatDichVu',
            component: ThemSuaDatDichVu,
        },
        {
            path: '/datdichvu/:id',
            name: 'suaDatDichVu',
            component: ThemSuaDatDichVu,
        },
        {
            path: '/datphong',
            name: 'datPhong',
            component: DanhSachDatPhong,
        },
        {
            path: '/datphong/add',
            name: 'themDatPhong',
            component: ThemSuaDatPhong,
        },
        {
            path: '/datphong/:id',
            name: 'suaDatPhong',
            component: ThemSuaDatPhong,
        },
        {
            path: '/dichvu',
            name: 'dichVu',
            component: DanhSachDichVu,
        },
        {
            path: '/dichvu/add',
            name: 'themDichVu',
            component: ThemSuaDichVu,
        },
        {
            path: '/dichvu/:id',
            name: 'suaDichVu',
            component: ThemSuaDichVu,
        },
        {
            path: '/hoadon',
            name: 'hoaDon',
            component: DanhSachHoaDon,
        },
        {
            path: '/hoadon/add',
            name: 'themHoaDon',
            component: ThemSuaHoaDon,
        },
        {
            path: '/hoadon/:id',
            name: 'suaHoaDon',
            component: ThemSuaHoaDon,
        },
        {
            path: '/kiemke',
            name: 'kiemKe',
            component: DanhSachKiemKe,
        },
        {
            path: '/kiemke/add',
            name: 'themKiemKe',
            component: ThemSuaKiemKe,
        },
        {
            path: '/kiemke/:id',
            name: 'suaKiemKe',
            component: ThemSuaKiemKe,
        },
        {
            path: '/khachhang',
            name: 'khachHang',
            component: DanhSachKhachHang,
        },
        {
            path: '/khachhang/add',
            name: 'themKhachHang',
            component: ThemSuaKhachHang,
        },
        {
            path: '/khachhang/:id',
            name: 'suaKhachHang',
            component: ThemSuaKhachHang,
        },
        {
            path: '/loaiphong',
            name: 'loaiPhong',
            component: DanhSachLoaiPhong,
        },
        {
            path: '/loaiphong/add',
            name: 'themLoaiPhong',
            component: ThemSuaLoaiPhong,
        },
        {
            path: '/loaiphong/:id',
            name: 'suaLoaiPhong',
            component: ThemSuaLoaiPhong,
        },
        {
            path: '/nhanvien',
            name: 'nhanVien',
            component: DanhSachNhanVien,
        },
        {
            path: '/nhanvien/add',
            name: 'themNhanVien',
            component: ThemSuaNhanVien,
        },
        {
            path: '/nhanvien/:id',
            name: 'suaNhanVien',
            component: ThemSuaNhanVien,
        },
        {
            path: '/phieunhapkho',
            name: 'phieuNhapKho',
            component: DanhSachPhieuNhapKho,
        },
        {
            path: '/phieunhapkho/add',
            name: 'themPhieuNhapKho',
            component: ThemSuaPhieuNhapKho,
        },
        {
            path: '/phieunhapkho/:id',
            name: 'suaPhieuNhapKho',
            component: ThemSuaPhieuNhapKho,
        },
        {
            path: '/phong',
            name: 'phong',
            component: DanhSachPhong,
        },
        {
            path: '/phong/add',
            name: 'themPhong',
            component: ThemSuaPhong,
        },
        {
            path: '/phong/:id',
            name: 'suaPhong',
            component: ThemSuaPhong,
        },
        {
            path: '/thuephong',
            name: 'thuePhong',
            component: DanhSachThuePhong,
        },
        {
            path: '/thuephong/add',
            name: 'themThuePhong',
            component: ThemSuaThuePhong,
        },
        {
            path: '/thuephong/:id',
            name: 'suaThuePhong',
            component: ThemSuaThuePhong,
        },
        {
            path: '/vatdung',
            name: 'vatDung',
            component: DanhSachVatDung,
        },
        {
            path: '/vatdung/add',
            name: 'themVatDung',
            component: ThemSuaVatDung,
        },
        {
            path: '/vatdung/:id',
            name: 'suaVatDung',
            component: ThemSuaVatDung,
        },
        {
            path: '/vatdungphong',
            name: 'vatDungPhong',
            component: DanhSachVatDungPhong,
        },
        {
            path: '/vatdungphong/add',
            name: 'themVatDungPhong',
            component: ThemSuaVatDungPhong,
        },
        {
            path: '/vatdungphong/:id',
            name: 'suaVatDungPhong',
            component: ThemSuaVatDungPhong,
        },
    ],
});
