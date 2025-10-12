# Komodo Deploy Action

GitHub Action to deploy stacks on Komodo server using API.

## Quick Start

### 1. Setup Secrets

Add secrets in repository Settings → Secrets and variables → Actions:
- `KOMODO_URL` - Your Komodo server URL
- `KOMODO_API_KEY` - API key from Komodo
- `KOMODO_API_SECRET` - API secret from Komodo

### 2. Create Workflow

Create file `.github/workflows/deploy.yml` in your repository:

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

Deploy only specific services (e.g., only app service):

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

### Deploy with Pull Before Deploy

Pull the latest changes before deploying:

```yaml
- name: Deploy with Pull
  uses: pandeptwidyaop/komodoactions@v1
  with:
    komodo-url: ${{ secrets.KOMODO_URL }}
    api-key: ${{ secrets.KOMODO_API_KEY }}
    api-secret: ${{ secrets.KOMODO_API_SECRET }}
    stack-name: 'dev-pijatmu'
    services: 'app'
    pull-before-deploy: true  # Pull stack before deploy
```

### Deploy with Docker Build

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

**📚 See [USAGE_EXAMPLE.md](USAGE_EXAMPLE.md) for 10+ more usage examples!**

## Inputs

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `komodo-url` | Yes | - | Komodo server URL (e.g., `https://komodo.example.com`) |
| `api-key` | Yes | - | Komodo API key |
| `api-secret` | Yes | - | Komodo API secret |
| `stack-name` | Yes | - | Stack name to deploy |
| `services` | No | `''` | Services to deploy (comma-separated, leave empty for all services) |
| `wait-for-completion` | No | `true` | Wait until deployment completes |
| `show-logs` | No | `true` | Show detailed deployment logs |
| `pull-before-deploy` | No | `false` | Pull stack before deployment |

## Outputs

| Name | Description |
|------|-------------|
| `update-id` | Update ID returned by Komodo |
| `status` | Deployment status (if wait-for-completion is true) |

## How to Use in Your Repository

1. **Add secrets** in Settings → Secrets and variables → Actions:
   - `KOMODO_URL`
   - `KOMODO_API_KEY`
   - `KOMODO_API_SECRET`

2. **Create workflow file** `.github/workflows/deploy.yml`

3. **Reference action** with `pandeptwidyaop/komodoactions@v1`

4. **Push & Deploy!**

## Development

To develop this action further:

### Testing Locally

```bash
npm install
npm test
```

### Test Deploy

Edit `index.js` with your credentials and run:

```bash
node index.js
```

## License

MIT
