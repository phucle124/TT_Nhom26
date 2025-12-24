<template>
  <div class="p-5">
    

    <!-- 1. Chọn khoa -->
    Khoa:
    <select v-model="departmentSelected" @change="loadSubjectsAndClasses">
      <option disabled value="">-- Chọn khoa --</option>
      <option v-for="d in departments" :key="d.department_id" :value="d.department_id">
        {{ d.department_name }}
      </option>
    </select>
    <br>
    <h2>Quản lý môn học</h2>
    <!-- 2. Thêm môn học -->
    <div class="mt-3">
      <input v-model="newSubjectName" placeholder="Tên môn..." />
      <select v-model="newSubjectCredit">
        <option disabled value="">Chọn tín chỉ</option>
        <option v-for="n in [0,1,2,3]" :key="n" :value="n">{{ n }}</option>
      </select>
      <button @click="addSubject">Thêm môn</button>
    </div>

    <h2>Quản lý lớp học</h2>
    <!-- Checkbox môn để gán cho lớp -->
    <div class="mt-3">
      <label>Gán môn cho lớp:</label>
      <div v-for="s in subjects" :key="s.subject_id">
        <input type="checkbox" :value="s.subject_id" v-model="selectedSubjectIds" />
        {{ s.subject_name }}
      </div>
    </div>

    <!-- 3. Thêm lớp học -->
    <div class="mt-3">
      <input type="number" v-model="inputNumber" min="1" max="99" @change="formatInputNumber" placeholder="nhập hậu tố cho tên lớp (01-99)"/>
      <input type="number" v-model="quantity" min="1" />
      <button @click="addClasses">Thêm lớp</button>
    </div>

    <!-- Danh sách lớp -->
    <table class="table table-bordered mt-3">
  <thead class="table-light">
    <tr>
      <th>Tên lớp</th>
      <th>Môn gán</th>
      <th>Hành động</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="c in classes" :key="c.class_id">
      <td>{{ c.class_name }}</td>
      <td>
        <div v-if="c.subjects && c.subjects.length">
          <span
            v-for="s in c.subjects"
            :key="s.subject_id"
            class="badge bg-info me-1"
            @click="loadSubjectByClass(c.class_id)"
          >
            {{ s.subject_name }}
          </span>
      </div>
      <div v-else class="text-muted">Chưa gán môn</div>

      </td>
      <td>
        <button class="btn btn-sm btn-danger" @click="deleteClass(c.class_id)">Xóa</button>
      </td>
    </tr>
  </tbody>
</table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      departmentSelected: "",
      departments: [],
      subjects: [],
      classes: [],
      newSubjectName: "",
      newSubjectCredit: "",
      selectedSubjectIds: [],
      subjectsByClass: [],   // thêm biến này
      selectedClassId: "",  // lớp đang xem chi tiết

      inputNumber: "",
      quantity: 1
    };
  },
  mounted() {
    this.loadDepartments();
    this.loadClasses();
  },
  methods: {
    async loadDepartments() {
      const res = await fetch("http://localhost:8888/api/departments");
      this.departments = await res.json();
    },
    async loadClasses() {
      const res = await fetch("http://localhost:8888/api/classes");
      this.classes = await res.json();
      
    },

    async loadSubjectByClass(classId) {
      try {
        const res = await fetch(`http://localhost:8888/api/classes/${classId}`);
        if (!res.ok) throw new Error("Không thể tải môn học");
        const subjects = await res.json();

        // cập nhật lại mảng classes: thêm subjects cho đúng class
        this.classes = this.classes.map(c => {
          if (c.class_id === classId) {
            return { ...c, subjects: subjects };
          }
          return c;
        });
      } catch (err) {
        console.error("Lỗi loadSubjectByClass:", err);
      }
    },


    async loadSubjectsAndClasses() {
      const resSubjects = await fetch(`http://localhost:8888/api/subjects/department/${this.departmentSelected}`);
      this.subjects = await resSubjects.json();
      const resClasses = await fetch(`http://localhost:8888/api/classes/department/${this.departmentSelected}`);
      this.classes = await resClasses.json();
    },
    async addSubject() {
      if (!this.newSubjectName.trim() || this.newSubjectCredit === "") return;
      const res = await fetch("http://localhost:8888/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_name: this.newSubjectName,
          credit: this.newSubjectCredit,
          department_id: this.departmentSelected
        })
      });
      const result = await res.json();
      // thêm vào danh sách checkbox
      this.subjects.push(result);
      this.newSubjectName = "";
      this.newSubjectCredit = "";
    },
    formatInputNumber() {
      if (this.inputNumber < 1) this.inputNumber = 1;
      if (this.inputNumber > 99) this.inputNumber = 99;
      this.inputNumber = String(this.inputNumber).padStart(2, "0");
    },
    async addClasses() {
      if (!this.departmentSelected || !this.inputNumber || this.selectedSubjectIds.length === 0) {
        alert("Vui lòng nhập đủ thông tin và chọn môn!");
        return;
      }
      const res = await fetch("http://localhost:8888/api/classes/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: this.quantity,
          department_id: this.departmentSelected,
          year: new Date().getFullYear(),
          startNumber: this.inputNumber,
          subject_id: this.selectedSubjectIds[0] // gán môn đầu tiên được chọn
        })
      });
      const result = await res.json();
      alert(result.message);
      this.loadClasses();
    },
    async deleteClass(id) {
      await fetch(`http://localhost:8888/api/classes/${id}`, { method: "DELETE" });
      this.loadClasses();
    }
  }
};
</script>

<style scoped>
  /* Tiêu đề */
h2 {
  margin-top: 20px;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

/* Input và select */
input, select {
  margin: 5px 0;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Nút */
button {
  margin-left: 5px;
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}

/* Bảng */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
table th, table td {
  border: 1px solid #ddd;
  padding: 8px;
}
table th {
  background-color: #f2f2f2;
  text-align: left;
}
table tr:nth-child(even) {
  background-color: #fafafa;
}

/* Checkbox danh sách môn */
label {
  font-weight: bold;
}
.mt-3 {
  margin-top: 15px;
}

</style>