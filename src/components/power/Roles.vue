<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片主体 -->
		<el-card>
			<!-- 添加角色 -->
			<el-button type="primary">添加角色</el-button>
			<!-- 显示角色详细信息列表 -->
			<el-table :data="roleList" stripe border style="width: 100%">
				<!-- 展开用户剩下的权限信息 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row
							:class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
							v-for="(item1, i1) in scope.row.children"
							:key="item1.id"
						>
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag
									closable
									@close="removeRightById(scope.row, item1.id)"
									>{{ item1.authName }}</el-tag
								>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!-- 渲染二级和三级权限 -->
							<el-col :span="19">
								<!-- 通过 for 循环，嵌套渲染二级权限 -->
								<el-row
									:class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
									v-for="(item2, i2) in item1.children"
									:key="i2"
								>
									<el-col :span="6">
										<el-tag
											type="success"
											closable
											@close="removeRightById(scope.row, item2.id)"
											>{{ item2.authName }}</el-tag
										>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="13">
										<el-tag
											v-for="(item3, i3) in item2.children"
											:key="i3"
											type="warning"
											closable
											@close="removeRightById(scope.row, item3.id)"
											>{{ item3.authName }}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
						<!-- <pre>{{ scope.row }}</pre> -->
					</template>
				</el-table-column>
				<el-table-column type="index" label="#"></el-table-column>
				<el-table-column prop="roleName" label="角色名称"> </el-table-column>
				<el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
				<el-table-column label="操作" width="300px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini"
							>编辑</el-button
						>
						<el-button type="danger" icon="el-icon-delete" size="mini"
							>删除</el-button
						>
						<el-button
							type="warning"
							icon="el-icon-setting"
							size="mini"
							@click="showSetRightDialog(scope.row)"
							>分配权限</el-button
						>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 展示分配权限的对话框 -->
		<el-dialog
			title="分配权限"
			:visible.sync="setRightDialogVisable"
			width="50%"
			@close="setRightDialogClosed"
		>
			<!-- 树形控件 -->
			<el-tree
				:data="rightsList"
				show-checkbox
				:props="treeProps"
				node-key="id"
				ref="treeRef"
				default-expand-all
				:default-checked-keys="defKeys"
			></el-tree>
			<span slot="footer" class="dialog-footer">
				<el-button @click="setRightDialogVisable = false">取 消</el-button>
				<el-button type="primary" @click="allotRights()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 角色信息数组
				roleList: [],
				//控制分配权限对话框的显示和隐藏
				setRightDialogVisable: false,
				// 所有权限数据
				rightsList: [],
				// 树形控件的属性绑定对象
				treeProps: {
					children: 'children',
					label: 'authName',
				},
				// 默认选中的节点Id值数组
				defKeys: [],
				// 角色的id
				roleId: '',
			}
		},
		created() {
			this.getRolesList()
		},
		methods: {
			// 获取所有角色的列表
			async getRolesList() {
				const { data: res } = await this.$http.get('roles')
				// console.log(res);
				if (res.meta.status !== 200) {
					return this.$message.error('获取角色列表失败')
				}
				this.roleList = res.data

				// console.log(this.roleList)
			},
			// 根据用户和权限ID删除用户对应的权限
			async removeRightById(role, rightId) {
				const confirmResult = await this.$confirm(
					'此操作将永久删除该文件, 是否继续?',
					'提示',
					{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}
				).catch((err) => err)
				if (confirmResult !== 'confirm') {
					return this.$message.info('取消了删除操作')
				}
				// console.log(id, rightId)
				// 发起删除请求
				const { data: res } = await this.$http.delete(
					`roles/${role.id}/rights/${rightId}`
				)
				if (res.meta.status !== 200) {
					return this.$message.error('删除权限失败')
				}
				role.children = res.data
			},
			// 展示分配权限的对话框
			async showSetRightDialog(role) {
				// 保存用户的id
				this.roleId = role.id
				// 获取用户的权限数据
				const { data: res } = await this.$http.get('rights/tree')
				if (res.meta.status !== 200) {
					return this.$message.error('获取用户的权限数据失败')
				}
				// 把获取到的权限数据保存到 data 中
				this.rightsList = res.data
				// console.log(this.rightsList)
				// 递归调用 getLeafKeys ,将三级权限保存到 defKeys 数组中
				this.getLeafKeys(role, this.defKeys)
				this.setRightDialogVisable = true
			},
			// 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
			getLeafKeys(node, arr) {
				// 如果当前 node 节点不包含 children 属性，则是三级节点
				if (!node.children) {
					return arr.push(node.id)
				}
				// 递归调用
				node.children.forEach((item) => {
					return this.getLeafKeys(item, arr)
				})
			},
			// 监听展示权限对话框的关闭事件
			setRightDialogClosed() {
				this.defKeys = []
			},
			// 点击为角色分配权限
			async allotRights() {
				const keys = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys(),
				]

				const idStr = keys.join(',')
				// console.log(keys);
				const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {
					rids: idStr,
				})
				if(res.meta.status !== 200) {
					return this.$message.error('修改用户权限失败')
				}

				this.getRolesList()
				this.setRightDialogVisable = false
			},
		},
	}
</script>

<style lang="less" scoped>
	.el-tag {
		margin: 7px;
	}

	.bdtop {
		border-top: 1px solid #eee;
	}

	.bdbottom {
		border-bottom: 1px solid #eee;
	}

	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
