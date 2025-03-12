import { Sql } from "postgres";

export const getTenantQuery = `-- name: GetTenant :one
SELECT id, tag, name, description, data, created_at, updated_at, deleted_at FROM tenant
WHERE id = $1 LIMIT 1`;

export interface GetTenantArgs {
    id: string;
}

export interface GetTenantRow {
    id: string;
    tag: string;
    name: string;
    description: string;
    data: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export async function getTenant(sql: Sql, args: GetTenantArgs): Promise<GetTenantRow | null> {
    const rows = await sql.unsafe(getTenantQuery, [args.id]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        tag: row[1],
        name: row[2],
        description: row[3],
        data: row[4],
        createdAt: row[5],
        updatedAt: row[6],
        deletedAt: row[7]
    };
}

export const listTenantsQuery = `-- name: ListTenants :many
SELECT id, tag, name, description, data, created_at, updated_at, deleted_at FROM tenant
ORDER BY name`;

export interface ListTenantsRow {
    id: string;
    tag: string;
    name: string;
    description: string;
    data: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export async function listTenants(sql: Sql): Promise<ListTenantsRow[]> {
    return (await sql.unsafe(listTenantsQuery, []).values()).map(row => ({
        id: row[0],
        tag: row[1],
        name: row[2],
        description: row[3],
        data: row[4],
        createdAt: row[5],
        updatedAt: row[6],
        deletedAt: row[7]
    }));
}

export const updateTenantQuery = `-- name: UpdateTenant :exec


DELETE FROM tenant
WHERE id = $1`;

export interface UpdateTenantArgs {
    id: string;
}

export async function updateTenant(sql: Sql, args: UpdateTenantArgs): Promise<void> {
    await sql.unsafe(updateTenantQuery, [args.id]);
}

export const getUserByEmailQuery = `-- name: GetUserByEmail :one
SELECT id, tag, account_type, name, email, password, data, created_at, updated_at, deleted_at
FROM account
WHERE email = $1
LIMIT 1`;

export interface GetUserByEmailArgs {
    email: string;
}

export interface GetUserByEmailRow {
    id: string;
    tag: string;
    accountType: string;
    name: string;
    email: string;
    password: string | null;
    data: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export async function getUserByEmail(sql: Sql, args: GetUserByEmailArgs): Promise<GetUserByEmailRow | null> {
    const rows = await sql.unsafe(getUserByEmailQuery, [args.email]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        tag: row[1],
        accountType: row[2],
        name: row[3],
        email: row[4],
        password: row[5],
        data: row[6],
        createdAt: row[7],
        updatedAt: row[8],
        deletedAt: row[9]
    };
}

export const getUserByTagQuery = `-- name: GetUserByTag :one
SELECT id, tag, account_type, name, email, password, data, created_at, updated_at, deleted_at
FROM account
WHERE tag = $1
LIMIT 1`;

export interface GetUserByTagArgs {
    tag: string;
}

export interface GetUserByTagRow {
    id: string;
    tag: string;
    accountType: string;
    name: string;
    email: string;
    password: string | null;
    data: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export async function getUserByTag(sql: Sql, args: GetUserByTagArgs): Promise<GetUserByTagRow | null> {
    const rows = await sql.unsafe(getUserByTagQuery, [args.tag]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        tag: row[1],
        accountType: row[2],
        name: row[3],
        email: row[4],
        password: row[5],
        data: row[6],
        createdAt: row[7],
        updatedAt: row[8],
        deletedAt: row[9]
    };
}

export const createUserQuery = `-- name: CreateUser :one
INSERT INTO account (
	account_type,
	name,
	email,
	password
) VALUES (
	$1,
	$2,
	$3,
	$4
)
RETURNING id, tag, account_type, name, email, password, data, created_at, updated_at, deleted_at`;

export interface CreateUserArgs {
    accountType: string;
    name: string;
    email: string;
    password: string | null;
}

export interface CreateUserRow {
    id: string;
    tag: string;
    accountType: string;
    name: string;
    email: string;
    password: string | null;
    data: any;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export async function createUser(sql: Sql, args: CreateUserArgs): Promise<CreateUserRow | null> {
    const rows = await sql.unsafe(createUserQuery, [args.accountType, args.name, args.email, args.password]).values();
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        tag: row[1],
        accountType: row[2],
        name: row[3],
        email: row[4],
        password: row[5],
        data: row[6],
        createdAt: row[7],
        updatedAt: row[8],
        deletedAt: row[9]
    };
}

