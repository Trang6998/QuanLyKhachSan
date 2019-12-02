<template>
    <v-card width="100%" style="padding: 20px">
        <v-layout row wrap>
            <v-layout row wrap>
                <v-flex xs12>
                    <h3>Danh sách Phòng </h3>
                </v-flex>
                <v-flex xs12>
                    <v-layout nowrap>
                        <v-flex xs4>
                            <v-text-field label="Tìm kiếm" hide-details
                                          append-icon="search"
                                          placeholder="Nhập số phòng cần tìm..."
                                          v-model="searchParamsPhong.query"
                                          @input="getDataFromApi(searchParamsPhong)">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs4>
                            <v-select v-model="searchParamsPhong.loaiPhongID"
                                      :items="dsLoaiPhong"
                                      item-text="TenLoaiPhong"
                                      item-value="LoaiPhongID"
                                      label="Loại phòng"
                                      placeholder="Chọn loại phòng"
                                      @change="getDataFromApi(searchParamsPhong)"
                                      hide-details
                                      clearable></v-select>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-btn small @click="showModalThemSua(false,{})" style="margin-top: auto" color="primary">+ Thêm mới</v-btn>
                    </v-layout>
                </v-flex>
                <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                  :items="dsPhong"
                                  @update:pagination="getDataFromApi" :pagination.sync="searchParamsPhong"
                                  :total-items="searchParamsPhong.totalItems"
                                  :loading="loadingTable"
                                  class="table-border table">
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-center">{{ props.index +1 }}</td>
                            <td class="text-xs-center">{{ props.item.SoPhong }}</td>
                            <td class="text-xs-center">{{ props.item.LoaiPhong ? props.item.LoaiPhong.TenLoaiPhong : "" }}</td>
                            <td class="text-xs-center">{{ props.item.TrangThai ? "Đang sử dụng" : "Ngừng sử dụng" }}</td>
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
                        <v-btn color="red darken-1" @click.native="deletePhong" flat>Xác Nhận</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <them-sua-phong ref="themSuaPhong" @getLaiDanhSach="getDataFromApi(searchParamsPhong)"></them-sua-phong>
        </v-layout>
    </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import PhongApi, { PhongApiSearchParams } from '@/apiResources/PhongApi';
    import { Phong } from '@/models/Phong';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';
    import ThemSuaPhong from './ThemSuaPhong.vue'
    export default Vue.extend({
        components: {
            ThemSuaPhong
        },
        data() {
            return {
                dsPhong: [] as Phong[],
                dsLoaiPhong: [] as LoaiPhong[],
                tableHeader: [
                    { text: 'STT', value: '', align: 'center', sortable: true },
                    { text: 'Số phòng', value: 'SoPhong', align: 'center', sortable: true },
                    { text: 'Tên loại phòng', value: 'LoaiPhongID', align: 'center', sortable: true },

                    { text: 'Trạng thái', value: 'TrangThai', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsPhong: { includeEntities: true, rowsPerPage: 0 } as PhongApiSearchParams,
                searchParamsLoaiPhong: { includeEntities: true, rowsPerPage: 0 } as LoaiPhongApiSearchParams,
                loadingTable: false,
                selectedPhong: {} as Phong,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsPhong);
            this.getDataLoaiPhongFromApi()
        },
        methods: {
            getDataFromApi(searchParamsPhong: PhongApiSearchParams): void {
                this.loadingTable = true;
                PhongApi.search(searchParamsPhong).then(res => {
                    this.dsPhong = res.Data;
                    this.searchParamsPhong.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            getDataLoaiPhongFromApi(): void {
                LoaiPhongApi.search(this.searchParamsLoaiPhong).then(response => {
                    this.dsLoaiPhong = response.Data;
                })
            },

            confirmDelete(phong: Phong): void {
                this.selectedPhong = phong;
                this.dialogConfirmDelete = true;
            },
            showModalThemSua(isUpdate: boolean, item: any) { // refs gọi từ cha -=> con
                (this.$refs.themSuaPhong as any).show(isUpdate, item); // gọi đến hàm show bên modal con
            },

            deletePhong(): void {
                PhongApi.delete(this.selectedPhong.PhongID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsPhong);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

