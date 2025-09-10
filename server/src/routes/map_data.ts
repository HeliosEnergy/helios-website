import { Request, RequestHandler, Response } from "express";
import postgres from "postgres";

/**
 * Get power plant data with latest statistics
 * Supports filtering by fuel_type, state, operating_status, min_capacity, max_capacity,
 * min_capacity_factor, and max_capacity_factor
 */
export function httpGetPowerPlantData(sql: postgres.Sql<{}>): (request: Request, response: Response) => Promise<any> {

	return async function (request: Request, response: Response) {
		try {
			// Extract query parameters for filtering
			const { 
				fuel_type, 
				state, 
				operating_status, 
				min_capacity, 
				max_capacity,
				min_capacity_factor,
				max_capacity_factor
			} = request.query;

			// Handle state as either a single value or an array
			let statesArray: string[] | null = null;
			if (state) {
				// If state is an array, map it to strings
				if (Array.isArray(state)) {
					statesArray = state.map(s => String(s));
				} else {
					// If it's a single value, make it a one-item array
					statesArray = [String(state)];
				}
				// If the array is empty or contains only empty strings, set to null
				if (statesArray.length === 0 || (statesArray.length === 1 && !statesArray[0])) {
					statesArray = null;
				}
			}

			// Handle fuel_type as either a single value, array, or comma-separated list
			let fuelTypesArray: string[] | null = null;
			if (fuel_type) {
				const fuelTypeStr = String(fuel_type);
				// Check if it's a comma-separated list
				if (fuelTypeStr.includes(',')) {
					fuelTypesArray = fuelTypeStr.split(',').filter(f => f.trim());
				} else {
					fuelTypesArray = [fuelTypeStr];
				}
				// If the array is empty, set to null
				if (fuelTypesArray.length === 0) {
					fuelTypesArray = null;
				}
			}

			// Handle operating_status as either a single value, array, or comma-separated list
			let operatingStatusArray: string[] | null = null;
			if (operating_status) {
				const statusStr = String(operating_status);
				// Check if it's a comma-separated list
				if (statusStr.includes(',')) {
					operatingStatusArray = statusStr.split(',').filter(s => s.trim());
				} else {
					operatingStatusArray = [statusStr];
				}
				// If the array is empty, set to null
				if (operatingStatusArray.length === 0) {
					operatingStatusArray = null;
				}
			}

			// Build parameters object for the SQL query
			const params = {
				fuelTypes: fuelTypesArray,
				states: statesArray,
				operatingStatuses: operatingStatusArray,
				minCapacity: min_capacity ? parseFloat(String(min_capacity)) : null,
				maxCapacity: max_capacity ? parseFloat(String(max_capacity)) : null,
				minCapacityFactor: min_capacity_factor ? parseFloat(String(min_capacity_factor)) : null,
				maxCapacityFactor: max_capacity_factor ? parseFloat(String(max_capacity_factor)) : null
			};

			// Direct SQL query instead of using the generated function
			const queryString = `
			WITH latest_gen AS (
				SELECT DISTINCT ON (plant_id) *
				FROM eia_plant_generation
				ORDER BY plant_id, timestamp DESC
			)
			SELECT 
				p.id, 
				p.api_plant_id, 
				p.entity_id, 
				p.name, 
				p.county, 
				p.state,
				ST_X(p.location::geometry) AS longitude,
				ST_Y(p.location::geometry) AS latitude,
				p.plant_code,
				p.fuel_type,
				p.prime_mover,
				p.operating_status,
				p.metadata AS plant_metadata,
				p.created_at AS plant_created_at,
				p.updated_at AS plant_updated_at,
				g.nameplate_capacity_mw,
				g.net_summer_capacity_mw,
				g.net_winter_capacity_mw,
				s.id AS stat_id,
				s.planned_derate_summer_cap_mw,
				s.planned_uprate_summer_cap_mw,
				s.operating_year_month,
				s.planned_derate_year_month,
				s.planned_uprate_year_month,
				s.planned_retirement_year_month,
				s.source_timestamp,
				s.data_period,
				s.metadata AS stat_metadata,
				s.timestamp AS stat_timestamp,
				gen.id AS gen_id,
				gen.period AS gen_period,
				gen.generation AS gen_generation,
				gen.generation_units AS gen_generation_units,
				gen.consumption_for_eg AS gen_consumption_for_eg,
				gen.consumption_for_eg_units AS gen_consumption_for_eg_units,
				gen.total_consumption AS gen_total_consumption,
				gen.total_consumption_units AS gen_total_consumption_units,
				gen.metadata AS gen_metadata,
				gen.timestamp AS gen_timestamp,
				CASE 
					WHEN gen.generation IS NOT NULL AND g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw > 0 
					THEN (gen.generation / (g.nameplate_capacity_mw * 720)) * 100 
					ELSE NULL 
				END AS capacity_factor
			FROM eia_power_plants as p
			LEFT JOIN (
				SELECT 
					plant_id,
					SUM(nameplate_capacity_mw) AS nameplate_capacity_mw,
					SUM(net_summer_capacity_mw) AS net_summer_capacity_mw,
					SUM(net_winter_capacity_mw) AS net_winter_capacity_mw,
					MAX(updated_at) AS latest_update
				FROM eia_generators
				GROUP BY plant_id
			) AS g ON g.plant_id = p.id
			LEFT JOIN (
				SELECT DISTINCT ON (plant_id) *
				FROM eia_plant_capacity
				ORDER BY plant_id, timestamp DESC
			) as s ON s.plant_id = p.id
			LEFT JOIN latest_gen AS gen ON gen.plant_id = p.id
			WHERE 
				($1::text[] IS NULL OR p.fuel_type = ANY($1))
				AND (
					$2::text[] IS NULL 
					OR $2::text[] = '{}'::text[] 
					OR p.state = ANY($2::text[])
				)
				AND ($3::text[] IS NULL OR p.operating_status = ANY($3))
				AND (
					$4::float IS NULL 
					OR (g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw >= $4)
				)
				AND (
					$5::float IS NULL 
					OR (g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw <= $5)
				)
				AND (
					$6::float IS NULL
					OR $6 = 0
					OR (
						-- If min_capacity_factor > 0, ensure capacity factor exists and is >= min
						gen.generation IS NOT NULL 
						AND g.nameplate_capacity_mw IS NOT NULL 
						AND g.nameplate_capacity_mw > 0
						AND ((gen.generation / (g.nameplate_capacity_mw * 720)) * 100) >= $6
					)
				)
				AND (
					$7::float IS NULL
					OR (
						gen.generation IS NOT NULL 
						AND g.nameplate_capacity_mw IS NOT NULL 
						AND g.nameplate_capacity_mw > 0
						AND ((gen.generation / (g.nameplate_capacity_mw * 720)) * 100) <= $7
					)
				)
				-- Exclude NULL capacity factor records when min capacity factor is > 0
				AND (
					$6::float IS NULL 
					OR $6 = 0
					OR (
						gen.generation IS NOT NULL 
						AND g.nameplate_capacity_mw IS NOT NULL 
						AND g.nameplate_capacity_mw > 0
					)
				)`;

			// Execute the query with secure parameter binding
			const powerPlantsResult = await sql.unsafe(queryString, [
				params.fuelTypes, 
				params.states, 
				params.operatingStatuses, 
				params.minCapacity, 
				params.maxCapacity,
				params.minCapacityFactor,
				params.maxCapacityFactor
			]);
	
			// Transform the data to include geographical coordinates
			const formattedPowerPlants = [...powerPlantsResult].map((plant: any) => {
				// Extract metadata from JSON strings if they exist
				let plantMetadata = plant.plant_metadata ? 
					(typeof plant.plant_metadata === 'string' ? 
						JSON.parse(plant.plant_metadata) : plant.plant_metadata) : {};
				
				let statMetadata = plant.stat_metadata ? 
					(typeof plant.stat_metadata === 'string' ? 
						JSON.parse(plant.stat_metadata) : plant.stat_metadata) : {};
                
                let genMetadata = plant.gen_metadata ? 
					(typeof plant.gen_metadata === 'string' ? 
						JSON.parse(plant.gen_metadata) : plant.gen_metadata) : {};

				return {
					id: plant.id,
					api_plant_id: plant.api_plant_id,
					entity_id: plant.entity_id,
					name: plant.name,
					county: plant.county,
					state: plant.state,
					latitude: parseFloat(plant.latitude),
					longitude: parseFloat(plant.longitude),
					plant_code: plant.plant_code,
					fuel_type: plant.fuel_type,
					prime_mover: plant.prime_mover,
					operating_status: plant.operating_status,
					nameplate_capacity_mw: plant.nameplate_capacity_mw ? parseFloat(String(plant.nameplate_capacity_mw)) : null,
					net_summer_capacity_mw: plant.net_summer_capacity_mw ? parseFloat(String(plant.net_summer_capacity_mw)) : null,
					net_winter_capacity_mw: plant.net_winter_capacity_mw ? parseFloat(String(plant.net_winter_capacity_mw)) : null,
					planned_derate_summer_cap_mw: plant.planned_derate_summer_cap_mw,
					planned_uprate_summer_cap_mw: plant.planned_uprate_summer_cap_mw,
					operating_year_month: plant.operating_year_month,
					planned_derate_year_month: plant.planned_derate_year_month,
					planned_uprate_year_month: plant.planned_uprate_year_month,
					planned_retirement_year_month: plant.planned_retirement_year_month,
					last_updated: plant.stat_timestamp || plant.plant_updated_at,
					plant_metadata: plantMetadata,
					stat_metadata: statMetadata,
					capacity_factor: plant.capacity_factor ? parseFloat(String(plant.capacity_factor)) : null,
                    // Add generation data
                    generation: plant.gen_id ? {
                        id: plant.gen_id,
                        period: plant.gen_period,
                        generation: plant.gen_generation ? parseFloat(String(plant.gen_generation)) : null,
                        generation_units: plant.gen_generation_units,
                        consumption_for_eg: plant.gen_consumption_for_eg ? parseFloat(String(plant.gen_consumption_for_eg)) : null,
                        consumption_for_eg_units: plant.gen_consumption_for_eg_units,
                        total_consumption: plant.gen_total_consumption ? parseFloat(String(plant.gen_total_consumption)) : null,
                        total_consumption_units: plant.gen_total_consumption_units,
                        timestamp: plant.gen_timestamp,
                        metadata: plant.gen_metadata
                    } : null
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

/**
 * Get minimal power plant data with only essential fields
 * Supports the same filtering as the full endpoint
 */
export function httpGetMinimalPowerPlantData(sql: postgres.Sql<{}>): (request: Request, response: Response) => Promise<any> {
	return async function (request: Request, response: Response) {
		try {
			// Reuse the same query parameter extraction logic
			const { 
				fuel_type, 
				state, 
				operating_status, 
				min_capacity, 
				max_capacity,
				min_capacity_factor,
				max_capacity_factor
			} = request.query;

			// Handle state as either a single value or an array
			let statesArray: string[] | null = null;
			if (state) {
				// If state is an array, map it to strings
				if (Array.isArray(state)) {
					statesArray = state.map(s => String(s));
				} else {
					// If it's a single value, make it a one-item array
					statesArray = [String(state)];
				}
				// If the array is empty or contains only empty strings, set to null
				if (statesArray.length === 0 || (statesArray.length === 1 && !statesArray[0])) {
					statesArray = null;
				}
			}

			// Handle fuel_type as either a single value, array, or comma-separated list
			let fuelTypesArray: string[] | null = null;
			if (fuel_type) {
				const fuelTypeStr = String(fuel_type);
				// Check if it's a comma-separated list
				if (fuelTypeStr.includes(',')) {
					fuelTypesArray = fuelTypeStr.split(',').filter(f => f.trim());
				} else {
					fuelTypesArray = [fuelTypeStr];
				}
				// If the array is empty, set to null
				if (fuelTypesArray.length === 0) {
					fuelTypesArray = null;
				}
			}

			// Handle operating_status as either a single value, array, or comma-separated list
			let operatingStatusArray: string[] | null = null;
			if (operating_status) {
				const statusStr = String(operating_status);
				// Check if it's a comma-separated list
				if (statusStr.includes(',')) {
					operatingStatusArray = statusStr.split(',').filter(s => s.trim());
				} else {
					operatingStatusArray = [statusStr];
				}
				// If the array is empty, set to null
				if (operatingStatusArray.length === 0) {
					operatingStatusArray = null;
				}
			}

			const params = {
				fuelTypes: fuelTypesArray,
				states: statesArray,
				operatingStatuses: operatingStatusArray,
				minCapacity: min_capacity ? parseFloat(String(min_capacity)) : null,
				maxCapacity: max_capacity ? parseFloat(String(max_capacity)) : null,
				minCapacityFactor: min_capacity_factor ? parseFloat(String(min_capacity_factor)) : null,
				maxCapacityFactor: max_capacity_factor ? parseFloat(String(max_capacity_factor)) : null
			};

			// Simplified SQL query with only essential fields
			const queryString = `
			WITH latest_gen AS (
				SELECT DISTINCT ON (plant_id) *
				FROM eia_plant_generation
				ORDER BY plant_id, timestamp DESC
			)
			SELECT 
				p.id,
				p.fuel_type,
				p.operating_status,
				ST_X(p.location::geometry) AS longitude,
				ST_Y(p.location::geometry) AS latitude,
				g.nameplate_capacity_mw,
				gen.generation AS gen_generation,
				CASE 
					WHEN gen.generation IS NOT NULL AND g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw > 0 
					THEN (gen.generation / (g.nameplate_capacity_mw * 720)) * 100 
					ELSE NULL 
				END AS capacity_factor
			FROM eia_power_plants as p
			LEFT JOIN (
				SELECT 
					plant_id,
					SUM(nameplate_capacity_mw) AS nameplate_capacity_mw
				FROM eia_generators
				GROUP BY plant_id
			) AS g ON g.plant_id = p.id
			LEFT JOIN latest_gen AS gen ON gen.plant_id = p.id
			WHERE 
				($1::text[] IS NULL OR p.fuel_type = ANY($1))
				AND ($2::text[] IS NULL OR $2::text[] = '{}'::text[] OR p.state = ANY($2::text[]))
				AND ($3::text[] IS NULL OR p.operating_status = ANY($3))
				AND ($4::float IS NULL OR (g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw >= $4))
				AND ($5::float IS NULL OR (g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw <= $5))
				AND ($6::float IS NULL OR $6 = 0 OR (
					gen.generation IS NOT NULL 
					AND g.nameplate_capacity_mw IS NOT NULL 
					AND g.nameplate_capacity_mw > 0
					AND ((gen.generation / (g.nameplate_capacity_mw * 720)) * 100) >= $6
				))
				AND ($7::float IS NULL OR (
					gen.generation IS NOT NULL 
					AND g.nameplate_capacity_mw IS NOT NULL 
					AND g.nameplate_capacity_mw > 0
					AND ((gen.generation / (g.nameplate_capacity_mw * 720)) * 100) <= $7
				))`;

			const powerPlantsResult = await sql.unsafe(queryString, [
				params.fuelTypes, 
				params.states, 
				params.operatingStatuses, 
				params.minCapacity, 
				params.maxCapacity,
				params.minCapacityFactor,
				params.maxCapacityFactor
			]);

			// Transform to array format
			const formattedPowerPlants = [...powerPlantsResult].map((plant: any) => [
				plant.id,
				plant.fuel_type,
				plant.operating_status,
				parseFloat(plant.latitude),
				parseFloat(plant.longitude),
				plant.nameplate_capacity_mw ? parseFloat(String(plant.nameplate_capacity_mw)) : null,
				plant.gen_generation ? parseFloat(String(plant.gen_generation)) : null,
				plant.capacity_factor ? parseFloat(String(plant.capacity_factor)) : null
			]);

			return response.json({
				success: true,
				data: formattedPowerPlants
			});
		} catch (error) {
			console.error("Error fetching minimal power plant data:", error);
			return response.status(500).json({
				success: false,
				error: "Failed to fetch power plant data"
			});
		}
	}
}

/**
 * Get full power plant data for a specific plant ID
 */
export function httpGetPowerPlantDataById(sql: postgres.Sql<{}>): (request: Request, response: Response) => Promise<any> {
	return async function (request: Request, response: Response) {
		try {
			const { id } = request.params;

			if (!id) {
				return response.status(400).json({
					success: false,
					error: "Plant ID is required"
				});
			}

			const queryString = `
			WITH latest_gen AS (
				SELECT DISTINCT ON (plant_id) *
				FROM eia_plant_generation
				ORDER BY plant_id, timestamp DESC
			)
			SELECT 
				p.id, 
				p.api_plant_id, 
				p.entity_id, 
				p.name, 
				p.county, 
				p.state,
				ST_X(p.location::geometry) AS longitude,
				ST_Y(p.location::geometry) AS latitude,
				p.plant_code,
				p.fuel_type,
				p.prime_mover,
				p.operating_status,
				p.metadata AS plant_metadata,
				p.created_at AS plant_created_at,
				p.updated_at AS plant_updated_at,
				g.nameplate_capacity_mw,
				g.net_summer_capacity_mw,
				g.net_winter_capacity_mw,
				s.id AS stat_id,
				s.planned_derate_summer_cap_mw,
				s.planned_uprate_summer_cap_mw,
				s.operating_year_month,
				s.planned_derate_year_month,
				s.planned_uprate_year_month,
				s.planned_retirement_year_month,
				s.source_timestamp,
				s.data_period,
				s.metadata AS stat_metadata,
				s.timestamp AS stat_timestamp,
				gen.id AS gen_id,
				gen.period AS gen_period,
				gen.generation AS gen_generation,
				gen.generation_units AS gen_generation_units,
				gen.consumption_for_eg AS gen_consumption_for_eg,
				gen.consumption_for_eg_units AS gen_consumption_for_eg_units,
				gen.total_consumption AS gen_total_consumption,
				gen.total_consumption_units AS gen_total_consumption_units,
				gen.metadata AS gen_metadata,
				gen.timestamp AS gen_timestamp,
				CASE 
					WHEN gen.generation IS NOT NULL AND g.nameplate_capacity_mw IS NOT NULL AND g.nameplate_capacity_mw > 0 
					THEN (gen.generation / (g.nameplate_capacity_mw * 720)) * 100 
					ELSE NULL 
				END AS capacity_factor
			FROM eia_power_plants as p
			LEFT JOIN (
				SELECT 
					plant_id,
					SUM(nameplate_capacity_mw) AS nameplate_capacity_mw,
					SUM(net_summer_capacity_mw) AS net_summer_capacity_mw,
					SUM(net_winter_capacity_mw) AS net_winter_capacity_mw,
					MAX(updated_at) AS latest_update
				FROM eia_generators
				GROUP BY plant_id
			) AS g ON g.plant_id = p.id
			LEFT JOIN (
				SELECT DISTINCT ON (plant_id) *
				FROM eia_plant_capacity
				ORDER BY plant_id, timestamp DESC
			) as s ON s.plant_id = p.id
			LEFT JOIN latest_gen AS gen ON gen.plant_id = p.id
			WHERE p.id = $1`;

			const powerPlantsResult = await sql.unsafe(queryString, [id]);

			if (powerPlantsResult.length === 0) {
				return response.status(404).json({
					success: false,
					error: "Power plant not found"
				});
			}

			const plant = powerPlantsResult[0];

			// Extract metadata from JSON strings if they exist
			let plantMetadata = plant.plant_metadata ? 
				(typeof plant.plant_metadata === 'string' ? 
					JSON.parse(plant.plant_metadata) : plant.plant_metadata) : {};
			
			let statMetadata = plant.stat_metadata ? 
				(typeof plant.stat_metadata === 'string' ? 
					JSON.parse(plant.stat_metadata) : plant.stat_metadata) : {};
			
			let genMetadata = plant.gen_metadata ? 
				(typeof plant.gen_metadata === 'string' ? 
					JSON.parse(plant.gen_metadata) : plant.gen_metadata) : {};

			const formattedPlant = {
				id: plant.id,
				api_plant_id: plant.api_plant_id,
				entity_id: plant.entity_id,
				name: plant.name,
				county: plant.county,
				state: plant.state,
				latitude: parseFloat(plant.latitude),
				longitude: parseFloat(plant.longitude),
				plant_code: plant.plant_code,
				fuel_type: plant.fuel_type,
				prime_mover: plant.prime_mover,
				operating_status: plant.operating_status,
				nameplate_capacity_mw: plant.nameplate_capacity_mw ? parseFloat(String(plant.nameplate_capacity_mw)) : null,
				net_summer_capacity_mw: plant.net_summer_capacity_mw ? parseFloat(String(plant.net_summer_capacity_mw)) : null,
				net_winter_capacity_mw: plant.net_winter_capacity_mw ? parseFloat(String(plant.net_winter_capacity_mw)) : null,
				planned_derate_summer_cap_mw: plant.planned_derate_summer_cap_mw,
				planned_uprate_summer_cap_mw: plant.planned_uprate_summer_cap_mw,
				operating_year_month: plant.operating_year_month,
				planned_derate_year_month: plant.planned_derate_year_month,
				planned_uprate_year_month: plant.planned_uprate_year_month,
				planned_retirement_year_month: plant.planned_retirement_year_month,
				last_updated: plant.stat_timestamp || plant.plant_updated_at,
				plant_metadata: plantMetadata,
				stat_metadata: statMetadata,
				capacity_factor: plant.capacity_factor ? parseFloat(String(plant.capacity_factor)) : null,
				generation: plant.gen_id ? {
					id: plant.gen_id,
					period: plant.gen_period,
					generation: plant.gen_generation ? parseFloat(String(plant.gen_generation)) : null,
					generation_units: plant.gen_generation_units,
					consumption_for_eg: plant.gen_consumption_for_eg ? parseFloat(String(plant.gen_consumption_for_eg)) : null,
					consumption_for_eg_units: plant.gen_consumption_for_eg_units,
					total_consumption: plant.gen_total_consumption ? parseFloat(String(plant.gen_total_consumption)) : null,
					total_consumption_units: plant.gen_total_consumption_units,
					timestamp: plant.gen_timestamp,
					metadata: genMetadata
				} : null
			};

			return response.json({
				success: true,
				data: formattedPlant
			});
		} catch (error) {
			console.error("Error fetching power plant by ID:", error);
			return response.status(500).json({
				success: false,
				error: "Failed to fetch power plant data"
			});
		}
	}
}

/**
 * Get Canada power plant data
 */
export function httpGetCanadaPowerPlants(sql: postgres.Sql<{}>): (request: Request, response: Response) => Promise<any> {
	return async function (request: Request, response: Response) {
		try {
			const result = await sql`
				SELECT 
					id,
					openinframap_id,
					name,
					operator,
					output_mw,
					fuel_type,
					province,
					latitude,
					longitude,
					metadata
				FROM canada_power_plants
				ORDER BY name
			`;

			return response.json({
				success: true,
				data: result
			});
		} catch (error) {
			console.error("Error fetching Canada power plants:", error);
			return response.status(500).json({
				success: false,
				error: "Failed to fetch Canada power plant data"
			});
		}
	}
}

/**
 * Get minimal Canada power plant data with only essential fields
 */
export function httpGetMinimalCanadaPowerPlantData(sql: postgres.Sql<{}>): (request: Request, response: Response) => Promise<any> {
	return async function (request: Request, response: Response) {
		try {
			// Extract query parameters for filtering
			const { 
				fuel_type, 
				province, 
				min_capacity, 
				max_capacity
			} = request.query;

			// Handle province as either a single value or an array
			let provincesArray: string[] | null = null;
			if (province) {
				// If province is an array, map it to strings
				if (Array.isArray(province)) {
					provincesArray = province.map(s => String(s));
				} else {
					// If it's a single value, make it a one-item array
					provincesArray = [String(province)];
				}
				// If the array is empty or contains only empty strings, set to null
				if (provincesArray.length === 0 || (provincesArray.length === 1 && !provincesArray[0])) {
					provincesArray = null;
				}
			}

			// Handle fuel_type as either a single value, array, or comma-separated list
			let fuelTypesArray: string[] | null = null;
			if (fuel_type) {
				const fuelTypeStr = String(fuel_type);
				// Check if it's a comma-separated list
				if (fuelTypeStr.includes(',')) {
					fuelTypesArray = fuelTypeStr.split(',').filter(f => f.trim());
				} else {
					fuelTypesArray = [fuelTypeStr];
				}
				// If the array is empty, set to null
				if (fuelTypesArray.length === 0) {
					fuelTypesArray = null;
				}
			}

			const params = {
				fuelTypes: fuelTypesArray,
				provinces: provincesArray,
				minCapacity: min_capacity ? parseFloat(String(min_capacity)) : null,
				maxCapacity: max_capacity ? parseFloat(String(max_capacity)) : null
			};

			// Simplified SQL query with only essential fields
			const queryString = `
			SELECT 
				id,
				fuel_type,
				'OP' as operating_status,
				latitude,
				longitude,
				output_mw as nameplate_capacity_mw,
				NULL as generation,
				NULL as capacity_factor
			FROM canada_power_plants
			WHERE 
				($1::text[] IS NULL OR fuel_type = ANY($1))
				AND ($2::text[] IS NULL OR $2::text[] = '{}'::text[] OR province = ANY($2::text[]))
				AND ($3::float IS NULL OR (output_mw IS NOT NULL AND output_mw >= $3))
				AND ($4::float IS NULL OR (output_mw IS NOT NULL AND output_mw <= $4))`;

			const powerPlantsResult = await sql.unsafe(queryString, [
				params.fuelTypes, 
				params.provinces, 
				params.minCapacity, 
				params.maxCapacity
			]);

			// Transform to array format
			const formattedPowerPlants = [...powerPlantsResult].map((plant: any) => [
				plant.id,
				plant.fuel_type,
				plant.operating_status,
				parseFloat(plant.latitude),
				parseFloat(plant.longitude),
				plant.nameplate_capacity_mw ? parseFloat(String(plant.nameplate_capacity_mw)) : null,
				plant.generation ? parseFloat(String(plant.generation)) : null,
				plant.capacity_factor ? parseFloat(String(plant.capacity_factor)) : null
			]);

			return response.json({
				success: true,
				data: formattedPowerPlants
			});
		} catch (error) {
			console.error("Error fetching minimal Canada power plant data:", error);
			return response.status(500).json({
				success: false,
				error: "Failed to fetch Canada power plant data"
			});
		}
	}
}

/**
 * Get Canada fiber infrastructure data
 */
export function httpGetCanadaFiberInfrastructure(sql: postgres.Sql<{}>): (request: Request, response: Response) => Promise<any> {
	return async function (request: Request, response: Response) {
		try {
			const result = await sql`
				SELECT 
					id,
					itu_id,
					name,
					cable_type,
					capacity_gbps,
					operator,
					status,
					geometry,
					metadata
				FROM fiber_infrastructure
				ORDER BY name
			`;

			return response.json({
				success: true,
				data: result
			});
		} catch (error) {
			console.error("Error fetching Canada fiber infrastructure:", error);
			return response.status(500).json({
				success: false,
				error: "Failed to fetch Canada fiber infrastructure data"
			});
		}
	}
}

/**
 * Get Canada gas infrastructure data
 */
export function httpGetCanadaGasInfrastructure(sql: postgres.Sql<{}>): (request: Request, response: Response) => Promise<any> {
	return async function (request: Request, response: Response) {
		try {
			const result = await sql`
				SELECT 
					id,
					cer_id,
					name,
					pipeline_type,
					capacity_mmcfd,
					operator,
					status,
					geometry,
					metadata
				FROM gas_infrastructure
				ORDER BY name
			`;

			return response.json({
				success: true,
				data: result
			});
		} catch (error) {
			console.error("Error fetching Canada gas infrastructure:", error);
			return response.status(500).json({
				success: false,
				error: "Failed to fetch Canada gas infrastructure data"
			});
		}
	}
}