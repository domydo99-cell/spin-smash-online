# Render Free Deploy Guide

## 1. Push this project to GitHub

Render pulls source code from a Git repository.

## 2. Create a Web Service on Render

1. Open [Render Dashboard](https://dashboard.render.com/)
2. Click `New` -> `Blueprint`
3. Select this repository (it will read `render.yaml`)
4. Confirm service settings:
   - `type`: Web Service
   - `plan`: Free
   - `buildCommand`: `npm ci`
   - `startCommand`: `npm start`
5. Deploy

## 3. Open your URL

After deploy, open:

- `https://<your-service>.onrender.com/duel.html`

## 4. Known free-plan behavior

- Free instances spin down after about 15 minutes of no inbound traffic.
- First access after spin-down can take up to about 1 minute.
- For always-on behavior, upgrade to a paid instance.
