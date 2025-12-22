# CI/CD Pipeline Setup for Vercel Deployment

This repository is configured with a GitHub Actions workflow that automatically deploys your Next.js application to Vercel whenever you push code to the main branch.

## 🚀 How It Works

The CI/CD pipeline includes two main jobs:

### 1. Deploy-Preview (Pull Requests)
- Triggers on pull requests to the main branch
- Creates a preview deployment on Vercel
- Runs linting and quality checks
- Allows you to test changes before merging

### 2. Deploy-Production (Main Branch)
- Triggers on pushes to the main branch
- Deploys to your production Vercel environment
- Runs the same quality checks
- Automatically updates your live site

## 🔧 Setup Instructions

To enable this CI/CD pipeline, you need to configure the following GitHub repository secrets:

### Required Secrets

1. **VERCEL_TOKEN**
   - Go to [Vercel Dashboard → Settings → Tokens](https://vercel.com/account/tokens)
   - Create a new token with appropriate scope
   - Add it as a repository secret in GitHub

2. **VERCEL_ORG_ID**
   - Found in your `.vercel/project.json` file
   - Current value: `team_QVADaiSuKcl4be398dG9SANp`

3. **VERCEL_PROJECT_ID**
   - Found in your `.vercel/project.json` file
   - Current value: `prj_fklQ0BUmny5cwOxaparlLds0p6tt`

### Adding Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact names listed above

## 📁 Project Structure

```
.github/
└── workflows/
    └── deploy.yml       # GitHub Actions workflow file
.vercel/
└── project.json        # Vercel project configuration
```

## 🔄 Workflow Triggers

- **Push to main**: Triggers production deployment
- **Pull request to main**: Triggers preview deployment
- Both workflows include:
  - Dependency installation
  - Code linting
  - Vercel build and deployment

## 🛠 Local Development

To work with this setup locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## 🔐 Security Notes

- Never commit your Vercel token to the repository
- All sensitive information is stored as GitHub secrets
- The workflow only runs on your repository with proper authentication

## 📊 Monitoring Deployments

- View deployment status in the **Actions** tab of your GitHub repository
- Check deployment details on your [Vercel Dashboard](https://vercel.com/dashboard)
- Preview deployments will have unique URLs for testing

## 🚨 Troubleshooting

### Common Issues

1. **Deployment Fails**: Check that all secrets are correctly set
2. **Build Errors**: Ensure your code passes linting and builds locally
3. **Permission Issues**: Verify your Vercel token has the correct permissions

### Debugging Steps

1. Check the Actions tab for detailed error logs
2. Verify all required secrets are present and correct
3. Test your build locally with `npm run build`
4. Ensure your Vercel project is properly linked

## 🎯 Next Steps

After setting up the secrets, your deployment pipeline will be fully automated:

1. Make changes to your code
2. Push to main branch
3. GitHub Actions will automatically deploy to Vercel
4. Your live site will be updated within minutes

For pull requests, you'll get preview deployments to test changes before merging.

---

**Note**: Remember to update your dependencies regularly and monitor your Vercel usage to stay within your plan limits.