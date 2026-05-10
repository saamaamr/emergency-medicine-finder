# Emergency Medicine Finder

A web application for finding emergency medicines and medical services. Users can request medicines from nearby shops, workers can manage their inventory, and administrators can oversee the system.

## Features

- User registration and authentication
- Medicine request system
- Worker/medicine shop management
- Admin dashboard for overseeing users, workers, and services
- Medicine search functionality
- Profile management
- Service booking system
- Responsive design with EJS templating

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templating, HTML/CSS/JavaScript
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens), bcryptjs for password hashing
- **Session Management**: Express-session
- **File Uploads**: Multer
- **Validation**: Express-validator
- **Email**: Nodemailer for account verification

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emergency-medicine-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MySQL Database**
   - Ensure MySQL server is running
   - Create the database and tables using the provided setup script:
     ```bash
     mysql -u root -p < database_setup.sql
     ```
   - Alternatively, source the file in MySQL:
     ```sql
     SOURCE /path/to/emergency-medicine-finder/database_setup.sql;
     ```

4. **Configure Environment Variables**
   - Copy `.env.sample` to `.env`:
     ```bash
     cp .env.sample .env
     ```
   - Edit `.env` file with your configuration:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_NAME=emergency_medicine
     DB_PASS=your_mysql_password
     PORT=3440
     JWT_SECRET=your_jwt_secret_key_here
     COOKIE_NAME=token
     COOKIE_SECRET=your_cookie_secret_key_here
     BASE_URL=http://localhost:3440
     ```

5. **Start the application**
   ```bash
   npm start
   ```
   Or directly with Node.js:
   ```bash
   node app.js
   ```

6. **Access the application**
   Open your browser and navigate to: `http://localhost:3440`

## Database Setup

The project includes a `database_setup.sql` file that creates:
- Database: `emergency_medicine`
- Tables:
  - `users` - Patient/user information
  - `worker` - Medicine shop/worker information
  - `medicine` - Generic medicine catalog
  - `shopmedicine` - Medicines available at specific shops
  - `medicine_request` - Medicine requests from users to shops
  - `org_service` - Organization services offered
  - `admin` - Administrator accounts
- Sample data for services and an admin account
- Indexes for performance optimization

Default admin credentials:
- Email: admin@emf.com
- Password: admin123 (hashed in database)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_NAME` | Database name | `emergency_medicine` |
| `DB_PASS` | MySQL password | `your_password` |
| `PORT` | Server port | `3440` |
| `JWT_SECRET` | Secret for JWT signing | `your_secret_key` |
| `COOKIE_NAME` | Cookie name | `token` |
| `COOKIE_SECRET` | Secret for cookie signing | `your_cookie_secret` |
| `BASE_URL` | Base URL for the application | `http://localhost:3440` |

## API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - Process login
- `GET /workerlogin` - Worker login page
- `POST /workerlogin` - Process worker login
- `GET /logout` - User logout
- `GET /workerlogout` - Worker logout
- `GET /adminlogout` - Admin logout

### User Management
- `GET /signup` - User registration page
- `POST /signup` - Process user registration
- `GET /profile` - User profile
- `GET /userupdate` - Edit user profile
- `POST /userupdate` - Update user profile

### Worker Management
- `GET /workersignup` - Worker registration page
- `POST /workersignup` - Process worker registration
- `GET /worker` - Worker dashboard
- `GET /workerdesh` - Worker dashboard alternative
- `GET /mediupdate` - Update medicine inventory
- `POST /mediupdate` - Process medicine inventory update

### Medicine Requests
- `GET /servicereq` - View medicine requests (for workers)
- `GET /request` - View user's medicine requests
- `GET /req` - Request medicine
- `POST /request` - Submit medicine request
- `GET /verify-medicine-request/:id` - Verify medicine request
- `GET /hold-medicine-request/:id` - Hold medicine request
- `GET /delete-medicine-request/:id` - Delete medicine request

### Services
- `GET /service` - View available services
- `GET /medicine` - Get medicine details
- `GET /searchmedicine` - Search medicines
- `POST /book-service` - Book a service

### Admin
- `GET /admin` - Admin dashboard
- `POST /alogin` - Admin login

### Verification
- `GET /verify-account/:id` - Verify user account
- `GET /verify-worker-account/:id` - Verify worker account
- `GET /hold-worker-account/:id` - Hold worker account

## Security Features

- **SQL Injection Prevention**: All database queries use parameterized statements
- **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds
- **Input Validation**: All form inputs are validated using express-validator
- **Session Security**: Secure cookie settings with HTTPOnly flag
- **Environment Configuration**: Sensitive data stored in environment variables
- **Account Verification**: Email verification for new accounts

## Project Structure

```
emergency-medicine-finder/
├── app.js                 # Main application entry point
├── package.json           # Project dependencies and scripts
├── .env                   # Environment variables (not in version control)
├── .env.sample            # Environment variables template
├── database_setup.sql     # Database schema and initial data
├── README.md              # This file
├── config/
│   └── database.js        # MySQL database configuration
├── controllers/
│   └── UserController.js  # Application logic handlers
├── middleware/
│   ├── AuthMiddleware.js  # Authentication middleware
│   ├── decoratorHtmlResponse.js # Response decoration
│   ├── errorHandler.js    # Error handling middleware
│   └── validator/
│       └── userValidator.js # Input validation rules
├── models/
│   └── UserModels.js      # Database interaction models
├── public/                # Static assets
│   ├── CSS/               # Stylesheets
│   ├── JS/                # Client-side JavaScript
│   └── uploads/           # Uploaded files (profile pictures, etc.)
├── views/                 # EJS templates
│   ├── pages/             # Main page templates
│   └── template/          # Reusable template components (header, footer, etc.)

```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need for accessible emergency medicine information
- Built with Node.js and Express.js
- Uses various open-source packages listed in package.json

## Troubleshooting

### Database Connection Issues
- Ensure MySQL service is running
- Verify credentials in `.env` file
- Check that the database `emergency_medicine` exists
- Confirm the user has appropriate permissions

### Port Already in Use
- Change the PORT value in `.env` to an available port
- Or stop the process using port 3440: `netstat -ano | findstr :3440`

### Missing Dependencies
- Run `npm install` to install all required packages
- If bcrypt installation fails, ensure you have build tools installed

