import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "https://f3586e-88.myshopify.com/api/2024-04/graphql.json": {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            "0a9d99a547047310a90ed8bb9e6384ff",
        },
      },
    },
  ],
  documents: ["src/gql/**/*.{js,ts,jsx,tsx}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: { unmaskFunctionName: "getFragmentData" },
      },
    },
  },
  ignoreNoDocuments: true,
};
export default config;
