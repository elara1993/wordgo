#!/usr/bin/env tsx

import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("tsconfig-paths/register", pathToFileURL("./"));

require("./src/server.ts");
