# Group Wide Alerting (GWA) Utilities

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)\
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_gwa-utils&metric=coverage)](https://sonarcloud.io/dashboard?id=DEFRA_gwa-utils)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_gwa-utils&metric=sqale_index)](https://sonarcloud.io/dashboard?id=DEFRA_gwa-utils)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_gwa-utils&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=DEFRA_gwa-utils)\
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_gwa-utils&metric=security_rating)](https://sonarcloud.io/dashboard?id=DEFRA_gwa-utils)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_gwa-utils&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=DEFRA_gwa-utils)
[![Known Vulnerabilities](https://snyk.io/test/github/defra/gwa-utils/badge.svg)](https://snyk.io/test/github/defra/gwa-utils)

> A collection of utility scripts to help with generating test data, test
> workloads, reference data and other useful stuff for GWA.

## Utilities

Available utilities are detailed below.

### [Add failed messages](./add-failed-msgs.js)

Running `./add-failed-msgs.js` will add 100 messages to the queue specified by
the env var for the storage queue as specified by the env var. 100 messages is
the default and can be overridden by passing the required number to the script
e.g. `./add-failed-msgs.js 50`.

### [Create office maps](./create-office-maps.js)

[csv-parse](https://csv.js.org/parse/) is used to convert a CSV file containing
`area code`, `area name`, `originalOfficeLocation` & `revisedOfficeLocation`
into two JSON documents.

One is structured to group office locations into areas.

The other is structured so the `originalOfficeLocation` can be mapped to
an office code consisting of the `revisedOfficeLocation` (with some processing)
and `areaCode`.

Both files will be uploaded into a container used for reference data within
Cosmos DB and used by both the web app and the function apps.

The file used as the source for the CSV was originally an `.xlsx` with
additional columns and differently named columns. Rather than messing around
with an `xlsx` parser I opted for a little manual intervention to create a CSV
with only the necessary columns i.e. those mentioned above.

### [Create organisation list](./create-organisation-list.js)

[csv-parse](https://csv.js.org/parse/) is used to convert a CSV file containing
the organisations. Specifically `name` and `code` and whether they are
`active` and a `core` organisation (to GWA).
The `active` flag is used for the purpose of whether the organisation has
been enrolled in the system and whether it should be displayed when sending
messages.
The `core` flag is used for the purpose of whether the organisation is core to
the GWA service and is used within the web app and ETL.

A file generated to be uploaded to the `reference-data` container (in Cosmos
DB) to be used by the GWA web app. The document contains a list of objects
representing the organisations of Defra. Each organisation has an `orgCode` and
`orgName`.

### [Create organisation map](./create-organisation-map.js)

[csv-parse](https://csv.js.org/parse/) is used to convert a CSV file that
contains a mapping of raw organisation inputs into what the actual organisation
is. This is used to map the organisation a user has recorded to a known good
representation during the ETL processing.

A file generated to be uploaded to the `reference-data` container (in Cosmos
DB) to be used by the GWA ETL function app. The document contains a list of
objects representing the mappings. Each mapping has `originalOrgName`,
`orgName` and `orgCode`.

### [Generate initial file](./generate-initial-file.js)

This generates a file used in the initial stage of sending messages i.e. it is
the file that will be uploaded to blob storage by the web application.

Running `./generate-initial-file.js` will generate a JSON file containing a
message and 100 contacts with unique mobile phone numbers. The script will
generate as many contacts as required when supplied as the first argument to
the script e.g.  `./generate-initial-file.js 500`. The files created in
[data](./data) and named `initial-<number-of-contacts>-contacts.json`.

### [Process users](./process-users.js)

Download a supported file e.g. `valid-users.json` from the ETL storage account.
Process the file, extracting a set of properties for each user and save a CSV
file.

Run with `./process-users.js valid-users`.

### [Retrieve AAD data](./retrieve-aad-data.js)

Download user data from Azure Active Directory (AAD) via
[Microsoft Graph API](https://microsoft.graph.com). Using the
[list users](https://docs.microsoft.com/en-us/graph/api/user-list?) endpoint.
Running this script generates a file with the raw data from the API i.e. no
cleansing of `companyName` or `officeLocation` has been completed.

Run with `./retrieve-aad-data.js'
