# Cookinity

This is the development repository for the cookinity webapp. https://github.com/nemanjam/mern-boilerplate was used as a boilerplate for creating this app.

## Installation

Read on on how to set up this for development. Clone the repo.

```
$ git clone https://github.com/cookinity/cookinity.git
$ cd cookinity
```

### Server

#### .env file

Rename `.env.example` to `.env` and fill in database connection strings, JWT secret and your client and server production URLs.

```
#db
MONGO_URI_DEV=mongodb://localhost:27017/cookinity
MONGO_URI_PROD=

#jwt
JWT_SECRET_DEV=secret
JWT_SECRET_PROD=

#site urls
CLIENT_URL_DEV=https://localhost:3000
CLIENT_URL_PROD=https://cookinity.herokuapp.com
SERVER_URL_DEV=https://localhost:5000
SERVER_URL_PROD=https://cookinity.herokuapp.com

#img folder path
IMAGES_FOLDER_PATH=/public/images/
```

#### Generate certificates

In order for your server to run on `https` in development as well, you need to generate certificates. Go to `/server/security` folder and run this.

```
$ cd server/security
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256
```

#### Install dependencies

```
$ cd server
$ npm install
```

#### Run the server

You are good to go, server will be available on `https://localhost:5000`

```
$ npm run server
```

### Client

Just install the dependencies and run the dev server. App will load on `https://localhost:3000`.

```
$ cd client
$ npm install
$ npm start
```

That's it as far for development setup. For production check the `Deployment on Heroku` section.

### Generate Admin User

Change the role of the user you want to be a admin to "ADMIN".
![image](https://user-images.githubusercontent.com/29718932/119522214-13c1e280-bd7c-11eb-95b3-08766bc68305.png)

### SetUp Stripe

We are using Stripe as an Payment Provider. Please follow the following steps to setup stripe correctly:

- Create a Stripe Account on: https://stripe.com/. Also setup your account settings under https://dashboard.stripe.com/settings/account. **It is especially important that you setup an account name and public business name here**
- Setup https://stripe.com/docs/stripe-cli on your machine. We need stripe cli to simulate locally during development stripe calling our server.
- We now need to enter several keys from https://dashboard.stripe.com/apikeys into our project. **Important: Make sure you are using the test data API keys**
  - We need the secret stripe key on the server. Your secret test key starts with
    `sk_test_`. Please put it in the `.env` as `STRIPE_SECRET_KEY=`. This is described in the `.env.example`
  - To verify that a message to the server really comes from stripe we also need the stripe endpoint secret.
    You can get your personal secret by executing `stripe listen --print-secret`. Your
    secret starts with `whsec_`. Please put it in the `.env` as `STRIPE_ENDPOINT_SECRET=`. This is described in the `.env.example`.
  - We need the publishable stripe key on the client. Your publishable test key starts with
    `pk_test_`. Please copy the file `src/constants/StripeKeyTEMPLATE.js` into
    `src/constants/StripeKey.js` and enter your own publishable test key into the file.
  - We are now completely setup. **If you want to know test Cookinity with payment enabled, you have to have the
    Stripe CLI running while developing so stripe can communicate with our server. You can start the
    stripe cli in the listening mode with `stripe listen --forward-to https://localhost:5000/api/payment/webhook --skip-verify`**. This command can also be run on the server side with `npm run stripe`

## Deployment on Heroku

#### Push to Heroku

This project is already all set up for deployment on Heroku, you just need to create Heroku application add heroku remote to this repo and push it to `heroku` origin.

```
$ heroku login
$ heroku create my-own-app-name
$ git remote add heroku https://git.heroku.com/my-own-app-name.git
$ git push heroku master
$ heroku open
```

#### Database setup

But before that you need MongoDB database, so go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), create cluster, whitelist all IPs and get database URL. Set that URL in `.env` file as `MONGO_URI_PROD`.

```
MONGO_URI_PROD=mongodb+srv://<your-username-here>:<your-password-here>@cluster0-abcd.mongodb.net/test?retryWrites=true&w=majority
```

If you don't insert environment variables in Heroku manually via web interface or console you'll need to remove `.env` file from `server/.gitignore` and push it to Heroku. Never push `.env` file to development repo though.

```
...
#.env #comment out .env file
...
```

In the following section you can read detailed instructions about Heroku deployment process.

### Server setup

#### Development

Server uses Babel so that we can use the same newer JavaScript syntax like the one used on the Client. In development we are passing `server/src/index.js` file to `babel-node` executable along with `nodemon` daemon. We run that with `npm run server` script.

```
"server": "nodemon --exec babel-node src/index.js",
```

#### Production

That is fine for development, we compile the source on every run but for production we want to avoid that and to compile and build code once to JavaScript version which Node.JS can execute. So we take all the code from `/server/src` folder compile it and put the output into `/server/build` destination folder. `-d` is short for destination, and `-s` flag is for sourcemaps for debugging. We make that into `build-babel` script.

```
"build-babel": "babel -d ./build ./src -s",
```

We also need to delete and make `build` folder on every deployment, so we do that with this simple script.

```
"clean": "rm -rf build && mkdir build",
```

Now we have everything to build our server code. We do that by calling 2 last scripts.

```
"build": "npm run clean && npm run build-babel",
```

Now we just need to call build script and run compiled file with node. Make sure Babel is in the production dependencies in the `server/package.json` or you'll get "babel is not defined" error on Heroku.

```
"start-prod": "npm run build && node ./build/index.js",
```

#### Running server on Heroku

Our server is now all set up, all we need is to call `start-prod` script. Heroku infers runtime he needs to run the application by the type of dependencies file in the root folder, so for Node.JS we need another `package.json`. Heroku will call `start` script after building phase so we just need to pass our `start-prod` script to spin up the server with the `--prefix server` where `server` is folder in which `package.json` with that script is located.

```
"start": "npm run start-prod --prefix server",
```

#### Installing dependencies

Before all this happens Heroku needs to install the dependencies for both server and client, `heroku-postbuild` script is meant for that. `NPM_CONFIG_PRODUCTION=false` variable is there to disable production environment while dependencies are being installed. Again `--prefix` flag is specifying the folder of the script being run. In this script we build our React client as well.

```
"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix server && npm install --prefix client && npm run build --prefix client"
```
