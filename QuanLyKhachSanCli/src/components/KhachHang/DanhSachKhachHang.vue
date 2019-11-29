<template>
    <v-card width="100%" style="padding: 20px">
        <v-layout row wrap>
            <v-flex xs12>
                <v-layout row wrap>
                    <v-flex xs12>
                        <h3>Danh sách khách hàng</h3>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout norwap>
                            <v-flex xs6 md4>
                                <v-text-field label="Tìm kiếm"
                                              append-icon="search"
                                              ma-0 pa-0 hide-details
                                              style="padding-top: 0px"
                                              v-model="searchParamsKhachHang.query"
                                              @input="getDataFromApi(searchParamsKhachHang)">

                                </v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-btn small @click="showModalThemSua(false,{})" style="margin-top: auto" color="primary">+ Thêm mới</v-btn>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-data-table :headers="tableHeader"
                                      :items="dsKhachHang"
                                      @update:pagination="getDataFromApi" :pagination.sync="searchParamsKhachHang"
                                      :total-items="searchParamsKhachHang.totalItems"
                                      :loading="loadingTable"
                                      class="table-border table">
                            <template slot="items" slot-scope="props">
                                <td>{{ props.index + 1 }}</td>
                                <td>{{ props.item.HoTen }}</td>
                                <td>{{ props.item.GioiTinh ? "Nam" : "Nữ" }}</td>
                                <td>{{ props.item.NgaySinh === null ? "" : props.item.NgaySinh|moment('DD/MM/YYYY') }}</td>
                                <td>{{ props.item.SoDienThoai }}</td>
                                <td>{{ props.item.CMND }}</td>
                                <td>{{ props.item.DiaChi }}</td>
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
            </v-flex>
            <v-dialog v-model="dialogConfirmDelete" max-width="290">
                <v-card>
                    <v-card-title class="headline">Xác nhận xóa</v-card-title>
                    <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                        <v-btn color="red darken-1" @click.native="deleteKhachHang" flat>Xác Nhận</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <them-sua-khach-hang ref="themSuaKhachHang" @getLaiDanhSach="getDataFromApi(searchParamsKhachHang)"></them-sua-khach-hang>
        </v-layout>
    </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import KhachHangApi, { KhachHangApiSearchParams } from '@/apiResources/KhachHangApi';
    import { KhachHang } from '@/models/KhachHang';
    import ThemSuaKhachHang from './ThemSuaKhachHang.vue';
    export default Vue.extend({
        components: {
            ThemSuaKhachHang
        },
        data() {
            return {
                dsKhachHang: [] as KhachHang[],
                tableHeader: [
                    { text: 'STT', value: 'KhachHangID', align: 'center', sortable: true },
                    { text: 'Họ tên', value: 'HoTen', align: 'center', sortable: true },
                    { text: 'Giới tính', value: 'GioiTinh', align: 'center', sortable: true },
                    { text: 'Ngày sinh', value: 'NgaySinh', align: 'center', sortable: true },
                    { text: 'Số điện thoại', value: 'SoDienThoai', align: 'center', sortable: true },
                    { text: 'CMND', value: 'CMND', align: 'center', sortable: true },
                    { text: 'Địa chỉ', value: 'DiaChi', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsKhachHang: { includeEntities: true, rowsPerPage: 10 } as KhachHangApiSearchParams,
                loadingTable: false,
                selectedKhachHang: {} as KhachHang,
                dialogConfirmDelete: false,
                page: 1
            }
        },
        
        created() {
            this.getDataFromApi(this.searchParamsKhachHang);
        },
        methods: {
            getDataFromApi(searchParamsKhachHang: KhachHangApiSearchParams): void {
                this.loadingTable = true;
                KhachHangApi.search(searchParamsKhachHang).then(res => {
                    this.dsKhachHang = res.Data;
                    this.searchParamsKhachHang.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            showModalThemSua(isUpdate: boolean, item: any) {
                (this.$refs.themSuaKhachHang as any).show(isUpdate, item)
            },
            confirmDelete(khachHang: KhachHang): void {
                this.selectedKhachHang = khachHang;
                this.dialogConfirmDelete = true;
            },
            deleteKhachHang(): void {
                KhachHangApi.delete(this.selectedKhachHang.KhachHangID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsKhachHang);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

