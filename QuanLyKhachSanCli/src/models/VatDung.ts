import { ChiTietPhieuNhap } from "@/models/ChiTietPhieuNhap";
import { VatDungPhong } from "@/models/VatDungPhong";

export interface VatDung {
    VatDungID: number;
    TenVatDung: string;
    SoLuongKho: string;
    MoTa: string;
    ChiTietPhieuNhap?: ChiTietPhieuNhap[];
    VatDungPhong?: VatDungPhong[];
}
