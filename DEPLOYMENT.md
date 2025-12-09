# Deployment Guide

## Automatic Deployment (GitHub Actions)

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

### Setup Requirements

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Under "Build and deployment", select "GitHub Actions" as the source
   - Save the settings

2. **Permissions**: The workflow already includes the necessary permissions:
   - `contents: read` - to read the repository
   - `pages: write` - to deploy to GitHub Pages
   - `id-token: write` - for authentication

### Workflow Files

- **`.github/workflows/deploy.yml`** - Main deployment workflow
  - Triggers on push to `main` branch
  - Can also be manually triggered via GitHub Actions UI
  - Builds the project and deploys to GitHub Pages

- **`.github/workflows/ci.yml`** - Continuous Integration
  - Runs on pull requests and non-main branches
  - Performs linting and build checks
  - Does NOT deploy

### Automatic Deployment Process

When you push to `main`:
1. GitHub Actions checks out the code
2. Installs Node.js 18 and dependencies
3. Builds the project (`npm run build`)
4. Uploads the `dist` folder as an artifact
5. Deploys to GitHub Pages
6. Your site is live at `https://<username>.github.io/insert/`

### Manual Deployment

You can also deploy manually using npm:

```bash
npm run deploy
```

This uses `gh-pages` package to deploy the `dist` folder to the `gh-pages` branch.

### Configuration

The deployment is configured in `vue.config.js`:

```javascript
publicPath: process.env.NODE_ENV === 'production' ? '/insert/' : '/',
```

This ensures assets load correctly from the `/insert/` subdirectory on GitHub Pages.

### Troubleshooting

**Deployment fails:**
- Check GitHub Actions logs in the "Actions" tab
- Verify GitHub Pages is enabled in repository settings
- Ensure permissions are correctly set

**Assets not loading:**
- Verify `publicPath` in `vue.config.js` matches your repository name
- Check browser console for 404 errors
- Clear browser cache

**Build errors:**
- Run `npm run build` locally first
- Fix any linting or build errors
- Commit and push fixes to `main`

### Viewing Deployment Status

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. View running/completed workflows
4. Click on a workflow run to see detailed logs

### Deployment URL

After successful deployment, your app will be available at:
```
https://ampleyan.github.io/insert/
```

### Environment Variables

No environment variables are required for deployment. All configuration is in:
- `vue.config.js` - Build configuration
- `package.json` - Scripts and dependencies
- `.github/workflows/` - GitHub Actions configuration

### Rollback

To rollback to a previous version:

1. **Via GitHub Actions:**
   - Go to Actions tab
   - Find the successful workflow run you want to redeploy
   - Click "Re-run all jobs"

2. **Via manual deployment:**
   ```bash
   git checkout <commit-hash>
   npm run deploy
   git checkout main
   ```

### Monitoring

- **Build Status**: Check the GitHub Actions badge in README
- **Deployment Logs**: View in GitHub Actions tab
- **Live Site**: Visit the GitHub Pages URL

### Best Practices

1. Always test locally with `npm run build` before pushing
2. Use pull requests for new features (triggers CI checks)
3. Only merge to `main` when ready to deploy
4. Monitor the Actions tab for deployment status
5. Keep dependencies updated for security

### Manual Build & Deploy Commands

```bash
# Local development
npm run serve

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Lint code
npm run lint

# Format code
npm run format
```
