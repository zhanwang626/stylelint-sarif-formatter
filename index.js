"use strict";

function sarifFormatter(stylelintResults) {
  let sarifLog = {
    version: "2.1.0",
    $schema: "http://json.schemastore.org/sarif-2.1.0-rtm.5",
    runs: [
      {
        tool: {
          driver: {
            name: "stylelint",
            informationUri: "https://github.com/stylelint/stylelint",
            rules: [],
          },
        },
      },
    ],
  };

  let nextRuleIndex = 0;
  const sarifResults = [];
  const sarifRules = {};
  const sarifRuleIndices = {};

  for (const stylelintResult of stylelintResults) {
    if (!stylelintResult.warnings.length) {
      continue;
    }

    stylelintResult.warnings.forEach(function (warning) {
      const sarifRepresentation = {
        level: warning.severity,
        message: {
          text: warning.text,
        },
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: stylelintResult.source,
              },
            },
          },
        ],
      };

      sarifRepresentation.ruleId = warning.rule;

      if (typeof sarifRules[warning.rule] === 'undefined') {
        sarifRuleIndices[warning.rule] = nextRuleIndex++;

        sarifRules[warning.rule] = {
          id: warning.rule,
          helpUri: `https://github.com/stylelint/stylelint/blob/master/lib/rules/${warning.rule}/README.md`,
        }
      }

      if (sarifRuleIndices[warning.rule] !== 'undefined') {
        sarifRepresentation.ruleIndex = sarifRuleIndices[warning.rule];
      }

      sarifRepresentation.locations[0].physicalLocation.region = {};
      sarifRepresentation.locations[0].physicalLocation.region.startLine =
        warning.line;
      sarifRepresentation.locations[0].physicalLocation.region.startColumn =
        warning.column;

      sarifResults.push(sarifRepresentation);
    });
  }

  sarifLog.runs[0].results = sarifResults;

  if (Object.keys(sarifRules).length > 0) {
    for (const ruleId of Object.keys(sarifRules)) {
      let rule = sarifRules[ruleId];
      sarifLog.runs[0].tool.driver.rules.push(rule);
    }
  }

  let stringifiedLog = JSON.stringify(sarifLog, null, 2);

  return stringifiedLog;
}

module.exports = sarifFormatter;
