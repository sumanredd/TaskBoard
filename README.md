# Task Manager with Role-Based Access  
A full-stack task management system built using **React**, **Node.js**, **Express**, and **MongoDB (Mongoose)**.  
Supports **JWT authentication**, **role-based access**, **task CRUD operations**, and a clean responsive UI.

---

### **🚀 Features**

### **👤 Authentication (JWT + Bcrypt)**
- User Registration  
- User Login  
- Password hashing using bcrypt  
- Token stored in `localStorage`  
- Roles supported:
  - **user**
  - **admin**

---

### **📌 Role-Based Access**

### **User**
- Create tasks  
- View only own tasks  
- Update personal tasks  
- Delete personal tasks  

### **Admin**
- View **all** tasks  
- Delete **any** task  
- Edit any task  
- (Optional: edited tasks marked as `editedByAdmin`)

---

### **🗂️ Task Module**

Each task contains:

| Field        | Type     |
|--------------|----------|
| title        | String (required) |
| description  | String |
| status       | pending / in-progress / completed |
| createdBy    | User reference |
| createdAt    | Date |
| editedByAdmin| Boolean |

---

### **🛠️ Tech Stack**

### **Frontend**
- React
- Axios
- React Router
- Responsive CSS

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Bcrypt
- JOI validation

---

### **🌐 API Endpoints**

### **Auth Routes**
| Method | Endpoint         | Description      |
|--------|------------------|------------------|
| POST   | `/api/register`  | Register user    |
| POST   | `/api/login`     | Login + JWT      |

### **Task Routes (Protected)**
| Method | Endpoint                | Description             |
|--------|--------------------------|-------------------------|
| POST   | `/api/tasks`             | Create task            |
| GET    | `/api/tasks`             | Get tasks (filtered by role) |
| GET    | `/api/tasks/:id`         | Get single task        |
| PUT    | `/api/tasks/:id`         | Update task            |
| DELETE | `/api/tasks/:id`         | Delete task            |

---

### **⚙️ Backend Setup (/backend)**

### **1️⃣ Install dependencies**
```
cd backend
npm install
```

### **2️⃣ Create .env file**
```
MONGO_URI=mongodb://localhost:27017/tasksapp
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### **3️⃣ (Optional) Seed admin account**
```
npm run seed
```

This creates:
- email: admin@example.com
- password: Admin@123

### **4️⃣ Start backend**
```
npm run dev
```

Backend runs on → **http://localhost:5000**

---

### **💻 Frontend Setup (/frontend)**

### **1️⃣ Install dependencies**
```
cd ../frontend
npm install
```

### **2️⃣ Start frontend**
```
npm start
```

Frontend runs on → **http://localhost:3000**

---

### **🔐 Login Credentials**

### **Admin**
- email: admin@example.com
- password: Admin@123

### **User**
Register directly from the /register page.

---

### **📱 UI Highlights**
- Clean, modern UI
- Fully mobile responsive
- Show/Hide filters on mobile
- Search tasks by title
- Filter by status
- Task cards with color-coded badges
- Grid auto-adjusts based on screen size
- Dashboard layout changes per role

---

### **🎉 Bonus Features Included**
- Search + Status filters
- JOI validation (backend)
- Protected routes (frontend)
- Clean reusable components
- Admin override on edit
- Responsive mobile layout
- Collapsible filter panel on mobile
- Optional user initials avatar

---

### **📁 Project Structure**
```
root/
│── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env
│
│── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── auth.js
│   │   ├── api.js
│   │   ├── App.js
│   │   └── index.js
│
└── README.md
```

---

### **📌 Author**
Your Name  
GitHub: https://github.com/your-username


