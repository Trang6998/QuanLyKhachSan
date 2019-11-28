<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/phong" exact>Phong</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsPhong"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsPhong"
                                :total-items="searchParamsPhong.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.PhongID }}</td>
                    <td>{{ props.item.SoPhong }}</td>
                    <td>{{ props.item.TrangThai ? "Yes" : "No" }}</td>
                            <td>{{ props.item.LoaiPhong.LoaiPhongID }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/phong/'+props.item.PhongID" class="ma-0">
                            <v-icon small>edit</v-icon>
                        </v-btn>
                        <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                            <v-icon small>delete</v-icon>
                        </v-btn>
                    </td>
                            </template>
                        </v-data-table>
                    </v-flex xs12>
                </v-layout>
            </v-card-text>
        </v-card>
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
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import PhongApi, { PhongApiSearchParams } from '@/apiResources/PhongApi';
    import { Phong } from '@/models/Phong';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsPhong: [] as Phong[],
                tableHeader: [
                    { text: 'PhongID', value: 'PhongID', align: 'center', sortable: true },
                    { text: 'SoPhong', value: 'SoPhong', align: 'center', sortable: true },
                    { text: 'TrangThai', value: 'TrangThai', align: 'center', sortable: true },
                    { text: 'LoaiPhongID', value: 'LoaiPhong.LoaiPhongID', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsPhong: { includeEntities: true, rowsPerPage: 10 } as PhongApiSearchParams,
                loadingTable: false,
                selectedPhong: {} as Phong,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsPhong);
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
            confirmDelete(phong: Phong): void {
                this.selectedPhong = phong;
                this.dialogConfirmDelete = true;
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

