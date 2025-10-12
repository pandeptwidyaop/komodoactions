# Komodo Deploy Action

GitHub Action untuk deploy stack di Komodo server menggunakan API.

## Quick Start

### 1. Setup Secrets

Tambahkan secrets di repository Settings → Secrets and variables → Actions:
- `KOMODO_URL` - URL Komodo server Anda
- `KOMODO_API_KEY` - API key dari Komodo
- `KOMODO_API_SECRET` - API secret dari Komodo

### 2. Buat Workflow

Buat file `.github/workflows/deploy.yml` di repository Anda:

```yaml
name: Deploy to Komodo

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Stack
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'my-stack'
```

## Usage Examples

### Deploy Specific Services

Deploy hanya service tertentu saja (misalnya hanya app):

```yaml
- name: Deploy Specific Services
  uses: pandeptwidyaop/komodoactions@v1
  with:
    komodo-url: ${{ secrets.KOMODO_URL }}
    api-key: ${{ secrets.KOMODO_API_KEY }}
    api-secret: ${{ secrets.KOMODO_API_SECRET }}
    stack-name: 'my-stack'
    services: 'app,worker'  # comma-separated
```

### Manual Deploy with Workflow Dispatch

```yaml
name: Manual Deploy

on:
  workflow_dispatch:
    inputs:
      stack-name:
        description: 'Stack name to deploy'
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Stack
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: ${{ github.event.inputs.stack-name }}
```

### Deploy dengan Build Docker Image

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: myusername/myapp:latest

      - name: Deploy to Komodo
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-myapp'
          services: 'app'
```

**📚 Lihat [USAGE_EXAMPLE.md](USAGE_EXAMPLE.md) untuk 10+ contoh penggunaan lainnya!**

## Inputs

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `komodo-url` | Yes | - | URL Komodo server (e.g., `https://komodo.example.com`) |
| `api-key` | Yes | - | Komodo API key |
| `api-secret` | Yes | - | Komodo API secret |
| `stack-name` | Yes | - | Nama stack yang akan di-deploy |
| `services` | No | `''` | Services yang akan di-deploy (comma-separated, kosongkan untuk semua) |
| `wait-for-completion` | No | `true` | Tunggu sampai deployment selesai |
| `show-logs` | No | `true` | Tampilkan detail logs deployment |

## Outputs

| Name | Description |
|------|-------------|
| `update-id` | ID update yang dikembalikan oleh Komodo |
| `status` | Status deployment (jika wait-for-completion true) |

## How to Use in Your Repository

1. **Tambahkan secrets** di Settings → Secrets and variables → Actions:
   - `KOMODO_URL`
   - `KOMODO_API_KEY`
   - `KOMODO_API_SECRET`

2. **Buat workflow file** `.github/workflows/deploy.yml`

3. **Reference action** dengan `pandeptwidyaop/komodoactions@v1`

4. **Push & Deploy!**

## Development

Untuk develop action ini lebih lanjut:

### Testing Locally

```bash
npm install
npm test
```

### Test Deploy

Edit `index.js` dengan credentials Anda dan jalankan:

```bash
node index.js
```

## License

MIT
