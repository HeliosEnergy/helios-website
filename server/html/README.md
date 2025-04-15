# Content is not automatically delivered by the server
In folders like assets the internal web server will deliver it under the /site/assets path, but index.html and other root level files must be explicity delivered. See the src/routes/internal_site directory for more info, make sure any new directories or files are delivered by a route.

This is done so fragments and templates can be used effectively.