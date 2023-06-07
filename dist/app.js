"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const index_1 = __importDefault(require("./config/index"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const trendingRoutes_1 = __importDefault(require("./routes/trendingRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const userContentRoutes_1 = __importDefault(require("./routes/userContentRoutes"));
const contentRoutes_1 = __importDefault(require("./routes/contentRoutes"));
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL;
const secret = process.env.SECRET || '';
exports.server = (0, fastify_1.default)();
exports.server.register(jwt_1.default, {
    secret: secret
});
exports.server.register(cors_1.default, {
    origin: '*'
});
exports.server.register(index_1.default);
exports.server.register(function secured(fastify, options, next) {
    fastify.addHook("onRequest", (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield request.jwtVerify();
        }
        catch (err) {
            reply.code(403).send("Invalid Token");
        }
    }));
    fastify.register(searchRoutes_1.default);
    fastify.register(trendingRoutes_1.default);
    fastify.register(userContentRoutes_1.default);
    fastify.register(contentRoutes_1.default);
    next();
});
exports.server.register(function unsecured(fastify, options, next) {
    fastify.register(loginRoutes_1.default);
    fastify.register(usersRoutes_1.default);
    next();
});
exports.server.listen({ port: +PORT }, (err, address = API_URL) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
