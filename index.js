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
  debugger;
  for (const stylelintResult of stylelintResults) {
    debugger;
    if (!stylelintResult.warnings.length) {
      break;
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
      sarifLog.runs[0].tool.driver.rules.push(warning.rule);
      sarifRepresentation.ruleIndex = nextRuleIndex++;

      sarifRepresentation.locations[0].physicalLocation.region = {};
      sarifRepresentation.locations[0].physicalLocation.region.startLine =
        warning.line;
      sarifRepresentation.locations[0].physicalLocation.region.startColumn =
        warning.column;

      sarifResults.push(sarifRepresentation);
      debugger;
    });
  }

  sarifLog.runs[0].results = sarifResults;
  debugger;
  return sarifLog;
}

module.exports = sarifFormatter;
