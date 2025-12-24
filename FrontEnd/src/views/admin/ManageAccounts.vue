<template>
  <div class="container py-5">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h2 class="h5 mb-0">Quản lý tài khoản người dùng</h2>
      </div>
      
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6 border-end">
            <h4 class="h6 text-muted mb-3">Thông tin chung</h4>
            <div class="mb-3">
              <label class="form-label">Tên tài khoản</label>
              <input v-model="newUser" :disabled="editingUserId != null" class="form-control" placeholder="Tên tài khoản..." />
            </div>
            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <input v-model="newPassword" :disabled="editingUserId != null" class="form-control" placeholder="Mật khẩu..." type="password" />
            </div>
            <div class="mb-3">
              <label class="form-label">Vai trò</label>
              <select v-model="newRole" :disabled="editingUserId != null" class="form-select">
                <option value="" disabled>-- Chọn vai trò --</option>
                <option value="Sinh_vien">Sinh viên</option>
                <option value="Giang_vien">Giảng viên</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Khoa</label>
              <select v-model="selectedDepartmentId" @change="filterClassesAndSubjects_ByDepartment" class="form-select">
                <option disabled value="">-- Chọn khoa --</option>
                <option v-for="d in departments" :key="d.department_id" :value="d.department_id">{{ d.department_name }}</option>
              </select>
            </div>

            <hr>
            <h4 class="h6 text-muted">Thông tin cá nhân</h4>
            <input v-model="newFullName" class="form-control mb-2" placeholder="Họ tên" />
            <input v-model="newIDCard" class="form-control mb-2" placeholder="Số CCCD/CMND" />
            <div class="row g-2">
              <div class="col-6"><input v-model="newBirth" type="date" class="form-control"></div>
              <div class="col-6"><input v-model="newPhone" class="form-control" placeholder="Số điện thoại"></div>
              <div class="mb-2">
              <label class="form-label small">Địa chỉ (Quê quán)</label>
              <textarea v-model="newAddress" class="form-control" rows="2" placeholder="Số nhà, tên đường, tỉnh/thành..."></textarea>
            </div>
            </div>
          </div>

          <div class="col-md-6 bg-light p-3 rounded">
            <div v-if="!newRole" class="danger">
              <p>Vui lòng chọn vai trò để tiếp tục</p>
            </div>

            <div v-if="newRole==='Sinh_vien'" id="SV">
               <h4 class="h6 border-bottom pb-2">Thông tin học tập</h4>
               <p>Năm học: <b class="text-danger">{{ newSchoolYear }} - {{ newSchoolYear + 3 }}</b></p>
               <label class="form-label">Lớp:</label>
               <p v-if="!selectedDepartmentId" class="text-danger small">Vui lòng chọn Khoa trước</p>
               <select v-model="selectedClassId" class="form-select">
                 <option disabled value="">-- Chọn lớp --</option>
                 <option v-for="c in classes" :key="c.class_id" :value="c.class_id">{{ c.class_name }}</option>
               </select>
            </div>

            <div v-if="newRole==='Giang_vien'" id="GV">
              <h4 class="h6 border-bottom pb-2">Thông tin giảng dạy</h4>
              <label class="form-label">Trình độ:</label>
              <select v-model="selectedLevel" class="form-select mb-3">
                <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
              </select>

              <label class="form-label d-flex justify-content-between">
                Nơi công tác:
                <button class="btn btn-sm btn-outline-primary" @click.prevent="Add_WorkPlace">+</button>
              </label>
              <div class="overflow-auto mb-3">
                <div v-for="(workplace, index) in newWorkplace" :key="index" class="input-group mb-2">
                  <input type="text" class="form-control form-control-sm" v-model="newWorkplace[index]">
                  <button class="btn btn-outline-danger btn-sm" @click.prevent="Delete_WorkPlace(index)">X</button>
                </div>
              </div>

              <label class="form-label">Lớp/Môn phụ trách:</label>
              <div class="row">
                <div class="col-6 border-end overflow-auto">
                  <small class="fw-bold">Lớp:</small>
                  <div v-for="c in classes" :key="c.class_id" class="form-check">
                    <input class="form-check-input" type="checkbox" :value="c.class_id" v-model="selectedClassId">
                    <label class="form-check-label small">{{ c.class_name }}</label>
                  </div>
                </div>
                <div class="col-6 overflow-auto">
                  <small class="fw-bold">Môn:</small>
                  <div v-for="s in subjects" :key="s.subject_id" class="form-check">
                    <input class="form-check-input" type="checkbox" :value="s.subject_id" v-model="selectedSubjectIds">
                    <label class="form-check-label small">{{ s.subject_name }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 text-center border-top pt-3">
          <button @click="addUser" class="btn btn-success px-5">Thêm mới</button>
          <!-- Chỉ hiện khi đang sửa -->
          <button v-show="editingUserId" @click="saveUser" class="btn btn-warning px-5">
            Lưu thông tin
          </button>

        </div>
      </div>
    </div>

    <div class="mt-5 card p-3">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.user_id">
            <td>{{ u.username }}</td>
            <td><span class="badge bg-info">{{ u.role }}</span></td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editUser(u)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="deleteUser(u.user_id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserManagement",
  data() {
    return {
      newFullName: "",
      newUser: "",
      newPassword: "",
      newRole: "",
      newBirth: "",
      newAddress: "",
      newPhone: "",
      newIDCard: "",
      selectedLevel: "",
      levels: [],
      newWorkplace: [],
      selectedClassId: [],   // mảng nhiều lớp
      selectedSubjectIds: [], // mảng nhiều môn
      selectedDepartmentId: "",
      classes: [],
      subjects: [],           // danh sách môn theo khoa
      departments: [],
      users: [],
      newSchoolYear: new Date().getFullYear(),
      editingUserId: null
    };
  },
  mounted() {
    this.loadUsers();
    this.loadLevels();
    this.loadDepartments();
  },
  
  methods: {

    async editUser(user) {
      this.editingUserId = user.user_id;

      // các trường chung
      this.newUser = user.username;
      this.newRole = user.role;
      this.newFullName = user.full_name;
      this.newBirth = user.birth;
      this.newAddress = user.address;
      this.newPhone = user.phone;
      this.newIDCard = user.id_card;
      this.selectedDepartmentId = user.department_id;

      // load lớp/môn theo khoa
      await this.filterClassesAndSubjects_ByDepartment();

      // nếu là giảng viên thì load thêm level, workplace, lớp/môn phụ trách
      if (user.role === "Giang_vien") {
        this.selectedLevel = user.level;
        this.newWorkplace = user.workplace ? user.workplace.split(", ") : [];

        const res = await fetch(`http://localhost:8888/api/users/${user.user_id}`);
        const userData = await res.json();
        this.selectedClassId = userData.classIds || [];
        this.selectedSubjectIds = userData.subjectIds || [];
      }

      // nếu là sinh viên thì tick lớp
      if (user.role === "Sinh_vien") {
        this.selectedClassId = [user.class_id];
      }
    },
    async saveUser() {
      const payload = {
        full_name: this.newFullName,
        birth: this.newBirth,
        address: this.newAddress,
        phone: this.newPhone,
        id_card: this.newIDCard,
        level: this.selectedLevel,
        workplace: this.newWorkplace.join(", "),
        department_id: this.selectedDepartmentId,
        classIds: this.selectedClassId,
        subjectIds: this.selectedSubjectIds
      };

      if (this.editingUserId) {
        await fetch(`http://localhost:8888/api/users/${this.editingUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        alert("Cập nhật thông tin thành công!");
      } else {
        payload.username = this.newUser;
        payload.password = this.newPassword;
        payload.role = this.newRole;

        await fetch("http://localhost:8888/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        alert("Thêm người dùng thành công!");
      }

      this.resetForm();
      this.loadUsers();
    },

    Add_WorkPlace() {
      this.newWorkplace.push('');
    },
    Delete_WorkPlace(index) {
      if (this.newWorkplace.length >= 1) {
        this.newWorkplace.splice(index, 1);
      }
    },
    async loadUsers() {
      const res = await fetch("http://localhost:8888/api/users");
      this.users = await res.json();
    },
    async loadLevels() {
      const res = await fetch("http://localhost:8888/api/teacher/level");
      this.levels = await res.json();
    },
    async loadDepartments() {
      const res = await fetch("http://localhost:8888/api/departments");
      this.departments = await res.json();
    },

    

    async AssingedSubjectsToTeacher(teacherId, subjectIds) {
        await fetch("http://localhost:8888/api/teacher-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_id: teacherId,
          subjectIds: subjectIds   // đây là mảng từ checkbox
        })
      });
    },
    
    async filterClassesAndSubjects_ByDepartment() {
      // lọc lớp theo khoa
      const resClasses = await fetch(`http://localhost:8888/api/classes/department/${this.selectedDepartmentId}`);
      this.classes = await resClasses.json();

      // lọc môn theo khoa
      const resSubjects = await fetch(`http://localhost:8888/api/subjects/department/${this.selectedDepartmentId}`);
      this.subjects = await resSubjects.json();

    },
    
    
    async addUser() {
      if (!this.newUser.trim()) return;

      const res = await fetch(`http://localhost:8888/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.newUser,
        password: this.newPassword,
        role: this.newRole,
        birth: this.newBirth,
        address: this.newAddress,
        phone: this.newPhone,
        idCard: this.newIDCard,
        level: this.selectedLevel,
        workplace: this.newWorkplace.join(", "),
        classId: this.selectedClassId,   
        departmentId: this.selectedDepartmentId,
        full_name: this.newFullName,
        yearStart: this.newSchoolYear
      })
    });

      const result = await res.json();

      // Nếu là giảng viên thì gán môn
      if (this.newRole === "Giang_vien") {
        const teacherId = this.editingUserId || result.teacherId;
        await this.AssingedSubjectsToTeacher(teacherId, this.selectedSubjectIds);
      }

      // reset form
      this.resetForm();
      this.loadUsers();
    },
      // reset form
      resetForm() {
      this.editingUserId = null;
      this.newFullName = "";
      this.newUser = "";
      this.newPassword = "";
      this.newRole = "";
      this.newBirth = "";
      this.newAddress = "";
      this.newPhone = "";
      this.newIDCard = "";
      this.selectedLevel = "";
      this.newWorkplace = [];
      this.selectedClassId = [];
      this.selectedSubjectIds = [];
      this.selectedDepartmentId = "";
    },

    async deleteUser(id) {
      await fetch(`http://localhost:8888/api/users/${id}`, { method: "DELETE" });
      this.loadUsers();
    }


  },
};

</script>

<style scoped>
form {
  margin: 20px auto;
  justify-items: auto;
}

button {
  font-size: 1rem;
  
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>