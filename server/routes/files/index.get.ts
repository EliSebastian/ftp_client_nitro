import memoryStreams from "memory-streams";

export default eventHandler(async (event) => {
  const { path } = getQuery(event);

  let ftpClient = await useFtpClient();

  let writableStream = new memoryStreams.WritableStream();

  try {
    await ftpClient.downloadTo(writableStream, `${path}`);
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 404);
    return { error: ["File not found"] };
  }

  let file = new File([writableStream.toBuffer()], `${path}`);

  setHeaders(event, {
    "Content-Disposition": `attachment; filename=${path}`,
    "Content-Type": contentTypeByExtension(`${path}`.split(".").pop()),
    "Content-Length": file.size,
  });

  return file;
});

