import { Client } from "basic-ftp";

interface GlobalWithFtpClient extends NodeJS.Global {
  ftpClient?: Client;
}

const globalForFtpClient: GlobalWithFtpClient = global;

async function newFtpClient() {
  let client = new Client();

  // client.ftp.verbose = true; // enable to debug

  await client.access({
    host: "------",
    user: "------",
    password: "------",
    secure: false,
  });

  // tanking the progress of the file transfer
  client.trackProgress((info) => {
    console.log("File", info.name);
    console.log("Type", info.type);
    console.log("Transferred", info.bytes);
    console.log("Transferred Overall", info.bytesOverall);
  });

  return client;
}

async function useFtpClient(): Promise<Client> {
  if (!globalForFtpClient.ftpClient) {
    globalForFtpClient.ftpClient = await newFtpClient();
  }
  return globalForFtpClient.ftpClient;
}

export { useFtpClient };
