import { DatPhong } from "@/models/DatPhong";
import { HoaDon } from "@/models/HoaDon";
import { KiemKe } from "@/models/KiemKe";
import { PhieuNhapKho } from "@/models/PhieuNhapKho";
import { BoPhan } from "@/models/BoPhan";

export interface NhanVien {
    NhanVienID: number;
    TenNhanVien: string;
    SoDienThoai: string;
    BoPhanID: number;
    TenDangNhap: string;
    MatKhau: string;
    LoaiTaiKhoanID: number;
    BoPhan?: BoPhan;
    DatPhong?: DatPhong[];
    HoaDon?: HoaDon[];
    KiemKe?: KiemKe[];
    PhieuNhapKho?: PhieuNhapKho[];
}
