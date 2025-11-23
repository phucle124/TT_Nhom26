<template>
    <div class="p-6">
      <h2 class="title">Nhập điểm sinh viên</h2>
  
      <table border="1" cellpadding="10" class="score-table">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Chuyên cần</th>
            <th>Giữa kỳ</th>
            <th>Cuối kỳ</th>
            <th>Tổng</th>
          </tr>
        </thead>
  
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.id }}</td>
            <td>{{ student.name }}</td>
  
            <!-- Chuyên cần -->
            <td>
              <input 
                type="number" 
                v-model.number="student.attendance"
                @input="updateTotal(student)"
                min="0"
                max="10"
              />
            </td>
  
            <!-- Giữa kỳ -->
            <td>
              <input 
                type="number" 
                v-model.number="student.midterm"
                @input="updateTotal(student)"
                min="0"
                max="10"
              />
            </td>
  
            <!-- Cuối kỳ -->
            <td>
              <input 
                type="number" 
                v-model.number="student.final"
                @input="updateTotal(student)"
                min="0"
                max="10"
              />
            </td>
  
            <!-- Tổng kết -->
            <td><strong>{{ student.total }}</strong></td>
          </tr>
        </tbody>
      </table>
  
      <button class="save-btn" @click="saveScores">Lưu điểm</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "TeacherScores",
  
    data() {
      return {
        students: [
          {
            id: "SV001",
            name: "Nguyễn Văn A",
            attendance: 0,
            midterm: 0,
            final: 0,
            total: 0,
          },
          {
            id: "SV002",
            name: "Trần Thị B",
            attendance: 0,
            midterm: 0,
            final: 0,
            total: 0,
          },
        ],
      };
    },
  
    methods: {
      updateTotal(student) {
        const a = student.attendance || 0;
        const m = student.midterm || 0;
        const f = student.final || 0;
  
        // Công thức có thể thay đổi (hiện tại: CC:20% GK:30% CK:50%)
        student.total = (a * 0.2 + m * 0.3 + f * 0.5).toFixed(1);
      },
  
      saveScores() {
        console.log("Dữ liệu điểm đã lưu:", this.students);
        alert("Đã lưu điểm thành công!");
      },
    },
  };
  </script>
  
  <style>
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .score-table {
    width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
  }
  
  .score-table th {
    background: #f0f0f0;
  }
  
  .score-table input {
    width: 80px;
    padding: 4px;
  }
  
  .save-btn {
    padding: 10px 18px;
    background: #2e7dff;
    border: none;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .save-btn:hover {
    background: #1a5fe0;
  }
  </style>
  