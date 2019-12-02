<template>
    <v-card width="100%" style="padding: 20px">
        <v-layout row wrap>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-flex xs12>
                        <h3>Danh sách Loại phòng </h3>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout norwap>

                            <v-flex xs6 md4>
                                <v-text-field label="Tìm kiếm"
                                              append-icon="search"
                                              ma-0 pa-0 hide-details
                                              style="padding-top: 0px"
                                              v-model="searchParamsLoaiPhong.query"
                                              @input="getDataFromApi(searchParamsLoaiPhong)">

                                </v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-btn small @click="showModalThemSua(false,{})" style="margin-top: auto" color="primary">+ Thêm mới</v-btn>
                        </v-layout>
                    </v-flex>

                    <v-flex xs12>
                        <v-data-table :headers="tableHeader"
                                      :items="dsLoaiPhong"
                                      @update:pagination="getDataFromApi" :pagination.sync="searchParamsLoaiPhong"
                                      :total-items="searchParamsLoaiPhong.totalItems"
                                      :loading="loadingTable"
                                      class="table-border table">


                            <template slot="items" slot-scope="props">
                                <td>{{ props.index + 1 }}</td>
                                <td>{{ props.item.TenLoaiPhong }}</td>
                                <td>{{ props.item.GiaPhong }}</td>
                                <td>{{ props.item.MoTa }}</td>



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

                </v-flex>
            </v-layout>


            <v-dialog v-model="dialogConfirmDelete" max-width="290">
                <v-card>
                    <v-card-title class="headline">Xác nhận xóa</v-card-title>
                    <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                        <v-btn color="red darken-1" @click.native="deleteLoaiPhong" flat>Xác Nhận</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <them-sua-loai-phong ref="themSuaLoaiPhong" @getLaiDanhSach="getDataFromApi(searchParamsLoaiPhong)"></them-sua-loai-phong>
        </v-layout>
    </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import ThemSuaLoaiPhong from './ThemSuaLoaiPhong.vue';

    export default Vue.extend({
        components: {
            ThemSuaLoaiPhong
        },
        data() {
            return {
                dsLoaiPhong: [] as LoaiPhong[],
                tableHeader: [
                    { text: 'STT', value: 'LoaiPhongID', align: 'center', sortable: true },
                    { text: 'Tên loại phòng', value: 'TenLoaiPhong', align: 'center', sortable: true },
                    { text: 'Giá hiện tại', value: 'GiaPhong', align: 'center', sortable: true },
                    { text: 'Mo tả', value: 'MoTa', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsLoaiPhong: { includeEntities: true, rowsPerPage: 10 } as LoaiPhongApiSearchParams,

                loadingTable: false,
                selectedLoaiPhong: {} as LoaiPhong,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsLoaiPhong);
        },
        methods: {
            getDataFromApi(searchParamsLoaiPhong: LoaiPhongApiSearchParams): void {
                this.loadingTable = true;
                LoaiPhongApi.search(searchParamsLoaiPhong).then(res => {
                    this.dsLoaiPhong = res.Data;
                    this.searchParamsLoaiPhong.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(loaiPhong: LoaiPhong): void {
                this.selectedLoaiPhong = loaiPhong;
                this.dialogConfirmDelete = true;
            },
            showModalThemSua(isUpdate: boolean, item: any) { // refs gọi từ cha -=> con
                (this.$refs.themSuaLoaiPhong as any).show(isUpdate, item); // gọi đến hàm show bên modal con
            },

            deleteLoaiPhong(): void {
                LoaiPhongApi.delete(this.selectedLoaiPhong.LoaiPhongID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsLoaiPhong);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

