import { Router } from "express";
import fs from "fs";

export const FrontendRouter = Router();
FrontendRouter.use("/*", (_req, res) => {
    const html = fs.readFileSync(__dirname + "/frontend.html", "utf-8");
    res.send(html).end();
})
