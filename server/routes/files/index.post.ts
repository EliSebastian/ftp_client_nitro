import streams from "memory-streams";

export default eventHandler(async (event) => {

  const form = await readMultipartFormData(event)

  let fileData = form.find(item => item.name === 'file');
  let pathData = form.find(item => item.name === 'path');
  let file = fileData ? fileData.data : null;
  let path = pathData ? pathData.data : null;

  if (!file || !path) {
    setResponseStatus(event, 400);
    return { error: ["File and path are required"] };
  }

  let ftpClient = await useFtpClient();

  let fileObject = new File([file], path.toString());

  let readableStream = new streams.ReadableStream('');
  readableStream.push(file);
  readableStream.push(null); // end the stream
  await ftpClient.uploadFrom(readableStream, path.toString());


  return fileObject;
});

