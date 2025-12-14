<template>
  <div class="p-5">
    <h2>Quản lý tài khoản người dùng</h2>

    <!-- Thông tin cơ bản -->
    <input v-model="newUser" placeholder="Tên tài khoản..." />
    <input v-model="newPassword" placeholder="Mật khẩu..." type="password" />
    
    Vai trò: <select v-model="newRole">
      <option value="Sinh_vien">Sinh viên</option>
      <option value="Giang_vien">Giảng viên</option>
    </select>
    <br>
    Khoa: <!-- Yêu cầu chức năng "chọn Khoa" => sẽ lọc ra các lớp thuộc khoa đó -->
    <select v-model="selectedDepartmentId" @change="filterClassesAndSubjects_ByDepartment">
          <option disabled value="">-- Chọn khoa --</option>
          <option v-for="d in departments" :key="d.department_id" :value="d.department_id">
            {{ d.department_name }}
          </option>
        </select>

        <hr>
        <h4>Nhập thông tin cá nhân</h4>
        <br>
        Họ tên: <input v-model="newFullName" placeholder="Họ tên" />
        Số CCCD/CMND: <input v-model="newIDCard" type="text"><br>
        Ngày sinh: <input v-model="newBirth" type="date"><br>
        Quê quán: <input v-model="newAddress" type="text"><br>
        <!-- Số điện thoại: <input v-model="newPhone" type="text"><br> -->
    <!-- Form Sinh viên -->
    <Transition>
      <form v-if="newRole==='Sinh_vien'" id="SV">
      <!-- Năm học (gán mặc định) lấy năm hiện tại -->
        Năm học: <div :style="{color:'red'}">{{ newSchoolYear }} - {{ newSchoolYear + 3 }}</div>
        <br>
        Lớp:

        <p v-if="!selectedDepartmentId">
          <span :style="{color:'red'}">Vui lòng chọn Khoa trước</span>
        </p>

        <select v-model="selectedClassId">
          <option disabled value="">-- Chọn lớp --</option>
          <option v-for="c in classes" :key="c.class_id" :value="c.class_id">
            {{ c.class_name }}
          </option>
        </select>
      </form>
    </Transition>

    <!-- Form Giảng viên -->
    <Transition>
      <form v-if="newRole==='Giang_vien'" id="GV">
        
        Trình độ: 
        <select v-model="selectedLevel">
          <option v-for="l in levels" :key="l" :value="l">
            {{ l }}
          </option>
        </select>
        <br>

        Nơi công tác (hiện tại): 
        <button class="btn btn-sm btn-primary ms-2" @click.prevent="Add_WorkPlace">+</button>
        <div class="mt-2">
          <div v-for="(workplace, index) in newWorkplace" :key="index" class="input-group mb-2">
            <input type="text" class="form-control" v-model="newWorkplace[index]">
            <button class="btn btn-outline-danger" @click.prevent="Delete_WorkPlace(index)">X</button>
          </div>
        </div>
        <br>

        <!-- Chọn nhiều lớp phụ trách -->
        <p v-if="!selectedDepartmentId">
          <span :style="{color:'red'}">Vui lòng chọn Khoa trước</span>
        </p>
        <label>Lớp phụ trách:</label>
        <div v-for="c in classes" :key="c.class_id">
          <input type="checkbox" :value="c.class_id" v-model="selectedClassIds">
          {{ c.class_name }}
        </div>

        <br>

        <!-- Chọn nhiều môn phụ trách -->
        <label>Môn phụ trách:</label>
        <div v-for="s in subjects" :key="s.subject_id">
          <input type="checkbox" :value="s.subject_id" v-model="selectedSubjectIds">
          {{ s.subject_name }}
        </div>

      </form>
    </Transition>

    <button @click="addUser">Thêm</button>

    <!-- Danh sách user -->
    <ul>
      <li v-for="u in users" :key="u.user_id">
        {{ u.username }} - {{ u.role }}
        <button @click="deleteUser(u.user_id)">Xóa</button>
      </li>
    </ul>
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
      selectedClassIds: [],   // mảng nhiều lớp
      selectedSubjectIds: [], // mảng nhiều môn
      selectedDepartmentId: "",
      classes: [],
      subjects: [],           // danh sách môn theo khoa
      departments: [],
      users: [],
      newSchoolYear: new Date().getFullYear()
    };
  },
  mounted() {
    this.loadUsers();
    this.loadLevels();
    this.loadDepartments();
  },
  methods: {
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
      // load lớp theo khoa
      const resClasses = await fetch(`http://localhost:8888/api/classes/department/${this.selectedDepartmentId}`);
      this.classes = await resClasses.json();

      // đồng thời load môn theo khoa
      const resSubjects = await fetch(`http://localhost:8888/api/subjects/department/${this.selectedDepartmentId}`);
      this.subjects = await resSubjects.json();

    },
    
    async addUser() {
      if (!this.newUser.trim()) return;
      const res = await fetch("http://localhost:8888/api/users", {
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
          workplace: this.newWorkplace.join(', '),
          classIds: this.selectedClassIds,
          departmentId: this.selectedDepartmentId,
          full_name: this.newFullName,
          yearStart: this.newSchoolYear
        })
      });
      const result = await res.json();

      // Nếu là giảng viên thì gán môn
      if (this.newRole === "Giang_vien" && result.teacherId) {
        await this.AssingedSubjectsToTeacher(result.teacherId, this.selectedSubjectIds);
      }

      // reset form
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
      this.selectedClassIds = [];
      this.selectedSubjectIds = [];
      this.selectedDepartmentId = "";
      this.loadUsers();
      this.loadLevels();
    },
    async deleteUser(id) {
      await fetch(`http://localhost:8888/api/users/${id}`, { method: "DELETE" });
      this.loadUsers();
    }
  }
};
</script>

<style scoped>
form {
  margin: 20px auto;
}

button {
  font-size: 1.4rem;
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