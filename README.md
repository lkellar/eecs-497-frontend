# SoleSpeaks (EECS497 Capstone Project)
![Untitled_Artwork 17](https://github.com/user-attachments/assets/f2ecbb48-8956-42df-8ef9-a9ddc193ced7)


So far this is a basic working demo of literally just login, create lang, import words, and like the most basic flash cards.

I tried to line up with the Figma kinda, but didn't do it perfectly, but I figure after Spring break we can figure out what's next. Right now it's more at the "we can video demo a prototype" kinda stage.

**Check out the url in the sidebar to see a working demo**

## TODO

todos off the top of my head
- Logout doesn't always work?
- Enhance flashcards
- Build in lesson functionality
- Games?
- Export functionality
- Make it look better
- Make it look better ON MobILE

## Setup

This is a react-router based react app. Setup is pretty simple. Clone the repo and install dependencies with `npm install`

Then, create a file called `.env.local` and format it like so (but put in the url of the locally running API) (note the https, login doesn't work locally if not https)

```bash
VITE_API_BASE_URL='https://127.0.0.1:5000'
```

You can then run `npm run dev` and it should start running at some port. I had better luck running it in chrome (the dev environment doesn't like Safari :( ).

Before anything will really work, you'll need to open up the api in another tab (any route will work) and bypass the scary invalid certificate error. This will let the react app use the invalid certificate locally (and allow it to communicate with the API).
