<template>
	<div id="app">
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片区域 -->
		<el-card>
			<!-- 头部的警告区 -->
			<el-alert
				title="注意：只允许为第三级分类设置相关参数！"
				type="warning"
				:closable="false"
				show-icon
			>
			</el-alert>

			<!-- 选择商品分类区域 -->
			<el-row class="cat_opt">
				<el-col>
					<span>选择商品分类：</span>
					<!-- 选择商品分类的级联选择框 -->
					<el-cascader
						v-model="selectCateKeys"
						:options="cateList"
						:props="{
							expandTrigger: 'hover',
							label: cateProps.label,
							value: cateProps.value,
							children: cateProps.children,
						}"
						@change="handleChange"
					></el-cascader>
				</el-col>
			</el-row>

			<!-- tab 页签区域 -->
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<!-- 添加动态参数的面板 -->
				<el-tab-pane label="动态参数" name="many">
					<!-- 添加参数按钮 -->
					<el-button
						type="primary"
						size="mini"
						:disabled="isBtnDisabled"
						@click="addDialog"
						>添加参数</el-button
					>
					<!-- 动态参数表格 -->
					<el-table :data="manyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<!-- 展开时的关闭标签 -->
							<template slot-scope="scope">
								<!-- 循环渲染Tag标签 -->
								<el-tag
									v-for="(tag, index) in scope.row.attr_vals"
									:key="index"
									closable
									@close="handleClose(index, scope.row)"
								>
									{{ tag }}
								</el-tag>
								<!-- 添加标签 -->
								<el-input
									class="input-new-tag"
									v-show="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									ref="saveTagInput"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<el-button
									v-show="!scope.row.inputVisible"
									class="button-new-tag"
									size="small"
									@click="showInput(scope.row)"
									>+ New Tag</el-button
								>
							</template>
						</el-table-column>
						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column
							label="参数名称"
							prop="attr_name"
						></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button
									type="primary"
									icon="el-icon-edit"
									size="mini"
									@click="showEditDialog(scope.row.attr_id)"
									>编辑</el-button
								>
								<el-button
									type="danger"
									icon="el-icon-delete"
									size="mini"
									@click="removeParams(scope.row.attr_id)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 添加静态属性的面板 -->
				<el-tab-pane label="静态属性" name="only">
					<!-- 添加属性按钮 -->
					<el-button
						type="primary"
						size="mini"
						:disabled="isBtnDisabled"
						@click="addDialog"
						>添加属性</el-button
					>
					<!-- 静态属性表格 -->
					<el-table :data="onlyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<!-- 展开时的关闭标签 -->
							<template slot-scope="scope">
								<!-- 循环渲染Tag标签 -->
								<el-tag
									v-for="(tag, index) in scope.row.attr_vals"
									:key="index"
									closable
									@close="handleClose(index, scope.row)"
								>
									{{ tag }}
								</el-tag>
								<!-- 添加标签 -->
								<el-input
									class="input-new-tag"
									v-show="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									ref="saveTagInput"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<el-button
									v-show="!scope.row.inputVisible"
									class="button-new-tag"
									size="small"
									@click="showInput(scope.row)"
									>+ New Tag</el-button
								>
							</template>
						</el-table-column>
						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column
							label="属性名称"
							prop="attr_name"
						></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button
									type="primary"
									icon="el-icon-edit"
									size="mini"
									@click="showEditDialog(scope.row.attr_id)"
									>编辑</el-button
								>
								<el-button
									type="danger"
									icon="el-icon-delete"
									size="mini"
									@click="removeParams(scope.row.attr_id)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!-- 添加参数/属性对话框 -->
		<el-dialog
			:title="'添加' + titleText"
			:visible.sync="addDialogVisible"
			width="50%"
			@close="addDialogClosed"
		>
			<!-- 添加参数/属性表单 -->
			<el-form
				:model="addForm"
				:rules="addFormRules"
				ref="addFormRef"
				label-width="100px"
			>
				<el-form-item :label="this.titleText" prop="attr_name">
					<el-input v-model="addForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑参数/属性对话框 -->
		<el-dialog
			:title="'添加' + titleText"
			:visible.sync="editDialogVisible"
			width="50%"
			@close="editDialogClosed"
		>
			<!-- 编辑参数/属性表单 -->
			<el-form
				:model="editForm"
				:rules="editFormRules"
				ref="editFormRef"
				label-width="100px"
			>
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="editForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editParams">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 所有商品分类列表
				cateList: [],
				// 级联选择框的配置对象
				cateProps: {
					label: 'cat_name',
					value: 'cat_id',
					children: 'children',
				},
				// 级联选择框双向绑定的数组
				selectCateKeys: [],
				// tab 框默认被激活的标签名
				activeName: 'many',
				// 添加参数的表格数据
				manyTableData: [],
				// 添加属性的表格数据
				onlyTableData: [],
				// 控制添加对话框的显示与隐藏
				addDialogVisible: false,
				// 添加参数的表单数据对象
				addForm: {
					attr_name: '',
				},
				// 添加表单的验证规则对象
				addFormRules: {
					attr_name: [
						{ required: true, message: '请输入参数名称', trigger: 'blur' },
					],
				},
				// 控制编辑对话框的显示与隐藏
				editDialogVisible: false,
				// 编辑表单数据对象
				editForm: {
					attr_name: '',
				},
				// 编辑表单的验证规则对象
				editFormRules: {
					attr_name: [
						{ required: true, message: '请输入参数名称', trigger: 'blur' },
					],
				},
			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			// 获取所有商品分类列表
			async getCateList() {
				const { data: res } = await this.$http.get('categories')
				if (res.meta.status !== 200) {
					this.$message.error('获取商品分类列表失败')
				}
				this.cateList = res.data
				// console.log(this.cateList)
			},
			// 级联选择器选中项变化，会触发这个函数
			handleChange() {
				this.getPramasData()
			},
			// tab 页签点击事件的处理函数
			handleTabClick() {
				this.getPramasData()
				// console.log(this.activeName)
			},
			// 获取参数列表
			async getPramasData() {
				// 没有选中三级分类则清空重新选择
				if (this.selectCateKeys.length !== 3) {
					this.selectCateKeys = []

					this.manyTableData = []
					this.onlyTableData = []
					return
				}
				// 反之选中三级分类
				// console.log(this.selectCateKeys)
				// 根据所选分类的Id，和当前所处的面板，获取对应的参数
				const { data: res } = await this.$http.get(
					`categories/${this.cateId}/attributes`,
					{
						params: {
							sel: this.activeName,
						},
					}
				)
				if (res.meta.status !== 200) {
					return this.$message.error('获取分类参数列表失败')
				}
				res.data.forEach((item) => {
					// 控制文本框的显示与隐藏
					item.inputVisible = false
					// 保存文本框的值
					item.inputValue = ''
					item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
				})
				if (this.activeName === 'many') {
					this.manyTableData = res.data
				} else {
					this.onlyTableData = res.data
				}
				// console.log(res.data)
			},
			// 点击按钮，显示添加对话框
			addDialog() {
				this.addDialogVisible = true
			},
			// 监听添加对话框的关闭事件
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
			},
			// 点击按钮，添加参数
			addParams() {
				this.$refs.addFormRef.validate(async (valid) => {
					if (!valid) return
					const { data: res } = await this.$http.post(
						`categories/${this.cateId}/attributes`,
						{
							attr_name: this.addForm.attr_name,
							attr_sel: this.activeName,
						}
					)
					if (res.meta.status !== 201) {
						return this.$message.error('添加参数失败')
					}
					this.$message.success('添加参数成功')

					// console.log(res)
					this.addDialogVisible = false
					this.getCateList()
				})
			},
			// 点击按钮，显示编辑对话框
			async showEditDialog(attr_id) {
				// console.log(attr_id);
				const { data: res } = await this.$http.get(
					`categories/${this.cateId}/attributes/${attr_id}`,
					{
						params: {
							attr_sel: this.activeName,
						},
					}
				)
				// console.log(res)
				if (res.meta.status !== 200) {
					return this.$message.error('获取当前参数失败')
				}
				this.editForm = res.data
				this.editDialogVisible = true
			},
			// 监听编辑对话框的关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},
			// 点击按钮，编辑成功
			editParams() {
				this.$refs.editFormRef.validate(async (valid) => {
					if (!valid) return
					const { data: res } = await this.$http.put(
						`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
						{
							attr_name: this.editForm.attr_name,
							attr_sel: this.activeName,
						}
					)
					console.log(res)
					if (res.meta.status !== 200) {
						return this.$message.error('修改参数信息失败')
					}

					this.$message.success('修改参数信息成功')
					this.getPramasData()
					this.editDialogVisible = false
				})
			},
			// 根据ID删除对应的参数项
			async removeParams(id) {
				const confirmResult = await this.$confirm(
					'此操作将永久删除该文件, 是否继续?',
					'提示',
					{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}
				).catch((err) => err)

				// 用户取消删除操作
				if (confirmResult !== 'confirm') {
					return this.$message.info('已取消删除！')
				}
				// 删除的业务逻辑
				const { data: res } = await this.$http.delete(
					`categories/${this.cateId}/attributes/${id}`
				)
				if (res.meta.status !== 200) {
					return this.$message.error('删除参数失败')
				}

				this.$message.success('删除参数成功')
				this.getPramasData()
			},
			// 编辑标签的按下了 enter 与失去焦点触发的事件
			handleInputConfirm(row) {
				row.inputVisible = false
				console.log('完成输入', row)
				if (row.inputValue.trim().length === 0) {
					row.inputValue = ''
					row.inputVisible = false
					return
				}
				// 如果没有return，则证明输入的内容，需要做后续处理
				row.attr_vals.push(row.inputValue)
				row.inputValue = ''
				row.inputVisible = false
				this.saveAttrValue(row)
			},
			// 将 row.attr_vals 值，保存到数据库中
			async saveAttrValue(row) {
				const { data: res } = await this.$http.put(
					`categories/${this.cateId}/attributes/${row.attr_id}`,
					{
						attr_name: row.attr_name,
						attr_sel: row.attr_sel,
						attr_vals: row.attr_vals.join(' '),
					}
				)

				if (res.meta.status !== 200) {
					return this.$message.error('修改参数项失败')
				}

				this.$message.success('修改参数项成功!')
			},
			// 编辑标签的按钮点击触发事件
			showInput(row) {
				// 让文本框自动获取焦点
				row.inputVisible = true
				this.$nextTick((_) => {
					// console.log(this)
					this.$refs.saveTagInput.$refs.input.focus()
				})
				// console.log('点击触发', row)
			},
			// 点击，删除标签
			handleClose(i, row) {
				// console.log(i);
				row.attr_vals.splice(i, 1)
				this.saveAttrValue(row)
			},
		},
		computed: {
			// 如果按钮需要被禁用，则返回true，否则返回false
			isBtnDisabled() {
				if (this.selectCateKeys.length !== 3) {
					return true
				}
				return false
			},
			// 当前选中的三级分类的Id
			cateId() {
				if (this.selectCateKeys.length === 3) {
					return this.selectCateKeys[2]
				}
				return null
			},
			// 动态计算标题的文本
			titleText() {
				if (this.activeName === 'many') {
					return '动态参数'
				}
				return '静态属性'
			},
		},
	}
</script>

<style lang="less" scoped>
	.cat_opt {
		margin: 15px 0;
	}

	.el-tag {
		margin: 0 10px;
	}

	.input-new-tag {
		width: 120px;
	}
</style>
