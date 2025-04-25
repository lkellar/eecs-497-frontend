# SoleSpeaks (EECS497 Capstone Project)
<img src="https://github.com/user-attachments/assets/f2ecbb48-8956-42df-8ef9-a9ddc193ced7" width="200" alt="Untitled_Artwork 17">

**Check out the url in the sidebar to see a working demo**

## Current UI
<img width="1389" alt="Screenshot 2025-04-09 at 9 23 52 PM" src="https://github.com/user-attachments/assets/f3190ffb-2a83-4f37-b788-379f1bbf62e0" />

## Setup

This is a react-router based react app. Setup is pretty simple. Clone the repo and install dependencies with `npm install`

Then, create a file called `.env.local` and format it like so (but put in the url of the locally running API) (note the https, login doesn't work locally if not https)

```bash
VITE_API_BASE_URL='https://127.0.0.1:5000'
```

You can then run `npm run dev` and it should start running at some port. I had better luck running it in chrome (the dev environment doesn't like Safari :( ).

Before anything will really work, you'll need to open up the api in another tab (any route will work) and bypass the scary invalid certificate error. This will let the react app use the invalid certificate locally (and allow it to communicate with the API).
