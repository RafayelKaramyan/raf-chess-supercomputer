# Deployment

## Vercel deployment

1. Sign in to Vercel with the GitHub account that owns this repository.
2. Choose **Add New → Project**.
3. Import `RafayelKaramyan/raf-chess-supercomputer`.
4. Keep the framework preset as **Vite**.
5. Use the following settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
6. Click **Deploy**.
7. After deployment completes, open the generated Vercel URL and test the board, PGN import/export, saved games, and student directory.

The source repository is private. The deployed website's visibility is controlled separately by the Vercel project's deployment and access settings. Choose the access policy before sharing the website URL.

## Important

A successful GitHub push does not itself publish a website. A deployment provider must build and host the Vite app. No production URL should be considered active until Vercel reports a successful deployment.
