live-search
===========
Web app to extract tables and attach search functionality

Modules
------
#####lsUrlExtractBar
Implement the url bar, the url presets and status update UI. Validate url. Call tableExtractionFactory to start the extraction process.

#####lsTableContainer
Container for the lsTable components. Listen to tableExtractionFactory's ready event. When tables are ready, add lsTable components onto DOM. Provide a table number to notify the lsTable which table to use.

#####lsTable
Implement table, table search bar and display toggle. Refer to table number provided by lsTableContainer for the table location and refer to TableExtractionFactory for the table data

#####tableExtractionFactory
Table extraction logic. Broadcast number of tables upon completion

#####tableUtilityFactory
Utilities for table operations
* fixRelativeLinks - for relative links which would break because no long on intended host
* breakNodeGroupIntoChunks - for array chunking

#####dependencyUnavailable directive
Test dependency server status. Display error when dependency is offline.

#####ifChrome directive
Show notification when browser is Chrome

Dependency
------
[Whatever Origin](http://www.whateverorigin.org/) to overcome CORS restrictions

Framework, Library, Tooling
------
AngularJS, JQuery Twitter Bootstrap, Bower, Grunt

Design Flaw
------
This application is more suitable to be implemented as a browser plugin, instead of a web app.
The code will be much cleaner and the result will be much more intuitive and usable.
