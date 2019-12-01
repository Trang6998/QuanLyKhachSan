<template>
    <v-dialog v-model="dialog" width="800" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>Chi tiết kiểm kê</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout nowrap>
                                <v-flex xs4>
                                    <v-autocomplete v-model="searchParamsPhong.loaiPhongID"
                                                    :items="dsLoaiPhong"
                                                    :search-input.sync="searchLoaiPhong"
                                                    item-text="TenLoaiPhong"
                                                    item-value="LoaiPhongID"
                                                    label="Loại phòng"
                                                    placeholder="Chọn loại phòng"
                                                    @change="getDSPhong()"
                                                    clearable></v-autocomplete>
                                </v-flex>
                                <v-flex xs4>
                                    <v-autocomplete v-model="searchParamsChiTietKiemKe.phongID"
                                                    :items="dsPhong"
                                                    :search-input.sync="searchPhong"
                                                    item-text="SoPhong"
                                                    item-value="PhongID"
                                                    label="Phòng"
                                                    placeholder="Chọn phòng"
                                                    :error-messages="errors.collect('Phòng', 'frmAddEdit')"
                                                    v-validate="''"
                                                    data-vv-scope="frmAddEdit"
                                                    data-vv-name="Phòng"
                                                    @change="getDSChiTietKiemKe()"
                                                    clearable></v-autocomplete>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-data-table :headers="tableHeaderChiTietKiemKe"
                                          :items="dsChiTietKiemKe"
                                          :pagination.sync="searchParamsChiTietKiemKe"
                                          :total-items="searchParamsChiTietKiemKe.totalItems"
                                          class="table-border table">
                                <template slot="items" slot-scope="props">
                                    <td>{{ props.index + 1 }}</td>
                                    <td>{{ props.item.SoPhong}}</td>
                                    <td>{{ props.item.TenVatDung}}</td>
                                    <td>{{ props.item.SoLuong }}</td>
                                    <td>
                                        <v-text-field type="number" hide-details style="padding: 0px; text-align:center"
                                                      v-model="props.item.SoLuongKiemKe"></v-text-field>
                                    </td>
                                    <td>
                                        <v-text-field hide-details style="padding: 0px"
                                                      v-model="props.item.GhiChu"></v-text-field>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">Lưu lại</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-dialog>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import KiemKeApi, { KiemKeApiSearchParams } from '@/apiResources/KiemKeApi';
    import { KiemKe } from '@/models/KiemKe';
    import { ChiTietKiemKe } from '@/models/ChiTietKiemKe';
    import ChiTietKiemKeApi, { ChiTietKiemKeApiSearchParams } from '@/apiResources/ChiTietKiemKeApi';
    import { VatDungPhong } from '@/models/VatDungPhong';
    import VatDungPhongApi, { VatDungPhongApiSearchParams } from '@/apiResources/VatDungPhongApi';
    import { Phong } from '@/models/Phong';
    import PhongApi, { PhongApiSearchParams } from '@/apiResources/PhongApi';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                isUpdate: false,
                dsVatDungPhong: [] as VatDungPhong[],
                dsChiTietKiemKe: [] as ChiTietKiemKe[],
                dsPhong: [] as Phong[],
                dsLoaiPhong: [] as LoaiPhong[],
                chiTietKiemKe: {} as ChiTietKiemKe,
                dsChiTietKiemKeLoading: false,
                searchChiTietKiemKe: '',
                searchParamsChiTietKiemKe: { includeEntities: true, rowsPerPage: 10 } as ChiTietKiemKeApiSearchParams,
                searchParamsVatDungPhong: { includeEntities: true } as VatDungPhongApiSearchParams,
                searchParamsPhong: { includeEntities: true } as PhongApiSearchParams,
                searchParamsLoaiPhong: { includeEntities: true } as LoaiPhongApiSearchParams,
                searchLoaiPhong: '',
                searchPhong: '',
                tableHeaderChiTietKiemKe: [
                    { text: '#', value: 'ChiTietKiemKeID', align: 'center', sortable: true },
                    { text: 'Số phòng', value: 'VatDungPhongID', align: 'center', sortable: true },
                    { text: 'Tên vật dụng', value: 'VatDungPhongID', align: 'center', sortable: true },
                    { text: 'Số lượng quy định', value: 'VatDungPhongID', align: 'center', sortable: true },
                    { text: 'Số lượng kiểm kê', value: 'SoLuongKiemKe', align: 'center', sortable: true },
                    { text: 'Ghi chú', value: 'GhiChu', align: 'center', sortable: true },
                ],
                loading: false,
            }
        },
        watch: {
        },
        methods: {
            show(id:number) {
                this.dialog = true;
                this.dsChiTietKiemKe = [] as ChiTietKiemKe[];
                this.searchParamsPhong.loaiPhongID = null as any;
                this.searchParamsChiTietKiemKe.phongID = null as any;
                this.getDSLoaiPhong();
                this.searchParamsChiTietKiemKe.kiemKeID = id;
                this.getDSChiTietKiemKe();
            },
            getDSChiTietKiemKe(): void {
                ChiTietKiemKeApi.getds(this.searchParamsChiTietKiemKe).then(res => {
                    this.dsChiTietKiemKe = res.Data;
                });
            },
            save() {
                this.loading = true;
                ChiTietKiemKeApi.updateDanhSach(this.dsChiTietKiemKe).then(res => {
                    this.loading = false;
                    this.$emit("getLaiKiemKe");
                    this.$snotify.success("Cập nhật thành công!");
                })
            },
            getDSPhong(): void {
                PhongApi.search(this.searchParamsPhong).then(res => {
                    this.dsPhong = res.Data;
                });
            },
            getDSLoaiPhong(): void {
                LoaiPhongApi.search(this.searchParamsLoaiPhong).then(res => {
                    this.dsLoaiPhong = res.Data;
                });
            },
        }
    });
</script>

