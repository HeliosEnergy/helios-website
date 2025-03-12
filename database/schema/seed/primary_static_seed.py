import psycopg2
from psycopg2.extras import Json
import os
from dotenv import load_dotenv
import yaml

load_dotenv()

# Database connection
conn = psycopg2.connect(os.getenv('PRIMARY_DB_URL'))
cur = conn.cursor()

def load_json_data(file_path):
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def upsert_data(table, data):
    records = []
    for key, details in data.items():
        record = details.copy()
        record['id'] = key
        records.append(record)
    
    for item in records:
        if 'data' in item:
            item['data'] = Json(item['data'])
            
        columns = ', '.join(item.keys())
        placeholders = ', '.join(['%s'] * len(item))
        update_set = ', '.join([f"{k} = EXCLUDED.{k}" for k in item.keys()])
        
        query = f"""
        INSERT INTO {table} ({columns})
        VALUES ({placeholders})
        ON CONFLICT (id) DO UPDATE SET {update_set}
        """
        cur.execute(query, list(item.values()))

def delete_missing_items(table, existing_ids):
    query = f"DELETE FROM {table} WHERE id NOT IN %s"
    cur.execute(query, (tuple(existing_ids),))

def seed_table(table, data):
    print(f"Seeding table: {table}")
    existing_ids = [key for key in data.keys()]
    upsert_data(table, data)
    delete_missing_items(table, existing_ids)

def main():
    static_data = load_json_data(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'primary_static_seed.yaml'))

    try:
        for table, data in static_data.items():
            seed_table(table, data)

        conn.commit()
        print("Static data seeding completed successfully.")
    except Exception as e:
        conn.rollback()
        print(f"Error seeding static data: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()