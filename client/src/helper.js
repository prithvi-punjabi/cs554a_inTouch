import AWS from "aws-sdk";
import * as toxicity from "@tensorflow-models/toxicity";
const S3_BUCKET = "intouch";
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
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

export const predictor = async (text, model) => {
  if (!text) return;
  model.current = model.current || (await toxicity.load());
  const result = await model.current.classify([text]).catch(() => {});

  if (!result) return;

  return result.map((prediction) => {
    const [{ match, probabilities }] = prediction.results;
    return {
      label: prediction.label,
      match,
      text,
      probabilities,
      probability: (probabilities[1] * 100).toFixed(2) + "%",
    };
  });
};
