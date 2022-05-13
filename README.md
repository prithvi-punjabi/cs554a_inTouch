# cs554a_inTouch

## Our team

Prithvi Punjabi, Nevil Ghelani, Samarth Kapuria, Nirav Patel

## About inTouch

Stevens inTouch is an educational-cum-networking platform that allows students to stay in touch and talk about course content, upcoming deadlines and socialize.

Our inspiration for this project stems from the pressing need for an all-in-one platform that allows students to have academic discussions, and blow off steam. Need to confirm an upcoming deadline? Head to inTouch, open up your course group chat, and ask away. Need to sublet a room? Head to inTouch, post a picture and a description, select the appropriate category for your post, and sit back and relax (till the calls roll in). Need to show all your friends the best meme ever? Head to inTouch!

<!-- How to run re$ale -->

## How to install and run inTouch

Follow the steps to run inTouch.

1. Fork the Project / Download the source code as a zip file
2. Navigate to the project directory
3. Navigate to the server (`cd server`)
4. Install the server-side dependencies (`npm install`) or (`npm i`)
5. Seed the Database (`npm run seed`)
6. Start the server (`npm start`)
7. Navigate back to the root directory
8. Navigate to the client (`cd client`)
9. Install the client-side dependencies (`npm install`) or (`npm i`)
10. Start the client (`npm start`)
11. Navigate to `localhost:3000`
12. Enjoy

<!-- How to use inTouch -->

## How to use inTouch

Follow these steps to use resale.

1. Access the inTouch homepage (`localhost: 3000`)
2. If you already have an account, head to login
3. If you do not have an account, and want to learn about how to obtain your access key, click the hyperlink on the homepage to learn more
4. Once you have your access key, create your account on the sign up page
5. Login, and gain access to inTouch
6. Add friends from reccomendations, or create a post
7. View your friends from the sidebar
8. Access group chats for the courses you are taking and talk to your peers
9. View your profile
10. View other students' profiles
11. Post, like other posts, comment on posts
12. You can also search for posts or users using the search bar

<!-- CONTRIBUTING -->

## Contributing

If you have to add a feature, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/Feature`)
3. Commit your Changes (`git commit -m 'Adding Feature'`)
4. Push to the Branch (`git push origin feature/Feature`)
5. Open a Pull Request

**Note:** If you are **forking this repository**, you will have to create a .env file on the server, and add a variable named SECRET with any secret key for the JWT Token. You will also have to create a .env file on the client, with 2 variables, REACT_APP_AWS_ID and REACT_APP_AWS_SECRET, with your AWS keys.
If you have the project zip file (Prof. Hill / TAs), the .env files will be in the respective project directories.

## Dummy users

|          Emails          | Passwords |
| :----------------------: | :-------: |
|   johndoe1@stevens.edu   | John123!  |
|  janedoe778@stevens.edu  | Jane123!  |
| mikedow1997@stevens.edu  | Mike123!  |
| jasonlive998@stevens.edu | Jason123! |

You can use these accounts to log in (after you seed the db). There are more users, you can view their emails in your database. The passwords are the first name (first letter capitalized) followed by 123!

<p align="right">(<a href="#top">back to top</a>)</p>
