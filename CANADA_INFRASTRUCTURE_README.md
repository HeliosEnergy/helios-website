# 🇨🇦 Canada Infrastructure Map Implementation

This document describes the Canada infrastructure map that has been implemented following the exact same pattern as the existing US map.

## 🏗️ **Architecture Overview**

The Canada infrastructure map follows the **identical architecture** as the US map:

- **Database**: PostgreSQL with PostGIS extensions
- **Backend**: Node.js/Express with TypeScript
- **Frontend**: React with Leaflet.js
- **Data Sources**: OpenInfraMap (Power Plants), ITU BBmaps (Fiber), CER (Gas)

## 📊 **Database Schema**

### Tables Created

1. **`canada_power_plants`** - Canadian power generation facilities
   - `openinframap_id`: Unique identifier from OpenInfraMap
   - `name`: Plant name
   - `operator`: Operating company
   - `output_mw`: Generation capacity in megawatts
   - `fuel_type`: Energy source (nuclear, hydro, wind, etc.)
   - `province`: Canadian province/territory
   - `location`: Geographic coordinates (PostGIS Point)
   - `metadata`: Additional JSON data

2. **`fiber_infrastructure`** - Fiber optic cable networks
   - `itu_id`: Unique identifier from ITU BBmaps
   - `name`: Cable/route name
   - `cable_type`: Submarine or terrestrial
   - `capacity_gbps`: Data capacity in gigabits per second
   - `operator`: Network operator
   - `status`: Operational status
   - `geometry`: Geographic route (PostGIS LineString)
   - `metadata`: Additional JSON data

3. **`gas_infrastructure`** - Natural gas pipeline networks
   - `cer_id`: Unique identifier from Canadian Energy Regulator
   - `name`: Pipeline name
   - `pipeline_type`: Transmission or distribution
   - `capacity_mmcfd`: Gas capacity in million cubic feet per day
   - `operator`: Pipeline operator
   - `status`: Operational status
   - `geometry`: Geographic route (PostGIS LineString)
   - `metadata`: Additional JSON data

## 🚀 **Quick Start**

### 1. **Setup Environment**
```bash
# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. **Run Complete Setup**
```bash
# This will do everything: volumes, containers, migrations, seeding, dependencies
task setup-and-run
```

### 3. **Access the Map**
- **Canada Map**: http://localhost:5173/map-canada
- **US Map**: http://localhost:5173/map
- **API Server**: http://localhost:3000

## 🛠️ **Available Tasks**

### **Setup Tasks**
```bash
task setup              # Complete setup (volumes, containers, migrations, seeding, deps)
task setup-and-run      # Setup + start frontend/backend services
task init-volumes       # Initialize Docker volumes only
```

### **Database Tasks**
```bash
task goose-up           # Run database migrations
task goose-down         # Rollback database migrations
task seed-canada        # Seed with sample Canada infrastructure data
```

### **Service Management**
```bash
task start              # Start all services
task stop               # Stop all services
task restart            # Restart all services
task logs               # View service logs
task clean              # Clean up everything
```

## 🧪 **Testing the Setup**

### **Run Test Script**
```bash
./test_canada_setup.sh
```

This script will:
- Check Docker container status
- Verify database connectivity
- Confirm table creation
- Validate sample data
- Test API endpoints

### **Manual Testing**
```bash
# Check if tables exist
docker compose exec timescaledb psql -U admin -d gpu_metrics -c "\dt"

# View sample data
docker compose exec timescaledb psql -U admin -d gpu_metrics -c "SELECT * FROM canada_power_plants LIMIT 5;"

# Test API endpoints
curl http://localhost:3000/api/map_data/canada_power_plants_minimal
curl http://localhost:3000/api/map_data/fiber_infrastructure
curl http://localhost:3000/api/map_data/gas_infrastructure
```

## 🌍 **Map Features**

### **Power Plants**
- **Color Coding**: By fuel type (nuclear, hydro, wind, gas, coal)
- **Size**: Proportional to generation capacity
- **Popups**: Detailed plant information on click
- **Filtering**: By province, fuel type, capacity range

### **Fiber Infrastructure**
- **Submarine Cables**: Cyan lines for undersea routes
- **Terrestrial Routes**: Magenta lines for land-based networks
- **Popups**: Capacity, operator, and status information
- **Filtering**: By cable type, operator, status

### **Gas Infrastructure**
- **Transmission Lines**: Orange lines for high-capacity pipelines
- **Distribution Networks**: Red lines for local distribution
- **Popups**: Capacity, operator, and pipeline details
- **Filtering**: By pipeline type, operator, status

## 🔌 **API Endpoints**

### **Canada Power Plants**
```
GET /api/map_data/canada_power_plants
GET /api/map_data/canada_power_plants_minimal
GET /api/map_data/canada_power_plant/:id
```

**Query Parameters:**
- `province`: Filter by Canadian province
- `fuel_type`: Filter by energy source
- `min_capacity`: Minimum capacity in MW
- `max_capacity`: Maximum capacity in MW

### **Fiber Infrastructure**
```
GET /api/map_data/fiber_infrastructure
```

**Query Parameters:**
- `cable_type`: Filter by submarine/terrestrial
- `operator`: Filter by network operator
- `status`: Filter by operational status

### **Gas Infrastructure**
```
GET /api/map_data/gas_infrastructure
```

**Query Parameters:**
- `pipeline_type`: Filter by transmission/distribution
- `operator`: Filter by pipeline operator
- `status`: Filter by operational status

## 📁 **File Structure**

```
├── database/
│   ├── schema/
│   │   ├── migrations/
│   │   │   └── 20250101000000_canada_infrastructure.sql
│   │   └── seed/
│   │       └── seed_canada_data.sql
├── server/
│   └── src/
│       ├── routes/
│       │   ├── map_data.ts          # Canada API endpoints
│       │   └── routes.ts            # Route registration
├── frontend/
│   └── src/
│       └── pages/
│           └── map/
│               ├── MapCanadaPage.tsx # Canada map component
│               └── routes.tsx        # Frontend routing
├── docker-compose.yml                # Updated with Canada support
├── Taskfile.yml                      # Updated with Canada tasks
└── test_canada_setup.sh             # Setup verification script
```

## 🔄 **Data Integration**

### **Current Status**
- ✅ **Database Schema**: Complete
- ✅ **API Endpoints**: Complete
- ✅ **Frontend Component**: Complete
- ✅ **Sample Data**: Included for testing
- 🔄 **Real Data Scraping**: Ready for implementation

### **Next Steps for Real Data**
1. **Create scraping scripts** for OpenInfraMap and ITU BBmaps
2. **Implement data collection** from real sources
3. **Set up automated updates** to keep data current
4. **Enhance filtering** with more granular options

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Docker Build Failures**
   ```bash
   # Clean up and retry
   task clean
   task setup
   ```

2. **Database Connection Issues**
   ```bash
   # Check container status
   docker compose ps
   
   # View database logs
   docker compose logs timescaledb
   ```

3. **Migration Errors**
   ```bash
   # Reset migrations
   task goose-down
   task goose-up
   ```

4. **API Endpoint Failures**
   ```bash
   # Check server logs
   docker compose logs app
   
   # Verify routes are registered
   curl http://localhost:3000/api/map_data/
   ```

### **Logs and Debugging**
```bash
# View all service logs
task logs

# View specific service logs
docker compose logs -f app
docker compose logs -f timescaledb

# Access database directly
docker compose exec timescaledb psql -U admin -d gpu_metrics
```

## 📚 **Additional Resources**

- **OpenInfraMap**: https://openinframap.org/stats/area/Canada/plants
- **ITU BBmaps**: https://bbmaps.itu.int/bbmaps/
- **Canadian Energy Regulator**: https://www.cer-rec.gc.ca/
- **PostGIS Documentation**: https://postgis.net/documentation/
- **Leaflet.js Documentation**: https://leafletjs.com/reference.html

## 🎯 **Summary**

The Canada infrastructure map is now **fully implemented** and follows the **exact same pattern** as your US map:

- ✅ **Identical Architecture**: Same database, backend, and frontend patterns
- ✅ **Complete API**: All endpoints for power plants, fiber, and gas
- ✅ **Interactive Map**: Leaflet-based visualization with filtering
- ✅ **Sample Data**: Ready for testing and development
- ✅ **Easy Setup**: One-command setup with Taskfile
- ✅ **Production Ready**: Docker-based deployment

**Ready to use immediately** with `task setup-and-run`! 🚀
