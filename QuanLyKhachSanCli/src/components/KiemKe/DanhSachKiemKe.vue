<template>
    <v-card width="100%" style="padding: 20px">
        <v-layout row wrap>
            <v-flex xs12>
                <h3>Danh sách kiểm kê vật dụng</h3>
            </v-flex>
            <v-flex xs12>
                <v-layout norwap>
                    <v-flex xs4>
                        <v-text-field label="Tìm kiếm"
                                      append-icon="search"
                                      placeholder="Nhập mã kiểm kê ..."
                                      hide-details
                                      v-model="searchParamsKiemKe.maKiemKe"
                                      @input="getDataFromApi(searchParamsKiemKe)">

                        </v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-datepicker v-model="searchParamsKiemKe.tuNgay" label="Từ ngày" ma-0 pa-0
                                      hide-details @input="getDataFromApi(searchParamsKiemKe)"></v-datepicker>
                    </v-flex>
                    <v-flex xs2>
                        <v-datepicker v-model="searchParamsKiemKe.denNgay" label="Đến ngày" ma-0 pa-0
                                      hide-details @input="getDataFromApi(searchParamsKiemKe)"></v-datepicker>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-btn small @click="showModalThemSua(false,{})" style="margin-top: auto" color="primary">+ Thêm mới</v-btn>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-data-table :headers="tableHeader"
                              :items="dsKiemKe"
                              @update:pagination="getDataFromApi" :pagination.sync="searchParamsKiemKe"
                              :total-items="searchParamsKiemKe.totalItems"
                              :loading="loadingTable"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.MaKiemKe }}</td>
                        <td>{{ props.item.NgayKiemKe === null ? "" : props.item.NgayKiemKe|moment('DD/MM/YYYY') }}</td>
                        <td>{{ props.item.NhanVien? props.item.NhanVien.HoTen :'' }}</td>
                        <td>{{ props.item.GhiChu }}</td>
                        <td class="text-xs-center" style="width:80px;">
                            <v-btn flat icon small @click="showModalThemSua(true, props.item)" class="ma-0">
                                <v-icon small>edit</v-icon>
                            </v-btn>
                            <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                                <v-icon small>delete</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
        <v-dialog v-model="dialogConfirmDelete" max-width="290">
            <v-card>
                <v-card-title class="headline">Xác nhận xóa</v-card-title>
                <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                    <v-btn color="red darken-1" @click.native="deleteKiemKe" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <them-sua-kiem-ke ref="themSuaKiemKe" @getLaiDanhSach="getDataFromApi(searchParamsKiemKe)"></them-sua-kiem-ke>
    </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import KiemKeApi, { KiemKeApiSearchParams } from '@/apiResources/KiemKeApi';
    import { KiemKe } from '@/models/KiemKe';
    import ThemSuaKiemKe from './ThemSuaKiemKe.vue'
    export default Vue.extend({
        components: {
            ThemSuaKiemKe
        },
        data() {
            return {
                dsKiemKe: [] as KiemKe[],
                tableHeader: [
                    { text: 'STT', value: 'KiemKeID', align: 'center', sortable: true },
                    { text: 'Mã kiểm kê', value: 'NgayKiemKe', align: 'center', sortable: true },
                    { text: 'Ngày kiểm kê', value: 'NgayKiemKe', align: 'center', sortable: true },
                    { text: 'Nhân viên', value: 'NhanVien.NhanVienID', align: 'center', sortable: true },
                    { text: 'Ghi chú', value: 'GhiChu', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsKiemKe: { includeEntities: true, rowsPerPage: 10 } as KiemKeApiSearchParams,
                loadingTable: false,
                selectedKiemKe: {} as KiemKe,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsKiemKe);
        },
        methods: {
            getDataFromApi(searchParamsKiemKe: KiemKeApiSearchParams): void {
                this.loadingTable = true;
                KiemKeApi.search(searchParamsKiemKe).then(res => {
                    this.dsKiemKe = res.Data;
                    this.searchParamsKiemKe.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            showModalThemSua(isUpdate: boolean, item: any) {
                (this.$refs.themSuaKiemKe as any).show(isUpdate, item);
            },
            confirmDelete(kiemKe: KiemKe): void {
                this.selectedKiemKe = kiemKe;
                this.dialogConfirmDelete = true;
            },
            deleteKiemKe(): void {
                KiemKeApi.delete(this.selectedKiemKe.KiemKeID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsKiemKe);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

