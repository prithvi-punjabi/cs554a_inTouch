const { ObjectId } = require("mongodb");
const dbConnection = require("../config/mongoConnection");
const { userData } = require("../data");
const seedFuncs = require("./seedfuncs");

async function main() {
  const db = await dbConnection();
  try {
    console.log("Starting seed!");
    await db.dropDatabase();
    const JohnDoe = await seedFuncs.addUser(
      "John Doe",
      "johndoe1@stevens.edu",
      "John123!",
      "https://www.w3schools.com/howto/img_avatar.png",
      "johndoe",
      "Hey I am John Doe! I love computers and I want to be the CEO of google one day!",
      [
        {
          id: 56739,
          name: "Knowledge Discovery and Data Mining",
          code: "2022S CS 513-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56748,
          name: "Deep Learning",
          code: "2022S CS 583-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56734,
          name: "Web Programming II",
          code: "2022S CS 554-A",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      "Male",
      "123456789",
      "1999-08-02",
      []
    );
    const JaneDoe = await seedFuncs.addUser(
      "Jane Doe",
      "janedoe778@stevens.edu",
      "Jane123!",
      "https://www.w3schools.com/howto/img_avatar2.png",
      "janedoe",
      "Hello! I am Jane Doe! I am an avid book reader and I love to play chess in my spare time. I love working on full stack development projects, so contact me if you're interested!",
      [
        {
          id: 56769,
          name: "Agile Methods for Software Development",
          code: "2022S CS 555-D",
          end_date: null,
        },
        {
          id: 58451,
          name: "Online Social Networks",
          code: "2022S CS 581-WS1",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56734,
          name: "Web Programming II",
          code: "2022S CS 554-A",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      "Female",
      "7764986763",
      "1998-04-12",
      []
    );
    await userData.addFriend(JaneDoe._id.toString(), JohnDoe._id.toString());
    const MikeDowry = await seedFuncs.addUser(
      "Mike Dowry",
      "mikedow1997@stevens.edu",
      "Mike123!",
      "https://www.w3schools.com/w3images/avatar2.png",
      "mikedowry",
      "Hey guys! My name is Mike, and I love to code! My language of choice is C++, but I currently trying to learn Full Stack Web development.",
      [
        {
          id: 56739,
          name: "Knowledge Discovery and Data Mining",
          code: "2022S CS 513-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 58451,
          name: "Online Social Networks",
          code: "2022S CS 581-WS1",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56734,
          name: "Web Programming II",
          code: "2022S CS 554-A",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      "Male",
      "6469045532",
      "1998-12-06",
      []
    );
    await userData.addFriend(MikeDowry._id.toString(), JaneDoe._id.toString());
    await userData.addFriend(MikeDowry._id.toString(), JohnDoe._id.toString());
    const JasonLively = await seedFuncs.addUser(
      "Jason Lively",
      "jasonlive998@stevens.edu",
      "Jason123!",
      "https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?b=1&k=20&m=476085198&s=170667a&w=0&h=Ct4e1kIOdCOrEgvsQg4A1qeuQv944pPFORUQcaGw4oI=",
      "jasonlively",
      "What up my peeps! I'm Jason, an undergraduate student at Stevens! I have a passion for writing code, and I want to be the best programmer out there. I work hard, respect deadlines, and love to collaborate on projects. Hit me up if you want to work together.",
      [
        {
          id: 56748,
          name: "Deep Learning",
          code: "2022S CS 583-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56780,
          name: "Introduction to Cloud Computing",
          code: "2022S CS 524-A",
          end_date: null,
        },
        {
          id: 56739,
          name: "Knowledge Discovery and Data Mining",
          code: "2022S CS 513-A",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      "Male",
      "9124213443",
      "2000-05-17",
      []
    );
    await userData.addFriend(
      JasonLively._id.toString(),
      JohnDoe._id.toString()
    );
    await userData.addFriend(
      JasonLively._id.toString(),
      MikeDowry._id.toString()
    );
    const MonicaPrice = await seedFuncs.addUser(
      "Monica Price",
      "monprice1@stevens.edu",
      "Monica123!",
      "https://cdn3.vectorstock.com/i/1000x1000/31/77/beautiful-latin-woman-avatar-character-icon-vector-33983177.jpg",
      "monicaprice",
      "Hey guys, I'm Monica! I'm a graduate student looking to leave my mark. I hate leetcode, but I guess that's what brought me this far, so meh. Well, that's me! I also play tennis in  my down time, and I have a little husky puppy named Wolfie.",
      [
        {
          id: 58451,
          name: "Online Social Networks",
          code: "2022S CS 581-WS1",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56780,
          name: "Introduction to Cloud Computing",
          code: "2022S CS 524-A",
          end_date: null,
        },
        {
          id: 56769,
          name: "Agile Methods for Software Development",
          code: "2022S CS 555-D",
          end_date: null,
        },
      ],
      "Female",
      "2123987764",
      "1997-01-21",
      []
    );
    await userData.addFriend(
      MonicaPrice._id.toString(),
      JaneDoe._id.toString()
    );
    await userData.addFriend(
      MonicaPrice._id.toString(),
      JohnDoe._id.toString()
    );
    await userData.addFriend(
      MonicaPrice._id.toString(),
      JasonLively._id.toString()
    );
    const AnchalShah = await seedFuncs.addUser(
      "Anchal Shah",
      "anshah2@stevens.edu",
      "Anchal123!",
      "https://static.vecteezy.com/system/resources/previews/004/773/704/large_2x/a-girl-s-face-with-a-beautiful-smile-a-female-avatar-for-a-website-and-social-network-vector.jpg",
      "anchalshah",
      "Hey guys, I'm Anchal! I'm an international graduate student from India. I love to cook and code! ",
      [
        {
          id: 56734,
          name: "Web Programming II",
          code: "2022S CS 554-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56780,
          name: "Introduction to Cloud Computing",
          code: "2022S CS 524-A",
          end_date: null,
        },
        {
          id: 56739,
          name: "Knowledge Discovery and Data Mining",
          code: "2022S CS 513-A",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      "Female",
      "4145396639",
      "1996-09-30",
      []
    );
    const PatrickMountain = await seedFuncs.addUser(
      "Patrick Mountain",
      "patmount4@stevens.edu",
      "Patrick123!",
      "http://www.graffixnyc.com/images/me.jpg",
      "patrickmountain",
      "Hey guys! My name is Patrick, and I am a Full Stack Developer! I have worked in the industry for many years, and I'm at Stevens to complete my Master's Degree and be the very best there ever was. (I already am lol)",
      [
        {
          id: 56734,
          name: "Web Programming II",
          code: "2022S CS 554-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56769,
          name: "Agile Methods for Software Development",
          code: "2022S CS 555-D",
          end_date: null,
        },
        {
          id: 58451,
          name: "Online Social Networks",
          code: "2022S CS 581-WS1",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      "Male",
      "9123129967",
      "1978-07-17",
      []
    );
    const TristanPrice = await seedFuncs.addUser(
      "Tristan Price",
      "tprice9@stevens.edu",
      "Tristan123!",
      "https://static.vecteezy.com/system/resources/previews/002/275/847/original/male-avatar-profile-icon-of-smiling-caucasian-man-vector.jpg",
      "tristanprice",
      "I'm Tristan! Enough said.",
      [
        {
          id: 56739,
          name: "Knowledge Discovery and Data Mining",
          code: "2022S CS 513-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56780,
          name: "Introduction to Cloud Computing",
          code: "2022S CS 524-A",
          end_date: null,
        },
        {
          id: 56748,
          name: "Deep Learning",
          code: "2022S CS 583-A",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      "Male",
      "4012988823",
      "1999-02-23",
      []
    );
    const NatashaZigler = await seedFuncs.addUser(
      "Natasha Zigler",
      "natashazig66@stevens.edu",
      "Natasha123!",
      "https://freesvg.org/img/Female-Avatar-3.png",
      "natashazigler",
      "Hey guys! My name is Natasha and I am a senior. I would love to connect with like-minded people, so feel free to message me if you would like to discuss murder mystery novels, pop-rock or Neural Networks!",
      [
        {
          id: 58451,
          name: "Online Social Networks",
          code: "2022S CS 581-WS1",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56739,
          name: "Knowledge Discovery and Data Mining",
          code: "2022S CS 513-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56748,
          name: "Deep Learning",
          code: "2022S CS 583-A",
          end_date: "2022-05-18T00:00:00Z",
        },
      ],
      "Female",
      "2129099978",
      "2000-11-16",
      []
    );
    const DwightSchrute = await seedFuncs.addUser(
      "Dwight Schrute",
      "dshrute88@stevens.edu",
      "Dwight123!",
      "https://cdn.dribbble.com/users/1634115/screenshots/10876302/media/036b7a99d2d09b59883d09f614c77e21.jpg?compress=1&resize=400x300&vertical=top",
      "dwightschrute",
      "Whenever I'm about to do something, I think, 'Would an idiot do that?' And if they would, I do not do that thing.",
      [
        {
          id: 56734,
          name: "Web Programming II",
          code: "2022S CS 554-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 58451,
          name: "Online Social Networks",
          code: "2022S CS 581-WS1",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56780,
          name: "Introduction to Cloud Computing",
          code: "2022S CS 524-A",
          end_date: null,
        },
      ],
      "Male",
      "4012325545",
      "1966-01-20",
      []
    );

    const LewisHamilton = await seedFuncs.addUser(
      "Lewis Hamilton",
      "lewisham@stevens.edu",
      "Lewis123!",
      "https://cdn-5.motorsport.com/images/mgl/0mb95oa2/s800/lewis-hamilton-mercedes-1.jpg",
      "lewishamilton",
      "I'm an F1 driver who's at Stevens to complete my Masters in Computer Science! (I know I know, but I love to code as much as I love to race!)",
      [
        {
          id: 56734,
          name: "Web Programming II",
          code: "2022S CS 554-A",
          end_date: "2022-05-18T00:00:00Z",
        },
        {
          id: 56780,
          name: "Introduction to Cloud Computing",
          code: "2022S CS 524-A",
          end_date: null,
        },
        {
          id: 56806,
          name: "Database Management Systems I",
          code: "2022S CS 561-B",
          end_date: null,
        },
      ],
      "Male",
      "2124411996",
      "1985-01-07",
      []
    );
    await userData.addFriend(
      LewisHamilton._id.toString(),
      PatrickMountain._id.toString()
    );
    await userData.addFriend(
      LewisHamilton._id.toString(),
      TristanPrice._id.toString()
    );
    await userData.addFriend(
      LewisHamilton._id.toString(),
      DwightSchrute._id.toString()
    );

    const post1 = await seedFuncs.addPost(
      {
        _id: JaneDoe._id,
        name: JaneDoe.name,
        userName: JaneDoe.userName,
        profilePicture: JaneDoe.profilePicture,
      },
      "Looking for people to collaborate with on this new google hackathon! Let me know if you guy's want in!",
      "",
      [PatrickMountain._id.toString(), TristanPrice._id.toString()],
      [
        {
          _id: new ObjectId(),
          user: {
            _id: PatrickMountain._id,
            name: PatrickMountain.name,
            userName: PatrickMountain.userName,
            profilePicture: PatrickMountain.profilePicture,
          },
          comment: "Count me in!",
          dateCreated: new Date(new Date().toUTCString()),
        },
      ],
      "academic"
    );
    const post2 = await seedFuncs.addPost(
      {
        _id: AnchalShah._id,
        name: AnchalShah.name,
        userName: AnchalShah.userName,
        profilePicture: AnchalShah.profilePicture,
      },
      "Hey guys! I'm looking for people to room with, in a nice house in Hoboken! I'm attaching a picture of the available room below. The rent is $800 excluding utilities. Please comment if you're interested. Non-smoker, and gender isn't an issue.",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVkJTIwcm9vbXxlbnwwfHwwfHw%3D&w=1000&q=80",
      [JohnDoe._id.toString(), JaneDoe._id.toString()],
      [
        {
          _id: new ObjectId(),
          user: {
            _id: JaneDoe._id,
            name: JaneDoe.name,
            userName: JaneDoe.userName,
            profilePicture: JaneDoe.profilePicture,
          },
          comment: "I'm interested!",
          dateCreated: new Date(new Date().toUTCString()),
        },
        {
          _id: new ObjectId(),
          user: {
            _id: MonicaPrice._id,
            name: MonicaPrice.name,
            userName: MonicaPrice.userName,
            profilePicture: MonicaPrice.profilePicture,
          },
          comment: "Looks great! I'm interested too",
          dateCreated: new Date(new Date().toUTCString()),
        },
      ],
      "housing"
    );
    const post3 = await seedFuncs.addPost(
      {
        _id: PatrickMountain._id,
        name: PatrickMountain.name,
        userName: PatrickMountain.userName,
        profilePicture: PatrickMountain.profilePicture,
      },
      "Guys! Huge career fair coming up! Let me know if you guy's are interested. There are amazing opportunities, and I know that most of you guys will kill it! Register now!!",
      "https://www.cdoworkforce.org/images/easyblog_articles/593/b2ap3_large_JobFair.jpg",
      [],
      [],
      "career"
    );
    const post4 = await seedFuncs.addPost(
      {
        _id: TristanPrice._id,
        name: TristanPrice.name,
        userName: TristanPrice.userName,
        profilePicture: TristanPrice.profilePicture,
      },
      "Hey guys! Major event taking place today at the Babbio Center! There's free food, good music, and great company! Register on this link: https://www.stevensevents.edu/babbio/bestevent",
      "",
      [
        MikeDowry._id.toString(),
        DwightSchrute._id.toString(),
        JasonLively._id.toString(),
      ],
      [
        {
          _id: new ObjectId(),
          user: {
            _id: DwightSchrute._id,
            name: DwightSchrute.name,
            userName: DwightSchrute.userName,
            profilePicture: DwightSchrute.profilePicture,
          },
          comment: "Ohhhh yeah! Let's goooo!",
          dateCreated: new Date(new Date().toUTCString()),
        },
      ],
      "social"
    );
    const post5 = await seedFuncs.addPost(
      {
        _id: JohnDoe._id,
        name: JohnDoe.name,
        userName: JohnDoe.userName,
        profilePicture: JohnDoe.profilePicture,
      },
      "Hey everyone! I have my Thesis Defense taking place this Friday at Noon, in GS224! Come by if you want to listen to me speak about the future of Artificial Intelligence in Defence.",
      "",
      [],
      [],
      "academic"
    );

    const post6 = await seedFuncs.addPost(
      {
        _id: LewisHamilton._id,
        name: LewisHamilton.name,
        userName: LewisHamilton.userName,
        profilePicture: LewisHamilton.profilePicture,
      },
      "Slow start to this season because I've been grinding for finals. But now that these finals are done with, I'm gunning for my 8th WDC!",
      "https://videos.cults3d.com/vNS1bv-QrJXrWGrDyQtCv1aWoe8=/516x516/https://files.cults3d.com/uploaders/13701591/illustration-file/fad72f1f-ca5f-4c43-afe5-f938043a5577/Webp.net-gifmaker%20(7).gif",
      [PatrickMountain._id.toString(), TristanPrice._id.toString()],
      [
        {
          _id: new ObjectId(),
          user: {
            _id: PatrickMountain._id,
            name: PatrickMountain.name,
            userName: PatrickMountain.userName,
            profilePicture: PatrickMountain.profilePicture,
          },
          comment:
            "Ah man, this is everything. I wish I had the time to make it down to Miami this year.",
          dateCreated: new Date(new Date().toUTCString()),
        },
      ],
      "social"
    );

    const post7 = await seedFuncs.addPost(
      {
        _id: JasonLively._id,
        name: JasonLively.name,
        userName: JasonLively.userName,
        profilePicture: JasonLively.profilePicture,
      },
      "It's crazy how adding a simple regularization method, like a Dropout for example, can almost completely alleviate overfitting.",
      "",
      [
        JohnDoe._id.toString(),
        MikeDowry._id.toString(),
        MonicaPrice._id.toString(),
      ],
      [
        {
          _id: new ObjectId(),
          user: {
            _id: JohnDoe._id,
            name: JohnDoe.name,
            userName: JohnDoe.userName,
            profilePicture: JohnDoe.profilePicture,
          },
          comment: "Haha, looks like you just did Assignment 2.",
          dateCreated: new Date(new Date().toUTCString()),
        },
      ],
      "academic"
    );

    const post8 = await seedFuncs.addPost(
      {
        _id: MikeDowry._id,
        name: MikeDowry.name,
        userName: MikeDowry.userName,
        profilePicture: MikeDowry.profilePicture,
      },
      "Need a roommate, on an urgent basis. Let me know if anyone is looking.",
      "",
      [],
      [],
      "housing"
    );

    const post9 = await seedFuncs.addPost(
      {
        _id: DwightSchrute._id,
        name: DwightSchrute.name,
        userName: DwightSchrute.userName,
        profilePicture: DwightSchrute.profilePicture,
      },
      "Looking for a career change... Michael Scott Paper Company just isn't doing it for me anymore. Let me know if you guys have any leads.",
      "",
      [],
      [
        {
          _id: new ObjectId(),
          user: {
            _id: LewisHamilton._id,
            name: LewisHamilton.name,
            userName: LewisHamilton.userName,
            profilePicture: LewisHamilton.profilePicture,
          },
          comment:
            "Well.. I have a spot on my pit crew? Lol jk I love you my dude.",
          dateCreated: new Date(new Date().toUTCString()),
        },
      ],
      "career"
    );

    const post10 = await seedFuncs.addPost(
      {
        _id: NatashaZigler._id,
        name: NatashaZigler.name,
        userName: NatashaZigler.userName,
        profilePicture: NatashaZigler.profilePicture,
      },
      "Guys I have the cutest cat in the world!!! Just look!",
      "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y3V0ZSUyMGNhdHxlbnwwfHwwfHw%3D&w=1000&q=80",
      [],
      [],
      "social"
    );
    console.log("Seed completed!");
  } catch (e) {
    console.log(e);
  } finally {
    await db.s.client.close();
  }
}

main();
