# Contoh Penggunaan di Repository Lain

Setelah action dipublish ke `github.com/pandeptwidyaop/komodoactions`, ikuti langkah berikut untuk menggunakannya di repository project Anda.

---

## Scenario 1: Deploy Project Pijatmu

Repository: `github.com/yourcompany/pijatmu-app`

### Setup

**1. Tambahkan Secrets:**

Settings → Secrets and variables → Actions → New repository secret

- `KOMODO_URL` = `https://komodo.internal.trofeo.cloud`
- `KOMODO_API_KEY` = `K-xxxxx...`
- `KOMODO_API_SECRET` = `S-xxxxx...`

**2. Buat Workflow File:**

`.github/workflows/deploy.yml`

```yaml
name: Deploy to Dev

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy App Service
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'dev-pijatmu'
          services: 'app'
```

**3. Push & Deploy:**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add auto deploy"
git push origin develop
```

---

## Scenario 2: Deploy Project Timku

Repository: `github.com/yourcompany/timku-api`

### Multi-Environment Deploy

`.github/workflows/deploy.yml`

```yaml
name: Deploy Multi Environment

on:
  push:
    branches:
      - develop
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Set Environment
        id: env
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "stack=prod-timku" >> $GITHUB_OUTPUT
            echo "env=production" >> $GITHUB_OUTPUT
          else
            echo "stack=dev-timku" >> $GITHUB_OUTPUT
            echo "env=development" >> $GITHUB_OUTPUT
          fi

      - name: Deploy to ${{ steps.env.outputs.env }}
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: ${{ steps.env.outputs.stack }}

      - name: Notify
        if: success()
        run: |
          echo "✅ Deployed ${{ steps.env.outputs.stack }} successfully!"
```

**Hasil:**
- Push ke `develop` → Deploy ke `dev-timku`
- Push ke `main` → Deploy ke `prod-timku`

---

## Scenario 3: Build Docker → Deploy

Repository: `github.com/yourcompany/myapp`

### Build & Push Docker Image, then Deploy

`.github/workflows/build-deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push Image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: |
            yourcompany/myapp:latest
            yourcompany/myapp:${{ github.sha }}

      - name: Deploy to Komodo
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-myapp'
          services: 'app'
```

---

## Scenario 4: Manual Deploy dengan Approval

Repository: `github.com/yourcompany/critical-app`

### Deploy to Production with Approval

**1. Setup Environment Protection:**

Settings → Environments → New environment → `production`

- Add required reviewers
- Set deployment branch: `main` only

**2. Create Workflow:**

`.github/workflows/deploy-prod.yml`

```yaml
name: Deploy to Production

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.trofeo.cloud
    steps:
      - name: Deploy Stack
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-critical-app'
```

**Usage:**
1. Go to Actions tab
2. Select "Deploy to Production"
3. Click "Run workflow"
4. **Wait for approval** dari reviewer
5. Deployment runs after approval

---

## Scenario 5: Deploy hanya Service Tertentu

Repository: `github.com/yourcompany/microservices-app`

### Deploy Only Changed Services

`.github/workflows/deploy-changed.yml`

```yaml
name: Deploy Changed Services

on:
  push:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      api: ${{ steps.changes.outputs.api }}
      worker: ${{ steps.changes.outputs.worker }}
      frontend: ${{ steps.changes.outputs.frontend }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            api:
              - 'services/api/**'
            worker:
              - 'services/worker/**'
            frontend:
              - 'services/frontend/**'

  deploy-api:
    needs: detect-changes
    if: needs.detect-changes.outputs.api == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy API Service
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-app'
          services: 'api'

  deploy-worker:
    needs: detect-changes
    if: needs.detect-changes.outputs.worker == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Worker Service
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-app'
          services: 'worker'

  deploy-frontend:
    needs: detect-changes
    if: needs.detect-changes.outputs.frontend == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Frontend Service
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-app'
          services: 'frontend'
```

**Hasil:**
- Hanya deploy service yang berubah
- Saves time & resources
- Parallel deployment per service

---

## Quick Reference

### Minimal Setup (3 langkah):

1. **Add secrets:** `KOMODO_URL`, `KOMODO_API_KEY`, `KOMODO_API_SECRET`

2. **Create `.github/workflows/deploy.yml`:**
   ```yaml
   name: Deploy
   on: [push]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: pandeptwidyaop/komodoactions@v1
           with:
             komodo-url: ${{ secrets.KOMODO_URL }}
             api-key: ${{ secrets.KOMODO_API_KEY }}
             api-secret: ${{ secrets.KOMODO_API_SECRET }}
             stack-name: 'your-stack-name'
   ```

3. **Push!**

---

## Tips

- Use `@v1` for auto-updates, `@v1.0.0` for locked version
- Test di dev environment dulu sebelum production
- Use `show-logs: 'true'` untuk debug
- Set `wait-for-completion: 'false'` untuk large deployments
- Gunakan environments + approvals untuk production

## Troubleshooting

**Q: Action error "Resource not accessible by integration"**
- A: Pastikan secrets sudah ditambahkan dengan benar

**Q: Deploy gagal "Stack not found"**
- A: Check stack name spelling

**Q: Service not found**
- A: Pastikan service name ada di stack compose file

**Q: Timeout**
- A: Set `wait-for-completion: 'false'` atau increase GitHub Actions timeout
