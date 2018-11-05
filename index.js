import config from "./config";
import server from "./App";

server.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`);
});