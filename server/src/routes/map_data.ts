import { Request, RequestHandler, Response } from "express";
import {
	getAllPowerPlantsWithLatestStats
} from "@helios/analysis_db/schema/analysis_db/query_sql.js";
import postgres from "postgres";

/**
 * Get power plant data with latest statistics
 * Supports filtering by fuel_type, state, operating_status, min_capacity, and max_capacity
 */
export async function httpGetPowerPlantData(sql: postgres.Sql<{}>): Promise<(request: Request, response: Response) => Promise<any>> {

	return async function (request: Request, response: Response) {
		try {
			// Extract query parameters for filtering
			const { 
				fuel_type, 
				state, 
				operating_status, 
				min_capacity, 
				max_capacity 
			} = request.query;

			// Build parameters object for the SQL query
			const params = {
				fuel_type: fuel_type ? String(fuel_type) : null,
				state: state ? String(state) : null,
				operating_status: operating_status ? String(operating_status) : null,
				min_capacity: min_capacity ? parseFloat(String(min_capacity)) : null,
				max_capacity: max_capacity ? parseFloat(String(max_capacity)) : null
			};

			// Execute the query
			const powerPlants = await getAllPowerPlantsWithLatestStats(sql, {
				fuelType: params.fuel_type,
				state: params.state,
				operatingStatus: params.operating_status,
				minCapacity: params.min_capacity,
				maxCapacity: params.max_capacity
			});

			// Transform the data to include geographical coordinates
			const formattedPowerPlants = powerPlants.map((plant: any) => {
				// Extract metadata from JSON strings if they exist
				let plantMetadata = plant.plant_metadata ? 
					(typeof plant.plant_metadata === 'string' ? 
						JSON.parse(plant.plant_metadata) : plant.plant_metadata) : {};
				
				let statMetadata = plant.stat_metadata ? 
					(typeof plant.stat_metadata === 'string' ? 
						JSON.parse(plant.stat_metadata) : plant.stat_metadata) : {};
/* 

				console.log("CAPACITY:", JSON.stringify(plant, null, 2)); */
					
				return {
					id: plant.id,
					api_plant_id: plant.apiPlantId,
					entity_id: plant.entityId,
					name: plant.name,
					county: plant.county,
					state: plant.state,
					latitude: parseFloat(plant.latitude),
					longitude: parseFloat(plant.longitude),
					plant_code: plant.plantCode,
					fuel_type: plant.fuelType,
					prime_mover: plant.primeMover,
					operating_status: plant.operatingStatus,
					nameplate_capacity_mw: plant.nameplateCapacityMw ? parseFloat(String(plant.nameplateCapacityMw)) : null,
					net_summer_capacity_mw: plant.netSummerCapacityMw ? parseFloat(String(plant.netSummerCapacityMw)) : null,
					net_winter_capacity_mw: plant.netWinterCapacityMw ? parseFloat(String(plant.netWinterCapacityMw)) : null,
					planned_derate_summer_cap_mw: plant.plannedDerateSummerCapMw,
					planned_uprate_summer_cap_mw: plant.plannedUprateSummerCapMw,
					operating_year_month: plant.operatingYearMonth,
					planned_derate_year_month: plant.plannedDerateYearMonth,
					planned_uprate_year_month: plant.plannedUprateYearMonth,
					planned_retirement_year_month: plant.plannedRetirementYearMonth,
					last_updated: plant.statTimestamp || plant.plantUpdatedAt,
					plant_metadata: plantMetadata,
					stat_metadata: statMetadata
				};
			});

			return response.json({
				success: true,
				data: formattedPowerPlants
			});
		} catch (error) {
			console.error("Error fetching power plant data:", error);
			return response.status(500).json({
				success: false,
				error: "Failed to fetch power plant data"
			});
		}
	}
}