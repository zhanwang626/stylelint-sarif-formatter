const sarifFormatter = require("../index");

let mockStyleLintResults = [
  {
    source: "path/to/fileA.css",
    errored: false,
    warnings: [
      {
        line: 3,
        column: 8,
        rule: "block-no-empty",
        severity: "warning",
        text: "No empty block!",
      },
    ],
  },
  {
    source: "path/to/fileB.css",
    errored: true,
    warnings: [
      {
        line: 1,
        column: 2,
        rule: "foo",
        severity: "error",
        text: "foo text",
      },
      {
        line: 2,
        column: 5,
        rule: "bar",
        severity: "error",
        text: "bar text",
      },
    ],
  },
  {
    source: "path/to/fileC.css",
    errored: false,
    warnings: [],
  },
];

expectedSarifLog = {
  $schema: "http://json.schemastore.org/sarif-2.1.0-rtm.5",
  runs: [
    {
      results: [
        {
          level: "warning",
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: "path/to/fileA.css",
                },
                region: {
                  startColumn: 8,
                  startLine: 3,
                },
              },
            },
          ],
          message: {
            text: "No empty block!",
          },
          ruleId: "block-no-empty",
          ruleIndex: 0,
        },
        {
          level: "error",
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: "path/to/fileB.css",
                },
                region: {
                  startColumn: 2,
                  startLine: 1,
                },
              },
            },
          ],
          message: {
            text: "foo text",
          },
          ruleId: "foo",
          ruleIndex: 1,
        },
        {
          level: "error",
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: "path/to/fileB.css",
                },
                region: {
                  startColumn: 5,
                  startLine: 2,
                },
              },
            },
          ],
          message: {
            text: "bar text",
          },
          ruleId: "bar",
          ruleIndex: 2,
        },
      ],
      tool: {
        driver: {
          informationUri: "https://github.com/stylelint/stylelint",
          name: "stylelint",
          rules: ["block-no-empty", "foo", "bar"],
        },
      },
    },
  ],
  version: "2.1.0",
};

test("test if sarifFormatter work as expected", () => {
  sarifLog = sarifFormatter(mockStyleLintResults);
  expect(sarifLog).toEqual(expectedSarifLog);
});
