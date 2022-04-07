const userData = require("./data").userData;

async function main() {
  //   try {
  //     const courses = await userData.fetchCourses(
  //       "1030~hs41VrJXUZvlCXonUrw0XE6e3hZbDnXFdiwVuKnZDQFSz3O4WY2ZluYE8jrgOQAb"
  //     );
  //     console.log(courses);
  //   } catch (e) {
  //     console.log(e);
  //   }
  try {
    const courses = await userData.fetchUser(
      "1030~hs41VrJXUZvlCXonUrw0XE6e3hZbDnXFdiwVuKnZDQFSz3O4WY2ZluYE8jrgOQAb"
    );
    console.log(courses);
  } catch (e) {
    console.log(e);
  }
}
main();

// const today = new Date();
// console.log(today);
