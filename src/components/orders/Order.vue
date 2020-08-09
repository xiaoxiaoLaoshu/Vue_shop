<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片区域 -->
		<el-card>
			<el-row>
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query">
						<el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
					</el-input>
				</el-col>
			</el-row>
			<!-- 订单列表数据 -->
			<el-table :data="orderList" strap border>
				<el-table-column type="index"> </el-table-column>
				<el-table-column label="订单编号" prop="order_number">
				</el-table-column>
				<el-table-column label="订单价格" prop="order_price"> </el-table-column>
				<el-table-column label="是否付款" prop="order_pay">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.order_pay === '1'"
							>已付款</el-tag
						>
						<el-tag type="danger" v-else>未付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="是否发货" prop="is_send">
					<template slot-scope="scope">
						{{ scope.row.is_send }}
					</template>
				</el-table-column>
				<el-table-column label="下单时间" prop="create_time">
					<template slot-scope="scope">
						{{ scope.row.create_time | dateFormat }}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="primary"
							icon="el-icon-edit"
							@click="showBox"
						></el-button
						><el-button
							size="mini"
							type="success"
							icon="el-icon-location"
							@click="progressBox"
						></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[1, 5, 10, 20]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</el-card>
		<!-- 订单位置信息对话框 -->

		<el-dialog
			title="订单位置"
			:visible.sync="addressVisible"
			width="50%"
			@close="addressDialogClosed"
		>
			<el-form
				:model="addressForm"
				:rules="addressRules"
				ref="addressRefs"
				label-width="100px"
			>
				<el-form-item label="省市区/县" prop="address1">
					<el-cascader
						v-model="addressForm.address1"
						:options="addressData"
						:props="{
							expandTrigger: 'hover',
							label: addressData.label,
							value: addressData.value,
						}"
					></el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="address2">
					<el-input v-model="addressForm.address2"></el-input>
					<span slot="footer" class="dialog-footer">
						<el-button @click="addressVisible = false">取 消</el-button>
						<el-button type="primary" @click="addressVisible = false"
							>确 定</el-button
						>
					</span>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 物流信息对话框 -->
		<el-dialog
			title="物流信息"
			:visible.sync="progressBoxDialogVisible"
			width="50%"
		>
			<span>这是一段信息</span>
		</el-dialog>
	</div>
</template>

<script>
	// 导入省市区/县的数据
	import cityData from './citydata.js'
	export default {
		data() {
			return {
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 10,
				},
				orderList: [],
				total: 0,
				// 控制修改地址对话框的显示与隐藏
				addressVisible: false,
				// 修改地址对话框对象
				addressForm: {
					address1: [],
					address2: '',
				},
				// 修改地址对话框验证规则
				addressRules: {
					address1: [
						{ required: true, message: '请选择省市区县', trigger: 'blur' },
					],
					address2: [
						{ required: true, message: '请输入详细地址', trigger: 'blur' },
					],
				},
				// 省市区/县的数据
				addressData: cityData,
				// 控制物流信息对话框的显示与隐藏
				progressBoxDialogVisible: false,
			}
		},
		created() {
			this.getOrderList()
		},
		methods: {
			async getOrderList() {
				const { data: res } = await this.$http.get(`orders`, {
					params: this.queryInfo,
				})

				console.log(this.queryInfo.query);
				if (res.meta.status !== 200) {
					return this.$message.error('获取订单列表数据失败!')
				}
				console.log(res)

				this.orderList = res.data.goods
				this.total = res.data.total
			},
			// 改变 分页大小
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
				this.getOrderList()
			},
			// 改变当前分页
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage
				this.getOrderList()
			},
			// 展示修改地址的对话框
			showBox() {
				this.addressVisible = true
			},
			// 关闭 省市区/县 对话框 触发的事件
			addressDialogClosed() {
				console.log('close start')
				this.$refs.addressRefs.resetFields()
			},
			// 展示物流进程的对话框
			async progressBox() {
				const { data: res } = await this.$http.get(`/kuaidi/70365716896101`)

				if (res.meta.status !== 200) {
					return this.$message.error('获取物流信息失败！')
				}

				console.log(res.data)
				this.$message.success('获取物流信息成功')
				this.progressInfo = res.data
				this.progressBoxDialogVisible = true
			},
		},
	}
</script>

<style lang="less" scoped>
	.el-cascader {
		width: 100%;
	}
</style>
