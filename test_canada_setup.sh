#!/bin/bash

echo "🧪 Testing Canada Infrastructure Setup"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if containers are running
echo "📦 Checking container status..."
if docker compose ps | grep -q "Up"; then
    echo "✅ Containers are running"
else
    echo "❌ Containers are not running. Starting them..."
    docker compose up -d
    sleep 10
fi

# Test database connection
echo "🗄️ Testing database connection..."
if docker compose exec timescaledb pg_isready -U admin -d gpu_metrics; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Check if Canada tables exist
echo "🔍 Checking Canada infrastructure tables..."
TABLES=$(docker compose exec timescaledb psql -U admin -d gpu_metrics -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%canada%' OR table_name LIKE '%fiber%' OR table_name LIKE '%gas%';")

if echo "$TABLES" | grep -q "canada_power_plants"; then
    echo "✅ canada_power_plants table exists"
else
    echo "❌ canada_power_plants table missing"
fi

if echo "$TABLES" | grep -q "fiber_infrastructure"; then
    echo "✅ fiber_infrastructure table exists"
else
    echo "❌ fiber_infrastructure table missing"
fi

if echo "$TABLES" | grep -q "gas_infrastructure"; then
    echo "✅ gas_infrastructure table exists"
else
    echo "❌ gas_infrastructure table missing"
fi

# Check sample data
echo "📊 Checking sample data..."
POWER_PLANTS=$(docker compose exec timescaledb psql -U admin -d gpu_metrics -t -c "SELECT COUNT(*) FROM canada_power_plants;")
FIBER=$(docker compose exec timescaledb psql -U admin -d gpu_metrics -t -c "SELECT COUNT(*) FROM fiber_infrastructure;")
GAS=$(docker compose exec timescaledb psql -U admin -d gpu_metrics -t -c "SELECT COUNT(*) FROM gas_infrastructure;")

echo "   Power Plants: $POWER_PLANTS"
echo "   Fiber Routes: $FIBER"
echo "   Gas Pipelines: $GAS"

# Test API endpoints
echo "🌐 Testing API endpoints..."
if curl -s http://localhost:3000/api/map_data/canada_power_plants_minimal > /dev/null; then
    echo "✅ Canada power plants API endpoint working"
else
    echo "❌ Canada power plants API endpoint failed"
fi

if curl -s http://localhost:3000/api/map_data/fiber_infrastructure > /dev/null; then
    echo "✅ Fiber infrastructure API endpoint working"
else
    echo "❌ Fiber infrastructure API endpoint failed"
fi

if curl -s http://localhost:3000/api/map_data/gas_infrastructure > /dev/null; then
    echo "✅ Gas infrastructure API endpoint working"
else
    echo "❌ Gas infrastructure API endpoint failed"
fi

echo ""
echo "🎉 Setup test complete!"
echo "🌍 Access the Canada map at: http://localhost:5173/map-canada"
echo "🔌 API server at: http://localhost:3000"
