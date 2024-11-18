export default {
  reporters: [
    "default",
      [
        "jest-junit",
        {
          outputDirectory: "./test-results", 
          outputName: "jest-results.xml"
        }
      ]
    ],
    testEnvironment: "jest-environment-jsdom",
    transform: {
      "^.+\\.jsx?$": "babel-jest", // Transforma .js e .jsx
    },
    moduleNameMapper: {
      "\\.(css|less|scss)$": "identity-obj-proxy", // Para arquivos de estilo
    "\\.(png|jpg|jpeg|gif|svg|webp)$": "jest-transform-stub", // Para imagens
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom"], // Matchers adicionais do testing-library

    maxWorkers: "50%",  // Usa 50% dos núcleos da CPU. Você pode ajustar conforme necessário.
  };
  