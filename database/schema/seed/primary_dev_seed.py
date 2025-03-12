import json
import psycopg2
from psycopg2.extras import Json
import os
from dotenv import load_dotenv
import yaml
import psutil
import subprocess
import math
import platform


load_dotenv()

# Database connection
conn = psycopg2.connect(os.getenv('PRIMARY_DB_URL'))
cur = conn.cursor()

def load_json_data(file_path):
	with open(file_path, 'r') as file:
		return yaml.safe_load(file)


def get_os_info():
	system = platform.system()
	if system == "Linux":
		os_type = "LINUX"
		distro = "Unknown Linux Distro"
		if os.path.exists("/etc/os-release"):
			with open("/etc/os-release") as f:
				for line in f:
					if line.startswith("PRETTY_NAME"):
						distro = line.split("=")[1].strip().strip('"')
						break
		return os_type, distro
	elif system == "Windows":
		os_type = "WINDOWS"
		# Get major version number for Windows (e.g., "11" from Windows 11)
		version = platform.release()
		return os_type, version
	elif system == "Darwin":
		os_type = "MACOS"
		version = platform.mac_ver()[0]
		return os_type, version
	else:
		return "UNKNOWN", f"Unknown OS: {system}"

def get_gpu_configuration(os_type):
	def format_gpu_name(gpu_name):
		# Normalize GPU names to match the ENUM format
		if 'L40S' in gpu_name:
			return 'RTX4090'
		elif 'A100' in gpu_name:
			return 'A100'
		elif 'H100' in gpu_name:
			return 'H100'
		else:
			return 'NONE'

	def count_gpus(gpu_list):
		formatted_gpus = [format_gpu_name(gpu) for gpu in gpu_list]
		unique_gpus = {}
		for gpu in formatted_gpus:
			if gpu != 'NONE':
				unique_gpus[gpu] = unique_gpus.get(gpu, 0) + 1
		if not unique_gpus:
			return ['NONE']
		return [f"{gpu}x{count}" for gpu, count in unique_gpus.items()]

	if os_type == "LINUX":
		try:
			result = subprocess.run(['lspci'], stdout=subprocess.PIPE, text=True)
			gpus = [line for line in result.stdout.split('\n') if 'VGA' in line or '3D' in line]
			return count_gpus(gpus)
		except FileNotFoundError:
			return ['NONE']

	elif os_type == "MACOS":
		try:
			result = subprocess.run(['system_profiler', 'SPDisplaysDataType'], stdout=subprocess.PIPE, text=True)
			gpus = [line.strip() for line in result.stdout.split('\n') if 'Chipset Model' in line]
			return count_gpus(gpus)
		except FileNotFoundError:
			return ['NONE']

	elif os_type == "WINDOWS":
		try:
			result = subprocess.run(['wmic', 'path', 'win32_videocontroller', 'get', 'name'], stdout=subprocess.PIPE, text=True)
			gpus = result.stdout.strip().split('\n')[1:]
			return count_gpus([gpu.strip() for gpu in gpus if gpu.strip()])
		except FileNotFoundError:
			return ['NONE']

	else:
		return ['NONE']

def hash_password_with_go_cli(password):
	rootDir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../../../')
	output = subprocess.run(
		[rootDir + 'helios', 'string_utils', 'password_salt', password],
		stdout=subprocess.PIPE,
		text=True,
		cwd=rootDir
	)
	return output.stdout.strip()


def insert_account_data(data):
	records = []
	for email, details in data.items():
		record = details.copy()
		records.append(record)
	
	for item in records:
		if 'data' in item:
			item['data'] = Json(item['data'])
		
		query = """
			INSERT INTO account (
				tag,
				account_type,
				name,
				email,
				password,
				data
			)
			VALUES (%s::uuid, %s::account_type, %s, %s, %s, %s)
			ON CONFLICT (tag) DO UPDATE SET
				tag = EXCLUDED.tag,
				account_type = EXCLUDED.account_type,
				name = EXCLUDED.name,
				password = EXCLUDED.password,
				data = EXCLUDED.data,
				updated_at = now()
		"""
		cur.execute(query, [
			item.get('tag'),
			item.get('account_type'),
			item.get('name'),
			item.get('email'),
			hash_password_with_go_cli(item.get('password')),
			item.get('data')
		])
		
def insert_machine_cluster_data(data):
	records = []
	for name, details in data.items():
		record = details.copy()
		records.append(record)
	for item in records:
		if 'data' in item:
			item['data'] = Json(item['data'])
		
		query = """
			INSERT INTO machine_cluster (
				tag,
				name,
				description,
				data,
				contact_id,
				billing_id,
				profit_share_id
			)
			VALUES (
				%s::uuid,
				%s,
				%s,
				%s,
				(SELECT id FROM account WHERE email = %s),
				(SELECT id FROM account WHERE email = %s),
				(SELECT id FROM account WHERE email = %s)
			)
			ON CONFLICT (tag) DO UPDATE SET
				name = EXCLUDED.name,
				description = EXCLUDED.description,
				data = EXCLUDED.data,
				contact_id = EXCLUDED.contact_id,
				billing_id = EXCLUDED.billing_id,
				profit_share_id = EXCLUDED.profit_share_id,
				updated_at = now()
		"""
		cur.execute(query, [
			item.get('tag'),
			item.get('name'),
			item.get('description'),
			item.get('data'),
			item.get('contact_email'),
			item.get('billing_email'),
			item.get('profit_share_email')
		])

def insert_machine_data(data):
	records = []
	for name, details in data.items():
		record = details.copy()
		records.append(record)
	for item in records:
		if 'data' in item:
			item['data'] = Json(item['data'])
		
		os_type, os_version = get_os_info()
		gpu_configuration = get_gpu_configuration(os_type)
		total_ram_mb = math.floor(round(psutil.virtual_memory().total / (1024 ** 2), 2))
		cpu_speed = psutil.cpu_freq().max if psutil.cpu_freq() else "Unknown"
		cpu_cores = psutil.cpu_count(logical=True)
		
		print("-- OS type", os_type)
		print("-- OS version", os_version)
		print("-- GPU configuration", gpu_configuration)
		print("-- Total RAM", total_ram_mb)
		print("-- CPU speed", cpu_speed)
		print("-- CPU cores", cpu_cores)
		
		query = """
			INSERT INTO machine (
				tag,
				name,
				description,
				internet_mbps,
				docker,
				docker_secure,
				data,
				os_type,
				os_version,
				gpu_configuration,
				ram_mb,
				cpu_mhz,
				cpu_cores,
				contact_id,
				machine_cluster_id
			) VALUES (
				%s::uuid,
				%s,
				%s,
				%s,
				%s,
				%s,
				%s,
				%s::os_type,
				%s,
				%s::gpu_configuration,
				%s,
				%s,
				%s,
				(SELECT id FROM account WHERE email = %s),
				(SELECT id FROM machine_cluster WHERE tag = %s)
			)
			ON CONFLICT (tag) DO UPDATE SET
				name = EXCLUDED.name,
				description = EXCLUDED.description,
				internet_mbps = EXCLUDED.internet_mbps,
				docker = EXCLUDED.docker,
				docker_secure = EXCLUDED.docker_secure,
				data = EXCLUDED.data,
				os_type = EXCLUDED.os_type,
				os_version = EXCLUDED.os_version,
				gpu_configuration = EXCLUDED.gpu_configuration,
				ram_mb = EXCLUDED.ram_mb,
				cpu_mhz = EXCLUDED.cpu_mhz,
				cpu_cores = EXCLUDED.cpu_cores,
				contact_id = EXCLUDED.contact_id,
				machine_cluster_id = EXCLUDED.machine_cluster_id,
				updated_at = now()
		"""
		cur.execute(query, [
			item.get('tag'),
			item.get('name'),
			item.get('description'),
			item.get('internet_mbps'),
			item.get('docker'),
			item.get('docker_secure'),
			item.get('data'),
			os_type,
			os_version,
			gpu_configuration[0],
			total_ram_mb,
			cpu_speed,
			cpu_cores,
			item.get('contact_email'),
			item.get('machine_cluster_tag')
		])

def insert_tenant_data(data):
	records = []
	for name, details in data.items():
		record = details.copy()
		records.append(record)
	
	for item in records:
		if 'data' in item:
			item['data'] = Json(item['data'])
		
		query = """
			INSERT INTO tenant (
				tag,
				name,
				description,
				data
			)
			VALUES (
				%s::uuid,
				%s,
				%s,
				%s
			)
		"""
		cur.execute(query, [
			item.get('tag'),
			item.get('name'),
			item.get('description'),
			item.get('data')
		])
		
def insert_tenant_role_data(data):
	records = []
	for name, details in data.items():
		record = details.copy()
		records.append(record)
  
	for item in records:
		if 'data' in item:
			item['data'] = Json(item['data'])
		if 'policy' in item:
			item['policy'] = Json(item['policy'])
		
		query = """
			INSERT INTO tenant_role (
				tag,
				name,
				policy,
				tenant_id,
				creator_id,
				data
			)
			VALUES (
				%s::uuid,
				%s,
				%s,
				(SELECT id FROM tenant WHERE tag = %s),
				(SELECT id FROM account WHERE tag = %s),
				%s
			)
		"""
		cur.execute(query, [
			item.get('tag'),
			item.get('name'),
			item.get('policy'),
			item.get('tenant_tag'),
			item.get('creator_tag'),
			item.get('data')
		])

def insert_tenant_member_data(data):
	records = []
	for name, details in data.items():
		record = details.copy()
		records.append(record)

	for item in records:
		if 'data' in item:
			item['data'] = Json(item['data'])
		
		query = """
			INSERT INTO tenant_member (
				tag,
				tenant_id,
				account_id,
				data
			)
			VALUES (
				%s::uuid,
				(SELECT id FROM tenant WHERE tag = %s),
				(SELECT id FROM account WHERE tag = %s),
				%s
			)
		"""
		cur.execute(query, [
			item.get('tag'),
			item.get('tenant_tag'),
			item.get('account_tag'),
			item.get('data')
		])

def insert_tenant_member_role_data(data):
	records = []
	for name, details in data.items():
		record = details.copy()
		records.append(record)
  
	for item in records:
		if 'data' in item:
			item['data'] = Json(item['data'])
		
		query = """
			INSERT INTO tenant_member_role (
				tag,
				tenant_id,
				account_id,
				role_id,
				data
			)
			VALUES (
				%s::uuid,
				(SELECT id FROM tenant WHERE tag = %s),
				(SELECT id FROM account WHERE tag = %s),
				(SELECT id FROM tenant_role WHERE tag = %s),
				%s
			)
		"""
		cur.execute(query, [
			item.get('tag'),
			item.get('tenant_tag'),
			item.get('account_tag'),
			item.get('role_tag'),
			item.get('data')
		])

def insert_workspace_data(data):
	records = []
	for name, details in data.items():
		record = details.copy()
		records.append(record)

	for item in records:
		if 'data' in item:
			item['data'] = Json(item['data'])
		
		query = """
			INSERT INTO workspace (
				tag,
				name,
				data,
				tenant_id,
				owner_id
			)
			VALUES (
				%s::uuid,
				%s,
				%s,
				(SELECT id FROM tenant WHERE tag = %s),
				(SELECT id FROM account WHERE tag = %s)
			)
		"""
		cur.execute(query, [
			item.get('tag'),
			item.get('name'),
			item.get('data'),
			item.get('tenant_tag'),
			item.get('owner_tag')
		])

def insert_workspace_member_data(data):
	records = []
	for name, details in data.items():
		record = details.copy()
		records.append(record)

	for item in records:
		if 'data' in item:
			item['data'] = Json(item['data'])
		
		query = """
			INSERT INTO workspace_member (
				tag,
				workspace_id,
				account_id,
				granter_id,
				data
			)
			VALUES (
				%s::uuid,
				(SELECT id FROM workspace WHERE tag = %s),
				(SELECT id FROM account WHERE tag = %s),
				(SELECT id FROM account WHERE tag = %s),
				%s
			)
		"""
		cur.execute(query, [
			item.get('tag'),
			item.get('workspace_tag'),
			item.get('account_tag'),
			item.get('granter_tag'),
			item.get('data')
		])

def insert_dev_data(table, data):
	if table == 'account':
		insert_account_data(data)
	elif table == 'machine_cluster':
		insert_machine_cluster_data(data)
	elif table == 'machine':
		insert_machine_data(data)
	elif table == 'tenant':
		insert_tenant_data(data)
	elif table == 'tenant_role':
		insert_tenant_role_data(data)
	elif table == 'tenant_member':
		insert_tenant_member_data(data)
	elif table == 'tenant_member_role':
		insert_tenant_member_role_data(data)
	elif table == 'workspace':
		insert_workspace_data(data)
	elif table == 'workspace_member':
		insert_workspace_member_data(data)


def main():
	dev_data = load_json_data(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'primary_dev_seed.yaml'))

	try:
		for table, data in dev_data.items():
			print(f"[PRIMARY] Inserting dev data into table: {table}")
			insert_dev_data(table, data)

		conn.commit()
		print("[PRIMARY] Dev data seeding completed successfully.")
	except Exception as e:
		conn.rollback()
		print(f"[PRIMARY] Error seeding dev data: {e}")
		raise e
	finally:
		cur.close()
		conn.close()

if __name__ == "__main__":
	main()