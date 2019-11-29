<template>
    <v-card width="100%" style="padding: 20px">
        <v-layout row wrap>
            <v-layout row wrap>
                <v-flex xs12>
                    <h3>Danh sách dịch vụ</h3>
                </v-flex>
                <v-flex xs12>
                    <v-layout norwap>
                        <v-flex xs6 md4>
                            <v-text-field label="Tìm kiếm"
                                          append-icon="search"
                                          ma-0 pa-0 hide-details
                                          style="padding-top: 0px"
                                          v-model="searchParamsDichVu.tenDichVu"
                                          @input="getDataFromApi(searchParamsDichVu)">

                            </v-text-field>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-btn small @click="showModalThemSua(false,{})" style="margin-top: auto" color="primary">+ Thêm mới</v-btn>
                    </v-layout>
                </v-flex>
                <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                  :items="dsDichVu"
                                  @update:pagination="getDataFromApi" :pagination.sync="searchParamsDichVu"
                                  :total-items="searchParamsDichVu.totalItems"
                                  :loading="loadingTable"
                                  class="table-border table">
                        <template slot="items" slot-scope="props">
                            <td>{{ props.index + 1 }}</td>
                            <td>{{ props.item.TenDichVu }}</td>
                            <td>{{ props.item.MoTa }}</td>
                            <td>{{ props.item.GiaBan }}</td>
                            <td>{{ props.item.DonViTinh }}</td>
                            <td>{{ props.item.TrangThai ? "Đang phục vụ" : "Dừng phục vụ" }}</td>
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
                        <v-btn color="red darken-1" @click.native="deleteDichVu" flat>Xác Nhận</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <them-sua-dich-vu ref="themSuaDichVu" @getLaiDanhSach="getDataFromApi(searchParamsDichVu)"></them-sua-dich-vu>
        </v-layout>
    </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import DichVuApi, { DichVuApiSearchParams } from '@/apiResources/DichVuApi';
    import { DichVu } from '@/models/DichVu';
    import ThemSuaDichVu from './ThemSuaDichVu.vue';
    export default Vue.extend({
        components: {
            ThemSuaDichVu
        },
        data() {
            return {
                dsDichVu: [] as DichVu[],
                tableHeader: [
                    { text: 'STT', value: 'DichVuID', align: 'center', sortable: true },
                    { text: 'Tên Dịch Vụ', value: 'TenDichVu', align: 'center', sortable: true },
                    { text: 'Mô Tả', value: 'MoTa', align: 'center', sortable: true },
                    { text: 'Giá Bán', value: 'GiaBan', align: 'center', sortable: true },
                    { text: 'Đơn Vị Tính', value: 'DonViTinh', align: 'center', sortable: true },
                    { text: 'Trạng Thái', value: 'TrangThai', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsDichVu: { includeEntities: true, rowsPerPage: 10 } as DichVuApiSearchParams,
                loadingTable: false,
                selectedDichVu: {} as DichVu,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsDichVu);
        },
        methods: {
            getDataFromApi(searchParamsDichVu: DichVuApiSearchParams): void {
                this.loadingTable = true;
                DichVuApi.search(searchParamsDichVu).then(res => {
                    this.dsDichVu = res.Data;
                    this.searchParamsDichVu.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            showModalThemSua(isUpdate: boolean, item: any) { // refs gọi từ cha -=> con 
                (this.$refs.themSuaDichVu as any).show(isUpdate, item); // gọi đến hàm show bên modal con
            },
            confirmDelete(dichVu: DichVu): void {
                this.selectedDichVu = dichVu;
                this.dialogConfirmDelete = true;
            },
            deleteDichVu(): void {
                DichVuApi.delete(this.selectedDichVu.DichVuID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsDichVu);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

