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
				return {
					id: plant.id,
					api_plant_id: plant.api_plant_id,
					entity_id: plant.entity_id,
					name: plant.name,
					county: plant.county,
					state: plant.state,
					latitude: plant.latitude,
					longitude: plant.longitude,
					plant_code: plant.plant_code,
					fuel_type: plant.fuel_type,
					prime_mover: plant.prime_mover,
					operating_status: plant.operating_status,
					nameplate_capacity_mw: plant.nameplate_capacity_mw,
					net_summer_capacity_mw: plant.net_summer_capacity_mw,
					net_winter_capacity_mw: plant.net_winter_capacity_mw,
					planned_derate_summer_cap_mw: plant.planned_derate_summer_cap_mw,
					planned_uprate_summer_cap_mw: plant.planned_uprate_summer_cap_mw,
					operating_year_month: plant.operating_year_month,
					planned_derate_year_month: plant.planned_derate_year_month,
					planned_uprate_year_month: plant.planned_uprate_year_month,
					planned_retirement_year_month: plant.planned_retirement_year_month,
					last_updated: plant.stat_timestamp || plant.plant_updated_at,
					plant_metadata: plant.plant_metadata,
					stat_metadata: plant.stat_metadata
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