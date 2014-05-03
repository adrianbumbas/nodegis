# NodeGIS
REST service for geolocation writen in Node.js and PostGIS.

It returns all the entries with their latitude and longitute coordinates from the datababe that are in the current viewport translated using the given SRID. It also contains a demo client based on Google Maps.

The URL format is:

    
    /places/${srid}/${sw_lng}/${sw_lat}/${ne_lng}/${ne_lat}
    

Where:
    
    srid - Spatial Reference System Identifier (4326 for Google Maps)
    sw_lng - The longitude of the viewport's SouthWest corner
    sw_lat - The latitude of the viewport's SouthWest corner
    ne_lng - The longitude of the viewport's NorthEast corner
    ne_lat - The latitude of the viewport's NorthEast corner
    
It retuns the following JSON response:
    
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
