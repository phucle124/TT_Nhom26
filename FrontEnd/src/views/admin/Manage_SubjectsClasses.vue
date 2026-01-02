<template>
  <div class="p-5 page">
    

    <!-- 1. Chọn khoa -->
    <strong class="text-primary me-4">KHOA: </strong>
    <select class="text-primary" v-model="departmentSelected" @change="loadSubjectsAndClassesByDepartment">
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

      <select v-model="newSubjectYear">
        <option disabled value="">Chọn năm học</option>
        <option v-for="y in [1,2,3,4]" :key="y" :value="y">Năm {{ y }}</option>
      </select>

      <select v-model="newSubjectSemester">
        <option disabled value="">Chọn học kỳ</option>
        <option v-for="sem in ['HK1','HK2','HK3']" :key="sem" :value="sem">{{ sem }}</option>
      </select>

      <div v-if="departmentSelected==''">
        <br>
        <p style="color: red; font-weight: bold;">Vui lòng chọn khoa để thêm môn học</p>
        <button class="btn btn-secondary btn-muted" @click="addSubject" :disabled="departmentSelected === ''">Thêm môn</button>
      </div>
      <div v-else>
        <button @click="addSubject">Thêm môn</button>
      </div>
        
      
    </div>

    
    <!--Danh sach cac mon hoc -->

    <br>
    <div class="mt-3">
      <h5 class="text-dark">Danh sách môn học</h5>
      <div v-if="departmentSelected==''">
        <span class="text-warning" style="margin-left: 10px;">Chọn khoa để lọc ra môn học</span>
     </div>  
      <br>
      <div v-if="subjects.length > 0">
        <table>
        <th>Mã môn</th>
        <th>Tên môn</th>
        <th>Tín chỉ</th>
        <tr v-for="s in subjects" :key="s.subject_id" class="subject_name text-success">
          <td>{{ s.subject_id }}</td>
          <td>{{ s.subject_name }}</td>
          <td>{{ s.credit }}</td>
          <button class="btn btn-sm btn-danger" @click="deleteSubject(s.subject_id)">Xóa</button>
        </tr>
        
      </table>
      </div>
      <div v-else><p class="text-dark" >[Danh sách môn học trống]</p></div>
    </div>
    <br>
    <h2>Quản lý lớp học</h2>
    <!-- 3. Thêm lớp học -->
    <div class="mt-3">
      <input type="number" v-model="inputNumber" min="1" max="99" @change="formatInputNumber" placeholder="nhập hậu tố cho tên lớp (01-99)"/>
      <input type="number" v-model="quantity" min="1" />

      <div v-if="departmentSelected==''">
        <br>
        <p style="color: red; font-weight: bold;">Vui lòng chọn khoa để thêm lớp</p>
        <button class="btn btn-secondary btn-muted" @click="addClasses" :disabled="departmentSelected === ''">Thêm lớp</button>
        
      </div>
      <div v-else>
        <button @click="addClasses">Thêm lớp</button>
      </div>
    </div>

    <!-- Danh sách lớp -->
    <br>
  <h5 class="text-dark">Danh sách lớp</h5>
  
  <div v-if="departmentSelected==''">
    <span class="text-warning" style="margin-left: 10px;">Có thể chọn khoa để lọc ra lớp</span>
  </div>
    <div v-if="classes.length > 0">
      <table>
        <thead>
          <tr>
            <th>Mã lớp</th>
            <th>Tên lớp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in classes" :key="c.class_id" class="class_name text-success">
            <td>{{ c.class_id }}</td>
            <td>{{ c.class_name }}</td>
            <button class="btn btn-sm btn-danger" @click="deleteClass(c.class_id)">Xóa</button>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else><p style="color: gray; font-weight: bold" >[Danh sách lớp học trống]</p></div>
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
      newSubjectYear: "",
      newSubjectSemester: "",
      selectedSubjectIds: [],
      
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

    async loadSubject(){
      const res = await fetch("http://localhost:8888/api/subjects");
      this.subjects = await res.json();
    },

    async loadSubjectsAndClassesByDepartment() {
      const resSubjects = await fetch(`http://localhost:8888/api/subjects/department/${this.departmentSelected}`);
      this.subjects = await resSubjects.json();
      const resClasses = await fetch(`http://localhost:8888/api/classes/department/${this.departmentSelected}`);
      this.classes = await resClasses.json();
    },

    async addSubject() {
      if (!this.newSubjectName.trim() || this.newSubjectCredit === "" || !this.newSubjectYear || !this.newSubjectSemester) return;

      const res = await fetch("http://localhost:8888/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_name: this.newSubjectName,
          credit: this.newSubjectCredit,
          department_id: this.departmentSelected,
          year: this.newSubjectYear,
          semester: this.newSubjectSemester
        })
      });
      const result = await res.json();
      this.subjects.push(result);
      this.newSubjectName = "";
      this.newSubjectCredit = "";
      this.newSubjectYear = "";
      this.newSubjectSemester = "";
    },

    formatInputNumber() {
      if (this.inputNumber < 1) this.inputNumber = 1;
      if (this.inputNumber > 99) this.inputNumber = 99;
      this.inputNumber = String(this.inputNumber).padStart(2, "0");
    },

    async addClasses() {
      if (!this.departmentSelected ) {
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
          
        })
      });
      const result = await res.json();
      alert(result.message);
      this.loadClasses();
    },
    
    async deleteClass(id) {
      await fetch(`http://localhost:8888/api/classes/${id}`, { method: "DELETE" });
      this.loadClasses();
    },

    async deleteSubject(id){
      await fetch(`http://localhost:8888/api/subjects/${id}`, { method: "DELETE" });
      this.load
    },
    
  }
};
</script>

<style scoped>



h2 {
  margin-top: 20px;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

h5{

  display: inline-block;
  border-left: 3px solid #53a7de;
  /* border-bottom: 3px solid #78c9ff; */
  
  padding: 5px;
}

/* Input và select */
input, select {
  margin: 5px 0;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Nút */

button:hover {
  background-color: #2980b9;
}

/* Bảng */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
 th, td {
  border: 1px solid #ddd;
  padding: 8px;
}



/* Checkbox danh sách môn */
label {
  font-weight: bold;
}
.mt-3 {
  margin-top: 15px;
}

.subject_name{
  font-size: 18px;
  margin-bottom: 8px;
}


</style>