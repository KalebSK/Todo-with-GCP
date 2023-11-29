## Todo App with GCP integration

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Description

This is a Todo App that integrates with Google Tasks to store and retrieve a list of todos from the cloud. The app utilizes a LibSQL database to store important user information after the user syncs for the first time.

## Database Setup
This application requires a LibSQL compatible database setup with two tables. I use a Turso database for its simplicity and easy setup check it out [Turso](https://turso.tech/) once you have your database setup you will have to place the URL and KEY in a file called ".env.local". There is a env template in this repo that you can use to match key names. To generate the tables needed in the database you can run the file "dbConnect.mjs" with node. WARNING: THIS FILE WILL DROP EXISTING TABLES DO NOT RUN THIS FILE UNLESS YOU WANT TO START A FRESH DATABASE!! The database should be good to go after the file is executed.

## Google Cloud Platform setup
STEPS:
1. This application requires a google oAuth 2.0 client to be configured [Google API Client Setup](https://console.cloud.google.com/apis/dashboard) after setup add the Client ID to Client Secret to the .env.local file. 

2. Make sure to configure OAuth [consent screen](https://console.cloud.google.com/apis/credentials/consent)

The sync feature of the app should now work after being correctly configured. 
Disclaimer: The application will function without sync integration but the tasks will only be stored locally on a single client and can't be seen or modified across different clients without setting up the Google Cloud Platform

## Usage
1. Adding Tasks
The app is very user friendly. Once the user loads the page the app will load the locally stored tasks or display a message stating that they have no active tasks. To create a new task the user can click the "Add" button. A dialog will be displayed where the user can enter a task description and select from three levels of priority. To close the dialog, the user can click the "Done" button. 

2. Removing Tasks
To remove a task(s) the user can click on a task this will select the task and visually display a blue ring around each selected task. Clicking the "Remove" button will remove the tasks from the task list locally.

3. Sync
To sync tasks with the Cloud the user can click the sync button. Once the user clicks the sync button they will be redirected to the google sign in page to give the app consent to see the scoped information for the app. After the user successfully signs in, the client will send the required information to perform a sync. The updated task list is then returned to the client and displayed the user. The client tracks all the required information required between syncs so the cloud list stays updated correctly.
