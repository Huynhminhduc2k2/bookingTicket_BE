import { Client } from "@elastic/elasticsearch";
import Logger from "../utils/logger";
import config from "./config";

const logger = new Logger();
if (!process.env.ELASTIC_BASEURL) {
    logger.error("ELASTIC_HOST is not defined in .env file", {
        route: "src/utils/elasticsearch.ts line 10",
    });
}
const client = new Client({
    node: config.elastic.baseUrl || "http://localhost:9200",
    auth: {
        username: config.elastic.username || "elastic",
        password: config.elastic.password || "",
    },
    tls: {
        // ca: process.env.ELASTIC_CA_CERT || "",
        // rejectUnauthorized: false,
    },
});

// Assuming you have an Elasticsearch client instantiated as 'elasticsearchClient'
export const createIndex = async () => {
    try {
        const indexExists = await client.indices.exists({
            index: config.elastic.index,
        });

        if (!indexExists) {
            await client.indices.create({
                index: config.elastic.index,
                body: {
                    mappings: {
                        properties: {
                        },
                    },
                },
            });

            console.log("Index created successfully.");
        } else {
            console.log("Index already exists.");
        }
    } catch (error) {
        console.error("Error creating job index:", error);
    }
};

export default client;