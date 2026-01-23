# Contributing to iware Warehouse Management System

Terima kasih atas minat Anda untuk berkontribusi pada proyek iware!

## Code of Conduct

Dengan berpartisipasi dalam proyek ini, Anda diharapkan untuk menjaga lingkungan yang profesional dan menghormati semua kontributor.

## Cara Berkontribusi

### Melaporkan Bug

Jika Anda menemukan bug, silakan buat issue dengan informasi berikut:
- Deskripsi bug yang jelas
- Langkah-langkah untuk mereproduksi
- Expected behavior vs actual behavior
- Screenshots (jika applicable)
- Environment (OS, browser, Node version, dll)

### Mengusulkan Fitur Baru

Untuk mengusulkan fitur baru:
1. Buat issue dengan label "feature request"
2. Jelaskan fitur yang diusulkan
3. Jelaskan use case dan manfaatnya
4. Diskusikan dengan tim sebelum mulai development

### Pull Request Process

1. **Fork repository**
   ```bash
   git clone https://github.com/your-username/iware.git
   cd iware
   ```

2. **Create branch**
   ```bash
   git checkout -b feature/nama-fitur
   # atau
   git checkout -b fix/nama-bug
   ```

3. **Make changes**
   - Ikuti coding standards yang ada
   - Tulis kode yang clean dan maintainable
   - Tambahkan comments jika diperlukan

4. **Test changes**
   - Test secara menyeluruh
   - Pastikan tidak ada breaking changes
   - Test di berbagai browser (untuk frontend)

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: deskripsi fitur"
   # atau
   git commit -m "fix: deskripsi bug fix"
   ```

6. **Push to branch**
   ```bash
   git push origin feature/nama-fitur
   ```

7. **Create Pull Request**
   - Buat PR dari branch Anda ke main branch
   - Isi deskripsi PR dengan detail
   - Link ke issue terkait (jika ada)
   - Tunggu review dari maintainer

## Coding Standards

### JavaScript/React

```javascript
// Use const/let, not var
const API_URL = 'http://localhost:5000';
let counter = 0;

// Use arrow functions
const fetchData = async () => {
  // code here
};

// Use destructuring
const { user, loading } = useAuth();

// Use template literals
const message = `Hello, ${user.name}!`;

// Component naming: PascalCase
const UserProfile = () => {
  return <div>Profile</div>;
};

// Function naming: camelCase
const handleSubmit = () => {
  // code here
};
```

### File Structure

```
frontend/src/
├── components/       # Reusable components
├── pages/           # Page components
├── layouts/         # Layout components
├── context/         # React context
├── utils/           # Utility functions
├── assets/          # Static assets
└── App.jsx          # Main app component

backend/
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic
├── config/          # Configuration files
└── server.js        # Entry point
```

### Naming Conventions

- **Files**: camelCase untuk utils, PascalCase untuk components
- **Components**: PascalCase (UserProfile.jsx)
- **Functions**: camelCase (getUserData)
- **Constants**: UPPER_SNAKE_CASE (API_URL)
- **CSS Classes**: kebab-case (btn-primary)

### Git Commit Messages

Format: `type: description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat: add export to PDF functionality
fix: resolve login authentication issue
docs: update installation guide
style: format code with prettier
refactor: optimize database queries
```

## Development Workflow

### Setup Development Environment

1. Install dependencies
   ```bash
   npm run install-all
   ```

2. Setup database
   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. Configure environment
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. Run development servers
   ```bash
   npm run dev
   ```

### Testing

- Test semua fitur sebelum commit
- Test di berbagai browser (Chrome, Firefox, Safari)
- Test responsive design (Mobile, Tablet, Desktop)
- Test error handling
- Test edge cases

### Code Review

Pull requests akan di-review berdasarkan:
- Code quality dan readability
- Adherence to coding standards
- Test coverage
- Documentation
- Performance impact
- Security considerations

## Project Structure

### Frontend Architecture

```
React Components
├── Public Pages (No Auth)
│   ├── HomePage
│   └── LoginPage
└── Admin Pages (Auth Required)
    ├── Dashboard
    ├── StokBarang
    ├── Transaksi
    ├── Schedule
    └── Rekap
```

### Backend Architecture

```
Express.js API
├── Routes
├── Controllers
├── Services (Business Logic)
├── Middleware (Auth, Validation)
└── Database (MySQL)
```

## Database Changes

Jika membuat perubahan pada database:
1. Update `database/schema.sql`
2. Dokumentasikan perubahan di CHANGELOG.md
3. Buat migration script jika diperlukan
4. Update API documentation

## Documentation

Saat menambah fitur baru:
- Update README.md jika diperlukan
- Update API_DOCUMENTATION.md untuk API changes
- Update FEATURES.md untuk fitur baru
- Tambahkan comments di kode
- Update CHANGELOG.md

## Questions?

Jika ada pertanyaan:
- Buat issue dengan label "question"
- Hubungi tim development
- Check dokumentasi yang ada

## License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah lisensi yang sama dengan proyek ini.

---

Terima kasih telah berkontribusi pada iware! 🚀
