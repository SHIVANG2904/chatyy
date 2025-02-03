# 📝 CHATAPP - Real-Time Chat Application  

![CHATAPP](https://your-image-url.com/banner.png)  

## 🚀 Introduction  
CHATAPP is a **real-time messaging application** built with **Next.js, Supabase, PostgreSQL, and TypeScript**. It supports **one-on-one and group chats**, **real-time updates**, **file sharing**, and **custom authentication** for secure user management.

## 🌟 Features  
✅ **Real-Time Messaging** using Supabase WebSockets  
✅ **Custom User Authentication** (Session-based/JWT)  
✅ **Read Receipts & Typing Indicators**  
✅ **File Uploads** with Supabase Storage  
✅ **Secure & Scalable** PostgreSQL backend  
✅ **Modern UI** with Next.js & Tailwind CSS  

---

## 🏗️ Tech Stack  
- **Frontend:** [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)  
- **Backend:** Node.js (Custom Auth & APIs)  
- **Database:** PostgreSQL (with Prisma ORM)  
- **Storage:** Supabase Storage for file uploads  
- **State Management:** Zustand / Context API  
- **Authentication:** Custom Auth (Session-based/JWT)  

---

## 📸 Screenshots  

### 💬 Chat Interface  
![Chat Interface](https://your-image-url.com/chat-ui.png)  

### 🔐 Authentication  
![Auth UI](https://your-image-url.com/auth-ui.png)  

---

## 🎯 Project Architecture  

```txt
       +--------------------+
       |   Frontend (Next.js) |
       +--------------------+
                |
                v
       +----------------------+
       | Authentication (Custom Auth) |
       +----------------------+
                |
                v
       +----------------------+
       |  Backend (Node.js + Express) |
       +----------------------+
                |
        -----------------------------
        |                           |
        v                           v
+-----------------+          +------------------+
|  PostgreSQL     |          |  Supabase Realtime |
|  (Database)     |          |  (WebSockets)     |
+-----------------+          +------------------+
        |                           |
        v                           v
+-----------------+          +---------------------+
|  Chat Messages  |          |  Typing Indicators  |
|  User Profiles  |<-------->|  Read Receipts      |
+-----------------+          +---------------------+


