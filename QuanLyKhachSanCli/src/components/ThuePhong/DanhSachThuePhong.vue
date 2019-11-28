<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/thuephong" exact>ThuePhong</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsThuePhong"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsThuePhong"
                                :total-items="searchParamsThuePhong.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.ThuePhongID }}</td>
                            <td>{{ props.item.Phong.PhongID }}</td>
                            <td>{{ props.item.HoaDon.HoaDonID }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/thuephong/'+props.item.ThuePhongID" class="ma-0">
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
                    <v-btn color="red darken-1" @click.native="deleteThuePhong" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import ThuePhongApi, { ThuePhongApiSearchParams } from '@/apiResources/ThuePhongApi';
    import { ThuePhong } from '@/models/ThuePhong';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsThuePhong: [] as ThuePhong[],
                tableHeader: [
                    { text: 'ThuePhongID', value: 'ThuePhongID', align: 'center', sortable: true },
                    { text: 'PhongID', value: 'Phong.PhongID', align: 'center', sortable: true },
                    { text: 'HoaDonID', value: 'HoaDon.HoaDonID', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsThuePhong: { includeEntities: true, rowsPerPage: 10 } as ThuePhongApiSearchParams,
                loadingTable: false,
                selectedThuePhong: {} as ThuePhong,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsThuePhong);
        },
        methods: {
            getDataFromApi(searchParamsThuePhong: ThuePhongApiSearchParams): void {
                this.loadingTable = true;
                ThuePhongApi.search(searchParamsThuePhong).then(res => {
                    this.dsThuePhong = res.Data;
                    this.searchParamsThuePhong.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(thuePhong: ThuePhong): void {
                this.selectedThuePhong = thuePhong;
                this.dialogConfirmDelete = true;
            },
            deleteThuePhong(): void {
                ThuePhongApi.delete(this.selectedThuePhong.ThuePhongID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsThuePhong);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

