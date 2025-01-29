import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";
import { BASE_URL } from "./config";

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const uploadLink = createUploadLink({
    uri: `${BASE_URL}/graphql`,
    headers: {
        "GraphQL-Preflight": "1",
    },
});

const apolloClient = new ApolloClient({
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        mutate: {
            fetchPolicy: "no-cache",
        },
        query: {
            fetchPolicy: "no-cache",
        },
    },
});

export { apolloClient };
