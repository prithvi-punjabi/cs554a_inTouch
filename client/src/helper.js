import AWS from "aws-sdk";
import { useNavigate } from "react-router";
const S3_BUCKET = "cs-546-in-touch";
AWS.config.update({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});
const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
});

export const uploadFile = async (file) => {
  const filename = new Date().getTime() + "_" + file.name;
  const params = {
    Body: file,
    Bucket: S3_BUCKET,
    Key: filename,
  };

  await myBucket
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      // setProgress(Math.round((evt.loaded / evt.total) * 100));
    })
    .promise();

  const url = myBucket.getSignedUrl("getObject", { Key: params.Key });
  return url.split("?")[0];
};

export const isLoggedIn = () => {
  return (
    localStorage.getItem("token") != null &&
    localStorage.getItem("userId") != null
  );
};
