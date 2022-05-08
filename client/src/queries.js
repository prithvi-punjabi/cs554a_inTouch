import { gql } from "@apollo/client";

const user = {
  LOGIN: gql`
    query LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        token
        userId
      }
    }
  `,
  GET_BY_ID: gql`
    query GetUser($userId: ID!) {
      getUser(userId: $userId) {
        _id
        name
        email
        password
        profilePicture
        userName
        bio
        designation
        gender
        contactNo
        dob
        courses {
          id
          name
          code
          end_date
        }
        readStatus {
          c_id
          mCount
          cName
        }
        privacy
        friends
      }
    }
  `,
  GET_FRIEND_RECOMMENDATIONS: gql`
    query GetFriendRecommendations {
      getFriendRecommendations {
        _id
        name
        email
        password
        profilePicture
        userName
        bio
        designation
        gender
        contactNo
        dob
        courses {
          id
          name
          code
          end_date
        }
        privacy
        friends
      }
    }
  `,
  ADD_FRIEND: gql`
    mutation AddFriend($friendId: ID!) {
      addFriend(friendId: $friendId) {
        _id
        name
        email
        password
        profilePicture
        userName
        bio
        designation
        gender
        contactNo
        dob
        courses {
          id
          name
          code
          end_date
        }
        privacy
        friends
      }
    }
  `,
  REMOVE_FRIEND: gql`
    mutation DeleteFriend($friendId: ID!) {
      deleteFriend(friendId: $friendId) {
        _id
        name
        email
        password
        profilePicture
        userName
        bio
        designation
        gender
        contactNo
        dob
        courses {
          id
          name
          code
          end_date
        }
        privacy
        friends
      }
    }
  `,
  CREATE: gql`
    mutation CreateUser(
      $accessKey: String!
      $password: String!
      $userName: String!
      $gender: String!
      $contactNo: String!
      $dob: String!
    ) {
      createUser(
        accessKey: $accessKey
        password: $password
        userName: $userName
        gender: $gender
        contactNo: $contactNo
        dob: $dob
      ) {
        _id
        name
        email
        password
        profilePicture
        userName
        bio
        designation
        gender
        contactNo
        dob
        courses {
          id
          name
          code
          end_date
        }
        privacy
        friends
      }
    }
  `,
  UPDATE_MESSAGE_READ: gql`
    mutation UpdateMessageRead($c_id: String!, $mCount: Int!) {
      readChange(c_id: $c_id, mCount: $mCount) {
        c_id
        mCount
      }
    }
  `,
};

const post = {
  GET_BY_ID: gql`
    query GetPostById($postId: String) {
      getPost(postId: $postId) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          name
          comment
          dateCreated
          user {
            _id
            userName
            profilePicture
          }
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  GET: gql`
    query GetPostsForUser($pageNumber: Int) {
      getPostsForUser(pageNumber: $pageNumber) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          comment
          dateCreated
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  GET_ALL: gql`
    query GetAll($pageNumber: Int) {
      getAll(pageNumber: $pageNumber) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          comment
          dateCreated
          user {
            _id
            name
            userName
            profilePicture
          }
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  GET_BY_QUERY: gql`
    query GetByQuery($queryFields: queryInp) {
      getByQuery(queryFields: $queryFields) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          comment
          dateCreated
          user {
            _id
            name
            userName
            profilePicture
          }
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  GET: gql`
    query GetPostsForUser($pageNumber: Int) {
      getPostsForUser(pageNumber: $pageNumber) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          comment
          dateCreated
          user {
            _id
            name
            userName
            profilePicture
          }
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  ADD: gql`
    mutation CreatePost($image: String, $text: String, $category: String) {
      createPost(image: $image, text: $text, category: $category) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          comment
          dateCreated
          user {
            userName
            profilePicture
            _id
            name
          }
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  UPDATE: gql`
    mutation UpdatePost($postId: ID, $text: String, $category: String) {
      updatePost(postId: $postId, text: $text, category: $category) {
        text
        image
        likes
        dateCreated
        comments {
          _id
          dateCreated
          comment
          user {
            _id
            name
            userName
            profilePicture
          }
        }
        category
        _id
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  LIKE: gql`
    mutation LikePost($postId: ID) {
      likePost(postId: $postId) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          comment
          dateCreated
          user {
            _id
            name
            userName
            profilePicture
          }
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  UNLIKE: gql`
    mutation UnlikePost($postId: ID) {
      unlikePost(postId: $postId)
    }
  `,
  ADD_COMMENT: gql`
    mutation AddComment($postId: ID, $comment: String) {
      addComment(postId: $postId, comment: $comment) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          comment
          dateCreated
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  REMOVE: gql`
    mutation RemovePost($postId: ID) {
      removePost(postId: $postId) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          comment
          dateCreated
          user {
            _id
            name
            userName
            profilePicture
          }
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
  DELETE_COMMENT: gql`
    mutation DeleteComment($commentId: ID) {
      deleteComment(commentId: $commentId) {
        _id
        text
        image
        dateCreated
        category
        comments {
          _id
          comment
          dateCreated
        }
        likes
        user {
          _id
          name
          userName
          profilePicture
        }
      }
    }
  `,
};

const channel = {
  GET: gql`
    query GetChannelsForUser($userId: ID) {
      getChannelsForUser(userId: $userId) {
        _id
        name
        displayName
        description
        dateCreated
        status
        messages {
          _id
          user {
            userId
            userName
            profilePicture
          }
          message
          dateCreated
        }
      }
    }
  `,
  GET_BY_ID: gql`
    query GetChannelById($channelId: ID) {
      getChannelById(id: $channelId) {
        _id
        name
        displayName
        description
        dateCreated
        status
        messages {
          _id
          user {
            userId
            userName
            profilePicture
          }
          message
          dateCreated
        }
      }
    }
  `,
  GET_ALL: gql`
    query GetAllChannels {
      getAllChannels {
        _id
        name
        displayName
        description
        dateCreated
        status
        messages {
          _id
          user {
            userId
            userName
            profilePicture
          }
          message
          dateCreated
        }
      }
    }
  `,
  CREATE: gql`
    mutation CreateChannel(
      $name: String
      $displayName: String
      $description: String
    ) {
      createChannel(
        name: $name
        displayName: $displayName
        description: $description
      ) {
        _id
        name
        displayName
        description
        dateCreated
        status
        messages {
          _id
          user {
            userId
            userName
            profilePicture
          }
          message
          dateCreated
        }
      }
    }
  `,
  UPDATE: gql`
    mutation UpdateChannel(
      $channelId: ID
      $displayName: String
      $description: String
    ) {
      updateChannel(
        channelId: $channelId
        displayName: $displayName
        description: $description
      ) {
        _id
        name
        displayName
        description
        dateCreated
        status
        messages {
          _id
          user {
            userId
            userName
            profilePicture
          }
          message
          dateCreated
        }
      }
    }
  `,
  REMOVE: gql`
    mutation RemovePost($channelId: ID) {
      removeChannel(channelId: $channelId) {
        status
        name
        messages {
          user {
            userId
            userName
            profilePicture
          }
          message
          dateCreated
          _id
        }
        displayName
        dateCreated
        description
        _id
      }
    }
  `,
  ADD_MESSAGE: gql`
    mutation AddMessage($channelId: ID, $message: String) {
      addMessage(channelId: $channelId, message: $message) {
        _id
        user {
          userId
          userName
          profilePicture
        }
        message
        dateCreated
      }
    }
  `,
  DELETE_MESSAGE: gql`
    mutation DeleteMessage($messageId: ID, $userId: ID) {
      deleteMessage(messageId: $messageId, userId: $userId) {
        _id
        user {
          userId
          userName
          profilePicture
        }
        message
        dateCreated
      }
    }
  `,
  SUBSCRIBE_MESSAGE: gql`
    subscription SubscribeChannels($userId: ID) {
      channels(userId: $userId) {
        _id
        name
        displayName
        description
        dateCreated
        status
        messages {
          _id
          user {
            userId
            userName
            profilePicture
          }
          message
          dateCreated
        }
      }
    }
  `,
  ADD_TEST_MESSAGE: gql`
    mutation TestMessage($msg: String) {
      testMessage(msg: $msg) {
        msg
      }
    }
  `,
  GET_USERS: gql`
    query GetUsersForChannel($getUsersForChannelId: ID) {
      getUsersForChannel(id: $getUsersForChannelId) {
        _id
        name
        email
        password
        profilePicture
        userName
        bio
        designation
        gender
        contactNo
        dob
        courses {
          id
          name
          code
          end_date
        }
        privacy
        friends
      }
    }
  `,
};

let exported = {
  user,
  post,
  channel,
};

export default exported;
