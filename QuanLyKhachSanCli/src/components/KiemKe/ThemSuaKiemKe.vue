<template>
    <v-dialog v-model="dialog" width="800" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>{{isUpdate ? 'Cập nhật kiểm kê' : 'Thêm mới kiểm kê'}}</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field v-model="kiemKe.MaKiemKe"
                                              label="Mã kiểm kê"
                                              type="text" disabled
                                              :error-messages="errors.collect('Mã kiểm kê', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Mã kiểm kê"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-datepicker v-model="kiemKe.NgayKiemKe"
                                              label="Ngày kiểm kê"
                                              :error-messages="errors.collect('Ngày kiểm kê', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Ngày kiểm kê"
                                              hide-details
                                              clearable></v-datepicker>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="kiemKe.GhiChu"
                                              label="Ghi chú"
                                              type="text"
                                              :error-messages="errors.collect('Ghi chú', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Ghi chú"
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout nowrap>
                                    <h3>Chi tiết kiểm kê</h3>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" @click="showModalChiTietKiemKe()" small>Cập nhật</v-btn>
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
                                        <td>{{ props.item.TenVatDung}}</td>
                                        <td>{{ props.item.SoLuongTieuChuan }}</td>
                                        <td>{{ props.item.SoLuongKiemKe }}</td>
                                        <td>{{ props.item.SoLuongTieuChuan - props.item.SoLuongKiemKe }}</td>
                                        <td>{{ props.item.SoLuongKho }}</td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
                </v-card-actions>
                <modal-chi-tiet-kiem-ke ref="modalChiTietKiemKe"></modal-chi-tiet-kiem-ke>
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
    import ModalChiTietKiemKe from './ModalChiTietKiemKe.vue'
    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {
            ModalChiTietKiemKe
        },
        data() {
            return {
                dialog: false,
                isUpdate: false,
                kiemKe: {} as KiemKe,
                dsChiTietKiemKe: [] as ChiTietKiemKe[],
                chiTietKiemKe: {} as ChiTietKiemKe,
                dsChiTietKiemKeLoading: false,
                searchChiTietKiemKe: '',
                searchParamsChiTietKiemKe: { includeEntities: true } as ChiTietKiemKeApiSearchParams,
                tableHeaderChiTietKiemKe: [
                    { text: '#', value: 'ChiTietKiemKeID', align: 'center', sortable: true },
                    { text: 'Tên vật dụng', value: 'VatDungPhongID', align: 'center', sortable: true },
                    { text: 'Số lượng tiêu chuẩn', value: 'VatDungPhongID', align: 'center', sortable: true },
                    { text: 'Số lượng kiểm kê', value: 'SoLuongKiemKe', align: 'center', sortable: true },
                    { text: 'Chênh lệch', value: 'GhiChu', align: 'center', sortable: true },
                    { text: 'Số lượng kho', value: 'GhiChu', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsKiemKe: {} as KiemKeApiSearchParams,
            }
        },
        watch: {
        },
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.$validator.errors.clear("frmAddEdit");
                this.isUpdate = isUpdate;
                this.dsChiTietKiemKe = [] as ChiTietKiemKe[];
                if (this.isUpdate !== true) {
                    this.kiemKe = {} as KiemKe;
                }
                else {
                    this.getDataFromApi(item.KiemKeID);
                }
            },
            showModalChiTietKiemKe() {
                (this.$refs.modalChiTietKiemKe as any).show(this.kiemKe.KiemKeID)
            },
            getDataFromApi(id: number): void {
                KiemKeApi.detail(id).then(res => {
                    this.kiemKe = res;
                    this.searchParamsChiTietKiemKe.kiemKeID = res.KiemKeID;
                    this.getDSChiTietKiemKe();
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.kiemKe.NhanVien = undefined;
                        this.kiemKe.ChiTietKiemKe = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            KiemKeApi.update(id, this.kiemKe).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            KiemKeApi.insert(this.kiemKe).then(res => {
                                this.kiemKe = res;
                                this.searchParamsChiTietKiemKe.kiemKeID = res.KiemKeID;
                                this.getDSChiTietKiemKe();
                                this.isUpdate = true;
                                this.loading = false;
                                this.$snotify.success('Thêm mới thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        }
                    }
                });
            },
            getDSChiTietKiemKe(): void {
                ChiTietKiemKeApi.search(this.searchParamsChiTietKiemKe).then(res => {
                    this.dsChiTietKiemKe = res.Data;
                });
            },
           
        }
    });
</script>

