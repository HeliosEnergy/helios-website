import AdmZip from "adm-zip"
import fs from "fs"
import { customAlphabet, nanoid } from 'nanoid'

export const CUSTOM_ALPHABET = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10)
export const EIA_MANIFEST_FILE = "https://www.eia.gov/opendata/bulk/manifest.txt"
export const EIA_BULK_FILE_ELEC = "https://www.eia.gov/opendata/bulk/ELEC.zip"
export const EIA_BULK_FILE_ELEC_TOTAL = "https://www.eia.gov/opendata/bulk/TOTAL.zip"

export type EIAManifestData = {
	name: string;
	size: number;
	modified: string;
}

export type EIAElectricityData = {
	date: string;
	value: number;
}


