# Performance Optimization Guide

Dokumentasi optimasi performa untuk IWARE Frontend.

## 🚀 Optimasi yang Sudah Diterapkan

### 1. Lazy Loading Animations
Animasi hanya berjalan ketika element terlihat di viewport menggunakan Intersection Observer API.

**Benefit:**
- Mengurangi beban CPU/GPU saat page load
- Animasi lebih smooth karena tidak semua berjalan bersamaan
- Better user experience

**Implementation:**
```javascript
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const section = useIntersectionObserver({ threshold: 0.1 });

<div ref={section.ref} className={section.isVisible ? 'animate-fade-in' : 'opacity-0'}>
  Content here
</div>
```

### 2. CSS Performance Optimization

**will-change Property:**
Memberitahu browser element mana yang akan di-animate untuk optimasi rendering.

```css
.animate-float {
  will-change: transform;
}
```

**Prefers-Reduced-Motion:**
Respect user preference untuk disable animasi (accessibility).

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

### 3. Image Optimization

**WebP Format:**
Format gambar modern yang 25-35% lebih ringan dari JPG/PNG.

```html
<picture>
  <source srcSet="/img/optimized/bg.webp" type="image/webp" />
  <source srcSet="/img/bg.jpg" type="image/jpeg" />
  <img src="/img/bg.jpg" alt="Background" />
</picture>
```

**Lazy Loading:**
```html
<img src="image.jpg" loading="lazy" alt="Description" />
```

### 4. Animation Cleanup
Menghapus `will-change` setelah animasi selesai untuk free up resources.

```javascript
setTimeout(() => {
  element.classList.add('animation-complete');
}, 1000);
```

## 📊 Performance Metrics Target

- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.8s
- **Cumulative Layout Shift (CLS):** < 0.1

## 🛠️ Tools untuk Compress Gambar

### Menggunakan Script Otomatis
```bash
# Install dependency
npm install sharp --save-dev

# Jalankan script
node scripts/compress-images.js
```

### Online Tools (Alternative)
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [ImageOptim](https://imageoptim.com/) - Mac app

## 📝 Best Practices

### 1. Gambar
- ✅ Gunakan WebP dengan fallback JPG/PNG
- ✅ Compress gambar sebelum upload
- ✅ Gunakan lazy loading untuk gambar below the fold
- ✅ Set width & height untuk prevent layout shift
- ❌ Jangan upload gambar > 500KB
- ❌ Jangan gunakan gambar lebih besar dari display size

### 2. Animasi
- ✅ Gunakan `transform` dan `opacity` (GPU accelerated)
- ✅ Implement lazy loading untuk animasi
- ✅ Batasi jumlah animasi yang berjalan bersamaan
- ✅ Gunakan `will-change` dengan bijak
- ❌ Hindari animate `width`, `height`, `top`, `left`
- ❌ Jangan animate terlalu banyak element sekaligus

### 3. CSS
- ✅ Minify CSS di production
- ✅ Remove unused CSS
- ✅ Use CSS containment untuk isolate rendering
- ❌ Hindari complex selectors

### 4. JavaScript
- ✅ Code splitting
- ✅ Lazy load components
- ✅ Debounce/throttle scroll events
- ❌ Hindari blocking operations

## 🔍 Monitoring Performance

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit untuk Performance
4. Review recommendations

### Performance API
```javascript
// Measure page load time
window.addEventListener('load', () => {
  const perfData = performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log(`Page load time: ${pageLoadTime}ms`);
});
```

## 🎯 Next Steps untuk Optimasi Lebih Lanjut

1. **Code Splitting:** Split bundle berdasarkan routes
2. **Service Worker:** Cache assets untuk offline support
3. **CDN:** Serve static assets dari CDN
4. **HTTP/2:** Enable HTTP/2 di server
5. **Preload Critical Assets:** Preload fonts, critical CSS
6. **Defer Non-Critical JS:** Load non-critical scripts async

## 📚 Resources

- [Web.dev Performance](https://web.dev/performance/)
- [MDN Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
