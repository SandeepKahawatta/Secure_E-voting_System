# Secure E-Voting System

## Features

### Voter Management

- Integration of voter information with NIC-based authentication.
- Passwords secured with an additional credential number.
- One-vote-per-voter enforcement with profile locking post-voting.

### Nominee Management

- Display of 5-9 nominees with photos and multilingual names.
- Uniform presentation of nominee details across devices.

### Voting Process

- Confirmation of vote after submission with persistent visibility for voters.

### Multi-Language Support

- Full support for Sinhala, Tamil, and English.
- Multilingual instructions for inclusivity.

### System Reliability

- Stress-tested for peak usage periods.
- Responsive and intuitive design for mobile and laptop devices.

## Technology Stack

### Frontend

- **React (Vite)**: Responsive and dynamic user interface.
- **Material UI/Tailwind CSS**: Modern, adaptable design.

### Backend

- **Node.js with Express**: Server-side logic and vote management.

### Database

- **MongoDB Atlas**: Secure storage for voter data, nominee details, and votes.

### Authentication and Security

- **JWT**: Session-based authentication.

### Language Support

- **i18next**: Multilingual support for Sinhala, Tamil, and English.

## Installation

1. Clone the repository:

   ```bash
   yourusernamegit clone https://github.com/SandeepKahawatta/Secure_E-voting_System.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Secure_E-voting_System
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the environment variables:

   - Create a `.env` file in the root directory.
   - Add necessary environment variables for database connections, JWT secrets, etc.

5. Start the development server:

   ```bash
   npm start
   ```

