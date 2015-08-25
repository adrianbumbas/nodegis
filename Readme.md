# NodeGIS
REST service for geolocation written in Node.js and PostGIS.

## Places

It returns all the entries with their latitude and longitude coordinates from the database that are in the current viewport translated using the given SRID. It also contains a demo client based on Google Maps.

The URL format is:

    
    /places/${srid}/${sw_lng}/${sw_lat}/${ne_lng}/${ne_lat}
    

Where:
    
    srid - Spatial Reference System Identifier (4326 for Google Maps)
    sw_lng - The longitude of the viewport's South West corner
    sw_lat - The latitude of the viewport's South West corner
    ne_lng - The longitude of the viewport's North East corner
    ne_lat - The latitude of the viewport's North East corner
    
It returns the following JSON response:
    
    {
       "response":[
          {
             "name":"place name",
             "lng":75.9570722403652,
             "lat":30.8503598561702
          }
          ...
       ]
    }
    
The client is available at:

	http://localhost:1337/map.html

## Geocode

Returns all geocode matches, as well as rating, for the requested address

URL format:

    /geocode?address=425%20SE%2011th%20Ave,%20Portland,%20OR
    
Where:

    address - text address to be geocoded
    
It returns:

    {  
       "results":[  
          {  
             "lon":-122.65476826394,
             "lat":45.5198855858974,
             "pretty":"425 SE 11th Ave, Portland, OR 97214",
             "rating":1,
             "address":{  
                "street_no":425,
                "pre_address_abbrev":"SE",
                "street_name":"11th",
                "street_type":"Ave",
                "post_address_abbrev":null,
                "city":"Portland",
                "state":"OR",
                "zip":"97214"
             }
          }
       ],
       "status":"OK",
       "took":376
    }
    
Where lower rating is a better match.