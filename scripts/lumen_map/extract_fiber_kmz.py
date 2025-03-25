import mapbox_vector_tile
import simplekml
import io
import zipfile

def extract_fiber_to_kmz(protobuf_file, kmz_output):
    # 1) Load raw protobuf data from file
    with open(protobuf_file, 'rb') as f:
        raw_data = f.read()
    
    # 2) Decode using mapbox_vector_tile (assumes typical vector-tile geometry)
    tile_dict = mapbox_vector_tile.decode(raw_data)
    # tile_dict = {
    #   'layerName1': [
    #       {'geometry': [...], 'properties': {...}, 'type': 2 (LineString), ...},
    #       ...
    #   ],
    #   'layerName2': [...]
    # }
    
    # 3) Prepare a KML
    kml = simplekml.Kml()
    
    # 4) Iterate over each layer and feature
    for layer_name, features in tile_dict.items():
        for feat in features:
            props = feat.get('properties', {})
            geom_type = feat.get('type')  # 2 usually means LineString in vector-tile terms
            
            # Example check: see if there's a property that indicates fiber
            # Adjust the property check to match your data’s actual key-value
            # e.g. maybe "class" == "fiber", or "structure" == "fiber", or etc.
            # This is just an example:
            if 'structure' in props and 'fiber' in str(props['structure']).lower():
                if geom_type == 2:  # line
                    # 5) Convert vector-tile geometry to lat/lon. 
                    # Vector tiles are “tile coordinates” – typically you’d scale or transform.
                    # For a trivial example, assume they’re already lat/lons or near enough:
                    # (In real usage, you’d apply the tile extent transform or your known bounding box.)
                    
                    coords_list = feat['geometry']  # Each segment is a list of (x, y) pairs
                    # If “geometry” is multiple parts, you’d handle them all. Usually each
                    # “LineString” is given as a list of coordinate pairs:
                    
                    ls = kml.newlinestring(name=f"Fiber in {layer_name}")
                    ls.coords = coords_list
                    ls.style.linestyle.color = simplekml.Color.red
                    ls.style.linestyle.width = 3
    
    # 6) Write out to KMZ (zip containing one KML)
    kml_data = kml.kml()
    kmz_buffer = io.BytesIO()
    with zipfile.ZipFile(kmz_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('doc.kml', kml_data)
    with open(kmz_output, 'wb') as f:
        f.write(kmz_buffer.getvalue())

# Usage:
# extract_fiber_to_kmz('my_fiber_data_protobuf.bin', 'fibers.kmz')
