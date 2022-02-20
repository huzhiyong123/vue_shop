<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="getuserlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getuserlist"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddialogvisibile = true">
            输入内容
          </el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"> </el-table-column>

        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>

        <el-table-column label="电话" prop="mobile"> </el-table-column>

        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="scoped">
            <el-switch
              v-model="scoped.row.mg_state"
              @change="userstatechanged(scoped.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" prop="">
          <template v-slot:default="scoped">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showeditdialog(scoped.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="removeuserbyid(scoped.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="success" icon="el-icon-check" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryinfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="adddialogvisibile"
      width="50%"
      @close="adddialogclosed"
    >
      <el-form
        :model="addform"
        :rules="addformrules"
        ref="addformref"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogvisibile = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="editdialogclosed"
    >
      <el-form
        :model="editform"
        :rules="editformrules"
        ref="editformref"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituserlnfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkemail = (rule, value, cb) => {
      const regemail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regemail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };

    var checkmobile = (rule, value, cb) => {
      const regmobile = /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/;
      if (regmobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };
    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      adddialogvisibile: false,
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addformrules: {
        username: [
          { required: true, message: "请输入名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3-10个字符之间",

            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6-15个字符之间",

            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "邮箱", trigger: "blur" },
          {
            validator: checkemail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "手机号", trigger: "blur" },
          {
            validator: checkmobile,
            trigger: "blur",
          },
        ],
      },
      dialogVisible: false,
      editform: {},
      editformrules: {
        email: [
          {
            require: true,
            message: "请输入用户邮箱",
            trigger: "blur",
          },
          {
            validator: checkemail,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            require: true,
            message: "请输入用户手机",
            trigger: "blur",
          },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getuserlist();
  },
  methods: {
    async getuserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryinfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表失败!");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize;
      this.getuserlist();
    },
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage;
      this.getuserlist();
    },
    async userstatechanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("获取失败");
      }
      this.$message.success("更新用户状态成功");
    },
    adddialogclosed() {
      this.$refs.addformref.resetFields();
    },
    adduser() {
      this.$refs.addformref.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.post("users", this.addform);
        if (res.meta.status != 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.adddialogvisibile = false;
        this.getuserlist();
      });
    },
    async showeditdialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.editform = res.data;
      this.dialogVisible = true;
    },
    editdialogclosed() {
      this.$refs.editformref.resetFields();
    },
    edituserlnfo() {
      this.$refs.editformref.validate(async (vaild) => {
        console.log(vaild);
        const { data: res } = await this.$http.put(
          "users/" + this.editform.id,
          { email: this.editform.email, mobile: this.editform.mobile }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        this.dialogVisible = false;
        this.getuserlist();
        this.$message.success("更新用户信息成功");
      });
    },
    async removeuserbyid(id) {
      const confimresult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confimresult !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getuserlist();
    },
  },
};
</script>

<style lang="less" scoped>
</style>
