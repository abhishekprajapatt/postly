# Postly - MERN-Based Social Media Platform

## Overview

Postly is a full-stack social media platform built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Designed to deliver a seamless and interactive user experience, Postly enables users to create, share, and engage with content efficiently. This project serves as a practical exploration of modern web development, focusing on scalable architecture and user-centric features.

## Key Features

### 🔒 User Authentication

- Secure registration, login, and logout functionality.
- JWT-based authentication for enhanced data security.

### 📝 Tweeting System

- Create tweets with text and image support.
- Delete personal tweets with user-specific permissions.
- Real-time timeline updates for a dynamic experience.

### 💬 Engagement & Interaction

- Like and bookmark tweets for personalized content curation.
- Commenting system to foster discussions.
- Restricted tweet deletion to post owners only.

### 👥 Following System

- Follow and unfollow other users to customize your network.
- View followed users' tweets in a personalized timeline.

### 🖼️ Profile Management

- Edit profile details to personalize your presence.
- Explore other users' profiles and their tweet history.

### 🚀 Additional Features

- Personalized timeline based on followed users.
- Responsive and intuitive UI for smooth navigation.
- Optimized for performance and scalability.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Render

## Deployment

Postly is deployed on **Render** for reliable performance and accessibility.

**Live Project Link**: [Insert Deployment Link Here]

## Screenshots

![Postly Screenshot](https://github.com/user-attachments/assets/f241a001-4ad5-4cb7-995e-ffb2774004fd)

## Installation

To run Postly locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/postly.git
   cd postly

   ```

2. **Install dependencies**:

   ```bash
   # Backend dependencies
   - cd server
   - npm install

   # Frontend dependencies
   - cd ../client
   - npm install

   ```

3. **Set up environment variables: Create a .env file in the server directory with the following**:

   ```bash
    - MONGO_URI=your_mongodb_connection_string
    - JWT_SECRET=your_jwt_secret_key

   ```

4. **Run the application**:

   ```bash
   # Start the backend server
   - cd server
   - npm run dev

   # Start the frontend development server
   - cd ../client
   - npm start

   ```

5. Access Postly at http://localhost:3000.

## Purpose 

Postly was developed to gain hands-on experience in:

- Full-stack development with the MERN stack.
- Implementing secure user authentication.
- Designing scalable and interactive web applications.
- Tackling real-world development challenges.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (git checkout -b feature/your-feature).
3. Commit your changes (git commit -m "Add your feature").
4. Push to the branch (git push origin feature/your-feature).
5. Open a pull request.

## License

This project is licensed under the MIT License.