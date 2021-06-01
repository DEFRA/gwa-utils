# Group Wide Alerting (GWA) Utilities

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

### [Generate initial file](./generate-initial-file.js)

This generates a file used in the initial stage of sending messages i.e. it is
the file that will be uploaded to blob storage by the web application.

Running `./generate-initial-file.js` will generate a JSON file containing a
message and 100 contacts with unique mobile phone numbers. The script will
generate as many contacts as required when supplied as the first argument to
the script e.g.  `./generate-initial-file.js 500`. The files created in
[data](./data) and named `initial-<number-of-contacts>-contacts.json`.
