# 📝 Mini Contract UI

A minimal and powerful interface to manage contracts with **real-time updates**, filtering, search, and pagination.

[👉 View the Backend Repo](https://github.com/adityapandey9/mini-contract-api)  
[👉 View the Frontend Repo](https://github.com/adityapandey9/mini-contarct-ui.git)

---

## 🚀 Features

### ✅ Upload Contracts
- Supports uploading **contract data** in `.txt` or `.json` format.
- Handles title, status (Draft/Finalized), parties, and content.

### ✅ View & Search Contracts
- Browse all uploaded contracts in a responsive table.
- **Search by:**
  - Contract title
  - Client name
  - Contract ID

### ✅ Filtering & Pagination
- Filter contracts by **status**: `Draft`, `Finalized`
- Paginate through contract results efficiently

### ✅ Edit Contract Details
- View and edit a contract's metadata
- Save changes in-place

### ✅ Real-Time Updates
- Contracts update in real time using **WebSocket**
- If another user finalizes a contract, the UI reflects it live!

---

## 📸 Screenshots

### 🏠 Dashboard
![Home](./images/screencapture-localhost-3000-2025-03-26-02_05_16.png)

### 📋 Contracts List
![Contracts](./images/screencapture-localhost-3000-contracts-2025-03-26-02_06_15.png)

### 🔍 View a Contract
![View Contract](./images/screencapture-localhost-3000-contracts-11-2025-03-26-02_06_31.png)

### ✏️ Edit a Contract
![Edit Contract](./images/screencapture-localhost-3000-contracts-11-edit-2025-03-26-02_07_58.png)

### 📤 Upload Contract (Step 1)
![Upload Step 1](./images/screencapture-localhost-3000-contracts-upload-2025-03-26-02_06_42.png)

### 📤 Upload Contract (Step 2)
![Upload Step 2](./images/screencapture-localhost-3000-contracts-upload-2025-03-26-02_06_48.png)

---

## 🛠 Tech Stack

- ⚛️ React + TypeScript
- 🧠 Zustand for state management
- 🌐 WebSocket for real-time sync
- 🧾 REST API integration for contract management

---

## 🔗 Getting Started

```bash
# Clone the repository
git clone https://github.com/adityapandey9/mini-contarct-ui.git

# Navigate into project folder
cd mini-contarct-ui

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 📦 Folder Structure

```
mini-contract-ui/
├── components/
├── hooks/
├── pages/
├── services/
├── store/
├── types/
└── images/
```

---

## 📬 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT © [Aditya Pandey](https://github.com/adityapandey9)
