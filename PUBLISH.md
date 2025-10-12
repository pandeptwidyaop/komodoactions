# Cara Publish GitHub Action

Langkah-langkah untuk publish action ini ke `github.com/pandeptwidyaop/komodoactions`:

## 1. Buat Repository Baru di GitHub

1. Buka https://github.com/new
2. Repository name: `komodoactions`
3. Visibility: **Public** (agar bisa digunakan sebagai action)
4. **Jangan** initialize dengan README (kita sudah punya)
5. Click "Create repository"

## 2. Push Code ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Komodo deploy GitHub Action"

# Add remote
git remote add origin https://github.com/pandeptwidyaop/komodoactions.git

# Push to main branch
git branch -M main
git push -u origin main
```

## 3. Buat Release/Tag

GitHub Actions harus menggunakan tag/release agar bisa di-reference dengan `@v1`:

```bash
# Create tag v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"

# Push tag
git push origin v1.0.0

# Create major version tag (v1)
git tag -a v1 -m "Release v1"
git push origin v1
```

> **Note:** Tag `v1` akan selalu point ke latest v1.x.x release. User bisa pakai `@v1` untuk auto-update atau `@v1.0.0` untuk specific version.

## 4. Buat Release di GitHub (Optional tapi Recommended)

1. Buka repo di GitHub
2. Click "Releases" → "Create a new release"
3. Choose tag: `v1.0.0`
4. Release title: `v1.0.0`
5. Description:
   ```markdown
   ## 🚀 Features
   - Deploy Komodo stacks via GitHub Actions
   - Support specific services deployment
   - Show detailed deployment logs
   - Wait for completion or trigger only

   ## 📖 Usage
   See [README.md](https://github.com/pandeptwidyaop/komodoactions#readme) for usage examples.
   ```
6. Click "Publish release"

## 5. Test di Repository Lain

Buat test repository dengan workflow:

```yaml
name: Test Action

on:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Stack
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'dev-pijatmu'
          services: 'app'
```

## 6. Update Action (Future)

Untuk release versi baru:

```bash
# Make changes to code
git add .
git commit -m "feat: add new feature"
git push

# Create new tag
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1

# Update major version tag
git tag -fa v1 -m "Update v1 to v1.0.1"
git push origin v1 --force
```

## 7. Publish ke GitHub Marketplace (Optional)

1. Pastikan `action.yml` sudah complete dengan description, author, branding
2. Buka repo → Releases → Edit release
3. Check "Publish this Action to the GitHub Marketplace"
4. Follow instruksi untuk submit

## File Structure

Pastikan struktur file seperti ini:

```
komodoactions/
├── action.yml          # Metadata action (REQUIRED)
├── main.js            # Entry point
├── package.json       # Dependencies
├── node_modules/      # Dependencies (will be committed for actions)
├── index.js           # POC/test file
├── README.md          # Documentation
├── USAGE_EXAMPLE.md   # Usage examples
├── LICENSE            # License file
└── .gitignore
```

## Important Notes

1. **node_modules HARUS di-commit** untuk JavaScript actions (atau gunakan ncc untuk bundle)
2. **Public repository** required untuk digunakan di repo lain
3. **Tag v1** memudahkan users untuk auto-update minor versions
4. **README.md** sangat penting untuk documentation

## Alternative: Bundle dengan ncc (Optional)

Untuk menghindari commit node_modules:

```bash
npm install -g @vercel/ncc
ncc build main.js -o dist

# Update action.yml
# main: 'dist/index.js'
```

## Quick Checklist

- [ ] Repository public
- [ ] `action.yml` ada di root
- [ ] `main.js` dan dependencies ada
- [ ] `node_modules` committed (jika tidak pakai ncc)
- [ ] README.md dengan usage examples
- [ ] Tag v1.0.0 dan v1 sudah dibuat
- [ ] Test di repository lain
- [ ] (Optional) Publish ke Marketplace
