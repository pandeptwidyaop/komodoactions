# Contoh Penggunaan Komodo Actions

Setelah action dipublish di `github.com/pandeptwidyaop/komodoactions`, berikut cara menggunakannya di repo lain.

## Setup di Repository Lain

### 1. Tambahkan Secrets

Di repository yang akan menggunakan action ini, tambahkan secrets:

**Settings → Secrets and variables → Actions → New repository secret**

- `KOMODO_URL` = `https://komodo.internal.trofeo.cloud`
- `KOMODO_API_KEY` = `K-xxxxx...`
- `KOMODO_API_SECRET` = `S-xxxxx...`

### 2. Buat Workflow File

Buat file `.github/workflows/deploy.yml` di repository Anda:

## Contoh 1: Deploy on Push to Main

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
          stack-name: 'prod-myapp'
```

## Contoh 2: Deploy Specific Service (App Only)

```yaml
name: Deploy App Service

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'Dockerfile'

jobs:
  deploy-app:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy App Service
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-myapp'
          services: 'app'
```

## Contoh 3: Deploy Multiple Services

```yaml
name: Deploy App and Worker

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Services
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-myapp'
          services: 'app,worker,scheduler'
```

## Contoh 4: Manual Deploy dengan Workflow Dispatch

```yaml
name: Manual Deploy

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - dev
          - staging
          - production
      services:
        description: 'Services to deploy (comma-separated)'
        required: false
        default: ''

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ${{ github.event.inputs.environment }}
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: '${{ github.event.inputs.environment }}-myapp'
          services: ${{ github.event.inputs.services }}
```

## Contoh 5: Deploy dengan Environment Variables

```yaml
name: Multi-Environment Deploy

on:
  push:
    branches:
      - main
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Set environment
        id: env
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "stack=prod-myapp" >> $GITHUB_OUTPUT
            echo "env=production" >> $GITHUB_OUTPUT
          else
            echo "stack=dev-myapp" >> $GITHUB_OUTPUT
            echo "env=development" >> $GITHUB_OUTPUT
          fi

      - name: Deploy to ${{ steps.env.outputs.env }}
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: ${{ steps.env.outputs.stack }}
          services: 'app'

      - name: Notify Deployment
        if: success()
        run: |
          echo "🚀 Deployed ${{ steps.env.outputs.stack }} successfully!"
```

## Contoh 6: Deploy dengan Notification (Slack/Discord)

```yaml
name: Deploy with Notification

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Stack
        id: deploy
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-myapp'
          services: 'app'

      - name: Notify Success
        if: success()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{
              "text": "✅ Deployment Success!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Deployment Successful*\n• Stack: prod-myapp\n• Update ID: ${{ steps.deploy.outputs.update-id }}\n• Status: ${{ steps.deploy.outputs.status }}"
                  }
                }
              ]
            }'

      - name: Notify Failure
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-Type: application/json' \
            -d '{"text": "❌ Deployment Failed for prod-myapp"}'
```

## Contoh 7: Trigger Only (No Wait)

Untuk deployment besar yang tidak perlu menunggu selesai:

```yaml
name: Trigger Deploy

on:
  push:
    branches: [main]

jobs:
  trigger-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Deployment
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-myapp'
          wait-for-completion: 'false'
```

## Contoh 8: Multi-Stack Deployment

Deploy multiple stacks secara bersamaan:

```yaml
name: Deploy Multiple Stacks

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy API Stack
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-api'

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Web Stack
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-web'

  deploy-worker:
    runs-on: ubuntu-latest
    needs: [deploy-api]  # Deploy worker after API is ready
    steps:
      - name: Deploy Worker Stack
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-worker'
```

## Contoh 9: Deploy dengan Approval (Production)

Deploy ke production dengan manual approval:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.example.com
    steps:
      - name: Deploy to Production
        uses: pandeptwidyaop/komodoactions@v1
        with:
          komodo-url: ${{ secrets.KOMODO_URL }}
          api-key: ${{ secrets.KOMODO_API_KEY }}
          api-secret: ${{ secrets.KOMODO_API_SECRET }}
          stack-name: 'prod-myapp'
```

> **Note:** Untuk menggunakan approval, setup di repository Settings → Environments → Create environment → Add protection rules → Required reviewers

## Contoh 10: Deploy dengan Build Step

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

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

## Tips

1. **Gunakan environment secrets** untuk different environments (dev, staging, prod)
2. **Enable branch protection** untuk production deployments
3. **Monitor deployment logs** dengan `show-logs: 'true'` (default)
4. **Use specific versions** seperti `@v1.0.0` untuk stability
5. **Test di dev/staging** sebelum deploy ke production

## Troubleshooting

Jika deployment gagal, check:
- API key & secret masih valid
- Stack name benar
- Service name exists di stack
- Network connectivity ke Komodo server
