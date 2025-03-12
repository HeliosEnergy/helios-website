#!/usr/bin/env python3
"""
KMZ Upload Script

This script downloads KMZ files specified in a JSON configuration file
and uploads their geographic data to a PostgreSQL database with PostGIS extension.
"""

import json
import os
import tempfile
import zipfile
import requests
from xml.etree import ElementTree
import psycopg2
from psycopg2.extras import execute_values
import logging
from urllib.parse import urlparse
from pathlib import Path
from dotenv import load_dotenv
import datetime

# Load environment variables from parent directory
dotenv_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path)

# Configure logging
logging.basicConfig(
	level=logging.INFO,
	format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database connection parameters
DB_CONFIG = {
	'host': os.environ.get('DB_HOST', 'localhost'),
	'port': os.environ.get('DB_PORT', '6432'),
	'database': os.environ.get('DB_NAME', 'metrics'),
	'user': os.environ.get('DB_USER', 'admin'),
	'password': os.environ.get('DB_PASSWORD', 'admin123')
}

def load_kmz_config(config_path):
	"""Load KMZ files configuration from JSON file"""
	try:
		with open(config_path, 'r') as f:
			return json.load(f)
	except (FileNotFoundError, json.JSONDecodeError) as e:
		logger.error(f"Error loading config file: {e}")
		raise

def download_kmz(url, output_dir):
	"""Download a KMZ file from URL to the specified directory"""
	try:
		response = requests.get(url, stream=True)
		response.raise_for_status()
		
		# Extract filename from URL or use a default
		parsed_url = urlparse(url)
		filename = os.path.basename(parsed_url.path) or "downloaded.kmz"
		if not filename.endswith('.kmz'):
			filename += '.kmz'
			
		file_path = os.path.join(output_dir, filename)
		
		with open(file_path, 'wb') as f:
			for chunk in response.iter_content(chunk_size=8192):
				f.write(chunk)
				
		logger.info(f"Downloaded {url} to {file_path}")
		return file_path
	except requests.RequestException as e:
		logger.error(f"Error downloading KMZ file: {e}")
		raise

def extract_kmz(kmz_path):
	"""Extract KML from KMZ file (which is a ZIP file containing KML)"""
	try:
		# Create a temporary directory to extract files
		temp_dir = tempfile.mkdtemp()
		
		with zipfile.ZipFile(kmz_path, 'r') as zip_ref:
			zip_ref.extractall(temp_dir)
		
		# Find the main KML file (usually doc.kml)
		kml_files = [os.path.join(root, file) 
					for root, _, files in os.walk(temp_dir) 
					for file in files if file.endswith('.kml')]
		
		if not kml_files:
			raise ValueError(f"No KML file found in {kmz_path}")
			
		# Typically use doc.kml if available
		main_kml = next((f for f in kml_files if os.path.basename(f) == 'doc.kml'), kml_files[0])
		
		logger.info(f"Extracted KML from {kmz_path} to {main_kml}")
		return main_kml
	except (zipfile.BadZipFile, ValueError) as e:
		logger.error(f"Error extracting KMZ file: {e}")
		raise

def parse_kml(kml_path, source_id):
	"""Parse KML file and extract geographic features"""
	try:
		# Parse the KML file
		tree = ElementTree.parse(kml_path)
		root = tree.getroot()
		
		# KML namespace
		ns = {'kml': 'http://www.opengis.net/kml/2.2'}
		
		features = []
		
		# Process Placemarks (points, lines, polygons)
		for placemark in root.findall('.//kml:Placemark', ns):
			name_elem = placemark.find('./kml:name', ns)
			name = name_elem.text if name_elem is not None else None
			
			description_elem = placemark.find('./kml:description', ns)
			description = description_elem.text if description_elem is not None else None
			
			# Extract the geometry
			point = placemark.find('./kml:Point/kml:coordinates', ns)
			line = placemark.find('./kml:LineString/kml:coordinates', ns)
			polygon = placemark.find('./kml:Polygon/kml:outerBoundaryIs/kml:LinearRing/kml:coordinates', ns)
			
			geom_type = None
			coordinates = None
			
			if point is not None:
				geom_type = 'POINT'
				coordinates = point.text.strip()
			elif line is not None:
				geom_type = 'LINESTRING'
				coordinates = line.text.strip()
			elif polygon is not None:
				geom_type = 'POLYGON'
				coordinates = polygon.text.strip()
			
			if geom_type and coordinates:
				features.append({
					'source_id': source_id,
					'name': name,
					'description': description,
					'geom_type': geom_type,
					'coordinates': coordinates
				})
		
		logger.info(f"Extracted {len(features)} features from {kml_path}")
		return features
	except ElementTree.ParseError as e:
		logger.error(f"Error parsing KML file: {e}")
		raise

def insert_features_to_db(features):
	"""Insert extracted features into PostGIS database with optimized implementation"""
	conn = None
	try:
		print(f"Connecting to DB with: host={DB_CONFIG['host']}, port={DB_CONFIG['port']}, db={DB_CONFIG['database']}, user={DB_CONFIG['user']}")
		conn = psycopg2.connect(**DB_CONFIG)
		
		with conn.cursor() as cur:
			# List all schemas in the database
			print("Listing all schemas in the database:")
			cur.execute("""
				SELECT schema_name 
				FROM information_schema.schemata
				WHERE schema_name NOT LIKE 'pg_%' 
				  AND schema_name != 'information_schema'
			""")
			schemas = cur.fetchall()
			for schema in schemas:
				print(f"Schema: {schema[0]}")
			
			# Show current search path
			cur.execute("SHOW search_path")
			search_path = cur.fetchone()[0]
			print(f"Current search_path: {search_path}")
			
			# Test basic query execution
			print("Testing basic SQL execution...")
			cur.execute("SELECT 1")
			result = cur.fetchone()
			print(f"Basic SQL test result: {result}")
			
			# Check if PostGIS is installed
			print("Testing PostGIS availability...")
			try:
				cur.execute("SELECT PostGIS_Version()")
				version = cur.fetchone()
				print(f"PostGIS version: {version}")
			except Exception as e:
				print(f"PostGIS not available: {e}")
				print("Attempting to create PostGIS extension...")
				try:
					cur.execute("CREATE EXTENSION IF NOT EXISTS postgis")
					conn.commit()
					print("PostGIS extension created successfully")
				except Exception as e2:
					print(f"Failed to create PostGIS extension: {e2}")
					raise
			
			# Verify table exists - table should be created by goose migrations
			print("Verifying kmz_features table exists...")
			cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = 'kmz_features')")
			table_exists = cur.fetchone()[0]
			print(f"Table exists check result: {table_exists}")
			
			if not table_exists:
				print("ERROR: kmz_features table doesn't exist! Make sure database migrations have been run.")
				return
			
			# Prepare batch insert data
			print(f"Preparing to batch insert {len(features)} features")
			batch_data = []
			
			for feature in features:
				try:
					coords = feature['coordinates']
					geom_type = feature['geom_type']
					kml_fragment = ""
					
					# Create proper KML fragment based on geometry type
					if geom_type == 'POINT':
						kml_fragment = f'<Point><coordinates>{coords}</coordinates></Point>'
					elif geom_type == 'LINESTRING':
						kml_fragment = f'<LineString><coordinates>{coords}</coordinates></LineString>'
					elif geom_type == 'POLYGON':
						kml_fragment = f'<Polygon><outerBoundaryIs><LinearRing><coordinates>{coords}</coordinates></LinearRing></outerBoundaryIs></Polygon>'
					
					# Create metadata JSON with original geometry type and any other metadata
					metadata = {
						'original_geom_type': geom_type,
						'feature_count': 1,
						'processing_time': str(datetime.datetime.now())
					}
					
					# Add to batch
					batch_data.append((
						feature['source_id'],
						feature['name'],
						feature['description'],
						json.dumps(metadata),
						kml_fragment
					))
					
				except Exception as prep_err:
					print(f"Error preparing feature: {prep_err}")
					# Continue with other features
			
			# Insert features individually - more reliable approach
			print(f"Inserting {len(batch_data)} features individually")
			inserted_count = 0
			
			for source_id, name, description, metadata, kml_fragment in batch_data:
				try:
					cur.execute("""
						INSERT INTO kmz_features 
						(source_id, name, description, metadata, geometry)
						VALUES (%s, %s, %s, %s, ST_GeomFromKML(%s)::geography)
						RETURNING id
					""", (source_id, name, description, metadata, kml_fragment))
					
					new_id = cur.fetchone()[0]
					inserted_count += 1
					print(f"Inserted feature ID: {new_id}")
				except Exception as ind_err:
					print(f"Error in individual insert: {ind_err}")
			
			if inserted_count > 0:
				conn.commit()
				print(f"Successfully inserted {inserted_count} features")
			
			# Verify data was inserted
			cur.execute("SELECT COUNT(*) FROM kmz_features")
			total_count = cur.fetchone()[0]
			print(f"Total rows in kmz_features table: {total_count}")
			
			if total_count > 0:
				# Sample data
				cur.execute("SELECT id, source_id, name, ST_AsText(geometry::geometry) FROM kmz_features LIMIT 3")
				rows = cur.fetchall()
				print(f"Sample data: {rows}")
				
				# Analyze for query optimization
				cur.execute("ANALYZE kmz_features")
				print("Table analyzed for query optimization")
			
	except Exception as e:
		print(f"Database error: {e}")
		if conn:
			conn.rollback()
		raise
	finally:
		if conn:
			conn.close()
			print("Database connection closed")

def main():
	"""Main execution function"""
	try:
		# Get the directory of the current script
		script_dir = Path(__file__).parent.absolute()
		config_path = script_dir / '..' / 'kmz_files.json'
		
		# Load KMZ files configuration
		kmz_config = load_kmz_config(config_path)
		
		# Create a temporary directory for downloads
		temp_dir = tempfile.mkdtemp()
		
		for source_id, config in kmz_config.items():
			logger.info(f"Processing {config['name']} (ID: {source_id})")
			
			# Download KMZ file
			kmz_path = download_kmz(config['kmz_file'], temp_dir)
			
			# Extract KML from KMZ
			kml_path = extract_kmz(kmz_path)
			
			# Parse KML and extract features
			features = parse_kml(kml_path, source_id)
			
			# Insert features into database
			insert_features_to_db(features)
			
			logger.info(f"Successfully processed {config['name']}")
			
		logger.info("KMZ upload process completed successfully")
	except Exception as e:
		logger.error(f"Error in main execution: {e}")
		raise

if __name__ == "__main__":
	main()

