const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const { ObjectId } = require("mongodb");

async function main() {
  const db = await dbConnection();
  try {
    // await db.dropDatabase();

    const user = {
      _id: ObjectId(),
      userName: "Nevil",
      profilePicture: "https://www.w3schools.com/howto/img_avatar.png",
    };

    let thisUser = await data.userData.create(
      "Prithvi",
      "prithvi@stevens.edu",
      "Password123!",
      "https://www.w3schools.com/howto/img_avatar.png",
      "prithvipun",
      "Hi i am prithvi",
      "He/Him",
      ["546", "554", "583"],
      0,
      "646-904-0663",
      "06/04/1998"
    );

    let addFriend = await data.userData.addFriend(
      thisUser._id,
      "624e62334f91d590426d4684"
    );
    console.log(addFriend);
    console.log("New User:");
    console.log(thisUser);
    let post = await data.postData.create(
      user,
      "My first post",
      "https://www.thoughtco.com/thmb/7ROn7qnXZNPAU8j-5lYY8Exie6k=/1885x1414/smart/filters:no_upscale()/edwin-stevens-hall--hoboken-556427925-5905e7295f9b5810dce3c1c6.jpg",
      "academic"
    );

    console.log("New post:");
    console.log(post);

    post = await data.postData.update(
      post._id.toString(),
      user,
      "My first edited post",
      "housing"
    );

    console.log("Updated post:");
    console.log(post);

    await data.postData.likeAPost(post._id.toString(), user._id.toString());
    post = await data.postData.getById(post._id.toString());

    console.log("Liked post:");
    console.log(post);

    await data.postData.unlikeAPost(post._id.toString(), user._id.toString());

    let comment = await data.postData.addComment(
      post._id,
      user,
      "All the best!"
    );

    console.log("Added comment:");
    console.log(comment);

    post = await data.postData.remove(
      post._id.toString(),
      user,
      "My first edited post",
      "housing"
    );

    console.log("Deleted post:");
    console.log(post);

    console.log("Test completed!");
  } catch (e) {
    console.log(e);
  } finally {
    await db.s.client.close();
  }
}

main();
