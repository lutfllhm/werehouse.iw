# Images Folder

## 📁 Required Files

### 1. bg.jpeg
**Background image untuk homepage**
- Path: `frontend/public/img/bg.jpeg`
- Format: JPEG/JPG
- Resolusi: Minimal 1920x1080px
- Ukuran: Maksimal 2MB
- Aspect Ratio: 16:9 (landscape)

### 2. logo.png
**Logo perusahaan untuk navbar, sidebar, footer**
- Path: `frontend/public/img/logo.png`
- Format: PNG (dengan transparansi)
- Resolusi: Minimal 200x200px
- Ukuran: Maksimal 500KB
- Aspect Ratio: Square atau landscape
- Background: Transparent (recommended)
- **Status**: ✅ **SUDAH TERSEDIA** (Logo iware biru dengan ikon gudang)

## 🎨 Logo Usage

Logo iware (biru dengan ikon gudang) sudah tersedia dan akan digunakan di:
- ✅ Navbar (Public pages) - Height: 40px
- ✅ Sidebar (Admin dashboard) - Height: 40px
- ✅ Footer - Height: 40px
- ✅ Homepage Hero - Height: 80-112px (responsive)
- ✅ Login page - Height: 64px

**Logo saat ini**: Logo iware berwarna biru dengan ikon gudang, cocok dengan tema gray aplikasi.

## 📐 Logo Specifications

### Recommended
```
Format:     PNG with transparency
Size:       512x512px (square) atau 512x256px (landscape)
File Size:  < 500KB
Colors:     Full color atau monochrome
```

### Minimum
```
Format:     PNG or SVG
Size:       200x200px
File Size:  < 1MB
```

## 🎯 Tips

### Logo Design
1. **Simple & Clean**: Logo harus jelas di ukuran kecil
2. **High Contrast**: Pastikan terlihat di background terang dan gelap
3. **Transparent Background**: Gunakan PNG dengan transparansi
4. **Vector Format**: SVG lebih baik untuk scalability

### Background Image
1. **Relevant**: Pilih gambar warehouse/gudang
2. **High Quality**: Minimal Full HD (1920x1080)
3. **Not Too Busy**: Hindari gambar terlalu ramai
4. **Good Lighting**: Pastikan tidak terlalu gelap/terang

## 📝 File Structure

```
frontend/public/img/
├── bg.jpeg          # Background homepage
├── logo.png         # Company logo
├── .gitkeep         # Keep folder in git
└── README.md        # This file
```

## 🔧 How to Add/Replace Files

### Mengganti Logo (Opsional)
Logo iware sudah tersedia. Jika ingin mengganti:

```bash
# Replace logo dengan logo baru
cp /path/to/your/new-logo.png frontend/public/img/logo.png
```

Atau drag & drop file baru ke folder `frontend/public/img/` dan rename menjadi `logo.png`.

### Menambahkan Background
```bash
# Copy background
cp /path/to/your/bg.jpeg frontend/public/img/bg.jpeg
```

## ✅ Verification

Status file saat ini:
- [x] `frontend/public/img/logo.png` - ✅ **SUDAH ADA** (Logo iware biru)
- [ ] `frontend/public/img/bg.jpeg` - ⚠️ **PERLU DITAMBAHKAN**

Setelah menambahkan background, check:
- [ ] Background file size < 2MB
- [ ] Background is landscape (16:9)
- [ ] Logo terlihat jelas di semua halaman
- [ ] Background muncul di homepage dengan animasi

## 🚀 Test

```bash
# Run application
npm run dev

# Open browser
http://localhost:5173

# Check:
✓ Logo appears in navbar
✓ Logo appears in footer
✓ Logo appears in login page
✓ Logo appears in admin sidebar
✓ Background appears in homepage
```

## 🎨 Logo Alternatives

Logo iware sudah tersedia dan siap digunakan!

### Jika Ingin Mengganti Logo:

1. **Siapkan logo baru** dalam format PNG dengan background transparan
2. **Replace file** `frontend/public/img/logo.png` dengan logo baru
3. **Refresh browser** (Ctrl+F5) untuk melihat perubahan

### Tools untuk Membuat Logo (jika diperlukan):
- Canva: https://www.canva.com/create/logos/
- LogoMakr: https://logomakr.com/
- Hatchful: https://www.shopify.com/tools/logo-maker

## 📚 Documentation

For more details:
- [BACKGROUND_IMAGE_GUIDE.md](../../../BACKGROUND_IMAGE_GUIDE.md)
- [COLOR_CUSTOMIZATION_GUIDE.md](../../../COLOR_CUSTOMIZATION_GUIDE.md)

---

**Logo iware sudah tersedia!** ✅  
**Tinggal tambahkan bg.jpeg untuk background homepage!** 🎨
