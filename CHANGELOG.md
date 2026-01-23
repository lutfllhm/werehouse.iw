# Changelog

All notable changes to iware Warehouse Management System will be documented in this file.

## [1.1.0] - 2026-01-23

### Added
- ✨ **Auto-Migration System** - Database tables now automatically created on server startup
  - No need to manually import schema.sql anymore
  - Idempotent migration (safe to run multiple times)
  - Automatic table verification and logging
  - Migration script: `backend/scripts/migrate.js`
  - Integrated into server startup process

### Fixed
- 🐛 **Railway Migration Path Issue** - Fixed "ENOENT: no such file or directory" error
  - Created `migrate-embedded.js` with embedded SQL schema
  - No longer depends on external schema.sql file
  - Works reliably across all environments (local, Railway, VPS)
  - Includes automatic seed data insertion

### Changed
- Updated `backend/server.js` to run migration before starting server
- Updated deployment documentation with auto-migration information
- Enhanced README with auto-migration details
- Migration now uses embedded schema for better portability

### Technical Details
- Migration runs automatically when backend starts
- Uses `CREATE TABLE IF NOT EXISTS` for idempotent operations
- Uses `INSERT IGNORE` for seed data (no duplicate errors)
- Logs migration progress and table count
- Fails gracefully if migration encounters errors
- Includes default company info and admin user

## [1.0.0] - 2024-01-22

### Added
- Initial release of iware Warehouse Management System
- Public dashboard with company information (Vision, Mission, Description)
- Admin authentication system with JWT
- Dashboard analytics with charts and statistics
- Product stock management with Accurate Online integration
- Transaction management with sales orders from Accurate Online
- Schedule management with color-coded status indicators
- Recap module with Excel export functionality
- Responsive design with Tailwind CSS
- Real-time data synchronization with Accurate Online API

### Features

#### Public Pages
- Homepage with company information
- About section (Vision, Mission, Business Field)
- Login page for admin access

#### Admin Dashboard
- **Dashboard Analytics**
  - Total products, transactions, and low stock alerts
  - Monthly transaction line chart
  - Transaction status pie chart
  - Recent transactions table

- **Stock Management**
  - Product listing with pagination
  - Search and filter functionality
  - Sync from Accurate Online
  - Low stock alerts
  - Stock quantity tracking

- **Transaction Management**
  - Sales order listing from Accurate Online
  - Status management (Waiting, Partial, Completed)
  - Color-coded status badges (Red, Yellow, Green)
  - Transaction verification system
  - Search and filter capabilities

- **Schedule Management**
  - Schedule listing from transactions
  - Visual status indicators
  - Filter by status
  - Date tracking

- **Recap Module**
  - Monthly transaction recap
  - Verified transactions only
  - Excel export functionality
  - Summary statistics
  - Filter by month and year

#### Integration
- Accurate Online API integration
- Product synchronization
- Sales order synchronization
- Real-time data updates

#### Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control

#### UI/UX
- Responsive design (Mobile, Tablet, Desktop)
- Modern interface with Tailwind CSS
- Interactive charts with Recharts
- Loading states and error handling
- Smooth transitions and animations

### Technical Stack
- **Frontend**: React.js 18, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, MySQL2
- **Database**: MySQL 5.7+
- **Authentication**: JWT, Bcrypt
- **Integration**: Axios for Accurate Online API
- **Export**: ExcelJS for Excel generation

### Documentation
- README.md with project overview
- INSTALLATION.md with detailed setup guide
- API_DOCUMENTATION.md with API endpoints
- FEATURES.md with complete feature list
- DEPLOYMENT.md with production deployment guide

### Known Issues
- None at initial release

### Future Enhancements
- [ ] Real-time notifications
- [ ] Advanced reporting module
- [ ] Multi-warehouse support
- [ ] Mobile app version
- [ ] Barcode scanning integration
- [ ] Automated email notifications
- [ ] Advanced analytics dashboard
- [ ] User management module
- [ ] Audit trail logging
- [ ] API rate limiting

---

## Version History

### Version 1.0.0 (2024-01-22)
- Initial production release
- Core features implemented
- Accurate Online integration
- Complete documentation

---

## Upgrade Guide

### From Development to Production
1. Update environment variables
2. Build frontend for production
3. Configure Nginx/Apache
4. Setup SSL certificate
5. Configure database backups
6. Setup PM2 for backend
7. Enable monitoring

### Database Migrations
- No migrations required for initial release
- Future migrations will be documented here

---

## Support

For issues, questions, or contributions:
- Create an issue in the repository
- Contact development team
- Check documentation files

---

## License

Proprietary - iware 2024
