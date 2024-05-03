import { Client } from "@elastic/elasticsearch";
import Logger from "../utils/logger";
require("dotenv").config();

const logger = new Logger();
if (!process.env.ELASTIC_BASEURL) {
    logger.error("ELASTIC_HOST is not defined in .env file", {
        route: "src/utils/elasticsearch.ts line 10",
    });
}
const client = new Client({
    node: process.env.ELASTIC_BASEURL || "http://localhost:9200",
    auth: {
        username: process.env.ELASTIC_USERNAME || "elastic",
        password: process.env.ELASTIC_PASSWORD || "",
    },
    tls: {
        ca: process.env.ELASTIC_CA_CERT || "",
        rejectUnauthorized: false,
    },
});

// Assuming you have an Elasticsearch client instantiated as 'elasticsearchClient'
const createIndex = async () => {
    try {
        const indexExists = await client.indices.exists({
            index: process.env.ELASTIC_INDEX || "booking_ticket",
        });

        if (!indexExists) {
            await client.indices.create({
                index: process.env.ELASTIC_INDEX || "booking_ticket",
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

createIndex();

// Register cleanup logic when the process exits
process.on("exit", () => {
    console.log("Exiting process. Closing Elasticsearch client.");
    client.close(); // Close the Elasticsearch client
});

export default client;