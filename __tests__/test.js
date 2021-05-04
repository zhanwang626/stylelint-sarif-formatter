require('@microsoft/jest-sarif');
const sarifFormatter = require('../index');

const mockStyleLintResults = [
  {
    source: 'path/to/fileA.css',
    errored: false,
    warnings: [
      {
        line: 3,
        column: 8,
        rule: 'block-no-empty',
        severity: 'warning',
        text: 'No empty block!',
      },
    ],
  },
  {
    source: 'path/to/fileB.css',
    errored: true,
    warnings: [
      {
        line: 1,
        column: 2,
        rule: 'foo',
        severity: 'error',
        text: 'foo text',
      },
      {
        line: 2,
        column: 5,
        rule: 'bar',
        severity: 'error',
        text: 'bar text',
      },
    ],
  },
  {
    source: 'path/to/fileC.css',
    errored: false,
    warnings: [],
  },
];

const expectedSarifLog = {
  version: '2.1.0',
  $schema: 'http://json.schemastore.org/sarif-2.1.0-rtm.5',
  runs: [
    {
      tool: {
        driver: {
          name: 'stylelint',
          informationUri: 'https://github.com/stylelint/stylelint',
          rules: [
            {
              id: 'block-no-empty',
              helpUri:
                'https://github.com/stylelint/stylelint/blob/master/lib/rules/block-no-empty/README.md',
            },
            {
              id: 'foo',
              helpUri:
                'https://github.com/stylelint/stylelint/blob/master/lib/rules/foo/README.md',
            },
            {
              id: 'bar',
              helpUri:
                'https://github.com/stylelint/stylelint/blob/master/lib/rules/bar/README.md',
            },
          ],
        },
      },
      results: [
        {
          level: 'warning',
          message: {
            text: 'No empty block!',
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: 'path/to/fileA.css',
                },
                region: {
                  startLine: 3,
                  startColumn: 8,
                },
              },
            },
          ],
          ruleId: 'block-no-empty',
          ruleIndex: 0,
        },
        {
          level: 'error',
          message: {
            text: 'foo text',
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: 'path/to/fileB.css',
                },
                region: {
                  startLine: 1,
                  startColumn: 2,
                },
              },
            },
          ],
          ruleId: 'foo',
          ruleIndex: 1,
        },
        {
          level: 'error',
          message: {
            text: 'bar text',
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: 'path/to/fileB.css',
                },
                region: {
                  startLine: 2,
                  startColumn: 5,
                },
              },
            },
          ],
          ruleId: 'bar',
          ruleIndex: 2,
        },
      ],
    },
  ],
};

describe('sarifFormatter', () => {
  test('sarifFormatter converts results', () => {
    const sarifLog = sarifFormatter(mockStyleLintResults);
    expect(sarifLog).toEqual(JSON.stringify(expectedSarifLog, null, 2));
  });

  test('sarifFormatter produces valid SARIF', () => {
    const sarifLog = JSON.parse(sarifFormatter(mockStyleLintResults));

    expect(sarifLog).toBeValidSarifLog();
  });
});
