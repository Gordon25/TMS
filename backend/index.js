import app from "./routeTable.js";
const port = process.env.BACKEND_PORT;
app.listen(port, console.log(`App listening at port ${port} ${process.env.NODE_ENV}`));
